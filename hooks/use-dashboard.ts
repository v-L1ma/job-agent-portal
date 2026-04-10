import { useState, useEffect } from "react";
import api from "@/lib/axios-instance";

interface UseDashboardReturn {
  statistics: UserStatisticsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UserStatisticsResponse {
  overview: {
    total: number;
    totalPercentageChange: number;
    applied: number;
    appliedSuccessRate: number;
    skipped: number;
    failed: number;
    failedWeeklyChange: number;
  };
  applicationsByDay: {
    data: { date: string; count: number }[];
  };
  statusDistribution: {
    total: number;
    applied: number;
    appliedPercentage: number;
    skipped: number;
    skippedPercentage: number;
    failed: number;
    failedPercentage: number;
  };
  platformDistribution: {
    data: { platform: string; count: number }[];
  };
}

export async function getUserStatistics(): Promise<UserStatisticsResponse> {
  const response = await api.get<UserStatisticsResponse>("/api/users/statistics");
  return response.data;
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
