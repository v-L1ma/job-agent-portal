import type { Metadata } from "next";
import type { ReactNode } from "react";
import { noIndexRobots, withCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Criar conta",
  description:
    "Crie sua conta para configurar preferencias de carreira e automatizar candidaturas.",
  alternates: withCanonical("/auth/register"),
  robots: noIndexRobots,
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
