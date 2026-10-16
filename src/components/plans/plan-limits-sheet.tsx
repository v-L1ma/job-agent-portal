"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { updatePlanLimits } from "@/services/plan";
import { Plan } from "@/types/plan";

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function validateLimitValue(
  value: string,
  path: "dailyCvLimit" | "dailyApplicationLimit",
  ctx: z.RefinementCtx
) {
  const trimmed = value.trim();
  if (trimmed === "") {
    ctx.addIssue({
      code: "custom",
      path: [path],
      message: "Este campo é obrigatório",
    });
    return;
  }
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed < 0) {
    ctx.addIssue({
      code: "custom",
      path: [path],
      message: "Informe um número inteiro maior ou igual a 0",
    });
  }
}

const planLimitsSchema = z
  .object({
    dailyCvUnlimited: z.boolean(),
    dailyCvLimit: z.string(),
    dailyApplicationUnlimited: z.boolean(),
    dailyApplicationLimit: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.dailyCvUnlimited) {
      validateLimitValue(data.dailyCvLimit, "dailyCvLimit", ctx);
    }
    if (!data.dailyApplicationUnlimited) {
      validateLimitValue(data.dailyApplicationLimit, "dailyApplicationLimit", ctx);
    }
  });

type PlanLimitsFormValues = z.infer<typeof planLimitsSchema>;

type Message = {
  text: string;
  type: "success" | "error";
};

interface PlanLimitsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
}

export function PlanLimitsSheet({ open, onOpenChange, plan }: PlanLimitsSheetProps) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<Message | null>(null);
  const [wasOpen, setWasOpen] = useState(open);

  // Limpa o feedback de sucesso/erro sempre que o sheet abre ou fecha
  // (padrão "adjusting state when props change" — sem efeito cascata).
  if (open !== wasOpen) {
    setWasOpen(open);
    setMessage(null);
  }

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<PlanLimitsFormValues>({
    resolver: zodResolver(planLimitsSchema),
    defaultValues: {
      dailyCvUnlimited: false,
      dailyCvLimit: "",
      dailyApplicationUnlimited: false,
      dailyApplicationLimit: "",
    },
    mode: "all",
  });

  const dailyCvUnlimited = useWatch({ control, name: "dailyCvUnlimited" });
  const dailyApplicationUnlimited = useWatch({
    control,
    name: "dailyApplicationUnlimited",
  });

  useEffect(() => {
    if (open && plan) {
      reset({
        dailyCvUnlimited: plan.dailyCvLimit === null,
        dailyCvLimit: plan.dailyCvLimit === null ? "" : String(plan.dailyCvLimit),
        dailyApplicationUnlimited: plan.dailyApplicationLimit === null,
        dailyApplicationLimit:
          plan.dailyApplicationLimit === null
            ? ""
            : String(plan.dailyApplicationLimit),
      });
    }
  }, [open, plan, reset]);

  const saveLimitsMutation = useMutation({
    mutationFn: (data: PlanLimitsFormValues) => {
      if (!plan) {
        return Promise.reject(new Error("Plano não selecionado."));
      }
      return updatePlanLimits(plan.id, {
        dailyCvLimit: data.dailyCvUnlimited ? null : Number(data.dailyCvLimit.trim()),
        dailyApplicationLimit: data.dailyApplicationUnlimited
          ? null
          : Number(data.dailyApplicationLimit.trim()),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      setMessage({
        text: "Limites do plano atualizados com sucesso!",
        type: "success",
      });
    },
    onError: (error: Error) => {
      console.error("Error on saveLimitsMutation", error);
      setMessage({
        text: error.message || "Não foi possível atualizar os limites do plano.",
        type: "error",
      });
    },
  });

  const onSubmit = (data: PlanLimitsFormValues) => {
    saveLimitsMutation.mutate(data);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 gap-0">
        <SheetHeader>
          <SheetTitle>
            {plan ? `Limites — ${plan.name}` : "Limites do plano"}
          </SheetTitle>
          <SheetDescription>
            {plan ? `${formatPrice(plan.price)}/mês · ` : ""}
            Configure quantos currículos e candidaturas por dia este plano permite.
          </SheetDescription>
        </SheetHeader>

        {message && (
          <div
            className={`mx-4 mb-2 flex items-center gap-3 p-4 rounded-md border ${
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

        <form
          id="plan-limits-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4 pt-2 pb-4 flex-1 overflow-y-auto"
        >
          <div className="rounded-md border border-trampo-border bg-white p-4 space-y-4">
            <Controller
              name="dailyCvLimit"
              control={control}
              render={({ field: controllerField, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="daily-cv-limit">Currículos por dia</FieldLabel>
                    <Input
                      {...controllerField}
                      id="daily-cv-limit"
                      type="number"
                      min={0}
                      step={1}
                      inputMode="numeric"
                      disabled={dailyCvUnlimited}
                      aria-invalid={fieldState.invalid}
                      placeholder={dailyCvUnlimited ? "Ilimitado" : 'Ex: "5"'}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="dailyCvUnlimited"
              control={control}
              render={({ field: controllerField }) => (
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="daily-cv-unlimited">Ilimitado</FieldLabel>
                    <FieldDescription>
                      Permite gerar currículos sem limite diário.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="daily-cv-unlimited"
                    checked={controllerField.value}
                    onCheckedChange={controllerField.onChange}
                  />
                </Field>
              )}
            />
          </div>

          <div className="rounded-md border border-trampo-border bg-white p-4 space-y-4">
            <Controller
              name="dailyApplicationLimit"
              control={control}
              render={({ field: controllerField, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="daily-application-limit">
                      Candidaturas por dia
                    </FieldLabel>
                    <Input
                      {...controllerField}
                      id="daily-application-limit"
                      type="number"
                      min={0}
                      step={1}
                      inputMode="numeric"
                      disabled={dailyApplicationUnlimited}
                      aria-invalid={fieldState.invalid}
                      placeholder={dailyApplicationUnlimited ? "Ilimitado" : 'Ex: "10"'}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="dailyApplicationUnlimited"
              control={control}
              render={({ field: controllerField }) => (
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="daily-application-unlimited">
                      Ilimitado
                    </FieldLabel>
                    <FieldDescription>
                      Permite enviar candidaturas sem limite diário.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="daily-application-unlimited"
                    checked={controllerField.value}
                    onCheckedChange={controllerField.onChange}
                  />
                </Field>
              )}
            />
          </div>
        </form>

        <div className="border-t border-trampo-border p-4 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-md border border-trampo-border text-trampo-muted hover:text-trampo-dark hover:bg-neutral-50 font-bold text-xs h-10 px-4 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="plan-limits-form"
            disabled={saveLimitsMutation.isPending}
            className="flex-1 rounded-md bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs h-10 shadow-md shadow-trampo-primary-500/10 cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            {saveLimitsMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
