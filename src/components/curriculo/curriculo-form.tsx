"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  uploadUserCv,
  getUserCv,
  getGeneratedCvs,
  downloadGeneratedCv,
} from "@/services/cv";
import { GeneratedCvItem } from "@/types/cv";
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
  Download,
  Clock,
  X,
  FileUp,
  Sparkles,
  Eye,
  File,
  Calendar,
  HardDrive,
  AlertCircle,
} from "lucide-react";

function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
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

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvMessage, setCvMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
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

  const generatePdfThumbnail = async (pdfUrl: string): Promise<HTMLCanvasElement | null> => {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.visibility = "hidden";
      iframe.style.position = "absolute";
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = document.createElement("canvas");
      const width = 160;
      const height = 220;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "#e4e4e7";
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);

        // Drawing document outline
        ctx.fillStyle = "#a1a1aa";
        ctx.fillRect(width / 2 - 20, height / 2 - 35, 40, 50);

        // Simulated text lines
        ctx.fillStyle = "#e4e4e7";
        ctx.fillRect(width / 2 - 15, height / 2 - 25, 30, 3);
        ctx.fillRect(width / 2 - 15, height / 2 - 17, 30, 3);
        ctx.fillRect(width / 2 - 15, height / 2 - 9, 20, 3);

        ctx.fillStyle = "#2EAF92";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PDF", width / 2, height / 2 + 35);
      }

      document.body.removeChild(iframe);
      return canvas;
    } catch (error) {
      console.error("Erro ao gerar miniatura do PDF:", error);
      return null;
    }
  };

  const loadCvStatusAndMetadata = useCallback(async () => {
    try {
      setLoadingCurrentCv(true);
      const { blob, fileName, fileSize, uploadedAt } = await getUserCv();
      setHasUploadedCv(true);
      setCurrentCvMetadata({
        fileName,
        fileSize,
        uploadedAt,
      });

      const url = URL.createObjectURL(blob);
      const canvas = await generatePdfThumbnail(url);
      if (canvas) {
        setPdfThumbnail(canvas.toDataURL("image/jpeg", 0.7));
      }
      URL.revokeObjectURL(url);
    } catch (error) {
      setHasUploadedCv(false);
      setCurrentCvMetadata(null);
      setPdfThumbnail(null);
    } finally {
      setLoadingCurrentCv(false);
      setLoadingCvStatus(false);
    }
  }, []);

  const loadGeneratedCvsList = useCallback(async () => {
    try {
      setLoadingGeneratedCvs(true);
      const items = await getGeneratedCvs();
      setGeneratedCvs(items);
    } catch (error) {
      console.error("Erro ao carregar currículos gerados:", error);
    } finally {
      setLoadingGeneratedCvs(false);
    }
  }, []);

  useEffect(() => {
    void loadCvStatusAndMetadata();
    void loadGeneratedCvsList();
  }, [loadCvStatusAndMetadata, loadGeneratedCvsList]);

  useEffect(() => {
    onCvAvailabilityChange?.(hasUploadedCv);
  }, [hasUploadedCv, onCvAvailabilityChange]);

  const handleUploadCv = async () => {
    if (!cvFile) {
      setCvMessage({ text: "Selecione um arquivo PDF para enviar.", type: "error" });
      return;
    }

    if (cvFile.type !== "application/pdf") {
      setCvMessage({ text: "A API aceita apenas arquivos PDF.", type: "error" });
      return;
    }

    try {
      setUploadingCv(true);
      setCvMessage(null);

      await uploadUserCv(cvFile);
      setCvMessage({ text: "Currículo enviado com sucesso!", type: "success" });
      setCvFile(null);
      setHasUploadedCv(true);
      onUploadSuccess?.();
      await loadCvStatusAndMetadata();
    } catch (uploadError: any) {
      const msg = uploadError?.message || "Não foi possível enviar o currículo.";
      setCvMessage({ text: msg, type: "error" });
    } finally {
      setUploadingCv(false);
    }
  };

  const handleViewUploadedCv = async () => {
    try {
      const { blob } = await getUserCv();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      setCvMessage({ text: "Erro ao abrir currículo. Faça upload de um novo.", type: "error" });
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
      setCvMessage({ text: "Erro ao baixar currículo.", type: "error" });
    }
  };

  const handleDownloadGeneratedCv = async (item: GeneratedCvItem) => {
    try {
      const { blob, fileName } = await downloadGeneratedCv(item.JobId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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

  return (
    <div className={isModal ? "space-y-6" : "max-w-5xl mx-auto space-y-8 pb-12"}>
      {!isModal && (
        <header className="mb-6">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">
            Gerenciar Currículo
          </h1>
          <p className="text-xs md:text-sm text-trampo-muted font-semibold">
            Faça upload do seu currículo base e visualize os currículos gerados automaticamente.
          </p>
        </header>
      )}

      {/* Currículo Atual Card - Custom SaaS look matching DESIGN.md */}
      {!isModal && hasUploadedCv && (
        <div className="relative overflow-hidden bg-white border border-trampo-border shadow-[0_12px_40px_rgba(0,0,0,0.015)] rounded-2xl p-6">
          <div className="absolute top-0 left-0 w-1 h-full bg-trampo-primary-500" />
          
          <div className="flex items-center gap-2 mb-6 text-trampo-dark">
            <File className="w-5 h-5 text-trampo-primary-500" />
            <h2 className="text-sm md:text-base font-bold">Currículo Atual</h2>
          </div>

          {loadingCurrentCv ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <LoaderCircle className="w-8 h-8 animate-spin text-trampo-primary-500" />
              <p className="text-xs text-trampo-muted font-semibold">Carregando currículo atual...</p>
            </div>
          ) : !currentCvMetadata ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center">
                <FileText className="w-8 h-8 text-neutral-300" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-trampo-dark mb-1">Nenhum currículo enviado</p>
                <p className="text-[10px] text-trampo-muted font-semibold">Faça upload do seu currículo na seção abaixo</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="w-40 h-56 rounded-xl overflow-hidden border border-trampo-border shadow-sm bg-white flex items-center justify-center">
                  {pdfThumbnail ? (
                    <img
                      src={pdfThumbnail}
                      alt="Miniatura do currículo"
                      className="w-full h-full object-cover animate-fade-in"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 text-neutral-400">
                      <FileText className="w-10 h-10 mb-2 text-neutral-300" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Sem miniatura</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-trampo-muted mb-1 block">
                      Nome do arquivo
                    </h3>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-trampo-primary-500 shrink-0" />
                      <p className="text-sm font-bold text-trampo-dark break-all leading-snug">
                        {currentCvMetadata.fileName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-trampo-muted mb-1 block">
                        Tamanho
                      </h3>
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-trampo-primary-500 shrink-0" />
                        <p className="text-xs font-bold text-trampo-dark">
                          {(currentCvMetadata.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-trampo-muted mb-1 block">
                        Data de upload
                      </h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-trampo-primary-500 shrink-0" />
                        <p className="text-xs font-bold text-trampo-dark">
                          {formatDate(currentCvMetadata.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleViewUploadedCv}
                    className="flex-1 rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs h-9 shadow-md shadow-trampo-primary-500/10 cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadUploadedCv}
                    className="rounded-xl border border-trampo-border text-trampo-dark hover:bg-neutral-50 font-bold text-xs h-9 cursor-pointer px-4 inline-flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    Baixar PDF
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion Panels */}
      <Accordion defaultValue={["upload"]} className="space-y-4">
        <AccordionItem value="upload" className="border border-trampo-border bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-trampo-primary-500" />
            <AccordionTrigger className="flex items-center justify-between gap-2 p-6 hover:no-underline font-bold text-trampo-dark">
              <div className="flex items-center gap-2 w-full">
                <Upload className="w-5 h-5 text-trampo-primary-500" />
                <span className="text-sm md:text-base font-bold">Upload de Currículo</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-6 pt-0 border-t border-neutral-50">
              <div className="pt-6">
                {isModal && hasUploadedCv && (
                  <div className="mb-4 rounded-xl border border-trampo-primary-200 bg-[#F2FCFA] px-4 py-3 text-xs text-trampo-primary-600 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
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
                    relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
                    flex flex-col items-center justify-center gap-4 p-10 group
                    ${
                      isDragging
                        ? "border-trampo-primary-500 bg-[#F2FCFA] scale-[1.01] shadow-md shadow-trampo-primary-500/5"
                        : cvFile
                        ? "border-emerald-500 bg-emerald-50/20"
                        : "border-neutral-200 bg-neutral-50/50 hover:border-trampo-primary-500/50 hover:bg-[#F2FCFA]/20"
                    }
                  `}
                >
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {cvFile ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                          <FileText className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h4 className="text-sm font-bold text-trampo-dark mb-1">
                          Arquivo selecionado!
                        </h4>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold shadow-sm">
                          <FileUp className="w-3.5 h-3.5 text-trampo-primary-500" />
                          <span className="max-w-[200px] truncate text-trampo-dark font-bold">
                            {cvFile.name}
                          </span>
                          <span className="text-neutral-400 font-medium">
                            ({(cvFile.size / 1024).toFixed(1)} KB)
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSelectedFile();
                            }}
                            className="ml-1 p-0.5 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                            isDragging
                              ? "bg-trampo-primary-500/20 scale-105"
                              : "bg-trampo-primary-500/10 group-hover:bg-trampo-primary-500/20"
                          }`}
                        >
                          <Upload
                            className={`w-7 h-7 text-trampo-primary-500 transition-transform ${
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

                {cvMessage && (
                  <div
                    className={`mt-4 p-4 rounded-xl border text-xs font-bold ${
                      cvMessage.type === "success"
                        ? "bg-[#F2FCFA] border-trampo-primary-200 text-trampo-primary-600"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {cvMessage.text}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => void handleUploadCv()}
                    disabled={uploadingCv || !cvFile}
                    className="rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs h-9 shadow-md shadow-trampo-primary-500/10 cursor-pointer px-6 inline-flex items-center gap-1.5"
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
        </AccordionItem>

        {!isModal && (
          <AccordionItem value="generated" className="border border-trampo-border bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.015)] overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
              <AccordionTrigger className="flex items-center justify-between gap-2 p-6 hover:no-underline font-bold text-trampo-dark">
                <div className="w-full flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="text-sm md:text-base font-bold">Currículos Gerados por IA</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 hover:bg-purple-100 text-purple-700 text-xs font-extrabold px-2.5 py-0.5 rounded-lg border-none"
                >
                  {generatedCvs?.length ?? 0} gerados
                </Badge>
              </AccordionTrigger>

              <AccordionContent className="p-6 pt-0 border-t border-neutral-50">
                <div className="pt-4">
                  {loadingGeneratedCvs ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-3">
                      <LoaderCircle className="w-8 h-8 animate-spin text-purple-500" />
                      <p className="text-xs text-trampo-muted font-semibold">Carregando currículos gerados...</p>
                    </div>
                  ) : generatedCvs?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-400">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs font-bold text-trampo-dark">Nenhum currículo gerado ainda</p>
                        <p className="text-[10px] text-trampo-muted font-semibold max-w-sm mx-auto leading-relaxed">
                          Quando você se candidatar a vagas, currículos personalizados serão gerados automaticamente com base na descrição da vaga.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100">
                      {generatedCvs?.map((item) => (
                        <div
                          key={item.JobId}
                          className="group py-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 rounded-xl px-2 transition-all"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-purple-500" />
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-trampo-dark truncate leading-tight">
                                {item.Title}
                              </h4>
                              <p className="text-[10px] text-trampo-muted font-semibold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                                <span className="truncate">{item.FileName}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-neutral-400 hover:text-trampo-primary-500 hover:bg-[#F2FCFA] rounded-lg transition-all cursor-pointer"
                              onClick={() => handleDownloadGeneratedCv(item)}
                              title="Baixar PDF"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        )}
      </Accordion>

      {!isModal && loadingCvStatus && (
        <div className="flex items-center gap-2">
          <LoaderCircle className="w-4 h-4 animate-spin text-trampo-primary-500" />
          <p className="text-[10px] text-trampo-muted font-bold">Verificando status do currículo...</p>
        </div>
      )}
    </div>
  );
}
