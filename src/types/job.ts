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

export interface RateJobPayload {
  userId: string;
  liked: boolean;
  feedback?: string;
}


export interface JobsParams {
  stack?: string;
  location?: string;
  company?: string;
  platform?: string;
  limit?: number;
  cursor?: string;
}