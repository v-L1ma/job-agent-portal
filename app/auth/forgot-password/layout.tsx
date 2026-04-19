import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Recuperar senha",
  description:
    "Solicite a recuperacao de senha para voltar a acessar sua conta em seguranca.",
  alternates: withCanonical("/auth/forgot-password"),
  robots: noIndexRobots,
};

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
