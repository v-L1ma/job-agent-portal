import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";
import { AppShellProviders } from "@/components/providers/app-shell-providers";

export const metadata: Metadata = {
  title: {
    default: "Acesso a conta",
    template: "%s | BuscaVagas",
  },
  description:
    "Fluxos de autenticacao para entrar, criar conta e recuperar senha no BuscaVagas.",
  alternates: withCanonical("/auth/login"),
  robots: noIndexRobots,
};

export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  return <AppShellProviders>{children}</AppShellProviders>;
}