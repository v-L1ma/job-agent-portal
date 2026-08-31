"use client";

import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";

export const precisionSchema = z.object({
  precision: z.number().min(1).max(100),
});

export type PrecisionFormValues = z.infer<typeof precisionSchema>;

export interface PrecisionFormHandle {
  getData: () => PrecisionFormValues;
  isValid: boolean;
}

interface PrecisionFormProps {
  initialData?: number;
  onValidityChange?: (isValid: boolean) => void;
}

export const PrecisionForm = forwardRef<PrecisionFormHandle, PrecisionFormProps>(
  function PrecisionForm({ initialData, onValidityChange }, ref) {
    const [loading, setLoading] = useState(initialData === undefined);
    const [sliderTemp, setSliderTemp] = useState<number | null>(null);

    const {
      setValue,
      watch,
      formState: { errors, isValid },
    } = useForm<PrecisionFormValues>({
      resolver: zodResolver(precisionSchema),
      defaultValues: { precision: initialData ?? 70 },
    });

    const precision = watch("precision");

    useImperativeHandle(ref, () => ({
      getData: () => ({ precision }),
      isValid,
    }));

    useEffect(() => {
      onValidityChange?.(isValid);
    }, [isValid, onValidityChange]);

    useEffect(() => {
      if (initialData !== undefined) {
        setLoading(false);
      }
    }, [initialData]);

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <LoaderCircle className="w-10 h-10 animate-spin text-trampo-primary-500" />
          <p className="text-trampo-muted animate-pulse text-sm font-semibold">
            Carregando precisão...
          </p>
        </div>
      );
    }

    return (
      <section className="space-y-4 p-6 rounded-2xl border border-trampo-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <div className="flex flex-col gap-1">
          <Label className="text-sm font-bold text-trampo-dark">
            Precisão das Vagas
          </Label>
          <p className="text-xs text-trampo-muted font-semibold font-sans">
            Ajuste a precisão da busca. Quanto maior, mais rigorosa será a filtragem.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <input
            type="range"
            min={1}
            max={100}
            step={0.5}
            value={sliderTemp ?? precision}
            onChange={(e) => setSliderTemp(Number(e.target.value))}
            onMouseUp={() => {
              if (sliderTemp !== null) {
                setValue("precision", sliderTemp, { shouldValidate: true });
                setSliderTemp(null);
              }
            }}
            onTouchEnd={() => {
              if (sliderTemp !== null) {
                setValue("precision", sliderTemp, { shouldValidate: true });
                setSliderTemp(null);
              }
            }}
            style={{ "--fill": `${sliderTemp ?? precision}%` } as React.CSSProperties}
            className="flex-1 h-6"
          />
          <input
            type="number"
            min={1}
            max={100}
            step={0.5}
            value={precision}
            onChange={(e) => {
              const val = Math.min(100, Math.max(1, Number(e.target.value)));
              setValue("precision", val, { shouldValidate: true });
            }}
            className="w-20 rounded-xl border border-trampo-border focus:border-trampo-primary-500 focus:ring-1 focus:ring-trampo-primary-500 text-xs py-2 px-3 text-center font-bold"
          />
        </div>

        <div className="flex justify-between px-1">
          <p className="text-[9px] uppercase font-bold tracking-wider text-trampo-muted">
            1 (menos preciso)
          </p>
          <p className="text-[9px] uppercase font-bold tracking-wider text-trampo-muted">
            100 (mais preciso)
          </p>
        </div>

        {errors.precision && (
          <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5">
            {errors.precision.message}
          </p>
        )}
      </section>
    );
  }
);
