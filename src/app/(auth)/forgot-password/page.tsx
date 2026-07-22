"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, Key } from "lucide-react";

import { forgotPassword as forgotPasswordService } from "@/services/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    setSubmitError(null);
    try {
      await forgotPasswordService({ email: values.email });
      setIsSubmitted(true);
    } catch (error: any) {
      setSubmitError(error.message || "Não foi possível enviar o e-mail de recuperação. Tente novamente.");
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
            
            {!isSubmitted ? (
              <>
                <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">Recuperar senha</h1>
                <p className="text-trampo-muted text-sm font-medium">
                  Insira seu e-mail para receber um link de redefinição de senha.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">Verifique seu e-mail</h1>
                <p className="text-trampo-muted text-sm font-medium">
                  Enviamos as instruções de recuperação para o e-mail informado.
                </p>
              </>
            )}
          </div>

          {!isSubmitted ? (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <Label
                  className="block text-xs font-bold uppercase tracking-wider text-trampo-muted mb-2 ml-1"
                  htmlFor="email"
                >
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-5" />
                  <Input
                    aria-invalid={Boolean(errors.email)}
                    autoComplete="email"
                    className="pl-10 h-12 rounded-xl border-neutral-200 focus-visible:ring-trampo-primary-500"
                    id="email"
                    placeholder="nome@empresa.com"
                    type="email"
                    {...register("email")}
                  />
                </div>
                {errors.email ? (
                  <p className="mt-2 text-xs font-medium text-destructive">{errors.email.message}</p>
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
                  {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-neutral-50 border border-trampo-border p-5 rounded-xl mb-6">
              <p className="text-sm text-trampo-muted leading-relaxed">
                Se este e-mail estiver associado a uma conta ativa, você receberá uma mensagem em instantes com as instruções para redefinir sua senha.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              className="inline-flex items-center gap-2 text-trampo-primary-500 font-semibold hover:text-trampo-primary-400 transition-colors text-sm"
              href="/login"
            >
              <ArrowLeft className="size-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      }
      banner={
        <div className="w-full flex flex-col gap-6">
          {/* Security Mockup Card */}
          <div className="w-full bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-[0_30px_70px_-15px_rgba(46,175,146,0.12)]">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-trampo-primary-100 flex items-center justify-center text-trampo-primary-600">
                <ShieldCheck className="size-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-trampo-dark text-sm">Acesso Seguro</h3>
                <p className="text-[10px] text-trampo-muted font-medium">Proteção e Criptografia</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-[#F2FCFA] rounded-xl border border-trampo-primary-100">
                <Key className="text-trampo-primary-600 size-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-trampo-dark mb-0.5">Segurança Avançada</h4>
                  <p className="text-[10px] text-trampo-muted leading-normal">
                    Seus dados estão protegidos por criptografia ponta a ponta e atendem à LGPD.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
