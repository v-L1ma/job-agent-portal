"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CvAnalysisForm } from "@/components/curriculo/analise/cv-analysis-form";
import { CvAnalysisResult } from "@/components/curriculo/analise/cv-analysis-result";
import { getScoreToneClasses } from "@/components/curriculo/analise/score-ring";
import { getCvAnalyses, getCvAnalysis } from "@/services/cv-analysis";
import type {
  CvAnalysisListItem,
  CvAnalysisResult as CvAnalysisResultData,
} from "@/types/cv-analysis";
import {
  Briefcase,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  FileSearch,
  History,
  RefreshCw,
  Sparkles,
} from "lucide-react";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AnaliseCurriculoPage() {
  const [result, setResult] = useState<CvAnalysisResultData | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [history, setHistory] = useState<CvAnalysisListItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  // Apenas busca o histórico; todo setState acontece após o await (fora do
  // corpo síncrono do effect), evitando renders em cascata.
  const fetchHistory = useCallback(async () => {
    try {
      const items = await getCvAnalyses();
      setHistory(items);
      setHistoryError(null);
    } catch (error) {
      setHistoryError(
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível carregar o histórico de análises."
      );
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Estado inicial já é "carregando" — o effect só dispara a primeira busca.
  // Mesmo padrão de `curriculo-form.tsx`: o setState acontece no async IIFE.
  useEffect(() => {
    void (async () => {
      await fetchHistory();
    })();
  }, [fetchHistory]);

  function handleRetryHistory() {
    setHistoryLoading(true);
    setHistoryError(null);
    void fetchHistory();
  }

  // Sempre que um resultado é definido (nova análise ou histórico), rola até o viewer.
  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  function handleAnalyzed(newResult: CvAnalysisResultData) {
    setResult(newResult);
    setActiveId(newResult.id ?? null);
    setDetailError(null);
    void fetchHistory(); // atualiza a lista sem exibir o estado de loading
  }

  async function handleSelectAnalysis(item: CvAnalysisListItem) {
    if (detailLoading) return;
    setDetailLoading(true);
    setDetailError(null);
    try {
      const full = await getCvAnalysis(item.id);
      setResult(full);
      setActiveId(item.id);
    } catch (error) {
      setDetailError(
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível carregar a análise."
      );
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <header className="mb-2">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">
          Analisar Currículo
        </h1>
        <p className="text-xs md:text-sm text-trampo-muted font-semibold">
          Envie seu currículo para a IA receber um score de 0 a 100, pontos fortes e melhorias — e
          acompanhe o histórico das suas análises.
        </p>
      </header>

      {/* Analisar agora */}
      <section className="overflow-hidden rounded-lg border border-trampo-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.015)]">
        <div className="flex items-center gap-3 border-b border-neutral-50 p-5 md:p-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-trampo-primary-50">
            <Sparkles className="size-4.5 text-trampo-primary-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-trampo-dark md:text-base">Analisar agora</h2>
            <p className="text-[11px] font-semibold text-trampo-muted">
              PDF de até 10MB. Opcionalmente, avalie o fit com uma vaga específica.
            </p>
          </div>
        </div>
        <div className="p-5 md:p-6">
          <CvAnalysisForm variant="private" onAnalyzed={handleAnalyzed} />
        </div>
      </section>

      {/* Resultado */}
      {result && (
        <div ref={resultRef} className="scroll-mt-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-trampo-muted">
              {activeId ? "Análise selecionada" : "Resultado da análise"}
            </h2>
            {detailLoading && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-trampo-primary-500">
                <RefreshCw className="size-3.5 animate-spin" />
                Carregando...
              </span>
            )}
          </div>

          {detailError && (
            <div
              role="alert"
              className="mb-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <span>{detailError}</span>
            </div>
          )}

          <CvAnalysisResult result={result} loading={detailLoading} />
        </div>
      )}

      {/* Histórico */}
      <section className="overflow-hidden rounded-lg border border-trampo-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.015)]">
        <div className="flex items-center justify-between gap-3 border-b border-neutral-50 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-trampo-primary-50">
              <History className="size-4.5 text-trampo-primary-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-trampo-dark md:text-base">
                Histórico de análises
              </h2>
              <p className="text-[11px] font-semibold text-trampo-muted">
                Clique em uma análise para revisar o resultado completo.
              </p>
            </div>
          </div>
          {!historyLoading && !historyError && history.length > 0 && (
            <Badge
              variant="secondary"
              className="hidden bg-neutral-100 text-neutral-500 hover:bg-neutral-100 sm:inline-flex"
            >
              {history.length} de até 50
            </Badge>
          )}
        </div>

        <div className="p-5 md:p-6">
          {historyLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-md border border-trampo-border bg-white p-3"
                >
                  <Skeleton className="h-10 w-10 shrink-0 rounded-md" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3 rounded-md" />
                    <Skeleton className="h-3 w-2/3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : historyError ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <CircleAlert className="size-6 text-red-400" />
              </div>
              <p className="mb-1 text-xs font-bold text-trampo-dark">
                Não foi possível carregar o histórico
              </p>
              <p className="mb-4 max-w-sm text-[11px] font-semibold leading-relaxed text-trampo-muted">
                {historyError}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleRetryHistory}
                className="rounded-md border border-trampo-border text-trampo-dark hover:bg-neutral-50 font-bold text-xs h-9 px-4 inline-flex items-center gap-1.5"
              >
                <RefreshCw className="size-3.5" />
                Tentar novamente
              </Button>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-trampo-primary-50">
                <FileSearch className="size-7 text-trampo-primary-500" />
              </div>
              <p className="mb-1 text-xs font-bold text-trampo-dark">Nenhuma análise ainda</p>
              <p className="max-w-sm text-[11px] font-semibold leading-relaxed text-trampo-muted">
                Faça sua primeira análise na seção acima — cada análise salva aparecerá aqui para
                você revisar depois.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => void handleSelectAnalysis(item)}
                    disabled={detailLoading}
                    className={cn(
                      "group flex w-full cursor-pointer items-center gap-3 rounded-md border p-3 text-left transition-all disabled:cursor-wait disabled:opacity-60",
                      activeId === item.id
                        ? "border-trampo-primary-400 bg-[#F2FCFA]"
                        : "border-trampo-border bg-white hover:border-trampo-primary-400 hover:bg-[#F2FCFA]/40"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border text-sm font-extrabold",
                        getScoreToneClasses(item.score)
                      )}
                    >
                      {item.score}
                    </span>

                    <span className="min-w-0 flex-1">
                      {item.jobTitle ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-trampo-dark">
                          <Briefcase className="size-3.5 shrink-0 text-trampo-primary-500" />
                          <span className="truncate">{item.jobTitle}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-trampo-dark">
                          Análise geral do currículo
                        </span>
                      )}

                      <span className="mt-1 block line-clamp-2 text-[11px] font-semibold leading-snug text-trampo-muted">
                        {item.summary}
                      </span>

                      <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-neutral-400">
                        <CalendarDays className="size-3" />
                        {formatDate(item.createdAt)}
                      </span>
                    </span>

                    <ChevronRight className="size-4 shrink-0 text-neutral-300 transition-colors group-hover:text-trampo-primary-500" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
