export interface StoredAuthTokens {
  token: string;
  refreshToken: string;
  isFirstAccess?: boolean;
}

export interface DecodedAuthToken {
  sub?: string;
  name?: string;
  email?: string;
  exp?: number;
  isFirstAccess?: string | boolean;
}

const AUTH_STORAGE_KEY = "jobAgentPortal.auth";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getStoredTokens(): StoredAuthTokens | null {
  if (!isBrowser()) {
    return null;
  }

  const value = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<StoredAuthTokens>;
    if (!parsed.token || !parsed.refreshToken) {
      return null;
    }

    return {
      token: parsed.token,
      refreshToken: parsed.refreshToken,
      isFirstAccess:
        typeof parsed.isFirstAccess === "boolean" ? parsed.isFirstAccess : undefined,
    };
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens: StoredAuthTokens): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function decodeAuthToken(token: string): DecodedAuthToken | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) {
      return null;
    }

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(window.atob(normalized)) as DecodedAuthToken;

    return payload;
  } catch {
    return null;
  }
}