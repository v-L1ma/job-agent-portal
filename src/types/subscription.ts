import { Plan } from "./plan";

export interface Subscription {
  id: string;
  userEmail: string;
  roleName: string;
  plan: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripeCheckoutSessionId: string;
  stripePriceId: string;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionsResponse {
  message: string;
  data: Subscription[];
}

export interface PlanSummary {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface MySubscription {
  id: string;
  planId: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  plan: PlanSummary | null;
}

export interface MySubscriptionResponse {
  message: string;
  data: MySubscription | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Invoice {
  id: string;
  amountPaid: number;
  currency: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

export interface SubscriptionDetail {
  subscription: Subscription;
  plan: Plan | null;
  user: AdminUser | null;
  invoices: Invoice[];
}

export interface SubscriptionDetailResponse {
  message: string;
  data: SubscriptionDetail;
}

export interface UserSubscriptions {
  user: AdminUser;
  subscriptions: Subscription[];
}

export interface UserSubscriptionsResponse {
  message: string;
  data: UserSubscriptions;
}
