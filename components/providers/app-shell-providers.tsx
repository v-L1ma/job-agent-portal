"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppShellProvidersProps {
  children: ReactNode;
}

export function AppShellProviders({ children }: AppShellProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
