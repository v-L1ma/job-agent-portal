import React from "react";
import {
  ExternalLink,
  Building2,
  X,
  LoaderCircle,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "./platform-badge";

interface JobDetailsDrawerProps {
  selectedJobId: string | null;
  selectedJob: Job | null;
  loadingDetails: boolean;
  detailsError: string | null;
  onClose: () => void;
  onGenerateCv: (jobId: string) => void;
  isGenerating: boolean;
  onRetryLoad: (jobId: string) => void;
}

export function JobDetailsDrawer({
  selectedJobId,
  selectedJob,
  loadingDetails,
  detailsError,
  onClose,
  onGenerateCv,
  isGenerating,
  onRetryLoad,
}: JobDetailsDrawerProps) {
  const isOpen = Boolean(selectedJobId);

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      {/* Backdrop overlay */}
      <div
        className={`absolute inset-0 bg-trampo-dark/30 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      
      {/* Sliding Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full md:w-[500px] bg-white border-l border-trampo-border shadow-2xl z-10 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
      >
        {loadingDetails && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
            <LoaderCircle className="w-8 h-8 animate-spin text-trampo-primary-500" />
            <p className="text-xs text-trampo-muted font-bold">Carregando detalhes...</p>
          </div>
        )}

        {!loadingDetails && detailsError && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <XCircle className="w-10 h-10 text-red-500" />
            <div className="text-center space-y-1">
              <h3 className="font-bold text-trampo-dark text-sm">Falha ao carregar detalhes</h3>
              <p className="text-xs text-trampo-muted">{detailsError}</p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border border-trampo-border text-trampo-dark font-bold text-xs h-9 cursor-pointer"
              onClick={() => selectedJobId && onRetryLoad(selectedJobId)}
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {!loadingDetails && !detailsError && selectedJob && (
          <>
            {/* Drawer Header */}
            <div className="p-6 border-b border-neutral-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-lg font-extrabold text-trampo-dark leading-snug">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs text-trampo-muted font-bold inline-flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    {selectedJob.company}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-neutral-50 text-neutral-400 hover:text-trampo-dark transition-colors border border-transparent hover:border-trampo-border/50 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={selectedJob.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs px-4 h-9 shadow-md shadow-trampo-primary-500/10 flex items-center justify-center gap-1.5 pointer-events-auto"
                >
                  Ir para a vaga
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Button
                  variant="outline"
                  className="rounded-xl border border-trampo-border text-trampo-dark hover:bg-neutral-50 font-bold text-xs h-9 cursor-pointer inline-flex items-center justify-center gap-1.5"
                  disabled={isGenerating}
                  onClick={() => onGenerateCv(selectedJob.id)}
                >
                  <Sparkles className="w-3.5 h-3.5 text-trampo-primary-500" />
                  Personalizar CV
                </Button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-neutral-50/50 p-4 rounded-xl border border-trampo-border/50">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-trampo-muted uppercase tracking-wider block">
                    Status da Vaga
                  </span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                    selectedJob.active
                      ? "bg-trampo-primary-50 text-trampo-primary-600 border-trampo-primary-100"
                      : "bg-neutral-100 text-neutral-500 border-neutral-200"
                  }`}>
                    {selectedJob.active ? "Ativa" : "Inativa"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-trampo-muted uppercase tracking-wider block">
                    Candidatura
                  </span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                    selectedJob.isApplied
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : "bg-neutral-100 text-neutral-500 border-neutral-200"
                  }`}>
                    {selectedJob.isApplied ? "Enviada" : "Não Candidatado"}
                  </span>
                </div>

                <div className="space-y-1 col-span-2">
                  <span className="text-[10px] font-extrabold text-trampo-muted uppercase tracking-wider block">
                    Plataforma de Origem
                  </span>
                  <PlatformBadge platform={selectedJob.platform} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] font-extrabold text-trampo-muted uppercase tracking-widest">
                  Descrição da Vaga
                </h3>
                <div className="text-xs text-trampo-muted leading-relaxed whitespace-pre-wrap font-medium p-4 bg-white border border-trampo-border rounded-xl">
                  {selectedJob.description}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
