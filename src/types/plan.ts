export interface Plan {
  id: string;
  name: string;
  stripePriceId: string;
  description: string;
  price: number;
  roleId: string;
  active: boolean;
  dailyCvLimit: number | null;
  dailyApplicationLimit: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlanLimits {
  dailyCvLimit: number | null;
  dailyApplicationLimit: number | null;
}

export interface PlanLimitsResponse {
  message: string;
  data: PlanLimits;
}

export interface PlansResponse {
  message: string;
  data: Plan[];
}
