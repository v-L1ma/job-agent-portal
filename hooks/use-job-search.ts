import { useState, useCallback, useRef } from 'react';
import api from '@/lib/axios-instance';
import type {
  Job,
  JobSearchMeta,
  JobSearchOptions,
  JobSearchResponse,
  UseJobSearchResult,
} from '@/types/job-search';

type JobsSearchApiPayload = {
  isLoading?: boolean;
  data?: Job[];
  items?: Job[];
  meta?: Partial<JobSearchMeta>;
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
};

function isJobsSearchApiPayload(value: unknown): value is JobsSearchApiPayload {
  return typeof value === 'object' && value !== null;
}

export function useJobSearch(): UseJobSearchResult {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [meta, setMeta] = useState<JobSearchMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<boolean>(false);

  const searchJobs = useCallback(
    async (query: string, options: JobSearchOptions = {}) => {
      const {
        stack = null,
        location = null,
        page = 1,
        pageSize = 10,
        onProgress = null,
      } = options;

      setIsLoading(true);
      setIsPolling(false);
      setError(null);
      setJobs([]);
      setMeta(null);
      pollingRef.current = false;

      const poll = async (attempts: number = 1): Promise<void> => {
        const maxAttempts = 5;
        const basePollingInterval = 1000;

        const stopPollingSilently = () => {
          setIsLoading(false);
          setIsPolling(false);
          pollingRef.current = false;
        };

        const scheduleNextPoll = () => {
          if (attempts >= maxAttempts) {
            stopPollingSilently();
            return;
          }

          const nextAttempts = attempts + 1;
          const pollingInterval = basePollingInterval * Math.pow(2, attempts - 1);

          setIsPolling(true);
          pollingRef.current = true;
          setTimeout(() => {
            void poll(nextAttempts);
          }, pollingInterval);
        };

        try {
          const params: Record<string, string | number> = {
            query,
            page,
            pageSize,
          };

          if (stack) params.stack = stack;
          if (location) params.location = location;

          const response = await api.get<JobSearchResponse | JobsSearchApiPayload>('/api/jobs/search', {
            params,
          });

          if (response.status === 204) {
            scheduleNextPoll();
            return;
          }

          const data = response.data;

          if (!isJobsSearchApiPayload(data)) {
            scheduleNextPoll();
            return;
          }

          const normalizedJobs = Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.items)
              ? data.items
              : [];

          const normalizedMeta: JobSearchMeta = {
            scraperRunning: Boolean(data.meta?.scraperRunning ?? data.isLoading),
            fromCache: Boolean(data.meta?.fromCache),
            totalItems: data.meta?.totalItems ?? data.totalItems,
            currentPage: data.meta?.currentPage ?? data.currentPage,
            totalPages: data.meta?.totalPages ?? data.totalPages,
            requestId: data.meta?.requestId,
          };

          const stillLoading = Boolean(data.isLoading ?? normalizedMeta.scraperRunning);

          if (onProgress) {
            onProgress({
              isLoading: stillLoading,
              data: normalizedJobs,
              meta: normalizedMeta,
            });
          }

          if (normalizedJobs.length > 0) {
            setJobs(normalizedJobs);
            setMeta(normalizedMeta);
            setIsLoading(false);

            if (!stillLoading) {
              setIsPolling(false);
              pollingRef.current = false;
              return;
            }

            setIsPolling(true);
            pollingRef.current = true;

            scheduleNextPoll();
            return;
          }

          if (!stillLoading) {
            setJobs([]);
            setMeta(normalizedMeta);
            setIsLoading(false);
            setIsPolling(false);
            pollingRef.current = false;
            return;
          }

          // Scraping ainda em andamento
          scheduleNextPoll();
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Erro desconhecido');
          }
          setIsLoading(false);
          setIsPolling(false);
          pollingRef.current = false;
        }
      };

      await poll(0);
    },
    []
  );

  const reset = useCallback(() => {
    setJobs([]);
    setIsLoading(false);
    setIsPolling(false);
    setMeta(null);
    setError(null);
    pollingRef.current = false;
  }, []);

  return {
    jobs,
    isLoading,
    isPolling,
    meta,
    error,
    searchJobs,
    reset,
  };
}
