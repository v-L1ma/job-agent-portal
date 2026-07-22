"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  X,
  CheckCircle,
  LoaderCircle,
  AlertCircle,
  Search,
  Lightbulb,
} from "lucide-react";
import { getUserPreferences, saveUserPreferences } from "@/services/preference";

const SENIORITY_OPTIONS = ["Estágio", "Junior", "Pleno", "Senior", "Especialista"] as const;

const preferencesSchema = z.object({
  skills: z
    .array(z.string())
    .min(1, "Adicione pelo menos uma palavra-chave.")
    .max(5, "Selecione no máximo 5 palavras-chave."),
  levels: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma senioridade.")
    .max(4, "Selecione no máximo 4 senioridades."),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

type OriginalPreferences = {
  skills: string[];
  levels: string[];
};

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
  const [newKeyword, setNewKeyword] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);
  const [originalPreferences, setOriginalPreferences] = useState<OriginalPreferences | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      skills: [],
      levels: [],
    },
  });

  const keywords = watch("skills") || [];
  const levels = watch("levels") || [];

  const hasChanges = (() => {
    if (!originalPreferences) {
      return false;
    }

    const keywordsChanged = JSON.stringify(keywords) !== JSON.stringify(originalPreferences.skills);
    const levelsChanged = JSON.stringify(levels) !== JSON.stringify(originalPreferences.levels);

    return keywordsChanged || levelsChanged;
  })();

  useEffect(() => {
    async function loadPreferences() {
      try {
        const preferences = await getUserPreferences();
        const pref = preferences[0] ?? { Skills: [], Levels: [] };
        const currentLevels = pref.Levels ?? [];
        const currentSkills = pref.Skills ?? [];

        reset({
          skills: currentSkills,
          levels: currentLevels,
        });

        setOriginalPreferences({
          skills: currentSkills,
          levels: currentLevels,
        });
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadPreferences();
  }, [reset]);

  const handleAddKeyword = () => {
    const value = newKeyword.trim();
    if (!value) {
      return;
    }

    if (value.length > 30) {
      setMessage({
        text: "A palavra-chave deve ter no máximo 30 caracteres.",
        type: "error",
      });
      return;
    }

    if (keywords.length >= 5) {
      setMessage({
        text: "Você pode adicionar no máximo 5 palavras-chave.",
        type: "error",
      });
      return;
    }

    const exists = keywords.some((item) => item.toLowerCase() === value.toLowerCase());
    if (exists) {
      setNewKeyword("");
      return;
    }

    setValue("skills", [...keywords, value], { shouldValidate: true });
    setNewKeyword("");
  };

  const handleRemoveKeyword = (value: string) => {
    setValue(
      "skills",
      keywords.filter((item) => item !== value),
      { shouldValidate: true }
    );
  };

  const handleToggleLevel = (value: (typeof SENIORITY_OPTIONS)[number]) => {
    const nextLevels = levels.includes(value)
      ? levels.filter((item) => item !== value)
      : [...levels, value];

    const orderedLevels = SENIORITY_OPTIONS.filter((option) => nextLevels.includes(option));
    setValue("levels", orderedLevels, { shouldValidate: true });
  };

  const onSave = async (data: PreferencesFormValues) => {
    try {
      setSaving(true);
      setMessage(null);

      await saveUserPreferences({
        skills: data.skills,
        levels: data.levels,
      });

      setOriginalPreferences({
        skills: data.skills,
        levels: data.levels,
      });

      setMessage({ text: "Preferências salvas com sucesso!", type: "success" });
      onSaved?.(data);
    } catch (saveError: any) {
      const errMsg = saveError?.message || "Não foi possível salvar as preferências.";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const exampleKeywords = [
    "Técnico Informática",
    "Suporte N1",
    "React",
    "Desenvolvedor",
    "Node.js",
    "Banco de Dados",
  ];

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

      {/* Keywords Info Box - Styled in custom Trampo Primary glow theme */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-trampo-dark">
          <Search className="w-5 h-5 text-trampo-primary-500" />
          <h2 className="text-sm md:text-base font-bold">Palavras-chave</h2>
        </div>

        <div className="p-5 rounded-2xl border border-trampo-primary-200/50 bg-[#F2FCFA]/80">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-trampo-primary-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-trampo-primary-600 uppercase tracking-wider">Como funciona?</h3>
              <p className="text-xs text-trampo-muted leading-relaxed font-semibold">
                As buscas de vagas são realizadas com base nas <strong>palavras-chave</strong> que você
                cadastrar aqui. Use termos quebrados e específicos para encontrar vagas mais relevantes.
              </p>
              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-extrabold text-trampo-primary-600 uppercase tracking-wide">
                  Exemplos de palavras-chave:
                </p>
                <div className="flex flex-wrap gap-2">
                  {exampleKeywords.map((example) => (
                    <Badge
                      key={example}
                      variant="secondary"
                      className="bg-trampo-primary-100/50 hover:bg-trampo-primary-100 text-trampo-primary-600 text-xs px-2.5 py-0.5 rounded-lg border-none"
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Keywords Area */}
        <div className="p-6 rounded-2xl border border-trampo-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
            {keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keywords.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-[#F2FCFA] text-trampo-primary-600 hover:bg-neutral-100 py-1 px-2.5 rounded-lg flex gap-1.5 items-center border border-trampo-primary-100/50 text-xs font-bold h-auto"
                  >
                    <span className="break-all whitespace-normal">{tag}</span>
                    <button
                      className="inline-flex cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => handleRemoveKeyword(tag)}
                      aria-label={`Remover ${tag}`}
                      type="button"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-trampo-muted font-semibold italic">Nenhuma palavra-chave cadastrada.</p>
            )}
            <div className="text-xs text-trampo-muted font-bold">{keywords.length} / 5</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-extrabold text-trampo-muted uppercase tracking-wider block mb-1">
                Nova palavra-chave
              </label>
              <Input
                value={newKeyword}
                onChange={(event) => setNewKeyword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder='Ex: "Técnico Informática", "Suporte N1", "React"'
                className={`rounded-xl border border-trampo-border focus:border-trampo-primary-500 focus:ring-1 focus:ring-trampo-primary-500 text-xs py-2 px-3 ${
                  newKeyword.length > 30 || errors.skills ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                disabled={keywords.length >= 5}
              />
              <div className="flex justify-between px-1">
                <p
                  className={`text-[9px] uppercase font-bold tracking-wider ${
                    newKeyword.length > 30 ? "text-red-500" : "text-trampo-muted"
                  }`}
                >
                  {newKeyword.length > 30 ? "Limite excedido" : "Máximo 30 caracteres"}
                </p>
                <p
                  className={`text-[9px] font-mono font-semibold ${
                    newKeyword.length > 30 ? "text-red-500" : "text-trampo-muted"
                  }`}
                >
                  {newKeyword.length}/30
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border border-trampo-border text-trampo-dark hover:bg-neutral-50 font-bold text-xs h-9 cursor-pointer px-4 mt-5 sm:mt-5.5"
              onClick={handleAddKeyword}
              disabled={keywords.length >= 5 || newKeyword.length > 30}
            >
              Adicionar
            </Button>
          </div>

          {errors.skills && (
            <p className="mt-2 text-xs font-semibold text-red-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.skills.message}
            </p>
          )}
        </div>
      </section>

      {/* Seniority Section */}
      <section className="space-y-4 p-6 rounded-2xl border border-trampo-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <div className="flex flex-col gap-1">
          <Label className="text-sm font-bold text-trampo-dark">
            Senioridades <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-trampo-muted font-semibold font-sans">Selecione os níveis de experiência para as vagas.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {SENIORITY_OPTIONS.map((option) => (
            <div key={option} className="flex items-center space-x-3 cursor-pointer group p-2 hover:bg-neutral-50 rounded-xl transition-colors">
              <Checkbox
                id={`level-${option}`}
                checked={levels.includes(option)}
                onCheckedChange={() => handleToggleLevel(option)}
              />
              <Label
                htmlFor={`level-${option}`}
                className="text-xs font-bold text-trampo-dark leading-none cursor-pointer group-hover:text-trampo-primary-600 transition-colors"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>

        {errors.levels && (
          <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5 pt-2">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.levels.message}
          </p>
        )}
      </section>

      {/* Toast Alert Messages */}
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

      {/* Submit Buttons */}
      <div className="pt-4 border-t border-trampo-border flex justify-end gap-3">
        {!isModal && (
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border border-trampo-border text-trampo-dark hover:bg-neutral-50 font-bold text-xs h-9 cursor-pointer px-4"
            onClick={() => {
              if (originalPreferences) {
                reset({
                  skills: originalPreferences.skills,
                  levels: originalPreferences.levels,
                });
              }
              setMessage(null);
            }}
            disabled={!hasChanges}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="button"
          className="rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs h-9 shadow-md shadow-trampo-primary-500/10 cursor-pointer px-6 inline-flex items-center gap-1.5"
          onClick={handleSubmit(onSave)}
          disabled={saving || (!isModal && !hasChanges)}
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
