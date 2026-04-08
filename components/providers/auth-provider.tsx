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
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function subscribeNoop(): () => void {
  return () => {};
}

function buildSession(token: string, refreshToken: string): AuthSession | null {
  const decoded = decodeAuthToken(token);
  if (!decoded?.sub) {
    return null;
  }

  return {
    token,
    refreshToken,
    userId: decoded.sub,
    name: decoded.name ?? "Usuário",
    email: decoded.email ?? "",
  };
}

function readSessionFromStorage(): AuthSession | null {
  const stored = getStoredTokens();
  if (!stored?.token || !stored.refreshToken) {
    return null;
  }

  const restored = buildSession(stored.token, stored.refreshToken);
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
    });

    const nextSession = buildSession(response.token, response.refreshToken);

    if (!nextSession) {
      clearStoredTokens();
      throw new Error("Token inválido retornado pela API.");
    }

    setSessionState(nextSession);
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
      logout,
    }),
    [isLoading, login, logout, register, session]
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