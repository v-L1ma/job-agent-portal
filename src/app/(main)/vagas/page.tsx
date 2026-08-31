"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { LoaderCircle, Briefcase, XCircle } from "lucide-react";
import {
  getJobs,
  getJobById,
  rateJob,
  generateCvForJob,
} from "@/services/job";
import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";

// Import modular components
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";
import { JobDetailsDrawer } from "@/components/jobs/job-details-drawer";
import { FeedbackModal } from "@/components/jobs/feedback-modal";
import { CvGenerationModal } from "@/components/jobs/cv-generation-modal";

export default function VagasPage() {
  const { data: session, status: sessionStatus } = useSession();

  // Filters Input State
  const [filterStack, setFilterStack] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");

  // Query Parameters (Refetched only on submit or clear)
  const [queryParams, setQueryParams] = useState({
    stack: "",
    company: "",
    location: "",
    platform: "",
  });

  // Local state for rated/hidden job IDs
  const [hiddenJobIds, setHiddenJobIds] = useState<Set<string>>(new Set());

  // Drawer / Side Panel details state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // CV Generation modal states
  const [generatedCv, setGeneratedCv] = useState<{ blob: Blob; fileName: string } | null>(null);
  const [cvErrorMsg, setCvErrorMsg] = useState<string | null>(null);

  // Negative feedback rating modal states
  const [feedbackJobId, setFeedbackJobId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  // TanStack Infinite Query hook
  const {
    data,
    isLoading,
    isError,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["jobs", queryParams],
    queryFn: ({ pageParam }) =>
      getJobs({
        limit: 12,
        cursor: pageParam,
        stack: queryParams.stack,
        company: queryParams.company,
        location: queryParams.location,
        platform: queryParams.platform,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: sessionStatus === "authenticated",
  });

  // Mutation: Load job details
  const detailsMutation = useMutation({
    mutationFn: (jobId: string) => getJobById(jobId),
    onSuccess: (data, jobId) => {
      setSelectedJob(data);
      setSelectedJobId(jobId);
    },
    onError: (err: Error) => {
      console.error("Erro ao carregar detalhes:", err);
    },
  });

  // Mutation: Generate personalized CV
  const cvMutation = useMutation({
    mutationFn: (jobId: string) => generateCvForJob(jobId),
    onSuccess: (result) => {
      setGeneratedCv(result);
    },
    onError: (err: any) => {
      setCvErrorMsg(err.error || "Houve uma falha ao gerar o currículo personalizado. Certifique-se de que você fez upload do seu currículo e tente novamente.");
      console.error(err);
    },
  });

  // Mutation: Rate job (thumbs down with feedback)
  const rateMutation = useMutation({
    mutationFn: ({ jobId, feedback }: { jobId: string; feedback?: string }) =>
      rateJob(jobId, { liked: false, feedback }),
    onSuccess: (_data, { jobId }) => {
      setHiddenJobIds((prev) => {
        const next = new Set(prev);
        next.add(jobId);
        return next;
      });

      if (selectedJobId === jobId) {
        setSelectedJobId(null);
        setSelectedJob(null);
      }

      setFeedbackJobId(null);
      setFeedbackText("");
    },
    onError: (err) => {
      console.error("Erro ao enviar avaliação negativa:", err);
    },
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
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "300px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Apply filters submit callback
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryParams({
      stack: filterStack.trim(),
      company: filterCompany.trim(),
      location: filterLocation.trim(),
      platform: filterPlatform.trim(),
    });
  };

  // Clear filters callback
  const handleClearFilters = () => {
    setFilterStack("");
    setFilterCompany("");
    setFilterLocation("");
    setFilterPlatform("");
    setQueryParams({
      stack: "",
      company: "",
      location: "",
      platform: "",
    });
  };

  // Load and display details drawer
  const openDetails = (jobId: string) => {
    setSelectedJobId(jobId);
    setSelectedJob(null);
    detailsMutation.reset();
    detailsMutation.mutate(jobId);
  };

  const closeDetails = () => {
    setSelectedJobId(null);
    setSelectedJob(null);
    detailsMutation.reset();
  };

  // CV personalized generation callback
  const handleGenerateCv = (jobId: string) => {
    setGeneratedCv(null);
    setCvErrorMsg(null);
    cvMutation.reset();
    cvMutation.mutate(jobId);
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

  // Send rateJob mutation for ThumbsDown
  const handleNotInterested = () => {
    if (!feedbackJobId || !session?.user) return;
    rateMutation.mutate({
      jobId: feedbackJobId,
      feedback: feedbackText.trim() || undefined,
    });
  };

  const showSkeleton = sessionStatus === "loading" || (isLoading && allJobs.length === 0);

  return (
    <div className="space-y-8 select-none">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">
            Vagas Recomendadas
          </h1>
          <p className="text-xs md:text-sm text-trampo-muted font-semibold">
            Personalize seu currículo com IA e aplique para as melhores oportunidades tech do mercado.
          </p>
        </div>
      </div>

      {/* Filter Section Component */}
      <JobFilters
        filterStack={filterStack}
        setFilterStack={setFilterStack}
        filterCompany={filterCompany}
        setFilterCompany={setFilterCompany}
        filterLocation={filterLocation}
        setFilterLocation={setFilterLocation}
        filterPlatform={filterPlatform}
        setFilterPlatform={setFilterPlatform}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Main Jobs Feed */}
      <div className="space-y-6">
        {/* Loading Skeleton */}
        {showSkeleton && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-trampo-border rounded-2xl p-5 h-[230px] flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] animate-pulse"
              >
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  <div className="h-3 bg-neutral-100 rounded w-full mt-4" />
                  <div className="h-3 bg-neutral-100 rounded w-5/6" />
                </div>
                <div className="flex items-center justify-between border-t border-neutral-50 pt-4 mt-auto">
                  <div className="h-5 bg-neutral-100 rounded w-16" />
                  <div className="flex gap-2 w-2/3">
                    <div className="h-8 bg-neutral-200 rounded-xl flex-1" />
                    <div className="h-8 bg-neutral-200 rounded-xl flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Query Fetch Error Component */}
        {!showSkeleton && isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 p-5 flex flex-col items-center justify-center text-center space-y-3">
            <XCircle className="w-10 h-10 text-red-500" />
            <h3 className="font-bold text-sm">Não foi possível carregar as vagas</h3>
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

        {/* Empty Search Feed Component */}
        {!showSkeleton && !isError && visibleJobs.length === 0 && (
          <div className="rounded-2xl border border-trampo-border bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            <Briefcase className="w-12 h-12 text-neutral-300" />
            <div className="space-y-1">
              <h3 className="font-bold text-trampo-dark text-sm">Nenhuma vaga recomendada</h3>
              <p className="text-xs text-trampo-muted max-w-sm">
                Experimente alterar os filtros de busca ou verifique se os scrapers estão coletando novas vagas.
              </p>
            </div>
            {Object.values(queryParams).some(Boolean) && (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border border-trampo-border text-trampo-dark hover:bg-neutral-50 text-xs font-bold"
                onClick={handleClearFilters}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        )}

        {/* Jobs Cards Feed */}
        {!showSkeleton && !isError && visibleJobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onOpenDetails={openDetails}
                  onGenerateCv={handleGenerateCv}
                  onNotInterestedTrigger={(jobId) => {
                    setFeedbackJobId(jobId);
                    setFeedbackText("");
                  }}
                  isGenerating={cvMutation.isPending && cvMutation.variables === job.id}
                />
              ))}
            </div>

            {/* Fetching Next Page Spinner */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-6">
                <LoaderCircle className="w-6 h-6 animate-spin text-trampo-primary-500" />
              </div>
            )}

            {/* Intersection observer sentinel element */}
            <div ref={sentinelRef} className="h-10 w-full" />
          </>
        )}
      </div>

      {/* Side Details Drawer */}
      <JobDetailsDrawer
        selectedJobId={selectedJobId}
        selectedJob={selectedJob}
        loadingDetails={detailsMutation.isPending}
        detailsError={detailsMutation.error?.message || null}
        onClose={closeDetails}
        onGenerateCv={handleGenerateCv}
        isGenerating={cvMutation.isPending && cvMutation.variables === selectedJobId}
        onRetryLoad={openDetails}
      />

      {/* Feedback Modal Overlay */}
      <FeedbackModal
        feedbackJobId={feedbackJobId}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        onClose={() => setFeedbackJobId(null)}
        onConfirm={handleNotInterested}
        isSubmitting={rateMutation.isPending}
      />

      {/* CV Generation Loading/Success/Error Modal Overlay */}
      <CvGenerationModal
        state={cvMutation.isPending ? 'loading' : cvMutation.isSuccess ? 'success' : cvMutation.isError ? 'error' : 'idle'}
        generatedCv={generatedCv}
        errorMsg={cvErrorMsg}
        onClose={() => { cvMutation.reset(); setGeneratedCv(null); setCvErrorMsg(null); }}
        onDownload={handleDownloadCv}
      />
    </div>
  );
}
