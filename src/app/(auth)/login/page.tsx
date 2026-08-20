"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Star, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

type LoginFormData = z.infer<typeof loginSchema>;

function getErrorMessage(error: unknown): string {
  console.log("Error details:", error);
  if (error instanceof Error && error.message === "Network Error") {
    return "Erro de rede. Por favor, tente novamente em instantes.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Não foi possível entrar. Tente novamente.";
}

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [expiredError, setExpiredError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("expired") === "true") {
        setExpiredError("Sua sessão expirou. Por favor, faça login novamente.");
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (values: LoginFormData) => {
    setSubmitError(null);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.replace("/dashboard");
    } catch (error) {
      setSubmitError(getErrorMessage(error));
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
            <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">Bem-vindo de volta</h1>
            <p className="text-trampo-muted text-sm font-medium">
              Gerencie sua carreira com inteligência artificial.
            </p>
          </div>

          {expiredError ? (
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="size-4.5 text-amber-600 shrink-0" />
              <span>{expiredError}</span>
            </div>
          ) : null}

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

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label
                  className="block text-xs font-bold uppercase tracking-wider text-trampo-muted ml-1"
                  htmlFor="password"
                >
                  Senha
                </Label>
                <Link
                  className="text-xs font-semibold text-trampo-primary-500 hover:text-trampo-primary-400 transition-colors"
                  href="/forgot-password"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-5" />
                <PasswordInput
                  aria-invalid={Boolean(errors.password)}
                  autoComplete="current-password"
                  className="pl-10 h-12 rounded-xl border-neutral-200 focus-visible:ring-trampo-primary-500"
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
              </div>
              {errors.password ? (
                <p className="mt-2 text-xs font-medium text-destructive">{errors.password.message}</p>
              ) : null}
            </div>

            {submitError ? (
              <p className="text-sm font-medium text-destructive py-1">{submitError}</p>
            ) : null}

            <div className="pt-2">
              <Button
                className="w-full h-12 bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold rounded-full transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-lg shadow-trampo-primary-500/20 cursor-pointer"
                disabled={isLoading || isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-trampo-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-neutral-400 font-semibold tracking-widest">
                Ou continue com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              className="h-11 gap-3 border border-trampo-border bg-white text-trampo-dark hover:bg-neutral-50 font-semibold rounded-full transition-colors cursor-pointer"
              type="button"
              variant="outline"
            >
              <svg height="15" viewBox="0 0 256 256" width="15" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M255.68 133.5c0-11.36-.92-22.28-2.63-32.82H130v62.15h70.56c-3.05 16.46-12.4 30.42-26.4 39.73v32.96h42.7c25-23.03 39.82-56.96 39.82-102.02z"
                  fill="#4285F4"
                />
                <path
                  d="M130 261.1c35.96 0 66.13-11.92 88.17-32.3l-42.7-32.96c-11.86 7.96-27.06 12.65-45.47 12.65-34.96 0-64.6-23.6-75.2-55.3H11.02v34.8C33.15 233.7 78.6 261.1 130 261.1z"
                  fill="#34A853"
                />
                <path
                  d="M54.8 153.2c-2.7-7.96-4.25-16.44-4.25-25.2s1.55-17.24 4.25-25.2V68H11.02C4 81.7 0 97.4 0 128s4 46.3 11.02 60l43.78-34.8z"
                  fill="#FBBC05"
                />
                <path
                  d="M130 50.8c19.6 0 37.2 6.75 51.05 20l38.3-38.3C196.1 12.2 165.94 0 130 0 78.6 0 33.15 27.4 11.02 68l43.78 34.8c10.6-31.7 40.24-55.3 75.2-55.3z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm">Google</span>
            </Button>

            <Button
              className="h-11 gap-3 border border-trampo-border bg-white text-trampo-dark hover:bg-neutral-50 font-semibold rounded-full transition-colors cursor-pointer"
              type="button"
              variant="outline"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
              </svg>
              <span className="text-sm">LinkedIn</span>
            </Button>
          </div>

          <p className="mt-10 text-center text-sm text-trampo-muted font-medium">
            Não tem uma conta?{" "}
            <Link className="text-trampo-primary-500 font-bold hover:text-trampo-primary-400 transition-colors" href="/register">
              Cadastrar-se
            </Link>
          </p>
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
