import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";
import { AppShellProviders } from "@/components/providers/app-shell-providers";

export const metadata: Metadata = {
  title: "Preferencias de busca",
  description:
    "Area interna para configurar filtros e preferencias usadas na busca automatizada de vagas.",
  alternates: withCanonical("/preferencias"),
  robots: noIndexRobots,
};

export default function PreferenciasRouteLayout({ children }: { children: ReactNode }) {
  return <AppShellProviders>{children}</AppShellProviders>;
}
