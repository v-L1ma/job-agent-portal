import { useState, useEffect } from "react";
import { getUserStatistics, UserStatisticsResponse } from "@/lib/api";

interface UseDashboardReturn {
  statistics: UserStatisticsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const [statistics, setStatistics] = useState<UserStatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserStatistics();
      setStatistics(data);
    } catch (err: any) {
      setError(err?.response?.data?.title || err?.message || "Erro ao carregar estatísticas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return { statistics, isLoading, error, refetch: fetchStatistics };
}
