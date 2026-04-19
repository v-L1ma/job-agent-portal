import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";
import { AppShellProviders } from "@/components/providers/app-shell-providers";

export const metadata: Metadata = {
  title: "Meu perfil",
  description:
    "Area interna para editar informacoes pessoais, contato e dados da conta.",
  alternates: withCanonical("/perfil"),
  robots: noIndexRobots,
};

export default function PerfilRouteLayout({ children }: { children: ReactNode }) {
  return <AppShellProviders>{children}</AppShellProviders>;
}
