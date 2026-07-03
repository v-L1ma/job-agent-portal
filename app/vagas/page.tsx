"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  ExternalLink,
  Globe,
  Sparkles,
  LoaderCircle,
  Building2,
  MoreVertical,
  ThumbsDown,
  FileText,
  Download,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  ApiError,
  getJobs,
  getJobById,
  rateJob,
  generateCvForJob,
  type Job,
} from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

function truncateText(value: string, length = 190): string {
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length).trimEnd()}...`;
}

function normalizeError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocorreu um erro inesperado.";
}

function getPlatformBadge(platform: string) {
  const displayPlatform = platform || "Fonte externa";

  switch (displayPlatform.toLowerCase()) {
    case "linkedin":
      return (
        <Badge className="bg-blue-100 text-blue-700 rounded-none" variant="secondary">
          <Globe className="w-3.5 h-3.5" />
          {displayPlatform}
        </Badge>
      );
    case "vagascombr":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 rounded-none" variant="secondary">
          <Globe className="w-3.5 h-3.5" />
          Vagas.com.br
        </Badge>
      );
    case "gupy":
      return (
        <Badge className="bg-orange-100 text-orange-700 rounded-none" variant="secondary">
          <Globe className="w-3.5 h-3.5" />
          {displayPlatform}
        </Badge>
      );
    case "indeed":
      return (
        <Badge className="bg-purple-100 text-purple-700 rounded-none" variant="secondary">
          <Globe className="w-3.5 h-3.5" />
          {displayPlatform}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-100 text-slate-700 rounded-none" variant="secondary">
          <Globe className="w-3.5 h-3.5" />
          {displayPlatform}
        </Badge>
      );
  }
}

export default function ApplicationsPage() {
  const router = useRouter();
  const { session, logout } = useAuth();

  const [hiddenJobIds, setHiddenJobIds] = useState<Set<string>>(new Set());

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [generatingForJobId, setGeneratingForJobId] = useState<string | null>(null);
  const [generationMessage, setGenerationMessage] = useState<string | null>(null);
  const [cvGenerationState, setCvGenerationState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [generatedCv, setGeneratedCv] = useState<{ blob: Blob; fileName: string } | null>(null);

  const [feedbackJobId, setFeedbackJobId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["jobs"],
    queryFn: ({ pageParam }) => getJobs(10, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const allJobs = useMemo(() => data?.pages.flatMap((p) => p.jobs) ?? [], [data]);

  const visibleJobs = useMemo(
    () => allJobs.filter((j) => !hiddenJobIds.has(j.id)),
    [allJobs, hiddenJobIds]
  );

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleAuthExpiration = () => {
    logout();
    router.replace("/auth/login");
  };

  const openDetails = async (jobId: string) => {
    try {
      setSelectedJobId(jobId);
      setLoadingDetails(true);
      setDetailsError(null);
      const data = await getJobById(jobId);
      setSelectedJob(data);
    } catch (detailsLoadError) {
      setDetailsError(normalizeError(detailsLoadError));
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleGenerateCv = async (jobId: string) => {
    try {
      setGenerationMessage(null);
      setGeneratingForJobId(jobId);
      setCvGenerationState('loading');
      setGeneratedCv(null);

      const generated = await generateCvForJob(jobId);
      setGeneratedCv(generated);
      setCvGenerationState('success');
    } catch (generateError) {
      setCvGenerationState('error');
      if (generateError instanceof ApiError && generateError.status === 401) {
        setGenerationMessage("Sua sessão expirou. Faça login novamente.");
        handleAuthExpiration();
        return;
      }
      setGenerationMessage(normalizeError(generateError));
    } finally {
      setGeneratingForJobId(null);
    }
  };

  const handleDownloadCv = () => {
    if (!generatedCv) return;
    const objectUrl = URL.createObjectURL(generatedCv.blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = generatedCv.fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  };

  const handleNotInterested = async () => {
    if (!feedbackJobId || !session?.userId) return;

    try {
      setIsEvaluating(true);
      await rateJob(feedbackJobId, {
        userId: session.userId,
        liked: false,
        feedback: feedbackText.trim() || undefined,
      });
      setHiddenJobIds((prev) => new Set(prev).add(feedbackJobId));
      setFeedbackJobId(null);
      setFeedbackText("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <DashboardLayout title="Vagas e Candidaturas">
      <div className="flex flex-col -m-4 md:-m-8">
        {isLoading && (
          <div className="px-6 py-3 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400">Carregando vagas...</p>
          </div>
        )}

        {isError && queryError && (
          <div className="px-6 py-3 bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{normalizeError(queryError)}</p>
          </div>
        )}

        {generationMessage && (
          <div className="px-6 pt-4">
            <p className="text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-3 py-2 text-slate-600 dark:text-slate-300">
              {generationMessage}
            </p>
          </div>
        )}

        <div className="bg-slate-50/50 dark:bg-slate-900/10 md:flex-1 md:overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-8 max-w-7xl mx-auto space-y-6">
              {isLoading && (
                <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                  <LoaderCircle className="w-5 h-5 mx-auto mb-2 animate-spin" />
                  Carregando vagas...
                </div>
              )}

              {!isLoading && isError && (
                <div className="rounded-lg border border-red-300/40 bg-red-500/10 text-red-500 px-4 py-3 text-sm">
                  {normalizeError(queryError)}
                </div>
              )}

              {!isLoading && !isError && visibleJobs.length === 0 && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Nenhuma vaga encontrada. Configure suas preferências para receber recomendações.
                </div>
              )}

              {!isLoading && !isError && visibleJobs.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-5 rounded-xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group flex flex-col min-h-[220px]"
                      >
                        <div className="space-y-2 mb-3 relative pr-8">
                          <div className="absolute top-0 right-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-8 w-8 text-slate-800 hover:text-slate-500 dark:text-white flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none">
                                <MoreVertical className="w-4 h-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-fit p-1">
                                <DropdownMenuItem
                                  className="text-red-500 gap-2 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/30 text-nowrap"
                                  onClick={() => setFeedbackJobId(job.id)}
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  Não tenho interesse
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {job.title}
                          </h3>
                          {job.company && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5" />
                              {job.company}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {truncateText(job.description)}
                          </p>
                        </div>

                        <div className="mt-auto space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                          <div className="flex items-center justify-between">
                            {getPlatformBadge(job.platform)}
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary inline-flex items-center gap-1"
                            >
                              Abrir vaga
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <Button variant="outline" className="flex-1" onClick={() => void openDetails(job.id)}>
                              Ver detalhes
                            </Button>
                            <Button
                              className="flex-1"
                              disabled={generatingForJobId === job.id}
                              onClick={() => void handleGenerateCv(job.id)}
                            >
                              {generatingForJobId === job.id ? "Gerando..." : "Gerar currículo personalizado"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                      <LoaderCircle className="w-5 h-5 animate-spin text-slate-400" />
                    </div>
                  )}
                  <div ref={sentinelRef} className="h-1" />
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        <Sheet
          open={Boolean(selectedJobId)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedJobId(null);
              setSelectedJob(null);
              setDetailsError(null);
            }
          }}
        >
          <SheetContent
            side="right"
            className="md:max-w-160 w-full p-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
          >
            <ScrollArea className="h-full">
              <div className="p-8 space-y-6">
                {loadingDetails && (
                  <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <LoaderCircle className="w-5 h-5 mx-auto mb-2 animate-spin" />
                    Carregando detalhes da vaga...
                  </div>
                )}

                {!loadingDetails && detailsError && (
                  <div className="rounded-lg border border-red-300/40 bg-red-500/10 text-red-500 px-4 py-3 text-sm">
                    {detailsError}
                  </div>
                )}

                {!loadingDetails && !detailsError && selectedJob && (
                  <>
                    <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {selectedJob.title}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {selectedJob.company}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => window.open(selectedJob.url, "_blank", "noopener,noreferrer")}
                        >
                          Ir para a vaga
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          disabled={generatingForJobId === selectedJob.id}
                          onClick={() => void handleGenerateCv(selectedJob.id)}
                        >
                          <Sparkles className="w-4 h-4" />
                          {generatingForJobId === selectedJob.id
                            ? "Gerando currículo..."
                            : "Gerar currículo personalizado"}
                        </Button>
                      </div>
                    </header>

                    <section className="space-y-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Descrição da vaga
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {selectedJob.description}
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Status
                      </h3>
                      <Badge variant={selectedJob.active ? "default" : "secondary"}>
                        {selectedJob.active ? "Ativa" : "Inativa"}
                      </Badge>
                      <span className="ml-2 text-xs text-slate-500">
                        {selectedJob.isApplied ? "Candidatura enviada" : "Não candidatado"}
                      </span>
                    </section>
                  </>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {feedbackJobId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden scale-in animate-in zoom-in-95 duration-200">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ThumbsDown className="w-5 h-5 text-red-500" />
                    Não tenho interesse
                  </h3>
                  <button onClick={() => setFeedbackJobId(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Conte-nos por que essa vaga não lhe interessa (opcional, máx 100 caracteres).
                </p>

                <div className="space-y-1">
                  <Textarea
                    placeholder="Ex: Stack não compatível, Localização ruim..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value.slice(0, 100))}
                    className="min-h-[100px] resize-none"
                    maxLength={100}
                  />
                  <div className="text-[10px] text-right text-slate-400">
                    {feedbackText.length}/100
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setFeedbackJobId(null)}>
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleNotInterested}
                    disabled={isEvaluating}
                  >
                    {isEvaluating ? <LoaderCircle className="w-4 h-4 animate-spin mr-2" /> : null}
                    Confirmar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {cvGenerationState !== 'idle' && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 text-center space-y-6">
                {cvGenerationState === 'loading' && (
                  <div className="space-y-4 py-4">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Gerando seu currículo...</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Nossa IA está personalizando cada detalhe para esta vaga.
                      </p>
                    </div>
                  </div>
                )}

                {cvGenerationState === 'success' && generatedCv && (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <div className="space-y-1 text-center">
                        <h3 className="text-xl font-bold">Tudo pronto!</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Seu currículo foi gerado com sucesso.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 text-left">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <FileText className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{generatedCv.fileName}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">PDF Document</p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={handleDownloadCv}>
                        <Download className="w-5 h-5 text-slate-600" />
                      </Button>
                    </div>

                    <div className="pt-2 flex flex-col gap-3">
                      <Button className="w-full h-11" onClick={handleDownloadCv}>
                        <Download className="mr-2 w-4 h-4" />
                        Baixar currículo agora
                      </Button>
                      <Button variant="ghost" className="text-xs w-full h-10 text-slate-500" onClick={() => setCvGenerationState('idle')}>
                        Fechar
                      </Button>
                    </div>
                  </div>
                )}

                {cvGenerationState === 'error' && (
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                      <X className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Ops! Algo deu errado</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {generationMessage || "Não foi possível gerar seu currículo no momento."}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setCvGenerationState('idle')}>
                      Tentar mais tarde
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
