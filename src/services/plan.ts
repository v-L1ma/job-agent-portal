import { Plan, PlanLimits, PlanLimitsResponse, PlansResponse } from "@/types/plan";
import { api, toApiError } from "./api";

export interface PlanLimitsPayload {
  dailyCvLimit?: number | null;
  dailyApplicationLimit?: number | null;
}

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

export async function updatePlanLimits(
  planId: string,
  payload: PlanLimitsPayload
): Promise<PlanLimits> {
  try {
    const response = await api.put<PlanLimitsResponse>(
      `/admin/plans/${planId}/limits`,
      payload
    );
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível atualizar os limites do plano.");
  }
}
