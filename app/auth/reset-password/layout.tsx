import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Redefinir senha",
  description: "Redefina sua senha para voltar a acessar sua conta.",
  alternates: withCanonical("/auth/reset-password"),
  robots: noIndexRobots,
};

export default function ResetPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
