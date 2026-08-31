"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { FileText, XCircle, Pencil, Check, X, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getApplications, updateQuestion } from "@/services/application";
import { Application } from "@/types/application";
import { PlatformBadge } from "@/components/jobs/platform-badge";

type AplicacaoStatus = "Sucesso" | "Pendente" | "Falha";

const statusMap: Record<string, AplicacaoStatus> = {
  success: "Sucesso",
  pending: "Pendente",
  failed: "Falha",
};

const statusStyles: Record<AplicacaoStatus, string> = {
  Sucesso: "bg-trampo-primary-600 text-white hover:bg-trampo-primary-700 hover:opacity-80",
  Pendente: "bg-amber-500 text-white hover:bg-amber-600 hover:opacity-80",
  Falha: "bg-red-700 text-white hover:bg-red-800 hover:opacity-80",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function mapApplication(app: Application) {
  return {
    id: app.id,
    titulo: app.title,
    empresa: app.company,
    plataforma: app.platform,
    perguntas: app.questionsCount,
    data: formatDate(app.createdAt),
    status: statusMap[app.status] || "Pendente",
    respostas: app.questions.map((q) => ({
      id: q.id,
      pergunta: q.question,
      resposta: q.answer,
      tipo: q.type,
      opcoes: q.options,
    })),
  };
}

const headers = ["Título", "Empresa", "Plataforma", "Perguntas", "Data", "Status"];

export default function AplicacoesPage() {
  const { status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
    enabled: sessionStatus === "authenticated",
  });

  const mutation = useMutation({
    mutationFn: ({ questionId, answer }: { questionId: string; answer: string }) =>
      updateQuestion(questionId, { answer }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setEditingKey(null);
      setEditValue("");
    },
  });

  const aplicacoes = data?.data?.map(mapApplication) ?? [];
  const showSkeleton = sessionStatus === "loading" || (isLoading && aplicacoes.length === 0);

  function handleEdit(aplicacaoId: string, index: number, respostaId: string, respostaAtual: string) {
    const key = `${aplicacaoId}-${index}`;
    setEditingKey(key);
    setEditValue(respostaAtual);
  }

  function handleCancel() {
    setEditingKey(null);
    setEditValue("");
    mutation.reset();
  }

  function handleSave(questionId: string) {
    mutation.mutate({ questionId, answer: editValue });
  }

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">Candidaturas</h1>
        <p className="text-xs md:text-sm text-trampo-muted font-semibold">
          Gerencie suas candidaturas e acompanhe o status e respostas de cada uma delas.
        </p>
      </header>

      {showSkeleton && (
        <div className="w-full rounded-2xl border border-trampo-border bg-white overflow-hidden">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.9fr_0.8fr] gap-2 items-center px-5 py-3 border-b border-trampo-border bg-neutral-50">
            {headers.map((header) => (
              <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                {header}
              </span>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.9fr_0.8fr] gap-2 items-center px-5 py-4 border-b border-trampo-border last:border-b-0 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-4 bg-neutral-100 rounded w-2/3" />
              <div className="h-4 bg-neutral-100 rounded w-1/2" />
              <div className="h-4 bg-neutral-100 rounded w-8" />
              <div className="h-4 bg-neutral-100 rounded w-20" />
              <div className="h-5 bg-neutral-200 rounded w-16" />
            </div>
          ))}
        </div>
      )}

      {!showSkeleton && isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 p-5 flex flex-col items-center justify-center text-center space-y-3">
          <XCircle className="w-10 h-10 text-red-500" />
          <h3 className="font-bold text-sm">Não foi possível carregar as candidaturas</h3>
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

      {!showSkeleton && !isError && (aplicacoes?.length ?? 0) === 0 && (
        <div className="rounded-2xl border border-trampo-border bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <FileText className="w-12 h-12 text-neutral-300" />
          <div className="space-y-1">
            <h3 className="font-bold text-trampo-dark text-sm">Nenhuma candidatura encontrada</h3>
            <p className="text-xs text-trampo-muted max-w-sm">
              Suas candidaturas aparecerão aqui assim que forem enviadas.
            </p>
          </div>
        </div>
      )}

      {!showSkeleton && !isError && (aplicacoes?.length ?? 0) > 0 && (
        <div className="w-full rounded-2xl border border-trampo-border bg-white overflow-hidden">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.9fr_0.8fr] gap-2 items-center px-5 py-3 border-b border-trampo-border bg-neutral-50">
            {headers.map((header) => (
              <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                {header}
              </span>
            ))}
          </div>

          {aplicacoes.some((a) => a.respostas.length > 0) ? (
            <Accordion multiple>
              {aplicacoes.map((aplicacao) =>
                aplicacao.respostas.length > 0 ? (
                  <AccordionItem key={aplicacao.id} value={aplicacao.id} className="border-b border-trampo-border last:border-b-0">
                    <AccordionTrigger className="hover:no-underline hover:bg-neutral-50/70 transition-colors px-5">
                      <div className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.8fr_0.8fr] gap-2 items-center w-full pr-2">
                        <span className="font-bold text-sm text-trampo-dark truncate">{aplicacao.titulo}</span>
                        <span className="text-sm text-trampo-muted truncate">{aplicacao.empresa}</span>
                        <span className="text-sm text-trampo-muted truncate capitalize"><PlatformBadge platform={aplicacao.plataforma} /></span>
                        <span className="text-sm text-trampo-muted">{aplicacao.perguntas}</span>
                        <span className="text-sm text-trampo-muted">{aplicacao.data}</span>
                        <Badge className={`justify-self-start rounded-sm font-bold w-20 ${statusStyles[aplicacao.status]}`}>{aplicacao.status}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.8fr_0.8fr] gap-2 items-center w-full border-t border-trampo-border px-5 py-2">
                        <span className="col-span-3 text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                          Perguntas
                        </span>
                        <span className="col-span-3 text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                          Respostas
                        </span>
                      </div>
                      {aplicacao.respostas.map((resposta, index) => {
                        const key = `${aplicacao.id}-${index}`;
                        const isEditing = editingKey === key;

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.8fr_0.8fr] gap-2 items-start w-full border-t border-trampo-border px-5 py-2"
                          >
                            <span className="col-span-3 text-sm text-trampo-muted">{resposta.pergunta}</span>
                            <div className="col-span-3 flex items-start gap-2">
                              {isEditing ? (
                                <>
                                  {(resposta.tipo === "select" || resposta.tipo === "radio") && resposta.opcoes ? (
                                    <select
                                      className="flex-1 text-sm text-trampo-dark border border-trampo-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-trampo-primary-500 focus:border-transparent"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                    >
                                      {resposta.opcoes.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>
                                  ) : resposta.tipo === "numeric" ? (
                                    <input
                                      type="number"
                                      min={0}
                                      max={99}
                                      className="flex-1 text-sm text-trampo-dark border border-trampo-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trampo-primary-500 focus:border-transparent"
                                      value={editValue}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "" || (Number(val) >= 0 && Number(val) <= 99)) {
                                          setEditValue(val);
                                        }
                                      }}
                                    />
                                  ) : (
                                    <textarea
                                      className="flex-1 text-sm text-trampo-dark border border-trampo-border rounded-lg px-3 py-2 resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-trampo-primary-500 focus:border-transparent"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      rows={3}
                                    />
                                  )}
                                  <div className="flex flex-col gap-1 shrink-0">
                                    <Button
                                      type="button"
                                      size="icon"
                                      className="h-7 w-7 bg-trampo-primary-600 hover:bg-trampo-primary-700 text-white rounded-lg"
                                      onClick={() => handleSave(resposta.id)}
                                      disabled={mutation.isPending}
                                    >
                                      {mutation.isPending ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <Check className="h-3.5 w-3.5" />
                                      )}
                                    </Button>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="outline"
                                      className="h-7 w-7 border-trampo-border text-trampo-muted hover:bg-neutral-100 rounded-lg"
                                      onClick={handleCancel}
                                      disabled={mutation.isPending}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <span className="flex-1 text-sm text-trampo-muted">{resposta.resposta}</span>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 shrink-0 text-trampo-muted hover:text-trampo-primary-600 hover:bg-trampo-primary-50 rounded-lg"
                                    onClick={() => handleEdit(aplicacao.id, index, resposta.id, resposta.resposta)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <div key={aplicacao.id} className="border-b border-trampo-border last:border-b-0 pl-5 pr-11 py-3">
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.8fr_0.8fr] gap-2 items-center w-full">
                      <span className="font-bold text-sm text-trampo-dark truncate">{aplicacao.titulo}</span>
                      <span className="text-sm text-trampo-muted truncate">{aplicacao.empresa}</span>
                      <span className="text-sm text-trampo-muted truncate capitalize"><PlatformBadge platform={aplicacao.plataforma} /></span>
                      <span className="text-sm text-trampo-muted">{aplicacao.perguntas}</span>
                      <span className="text-sm text-trampo-muted">{aplicacao.data}</span>
                      <Badge className={`justify-self-start rounded-sm font-bold w-20 ${statusStyles[aplicacao.status]}`}>{aplicacao.status}</Badge>
                    </div>
                  </div>
                )
              )}
            </Accordion>
          ) : (
            aplicacoes.map((aplicacao) => (
              <div key={aplicacao.id} className="border-b border-trampo-border last:border-b-0 px-5 py-3">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.8fr_0.8fr] gap-2 items-center w-full">
                  <span className="font-bold text-sm text-trampo-dark truncate">{aplicacao.titulo}</span>
                  <span className="text-sm text-trampo-muted truncate">{aplicacao.empresa}</span>
                  <span className="text-sm text-trampo-muted truncate capitalize"><PlatformBadge platform={aplicacao.plataforma} /></span>
                  <span className="text-sm text-trampo-muted">{aplicacao.perguntas}</span>
                  <span className="text-sm text-trampo-muted">{aplicacao.data}</span>
                  <Badge className={`justify-self-start rounded-sm font-bold w-20 ${statusStyles[aplicacao.status]}`}>{aplicacao.status}</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
