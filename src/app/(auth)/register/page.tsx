"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useSession, signIn } from "next-auth/react";
import { register as registerService } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Lock, ArrowRight, Check, Sparkles } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(3, "Informe seu nome completo."),
    email: z.string().email("Informe um e-mail válido."),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirme sua senha."),
    terms: z.boolean().refine((value) => value, {
      message: "Você deve aceitar os termos para continuar.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message === "Network Error") {
    return "Erro de rede. Por favor, tente novamente em instantes.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Não foi possível criar sua conta. Tente novamente.";
}

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (values: RegisterFormData) => {
    setSubmitError(null);

    try {
      await registerService({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

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
            <div className="flex items-center gap-3 mb-8">
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
            <h1 className="text-3xl font-extrabold text-trampo-dark tracking-tight mb-2">Crie sua conta</h1>
            <p className="text-trampo-muted text-sm font-medium">
              Comece sua jornada rumo à carreira dos seus sonhos com automação inteligente.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <Label
                className="block text-xs font-bold uppercase tracking-wider text-trampo-muted ml-1"
                htmlFor="name"
              >
                Nome Completo
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-neutral-400 size-5" />
                </div>
                <Input
                  aria-invalid={Boolean(errors.name)}
                  autoComplete="name"
                  className="pl-10 h-12 rounded-xl border-neutral-200 focus-visible:ring-trampo-primary-500"
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  {...register("name")}
                />
              </div>
              {errors.name ? <p className="text-xs font-medium text-destructive">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label
                className="block text-xs font-bold uppercase tracking-wider text-trampo-muted ml-1"
                htmlFor="email"
              >
                E-mail
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-neutral-400 size-5" />
                </div>
                <Input
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  className="pl-10 h-12 rounded-xl border-neutral-200 focus-visible:ring-trampo-primary-500"
                  id="email"
                  placeholder="nome@exemplo.com"
                  type="email"
                  {...register("email")}
                />
              </div>
              {errors.email ? <p className="text-xs font-medium text-destructive">{errors.email.message}</p> : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  className="block text-xs font-bold uppercase tracking-wider text-trampo-muted ml-1"
                  htmlFor="password"
                >
                  Senha
                </Label>
                <div className="relative group">
                  <PasswordInput
                    aria-invalid={Boolean(errors.password)}
                    autoComplete="new-password"
                    className="h-12 rounded-xl border-neutral-200 focus-visible:ring-trampo-primary-500"
                    id="password"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                </div>
                {errors.password ? (
                  <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  className="block text-xs font-bold uppercase tracking-wider text-trampo-muted ml-1"
                  htmlFor="confirmPassword"
                >
                  Confirmar Senha
                </Label>
                <div className="relative group">
                  <PasswordInput
                    aria-invalid={Boolean(errors.confirmPassword)}
                    autoComplete="new-password"
                    className="h-12 rounded-xl border-neutral-200 focus-visible:ring-trampo-primary-500"
                    id="confirmPassword"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword ? (
                  <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
                ) : null}
              </div>
            </div>

            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <div className="flex items-start gap-3 py-2">
                  <Switch checked={field.value} id="terms" onCheckedChange={field.onChange} />
                  <Label className="text-xs text-trampo-muted leading-relaxed cursor-pointer select-none" htmlFor="terms">
                    Ao criar uma conta, você concorda com nossos{" "}
                    <Link className="text-trampo-primary-500 font-semibold hover:text-trampo-primary-400 transition-colors" href="/">
                      Termos de Serviço
                    </Link>{" "}
                    e{" "}
                    <Link className="text-trampo-primary-500 font-semibold hover:text-trampo-primary-400 transition-colors" href="/">
                      Política de Privacidade
                    </Link>
                    .
                  </Label>
                </div>
              )}
            />
            {errors.terms ? <p className="text-xs font-medium text-destructive">{errors.terms.message}</p> : null}

            {submitError ? <p className="text-sm font-medium text-destructive py-1">{submitError}</p> : null}

            <Button
              className="w-full h-12 py-4 bg-trampo-primary-500 text-white font-bold rounded-full shadow-lg shadow-trampo-primary-500/20 hover:bg-trampo-primary-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              disabled={isLoading || isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Criando conta..." : "Criar Conta"}
              <ArrowRight className="size-5" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-trampo-muted text-sm font-medium">
              Já tem uma conta?
              <Link className="text-trampo-primary-500 font-semibold hover:text-trampo-primary-400 transition-colors ml-1" href="/login">
                Entre
              </Link>
            </p>
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
