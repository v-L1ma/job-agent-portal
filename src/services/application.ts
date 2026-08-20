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

export async function updateQuestion(
  questionId: string,
  data: { answer: string }
): Promise<{ message: string }> {
  try {
    const response = await api.put<{ message: string }>(
      `/questions/${questionId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw toApiError(error, "Erro ao atualizar resposta.");
  }
}
