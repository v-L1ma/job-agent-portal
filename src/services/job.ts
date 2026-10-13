import axios from "axios";
import { Job, JobsParams, ListJobsResponse, RateJobPayload } from "@/types/job";
import { api, toApiError } from "./api";
import { getFileNameFromContentDisposition } from "@/utils/get-file-name-content";

/**
 * Payload bruto da API: o backend pode devolver em camelCase ou PascalCase.
 */
interface RawJob {
  id?: string;
  Id?: string;
  plataformJobId?: string;
  PlataformJobId?: string;
  title?: string;
  Title?: string;
  description?: string;
  Description?: string;
  url?: string;
  Url?: string;
  isApplied?: boolean;
  IsApplied?: boolean;
  status?: string;
  Status?: string;
  active?: boolean;
  Active?: boolean;
  createdBy?: string;
  CreatedBy?: string;
  createdAt?: string;
  CreatedAt?: string;
  lastModifiedBy?: string;
  LastModifiedBy?: string;
  lastModifiedAt?: string;
  LastModifiedAt?: string;
  platform?: string;
  Platform?: string;
  company?: string;
  Company?: string;
}

function normalizeJob(raw: RawJob): Job {
  return {
    id: raw.id ?? raw.Id ?? "",
    plataformJobId: raw.plataformJobId ?? raw.PlataformJobId ?? raw.Id ?? "",
    title: raw.title ?? raw.Title ?? "",
    description: raw.description ?? raw.Description ?? "",
    url: raw.url ?? raw.Url ?? "",
    isApplied: raw.isApplied ?? raw.IsApplied ?? false,
    status: raw.status ?? raw.Status ?? "",
    active: raw.active ?? raw.Active ?? false,
    createdBy: raw.createdBy ?? raw.CreatedBy ?? "",
    createdAt: raw.createdAt ?? raw.CreatedAt ?? "",
    lastModifiedBy: raw.lastModifiedBy ?? raw.LastModifiedBy ?? "",
    lastModifiedAt: raw.lastModifiedAt ?? raw.LastModifiedAt ?? "",
    platform: raw.platform ?? raw.Platform ?? "",
    company: raw.company ?? raw.Company ?? "",
  };
}

export async function getJobs(queryParams: JobsParams): Promise<ListJobsResponse> {
  try {
    const params: Record<string, string> = {};
    if (queryParams) {
      params.limit = String(queryParams.limit ?? 10);
      if (queryParams.cursor) params.cursor = queryParams.cursor;
      if (queryParams.stack) params.stack = queryParams.stack;
      if (queryParams.company) params.company = queryParams.company;
      if (queryParams.platform) params.platform = queryParams.platform;
    }
    const response = await api.get<ListJobsResponse>("/jobs", { params });
    return {
      jobs: (response.data.jobs ?? []).map(normalizeJob),
      nextCursor: response.data.nextCursor,
    };
  } catch (error) {
    throw toApiError(error, "Não foi possível buscar as vagas.");
  }
}

export async function getJobById(jobId: string): Promise<Job> {
  try {
    const response = await api.get<Job>(`/jobs/${jobId}`);
    return normalizeJob(response.data);
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
    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        const msg = json.message || json.error;
        if (msg) {
          throw new Error(msg);
        }
      } catch (e) {
        if (e instanceof Error && e.message !== "request failed with status code 404") {
          throw e;
        }
      }
    }
    throw toApiError(error, "Não foi possível gerar o currículo para esta vaga.");
  }
}
