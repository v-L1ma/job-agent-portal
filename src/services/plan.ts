import { Plan, PlansResponse } from "@/types/plan";
import { api, toApiError } from "./api";

export async function getPlans(): Promise<Plan[]> {
  try {
    const response = await api.get<PlansResponse>("/admin/plans");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível listar os planos.");
  }
}

export async function getPublicPlans(): Promise<Plan[]> {
  try {
    const response = await api.get<PlansResponse>("/plans");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível listar os planos.");
  }
}
