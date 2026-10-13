import {
  InvoicesResponse,
  Invoice,
  MySubscription,
  MySubscriptionResponse,
  PortalSession,
  PortalSessionResponse,
  Subscription,
  SubscriptionsResponse,
  SubscriptionActionResponse,
  SubscriptionDetail,
  SubscriptionDetailResponse,
  UserSubscriptions,
  UserSubscriptionsResponse,
} from "@/types/subscription";
import { api, toApiError } from "./api";

export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const response = await api.get<SubscriptionsResponse>("/admin/subscriptions");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível listar as assinaturas.");
  }
}

export async function getSubscriptionById(id: string): Promise<SubscriptionDetail> {
  try {
    const response = await api.get<SubscriptionDetailResponse>(`/admin/subscriptions/${id}`);
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar os detalhes da assinatura.");
  }
}

export async function getUserSubscriptions(userId: string): Promise<UserSubscriptions> {
  try {
    const response = await api.get<UserSubscriptionsResponse>(`/admin/users/${userId}/subscriptions`);
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar as assinaturas do usuário.");
  }
}

export async function getMySubscription(): Promise<MySubscription | null> {
  try {
    const response = await api.get<MySubscriptionResponse>("/subscriptions/me");
    return response.data.data ?? null;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar sua assinatura.");
  }
}

export async function cancelSubscription(): Promise<MySubscription> {
  try {
    const response = await api.post<SubscriptionActionResponse>(
      "/subscriptions/me/cancel"
    );
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível cancelar a assinatura.");
  }
}

export async function resumeSubscription(): Promise<MySubscription> {
  try {
    const response = await api.post<SubscriptionActionResponse>(
      "/subscriptions/me/resume"
    );
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível retomar a assinatura.");
  }
}

export async function createPortalSession(): Promise<PortalSession> {
  try {
    const response = await api.post<PortalSessionResponse>(
      "/subscriptions/me/portal-session"
    );
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível abrir o portal de cobrança.");
  }
}

export async function getMyInvoices(): Promise<Invoice[]> {
  try {
    const response = await api.get<InvoicesResponse>("/subscriptions/me/invoices");
    return response.data.data ?? [];
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar suas faturas.");
  }
}
