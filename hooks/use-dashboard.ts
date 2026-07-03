import { useState, useEffect } from "react";
import { getUserStatistics, type UserStatisticsResponse } from "@/lib/api";

interface UseDashboardReturn {
  statistics: UserStatisticsResponse["data"] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const [statistics, setStatistics] = useState<UserStatisticsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUserStatistics();
      setStatistics(response.data);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar estatísticas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return { statistics, isLoading, error, refetch: fetchStatistics };
}
