"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Cpu, XCircle, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getScrapperLogs, getExecutionJobs } from "@/services/scrapper";
import { getSearchQuery } from "@/services/search-query";
import { SearchQuery } from "@/types/search-query";
import { ScrapperLog, ExecutionJob } from "@/types/scrapper";

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

const statusStyles: Record<string, string> = {
  success: "bg-trampo-primary-600 text-white hover:bg-trampo-primary-700 hover:opacity-80",
  error: "bg-red-700 text-white hover:bg-red-800 hover:opacity-80",
  running: "bg-amber-500 text-white hover:bg-amber-600 hover:opacity-80",
  pending: "bg-neutral-500 text-white hover:bg-neutral-600 hover:opacity-80",
};

const statusLabels: Record<string, string> = {
  success: "Sucesso",
  error: "Erro",
  running: "Executando",
  pending: "Pendente",
};

const logHeaders = ["Plataforma", "Data/Hora", "Status", "Vagas Salvas", "Obs"];
const jobHeaders = ["Título", "Plataforma", "Empresa"];

function ExecutionJobs({ executionId }: { executionId: string }) {
  const { status: sessionStatus } = useSession();

  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["execution-jobs", executionId],
    queryFn: () => getExecutionJobs(executionId),
    enabled: sessionStatus === "authenticated",
  });

  const jobs: ExecutionJob[] = data?.jobs ?? [];

  if (isLoading) {
    return (
      <div className="px-5 py-3 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr] gap-2 items-center animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
            <div className="h-4 bg-neutral-100 rounded w-1/2" />
            <div className="h-4 bg-neutral-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-5 py-3 flex items-center justify-center text-center gap-2">
        <XCircle className="w-4 h-4 text-red-500" />
        <p className="text-xs text-red-500">{queryError?.message || "Erro ao carregar vagas."}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl border border-red-300 text-red-600 hover:bg-red-100/50 text-xs font-bold h-6"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="px-5 py-3 text-xs text-trampo-muted">
        Nenhuma vaga encontrada para esta execução.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-2 items-center px-5 py-2 border-t border-trampo-border">
        {jobHeaders.map((header) => (
          <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
            {header}
          </span>
        ))}
      </div>
      {jobs.map((job) => (
        <div
          key={job.Id}
          className="grid grid-cols-[1.5fr_1fr_1fr] gap-2 items-center px-5 py-2 border-t border-trampo-border hover:bg-neutral-50/50 transition-colors"
        >
          <a
            href={job.Url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-sm text-trampo-primary-600 hover:underline truncate flex items-center gap-1"
            title={job.Title}
          >
            {job.Title}
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
          <span className="text-sm text-trampo-muted truncate capitalize">
            {job.Platform}
          </span>
          <span className="text-sm text-trampo-muted truncate">
            {job.Company}
          </span>
        </div>
      ))}
    </>
  );
}

function ScraperLogs({ searchQueryId }: { searchQueryId: string }) {
  const { status: sessionStatus } = useSession();
  const [openExecutions, setOpenExecutions] = useState<string[]>([]);

  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["scrapper-logs", searchQueryId],
    queryFn: () => getScrapperLogs(searchQueryId),
    enabled: sessionStatus === "authenticated",
  });

  const logs: ScrapperLog[] = data?.logs ?? [];

  if (isLoading) {
    return (
      <div className="px-5 py-4 space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="grid grid-cols-[1fr_1.2fr_0.8fr_0.6fr_1fr] gap-2 items-center animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/2" />
            <div className="h-4 bg-neutral-100 rounded w-2/3" />
            <div className="h-5 bg-neutral-200 rounded w-16" />
            <div className="h-4 bg-neutral-100 rounded w-8" />
            <div className="h-4 bg-neutral-100 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-5 py-4 flex flex-col items-center justify-center text-center space-y-2">
        <XCircle className="w-6 h-6 text-red-500" />
        <p className="text-xs text-red-500">{queryError?.message || "Erro ao carregar logs."}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl border border-red-300 text-red-600 hover:bg-red-100/50 text-xs font-bold"
          onClick={() => refetch()}
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="px-5 py-4 text-xs text-trampo-muted">
        Nenhum log de execução encontrado para esta consulta.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[1fr_1.2fr_0.8fr_0.6fr_1fr] gap-2 items-center px-5 py-2 border-t border-trampo-border">
        {logHeaders.map((header) => (
          <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
            {header}
          </span>
        ))}
      </div>
      <Accordion
        multiple
        value={openExecutions}
        onValueChange={(value) => setOpenExecutions(value as string[])}
      >
        {logs.map((log) => {
          const statusKey = log.Status?.toLowerCase() ?? "pending";
          const hasJobs = log.SavedJobsCount > 0;
          const row = (
            <div className="grid grid-cols-[1fr_1.2fr_0.8fr_0.6fr_1fr] gap-2 items-center w-full pr-2">
              <span className="text-sm text-trampo-muted truncate capitalize">
                {log.Platform}
              </span>
              <span className="text-sm text-trampo-muted">
                {formatDate(log.ExecutedAt)}
              </span>
              <Badge className={`justify-self-start rounded-sm font-bold w-auto px-2 ${statusStyles[statusKey] ?? statusStyles.pending}`}>
                {statusLabels[statusKey] ?? log.Status}
              </Badge>
              <span className="text-sm text-trampo-muted font-semibold">
                {log.SavedJobsCount}
              </span>
              <span className="text-sm text-trampo-muted truncate" title={log.Obs ?? "-"}>
                {log.Obs ?? "-"}
              </span>
            </div>
          );

          if (!hasJobs) {
            return (
              <div key={log.Id} className="border-t border-trampo-border px-5 py-2.5">
                {row}
              </div>
            );
          }

          return (
            <AccordionItem key={log.Id} value={log.Id} className="border-t border-trampo-border">
              <AccordionTrigger className="hover:no-underline hover:bg-neutral-50/50 transition-colors px-5 py-2.5">
                {row}
              </AccordionTrigger>
              <AccordionContent>
                <ExecutionJobs executionId={log.ExecutionId} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
}

export default function ScrapersPage() {
  const { status: sessionStatus } = useSession();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["search-queries"],
    queryFn: getSearchQuery,
    enabled: sessionStatus === "authenticated",
  });

  const searchQueries: SearchQuery[] = data?.logs ?? [];
  const showSkeleton = sessionStatus === "loading" || (isLoading && searchQueries.length === 0);

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">
          Scrapers
        </h1>
        <p className="text-xs md:text-sm text-trampo-muted font-semibold">
          Acompanhe as consultas de busca e o histórico de execuções dos scrapers.
        </p>
      </header>

      {showSkeleton && (
        <div className="w-full rounded-2xl border border-trampo-border bg-white overflow-hidden">
          <div className="grid grid-cols-[1fr_1.2fr_0.6fr_0.7fr_0.8fr_0.8fr] gap-2 items-center px-5 py-3 border-b border-trampo-border bg-neutral-50">
            {["Consulta", "Palavras-chave", "Execuções", "Última Execução", "Área", "Níveis"].map((header) => (
              <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                {header}
              </span>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[1fr_1.2fr_0.6fr_0.7fr_0.8fr_0.8fr] gap-2 items-center px-5 py-4 border-b border-trampo-border last:border-b-0 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="flex gap-1">
                <div className="h-4 bg-neutral-100 rounded w-16" />
                <div className="h-4 bg-neutral-100 rounded w-20" />
              </div>
              <div className="h-4 bg-neutral-100 rounded w-8" />
              <div className="h-4 bg-neutral-100 rounded w-24" />
              <div className="h-4 bg-neutral-100 rounded w-1/2" />
              <div className="flex gap-1">
                <div className="h-4 bg-neutral-200 rounded w-12" />
                <div className="h-4 bg-neutral-200 rounded w-14" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!showSkeleton && isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 p-5 flex flex-col items-center justify-center text-center space-y-3">
          <XCircle className="w-10 h-10 text-red-500" />
          <h3 className="font-bold text-sm">Não foi possível carregar as consultas</h3>
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

      {!showSkeleton && !isError && searchQueries.length === 0 && (
        <div className="rounded-2xl border border-trampo-border bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <Cpu className="w-12 h-12 text-neutral-300" />
          <div className="space-y-1">
            <h3 className="font-bold text-trampo-dark text-sm">Nenhuma consulta encontrada</h3>
            <p className="text-xs text-trampo-muted max-w-sm">
              As consultas de busca dos scrapers aparecerão aqui assim que forem cadastradas.
            </p>
          </div>
        </div>
      )}

      {!showSkeleton && !isError && searchQueries.length > 0 && (
        <div className="w-full rounded-2xl border border-trampo-border bg-white overflow-hidden">
          <div className="grid grid-cols-[2.5fr_3.1fr_0.8fr_1fr_1fr_1fr] gap-2 items-center px-5 py-3 border-b border-trampo-border bg-neutral-50">
            {["Consulta", "Palavras-chave", "Execuções", "Última Execução", "Níveis"].map((header) => (
              <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                {header}
              </span>
            ))}
          </div>

          <Accordion
            multiple
            value={openItems}
            onValueChange={(value) => setOpenItems(value as string[])}
          >
            {searchQueries.map((sq) => {
              const hasExecutions = sq.Executions > 0;
              const row = (
                <div className="grid grid-cols-[2.5fr_3.1fr_0.8fr_1fr_1fr_1fr] gap-2 items-center w-full">
                  <span className="font-bold text-sm text-trampo-dark truncate" title={sq.Query}>
                    {sq.Query}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sq.Keywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-sm text-trampo-muted text-center font-semibold">
                    {sq.Executions}
                  </span>
                  <span className="text-sm text-trampo-muted text-center">
                    {sq.LastExecutedAt ? formatDate(sq.LastExecutedAt) : "-"}
                  </span>
                  <div className="flex flex-wrap gap-1 pl-2">
                    {sq.Levels.map((level) => (
                      <Badge key={level} variant="outline" className="text-xs">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
              );

              if (!hasExecutions) {
                return (
                  <div key={sq.Id} className="border-b border-trampo-border last:border-b-0 px-5 pr-9 py-2.5">
                    {row}
                  </div>
                );
              }

              return (
                <AccordionItem key={sq.Id} value={sq.Id} className="border-b border-trampo-border last:border-b-0">
                  <AccordionTrigger className="hover:no-underline hover:bg-neutral-50/70 transition-colors px-5">
                    {row}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScraperLogs searchQueryId={sq.Id} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
}
