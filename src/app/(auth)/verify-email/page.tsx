"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { resendConfirmation, verifyEmail } from "@/services/auth";

const resendEmailSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
});

type ResendEmailFormData = z.infer<typeof resendEmailSchema>;

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message === "Network Error") {
    return "Erro de rede. Por favor, tente novamente em instantes.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const queryEmail = searchParams.get("email");

  const [verifyStatus, setVerifyStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const hasStartedVerification = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResendEmailFormData>({
    resolver: zodResolver(resendEmailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (!token || hasStartedVerification.current) return;
    hasStartedVerification.current = true;

    (async () => {
      try {
        const response = await verifyEmail({ token });
        setSuccessMessage(response.message);
        setVerifyStatus("success");
      } catch (error) {
        setVerifyError(getErrorMessage(error, "Token inválido ou expirado."));
        setVerifyStatus("error");
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token && !queryEmail) {
      router.replace("/login");
    }
  }, [token, queryEmail, router]);

  const onResend = async (email: string) => {
    setResendError(null);
    setSuccessMessage(null);
    setIsResending(true);

    try {
      const response = await resendConfirmation({ email });
      setSuccessMessage(response.message);
    } catch (error) {
      setResendError(getErrorMessage(error, "Não foi possível reenviar o e-mail de confirmação."));
    } finally {
      setIsResending(false);
    }
  };

  const onSubmitResend = async (values: ResendEmailFormData) => {
    await onResend(values.email);
  };

  const banner = (
    <div className="w-full h-full">
      <div className="w-full h-full bg-[url('/assets/login-banner.png')] bg-cover bg-center bg-no-repeat"></div>
    </div>
  );

  const logo = (
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
  );

  const resendForm = (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmitResend)} noValidate>
      <div>
        <Label
          className="block text-xs font-bold uppercase tracking-wider text-trampo-muted mb-2 ml-1"
          htmlFor="resend-email"
        >
          E-mail
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-5" />
          <Input
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className="pl-10 h-12 rounded-xl border-neutral-200 focus-visible:ring-trampo-primary-500"
            id="resend-email"
            placeholder="nome@empresa.com"
            type="email"
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p className="mt-2 text-xs font-medium text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="pt-2">
        <Button
          className="w-full h-12 bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold rounded-full transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-lg shadow-trampo-primary-500/20 cursor-pointer"
          disabled={!isValid || isSubmitting || isResending}
          type="submit"
        >
          {isSubmitting || isResending ? "Reenviando..." : "Reenviar e-mail de confirmação"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );

  // Sem token nem e-mail: redireciona para o login
  if (!token && !queryEmail) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-trampo-primary-500 border-t-transparent" />
      </div>
    );
  }

  // Clique no link do e-mail: verifica o token
  if (token) {
    return (
      <AuthLayout
        form={
          <div className="w-full max-w-md">
            <div className="mb-8">
              {logo}
              {verifyStatus === "verifying" ? (
                <>
                  <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">
                    Verificando seu e-mail
                  </h1>
                  <p className="text-trampo-muted text-sm font-medium">
                    Aguarde um instante enquanto confirmamos sua conta...
                  </p>
                </>
              ) : verifyStatus === "success" ? (
                <>
                  <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">
                    E-mail confirmado
                  </h1>
                  <p className="text-trampo-muted text-sm font-medium">{successMessage}</p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">
                    Não foi possível confirmar
                  </h1>
                  <p className="text-trampo-muted text-sm font-medium">{verifyError}</p>
                </>
              )}
            </div>

            {verifyStatus === "verifying" ? (
              <div className="flex items-center gap-3 bg-neutral-50 border border-trampo-border p-5 rounded-xl mb-6">
                <Loader2 className="size-5 text-trampo-primary-500 animate-spin shrink-0" />
                <p className="text-sm text-trampo-muted leading-relaxed">
                  Estamos processando seu link de ativação. Isso pode levar alguns segundos.
                </p>
              </div>
            ) : null}

            {verifyStatus === "success" ? (
              <div className="bg-neutral-50 border border-trampo-border p-5 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-trampo-primary-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-trampo-muted leading-relaxed">
                    Sua conta já está ativa. Faça login para começar a usar o Trampo.
                  </p>
                </div>
              </div>
            ) : null}

            {verifyStatus === "error" ? (
              <div className="space-y-6">
                <div className="bg-neutral-50 border border-trampo-border p-5 rounded-xl">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="size-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-trampo-muted leading-relaxed">
                      O link de ativação pode ter expirado ou já ter sido utilizado. Informe seu
                      e-mail abaixo para receber um novo link.
                    </p>
                  </div>
                </div>

                {successMessage ? (
                  <div className="bg-neutral-50 border border-trampo-border p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="size-5 text-trampo-primary-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-trampo-muted leading-relaxed">{successMessage}</p>
                    </div>
                  </div>
                ) : null}

                {resendError ? (
                  <p className="text-sm font-medium text-destructive py-1">{resendError}</p>
                ) : null}

                {resendForm}

                <div className="pt-2">
                  <Button
                    className="w-full h-12 border border-trampo-border bg-white text-trampo-dark hover:bg-neutral-50 font-bold rounded-full transition-colors flex justify-center items-center gap-2 cursor-pointer"
                    type="button"
                    variant="outline"
                    onClick={() => router.replace("/login")}
                  >
                    Ir para o login
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            ) : null}

            {verifyStatus === "success" ? (
              <div className="pt-2">
                <Button
                  className="w-full h-12 bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold rounded-full transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-lg shadow-trampo-primary-500/20 cursor-pointer"
                  onClick={() => router.replace("/login")}
                  type="button"
                >
                  Ir para o login
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            ) : null}

            {verifyStatus === "verifying" ? (
              <div className="mt-8 text-center">
                <Link
                  className="inline-flex items-center gap-2 text-trampo-primary-500 font-semibold hover:text-trampo-primary-400 transition-colors text-sm"
                  href="/login"
                >
                  <ArrowLeft className="size-4" />
                  Ir para o login
                </Link>
              </div>
            ) : null}
          </div>
        }
        banner={banner}
      />
    );
  }

  // Pós-cadastro: sem token, apenas informa que o e-mail precisa ser confirmado
  return (
    <AuthLayout
      form={
        <div className="w-full max-w-md">
          <div className="mb-8">
            {logo}
            <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">
              Verifique seu e-mail
            </h1>
            <p className="text-trampo-muted text-sm font-medium">
              Enviamos um link de ativação para{" "}
              <span className="font-semibold text-trampo-dark">{queryEmail}</span>. Clique no link
              para ativar sua conta.
            </p>
          </div>

          <div className="bg-neutral-50 border border-trampo-border p-5 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <Mail className="size-5 text-trampo-primary-500 shrink-0 mt-0.5" />
              <p className="text-sm text-trampo-muted leading-relaxed">
                Não encontrou o e-mail? Confira sua caixa de spam ou lixo eletrônico. Você também
                pode reenviar o link de ativação abaixo.
              </p>
            </div>
          </div>

          {successMessage ? (
            <div className="bg-neutral-50 border border-trampo-border p-5 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-trampo-primary-500 shrink-0 mt-0.5" />
                <p className="text-sm text-trampo-muted leading-relaxed">{successMessage}</p>
              </div>
            </div>
          ) : null}

          {resendError ? (
            <p className="text-sm font-medium text-destructive py-1">{resendError}</p>
          ) : null}

          <div className="space-y-4">
            <Button
              className="w-full h-12 bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold rounded-full transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-lg shadow-trampo-primary-500/20 cursor-pointer"
              disabled={isResending}
              type="button"
              onClick={() => {
                if (queryEmail) void onResend(queryEmail);
              }}
            >
              {isResending ? "Reenviando..." : "Reenviar e-mail"}
              <ArrowRight className="size-4" />
            </Button>

            <Button
              className="w-full h-12 border border-trampo-border bg-white text-trampo-dark hover:bg-neutral-50 font-bold rounded-full transition-colors flex justify-center items-center gap-2 cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => router.replace("/login")}
            >
              Ir para o login
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      }
      banner={banner}
    />
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-white">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-trampo-primary-500 border-t-transparent" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
