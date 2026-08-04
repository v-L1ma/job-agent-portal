import { api, toApiError } from "@/services/api";
import { ApplicationsResponse } from "@/types/application";

export async function getApplications(): Promise<ApplicationsResponse> {
  try {
    const response = await api.get<ApplicationsResponse>("/applications");
    return response.data;
  } catch (error) {
    throw toApiError(error, "Erro ao buscar candidaturas.");
  }
}
