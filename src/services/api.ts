import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1323/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const session = await getSession();
    const token = (session as any)?.user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        await signOut({ callbackUrl: "/login?expired=true" });
      }
    }
    return Promise.reject(error);
  }
);

export function toApiError(error: unknown, defaultMessage: string): Error {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data?.message || error.response?.data?.error;
    if (apiError) {
      return new Error(apiError);
    }
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error(defaultMessage);
}
