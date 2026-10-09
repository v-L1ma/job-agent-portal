"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { RefreshCw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSubscriptions } from "@/services/subscription";
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

const headers = ["Usuário", "Cargo", "Plano", "Status", "Período", "Cancelamento", "Criado em"];

export default function SubscriptionsPage() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  const {
    data: subscriptions,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: getSubscriptions,
    enabled: sessionStatus === "authenticated",
  });

  const subscriptionList: Subscription[] = subscriptions ?? [];
  const showSkeleton = sessionStatus === "loading" || (isLoading && subscriptionList.length === 0);

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">
          Assinaturas
        </h1>
        <p className="text-xs md:text-sm text-trampo-muted font-semibold">
          Acompanhe as assinaturas dos usuários, seus planos e status de pagamento.
        </p>
      </header>

      {showSkeleton && (
        <div className="w-full rounded-2xl border border-trampo-border bg-white overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_0.8fr_1.5fr_1fr_1.2fr] gap-2 items-center px-5 py-3 border-b border-trampo-border bg-neutral-50">
            {headers.map((header) => (
              <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                {header}
              </span>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_0.8fr_1.5fr_1fr_1.2fr] gap-2 items-center px-5 py-4 border-b border-trampo-border last:border-b-0 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-24" />
              <div className="h-4 bg-neutral-100 rounded w-20" />
              <div className="h-4 bg-neutral-100 rounded w-24" />
              <div className="h-5 bg-neutral-200 rounded w-16" />
              <div className="h-4 bg-neutral-100 rounded w-32" />
              <div className="h-4 bg-neutral-100 rounded w-20" />
              <div className="h-4 bg-neutral-100 rounded w-28" />
            </div>
          ))}
        </div>
      )}

      {!showSkeleton && isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 p-5 flex flex-col items-center justify-center text-center space-y-3">
          <XCircle className="w-10 h-10 text-red-500" />
          <h3 className="font-bold text-sm">Não foi possível carregar as assinaturas</h3>
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

      {!showSkeleton && !isError && subscriptionList.length === 0 && (
        <div className="rounded-2xl border border-trampo-border bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <RefreshCw className="w-12 h-12 text-neutral-300" />
          <div className="space-y-1">
            <h3 className="font-bold text-trampo-dark text-sm">Nenhuma assinatura encontrada</h3>
            <p className="text-xs text-trampo-muted max-w-sm">
              As assinaturas dos usuários aparecerão aqui.
            </p>
          </div>
        </div>
      )}

      {!showSkeleton && !isError && subscriptionList.length > 0 && (
        <div className="w-full rounded-2xl border border-trampo-border bg-white overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_0.8fr_1.5fr_1fr_1.2fr] gap-2 items-center px-5 py-3 border-b border-trampo-border bg-neutral-50">
            {headers.map((header) => (
              <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                {header}
              </span>
            ))}
          </div>

          {subscriptionList.map((sub) => {
            const statusKey = sub.status.toLowerCase();
            const statusStyle = statusStyles[statusKey] || "bg-neutral-50 text-neutral-500 border border-neutral-200";
            const statusLabel = statusLabels[statusKey] || sub.status;

            return (
              <div
                key={sub.id}
                role="link"
                tabIndex={0}
                className="grid grid-cols-[1fr_1fr_1fr_0.8fr_1.5fr_1fr_1.2fr] gap-2 items-center px-5 py-3.5 border-b border-trampo-border last:border-b-0 hover:bg-neutral-50/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/subscriptions/${sub.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/admin/subscriptions/${sub.id}`);
                  }
                }}
              >
                <span className="text-sm text-trampo-muted truncate" title={sub.userEmail}>
                  {sub.userEmail || "—"}
                </span>

                <span className="text-sm text-trampo-muted truncate" title={sub.roleName}>
                  {sub.roleName || "—"}
                </span>

                <span className="font-bold text-sm text-trampo-dark truncate" title={sub.plan}>
                  {sub.plan}
                </span>

                <span>
                  <Badge className={`rounded-lg font-bold ${statusStyle}`}>
                    {statusLabel}
                  </Badge>
                </span>

                <span className="text-xs text-trampo-muted">
                  {formatDate(sub.currentPeriodStart)} — {formatDate(sub.currentPeriodEnd)}
                </span>

                <span>
                  {sub.cancelAtPeriodEnd ? (
                    <Badge className="rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                      Sim
                    </Badge>
                  ) : (
                    <span className="text-sm text-trampo-muted">Não</span>
                  )}
                </span>

                <span className="text-sm text-trampo-muted">
                  {formatDate(sub.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
