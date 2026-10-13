import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-12 font-sans text-trampo-dark antialiased">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl border border-trampo-border bg-trampo-primary-50">
          <FileQuestion className="size-8 text-trampo-primary-500" aria-hidden="true" />
        </div>

        <p className="text-xs font-extrabold uppercase tracking-widest text-trampo-primary-500 mb-3">
          Erro 404
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-trampo-dark mb-3">
          Página não encontrada
        </h1>

        <p className="text-sm font-medium text-trampo-muted leading-relaxed mb-8">
          O endereço que você tentou acessar não existe ou foi movido. Que tal voltar para o
          início?
        </p>

        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-trampo-primary-500 px-8 text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20 transition-all hover:bg-trampo-primary-400 active:scale-[0.98]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
