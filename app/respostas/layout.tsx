import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";
import { AppShellProviders } from "@/components/providers/app-shell-providers";

export const metadata: Metadata = {
  title: "Respostas prontas",
  description:
    "Area interna para organizar respostas frequentes e agilizar candidaturas.",
  alternates: withCanonical("/respostas"),
  robots: noIndexRobots,
};

export default function RespostasRouteLayout({ children }: { children: ReactNode }) {
  return <AppShellProviders>{children}</AppShellProviders>;
}
