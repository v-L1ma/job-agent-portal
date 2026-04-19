"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

type LoginFormData = z.infer<typeof loginSchema>;

function getErrorMessage(error: unknown): string {
    console.log("Error details:", error);
  if (error instanceof Error && error.message == "Network Error") {
    return "Erro de rede. Por favor, tente novamente em instantes.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Nao foi possivel entrar. Tente novamente.";
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (values: LoginFormData) => {
    setSubmitError(null);

    try {
      await login(values.email, values.password);
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
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">BuscaVagas</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface mb-2">Bem-vindo de volta</h1>
            <p className="text-on-surface-variant text-sm">
              Gerencie sua carreira com inteligencia artificial.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Label
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2"
                htmlFor="email"
              >
                E-mail
              </Label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  mail
                </span>
                <Input
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  className="w-full h-12 bg-surface-container-lowest border-none ring-1 ring-outline-variant focus-visible:ring-2 focus-visible:ring-primary text-on-surface rounded-lg py-3 pl-10 pr-4 transition-all outline-none text-sm"
                  id="email"
                  placeholder="nome@empresa.com"
                  type="email"
                  {...register("email")}
                />
              </div>
              {errors.email ? (
                <p className="mt-2 text-xs text-destructive">{errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label
                  className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                  htmlFor="password"
                >
                  Senha
                </Label>
                <Link
                  className="text-xs font-semibold text-primary hover:underline transition-all dark:text-white"
                  href="/auth/forgot-password"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  lock
                </span>
                <PasswordInput
                  aria-invalid={Boolean(errors.password)}
                  autoComplete="current-password"
                  className="w-full h-12 bg-surface-container-lowest border-none ring-1 ring-outline-variant focus-visible:ring-2 focus-visible:ring-primary text-on-surface rounded-lg py-3 pl-10 pr-10 transition-all outline-none text-sm"
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
              </div>
              {errors.password ? (
                <p className="mt-2 text-xs text-destructive">{errors.password.message}</p>
              ) : null}
            </div>

            {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

            <div className="pt-2">
              <Button
                className="w-full h-12 bg-primary hover:bg-opacity-90 text-white font-bold rounded-lg transition-transform active:scale-95 flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
                disabled={isLoading || isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-4 text-on-surface-variant font-medium tracking-widest">
                Ou continue com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button className="h-11 gap-3 border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold rounded-lg transition-colors" type="button" variant="outline">
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

            <Button className="h-11 gap-3 border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold rounded-lg transition-colors" type="button" variant="outline">
              <svg className="w-15 h-15 fill-blue-500" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
              </svg>
              <span className="text-sm">LinkedIn</span>
            </Button>
          </div>

          <p className="mt-10 text-center text-sm text-on-surface-variant">
            Nao tem uma conta?{" "}
            <Link className="text-primary font-bold hover:underline dark:text-white" href="/auth/register">
                Cadastrar-se
            </Link>
          </p>
        </div>
      }
      banner={
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            data-alt="Cinematic digital landscape with blue glowing network lines and data points representing global connectivity and artificial intelligence technology"
            style={{ backgroundImage: "url('/stitch/img-2.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent"></div>
          {/* <div className="absolute bottom-12 left-12 right-12 glass-panel p-8 rounded-xl border border-outline-variant shadow-2xl">
            <div className="flex gap-1 mb-4">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
            <blockquote className="text-xl font-medium text-white mb-6 leading-relaxed italic">
              &quot;O BuscaVagas transformou minha busca por emprego. As recomendacoes baseadas em dados sao precisas e me economizam horas todos os dias.&quot;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                <img
                  alt="User profile"
                  className="w-full h-full object-cover"
                  data-alt="Portrait of a confident professional woman smiling in a modern office setting with natural lighting"
                  src="/stitch/img-3.jpg"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Mariana Costa</p>
                <p className="text-xs text-on-surface-variant font-medium">Product Manager na TechFlow</p>
              </div>
            </div>
          </div> */}
          {/* <div className="absolute top-12 right-12 glass-panel p-4 rounded-lg border border-outline-variant animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-container rounded">
                <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Sucesso de Candidaturas
                </p>
                <p className="text-lg font-bold text-white">+84%</p>
              </div>
            </div>
          </div> */}
        </>
      }
    />
  );
}
