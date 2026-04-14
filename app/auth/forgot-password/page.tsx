"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/auth-layout";
import { forgotPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message == "Network Error") {
    return "Erro de rede. Por favor, tente novamente em instantes.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Nao foi possivel enviar o link de recuperação. Tente novamente.";
}

export default function ForgotPasswordPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      await forgotPassword({ email: values.email });
      setSuccessMessage("Se o e-mail existir, voce recebera as instrucoes em instantes.");
      reset();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      form={
        <div className="w-full max-w-md">
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-primary flex items-center gap-2">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              AutoApply
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-3">Recuperar Senha</h1>
          <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
            Insira seu e-mail para receber as instrucoes de recuperacao e retomar o controle do seu dashboard de aplicacoes.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Label
                className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2"
                htmlFor="email"
              >
                Endereco de E-mail
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors text-xl">
                    mail
                  </span>
                </div>
                <Input
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  className="w-full h-12 bg-surface-container-lowest text-on-surface border-none rounded-lg py-4 pl-12 pr-4 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all placeholder:text-slate-600"
                  id="email"
                  placeholder="nome@empresa.com"
                  type="email"
                  {...register("email")}
                />
              </div>
              {errors.email ? <p className="mt-2 text-xs text-destructive">{errors.email.message}</p> : null}
            </div>

            {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
            {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}

            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-on-primary font-semibold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
              disabled={isSubmitting}
              type="submit"
            >
              <span>{isSubmitting ? "Enviando..." : "Enviar Link"}</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </Button>
          </form>

          <div className="mt-8 flex justify-center">
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors group"
              href="/auth/login"
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                chevron_left
              </span>
              Voltar para o Login
            </Link>
          </div>
        </div>
      }
      banner={
        <>
          <div className="absolute inset-0 z-0">
            <img
              alt="Cybersecurity infrastructure visualization"
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105"
              data-alt="abstract professional digital security grid with deep indigo light beams and futuristic server room aesthetics in dark environment"
              src="/stitch/img-8.jpg"
            />
            <div className="absolute inset-0 bg-linear-to-tr from-background via-transparent to-primary/10"></div>
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background"></div>
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end p-16 xl:p-24">
            <div className="max-w-xl backdrop-blur-md bg-surface-container/30 p-8 rounded-xl border border-outline-variant">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-6">
                <span
                  className="material-symbols-outlined text-primary text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Enterprise Security
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Sua seguranca e nossa prioridade absoluta.
              </h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                Utilizamos criptografia de ponta a ponta e protocolos de autenticacao avancados para garantir que sua jornada no AutoApply seja protegida em cada etapa.
              </p>
              <div className="mt-8 flex gap-4">
                <div className="h-1 w-12 bg-primary rounded-full"></div>
                <div className="h-1 w-4 bg-outline-variant rounded-full"></div>
                <div className="h-1 w-4 bg-outline-variant rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="absolute top-24 right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-48 left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>
        </>
      }
    />
  );
}
