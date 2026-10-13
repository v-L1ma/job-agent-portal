import { loadStripe, type Stripe } from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  // Falha explícita e ruidosa: sem chave publishable o checkout não funciona.
  // Nunca usar chave de teste hardcoded como fallback.
  console.error(
    "[stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não está configurada. " +
      "Defina a variável de ambiente para habilitar os pagamentos."
  );
}

/** `null` quando a env não está configurada — o consumidor deve tratar explicitamente. */
export const STRIPE_PUBLISHABLE_KEY: string | null = publishableKey ?? null;

export const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey)
  : null;
