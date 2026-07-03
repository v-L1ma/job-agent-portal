import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { clearStoredTokens, getStoredTokens, setStoredTokens } from "./auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_JOB_AGENT_API_URL ?? "http://localhost:1323/api/v1";

interface RefreshTokenResponse {
  message: string;
  token: string;
}

interface FailedRequestQueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getStoredTokens();
    if (tokens?.token) {
      config.headers.Authorization = `Bearer ${tokens.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const tokens = getStoredTokens();
      if (!tokens?.refreshToken) {
        clearStoredTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/refresh-token`,
          { token: tokens.token }
        );

        setStoredTokens({
          token: data.token,
          refreshToken: tokens.refreshToken,
        });

        processQueue(null, data.token);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        clearStoredTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
