import React from "react";
import { X, ThumbsDown, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackModalProps {
  feedbackJobId: string | null;
  feedbackText: string;
  setFeedbackText: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function FeedbackModal({
  feedbackJobId,
  feedbackText,
  setFeedbackText,
  onClose,
  onConfirm,
  isSubmitting,
}: FeedbackModalProps) {
  if (!feedbackJobId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-trampo-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-trampo-border rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-neutral-400 hover:text-trampo-dark hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 border border-red-100">
            <ThumbsDown className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-trampo-dark">
            Não tenho interesse nesta vaga
          </h3>
        </div>

        <p className="text-xs text-trampo-muted mb-4 leading-relaxed font-semibold">
          Nos dê um feedback rápido do motivo (opcional, máximo de 100 caracteres) para podermos ajustar o algoritmo.
        </p>

        <div className="space-y-1">
          <textarea
            placeholder="Ex: Stack incorreta, vaga presencial em localidade distante..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value.slice(0, 100))}
            className="w-full min-h-[90px] border border-trampo-border bg-white rounded-xl px-3 py-2 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-trampo-primary-500 resize-none font-medium text-trampo-dark"
            maxLength={100}
          />
          <div className="text-[9px] text-right font-bold text-neutral-400 pr-1">
            {feedbackText.length}/100
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl border border-trampo-border text-trampo-dark font-bold text-xs h-9 cursor-pointer"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs h-9 cursor-pointer shadow-md shadow-red-500/10 flex items-center justify-center gap-1.5"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              "Confirmar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
