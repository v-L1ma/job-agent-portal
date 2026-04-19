import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";
import { AppShellProviders } from "@/components/providers/app-shell-providers";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Painel interno para acompanhar desempenho e status das suas candidaturas.",
  alternates: withCanonical("/dashboard"),
  robots: noIndexRobots,
};

export default function DashboardRouteLayout({ children }: { children: ReactNode }) {
  return <AppShellProviders>{children}</AppShellProviders>;
}
