"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiError, uploadUserCv, getUserCv, getGeneratedCvs, type GeneratedCvItem } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Upload,
  LoaderCircle,
  FileText,
  Trash2,
  Download,
  Clock,
  X,
  FileUp,
  Sparkles,
  Eye,
  File,
  Calendar,
  HardDrive,
} from "lucide-react";

function normalizeError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível enviar o currículo.";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface CurriculoFormProps {
  mode?: "page" | "modal";
  onCvAvailabilityChange?: (hasCv: boolean) => void;
  onUploadSuccess?: () => void;
}

export function CurriculoForm({
  mode = "page",
  onCvAvailabilityChange,
  onUploadSuccess,
}: CurriculoFormProps) {
  const isModal = mode === "modal";
  const router = useRouter();
  const { logout } = useAuth();

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvMessage, setCvMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasUploadedCv, setHasUploadedCv] = useState(false);
  const [loadingCvStatus, setLoadingCvStatus] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generatedCvs, setGeneratedCvs] = useState<GeneratedCvItem[]>([]);
  const [loadingGeneratedCvs, setLoadingGeneratedCvs] = useState(true);

  const [currentCvMetadata, setCurrentCvMetadata] = useState<{
    fileName: string;
    fileSize: number;
    uploadedAt: string;
  } | null>(null);
  const [loadingCurrentCv, setLoadingCurrentCv] = useState(true);
  const [pdfThumbnail, setPdfThumbnail] = useState<string | null>(null);

  useEffect(() => {
    async function loadCvStatus() {
      try {
        await getUserCv();
        setHasUploadedCv(true);
      } catch {
        setHasUploadedCv(false);
      } finally {
        setLoadingCvStatus(false);
      }
    }
    void loadCvStatus();
  }, []);

  useEffect(() => {
    onCvAvailabilityChange?.(hasUploadedCv);
  }, [hasUploadedCv, onCvAvailabilityChange]);

  useEffect(() => {
    async function loadCurrentCvMetadata() {
      try {
        const { blob, fileName, fileSize, uploadedAt } = await getUserCv();
        setCurrentCvMetadata({
          fileName,
          fileSize,
          uploadedAt,
        });

        const url = URL.createObjectURL(blob);

        const canvas = await generatePdfThumbnail(url);
        if (canvas) {
          setPdfThumbnail(canvas.toDataURL("image/jpeg", 0.7));
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Erro ao carregar metadados do currículo atual:", error);
      } finally {
        setLoadingCurrentCv(false);
      }
    }
    void loadCurrentCvMetadata();
  }, []);

  useEffect(() => {
    async function loadGeneratedCvs() {
      try {
        const response = await getGeneratedCvs();
        setGeneratedCvs(response.items);
      } catch (error) {
        console.error("Erro ao carregar currículos gerados:", error);
      } finally {
        setLoadingGeneratedCvs(false);
      }
    }
    void loadGeneratedCvs();
  }, []);

  const handleUploadCv = async () => {
    if (!cvFile) {
      setCvMessage("Selecione um arquivo PDF para enviar.");
      return;
    }

    if (cvFile.type !== "application/pdf") {
      setCvMessage("A API aceita apenas arquivos PDF.");
      return;
    }

    try {
      setUploadingCv(true);
      setCvMessage(null);

      await uploadUserCv(cvFile);
      setCvMessage("Currículo enviado com sucesso!");
      setCvFile(null);
      setHasUploadedCv(true);
      onUploadSuccess?.();
    } catch (uploadError) {
      if (uploadError instanceof ApiError && uploadError.status === 401) {
        setCvMessage("Sua sessão expirou. Faça login novamente.");
        logout();
        router.replace("/auth/login");
        return;
      }

      setCvMessage(normalizeError(uploadError));
    } finally {
      setUploadingCv(false);
      try {
        const { fileName, fileSize, uploadedAt } = await getUserCv();
        setCurrentCvMetadata({
          fileName,
          fileSize,
          uploadedAt,
        });
      } catch {
        // ignore metadata refresh errors after upload attempt
      }
    }
  };

  const handleViewUploadedCv = async () => {
    try {
      const { blob } = await getUserCv();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      setCvMessage("Erro ao abrir currículo. Faça upload de um novo.");
    }
  };

  const handleDownloadUploadedCv = async () => {
    try {
      const { blob, fileName } = await getUserCv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setCvMessage("Erro ao baixar currículo.");
    }
  };

  const handleDownloadGeneratedCv = async (item: GeneratedCvItem) => {
    try {
      window.open(item.urlFile, "_blank");
    } catch (error) {
      console.error("Erro ao baixar currículo gerado:", error);
    }
  };

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setCvFile(files[0]);
    }
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const removeSelectedFile = () => {
    setCvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generatePdfThumbnail = async (pdfUrl: string): Promise<HTMLCanvasElement | null> => {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.visibility = "hidden";
      iframe.style.position = "absolute";
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = document.createElement("canvas");
      const width = 200;
      const height = 280;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);

        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(width / 2 - 30, height / 2 - 40, 60, 80);

        ctx.fillStyle = "#64748b";
        ctx.fillRect(width / 2 - 20, height / 2 - 30, 40, 4);
        ctx.fillRect(width / 2 - 20, height / 2 - 20, 40, 4);
        ctx.fillRect(width / 2 - 20, height / 2 - 10, 30, 4);

        ctx.fillStyle = "#475569";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PDF", width / 2, height / 2 + 70);
      }

      document.body.removeChild(iframe);
      return canvas;
    } catch (error) {
      console.error("Erro ao gerar miniatura do PDF:", error);
      return null;
    }
  };

  return (
    <div className={isModal ? "space-y-4" : "max-w-5xl mx-auto space-y-8 pb-12"}>
      {!isModal && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Gerenciar Currículo</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Faça upload do seu currículo base e visualize os currículos gerados automaticamente.
            </p>
          </div>
        </div>
      )}

      {!isModal && hasUploadedCv && (
        <div className="relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl" />
          <div className="bg-white dark:bg-slate-950 border border-blue-500/30 shadow-xl rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <File className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold">Currículo Atual</h3>
              </div>
            </div>

            <div className="p-6">
              {loadingCurrentCv ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <LoaderCircle className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Carregando currículo atual...</p>
                </div>
              ) : !currentCvMetadata ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nenhum currículo enviado
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Faça upload do seu currículo na seção abaixo
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="w-48 h-64 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white">
                      {pdfThumbnail ? (
                        <img
                          src={pdfThumbnail}
                          alt="Miniatura do currículo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                          <FileText className="w-12 h-12 text-slate-400 mb-2" />
                          <span className="text-xs text-slate-500">Sem miniatura</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Nome do arquivo
                      </h4>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100 break-all">
                          {currentCvMetadata.fileName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                          Tamanho do arquivo
                        </h4>
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-blue-500" />
                          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {(currentCvMetadata.fileSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                          Data de upload
                        </h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {formatDate(currentCvMetadata.uploadedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleViewUploadedCv} className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="outline" onClick={handleDownloadUploadedCv}>
                        <Download className="w-4 h-4 mr-2" />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Accordion defaultValue={["upload"]} className="space-y-4">
        <AccordionItem value="upload" className="border-0">
          <div className="relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
            <div className="bg-white dark:bg-slate-950 border border-primary/30 shadow-xl rounded-xl overflow-hidden">
              <AccordionTrigger className=" flex items-center justify-between gap-2 p-6 border-b border-slate-200 dark:border-slate-800 hover:no-underline">
                <div className="flex items-center gap-2 w-full">
                  <Upload className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Upload de Currículo</h3>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="p-8">
                  {isModal && hasUploadedCv && (
                    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300">
                      Currículo detectado para sua conta. Se quiser, você pode enviar um novo PDF.
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleFileSelect}
                    className={`
                      relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out
                      flex flex-col items-center justify-center gap-4 p-12 group
                      ${
                        isDragging
                          ? "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20"
                          : cvFile
                          ? "border-green-500/50 bg-green-500/5 dark:bg-green-500/10"
                          : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10"
                      }
                    `}
                  >
                    {isDragging && (
                      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-primary/10 animate-pulse rounded-xl" />
                    )}

                    <div className="relative z-10 flex flex-col items-center text-center">
                      {cvFile ? (
                        <>
                          <div className="w-20 h-20 rounded-full bg-green-500/20 dark:bg-green-500/30 flex items-center justify-center mb-4 ring-4 ring-green-500/20 dark:ring-green-500/30">
                            <FileText className="w-10 h-10 text-green-600 dark:text-green-400" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Arquivo selecionado!
                          </h4>
                          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                            <FileUp className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-62.5 truncate">
                              {cvFile.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              ({(cvFile.size / 1024).toFixed(2)} KB)
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSelectedFile();
                              }}
                              className="ml-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                            >
                              <X className="w-4 h-4 text-red-500 hover:text-red-600" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                              isDragging
                                ? "bg-primary/30 scale-110 ring-4 ring-primary/30"
                                : "bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 group-hover:scale-105"
                            }`}
                          >
                            <Upload
                              className={`w-10 h-10 transition-all duration-300 ${
                                isDragging
                                  ? "text-primary -translate-y-1"
                                  : "text-primary group-hover:-translate-y-1"
                              }`}
                            />
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {isDragging ? "Solte o arquivo aqui!" : "Arraste seu currículo aqui"}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            ou <span className="text-primary font-semibold underline">clique para selecionar</span>
                          </p>
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-3 py-1"
                          >
                            Formatos aceitos: PDF (máx. 10MB)
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {cvMessage && (
                    <div
                      className={`mt-4 p-4 rounded-lg border text-sm break-all ${
                        cvMessage.includes("sucesso")
                          ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400"
                          : cvMessage.includes("expirou")
                          ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400"
                          : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {cvMessage}
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-center">
                    <Button
                      onClick={() => void handleUploadCv()}
                      disabled={uploadingCv || !cvFile}
                      className="ml-auto px-8 py-6 font-bold shadow-lg rounded-xl"
                    >
                      {uploadingCv ? (
                        <>
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                          Enviando PDF...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          {hasUploadedCv ? "Atualizar currículo" : "Enviar currículo"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </div>
          </div>
        </AccordionItem>

        {!isModal && (
          <AccordionItem value="generated" className="border-0">
            <div className="relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 rounded-l-xl" />
              <div className="bg-white dark:bg-slate-950 border border-purple-500/30 shadow-xl rounded-xl overflow-hidden">
                <AccordionTrigger className="flex items-center justify-between gap-2 p-6 border-b border-slate-200 dark:border-slate-800 hover:no-underline">
                  <div className="w-full flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-bold">Currículos Gerados por IA</h3>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-bold px-3 py-1"
                  >
                    {generatedCvs.length} gerados
                  </Badge>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="p-6">
                    {loadingGeneratedCvs ? (
                      <div className="flex flex-col items-center justify-center py-16 space-y-3">
                        <LoaderCircle className="w-8 h-8 animate-spin text-purple-500" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Carregando currículos gerados...</p>
                      </div>
                    ) : generatedCvs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 space-y-3">
                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Nenhum currículo gerado ainda
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                            Quando você se candidatar a vagas, currículos personalizados serão gerados automaticamente com base na descrição da vaga.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {generatedCvs.map((item) => (
                          <div
                            key={item.id}
                            className="group p-6 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all"
                          >
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-14 h-14 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                                <FileText className="w-7 h-7 text-purple-500" />
                              </div>
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {item.fileName}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDate(item.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all"
                                onClick={() => handleDownloadGeneratedCv(item)}
                                title="Baixar PDF"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </div>
            </div>
          </AccordionItem>
        )}
      </Accordion>

      {!isModal && loadingCvStatus && (
        <p className="text-xs text-slate-500 dark:text-slate-400">Verificando status do currículo...</p>
      )}
    </div>
  );
}
