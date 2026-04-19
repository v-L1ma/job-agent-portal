import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";
import { AppShellProviders } from "@/components/providers/app-shell-providers";

export const metadata: Metadata = {
  title: "Gerenciar curriculo",
  description:
    "Area interna para atualizar curriculo e preparar candidatura para vagas relevantes.",
  alternates: withCanonical("/curriculo"),
  robots: noIndexRobots,
};

export default function CurriculoRouteLayout({ children }: { children: ReactNode }) {
  return <AppShellProviders>{children}</AppShellProviders>;
}
