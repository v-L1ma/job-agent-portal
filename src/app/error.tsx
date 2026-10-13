"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-12 font-sans text-trampo-dark antialiased">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
          <AlertTriangle className="size-8 text-red-500" aria-hidden="true" />
        </div>

        <p className="text-xs font-extrabold uppercase tracking-widest text-red-500 mb-3">
          Algo deu errado
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-trampo-dark mb-3">
          Não foi possível carregar esta página
        </h1>

        <p className="text-sm font-medium text-trampo-muted leading-relaxed mb-6">
          Ocorreu um erro inesperado ao renderizar esta rota. Tente novamente — se o problema
          persistir, volte para o início.
        </p>

        {error?.digest ? (
          <p className="mb-6 rounded-xl border border-trampo-border bg-neutral-50 px-3 py-2 font-mono text-[11px] text-trampo-muted">
            {error.digest}
          </p>
        ) : null}

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-trampo-primary-500 px-8 text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20 transition-all hover:bg-trampo-primary-400 active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Tentar novamente
          </button>

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-trampo-border bg-white px-8 text-sm font-bold text-trampo-dark transition-colors hover:bg-neutral-50"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
