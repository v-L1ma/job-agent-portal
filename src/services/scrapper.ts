import { ScrapperLogsResponse, ExecutionJobsResponse } from "@/types/scrapper";
import { api, toApiError } from "./api";

export async function getScrapperLogs(searchQueryId: string): Promise<ScrapperLogsResponse> {
  try {
    const response = await api.get<ScrapperLogsResponse>(`/admin/scrapper/logs/${searchQueryId}`);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível buscar os logs do scrapper.");
  }
}

export async function getExecutionJobs(executionId: string): Promise<ExecutionJobsResponse> {
  try {
    const response = await api.get<ExecutionJobsResponse>(`/admin/scrapper/jobs/${executionId}`);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível buscar as vagas da execução.");
  }
}
