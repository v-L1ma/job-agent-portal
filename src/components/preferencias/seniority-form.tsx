"use client";

import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, LoaderCircle } from "lucide-react";

const SENIORITY_OPTIONS = ["Estágio", "Junior", "Pleno", "Senior", "Especialista"] as const;

export const senioritySchema = z.object({
  levels: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma senioridade.")
    .max(4, "Selecione no máximo 4 senioridades."),
});

export type SeniorityFormValues = z.infer<typeof senioritySchema>;

export interface SeniorityFormHandle {
  getData: () => SeniorityFormValues;
  isValid: boolean;
}

interface SeniorityFormProps {
  initialData?: string[];
  onValidityChange?: (isValid: boolean) => void;
}

export const SeniorityForm = forwardRef<SeniorityFormHandle, SeniorityFormProps>(
  function SeniorityForm({ initialData, onValidityChange }, ref) {
    const [loading, setLoading] = useState(!initialData);

    const {
      setValue,
      watch,
      formState: { errors, isValid },
    } = useForm<SeniorityFormValues>({
      resolver: zodResolver(senioritySchema),
      defaultValues: { levels: initialData ?? [] },
    });

    const levels = watch("levels") || [];

    useImperativeHandle(ref, () => ({
      getData: () => ({ levels }),
      isValid,
    }));

    useEffect(() => {
      onValidityChange?.(isValid);
    }, [isValid, onValidityChange]);

    useEffect(() => {
      if (initialData) {
        setLoading(false);
      }
    }, [initialData]);

    const handleToggleLevel = (value: (typeof SENIORITY_OPTIONS)[number]) => {
      const nextLevels = levels.includes(value)
        ? levels.filter((item) => item !== value)
        : [...levels, value];

      const orderedLevels = SENIORITY_OPTIONS.filter((option) => nextLevels.includes(option));
      setValue("levels", orderedLevels, { shouldValidate: true });
    };

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <LoaderCircle className="w-10 h-10 animate-spin text-trampo-primary-500" />
          <p className="text-trampo-muted animate-pulse text-sm font-semibold">
            Carregando senioridades...
          </p>
        </div>
      );
    }

    return (
      <section className="space-y-4 p-6 rounded-2xl border border-trampo-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <div className="flex flex-col gap-1">
          <Label className="text-sm font-bold text-trampo-dark">
            Senioridades <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-trampo-muted font-semibold font-sans">
            Selecione os níveis de experiência para as vagas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {SENIORITY_OPTIONS.map((option) => (
            <div
              key={option}
              className="flex items-center space-x-3 cursor-pointer group p-2 hover:bg-neutral-50 rounded-xl transition-colors"
            >
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
    );
  }
);
