import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Acesse sua conta para acompanhar vagas, candidaturas e automacoes da plataforma.",
  alternates: withCanonical("/auth/login"),
  robots: noIndexRobots,
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
