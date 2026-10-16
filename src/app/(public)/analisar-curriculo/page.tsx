"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CvAnalysisForm } from "@/components/curriculo/analise/cv-analysis-form";
import { CvAnalysisResult } from "@/components/curriculo/analise/cv-analysis-result";
import type { CvAnalysisResult as CvAnalysisResultData } from "@/types/cv-analysis";
import { ArrowRight, Info, LogIn, UserPlus } from "lucide-react";

export default function AnalisarCurriculoPage() {
  const [result, setResult] = useState<CvAnalysisResultData | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Rola até o resultado assim que a análise termina.
  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  return (
    <div className="px-6 pb-24 pt-10 md:pt-16">
      {/* Hero */}
      <section className="relative mx-auto max-w-4xl text-center">
        <div className="absolute top-0 inset-x-0 h-105 bg-[radial-gradient(ellipse_at_top,var(--color-trampo-primary-100),transparent_65%)] opacity-60 pointer-events-none -z-10" />

        <h1 className="mb-4 text-3xl font-extrabold leading-[1.15] tracking-tight text-trampo-dark md:text-5xl">
          Analise seu currículo{" "}
          <span className="bg-linear-to-r from-trampo-primary-600 to-trampo-primary-400 bg-clip-text text-transparent">
            com IA
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-trampo-muted md:text-base">
          Envie seu PDF e receba um <strong className="text-trampo-dark">score de 0 a 100</strong>,
          pontos fortes e melhorias práticas — visualizadas diretamente nas seções do seu currículo.
          Opcionalmente, avalie o fit com uma vaga específica.
        </p>
      </section>

      {/* Formulário */}
      <section className="mx-auto max-w-3xl">

          <CvAnalysisForm variant="public" onAnalyzed={setResult} />

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] font-semibold text-neutral-400">
            <Info className="size-3.5 shrink-0" />
            Limite de 5 análises gratuitas por hora por endereço IP. Seu arquivo não é salvo.
          </p>
      </section>

      {/* Resultado */}
      {result && (
        <div ref={resultRef} className="mx-auto mt-8 max-w-6xl scroll-mt-24">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-extrabold tracking-tight text-trampo-dark md:text-xl">
              Resultado da análise
            </h2>
          </div>

          <CvAnalysisResult result={result} />

          {/* CTA pós-resultado */}
          <div className="mt-8 rounded-lg border border-trampo-border bg-white p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.015)] md:p-8">
            <h3 className="mb-2 text-lg font-extrabold tracking-tight text-trampo-dark md:text-xl">
              Gostou do resultado?
            </h3>
            <p className="mx-auto mb-6 max-w-xl text-xs leading-relaxed text-trampo-muted md:text-sm">
              Crie uma conta grátis para salvar suas análises no histórico, acompanhar a evolução do
              seu currículo e usar a ferramenta sem o limite de 5 análises por hora — em{" "}
              <Link
                href="/analise-curriculo"
                className="font-bold text-trampo-primary-500 underline underline-offset-2"
              >
                Analisar Currículo
              </Link>
              .
            </p>

            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-trampo-primary-500 px-6 text-xs font-bold text-white shadow-md shadow-trampo-primary-500/10 transition-colors hover:bg-trampo-primary-400"
              >
                <UserPlus className="size-4" />
                Criar conta grátis
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-trampo-border bg-white px-6 text-xs font-bold text-trampo-dark transition-colors hover:bg-neutral-50"
              >
                <LogIn className="size-4" />
                Já tenho conta
              </Link>
            </div>

            <p className="mt-4 text-[10px] font-semibold text-neutral-400">
              Com conta, suas análises ficam salvas e você revisa qualquer uma delas depois.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
