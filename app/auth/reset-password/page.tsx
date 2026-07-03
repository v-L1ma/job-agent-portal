"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/auth-layout";
import { resetPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Sparkles, Lock, ArrowRight, ChevronLeft, ShieldCheck } from "lucide-react";
import Image from "next/image";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirme sua senha."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message == "Network Error") {
    return "Erro de rede. Por favor, tente novamente em instantes.";
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Não foi possível redefinir sua senha. Tente novamente.";
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!token) {
      setSubmitError("Token de recuperação inválido ou ausente.");
      return;
    }

    setSubmitError(null);
    setSuccessMessage(null);

    try {
      await resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      setSuccessMessage("Senha redefinida com sucesso! Redirecionando para o login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  if (!token) {
    return (
      <AuthLayout
        form={
          <div className="w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-on-surface mb-3">Link inválido</h1>
              <p className="text-on-surface-variant text-sm mb-8">
                O link de redefinição de senha é inválido ou expirou. Solicite um novo.
              </p>
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                href="/auth/forgot-password"
              >
                Solicitar nova redefinição
              </Link>
            </div>
          </div>
        }
        banner={null}
      />
    );
  }

  return (
    <AuthLayout
      form={
        <div className="w-full max-w-md">
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-primary flex items-center gap-2">
              <Sparkles className="size-8 fill-current" />
              BuscaVagas
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-3">Redefinir Senha</h1>
          <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
            Escolha uma nova senha para sua conta.
          </p>

          {successMessage ? (
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">{successMessage}</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <Label
                  className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2"
                  htmlFor="newPassword"
                >
                  Nova Senha
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline size-5" />
                  <PasswordInput
                    aria-invalid={Boolean(errors.newPassword)}
                    autoComplete="new-password"
                    className="w-full h-12 bg-surface-container-lowest text-on-surface border-none rounded-lg py-4 pl-10 pr-10 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
                    id="newPassword"
                    placeholder="••••••••"
                    {...register("newPassword")}
                  />
                </div>
                {errors.newPassword ? (
                  <p className="mt-2 text-xs text-destructive">{errors.newPassword.message}</p>
                ) : null}
              </div>

              <div>
                <Label
                  className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirmar Senha
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline size-5" />
                  <PasswordInput
                    aria-invalid={Boolean(errors.confirmPassword)}
                    autoComplete="new-password"
                    className="w-full h-12 bg-surface-container-lowest text-on-surface border-none rounded-lg py-4 pl-10 pr-10 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
                    id="confirmPassword"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword ? (
                  <p className="mt-2 text-xs text-destructive">{errors.confirmPassword.message}</p>
                ) : null}
              </div>

              {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

              <Button
                className="w-full h-12 bg-primary hover:bg-primary/90 text-on-primary font-semibold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                disabled={isSubmitting}
                type="submit"
              >
                <span>{isSubmitting ? "Redefinindo..." : "Redefinir Senha"}</span>
                <ArrowRight className="size-5" />
              </Button>
            </form>
          )}

          <div className="mt-8 flex justify-center">
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors group"
              href="/auth/login"
            >
              <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              Voltar para o Login
            </Link>
          </div>
        </div>
      }
      banner={
        <div className="absolute inset-0 z-0">
          <Image
            alt="Cybersecurity infrastructure visualization"
            className="object-cover opacity-40 mix-blend-luminosity scale-105"
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            src="/assets/img-4.webp"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-background via-transparent to-primary/10"></div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background"></div>
        </div>
      }
    />
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <p className="text-sm text-slate-500">Carregando...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
