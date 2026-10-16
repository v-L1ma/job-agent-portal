"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CreditCard, Settings, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlanLimitsSheet } from "@/components/plans/plan-limits-sheet";
import { getPlans } from "@/services/plan";
import { Plan } from "@/types/plan";

function formatDate(iso: string): string {
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

function limitsSummary(plan: Plan): string {
  if (plan.dailyCvLimit === null && plan.dailyApplicationLimit === null) {
    return "Ilimitado";
  }
  const parts: string[] = [];
  parts.push(
    plan.dailyCvLimit === null ? "CVs ilimitados" : `${plan.dailyCvLimit} CVs/dia`
  );
  parts.push(
    plan.dailyApplicationLimit === null
      ? "candidaturas ilimitadas"
      : `${plan.dailyApplicationLimit} candidaturas/dia`
  );
  return parts.join(" · ");
}

const headers = ["Nome", "Preço", "Stripe Price ID", "Status", "Limites", "Criado em", "Ações"];
const gridCols =
  "grid grid-cols-[1.4fr_1fr_1.3fr_0.8fr_1.5fr_1.1fr_0.5fr] gap-2 items-center";

export default function PlansPage() {
  const { status: sessionStatus } = useSession();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const {
    data: plans,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: getPlans,
    enabled: sessionStatus === "authenticated",
  });

  const planList: Plan[] = plans ?? [];
  const showSkeleton = sessionStatus === "loading" || (isLoading && planList.length === 0);

  const openLimits = (plan: Plan) => {
    setSelectedPlan(plan);
    setSheetOpen(true);
  };

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">
          Planos
        </h1>
        <p className="text-xs md:text-sm text-trampo-muted font-semibold">
          Visualize os planos disponíveis e configure os limites diários de cada um.
        </p>
      </header>

      {showSkeleton && (
        <div className="w-full rounded-lg border border-trampo-border bg-white overflow-hidden">
          <div className={`${gridCols} px-5 py-3 border-b border-trampo-border bg-neutral-50`}>
            {headers.map((header) => (
              <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                {header}
              </span>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${gridCols} px-5 py-4 border-b border-trampo-border last:border-b-0 animate-pulse`}>
              <div className="h-4 bg-neutral-200 rounded-sm w-3/4" />
              <div className="h-4 bg-neutral-100 rounded-sm w-20" />
              <div className="h-4 bg-neutral-100 rounded-sm w-32" />
              <div className="h-5 bg-neutral-200 rounded-sm w-16" />
              <div className="h-4 bg-neutral-100 rounded-sm w-36" />
              <div className="h-4 bg-neutral-100 rounded-sm w-28" />
              <div className="h-7 bg-neutral-100 rounded-sm w-7" />
            </div>
          ))}
        </div>
      )}

      {!showSkeleton && isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-600 p-5 flex flex-col items-center justify-center text-center space-y-3">
          <XCircle className="w-10 h-10 text-red-500" />
          <h3 className="font-bold text-sm">Não foi possível carregar os planos</h3>
          <p className="text-xs text-red-500/80 max-w-md">
            {queryError?.message || "Ocorreu um erro na requisição com o servidor."}
          </p>
          <Button
            type="button"
            variant="outline"
            className="rounded-md border border-red-300 text-red-600 hover:bg-red-100/50 text-xs font-bold"
            onClick={() => refetch()}
          >
            Tentar Novamente
          </Button>
        </div>
      )}

      {!showSkeleton && !isError && planList.length === 0 && (
        <div className="rounded-lg border border-trampo-border bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <CreditCard className="w-12 h-12 text-neutral-300" />
          <div className="space-y-1">
            <h3 className="font-bold text-trampo-dark text-sm">Nenhum plano encontrado</h3>
            <p className="text-xs text-trampo-muted max-w-sm">
              Os planos cadastrados aparecerão aqui.
            </p>
          </div>
        </div>
      )}

      {!showSkeleton && !isError && planList.length > 0 && (
        <div className="w-full rounded-lg border border-trampo-border bg-white overflow-hidden">
          <div className={`${gridCols} px-5 py-3 border-b border-trampo-border bg-neutral-50`}>
            {headers.map((header) => (
              <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                {header}
              </span>
            ))}
          </div>

          {planList.map((plan) => (
            <div
              key={plan.id}
              onClick={() => openLimits(plan)}
              className={`${gridCols} px-5 py-3.5 border-b border-trampo-border last:border-b-0 hover:bg-neutral-50/50 transition-colors cursor-pointer`}
            >
              <span className="font-bold text-sm text-trampo-dark truncate" title={plan.name}>
                {plan.name}
              </span>

              <span className="text-sm text-trampo-muted font-semibold">
                {formatPrice(plan.price)}
              </span>

              <span className="text-sm text-trampo-muted truncate font-mono" title={plan.stripePriceId}>
                {shortId(plan.stripePriceId)}
              </span>

              <span>
                {plan.active ? (
                  <Badge className="rounded-lg bg-[#F2FCFA] text-trampo-primary-600 border border-trampo-primary-100/50 font-bold">
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="rounded-lg bg-neutral-50 text-neutral-500 font-bold">
                    Inativo
                  </Badge>
                )}
              </span>

              <span
                className="text-xs text-trampo-muted font-semibold truncate"
                title={limitsSummary(plan)}
              >
                {limitsSummary(plan)}
              </span>

              <span className="text-sm text-trampo-muted">
                {formatDate(plan.createdAt)}
              </span>

              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="rounded-lg border border-trampo-border text-trampo-muted hover:text-trampo-dark hover:bg-neutral-50 cursor-pointer"
                  aria-label={`Configurar limites do plano ${plan.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openLimits(plan);
                  }}
                >
                  <Settings className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PlanLimitsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        plan={selectedPlan}
      />
    </div>
  );
}
