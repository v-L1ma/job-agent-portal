import axios from "axios";
import {
  CvAnalysisListResponse,
  CvAnalysisListItem,
  CvAnalysisResponse,
  CvAnalysisResult,
} from "@/types/cv-analysis";
import { api, toApiError } from "./api";

/**
 * As chamadas de análise demoram (10–40s, Gemini) — usamos um timeout
 * generoso para não derrubar a requisição antes da IA responder.
 */
const ANALYSIS_TIMEOUT_MS = 120_000;

function buildFormData(file: File, jobTitle?: string, jobDescription?: string): FormData {
  const formData = new FormData();
  formData.append("cv", file);

  // jobTitle e jobDescription andam juntos: só enviamos quando os dois
  // foram preenchidos (o backend rejeita envio parcial com 400).
  const title = jobTitle?.trim();
  const description = jobDescription?.trim();
  if (title && description) {
    formData.append("jobTitle", title);
    formData.append("jobDescription", description);
  }

  return formData;
}

/** Análise pública (sem JWT, sem persistência, rate limit de 5/h por IP). */
export async function analyzeCvPublic(
  file: File,
  jobTitle?: string,
  jobDescription?: string
): Promise<CvAnalysisResult> {
  try {
    const response = await api.post<CvAnalysisResponse>(
      "/cv-analysis/public",
      buildFormData(file, jobTitle, jobDescription),
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: ANALYSIS_TIMEOUT_MS,
      }
    );
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível analisar o currículo. Tente novamente.");
  }
}

/** Análise autenticada (aplica limite diário do plano e persiste no histórico). */
export async function analyzeCv(
  file: File,
  jobTitle?: string,
  jobDescription?: string
): Promise<CvAnalysisResult> {
  try {
    const response = await api.post<CvAnalysisResponse>(
      "/cv-analysis",
      buildFormData(file, jobTitle, jobDescription),
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: ANALYSIS_TIMEOUT_MS,
      }
    );
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível analisar o currículo. Tente novamente.");
  }
}

/** Histórico de análises do usuário (máx. 50, mais recente primeiro). */
export async function getCvAnalyses(): Promise<CvAnalysisListItem[]> {
  try {
    const response = await api.get<CvAnalysisListResponse>("/cv-analysis");
    return response.data.data ?? [];
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar o histórico de análises.");
  }
}

/** Detalhe de uma análise salva. */
export async function getCvAnalysis(analysisId: string): Promise<CvAnalysisResult> {
  try {
    const response = await api.get<CvAnalysisResponse>(`/cv-analysis/${analysisId}`);
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar a análise.");
  }
}

/**
 * Erros de requisições com `responseType: "blob"` chegam com `data` como
 * Blob — o `toApiError` não lê esse formato, então interpretamos o corpo
 * manualmente para extrair a mensagem `{"error": "..."}` do backend e só
 * caímos no helper padrão quando não há resposta binária para ler.
 */
async function toBlobApiError(error: unknown, defaultMessage: string): Promise<Error> {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      const parsed = JSON.parse(await error.response.data.text()) as { error?: unknown };
      if (typeof parsed.error === "string" && parsed.error.trim()) {
        return new Error(parsed.error);
      }
    } catch {
      // Corpo não-JSON (proxy/timeout intermediário) — usa a mensagem padrão.
    }
    return new Error(defaultMessage);
  }
  return toApiError(error, defaultMessage);
}

/** Gera o currículo melhorado com base nas dicas da análise e devolve o PDF. */
export async function generateImprovedCv(analysis: CvAnalysisResult): Promise<Blob> {
  // Análise com `id` veio da rota privada (JWT); sem `id` é a pública.
  const url = analysis.id ? "/cv-analysis/improved-cv" : "/cv-analysis/public/improved-cv";
  const defaultMessage = "Não foi possível gerar o currículo melhorado. Tente novamente.";

  try {
    const response = await api.post(url, { analysis }, {
      responseType: "blob",
      timeout: ANALYSIS_TIMEOUT_MS,
    });
    return response.data as Blob;
  } catch (error) {
    throw await toBlobApiError(error, defaultMessage);
  }
}
