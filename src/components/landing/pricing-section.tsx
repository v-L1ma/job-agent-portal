"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Check, XCircle } from "lucide-react";
import { getPublicPlans } from "@/services/plan";
import { Plan } from "@/types/plan";

type RawPlan = Partial<Plan> & {
  Id?: string;
  Name?: string;
  Description?: string;
  Price?: number;
};

type LandingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
};

function normalizePlan(raw: RawPlan): LandingPlan {
  return {
    id: raw.id ?? raw.Id ?? "",
    name: raw.name ?? raw.Name ?? "",
    description: raw.description ?? raw.Description ?? "",
    price: raw.price ?? raw.Price ?? 0,
  };
}

function formatPrice(price: number): string {
  if (price === 0) return "R$0";
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function PlanCard({ plan, featured }: { plan: LandingPlan; featured: boolean }) {
  if (featured) {
    return (
      <div className="relative rounded-2xl border-2 border-trampo-primary-500 bg-white p-8 flex flex-col justify-between h-full shadow-xl shadow-trampo-primary-500/5">
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-trampo-primary-500 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap">
          Mais Popular
        </div>
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-trampo-primary-600">
            {plan.name}
          </div>
          <div className="mb-6 text-4xl font-extrabold text-trampo-dark">
            {formatPrice(plan.price)}
            <span className="text-sm font-medium text-trampo-muted">/mês</span>
          </div>
          <ul className="mb-8 space-y-4 text-sm text-trampo-dark">
            <li className="flex items-center gap-2.5">
              <Check className="size-4.5 text-trampo-primary-500" />
              {plan.description}
            </li>
          </ul>
        </div>
        <Link
          href="/register"
          className="w-full rounded-full bg-trampo-primary-500 py-3 text-center text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20 hover:bg-trampo-primary-400 transition-colors block"
        >
          Começar Agora
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-trampo-border bg-white p-8 hover:border-trampo-primary-400 transition-colors flex flex-col justify-between h-full">
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-trampo-muted">
          {plan.name}
        </div>
        <div className="mb-6 text-4xl font-extrabold text-trampo-dark">
          {formatPrice(plan.price)}
          <span className="text-sm font-medium text-trampo-muted">/mês</span>
        </div>
        <ul className="mb-8 space-y-4 text-sm text-trampo-muted">
          <li className="flex items-center gap-2.5">
            <Check className="size-4.5 text-trampo-primary-500" />
            {plan.description}
          </li>
        </ul>
      </div>
      <Link
        href="/register"
        className="w-full rounded-full border border-trampo-border py-3 text-center text-sm font-bold text-trampo-muted hover:text-trampo-dark hover:border-trampo-dark transition-colors block"
      >
        Selecionar
      </Link>
    </div>
  );
}

function PlanSkeleton() {
  return (
    <div className="rounded-2xl border border-trampo-border bg-white p-8 animate-pulse">
      <div className="mb-2 h-3 w-20 rounded bg-neutral-200" />
      <div className="mb-6 h-9 w-32 rounded bg-neutral-200" />
      <div className="mb-8 space-y-3">
        <div className="h-4 w-full rounded bg-neutral-100" />
        <div className="h-4 w-2/3 rounded bg-neutral-100" />
      </div>
      <div className="h-10 w-full rounded-full bg-neutral-100" />
    </div>
  );
}

export function PricingSection() {
  const {
    data: plans,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["landing-plans"],
    queryFn: async () => {
      const raw = (await getPublicPlans()) as unknown as RawPlan[];
      return raw.map(normalizePlan);
    },
    retry: 1,
  });

  const planList = plans ?? [];
  const featuredIndex = planList.length > 1 ? Math.floor(planList.length / 2) : -1;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <PlanSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
        <XCircle className="size-10 text-red-500" />
        <p className="text-sm font-bold text-red-600">
          Não foi possível carregar os planos.
        </p>
        <p className="text-xs text-red-500/80">
          {queryError?.message || "Ocorreu um erro na requisição com o servidor."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full border border-red-300 px-6 py-2 text-xs font-bold text-red-600 hover:bg-red-100/50 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (planList.length === 0) {
    return (
      <div className="rounded-2xl border border-trampo-border bg-white p-12 text-center">
        <p className="text-sm font-bold text-trampo-muted">
          Nenhum plano disponível no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
      {planList.map((plan, index) => (
        <PlanCard key={plan.id || index} plan={plan} featured={index === featuredIndex} />
      ))}
    </div>
  );
}
