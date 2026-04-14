"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const registerSchema = z
  .object({
    name: z.string().min(3, "Informe seu nome completo."),
    email: z.string().email("Informe um e-mail valido."),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirme sua senha."),
    terms: z.boolean().refine((value) => value, {
      message: "Voce deve aceitar os termos para continuar.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas nao coincidem.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message == "Network Error") {
    return "Erro de rede. Por favor, tente novamente em instantes.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Nao foi possivel criar sua conta. Tente novamente.";
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
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
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      router.replace("/dashboard");
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      form={
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(71,79,230,0.4)]">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">AutoApply</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Crie sua conta</h1>
            <p className="text-on-surface-variant text-sm">
              Comece sua jornada rumo a carreira dos seus sonhos com automacao inteligente.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <Label
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1"
                htmlFor="name"
              >
                Nome Completo
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg group-focus-within:text-primary transition-colors">
                    person
                  </span>
                </div>
                <Input
                  aria-invalid={Boolean(errors.name)}
                  autoComplete="name"
                  className="block w-full h-12 pl-10 pr-4 py-3 bg-surface-container-lowest border-none ring-1 ring-outline-variant focus-visible:ring-2 focus-visible:ring-primary rounded-xl text-on-surface placeholder:text-outline transition-all"
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  {...register("name")}
                />
              </div>
              {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1"
                htmlFor="email"
              >
                E-mail
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                </div>
                <Input
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  className="block w-full h-12 pl-10 pr-4 py-3 bg-surface-container-lowest border-none ring-1 ring-outline-variant focus-visible:ring-2 focus-visible:ring-primary rounded-xl text-on-surface placeholder:text-outline transition-all"
                  id="email"
                  placeholder="nome@exemplo.com"
                  type="email"
                  {...register("email")}
                />
              </div>
              {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1"
                  htmlFor="password"
                >
                  Senha
                </Label>
                <div className="relative group">
                  
                  <PasswordInput
                    aria-invalid={Boolean(errors.password)}
                    autoComplete="new-password"
                    className="block w-full h-12 pl-10 pr-10 py-3 bg-surface-container-lowest border-none ring-1 ring-outline-variant focus-visible:ring-2 focus-visible:ring-primary rounded-xl text-on-surface placeholder:text-outline transition-all"
                    id="password"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                </div>
                {errors.password ? (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1"
                  htmlFor="confirmPassword"
                >
                  Confirmar Senha
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-lg group-focus-within:text-primary transition-colors">
                      enhanced_encryption
                    </span>
                  </div>
                  <PasswordInput
                    aria-invalid={Boolean(errors.confirmPassword)}
                    autoComplete="new-password"
                    className="block w-full h-12 pl-10 pr-10 py-3 bg-surface-container-lowest border-none ring-1 ring-outline-variant focus-visible:ring-2 focus-visible:ring-primary rounded-xl text-on-surface placeholder:text-outline transition-all"
                    id="confirmPassword"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword ? (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                ) : null}
              </div>
            </div>

            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <div className="flex items-center gap-3 py-2">
                  <Switch checked={field.value} id="terms" onCheckedChange={field.onChange} />
                  <Label className="text-xs text-on-surface-variant leading-relaxed cursor-pointer" htmlFor="terms">
                    Ao criar uma conta, voce concorda com nossos{" "}
                    <Link className="text-primary hover:underline" href="/">
                      Termos de Servico
                    </Link>{" "}
                    e{" "}
                    <Link className="text-primary hover:underline" href="/">
                      Politica de Privacidade
                    </Link>
                    .
                  </Label>
                </div>
              )}
            />
            {errors.terms ? <p className="text-xs text-destructive">{errors.terms.message}</p> : null}

            {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

            <Button
              className="w-full h-12 py-4 bg-primary text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(71,79,230,0.3)] hover:shadow-[0_4px_25px_rgba(71,79,230,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              disabled={isLoading || isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Criando conta..." : "Criar Conta"}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-on-surface-variant text-sm">
              Ja tem uma conta?
              <Link className="text-primary font-semibold hover:underline ml-1" href="/auth/login">
                Entre
              </Link>
            </p>
          </div>
        </div>
      }
      banner={
        <>
          
        </>
      }
    />
  );
}
