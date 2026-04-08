"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { forgotPassword } from "@/lib/api";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível enviar a recuperação de senha.";
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Informe o e-mail para recuperar a senha.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await forgotPassword({ email });
      setMessage(response);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.18),transparent_35%)]" />
      <Card className="w-full max-w-md relative border border-slate-700/70 bg-slate-900/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-3">
          <div className="inline-flex items-center gap-2 text-primary">
            <Zap className="w-4 h-4" />
            <span className="text-xs uppercase tracking-[0.16em]">Job Agent Portal</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-100">Esqueci minha senha</CardTitle>
          <p className="text-sm text-slate-400">
            Informe seu e-mail e enviaremos as instruções de recuperação, se a conta existir.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
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

            {error && (
              <p className="text-xs rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-red-300">
                {error}
              </p>
            )}

            {message && (
              <p className="text-xs rounded-md bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-emerald-300">
                {message}
              </p>
            )}

            <Button type="submit" className="w-full h-11 font-semibold" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar recuperação"}
            </Button>

            <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
              <Link href="/auth/login" className="hover:text-primary transition-colors">
                Voltar para login
              </Link>
              <span>•</span>
              <Link href="/auth/register" className="hover:text-primary transition-colors">
                Criar conta
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
