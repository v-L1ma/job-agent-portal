export interface ScrapperLog {
  Id: string;
  Query: string;
  Platform: string;
  ExecutedAt: string;
  Status: string;
  Obs: string | null;
  SavedJobsCount: number;
}

export interface ScrapperLogsResponse {
  message: string;
  logs: ScrapperLog[];
}

export interface ExecutionJob {
  Id: string;
  Title: string;
  Url: string;
  Platform: string;
  Company: string;
}

export interface ExecutionJobsResponse {
  message: string;
  jobs: ExecutionJob[];
}
