import api from "@/lib/axios-instance";
import { isAxiosError } from "axios";

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
}

export interface JobListItem {
  id: string;
  title: string;
  description: string;
  url: string;
  isApplied: boolean;
  platform?:string;
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

export interface UserCvResponse {
  blob: Blob;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface GeneratedCvItem {
  id: string;
  urlFile: string;
  createdAt: string;
  fileName: string;
}

export interface GenerateCvResponse {
  blob: Blob;
  fileName: string;
  storageUrl: string | null;
}

export interface GeneratedCvListResponse {
  items: GeneratedCvItem[];
  total: number;
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

function toApiError(error: unknown, fallbackMessage: string): ApiError {
  if (isAxiosError(error)) {
    const problem = error.response?.data as ProblemDetails | undefined;
    const message =
      (typeof problem?.detail === "string" && problem.detail) ||
      (typeof problem?.title === "string" && problem.title) ||
      fallbackMessage;

    return new ApiError(message, error.response?.status ?? 500);
  }

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error && error.message) {
    return new ApiError(error.message, 500);
  }

  return new ApiError(fallbackMessage, 500);
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/api/auth/login", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível realizar o login.");
  }
}

export async function register(payload: RegisterPayload): Promise<string> {
  try {
    const response = await api.post<string>("/api/auth/register", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível concluir o cadastro.");
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
  try {
    const response = await api.post<string>("/api/auth/forgot-password", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível enviar o link de recuperação.");
  }
}

export async function getJobs(query: JobsQuery): Promise<PagedJobsResponse> {
  try {
    const response = await api.get<PagedJobsResponse>("/api/jobs/search", {
      params: query,
    });
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível buscar as vagas.");
  }
}

export async function getJobById(id: string): Promise<JobDetailsResponse> {
  try {
    const response = await api.get<JobDetailsResponse>(`/api/jobs/${id}`);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar os detalhes da vaga.");
  }
}

export interface UserPreferencesResponse {
  skills: string[];
  level: string;
  area: string;
}

export async function getUserPreferences(): Promise<UserPreferencesResponse> {
  try {
    const response = await api.get<UserPreferencesResponse>("/api/users/preferences");
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar suas preferências.");
  }
}

export async function saveUserPreferences(
  payload: SavePreferencesPayload
): Promise<SavePreferencesResponse> {
  try {
    const response = await api.post<SavePreferencesResponse>("/api/users/preferences", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível salvar suas preferências.");
  }
}

export async function uploadUserCv(file: File): Promise<UploadCvResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try{
    const response = await api.post<UploadCvResponse>("/api/users/cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }catch(error){
    throw toApiError(error, "Erro ao fazer upload do cúrriculo")
  }
}

export async function getUserCv(): Promise<UserCvResponse> {
  try {
    const response = await api.get("/api/users/cv", { responseType: "blob" });

    const blob = response.data as Blob;
    const fileNameFromHeader = response.headers["x-cv-file-name"] as string | undefined;
    const fileSizeFromHeader = response.headers["x-cv-file-size-bytes"] as string | undefined;
    const uploadDateFromHeader = response.headers["x-cv-upload-date"] as string | undefined;
    const contentLength = response.headers["content-length"] as string | undefined;

    const fileName =
      fileNameFromHeader ??
      getFileNameFromContentDisposition(response.headers["content-disposition"]) ??
      "curriculo.pdf";
    const fileSize = Number.parseInt(fileSizeFromHeader ?? contentLength ?? "", 10);
    const uploadedAt = uploadDateFromHeader ?? "";

    return {
      blob,
      fileName,
      fileSize: Number.isNaN(fileSize) ? blob.size : fileSize,
      uploadedAt,
    };
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar seu currículo.");
  }
}

export async function getGeneratedCvs(): Promise<GeneratedCvListResponse> {
  try {
    const response = await api.get<GeneratedCvListResponse>("/api/users/generated-cvs");
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar a lista de currículos gerados.");
  }
}

export async function downloadGeneratedCv(id: string): Promise<{ blob: Blob; fileName: string }> {
  try {
    const response = await api.get(`/api/users/generated-cvs/${id}`, { responseType: "blob" });

    const blob = response.data as Blob;
    const fileName =
      getFileNameFromContentDisposition(response.headers["content-disposition"]) ??
      `curriculo-gerado-${id}.pdf`;

    return { blob, fileName };
  } catch (error) {
    throw toApiError(error, "Não foi possível baixar o currículo gerado.");
  }
}

export async function generateCvForJob(jobId: string): Promise<GenerateCvResponse> {
  try {
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
  } catch (error) {
    throw toApiError(error, "Não foi possível gerar o currículo para esta vaga.");
  }
}

export interface EvaluateJobPayload {
  liked: boolean;
  feedback?: string;
}

export async function evaluateJob(id: string, payload: EvaluateJobPayload): Promise<void> {
  try {
    await api.post(`/api/jobs/${id}/evaluate`, payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível enviar sua avaliação.");
  }
}
