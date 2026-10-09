"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ArrowLeft, Receipt, UserRound, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSubscriptionById, getUserSubscriptions } from "@/services/subscription";
import { Subscription } from "@/types/subscription";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function shortId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

function daysRemaining(endIso: string, status: string): string | null {
  if (status.toLowerCase() !== "active") return null;
  const end = new Date(endIso);
  if (Number.isNaN(end.getTime())) return null;
  const diffMs = end.getTime() - Date.now();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days > 0) {
    return `Termina em ${days} ${days === 1 ? "dia" : "dias"}`;
  }
  const elapsed = Math.abs(days);
  return `Encerrado há ${elapsed} ${elapsed === 1 ? "dia" : "dias"}`;
}

const statusStyles: Record<string, string> = {
  active: "bg-[#F2FCFA] text-trampo-primary-600 border border-trampo-primary-100/50",
  canceled: "bg-neutral-50 text-neutral-500 border border-neutral-200",
  past_due: "bg-amber-50 text-amber-700 border border-amber-200",
  incomplete: "bg-orange-50 text-orange-700 border border-orange-200",
  trialing: "bg-blue-50 text-blue-700 border border-blue-200",
};

const statusLabels: Record<string, string> = {
  active: "Ativa",
  canceled: "Cancelada",
  past_due: "Atrasada",
  incomplete: "Incompleta",
  trialing: "Trial",
};

const invoiceStatusStyles: Record<string, string> = {
  paid: "bg-[#F2FCFA] text-trampo-primary-600 border border-trampo-primary-100/50",
  open: "bg-blue-50 text-blue-700 border border-blue-200",
  void: "bg-neutral-50 text-neutral-500 border border-neutral-200",
  uncollectible: "bg-amber-50 text-amber-700 border border-amber-200",
};

const invoiceStatusLabels: Record<string, string> = {
  paid: "Paga",
  open: "Em aberto",
  void: "Anulada",
  uncollectible: "Inadimplente",
};

function InfoRow({ label, value, full, mono = false }: { label: string; value: string; full?: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="text-xs font-bold text-trampo-muted shrink-0">{label}</span>
      <span
        className={`text-xs text-trampo-dark text-right break-all ${mono ? "font-mono" : "font-semibold"}`}
        title={full || (value !== "—" ? value : undefined)}
      >
        {value}
      </span>
    </div>
  );
}

