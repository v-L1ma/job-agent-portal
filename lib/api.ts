import api from "@/lib/axios-instance";
import {
  clearStoredTokens,
  getStoredTokens,
  setStoredTokens,
  type StoredAuthTokens,
} from "@/lib/auth-storage";

interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface JobsQuery {
  stack?: string;
  location?: string;
  page?: number;
  pageSize?: number;
  triggerScraper?: boolean;
}

export interface JobListItem {
  id: string;
  title: string;
  description: string;
  url: string;
  isApplied: boolean;
}

export interface PagedJobsResponse {
  items: JobListItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface JobAnalysis {
  skills: string;
  nivel: string;
  keywords: string;
}

export interface JobDetailsResponse {
  id: string;
  plataformJobId: string;
  title: string;
  description: string;
  url: string;
  isApplied: boolean;
  analysis: JobAnalysis | null;
}

export interface SavePreferencesPayload {
  skills: string[];
  level: string;
  area: string;
}

export interface SavePreferencesResponse {
  id: string;
}

export interface UploadCvResponse {
  url: string;
}

export interface GenerateCvResponse {
  blob: Blob;
  fileName: string;
  storageUrl: string | null;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getFileNameFromContentDisposition(headerValue: string | null): string | null {
  if (!headerValue) {
    return null;
  }

  const match = /filename\*?=(?:UTF-8''|\")?([^\";]+)/i.exec(headerValue);
  if (!match?.[1]) {
    return null;
  }

  return decodeURIComponent(match[1].replace(/\"/g, "")).trim();
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterPayload): Promise<string> {
  const response = await api.post<string>("/api/auth/register", payload);
  return response.data;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
  const response = await api.post<string>("/api/auth/forgot-password", payload);
  return response.data;
}

export async function getJobs(query: JobsQuery): Promise<PagedJobsResponse> {
  const response = await api.get<PagedJobsResponse>("/api/jobs", {
    params: query,
  });
  return response.data;
}

export async function getJobById(id: string): Promise<JobDetailsResponse> {
  const response = await api.get<JobDetailsResponse>(`/api/jobs/${id}`);
  return response.data;
}

export interface UserPreferencesResponse {
  skills: string[];
  level: string;
  area: string;
}

export async function getUserPreferences(): Promise<UserPreferencesResponse> {
  const response = await api.get<UserPreferencesResponse>("/api/users/preferences");
  return response.data;
}

export async function saveUserPreferences(
  payload: SavePreferencesPayload
): Promise<SavePreferencesResponse> {
  const response = await api.post<SavePreferencesResponse>("/api/users/preferences", payload);
  return response.data;
}

export async function uploadUserCv(file: File): Promise<UploadCvResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadCvResponse>("/api/users/cv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function generateCvForJob(jobId: string): Promise<GenerateCvResponse> {
  const response = await api.post("/api/users/cv/generate", { jobId }, { responseType: "blob" });

  const blob = response.data as Blob;
  const fileName =
    getFileNameFromContentDisposition(response.headers["content-disposition"]) ??
    "curriculo-personalizado.pdf";
  const storageUrl = response.headers["x-generated-cv-url"];

  return {
    blob,
    fileName,
    storageUrl,
  };
}

export interface EvaluateJobPayload {
  liked: boolean;
  feedback?: string;
}

export async function evaluateJob(id: string, payload: EvaluateJobPayload): Promise<void> {
  await api.post(`/api/jobs/${id}/evaluate`, payload);
}
