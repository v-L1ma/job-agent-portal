"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Check, CreditCard, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicPlans } from "@/services/plan";
import { getMySubscription } from "@/services/subscription";
import { MySubscription } from "@/types/subscription";
import { Plan } from "@/types/plan";

type RawPlan = Partial<Plan> & {
  Id?: string;
  Name?: string;
  Description?: string;
  Price?: number;
  Active?: boolean;
};

type AvailablePlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
};

function normalizePlan(raw: RawPlan): AvailablePlan {
  return {
    id: raw.id ?? raw.Id ?? "",
    name: raw.name ?? raw.Name ?? "",
    description: raw.description ?? raw.Description ?? "",
    price: raw.price ?? raw.Price ?? 0,
    active: raw.active ?? raw.Active ?? true,
  };
}

function formatPrice(price: number): string {
  if (price === 0) return "R$0";
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "Ativo",
    trialing: "Teste grátis",
    past_due: "Pagamento pendente",
    canceled: "Cancelado",
    unpaid: "Não pago",
    incomplete: "Incompleto",
    incomplete_expired: "Expirado",
  };
  return labels[status] ?? status;
}

function PlanError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <XCircle className="size-8 text-red-500" />
      <p className="text-xs font-bold text-red-600">
        {message || "Não foi possível carregar os planos."}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-lg border-red-300 text-red-600 hover:bg-red-100/50"
        onClick={onRetry}
      >
        Tentar Novamente
      </Button>
    </div>
  );
}

export function PlanSection() {
  const router = useRouter();
  const [isChoosingPlan, setIsChoosingPlan] = useState(false);

  const {
    data: subscription,
    isLoading: isLoadingSubscription,
    isError: isErrorSubscription,
    error: subscriptionError,
    refetch: refetchSubscription,
  } = useQuery({
    queryKey: ["my-subscription"],
    queryFn: async () => getMySubscription(),
    retry: 1,
  });

  const {
    data: plans,
    isLoading: isLoadingPlans,
    isError: isErrorPlans,
    error: plansError,
    refetch: refetchPlans,
  } = useQuery({
    queryKey: ["public-plans"],
    queryFn: async () => {
      const raw = (await getPublicPlans()) as unknown as RawPlan[];
      return raw.map(normalizePlan).filter((plan) => plan.active);
    },
    enabled: isChoosingPlan,
    retry: 1,
  });

  const mySubscription: MySubscription | null = subscription ?? null;
  const currentPlan = mySubscription?.plan ?? null;
  const planList = plans ?? [];
  const renewalDate = formatDate(mySubscription?.currentPeriodEnd);

  return (
    <section>
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
        <CreditCard className="w-5 h-5 text-trampo-primary-500" />
        <h3 className="text-lg font-bold">Plano</h3>
      </div>

      {isLoadingSubscription ? (
        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <Skeleton className="h-3 w-24 bg-slate-100 dark:bg-slate-800" />
          <Skeleton className="h-6 w-40 bg-slate-100 dark:bg-slate-800" />
          <Skeleton className="h-3 w-56 bg-slate-100 dark:bg-slate-800" />
        </div>
      ) : isErrorSubscription ? (
        <PlanError
          message={subscriptionError?.message}
          onRetry={() => refetchSubscription()}
        />
      ) : (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-trampo-muted">
              Plano atual
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-trampo-dark">
                {currentPlan?.name ?? "Sem plano ativo"}
              </span>
              {currentPlan && (
                <Badge
                  variant="outline"
                  className="rounded-lg border-trampo-primary-100 bg-[#F2FCFA] font-bold text-trampo-primary-600"
                >
                  {statusLabel(mySubscription?.status ?? "")}
                </Badge>
              )}
            </div>
            <p className="text-xs text-trampo-muted">
              {currentPlan
                ? `${formatPrice(currentPlan.price)}/mês${
                    renewalDate ? ` · Renovação em ${renewalDate}` : ""
                  }`
                : "Assine um plano para ter acesso a todos os recursos."}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="shrink-0 rounded-xl px-5 py-5 text-sm font-bold"
            aria-expanded={isChoosingPlan}
            onClick={() => setIsChoosingPlan((prev) => !prev)}
          >
            <CreditCard className="mr-2 size-4" />
            Mudar plano
          </Button>
        </div>
      )}

      {isChoosingPlan && (
        <div className="mt-6">
          {isLoadingPlans ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <div className="mb-4 h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="mb-6 h-8 w-28 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="mb-6 h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-9 w-full rounded-lg bg-slate-100 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          ) : isErrorPlans ? (
            <PlanError
              message={plansError?.message}
              onRetry={() => refetchPlans()}
            />
          ) : planList.length === 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
              <p className="text-xs font-bold text-trampo-muted">
                Nenhum plano disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {planList.map((plan) => {
                const isCurrentPlan =
                  !!currentPlan && currentPlan.id === plan.id;

                return (
                  <div
                    key={plan.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 p-5 transition-colors hover:border-trampo-primary-400 dark:border-slate-800"
                  >
                    <div className="mb-5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-trampo-muted">
                          {plan.name}
                        </span>
                        {isCurrentPlan && (
                          <Badge
                            variant="outline"
                            className="rounded-lg border-trampo-primary-100 bg-[#F2FCFA] font-bold text-trampo-primary-600"
                          >
                            Atual
                          </Badge>
                        )}
                      </div>
                      <div className="text-3xl font-extrabold text-trampo-dark">
                        {formatPrice(plan.price)}
                        <span className="text-xs font-medium text-trampo-muted">
                          /mês
                        </span>
                      </div>
                      <p className="text-xs text-trampo-muted">
                        {plan.description}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={isCurrentPlan}
                      className={`w-full rounded-xl py-5 text-xs font-bold ${
                        isCurrentPlan
                          ? ""
                          : "bg-trampo-primary-500 text-white hover:bg-trampo-primary-600"
                      }`}
                      onClick={() => router.push(`/checkout/${plan.id}`)}
                    >
                      {isCurrentPlan ? (
                        <>
                          <Check className="mr-1 size-3.5" />
                          Plano atual
                        </>
                      ) : (
                        "Selecionar"
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
