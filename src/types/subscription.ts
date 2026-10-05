export interface Subscription {
  id: string;
  userId: string;
  roleId: string;
  plan: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripeCheckoutSessionId: string;
  stripePriceId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionsResponse {
  message: string;
  data: Subscription[];
}
