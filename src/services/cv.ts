import { getFileNameFromContentDisposition } from "@/utils/get-file-name-content";
import { api, toApiError } from "./api";
import { GeneratedCvItem, GeneratedCvListResponse, UploadCvResponse } from "@/types/cv";

export async function uploadUserCv(file: File): Promise<UploadCvResponse> {
  const formData = new FormData();
  formData.append("cv", file);

  try {
    const response = await api.post<UploadCvResponse>("/cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw toApiError(error, "Erro ao fazer upload do currículo.");
  }
}

export async function getUserCv(): Promise<{ blob: Blob; fileName: string; fileSize: number; uploadedAt: string }> {
  try {
    const response = await api.get("/cv", { responseType: "blob" });

    const blob = response.data as Blob;
    const fileNameFromHeader = response.headers["x-cv-file-name"] as string | undefined;
    const fileSizeFromHeader = response.headers["x-cv-file-size-bytes"] as string | undefined;
    const uploadDateFromHeader = response.headers["x-cv-upload-date"] as string | undefined;
    const contentLength = response.headers["content-length"] as string | undefined;

    const fileName =
      fileNameFromHeader ??
      getFileNameFromContentDisposition(response.headers["content-disposition"]) ??
      "curriculo.pdf";
    const fileSize = Number.parseInt(fileSizeFromHeader ?? contentLength ?? "", 10);
    const uploadedAt = uploadDateFromHeader ?? "";

    return {
      blob,
      fileName,
      fileSize: Number.isNaN(fileSize) ? blob.size : fileSize,
      uploadedAt,
    };
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar seu currículo.");
  }
}

export async function getGeneratedCvs(): Promise<GeneratedCvItem[]> {
  try {
    const response = await api.get<GeneratedCvListResponse>("/cv/generated");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar a lista de currículos gerados.");
  }
}

export async function downloadGeneratedCv(cvId: string): Promise<{ blob: Blob; fileName: string }> {
  try {
    const response = await api.get(`/cv/${cvId}`, { responseType: "blob" });

    const blob = response.data as Blob;
    const fileName =
      getFileNameFromContentDisposition(response.headers["content-disposition"]) ??
      `curriculo-gerado-${cvId}.pdf`;

    return { blob, fileName };
  } catch (error) {
    throw toApiError(error, "Não foi possível baixar o currículo gerado.");
  }
}

