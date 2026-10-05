export interface Plan {
  id: string;
  name: string;
  stripePriceId: string;
  description: string;
  price: number;
  roleId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlansResponse {
  message: string;
  data: Plan[];
}
