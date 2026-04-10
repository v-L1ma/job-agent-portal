"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CheckCircle, LoaderCircle, AlertCircle, Search, Lightbulb } from "lucide-react";
import { ApiError, saveUserPreferences, getUserPreferences } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

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

  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [level, setLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

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
        setKeywords(data.skills);
        setLevel(data.level);

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
  }, []);

  const handleAddKeyword = () => {
    const value = newKeyword.trim();
    if (!value) {
      return;
    }

    const exists = keywords.some((item) => item.toLowerCase() === value.toLowerCase());
    if (exists) {
      setNewKeyword("");
      return;
    }

    setKeywords((current) => [...current, value]);
    setNewKeyword("");
  };

  const handleRemoveKeyword = (value: string) => {
    setKeywords((current) => current.filter((item) => item !== value));
  };

  const handleSave = async () => {
    if (!keywords.length) {
      setMessage({
        text: "Adicione pelo menos uma palavra-chave para salvar suas preferências.",
        type: "error",
      });
      return;
    }

    if (!level) {
      setMessage({
        text: "Selecione uma senioridade obrigatória.",
        type: "error",
      });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      await saveUserPreferences({
        skills: keywords,
        level,
        area: "",
      });

      // Atualiza as preferências originais após salvar com sucesso
      setOriginalPreferences({
        skills: keywords,
        level,
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
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {keywords.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 py-2 px-3 rounded-lg flex gap-1.5 items-center border-none cursor-pointer transition-opacity hover:opacity-80 text-sm font-medium"
                      >
                        {tag}
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

                {/* Input */}
                <div className="flex flex-col sm:flex-row gap-2">
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
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleAddKeyword}>
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
                    setLevel(value);
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
            </section>

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
                    setKeywords(originalPreferences.skills);
                    setLevel(originalPreferences.level);
                  }
                  setMessage(null);
                }}
                disabled={!hasChanges}
              >
                Cancelar
              </Button>
              <Button onClick={() => void handleSave()} disabled={saving || !hasChanges}>
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
