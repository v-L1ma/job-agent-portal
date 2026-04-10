export interface Job {
  id: string;
  title: string;
  description: string;
  url: string;
  isApplied: boolean;
  company?: string;
  location?: string;
  platform?: string;
}

export interface JobSearchMeta {
  scraperRunning: boolean;
  fromCache: boolean;
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
  requestId?: string;
}

export interface JobSearchResponse {
  isLoading: boolean;
  data: Job[];
  meta: JobSearchMeta;
}

export interface UseJobSearchResult {
  jobs: Job[];
  isLoading: boolean;
  isPolling: boolean;
  meta: JobSearchMeta | null;
  error: string | null;
  searchJobs: (query: string, options?: JobSearchOptions) => Promise<void>;
  reset: () => void;
}

export interface JobSearchOptions {
  stack?: string | null;
  location?: string | null;
  page?: number;
  pageSize?: number;
  onProgress?: (data: JobSearchResponse) => void;
}
