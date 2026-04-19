"use client";

import api from "@/lib/axios-instance";
import { useEffect, useState } from "react";

export function useHealthCheck(): void {
    const [state, setState] = useState<string>("");

  const checkIsHealth = async () => {
    const response = api.get<string>("/health");
    return response;
  };

  useEffect(() => {
    // Delay health check to avoid blocking initial main thread
    const timeoutId = setTimeout(() => {
      checkIsHealth();
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, []);
}