export default function SubscriptionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const subscriptionId = params?.id;
  const { status: sessionStatus } = useSession();

  const {
    data: detail,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["admin-subscription", subscriptionId],
    queryFn: () => getSubscriptionById(subscriptionId as string),
    enabled: sessionStatus === "authenticated" && !!subscriptionId,
  });

  const userId = detail?.user?.id;

  const { data: userSubscriptions } = useQuery({
    queryKey: ["admin-user-subscriptions", userId],
    queryFn: () => getUserSubscriptions(userId as string),
    enabled: sessionStatus === "authenticated" && !!userId,
  });

  const showSkeleton = sessionStatus === "loading" || (isLoading && !detail);
  const notFound = isError && queryError?.message?.toLowerCase().includes("not found");
  const sub = detail?.subscription;
  const plan = detail?.plan;
  const user = detail?.user;
  const invoices = detail?.invoices ?? [];
  const history = userSubscriptions?.subscriptions ?? [];
  const statusKey = sub?.status?.toLowerCase() ?? "";
  const remaining = sub?.currentPeriodEnd ? daysRemaining(sub.currentPeriodEnd, sub.status) : null;

  return (
    <div className="w-full">
      <Button
        type="button"
        variant="ghost"
        className="mb-4 -ml-2 text-xs font-bold text-trampo-muted"
        onClick={() => router.push("/admin/subscriptions")}
      >
        <ArrowLeft className="mr-1 size-4" />
        Voltar para assinaturas
      </Button>

      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">
          Detalhe da assinatura
        </h1>
        <p className="text-xs md:text-sm text-trampo-muted font-semibold">
          Informações completas da assinatura, plano, faturas e histórico do usuário.
        </p>
      </header>

      {showSkeleton && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-trampo-border bg-white p-5 animate-pulse space-y-3"
            >
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
              <div className="h-3 bg-neutral-100 rounded w-2/3" />
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
              <div className="h-3 bg-neutral-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {!showSkeleton && isError && notFound && (
        <div className="rounded-2xl border border-trampo-border bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <XCircle className="w-12 h-12 text-neutral-300" />
          <div className="space-y-1">
            <h3 className="font-bold text-trampo-dark text-sm">Assinatura não encontrada</h3>
            <p className="text-xs text-trampo-muted max-w-sm">
              A assinatura solicitada não existe ou foi removida.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border border-trampo-border text-xs font-bold"
            onClick={() => router.push("/admin/subscriptions")}
          >
            Voltar para assinaturas
          </Button>
        </div>
      )}

      {!showSkeleton && isError && !notFound && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 p-5 flex flex-col items-center justify-center text-center space-y-3">
          <XCircle className="w-10 h-10 text-red-500" />
          <h3 className="font-bold text-sm">Não foi possível carregar a assinatura</h3>
          <p className="text-xs text-red-500/80 max-w-md">
            {queryError?.message || "Ocorreu um erro na requisição com o servidor."}
          </p>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border border-red-300 text-red-600 hover:bg-red-100/50 text-xs font-bold"
            onClick={() => refetch()}
          >
            Tentar Novamente
          </Button>
        </div>
      )}

      {!showSkeleton && !isError && sub && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-trampo-border bg-white p-5 flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-extrabold text-trampo-dark" title={sub.plan}>
              {sub.plan}
            </h2>
            <Badge className={`rounded-lg font-bold ${statusStyles[statusKey] || "bg-neutral-50 text-neutral-500 border border-neutral-200"}`}>
              {statusLabels[statusKey] || sub.status}
            </Badge>
            {sub.cancelAtPeriodEnd && (
              <Badge className="rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                Cancelamento no fim do período
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-trampo-border bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <UserRound className="size-4 text-trampo-muted" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-trampo-muted">
                  Usuário
                </h3>
              </div>
              {user ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-trampo-dark">{user.name}</p>
                  <p className="text-xs text-trampo-muted break-all">{user.email}</p>
                  <p className="text-xs text-trampo-muted font-semibold">Cargo: {user.role}</p>
                  <p className="text-xs text-trampo-muted font-mono" title={user.id}>
                    ID: {shortId(user.id)}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-trampo-muted break-all" title={sub.userEmail}>
                    {sub.userEmail}
                  </p>
                  <p className="text-xs text-amber-700 font-semibold">
                    Dados do usuário indisponíveis.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-trampo-border bg-white p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-trampo-muted mb-3">
                Plano
              </h3>
              {plan ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-trampo-dark">{plan.name}</p>
                    {plan.active ? (
                      <Badge className="rounded-lg bg-[#F2FCFA] text-trampo-primary-600 border border-trampo-primary-100/50 font-bold">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="rounded-lg bg-neutral-50 text-neutral-500 font-bold">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-trampo-muted font-semibold">
                    {formatPrice(plan.price)}/mês
                  </p>
                  {plan.description && (
                    <p className="text-xs text-trampo-muted">{plan.description}</p>
                  )}
                  <p className="text-xs text-trampo-muted font-semibold">
                    Cargo: {sub.roleName || "—"}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-bold text-trampo-dark">{sub.plan}</p>
              )}
            </div>

            <div className="rounded-2xl border border-trampo-border bg-white p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-trampo-muted mb-3">
                Período atual
              </h3>
              <div className="space-y-2">
                <p className="text-xs text-trampo-muted font-semibold">
                  {formatDate(sub.currentPeriodStart)} — {formatDate(sub.currentPeriodEnd)}
                </p>
                {remaining && (
                  <Badge
                    className={`rounded-lg font-bold ${
                      remaining.startsWith("Termina")
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-neutral-50 text-neutral-500 border border-neutral-200"
                    }`}
                  >
                    {remaining}
                  </Badge>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-trampo-border bg-white p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-trampo-muted mb-3">
                Datas
              </h3>
              <div className="divide-y divide-trampo-border">
                <InfoRow label="Criado em" value={formatDate(sub.createdAt)} />
                <InfoRow label="Atualizado em" value={formatDate(sub.updatedAt)} />
                <InfoRow label="Cancelado em" value={formatDate(sub.canceledAt)} />
              </div>
            </div>

            <div className="rounded-2xl border border-trampo-border bg-white p-5 lg:col-span-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-trampo-muted mb-3">
                Dados Stripe
              </h3>
              <div className="divide-y divide-trampo-border">
                <InfoRow label="Customer ID" value={shortId(sub.stripeCustomerId)} full={sub.stripeCustomerId} mono />
                <InfoRow label="Subscription ID" value={shortId(sub.stripeSubscriptionId)} full={sub.stripeSubscriptionId} mono />
                <InfoRow label="Price ID" value={shortId(sub.stripePriceId)} full={sub.stripePriceId} mono />
                <InfoRow label="Checkout Session" value={shortId(sub.stripeCheckoutSessionId)} full={sub.stripeCheckoutSessionId} mono />
              </div>
            </div>

            <div className="rounded-2xl border border-trampo-border bg-white p-5 lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="size-4 text-trampo-muted" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-trampo-muted">
                  Faturas
                </h3>
              </div>
              {invoices.length === 0 ? (
                <p className="text-xs text-trampo-muted font-semibold">Nenhuma fatura registrada</p>
              ) : (
                <div className="divide-y divide-trampo-border">
                  {invoices.map((invoice) => {
                    const invoiceKey = invoice.status.toLowerCase();
                    return (
                      <div
                        key={invoice.id}
                        className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-2.5"
                      >
                        <span className="text-sm font-bold text-trampo-dark">
                          {formatPrice(invoice.amountPaid)}
                        </span>
                        <span className="text-xs text-trampo-muted uppercase font-semibold">
                          {invoice.currency}
                        </span>
                        <Badge className={`rounded-lg font-bold ${invoiceStatusStyles[invoiceKey] || "bg-neutral-50 text-neutral-500 border border-neutral-200"}`}>
                          {invoiceStatusLabels[invoiceKey] || invoice.status}
                        </Badge>
                        <span className="text-xs text-trampo-muted">
                          Pago em: {formatDate(invoice.paidAt)}
                        </span>
                        <span className="text-xs text-trampo-muted font-mono ml-auto" title={invoice.id}>
                          {shortId(invoice.id)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-trampo-border bg-white p-5 lg:col-span-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-trampo-muted mb-3">
                Outras assinaturas do usuário
              </h3>
              {history.length <= 1 ? (
                <p className="text-xs text-trampo-muted font-semibold">
                  Esta é a única assinatura do usuário.
                </p>
              ) : (
                <div className="divide-y divide-trampo-border">
                  {history.map((item: Subscription) => {
                    const itemKey = item.status.toLowerCase();
                    const isCurrent = item.id === sub.id;
                    return (
                      <div
                        key={item.id}
                        role="link"
                        tabIndex={0}
                        className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 py-2.5 cursor-pointer transition-colors hover:bg-neutral-50/50 rounded-lg px-2 -mx-2 ${
                          isCurrent ? "bg-neutral-50/70" : ""
                        }`}
                        onClick={() => router.push(`/admin/subscriptions/${item.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            router.push(`/admin/subscriptions/${item.id}`);
                          }
                        }}
                      >
                        <span className="text-sm font-bold text-trampo-dark" title={item.plan}>
                          {item.plan}
                        </span>
                        <Badge className={`rounded-lg font-bold ${statusStyles[itemKey] || "bg-neutral-50 text-neutral-500 border border-neutral-200"}`}>
                          {statusLabels[itemKey] || item.status}
                        </Badge>
                        <span className="text-xs text-trampo-muted">
                          {formatDate(item.currentPeriodStart)} — {formatDate(item.currentPeriodEnd)}
                        </span>
                        <span className="text-xs text-trampo-muted">
                          {formatDate(item.createdAt)}
                        </span>
                        {isCurrent && (
                          <Badge className="rounded-lg bg-[#F2FCFA] text-trampo-primary-600 border border-trampo-primary-100/50 font-bold ml-auto">
                            Atual
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
