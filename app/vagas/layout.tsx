import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";
import { AppShellProviders } from "@/components/providers/app-shell-providers";

export const metadata: Metadata = {
  title: "Vagas e candidaturas",
  description:
    "Area interna para buscar vagas, avaliar oportunidades e gerar curriculo personalizado.",
  alternates: withCanonical("/vagas"),
  robots: noIndexRobots,
};

export default function VagasRouteLayout({ children }: { children: ReactNode }) {
  return <AppShellProviders>{children}</AppShellProviders>;
}
