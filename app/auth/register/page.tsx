"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível criar a conta.";
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Informe seu nome para criar a conta.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Preencha e-mail e senha.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      setSubmitting(true);
      await register({ name, email, password });
      router.replace("/dashboard");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400 font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.18),transparent_35%)]" />
      <Card className="w-full max-w-md relative border border-slate-700/70 bg-slate-900/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-3">
          <div className="inline-flex items-center gap-2 text-primary">
            <Zap className="w-4 h-4" />
            <span className="text-xs uppercase tracking-[0.16em]">Job Agent Portal</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-100">Criar sua conta</CardTitle>
          <p className="text-sm text-slate-400">
            Cadastre-se e conecte seu perfil para começar as candidaturas inteligentes.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                disabled={submitting}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                disabled={submitting}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                disabled={submitting}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="********"
                disabled={submitting}
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-xs rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-11 font-semibold" disabled={submitting}>
              {submitting ? "Processando..." : "Criar conta"}
            </Button>

            <Link
              href="/auth/login"
              className="block w-full text-center text-sm text-slate-300 hover:text-primary transition-colors"
            >
              Já possui conta? Entrar
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
