"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmationPhase = "confirming" | "success" | "processing";

function ConfirmationFallback() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-trampo-border bg-white p-12 text-center">
        <Loader2 className="size-6 animate-spin text-trampo-primary-500" />
        <p className="text-xs font-semibold text-trampo-muted">
          Confirmando pagamento...
        </p>
      </div>
    </div>
  );
}

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const sessionId = searchParams.get("session_id");
  const [phase, setPhase] = useState<ConfirmationPhase>("confirming");

  useEffect(() => {
    let cancelled = false;

    async function confirmPayment() {
      if (!sessionId) {
        if (!cancelled) setPhase("processing");
        return;
      }

      try {
        await queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
        await queryClient.invalidateQueries({ queryKey: ["public-plans"] });
        await queryClient.invalidateQueries({ queryKey: ["landing-plans"] });

        // Breve espera para evitar flash entre estados.
        await new Promise((resolve) => setTimeout(resolve, 700));

        if (!cancelled) setPhase("success");
      } catch (error) {
        console.error("Error confirming payment:", error);
        if (!cancelled) setPhase("processing");
      }
    }

    confirmPayment();

    return () => {
      cancelled = true;
    };
  }, [queryClient, sessionId]);

  if (phase === "confirming") {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-trampo-border bg-white p-12 text-center">
          <Loader2 className="size-6 animate-spin text-trampo-primary-500" />
          <p className="text-xs font-semibold text-trampo-muted">
            Confirmando pagamento...
          </p>
        </div>
      </div>
    );
  }

  if (phase === "processing") {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-trampo-border bg-white p-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-amber-50">
            <Clock className="size-7 text-amber-600" />
          </span>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight text-trampo-dark">
              Pagamento em processamento
            </h1>
            <p className="text-xs font-semibold text-trampo-muted">
              A confirmação pode levar alguns minutos. Assim que o pagamento for
              aprovado, seu plano aparece atualizado no seu perfil.
            </p>
          </div>
          <Button
            type="button"
            className="rounded-full bg-trampo-primary-500 px-6 text-sm font-bold text-white hover:bg-trampo-primary-600"
            onClick={() => router.push("/perfil")}
          >
            Ver meu plano
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-trampo-border bg-white p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#F2FCFA]">
          <CheckCircle2 className="size-7 text-trampo-primary-600" />
        </span>
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-trampo-dark">
            Pagamento confirmado!
          </h1>
          <p className="text-xs font-semibold text-trampo-muted">
            Sua assinatura está ativa. Boa sorte na busca por novas vagas!
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            className="rounded-full bg-trampo-primary-500 px-6 text-sm font-bold text-white hover:bg-trampo-primary-600"
            onClick={() => router.push("/vagas")}
          >
            Ir para as vagas
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full px-6 text-sm font-bold"
            onClick={() => router.push("/perfil")}
          >
            Ver meu plano
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<ConfirmationFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
