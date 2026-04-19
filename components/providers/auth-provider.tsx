"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  clearStoredTokens,
  decodeAuthToken,
  getStoredTokens,
  setStoredTokens,
} from "@/lib/auth-storage";
import { login as loginRequest, register as registerRequest } from "@/lib/api";

interface AuthSession {
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
  email: string;
  isFirstAccess: boolean;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  markOnboardingCompleted: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function subscribeNoop(): () => void {
  return () => {};
}

function buildSession(token: string, refreshToken: string, isFirstAccessFromApi?: boolean): AuthSession | null {
  const decoded = decodeAuthToken(token);
  if (!decoded?.sub) {
    return null;
  }

  const tokenIsFirstAccess =
    typeof decoded.isFirstAccess === "boolean"
      ? decoded.isFirstAccess
      : typeof decoded.isFirstAccess === "string"
        ? decoded.isFirstAccess.toLowerCase() === "true"
        : undefined;

  return {
    token,
    refreshToken,
    userId: decoded.sub,
    name: decoded.name ?? "Usuário",
    email: decoded.email ?? "",
    isFirstAccess: isFirstAccessFromApi ?? tokenIsFirstAccess ?? false,
  };
}

function readSessionFromStorage(): AuthSession | null {
  const stored = getStoredTokens();
  if (!stored?.token || !stored.refreshToken) {
    return null;
  }

  const restored = buildSession(stored.token, stored.refreshToken, stored.isFirstAccess);
  if (!restored) {
    clearStoredTokens();
    return null;
  }

  return restored;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionState, setSessionState] = useState<AuthSession | null>(null);
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const restoredSession = useMemo(
    () => (isClient ? readSessionFromStorage() : null),
    [isClient]
  );

  const session = sessionState ?? restoredSession;
  const isLoading = !isClient;

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest({ email, password });

    setStoredTokens({
      token: response.token,
      refreshToken: response.refreshToken,
      isFirstAccess: response.isFirstAccess,
    });

    const nextSession = buildSession(response.token, response.refreshToken, response.isFirstAccess);

    if (!nextSession) {
      clearStoredTokens();
      throw new Error("Token inválido retornado pela API.");
    }

    setSessionState(nextSession);
  }, []);

  const markOnboardingCompleted = useCallback(() => {
    const currentTokens = getStoredTokens();
    if (currentTokens?.token && currentTokens.refreshToken) {
      setStoredTokens({
        ...currentTokens,
        isFirstAccess: false,
      });
    }

    setSessionState((previousSession) => {
      const baseSession = previousSession ?? readSessionFromStorage();
      if (!baseSession) {
        return null;
      }

      return {
        ...baseSession,
        isFirstAccess: false,
      };
    });
  }, []);

  const register = useCallback(
    async (input: RegisterInput) => {
      await registerRequest({
        name: input.name,
        email: input.email,
        password: input.password,
        role: "Candidate",
      });

      await login(input.email, input.password);
    },
    [login]
  );

  const logout = useCallback(() => {
    clearStoredTokens();
    setSessionState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,
      isAuthenticated: Boolean(session?.token),
      login,
      register,
      markOnboardingCompleted,
      logout,
    }),
    [isLoading, login, logout, markOnboardingCompleted, register, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}