import api from "@/lib/axios-instance";
import { isAxiosError } from "axios";

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Profile ────────────────────────────────────────────────────────────────

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  cpf?: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// ─── Preferences ────────────────────────────────────────────────────────────

export interface SavePreferencesPayload {
  skills: string[];
  levels: string[];
}

export interface UserPreference {
  UserId: string;
  Skills: string[];
  Levels: string[];
}

export interface UserPreferencesResponse {
  message: string;
  data: UserPreference[];
}

// ─── Jobs ───────────────────────────────────────────────────────────────────

export interface ListJobsResponse {
  jobs: Job[];
  nextCursor?: string;
}

export interface Job {
  id: string;
  plataformJobId: string;
  title: string;
  description: string;
  url: string;
  isApplied: boolean;
  status: string;
  active: boolean;
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  platform: string;
  company: string;
}

export interface RateJobPayload {
  userId: string;
  liked: boolean;
  feedback?: string;
}

// ─── CV ─────────────────────────────────────────────────────────────────────

export interface UploadCvResponse {
  filename: string;
  size: number;
  type: string;
  content: string;
  response: {
    Nome: string;
    Email: string;
    Telefone: string;
    Linkedin: string;
    Github: string;
    Resumo: string;
    Skills: string[];
    Experiencias: {
      Cargo: string;
      Empresa: string;
      DataInicio: string;
      DataFim: string;
      Descricao: string;
    }[];
    Educacao: {
      Curso: string;
      Instituicao: string;
      DataInicio: string;
      DataFim: string;
    }[];
  };
}

export interface GeneratedCvItem {
  UserId: string;
  JobId: string;
  Title: string;
  FileName: string;
  ExtractedText: string;
}

export interface GeneratedCvListResponse {
  message: string;
  data: GeneratedCvItem[];
}

// ─── Statistics ─────────────────────────────────────────────────────────────

export interface StatisticsTotal {
  count: number;
  variation: number;
  variationLabel: string;
}

export interface StatisticsApplied {
  count: number;
  successRate: number;
}

export interface StatisticsSkipped {
  count: number;
  label: string;
}

export interface StatisticsFailures {
  count: number;
  thisWeek: number;
}

export interface ApplicationsPerDay {
  date: string;
  count: number;
}

export interface PlatformDistribution {
  platform: string;
  count: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage?: number;
}

export interface UserStatisticsResponse {
  message: string;
  data: {
    total: StatisticsTotal;
    applied: StatisticsApplied;
    skipped: StatisticsSkipped;
    failures: StatisticsFailures;
    applicationsPerDay: ApplicationsPerDay[];
    platformDistribution: PlatformDistribution[];
    statusDistribution: StatusDistribution[];
    recentApplications: never[];
  };
}

// ─── Error handling ─────────────────────────────────────────────────────────

interface ApiErrorBody {
  error?: string;
  errors?: Record<string, string>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
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
    const body = error.response?.data as ApiErrorBody | undefined;

    const message =
      body?.error ??
      (body?.errors ? Object.values(body.errors).join("; ") : null) ??
      fallbackMessage;

    return new ApiError(message, error.response?.status ?? 500, body?.errors);
  }

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error && error.message) {
    return new ApiError(error.message, 500);
  }

  return new ApiError(fallbackMessage, 500);
}

// ─── Auth functions ─────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/login", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível realizar o login.");
  }
}

export async function register(payload: RegisterPayload): Promise<void> {
  try {
    await api.post("/register", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível concluir o cadastro.");
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string; resetToken: string }> {
  try {
    const response = await api.post<{ message: string; resetToken: string }>("/forgot-password", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível enviar o link de recuperação.");
  }
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  try {
    await api.post("/reset-password", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível redefinir a senha.");
  }
}

// ─── Profile functions ──────────────────────────────────────────────────────

export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    const response = await api.get<{ message: string; data: UserProfileResponse }>("/users/profile");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar seu perfil.");
  }
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<void> {
  try {
    await api.put("/users/profile", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível atualizar seu perfil.");
  }
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  try {
    await api.put("/users/change-password", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível alterar sua senha.");
  }
}

// ─── Preferences functions ──────────────────────────────────────────────────

export async function saveUserPreferences(payload: SavePreferencesPayload): Promise<void> {
  try {
    await api.post("/users/preferences", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível salvar suas preferências.");
  }
}

export async function getUserPreferences(): Promise<UserPreference[]> {
  try {
    const response = await api.get<UserPreferencesResponse>("/users/preferences");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar suas preferências.");
  }
}

// ─── Jobs functions ─────────────────────────────────────────────────────────

export async function getJobs(limit = 10, cursor?: string): Promise<ListJobsResponse> {
  try {
    const params: Record<string, string> = { limit: String(limit) };
    if (cursor) {
      params.cursor = cursor;
    }
    const response = await api.get<ListJobsResponse>("/jobs", { params });
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível buscar as vagas.");
  }
}

export async function getJobById(jobId: string): Promise<Job> {
  try {
    const response = await api.get<Job>(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar os detalhes da vaga.");
  }
}

export async function rateJob(jobId: string, payload: RateJobPayload): Promise<void> {
  try {
    await api.post(`/jobs/${jobId}/rate`, payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível enviar sua avaliação.");
  }
}

export async function generateCvForJob(jobId: string): Promise<{ blob: Blob; fileName: string }> {
  try {
    const response = await api.post(`/jobs/${jobId}/cv`, null, { responseType: "blob" });

    const blob = response.data as Blob;
    const fileName =
      getFileNameFromContentDisposition(response.headers["content-disposition"]) ??
      "curriculo-personalizado.pdf";

    return { blob, fileName };
  } catch (error) {
    throw toApiError(error, "Não foi possível gerar o currículo para esta vaga.");
  }
}

// ─── CV functions ───────────────────────────────────────────────────────────

export async function uploadUserCv(file: File): Promise<UploadCvResponse> {
  const formData = new FormData();
  formData.append("cv", file);

  try {
    const response = await api.post<UploadCvResponse>("/users/cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw toApiError(error, "Erro ao fazer upload do currículo.");
  }
}

export async function getUserCv(): Promise<{ blob: Blob; fileName: string; fileSize: number; uploadedAt: string }> {
  try {
    const response = await api.get("/users/cv", { responseType: "blob" });

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

export async function getGeneratedCvs(): Promise<GeneratedCvItem[]> {
  try {
    const response = await api.get<GeneratedCvListResponse>("/users/cv/generated");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar a lista de currículos gerados.");
  }
}

export async function downloadGeneratedCv(cvId: string): Promise<{ blob: Blob; fileName: string }> {
  try {
    const response = await api.get(`/users/cv/${cvId}`, { responseType: "blob" });

    const blob = response.data as Blob;
    const fileName =
      getFileNameFromContentDisposition(response.headers["content-disposition"]) ??
      `curriculo-gerado-${cvId}.pdf`;

    return { blob, fileName };
  } catch (error) {
    throw toApiError(error, "Não foi possível baixar o currículo gerado.");
  }
}

// ─── Statistics ─────────────────────────────────────────────────────────────

export async function getUserStatistics(): Promise<UserStatisticsResponse> {
  try {
    const response = await api.get<UserStatisticsResponse>("/users/statistics");
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar as estatísticas.");
  }
}
