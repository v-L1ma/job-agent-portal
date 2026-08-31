"use client";

import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  AlertCircle,
  Search,
  Lightbulb,
  LoaderCircle,
} from "lucide-react";

export const keywordsSchema = z.object({
  skills: z
    .array(z.string())
    .min(1, "Adicione pelo menos uma palavra-chave.")
    .max(5, "Selecione no máximo 5 palavras-chave."),
});

export type KeywordsFormValues = z.infer<typeof keywordsSchema>;

export interface KeywordsFormHandle {
  getData: () => KeywordsFormValues;
  isValid: boolean;
}

interface KeywordsFormProps {
  initialData?: string[];
  onValidityChange?: (isValid: boolean) => void;
}

const exampleKeywords = [
  "Técnico Informática",
  "Suporte N1",
  "React",
  "Desenvolvedor",
  "Node.js",
  "Banco de Dados",
];

export const KeywordsForm = forwardRef<KeywordsFormHandle, KeywordsFormProps>(
  function KeywordsForm({ initialData = [], onValidityChange }, ref) {
    const [newKeyword, setNewKeyword] = useState("");
    // const [loading, setLoading] = useState(!initialData.length);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const {
      setValue,
      watch,
      formState: { errors, isValid },
    } = useForm<KeywordsFormValues>({
      resolver: zodResolver(keywordsSchema),
      defaultValues: { skills: initialData },
    });

    const keywords = watch("skills") || [];

    useImperativeHandle(ref, () => ({
      getData: () => ({ skills: keywords }),
      isValid,
    }));

    useEffect(() => {
      onValidityChange?.(isValid);
    }, [isValid, onValidityChange]);

    // useEffect(() => {
    //   if (initialData.length > 0) {
    //     setLoading(false);
    //   }
    // }, [initialData]);

    const handleAddKeyword = () => {
      const value = newKeyword.trim();
      if (!value) return;

      if (value.length > 30) {
        setMessage({ text: "A palavra-chave deve ter no máximo 30 caracteres.", type: "error" });
        return;
      }

      if (keywords.length >= 5) {
        setMessage({ text: "Você pode adicionar no máximo 5 palavras-chave.", type: "error" });
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

    // if (loading) {
    //   return (
    //     <div className="flex flex-col items-center justify-center py-8 space-y-4">
    //       <LoaderCircle className="w-10 h-10 animate-spin text-trampo-primary-500" />
    //       <p className="text-trampo-muted animate-pulse text-sm font-semibold">
    //         Carregando palavras-chave...
    //       </p>
    //     </div>
    //   );
    // }

    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-trampo-dark">
          <Search className="w-5 h-5 text-trampo-primary-500" />
          <h2 className="text-sm md:text-base font-bold">Palavras-chave</h2>
        </div>

        <div className="p-5 rounded-2xl border border-trampo-primary-200/50 bg-[#F2FCFA]/80">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-trampo-primary-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-trampo-primary-600 uppercase tracking-wider">
                Como funciona?
              </h3>
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
              <p className="text-xs text-trampo-muted font-semibold italic">
                Nenhuma palavra-chave cadastrada.
              </p>
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
                placeholder="Ex: Desenvolvedor React"
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

        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-[#F2FCFA] border-trampo-primary-200 text-trampo-primary-600"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="text-xs font-bold">{message.text}</p>
          </div>
        )}
      </section>
    );
  }
);
