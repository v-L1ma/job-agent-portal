"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  normalizeStrengths,
  type CvAnalysisImprovementArea,
  type CvAnalysisResult,
  type CvAnalysisSeverity,
} from "@/types/cv-analysis";
import { generateImprovedCv } from "@/services/cv-analysis";
import {
  Briefcase,
  CalendarDays,
  CircleAlert,
  CircleCheck,
  Code,
  FileDown,
  GraduationCap,
  Lightbulb,
  Link2,
  LoaderCircle,
  Mail,
  Phone,
} from "lucide-react";
import { getScoreColor, ScoreRing } from "./score-ring";

/** Mapeia cada área de análise para a seção correspondente no viewer. */
const SECTION_IDS: Record<CvAnalysisImprovementArea, string> = {
  contato: "cv-contato",
  resumo: "cv-resumo",
  skills: "cv-skills",
  experiencias: "cv-experiencias",
  educacao: "cv-educacao",
  estrutura: "cv-document",
  geral: "cv-document",
};

/** Caminho inverso: id de seção no viewer → área canônica (usado no highlight). */
const SECTION_AREAS: Record<string, CvAnalysisImprovementArea> = {
  "cv-document": "geral",
  "cv-contato": "contato",
  "cv-resumo": "resumo",
  "cv-skills": "skills",
  "cv-experiencias": "experiencias",
  "cv-educacao": "educacao",
};

const AREA_LABELS: Record<CvAnalysisImprovementArea, string> = {
  estrutura: "Estrutura",
  contato: "Contato",
  resumo: "Resumo",
  skills: "Skills",
  experiencias: "Experiências",
  educacao: "Educação",
  geral: "Geral",
};

const SEVERITY_LABELS: Record<CvAnalysisSeverity, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

const SEVERITY_BADGE_CLASSES: Record<CvAnalysisSeverity, string> = {
  alta: "text-red-600 border-red-200",
  media: "text-amber-600 border-amber-200",
  baixa: "text-blue-600 border-blue-200",
};

/** Tom visual de um ponto: verde no ponto forte, vermelho no ponto de melhoria. */
type HighlightTone = "strength" | "improvement";

/**
 * Superfície do marca-texto nas seções: estende o fundo alguns px além do
 * texto (margem negativa + padding) sem desalinhar o conteúdo em relação às
 * seções sem realce.
 */
const SECTION_SURFACE_CLASSES = "rounded-sm px-2 -mx-2 py-1";

interface ActiveHighlight {
  area: CvAnalysisImprovementArea;
  /** Cor do anel de pulse (cor do item no painel ou tom da seção no viewer). */
  color: string;
  /**
   * Identidade do resultado analisado. O destaque só é aplicado quando o
   * resultado atual é o mesmo que originou o clique — assim, ao trocar de
   * análise o destaque é invalidado por derivação (sem setState em effect).
   */
  source: CvAnalysisResult;
}

/** Pontos ancorados em uma seção do viewer, com índice global por tipo. */
interface SectionMarker {
  /** Índices globais (0-based) em `strengths`. */
  strengths: number[];
  /** Índices globais (0-based) em `improvements`. */
  improvements: number[];
  /** Tom do marca-texto: melhoria tem prioridade; null quando não há pontos. */
  tone: HighlightTone | null;
}

