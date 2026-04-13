"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Search,
  Calendar,
  ExternalLink,
  Globe,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Building2,
  MoreVertical,
  ThumbsDown,
  FileText,
  Download,
  CheckCircle2,
  X,
  Clock,
} from "lucide-react";
import {
  ApiError,
  generateCvForJob,
  getJobById,
  evaluateJob,
  type JobDetailsResponse,
  type JobListItem,
  type GenerateCvResponse,
} from "@/lib/api";
import { useJobSearch } from "@/hooks/use-job-search";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";

const PAGE_SIZE = 9;

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

function getPlatformBadge(platform: string | undefined) {
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
  const { logout } = useAuth();
  const {
    jobs: searchJobs,
    isLoading: isSearching,
    isPolling,
    meta: searchMeta,
    error: searchError,
    searchJobs: performSearch,
  } = useJobSearch();

  const [stackFilter, setStackFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [page, setPage] = useState(1);

  const debouncedStackFilter = useDebounce(stackFilter, 500);
  const debouncedLocationFilter = useDebounce(locationFilter, 500);

  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobDetailsResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [generatingForJobId, setGeneratingForJobId] = useState<string | null>(null);
  const [generationMessage, setGenerationMessage] = useState<string | null>(null);
  const [cvGenerationState, setCvGenerationState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [generatedCv, setGeneratedCv] = useState<GenerateCvResponse | null>(null);

  const [feedbackJobId, setFeedbackJobId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleAuthExpiration = useCallback(() => {
    logout();
    router.replace("/auth/login");
  }, [logout, router]);

  const jobsCount = jobs.length;
  const totalItems = searchMeta?.totalItems ?? jobsCount;
  const totalPages = Math.max(searchMeta?.totalPages ?? 1, 1);
  const loading = isSearching;
  const displayedError = error ?? searchError;

  const loadJobs = useCallback(async () => {
    try {
      setError(null);

      await performSearch({
        stack: debouncedStackFilter.trim() || undefined,
        page,
        pageSize: PAGE_SIZE,
      });
    } catch (loadError) {
      setError(normalizeError(loadError));
    }
  }, [debouncedStackFilter, page, performSearch]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    setJobs(searchJobs);
  }, [searchJobs]);

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
      
      // Auto-download is still nice, but the user wanted a result UI
      /*
      const objectUrl = URL.createObjectURL(generated.blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = generated.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
      */

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
    if (!feedbackJobId) return;

    try {
      setIsEvaluating(true);
      await evaluateJob(feedbackJobId, {
        liked: false,
        feedback: feedbackText.trim() || undefined,
      });
      // Remove from list or just close
      setJobs(jobs.filter(j => j.id !== feedbackJobId));
      setFeedbackJobId(null);
      setFeedbackText("");
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar feedback.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleEvaluateCv = async (liked: boolean) => {
    if (!generatingForJobId && !selectedJobId && !generatedCv) return; 
    // This is for the generated CV evaluation
    // For now we'll assume the same endpoint works if we have the jobId
    const jobId = generatingForJobId || selectedJobId || (generatedCv ? jobs.find(j => true /* matching logic */)?.id : null);
    // Actually we need the jobId from the context
  };

  const jobsCounterLabel = useMemo(() => {
    if (!totalItems) {
      return "0 vagas encontradas";
    }

    return `${totalItems} vagas encontradas`;
  }, [totalItems]);

  return (
    <DashboardLayout title="Vagas e Candidaturas">
      <div className="flex flex-col h-full -m-4 md:-m-8">
        <div className="p-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 shrink-0 px-6">
          <div className="relative flex items-center w-full md:flex-1 md:max-w-[380px]">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Faça sua busca por vagas (ex: React, .NET, etc)"
              value={stackFilter}
              onChange={(event) => {
                setPage(1);
                setStackFilter(event.target.value);
              }}
              className="pl-10 h-10"
            />
          </div>

          <Button className="h-10 px-4" onClick={() => void loadJobs()}>
            Atualizar
          </Button>

          <div className="ml-auto text-sm text-slate-500 dark:text-slate-400">{jobsCounterLabel}</div>
        </div>

        {isPolling && (
          <div className="px-6 py-3 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Buscando vagas nas plataformas...
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Isso pode levar alguns instantes
                </p>
              </div>
            </div>
          </div>
        )}

        {searchError && (
          <div className="px-6 py-3 bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">
              {searchError}
            </p>
          </div>
        )}

        {generationMessage && (
          <div className="px-6 pt-4">
            <p className="text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-3 py-2 text-slate-600 dark:text-slate-300">
              {generationMessage}
            </p>
          </div>
        )}

        <div className="flex-1 overflow-hidden bg-slate-50/50 dark:bg-slate-900/10 h-full">
          <ScrollArea className="h-full">
            <div className="p-8 max-w-7xl mx-auto space-y-6">
              {jobsCount === 0 && (loading || isPolling) && (
                <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                  <LoaderCircle className="w-5 h-5 mx-auto mb-2 animate-spin" />
                  {isPolling ? "Buscando vagas nas plataformas..." : "Carregando vagas..."}
                </div>
              )}

              {!loading && displayedError && (
                <div className="rounded-lg border border-red-300/40 bg-red-500/10 text-red-500 px-4 py-3 text-sm">
                  {displayedError}
                </div>
              )}

              {!loading && !displayedError && jobsCount === 0 && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Nenhuma vaga encontrada para os filtros aplicados.
                </div>
              )}

              {!loading && !displayedError && jobsCount > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-5 rounded-xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group flex flex-col min-h-[220px]"
                      >
                        <div className="space-y-2 mb-3 relative pr-8">
                          <div className="absolute top-0 right-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-8 w-8 text-slate-800 hover:text-slate-500 dark:hover:text-white flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none">
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
                              {generatingForJobId === job.id ? "Gerando..." : "Gerar curriculo personalizado"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Página {page} de {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((value) => Math.max(1, value - 1))}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        disabled={page >= totalPages || loading}
                        onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                      >
                        Próxima
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
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
            className="max-w-[640px] w-full p-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
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
                            ID plataforma: {selectedJob.plataformJobId}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Atualizada na API
                        </span>
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
                            ? "Gerando curriculo..."
                            : "Gerar curriculo personalizado"}
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
                        Análise da vaga
                      </h3>

                      {selectedJob.analysis ? (
                        <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Skills</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {selectedJob.analysis.skills}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Nível</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {selectedJob.analysis.nivel}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Keywords</p>
                            <p className="text-sm text-slate-700ve dark:text-slate-300">
                              {selectedJob.analysis.keywords}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Essa vaga ainda não possui análise automática.
                        </p>
                      )}
                    </section>
                  </>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Modal feedback "Não tenho interesse" */}
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

        {/* Modal de Loading / Sucesso Geração CV */}
        {cvGenerationState !== 'idle' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
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
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="text-xs text-slate-500">O que achou do currículo?</span>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-3 rounded-full hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600"
                            onClick={() => {
                              // We could call a similar evaluateCv logic
                              setCvGenerationState('idle');
                            }}
                          >
                            Gostei
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-3 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500"
                            onClick={() => {
                              setFeedbackJobId(generatingForJobId || selectedJobId);
                              setCvGenerationState('idle');
                            }}
                          >
                            Não gostei
                          </Button>
                        </div>
                      </div>
                      
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
