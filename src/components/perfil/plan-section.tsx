"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  CreditCard,
  ExternalLink,
  Loader2,
  Receipt,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { showError, showSuccess } from "@/lib/toast";
import { getPublicPlans } from "@/services/plan";
import {
  cancelSubscription,
  createPortalSession,
  getMyInvoices,
  getMySubscription,
  resumeSubscription,
} from "@/services/subscription";
import { Invoice, MySubscription } from "@/types/subscription";
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

function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

const invoiceStatusLabels: Record<string, string> = {
  paid: "Paga",
  open: "Em aberto",
  void: "Anulada",
  uncollectible: "Inadimplente",
};

const invoiceStatusStyles: Record<string, string> = {
  paid: "border-trampo-primary-100 bg-[#F2FCFA] text-trampo-primary-600",
  open: "border-blue-200 bg-blue-50 text-blue-700",
  void: "border-neutral-200 bg-neutral-50 text-neutral-500",
  uncollectible: "border-amber-200 bg-amber-50 text-amber-700",
};

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const statusKey = invoice.status.toLowerCase();

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-2.5">
      <span className="w-36 text-xs font-semibold text-trampo-dark">
        {formatDateTime(invoice.createdAt)}
      </span>
      <span className="text-xs font-bold text-trampo-dark">
        {formatPrice(invoice.amountPaid)}
      </span>
      <Badge
        className={`rounded-lg font-bold ${
          invoiceStatusStyles[statusKey] ??
          "border-neutral-200 bg-neutral-50 text-neutral-500"
        }`}
      >
        {invoiceStatusLabels[statusKey] ?? invoice.status}
      </Badge>
      <span
        className="ml-auto font-mono text-[10px] text-trampo-muted"
        title={invoice.id}
      >
        {shortId(invoice.id)}
      </span>
    </li>
  );
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
  const queryClient = useQueryClient();
  const [isChoosingPlan, setIsChoosingPlan] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);

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
    data: invoices,
    isLoading: isLoadingInvoices,
    isError: isErrorInvoices,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ["my-invoices"],
    queryFn: async () => getMyInvoices(),
    enabled: showInvoices,
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

  const cancelMutation = useMutation({
    mutationFn: async () => cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      setIsConfirmingCancel(false);
      showSuccess(
        "Assinatura cancelada",
        "Seu acesso continua até o fim do período atual."
      );
    },
    onError: (e) => {
      console.error("Error on cancelSubscription", e);
      showError(
        "Erro ao cancelar assinatura",
        "Não foi possível cancelar sua assinatura. Por favor, tente novamente."
      );
    },
  });

  const resumeMutation = useMutation({
    mutationFn: async () => resumeSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      showSuccess(
        "Assinatura retomada",
        "Seu plano voltou a ficar ativo e será renovado normalmente."
      );
    },
    onError: (e) => {
      console.error("Error on resumeSubscription", e);
      showError(
        "Erro ao retomar assinatura",
        "Não foi possível retomar sua assinatura. Por favor, tente novamente."
      );
    },
  });

  const portalMutation = useMutation({
    mutationFn: async () => createPortalSession(),
    onSuccess: ({ url }) => {
      window.open(url, "_blank", "noopener,noreferrer");
    },
    onError: (e) => {
      console.error("Error on createPortalSession", e);
      showError(
        "Erro ao abrir portal de cobrança",
        "Não foi possível abrir o portal de cobrança. Por favor, tente novamente."
      );
    },
  });

  const mySubscription: MySubscription | null = subscription ?? null;
  const currentPlan = mySubscription?.plan ?? null;
  const planList = plans ?? [];
  const invoiceList = invoices ?? [];
  const renewalDate = formatDate(mySubscription?.currentPeriodEnd);
  const subscriptionStatus = (mySubscription?.status ?? "").toLowerCase();
  // Statuses em que a assinatura ainda está "viva" e pode ser cancelada no Stripe.
  const hasLiveSubscription =
    !!mySubscription &&
    ["active", "trialing", "past_due"].includes(subscriptionStatus);
  const canCancel =
    hasLiveSubscription && !mySubscription.cancelAtPeriodEnd;

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
        <>
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

          {mySubscription?.cancelAtPeriodEnd && (
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-amber-800">
                    {renewalDate
                      ? `Sua assinatura será cancelada em ${renewalDate}.`
                      : "Sua assinatura será cancelada no fim do período atual."}
                  </p>
                  <p className="text-xs text-amber-700/90">
                    Você continua com acesso a todos os recursos até essa data.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 rounded-lg border-amber-300 bg-white text-xs font-bold text-amber-700 hover:bg-amber-100/60"
                disabled={resumeMutation.isPending}
                onClick={() => resumeMutation.mutate()}
              >
                {resumeMutation.isPending ? (
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="mr-1.5 size-3.5" />
                )}
                Retomar assinatura
              </Button>
            </div>
          )}

          {isConfirmingCancel ? (
            <div className="mt-4 space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-red-600">
                  Cancelar assinatura?
                </p>
                <p className="text-xs text-red-500/90">
                  Seu plano será cancelado e{" "}
                  {renewalDate
                    ? `você continuará com acesso até ${renewalDate}`
                    : "você continuará com acesso até o fim do período atual"}
                  . Depois disso, você perde o acesso aos recursos do plano.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-red-600 bg-red-600 text-xs font-bold text-white hover:bg-red-700 hover:text-white"
                  disabled={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate()}
                >
                  {cancelMutation.isPending && (
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  )}
                  Sim, cancelar assinatura
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs font-bold"
                  disabled={cancelMutation.isPending}
                  onClick={() => setIsConfirmingCancel(false)}
                >
                  Manter assinatura
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {canCancel && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-red-200 px-4 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setIsConfirmingCancel(true)}
                >
                  <XCircle className="mr-1.5 size-3.5" />
                  Cancelar assinatura
                </Button>
              )}

              {mySubscription && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl px-4 text-xs font-bold"
                  disabled={portalMutation.isPending}
                  onClick={() => portalMutation.mutate()}
                >
                  {portalMutation.isPending ? (
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-1.5 size-3.5" />
                  )}
                  Gerenciar cobrança
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                className="rounded-xl px-4 text-xs font-bold"
                aria-expanded={showInvoices}
                onClick={() => setShowInvoices((prev) => !prev)}
              >
                <Receipt className="mr-1.5 size-3.5" />
                {showInvoices ? "Ocultar faturas" : "Ver faturas"}
              </Button>
            </div>
          )}

          {showInvoices && (
            <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Receipt className="size-4 text-trampo-primary-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-trampo-muted">
                  Faturas
                </h4>
              </div>

              {isLoadingInvoices ? (
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-8 w-full bg-slate-100 dark:bg-slate-800"
                    />
                  ))}
                </div>
              ) : isErrorInvoices ? (
                <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
                  <p className="text-xs font-bold text-red-600">
                    {invoicesError?.message ||
                      "Não foi possível carregar as faturas."}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-red-300 text-red-600 hover:bg-red-100/50"
                    onClick={() => refetchInvoices()}
                  >
                    Tentar Novamente
                  </Button>
                </div>
              ) : invoiceList.length === 0 ? (
                <p className="text-xs font-semibold text-trampo-muted">
                  Nenhuma fatura ainda
                </p>
              ) : (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {invoiceList.map((invoice) => (
                    <InvoiceRow key={invoice.id} invoice={invoice} />
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
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
