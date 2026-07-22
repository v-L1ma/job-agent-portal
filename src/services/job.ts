import { Job, JobsParams, ListJobsResponse, RateJobPayload } from "@/types/job";
import { api, toApiError } from "./api";
import { getFileNameFromContentDisposition } from "@/utils/get-file-name-content";

export async function getJobs(queryParams: JobsParams): Promise<ListJobsResponse> {
  try {
    const params: Record<string, string> = {};
    if (queryParams) {
      params.limit = String(queryParams.limit ?? 10);
      queryParams.cursor && (params.cursor = queryParams.cursor);
      queryParams.stack && (params.stack = queryParams.stack);
      queryParams.location && (params.location = queryParams.location);
      queryParams.company && (params.company = queryParams.company);
      queryParams.platform && (params.platform = queryParams.platform);
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
