"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CheckoutForm,
  CheckoutFormProvider,
  useCheckoutForm,
} from "@stripe/react-stripe-js/checkout";
import type { StripeCheckoutFormConfirmEvent } from "@stripe/stripe-js";
import { ArrowLeft, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stripePromise } from "@/lib/stripe";
import { createCheckoutSession } from "@/services/checkout";

function EmbeddedCheckoutForm() {
  const checkoutState = useCheckoutForm();

  if (checkoutState.type === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <XCircle className="size-8 text-red-500" />
        <p className="text-xs font-bold text-red-600">
          Não foi possível carregar o formulário de pagamento.
        </p>
        <p className="text-xs text-red-500/80">{checkoutState.error.message}</p>
      </div>
    );
  }

  const onConfirm = async (event: StripeCheckoutFormConfirmEvent) => {
    if (checkoutState.type === "success") {
      try {
        await checkoutState.checkout.confirm({ formConfirmEvent: event });
      } catch (error) {
        console.error("Payment confirmation error:", error);
      }
    }
  };

  return <CheckoutForm onConfirm={onConfirm} className="w-full max-w-lg" />;
}

export default function CheckoutPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const planId = params?.id;

  const {
    data: clientSecret,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["checkout-session", planId],
    queryFn: async () => createCheckoutSession(planId),
    enabled: !!planId,
    retry: 1,
  });

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <Button
        type="button"
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/perfil")}
      >
        <ArrowLeft className="mr-1 size-4" />
        Voltar para o perfil
      </Button>

      <h1 className="mb-1 text-xl font-extrabold tracking-tight text-trampo-dark">
        Finalizar assinatura
      </h1>
      <p className="mb-8 text-xs font-semibold text-trampo-muted">
        Preencha os dados do pagamento para ativar o plano escolhido.
      </p>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-trampo-border bg-white p-12 text-sm font-semibold text-trampo-muted">
          <Loader2 className="size-4 animate-spin" />
          Preparando o pagamento...
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <XCircle className="size-8 text-red-500" />
          <p className="text-xs font-bold text-red-600">
            Não foi possível iniciar o checkout.
          </p>
          <p className="text-xs text-red-500/80">
            {queryError?.message || "Ocorreu um erro na requisição com o servidor."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg border-red-300 text-red-600 hover:bg-red-100/50"
            onClick={() => refetch()}
          >
            Tentar Novamente
          </Button>
        </div>
      )}

      {!stripePromise && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <XCircle className="size-8 text-red-500" />
          <p className="text-xs font-bold text-red-600">Pagamentos indisponíveis</p>
          <p className="text-xs text-red-500/80">
            A chave pública do Stripe não está configurada nesta aplicação. Contate o suporte.
          </p>
        </div>
      )}

      {clientSecret && stripePromise && (
        <CheckoutFormProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckoutForm />
        </CheckoutFormProvider>
      )}
    </div>
  );
}
