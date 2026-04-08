"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CheckCircle, BriefcaseBusiness, LoaderCircle, AlertCircle } from "lucide-react";
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

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [level, setLevel] = useState("Pleno");
  const [area, setArea] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  // Estado para armazenar as preferências originais
  const [originalPreferences, setOriginalPreferences] = useState<{
    skills: string[];
    level: string;
    area: string;
  } | null>(null);

  // Verifica se há alterações em relação às preferências originais
  const hasChanges = (() => {
    if (!originalPreferences) return false;
    
    const skillsChanged = JSON.stringify(skills) !== JSON.stringify(originalPreferences.skills);
    const levelChanged = level !== originalPreferences.level;
    const areaChanged = area !== originalPreferences.area;
    
    return skillsChanged || levelChanged || areaChanged;
  })();

  useEffect(() => {
    async function loadPreferences() {
      try {
        const data = await getUserPreferences();
        setSkills(data.skills);
        setLevel(data.level);
        setArea(data.area);
        
        // Armazena as preferências originais para comparação e reversão
        setOriginalPreferences({
          skills: data.skills,
          level: data.level,
          area: data.area,
        });
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPreferences();
  }, []);

  const handleAddSkill = () => {
    const value = newSkill.trim();
    if (!value) {
      return;
    }

    const exists = skills.some((item) => item.toLowerCase() === value.toLowerCase());
    if (exists) {
      setNewSkill("");
      return;
    }

    setSkills((current) => [...current, value]);
    setNewSkill("");
  };

  const handleRemoveSkill = (value: string) => {
    setSkills((current) => current.filter((item) => item !== value));
  };

  const handleSave = async () => {
    if (!skills.length) {
      setMessage({
        text: "Adicione pelo menos uma skill para salvar suas preferências.",
        type: "error",
      });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      await saveUserPreferences({
        skills,
        level,
        area,
      });

      // Atualiza as preferências originais após salvar com sucesso
      setOriginalPreferences({
        skills,
        level,
        area,
      });

      setMessage({ text: "Preferências salvas com sucesso!", type: "success" });
    } catch (saveError) {
      setMessage({ text: normalizeError(saveError), type: "error" });
    } finally {
      setSaving(false);
    }
  };

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
                Ajuste skills, senioridade e área para melhorar o match das vagas encontradas.
              </p>
            </header>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-bold">Skills</h3>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 py-1.5 px-3 rounded-lg flex gap-1 items-center border-none cursor-pointer transition-opacity hover:opacity-80"
                >
                  {tag}
                  <button
                    className="inline-flex"
                    onClick={() => handleRemoveSkill(tag)}
                    aria-label={`Remover ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newSkill}
                onChange={(event) => setNewSkill(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Digite uma skill e pressione Enter"
              />
              <Button variant="outline" onClick={handleAddSkill}>
                Adicionar
              </Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Senioridade</label>
            <Select
              value={level}
              onValueChange={(value) => {
                if (value) {
                  setLevel(value);
                }
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Pleno">Pleno</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
                <SelectItem value="Especialista">Especialista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Área de atuação</label>
            <div className="relative">
              <BriefcaseBusiness className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder="Ex: Desenvolvimento Backend"
                className="pl-9"
              />
            </div>
          </div>
        </section>

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

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => {
              if (originalPreferences) {
                setSkills(originalPreferences.skills);
                setArea(originalPreferences.area);
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
