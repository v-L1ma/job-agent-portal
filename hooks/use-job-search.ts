import { useState, useCallback } from "react";
import { getJobs, type Job } from "@/lib/api";

interface UseJobSearchResult {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  searchJobs: () => Promise<void>;
  reset: () => void;
}

export function useJobSearch(): UseJobSearchResult {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getJobs();
      setJobs(data.jobs);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao buscar vagas");
      }
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setJobs([]);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    jobs,
    isLoading,
    error,
    searchJobs,
    reset,
  };
}
