import React from "react";
import { X, Sparkles, CheckCircle2, FileText, Download, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CvGenerationModalProps {
  state: 'idle' | 'loading' | 'success' | 'error';
  generatedCv: { blob: Blob; fileName: string } | null;
  errorMsg: string | null;
  onClose: () => void;
  onDownload: () => void;
}

export function CvGenerationModal({
  state,
  generatedCv,
  errorMsg,
  onClose,
  onDownload,
}: CvGenerationModalProps) {
  if (state === 'idle') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-trampo-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-trampo-border rounded-3xl w-full max-w-md p-7 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
        
        {/* CLOSE GHOST BUTTON FOR SUCCESS/ERROR ONLY */}
        {state !== 'loading' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-trampo-dark hover:bg-neutral-50 transition-colors cursor-pointer border border-transparent hover:border-trampo-border/50"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* LOADING STATE */}
        {state === 'loading' && (
          <div className="space-y-5 py-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-50"></div>
              <div className="absolute inset-0 rounded-full border-4 border-trampo-primary-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-trampo-primary-500 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-trampo-dark">Personalizando seu currículo...</h3>
              <p className="text-xs text-trampo-muted leading-relaxed font-semibold max-w-xs mx-auto">
                Nossa IA está adaptando seu perfil profissional para os termos da vaga. Isso pode levar alguns segundos.
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {state === 'success' && generatedCv && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="w-14 h-14 bg-trampo-primary-50 border border-trampo-primary-100 rounded-full flex items-center justify-center text-trampo-primary-500 mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-trampo-dark">Currículo pronto!</h3>
              <p className="text-xs text-trampo-muted font-semibold">
                Seu documento personalizado em PDF foi estruturado com sucesso.
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 border border-trampo-border text-left">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-trampo-border text-trampo-primary-500 shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-trampo-dark truncate">{generatedCv.fileName}</p>
                <p className="text-[9px] text-trampo-muted uppercase tracking-wider font-extrabold font-mono">PDF Document</p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-neutral-500 hover:text-trampo-dark hover:bg-white border border-transparent hover:border-trampo-border rounded-lg"
                onClick={onDownload}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                className="w-full h-10 rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs shadow-md shadow-trampo-primary-500/10 cursor-pointer flex items-center justify-center gap-1.5"
                onClick={onDownload}
              >
                <Download className="w-4 h-4" />
                Baixar Currículo Personalizado
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-9 rounded-xl hover:bg-neutral-50 text-xs font-semibold text-trampo-muted hover:text-trampo-dark border border-transparent hover:border-trampo-border/50"
                onClick={onClose}
              >
                Voltar para a lista
              </Button>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {state === 'error' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto">
                <XCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-trampo-dark">Houve uma falha</h3>
              <p className="text-xs text-trampo-muted leading-relaxed font-semibold px-2">
                {errorMsg || "Não foi possível gerar seu currículo personalizado."}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                className="w-full h-10 rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs"
                onClick={onClose}
              >
                Fechar e Voltar
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
