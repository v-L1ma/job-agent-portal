import { api, toApiError } from "./api";

export async function createCheckoutSession(planId: string): Promise<string> {
  try {
    const response = await api.post<{ message: string; data: string }>(
      `/checkout/session/${planId}`
    );
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível iniciar o checkout.");
  }
}
