export type CvAnalysisImprovementArea =
  | "estrutura"
  | "contato"
  | "resumo"
  | "skills"
  | "experiencias"
  | "educacao"
  | "geral";

export type CvAnalysisSeverity = "alta" | "media" | "baixa";

export interface CvAnalysisCategory {
  name: string;
  score: number;
  comment: string;
}

export interface CvAnalysisImprovement {
  area: CvAnalysisImprovementArea;
  severity: CvAnalysisSeverity;
  problem: string;
  suggestion: string;
}

/** Ponto forte ancorado na seção do currículo a que se refere. */
export interface CvAnalysisStrength {
  area: CvAnalysisImprovementArea;
  text: string;
}

const IMPROVEMENT_AREAS: readonly string[] = [
  "estrutura",
  "contato",
  "resumo",
  "skills",
  "experiencias",
  "educacao",
  "geral",
];

function isImprovementArea(value: unknown): value is CvAnalysisImprovementArea {
  return typeof value === "string" && IMPROVEMENT_AREAS.includes(value);
}

/**
 * Defesa em camadas do contrato de `strengths`: o backend já faz a coerção de
 * análises antigas (array de strings puras) na leitura, mas caches/edges podem
 * servir o formato legado — normalizamos para `{ area, text }` antes de
 * renderizar. Entradas sem texto ou malformadas são descartadas.
 */
export function normalizeStrengths(raw: unknown): CvAnalysisStrength[] {
  if (!Array.isArray(raw)) return [];

  const strengths: CvAnalysisStrength[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const text = item.trim();
      if (text) strengths.push({ area: "geral", text });
      continue;
    }
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const text = typeof record.text === "string" ? record.text.trim() : "";
      if (!text) continue;
      strengths.push({ area: isImprovementArea(record.area) ? record.area : "geral", text });
    }
  }
  return strengths;
}

export interface CvAnalysisJob {
  title: string;
  matchScore: number;
  missingSkills: string[];
  comment: string;
}

export interface StructuredCvExperience {
  Cargo: string;
  Empresa: string;
  DataInicio: string;
  DataFim: string;
  Descricao: string;
}

export interface StructuredCvEducation {
  Curso: string;
  Instituicao: string;
  DataInicio: string;
  DataFim: string;
}

/** Seção livre do currículo (idiomas, certificados...) fora do formato fixo. */
export interface StructuredCvExtraSection {
  Titulo: string;
  Conteudo: string;
}

/** Currículo estruturado retornado pela IA (shape PascalCase, idêntico a `dto.GeneratedCv`). */
export interface StructuredCv {
  Nome: string;
  Email: string;
  Telefone: string;
  Linkedin: string;
  Github: string;
  Resumo: string;
  Skills: string[];
  Experiencias: StructuredCvExperience[];
  Educacao: StructuredCvEducation[];
  /**
   * Seções extras (idiomas, certificados...). As rotas de análise atuais
   * sempre devolvem o campo, mas análises antigas podem vir sem ele — por
   * isso opcional (tratamos com `?? []` na renderização).
   */
  SecoesExtras?: StructuredCvExtraSection[];
}

/** Objeto `analysis` — contrato comum às rotas pública e privada de análise. */
export interface CvAnalysis {
  score: number;
  summary: string;
  categories: CvAnalysisCategory[];
  strengths: CvAnalysisStrength[];
  improvements: CvAnalysisImprovement[];
  job: CvAnalysisJob | null;
  cv: StructuredCv;
}

/**
 * Análise completa. As rotas privadas (`POST /cv-analysis` e
 * `GET /cv-analysis/:analysisId`) incluem `id` e `createdAt`;
 * a rota pública não persiste e não retorna esses campos.
 */
export interface CvAnalysisResult extends CvAnalysis {
  id?: string;
  createdAt?: string;
}

export interface CvAnalysisListItem {
  id: string;
  score: number;
  summary: string;
  jobTitle: string | null;
  createdAt: string;
}

export interface CvAnalysisListResponse {
  data: CvAnalysisListItem[];
}

export interface CvAnalysisResponse {
  data: CvAnalysisResult;
}
