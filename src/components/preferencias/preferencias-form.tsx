"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, LoaderCircle, AlertCircle } from "lucide-react";
import { getUserPreferences, saveUserPreferences } from "@/services/preference";
import {
  KeywordsForm,
  KeywordsFormHandle,
  KeywordsFormValues,
} from "./keywords-form";
import {
  PrecisionForm,
  PrecisionFormHandle,
  PrecisionFormValues,
} from "./precision-form";
import {
  SeniorityForm,
  SeniorityFormHandle,
  SeniorityFormValues,
} from "./seniority-form";

type PreferencesFormValues = KeywordsFormValues & PrecisionFormValues & SeniorityFormValues;

type Message = {
  text: string;
  type: "success" | "error";
};

interface PreferenciasFormProps {
  mode?: "page" | "modal";
  onSaved?: (data: PreferencesFormValues) => void;
}

export function PreferenciasForm({ mode = "page", onSaved }: PreferenciasFormProps) {
  const isModal = mode === "modal";
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);

  const keywordsRef = useRef<KeywordsFormHandle>(null);
  const precisionRef = useRef<PrecisionFormHandle>(null);
  const seniorityRef = useRef<SeniorityFormHandle>(null);

  const [initialSkills, setInitialSkills] = useState<string[]>([]);
  const [initialPrecision, setInitialPrecision] = useState<number | undefined>(undefined);
  const [initialLevels, setInitialLevels] = useState<string[]>([]);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const pref = await getUserPreferences();
        const currentLevels = pref?.Levels ?? [];
        const currentSkills = pref?.Keywords ?? [];
        const currentPrecision = (pref?.SimilarityPercent ?? 0) * 100;

        setInitialSkills(currentSkills);
        setInitialPrecision(currentPrecision);
        setInitialLevels(currentLevels);
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadPreferences();
  }, []);

  const collectData = (): PreferencesFormValues | null => {
    const keywords = keywordsRef.current?.getData();
    const precision = precisionRef.current?.getData();
    const seniority = seniorityRef.current?.getData();

    if (!keywords || !precision || !seniority) return null;

    return {
      ...keywords,
      ...precision,
      ...seniority,
    };
  };

  const onSave = async () => {
    const data = collectData();
    if (!data) return;

    try {
      setSaving(true);
      setMessage(null);

      await saveUserPreferences({
        skills: data.skills,
        levels: data.levels,
        precision: data.precision / 100,
      });

      setMessage({ text: "Preferências salvas com sucesso!", type: "success" });
      onSaved?.(data);
    } catch (saveError: unknown) {
      const errMsg = saveError instanceof Error ? saveError.message : "Não foi possível salvar as preferências.";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${isModal ? "py-8" : "py-20"}`}>
        <LoaderCircle className="w-10 h-10 animate-spin text-trampo-primary-500" />
        <p className="text-trampo-muted animate-pulse text-sm font-semibold">Carregando suas preferências...</p>
      </div>
    );
  }

  return (
    <div className={isModal ? "space-y-6" : "max-w-4xl mx-auto pb-12 space-y-8"}>
      {!isModal && (
        <header className="mb-6">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">
            Preferências de Busca
          </h1>
          <p className="text-xs md:text-sm text-trampo-muted font-semibold">
            Defina as palavras-chave que serão usadas para encontrar vagas compatíveis com seu perfil.
          </p>
        </header>
      )}

      <KeywordsForm ref={keywordsRef} initialData={initialSkills} />
      <PrecisionForm ref={precisionRef} initialData={initialPrecision} />
      <SeniorityForm ref={seniorityRef} initialData={initialLevels} />

      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-[#F2FCFA] border-trampo-primary-200 text-trampo-primary-600"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-xs font-bold">{message.text}</p>
        </div>
      )}

      <div className="pt-4 border-t border-trampo-border flex justify-end gap-3">
        <Button
          type="button"
          className="rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs h-9 shadow-md shadow-trampo-primary-500/10 cursor-pointer px-6 inline-flex items-center gap-1.5"
          onClick={onSave}
        >
          {saving ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : isModal ? (
            "Salvar e continuar"
          ) : (
            "Salvar Preferências"
          )}
        </Button>
      </div>
    </div>
  );
}
