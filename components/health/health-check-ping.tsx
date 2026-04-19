"use client";

import { useHealthCheck } from "@/hooks/use-health";

export function HealthCheckPing() {
  useHealthCheck();

  return null;
}