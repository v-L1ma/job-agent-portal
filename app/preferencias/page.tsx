"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CheckCircle, LoaderCircle, AlertCircle, Search, Lightbulb } from "lucide-react";
import { ApiError, saveUserPreferences, getUserPreferences } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

const preferencesSchema = z.object({
  skills: z.array(z.string()).min(1, "Adicione pelo menos uma palavra-chave."),
  level: z.string().min(1, "Selecione uma senioridade."),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

function normalizeError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível salvar as preferências.";
}

export default function PreferencesPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [newKeyword, setNewKeyword] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

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
      level: "",
    },
  });

  const keywords = watch("skills");
  const level = watch("level");

  // Estado para armazenar as preferências originais
  const [originalPreferences, setOriginalPreferences] = useState<{
    skills: string[];
    level: string;
  } | null>(null);

  // Verifica se há alterações em relação às preferências originais
  const hasChanges = (() => {
    if (!originalPreferences) return false;

    const keywordsChanged = JSON.stringify(keywords) !== JSON.stringify(originalPreferences.skills);
    const levelChanged = level !== originalPreferences.level;

    return keywordsChanged || levelChanged;
  })();

  useEffect(() => {
    async function loadPreferences() {
      try {
        const data = await getUserPreferences();
        reset({
          skills: data.skills,
          level: data.level,
        });

        // Armazena as preferências originais para comparação e reversão
        setOriginalPreferences({
          skills: data.skills,
          level: data.level,
        });
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPreferences();
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

  const onSave = async (data: PreferencesFormValues) => {
    try {
      setSaving(true);
      setMessage(null);

      await saveUserPreferences({
        skills: data.skills,
        level: data.level,
        area: "",
      });

      // Atualiza as preferências originais após salvar com sucesso
      setOriginalPreferences({
        skills: data.skills,
        level: data.level,
      });

      setMessage({ text: "Preferências salvas com sucesso!", type: "success" });
    } catch (saveError) {
      setMessage({ text: normalizeError(saveError), type: "error" });
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

  return (
    <DashboardLayout title="Preferências de Busca">
      <div className="max-w-3xl mx-auto pb-12 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <LoaderCircle className="w-10 h-10 animate-spin text-emerald-500" />
            <p className="text-slate-500 animate-pulse">Carregando suas preferências...</p>
          </div>
        ) : (
          <>
            <header>
              <h2 className="text-3xl font-black tracking-tight mb-2">Preferências de Busca</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Defina as palavras-chave que serão usadas para encontrar vagas compatíveis com seu perfil.
              </p>
            </header>

            {/* Keywords Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold">Palavras-chave</h3>
              </div>

              {/* Info Box */}
              <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300">Como funciona?</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                      As buscas de vagas são realizadas com base nas <strong>palavras-chave</strong> que você cadastrar aqui.
                      Use termos quebrados e específicos para encontrar vagas mais relevantes.
                    </p>
                    <div className="space-y-1.5 pt-2">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                        Exemplos de palavras-chave:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exampleKeywords.map((example) => (
                          <Badge
                            key={example}
                            variant="secondary"
                            className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-md border-none"
                          >
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords Input Area */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                {/* Keywords Tags */}
                <div className="flex justify-between items-start mb-4 flex-wrap">
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 py-2 px-3 rounded-lg flex gap-1.5 items-center border-none cursor-pointer transition-opacity hover:opacity-80 text-sm font-medium h-auto"
                        >
                          <span className="break-all whitespace-normal">{tag}</span>
                          <button
                            className="inline-flex"
                            onClick={() => handleRemoveKeyword(tag)}
                            aria-label={`Remover ${tag}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div>
                    {keywords.length ?? 0} / 5
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 space-y-1">
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
                      className={newKeyword.length > 30 ? "border-red-500 focus-visible:ring-red-500" : ""}
                      disabled={keywords.length >= 5}
                    />
                    <div className="flex justify-between px-1">
                      <p className={`text-[10px] uppercase font-bold tracking-wider ${newKeyword.length > 30 ? "text-red-500" : "text-slate-400"}`}>
                        {newKeyword.length > 30 ? "Limite excedido" : "Máximo 30 caracteres"}
                      </p>
                      <p className={`text-[10px] font-mono ${newKeyword.length > 30 ? "text-red-500" : "text-slate-400"}`}>
                        {newKeyword.length}/30
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleAddKeyword} disabled={keywords.length >= 5 || newKeyword.length > 30}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </section>

            {/* Level Section */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">
                  Senioridade <span className="text-red-500">*</span>
                </label>
              </div>
              <Select
                value={level}
                onValueChange={(value) => {
                  if (value) {
                    setValue("level", value, { shouldValidate: true });
                  }
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione a senioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Pleno">Pleno</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Especialista">Especialista</SelectItem>
                </SelectContent>
              </Select>
              {errors.level && (
                <p className="text-xs text-red-500 font-medium">{errors.level.message}</p>
              )}
            </section>

            {/* Error Message from Zod Array */}
            {errors.skills && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-sm font-medium">{errors.skills.message}</p>
              </div>
            )}

            {/* Message */}
            {message && (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  message.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                    : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  if (originalPreferences) {
                    reset({
                      skills: originalPreferences.skills,
                      level: originalPreferences.level,
                    });
                  }
                  setMessage(null);
                }}
                disabled={!hasChanges}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit(onSave)} disabled={saving || !hasChanges}>
                {saving ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Preferências"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