function emptySectionMarker(): SectionMarker {
  return { strengths: [], improvements: [], tone: null };
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

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

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function formatPeriod(start: string, end: string): string {
  const s = start?.trim();
  const e = end?.trim();
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return `${s} — Presente`;
  return `${s} — ${e}`;
}

function SectionTitle({
  children,
  badges,
}: {
  children: React.ReactNode;
  badges?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-trampo-border pb-1.5">
      <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-trampo-primary-600">
        {children}
      </h3>
      {badges}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-extrabold uppercase tracking-wider text-trampo-muted">{children}</h3>
  );
}

interface CvAnalysisResultViewProps {
  result: CvAnalysisResult;
  /** Exibe o indicador de carregamento (usado ao abrir uma análise do histórico). */
  loading?: boolean;
}

export function CvAnalysisResult({ result, loading = false }: CvAnalysisResultViewProps) {
  const [highlight, setHighlight] = useState<ActiveHighlight | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Geração do PDF do currículo melhorado (botão no painel direito). O estado
  // guarda de QUAL resultado ele veio: ao trocar de análise, os valores da
  // anterior deixam de valer por derivação — sem setState em effect.
  const [generatingImprovedCvFor, setGeneratingImprovedCvFor] =
    useState<CvAnalysisResult | null>(null);
  const [improvedCvFailure, setImprovedCvFailure] = useState<{
    source: CvAnalysisResult;
    message: string;
  } | null>(null);

  const generatingImprovedCv = generatingImprovedCvFor === result;
  const improvedCvError =
    improvedCvFailure?.source === result ? improvedCvFailure.message : null;

  // Refs fixas por seção do viewer (atribuídas pelo React fora do render).
  const documentRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const resumoRef = useRef<HTMLElement | null>(null);
  const skillsRef = useRef<HTMLElement | null>(null);
  const experienciasRef = useRef<HTMLElement | null>(null);
  const educacaoRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  // Usado apenas em handlers de evento (nunca durante o render).
  function resolveSection(id: string): HTMLElement | null {
    switch (id) {
      case "cv-contato":
        return contactRef.current;
      case "cv-resumo":
        return resumoRef.current;
      case "cv-skills":
        return skillsRef.current;
      case "cv-experiencias":
        return experienciasRef.current;
      case "cv-educacao":
        return educacaoRef.current;
      case "cv-document":
      default:
        return documentRef.current;
    }
  }

  function highlightProps(id: string): { className: string; style?: React.CSSProperties } {
    if (!highlight || highlight.source !== result || SECTION_IDS[highlight.area] !== id) {
      return { className: "" };
    }
    return {
      className: " cv-highlight",
      style: { "--cv-highlight-ring": highlight.color } as React.CSSProperties,
    };
  }

  const { cv, categories, improvements, job } = result;
  // Defesa em camadas: normaliza `strengths` legado (string[]) antes de renderizar.
  const strengths = useMemo(() => normalizeStrengths(result.strengths), [result]);

  /**
   * Agrupa os pontos por seção do viewer e deriva o tom do marca-texto de
   * cada uma. Pontos de áreas sem seção renderizada no CV (ex.: melhoria de
   * "resumo" sem resumo) ancoram no topo do documento (`cv-document`);
   * áreas `estrutura`/`geral` sempre ancoram ali.
   */
  const sectionMarkers = useMemo(() => {
    const hasSection: Record<string, boolean> = {
      "cv-contato": true, // o cabeçalho sempre é renderizado
      "cv-resumo": Boolean(cv.Resumo?.trim()),
      "cv-skills": (cv.Skills?.length ?? 0) > 0,
      "cv-experiencias": (cv.Experiencias?.length ?? 0) > 0,
      "cv-educacao": (cv.Educacao?.length ?? 0) > 0,
    };
    const markers: Record<string, SectionMarker> = {
      "cv-document": emptySectionMarker(),
      "cv-contato": emptySectionMarker(),
      "cv-resumo": emptySectionMarker(),
      "cv-skills": emptySectionMarker(),
      "cv-experiencias": emptySectionMarker(),
      "cv-educacao": emptySectionMarker(),
    };

    strengths.forEach((strength, index) => {
      const targetId = SECTION_IDS[strength.area] ?? "cv-document";
      const bucketId = hasSection[targetId] ? targetId : "cv-document";
      markers[bucketId].strengths.push(index);
    });

    improvements.forEach((improvement, index) => {
      const targetId = SECTION_IDS[improvement.area] ?? "cv-document";
      const bucketId = hasSection[targetId] ? targetId : "cv-document";
      markers[bucketId].improvements.push(index);
    });

    // Regra por seção: melhoria (vermelho) tem prioridade sobre ponto forte (verde).
    for (const marker of Object.values(markers)) {
      if (marker.improvements.length > 0) marker.tone = "improvement";
      else if (marker.strengths.length > 0) marker.tone = "strength";
    }

    return markers;
  }, [cv, strengths, improvements]);

  const hasResults = categories.length > 0 || strengths.length > 0 || improvements.length > 0;

  /**
   * Gera o PDF do currículo melhorado e dispara o download via URL temporária
   * (mesmo padrão dos demais botões de download do projeto). O erro da API
   * aparece inline, é limpo na nova tentativa e some sozinho se o usuário
   * trocar de análise (o estado guarda o `result` de origem).
   */
  async function handleGenerateImprovedCv() {
    if (!result.cv || generatingImprovedCv) return;
    setImprovedCvFailure(null);
    setGeneratingImprovedCvFor(result);
    try {
      const blob = await generateImprovedCv(result);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "curriculo-melhorado.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      setImprovedCvFailure({
        source: result,
        message:
          error instanceof Error && error.message
            ? error.message
            : "Não foi possível gerar o currículo melhorado. Tente novamente.",
      });
    } finally {
      // Só limpa se esta geração ainda for a ativa (evita uma requisição
      // atrasada derrubar o carregamento de outra iniciada depois).
      setGeneratingImprovedCvFor((current) => (current === result ? null : current));
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
      {loading && (
        <div className="order-1 lg:col-span-12 flex items-center justify-center gap-2 rounded-sm border border-trampo-primary-100 bg-trampo-primary-50 px-4 py-4 text-xs font-bold text-trampo-primary-600">
          <LoaderCircle className="size-4 animate-spin" />
          Carregando análise...
        </div>
      )}

      {/* Painel esquerdo — Viewer do currículo */}
      <section className="order-2 lg:order-1 lg:col-span-7 rounded-sm">

        <article
          id="cv-document"
          ref={documentRef}
          className={cn(
            "relative space-y-6 rounded-md border border-trampo-border bg-white p-5 md:p-7"
          )}
        >

          {/* Cabeçalho / contato */}
          <header
            id="cv-contato"
            ref={contactRef}
            className={cn(
              SECTION_SURFACE_CLASSES,
              "space-y-1"
            )}
          >
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <h2 className="text-lg font-extrabold tracking-tight text-trampo-dark md:text-2xl">
                {cv.Nome?.trim() || "Currículo sem nome"}
              </h2>
            </div>

            {/* Sem truncate/max-w aqui: o contato é conteúdo do currículo e
                precisa aparecer por completo (quebra de linha quando longo). */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-trampo-muted">
              {cv.Email?.trim() &&
                (isEmail(cv.Email) ? (
                  <a
                    href={`mailto:${cv.Email.trim()}`}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-trampo-primary-500"
                  >
                    <Mail className="size-3.5 shrink-0" />
                    <span className="break-all">{cv.Email}</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5 shrink-0" />
                    <span className="break-all">{cv.Email}</span>
                  </span>
                ))}

              {cv.Telefone?.trim() && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5 shrink-0" />
                  {cv.Telefone}
                </span>
              )}

              {cv.Linkedin?.trim() && (
                <a
                  href={normalizeUrl(cv.Linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-trampo-primary-500"
                >
                  <Link2 className="size-3.5 shrink-0" />
                  {/* URL completa (não só o rótulo): é conteúdo do currículo. */}
                  <span className="break-all">{cv.Linkedin}</span>
                </a>
              )}

              {cv.Github?.trim() && (
                <a
                  href={normalizeUrl(cv.Github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-trampo-primary-500"
                >
                  <Code className="size-3.5 shrink-0" />
                  <span className="break-all">{cv.Github}</span>
                </a>
              )}
            </div>
          </header>

          {/* Resumo */}
          {cv.Resumo?.trim() && (
            <section
              id="cv-resumo"
              ref={resumoRef}
              className={cn(
                SECTION_SURFACE_CLASSES
              )}
            >
              <SectionTitle>Resumo</SectionTitle>
              <p className="text-[13px] leading-relaxed whitespace-pre-line text-neutral-700">
                {cv.Resumo}
              </p>
            </section>
          )}

          {/* Skills */}
          {cv.Skills?.length > 0 && (
            <section
              id="cv-skills"
              ref={skillsRef}
              className={cn(
                SECTION_SURFACE_CLASSES
              )}
            >
              <SectionTitle>Habilidades</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {cv.Skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-sm border border-trampo-primary-100 bg-trampo-primary-50 px-2 py-1 text-[11px] font-bold text-trampo-primary-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Experiências */}
          {cv.Experiencias?.length > 0 && (
            <section
              id="cv-experiencias"
              ref={experienciasRef}
              className={cn(
                SECTION_SURFACE_CLASSES
              )}
            >
              <SectionTitle>
                Experiências
              </SectionTitle>
              <div className="space-y-4">
                {cv.Experiencias.map((experience, index) => (
                  <div key={index} className="border-l-2 border-trampo-primary-100 pl-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <p className="text-sm font-bold text-trampo-dark">{experience.Cargo}</p>
                      {formatPeriod(experience.DataInicio, experience.DataFim) && (
                        <span className="text-[10px] font-bold text-neutral-400">
                          {formatPeriod(experience.DataInicio, experience.DataFim)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-trampo-primary-600">
                      {experience.Empresa}
                    </p>
                    {experience.Descricao?.trim() && (
                      <p className="mt-1.5 text-xs leading-relaxed whitespace-pre-line text-neutral-600">
                        {experience.Descricao}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Educação */}
          {cv.Educacao?.length > 0 && (
            <section
              id="cv-educacao"
              ref={educacaoRef}
              style={highlightProps("cv-educacao").style}
              className={cn(
                SECTION_SURFACE_CLASSES
              )}
            >
              <SectionTitle>Educação</SectionTitle>
              <div className="space-y-3">
                {cv.Educacao.map((education, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <GraduationCap className="mt-0.5 size-4 shrink-0 text-trampo-primary-500" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-trampo-dark">{education.Curso}</p>
                      <p className="text-xs font-semibold text-trampo-muted">
                        {education.Instituicao}
                      </p>
                      {formatPeriod(education.DataInicio, education.DataFim) && (
                        <p className="text-[10px] font-bold text-neutral-400">
                          {formatPeriod(education.DataInicio, education.DataFim)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Seções extras (idiomas, certificados...) — vêm após a Educação no
              PDF; sem hover/highlight porque `SECTION_IDS` não prevê essa área
              e análises antigas nem têm o campo (renderiza nada quando vazio). */}
          {(cv.SecoesExtras ?? []).map((secao, index) => (
            <section
              key={`cv-secoes-extras-${index}`}
              id={`cv-secoes-extras-${index}`}
              className={SECTION_SURFACE_CLASSES}
            >
              <SectionTitle>{secao.Titulo}</SectionTitle>
              <p className="text-[13px] leading-relaxed whitespace-pre-line text-neutral-700">
                {secao.Conteudo}
              </p>
            </section>
          ))}
        </article>
      </section>

      {/* Painel direito — Análise */}
      <section className="order-1 lg:order-2 lg:col-span-5 space-y-4">
        {/* Score */}
        <div className="rounded-sm border border-trampo-border bg-white p-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ScoreRing score={result.score} size={112} strokeWidth={9} />
            <div className="min-w-0 flex-1">
              <CardTitle>Score geral</CardTitle>
              <p className="mt-1.5 text-xs leading-relaxed font-semibold text-trampo-muted">
                {result.summary}
              </p>
            </div>
          </div>
          {result.createdAt && (
            <div className="mt-4 flex items-center gap-1.5 border-t border-neutral-50 pt-3 text-[10px] font-bold text-neutral-400">
              <CalendarDays className="size-3.5" />
              Análise realizada em {formatDate(result.createdAt)}
            </div>
          )}
        </div>

        {/* Currículo melhorado (PDF) — só quando há CV analisado pra reescrever */}
        {result.cv && (
          <div className="rounded-sm border border-trampo-border bg-white p-5">
            <div className="flex flex-col gap-3 sm:items-center sm:justify-between">
              <div className="min-w-0">
                <CardTitle>Melhore seu currículo</CardTitle>
                <p className="mt-1.5 text-xs leading-relaxed font-semibold text-trampo-muted">
                  Gere um PDF aplicando as sugestões desta análise, sem cortar conteúdo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleGenerateImprovedCv()}
                disabled={generatingImprovedCv}
                className="flex justify-center h-10 w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-md bg-trampo-primary-500 px-4 text-xs font-bold text-white shadow-md shadow-trampo-primary-500/10 transition-colors hover:bg-trampo-primary-400 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trampo-primary-500/30"
              >
                {generatingImprovedCv ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Gerando currículo melhorado...
                  </>
                ) : (
                  <>
                    <FileDown className="size-4" />
                    Gerar currículo melhorado
                  </>
                )}
              </button>
            </div>

            {improvedCvError && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <span>{improvedCvError}</span>
              </div>
            )}
          </div>
        )}

        {/* Categorias */}
        {categories.length > 0 && (
          <div className="rounded-sm border border-trampo-border bg-white p-5">
            <CardTitle>Categorias</CardTitle>
            <div className="mt-4 space-y-4">
              {categories.map((category, index) => {
                const score = clampScore(category.score);
                return (
                  <div key={`${category.name}-${index}`}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-trampo-dark">{category.name}</span>
                      <span
                        className="text-xs font-extrabold"
                        style={{ color: getScoreColor(score) }}
                      >
                        {Math.round(score)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }}
                      />
                    </div>
                    {category.comment && (
                      <p className="mt-1.5 text-[10px] leading-snug font-semibold text-trampo-muted">
                        {category.comment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pontos fortes */}
        {strengths.length > 0 && (
          <div className="rounded-sm border border-trampo-border bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Pontos fortes</CardTitle>
            </div>
            <ul className="mt-3 space-y-2">
              {strengths.map((strength, index) => (
                <li key={index}>
                  <p
                    className="group flex w-full items-start gap-2 rounded-md border border-transparent p-2 text-left transition-all hover:bg-[#9999991c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/30"
                  >
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold leading-snug text-trampo-dark">
                        {strength.text}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400">
                          {AREA_LABELS[strength.area] ?? strength.area}
                        </span>
                      </span>
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pontos de melhoria */}
        <div className="rounded-sm border border-trampo-border bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.015)]">
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Pontos de melhoria</CardTitle>
          </div>

          {improvements.length === 0 ? (
            <p className="mt-3 text-xs font-semibold text-trampo-muted">
              {hasResults
                ? "Nenhum ponto de melhoria apontado pela IA."
                : "Sem dados de melhoria para esta análise."}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {improvements.map((improvement, index) => (
                <li key={index}>
                  <p
                    className="group w-full rounded-md  bg-white p-3 text-left transition-all hover:border-trampo-primary-400 hover:bg-[#9999991c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trampo-primary-500/30"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                          {AREA_LABELS[improvement.area] ?? improvement.area}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          IMPACTO 
                        </span>
                          <p className={cn(
                            "text-[9px] font-extrabold uppercase tracking-wider",
                            SEVERITY_BADGE_CLASSES[improvement.severity]
                          )}>{SEVERITY_LABELS[improvement.severity] ?? improvement.severity}
                          </p>
                      </div>
                    </div>

                    <p className="text-xs font-bold leading-snug text-trampo-dark">
                      {improvement.problem}
                    </p>

                    <div className="mt-2 flex items-start gap-2 rounded-sm border border-neutral-100 bg-neutral-50 p-2">
                      <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                      <p className="text-[11px] font-semibold leading-snug text-trampo-muted">
                        {improvement.suggestion}
                      </p>
                    </div>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Card da vaga (só quando houver) */}
        {job && (
          <div className="rounded-sm border border-trampo-border bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.015)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2">
                <Briefcase className="mt-0.5 size-4 shrink-0 text-trampo-primary-500" />
                <div className="min-w-0">
                  <CardTitle>Vaga avaliada</CardTitle>
                  <p className="mt-1 text-sm font-bold leading-snug text-trampo-dark">
                    {job.title}
                  </p>
                </div>
              </div>
              <ScoreRing score={job.matchScore} size={64} strokeWidth={6} showLabel={false} />
            </div>

            <p
              className="mt-2 text-[10px] font-extrabold uppercase tracking-wider"
              style={{ color: getScoreColor(job.matchScore) }}
            >
              Compatibilidade: {clampScore(job.matchScore)}%
            </p>

            {job.missingSkills?.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-trampo-muted">
                  Skills em falta
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {job.missingSkills.map((skill, index) => (
                    <Badge
                      key={`${skill}-${index}`}
                      variant="secondary"
                      className="rounded-sm bg-amber-50 px-2 text-[10px] font-bold text-amber-700 hover:bg-amber-50"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {job.comment && (
              <p className="mt-3 border-t border-neutral-50 pt-3 text-xs leading-relaxed font-semibold text-trampo-muted">
                {job.comment}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
