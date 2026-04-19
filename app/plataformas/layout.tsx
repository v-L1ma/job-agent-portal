import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";
import { AppShellProviders } from "@/components/providers/app-shell-providers";

export const metadata: Metadata = {
  title: "Integracoes de plataformas",
  description:
    "Area interna para configurar conexoes com plataformas externas de recrutamento.",
  alternates: withCanonical("/plataformas"),
  robots: noIndexRobots,
};

export default function PlataformasRouteLayout({ children }: { children: ReactNode }) {
  return <AppShellProviders>{children}</AppShellProviders>;
}
