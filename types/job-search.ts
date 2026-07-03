export interface ListJobsResponse {
  jobs: Job[];
  nextCursor?: string;
}

export interface Job {
  id: string;
  plataformJobId: string;
  title: string;
  description: string;
  url: string;
  isApplied: boolean;
  status: string;
  active: boolean;
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  platform: string;
  company: string;
}

export interface UseJobSearchResult {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  searchJobs: () => Promise<void>;
  reset: () => void;
}
