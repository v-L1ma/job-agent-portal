"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppShellProvidersProps {
  children: ReactNode;
}

export function AppShellProviders({ children }: AppShellProvidersProps) {
  return (
    <AuthProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </AuthProvider>
  );
}
