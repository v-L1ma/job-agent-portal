"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-trampo-border bg-white p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-red-50">
          <XCircle className="size-7 text-red-500" />
        </span>
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-trampo-dark">
            Pagamento cancelado
          </h1>
          <p className="text-xs font-semibold text-trampo-muted">
            Nada foi cobrado. Você pode retomar a assinatura quando quiser.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            className="rounded-full bg-trampo-primary-500 px-6 text-sm font-bold text-white hover:bg-trampo-primary-600"
            onClick={() => router.push("/perfil")}
          >
            Voltar aos planos
          </Button>
          <Link
            href="/#precos"
            className="inline-flex h-8 items-center justify-center rounded-full border border-trampo-border bg-background px-6 text-sm font-bold transition-colors hover:bg-muted"
          >
            Ver planos
          </Link>
        </div>
      </div>
    </div>
  );
}
