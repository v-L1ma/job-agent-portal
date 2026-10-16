"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { analyzeCv, analyzeCvPublic } from "@/services/cv-analysis";
import type { CvAnalysisResult } from "@/types/cv-analysis";
import {
  Briefcase,
  CircleAlert,
  FileText,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_JOB_TITLE_LENGTH = 200;
const MAX_JOB_DESCRIPTION_LENGTH = 10000;
const ANALYZING_DELAY_MS = 2500;

type SubmitStage = "idle" | "sending" | "analyzing";

interface CvAnalysisFormProps {
  /** "public" usa POST /cv-analysis/public; "private" usa POST /cv-analysis (persiste no histórico). */
  variant?: "public" | "private";
  /** Recebe o resultado da análise para o componente pai exibir o viewer. */
  onAnalyzed?: (result: CvAnalysisResult) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function CvAnalysisForm({ variant = "public", onAnalyzed }: CvAnalysisFormProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<SubmitStage>("idle");

  const [jobEnabled, setJobEnabled] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  const loading = stage !== "idle";

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    };
  }, []);

  const selectFile = useCallback(
    (file: File | undefined | null) => {
      if (!file) return;
      if (file.type !== "application/pdf") {
        setCvFile(null);
        setError("Tipo de arquivo inválido: envie um PDF (application/pdf).");
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setCvFile(null);
        setError("O arquivo excede o tamanho máximo permitido de 10MB.");
        return;
      }
      setError(null);
      setCvFile(file);
    },
    []
  );

  const removeSelectedFile = useCallback(() => {
    setCvFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      selectFile(e.dataTransfer.files?.[0]);
    },
    [selectFile]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    // Limpa o input para permitir reselecionar o mesmo arquivo em seguida
    // (o objeto File em estado continua válido).
    event.target.value = "";
  };

  const openFilePicker = () => {
    if (!loading) fileInputRef.current?.click();
  };

  const handleDropzoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  };

  function validate(): string | null {
    if (!cvFile) return "Selecione um arquivo PDF para analisar.";
    if (cvFile.type !== "application/pdf") return "Tipo de arquivo inválido: envie um PDF (application/pdf).";
    if (cvFile.size > MAX_FILE_SIZE_BYTES) return "O arquivo excede o tamanho máximo permitido de 10MB.";

    if (jobEnabled) {
      const title = jobTitle.trim();
      const description = jobDescription.trim();
      if (title.length > MAX_JOB_TITLE_LENGTH) {
        return "O campo título da vaga deve ter no máximo 200 caracteres.";
      }
      if (description.length > MAX_JOB_DESCRIPTION_LENGTH) {
        return "O campo descrição da vaga deve ter no máximo 10000 caracteres.";
      }
      if (title && !description) {
        return "Informe também a descrição da vaga: título e descrição devem ser enviados juntos.";
      }
      if (description && !title) {
        return "Informe também o título da vaga: título e descrição devem ser enviados juntos.";
      }
    }

    return null;
  }

  async function handleSubmit() {
    if (loading) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!cvFile) return;

    setError(null);
    setStage("sending");
    stageTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) setStage("analyzing");
    }, ANALYZING_DELAY_MS);

    const title = jobEnabled ? jobTitle.trim() : "";
    const description = jobEnabled ? jobDescription.trim() : "";

    try {
      const result =
        variant === "private"
          ? await analyzeCv(cvFile, title || undefined, description || undefined)
          : await analyzeCvPublic(cvFile, title || undefined, description || undefined);

      if (isMountedRef.current) onAnalyzed?.(result);
    } catch (submitError) {
      if (isMountedRef.current) {
        setError(
          submitError instanceof Error && submitError.message
            ? submitError.message
            : "Não foi possível analisar o currículo. Tente novamente."
        );
      }
    } finally {
      if (stageTimerRef.current) {
        clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
      if (isMountedRef.current) setStage("idle");
    }
  }

  const stageMessage =
    stage === "sending"
      ? "Enviando currículo..."
      : "Analisando com IA... isso pode levar até 40 segundos.";

  return (
    <div className="space-y-5">
      {/* Dropzone de PDF */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          role="button"
          tabIndex={loading ? -1 : 0}
          aria-label="Selecionar arquivo PDF do currículo"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFilePicker}
          onKeyDown={handleDropzoneKeyDown}
          className={`
            relative cursor-pointer rounded-lg border-2 border-dashed transition-all duration-300 ease-in-out
            flex flex-col items-center justify-center gap-4 p-8 md:p-10 group
            ${loading ? "pointer-events-none opacity-70" : ""}
            ${
              isDragging
                ? "border-trampo-primary-500 bg-trampo-primary-50 scale-[1.01] shadow-md shadow-trampo-primary-500/5"
                : cvFile
                ? "border-emerald-500 bg-emerald-50/20"
                : "border-neutral-200 bg-neutral-50/50 hover:border-trampo-primary-500/50 hover:bg-trampo-primary-50/20"
            }
          `}
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            {cvFile ? (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                  <FileText className="w-7 h-7 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-trampo-dark mb-1">Arquivo selecionado!</h4>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold shadow-sm">
                  <FileText className="w-3.5 h-3.5 text-trampo-primary-500" />
                  <span className="max-w-55 truncate text-trampo-dark font-bold">{cvFile.name}</span>
                  <span className="text-neutral-400 font-medium">({formatFileSize(cvFile.size)})</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedFile();
                    }}
                    className="ml-1 p-0.5 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                    aria-label="Remover arquivo selecionado"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    isDragging
                      ? "bg-trampo-primary-500/20 scale-105"
                      : "bg-trampo-primary-500/10 group-hover:bg-trampo-primary-500/20"
                  }`}
                >
                  <Upload
                    className={`w-6 h-6 text-trampo-primary-500 transition-transform ${
                      isDragging ? "-translate-y-0.5" : "group-hover:-translate-y-0.5"
                    }`}
                  />
                </div>
                <h4 className="text-sm font-bold text-trampo-dark mb-1">
                  {isDragging ? "Solte o arquivo aqui!" : "Arraste seu currículo aqui"}
                </h4>
                <p className="text-xs text-trampo-muted font-semibold mb-3">
                  ou <span className="text-trampo-primary-500 underline">clique para selecionar</span>
                </p>
                <Badge
                  variant="secondary"
                  className="bg-neutral-100 hover:bg-neutral-100 text-neutral-500 text-[10px] font-bold px-2 py-0.5 rounded-lg"
                >
                  Formatos aceitos: PDF (máx. 10MB)
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Vaga específica (opcional) */}
      <div className="rounded-lg">
        <div className="flex items-center justify-between gap-3 rounded-lg bg-neutral-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-trampo-primary-500 shrink-0" />
            <Label
              htmlFor="cv-analysis-job-toggle"
              className="text-xs font-bold text-trampo-dark cursor-pointer"
            >
              Avaliar para uma vaga específica
            </Label>
          </div>
          <Switch
            id="cv-analysis-job-toggle"
            checked={jobEnabled}
            onCheckedChange={setJobEnabled}
            disabled={loading}
          />
        </div>

        {jobEnabled && (
          <div className="space-y-4 p-4">
            <p className="text-[11px] font-semibold text-trampo-muted leading-relaxed">
              A IA vai considerar a vaga para calcular o fit e apontar skills que faltam.
              Título e descrição precisam ser preenchidos juntos.
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="cv-analysis-job-title" className="text-xs font-bold text-trampo-dark">
                Título da vaga
              </Label>
              <Input
                id="cv-analysis-job-title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                maxLength={MAX_JOB_TITLE_LENGTH}
                disabled={loading}
                placeholder="Ex: Desenvolvedor Backend Pleno"
                className="h-9 rounded-md border-trampo-border bg-white px-3 text-xs font-semibold text-trampo-dark placeholder:text-neutral-400 focus-visible:border-trampo-primary-500 focus-visible:ring-trampo-primary-500/10"
              />
              <p className="text-right text-[9px] font-bold text-neutral-400">
                {jobTitle.length}/{MAX_JOB_TITLE_LENGTH}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cv-analysis-job-description" className="text-xs font-bold text-trampo-dark">
                Descrição da vaga
              </Label>
              <textarea
                id="cv-analysis-job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={MAX_JOB_DESCRIPTION_LENGTH}
                disabled={loading}
                rows={6}
                placeholder="Cole aqui a descrição completa da vaga..."
                className="w-full resize-y rounded-md border border-trampo-border bg-white px-3 py-2.5 text-xs font-medium text-trampo-dark placeholder:text-neutral-400 focus:border-trampo-primary-500 focus:outline-none focus:ring-2 focus:ring-trampo-primary-500/10 transition-all disabled:opacity-60"
              />
              <p className="text-right text-[9px] font-bold text-neutral-400">
                {jobDescription.length}/{MAX_JOB_DESCRIPTION_LENGTH}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status por etapa */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 rounded-md border border-trampo-primary-200 bg-trampo-primary-50 px-4 py-3 text-xs font-bold text-trampo-primary-600"
        >
          <LoaderCircle className="size-4 shrink-0 animate-spin" />
          <span>{stageMessage}</span>
        </div>
      )}

      {/* Erro da API (400/413/429/500) */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700"
        >
          <CircleAlert className="size-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 items-center justify-center">
        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={loading || !cvFile}
          className="rounded-md bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs h-9 shadow-md shadow-trampo-primary-500/10 cursor-pointer px-10 inline-flex items-center gap-1.5 shrink-0"
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              {stage === "sending" ? "Enviando..." : "Analisando..."}
            </>
          ) : (
            <>
              Analisar currículo
            </>
          )}
        </Button>
        <p className="text-[10px] font-semibold text-trampo-muted">
          Seu PDF é analisado pela IA e{" "}
          {variant === "private" ? "fica salvo no seu histórico." : "não é salvo em nossa base."}
        </p>
      </div>
    </div>
  );
}
