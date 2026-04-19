"use client";

import { useEffect, useState } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError, completeOnboarding } from "@/lib/api";
import { useAuth } from "../providers/auth-provider";
import { useRouter } from "next/navigation";
import { PreferenciasForm } from "@/components/preferencias/preferencias-form";
import { CurriculoForm } from "@/components/curriculo/curriculo-form";

interface FirstAccessModalProps {
  open: boolean;
  onCompleted: () => void;
}

type ModalMessage = {
  type: "error" | "success";
  text: string;
};

function normalizeError(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export function FirstAccessModal({ open, onCompleted }: FirstAccessModalProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [canFinish, setCanFinish] = useState(false);
  const [finishingOnboarding, setFinishingOnboarding] = useState(false);
  const [message, setMessage] = useState<ModalMessage | null>(null);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setStep(1);
    setCanFinish(false);
    setMessage(null);
  }, [open]);

  if (!open) {
    return null;
  }

  const handleFinish = async () => {
    if (!canFinish) {
      setMessage({
        type: "error",
        text: "Envie um currículo PDF para concluir o onboarding.",
      });
      return;
    }

    try {
      setFinishingOnboarding(true);
      setMessage(null);

      await completeOnboarding();
      setMessage({ type: "success", text: "Onboarding concluído com sucesso." });
      onCompleted();
    } catch (error) {
      setMessage({
        type: "error",
        text: normalizeError(error, "Não foi possível concluir o onboarding."),
      });
    } finally {
      setFinishingOnboarding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Primeiro acesso</p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Finalize sua configuração inicial</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <span className={step === 1 ? "text-primary" : "text-slate-500"}>1. Preferências</span>
              <span>/</span>
              <span className={step === 2 ? "text-primary" : "text-slate-500"}>2. Currículo</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <PreferenciasForm
              mode="modal"
              onSaved={() => {
                setMessage(null);
                setStep(2);
              }}
            />
          )}

          {step === 2 && (
            <CurriculoForm
              mode="modal"
              onCvAvailabilityChange={setCanFinish}
              onUploadSuccess={() => setCanFinish(true)}
            />
          )}

          {message && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-300"
              }`}
            >
              <div className="inline-flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {message.text}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              disabled={finishingOnboarding}
              onClick={handleLogout}
            >
              Sair da conta
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={step === 1 || finishingOnboarding}
              onClick={() => {
                setStep(1);
                setMessage(null);
              }}
            >
              Voltar
            </Button>
          </div>

          {step === 1 ? (
            <span className="text-xs text-slate-500 dark:text-slate-400">Salve as preferências para avançar</span>
          ) : (
            <Button
              type="button"
              onClick={() => void handleFinish()}
              disabled={finishingOnboarding || !canFinish}
            >
              {finishingOnboarding ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Concluir onboarding
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
