import { Subscription, SubscriptionsResponse } from "@/types/subscription";
import { api, toApiError } from "./api";

export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const response = await api.get<SubscriptionsResponse>("/admin/subscriptions");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível listar as assinaturas.");
  }
}
