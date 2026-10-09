import { loadStripe, type Stripe } from "@stripe/stripe-js";

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51UDlO35pUdtAez2EcC7OQ7ZziMNiIlLCyQwJhRXvhXFbUMVc3ypUl5tHqTTBKh3QdBf0W1swm4yCgh3mKCJ54cbT00PJ2uU8in";

export const stripePromise: Promise<Stripe | null> = loadStripe(
  STRIPE_PUBLISHABLE_KEY
);
