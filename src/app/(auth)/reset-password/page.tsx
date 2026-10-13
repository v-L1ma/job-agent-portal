"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { resetPassword } from "@/services/auth";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "A senha precisa ter pelo menos 6 caracteres.")
      .max(50, "A senha pode ter no máximo 50 caracteres."),
    confirmPassword: z
      .string()
      .min(6, "A senha precisa ter pelo menos 6 caracteres.")
      .max(50, "A senha pode ter no máximo 50 caracteres."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isSubmitted) return;
    const timeout = window.setTimeout(() => {
      router.replace("/login");
    }, 4000);
    return () => window.clearTimeout(timeout);
  }, [isSubmitted, router]);

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!token) return;
    setSubmitError(null);
    try {
      await resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        (error instanceof Error && error.message) ||
          "Não foi possível redefinir a senha. Tente novamente."
      );
    }
  };

  return (
    <AuthLayout
      form={
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-8">
              <Link href="/">
                <Image
                  src="/assets/logo-dark.png"
                  alt="Trampo Logo"
                  width={110}
                  height={32}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {!token ? (
              <>
                <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">
                  Link inválido
                </h1>
                <p className="text-trampo-muted text-sm font-medium">
                  O link de redefinição de senha está incompleto ou expirou. Solicite um novo
                  para continuar.
                </p>
              </>
            ) : !isSubmitted ? (
              <>
                <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">
                  Criar nova senha
                </h1>
                <p className="text-trampo-muted text-sm font-medium">
                  Defina uma nova senha para a sua conta.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">
                  Senha redefinida
                </h1>
                <p className="text-trampo-muted text-sm font-medium">
                  Sua senha foi alterada com sucesso. Você já pode entrar com a nova senha.
                </p>
              </>
            )}
          </div>

          {!token ? (
            <div className="bg-neutral-50 border border-trampo-border p-5 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <ShieldAlert className="size-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-trampo-muted leading-relaxed">
                  Este link não é válido. Verifique o e-mail de recuperação e tente novamente.
                </p>
              </div>
            </div>
          ) : !isSubmitted ? (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <Label
                  className="block text-xs font-bold uppercase tracking-wider text-trampo-muted mb-2 ml-1"
                  htmlFor="newPassword"
                >
                  Nova senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-5" />
                  <PasswordInput
                    aria-invalid={Boolean(errors.newPassword)}
                    autoComplete="new-password"
                    className="pl-10 h-12 rounded-xl border-neutral-200 focus-visible:ring-trampo-primary-500"
                    id="newPassword"
                    placeholder="••••••••"
                    {...register("newPassword")}
                  />
                </div>
                {errors.newPassword ? (
                  <p className="mt-2 text-xs font-medium text-destructive">
                    {errors.newPassword.message}
                  </p>
                ) : null}
              </div>

              <div>
                <Label
                  className="block text-xs font-bold uppercase tracking-wider text-trampo-muted mb-2 ml-1"
                  htmlFor="confirmPassword"
                >
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-5" />
                  <PasswordInput
                    aria-invalid={Boolean(errors.confirmPassword)}
                    autoComplete="new-password"
                    className="pl-10 h-12 rounded-xl border-neutral-200 focus-visible:ring-trampo-primary-500"
                    id="confirmPassword"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword ? (
                  <p className="mt-2 text-xs font-medium text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>

              {submitError ? (
                <p className="text-sm font-medium text-destructive py-1">{submitError}</p>
              ) : null}

              <div className="pt-2">
                <Button
                  className="w-full h-12 bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold rounded-full transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-lg shadow-trampo-primary-500/20 cursor-pointer"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Salvando..." : "Redefinir senha"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-neutral-50 border border-trampo-border p-5 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 text-trampo-primary-500 shrink-0 mt-0.5" />
                <p className="text-sm text-trampo-muted leading-relaxed">
                  Tudo certo! Sua senha foi redefinida. Você será redirecionado para o login em
                  alguns segundos.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              className="inline-flex items-center gap-2 text-trampo-primary-500 font-semibold hover:text-trampo-primary-400 transition-colors text-sm"
              href={token && !isSubmitted ? "/forgot-password" : "/login"}
            >
              <ArrowLeft className="size-4" />
              {token && !isSubmitted ? "Voltar para recuperação de senha" : "Ir para o login"}
            </Link>
          </div>
        </div>
      }
      banner={
        <div className="w-full h-full">
          <div className="w-full h-full bg-[url('/assets/login-banner.png')] bg-cover bg-center bg-no-repeat"></div>
        </div>
      }
    />
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-white">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-trampo-primary-500 border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
