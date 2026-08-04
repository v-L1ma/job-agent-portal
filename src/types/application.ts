export interface ApplicationQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface Application {
  id: string;
  title: string;
  company: string;
  platform: string;
  status: string;
  createdAt: string;
  questionsCount: number;
  questions: ApplicationQuestion[];
}

export interface ApplicationsResponse {
  message: string;
  data: Application[];
}
