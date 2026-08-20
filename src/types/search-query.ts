export interface SearchQuery {
  Id: string;
  Query: string;
  Keywords: string[];
  NormalizedHash: string;
  Area: string;
  Levels: string[];
  Executions: number;
  LastExecutedAt: string | null;
}

export interface SearchQueryResponse {
  message: string;
  logs: SearchQuery[];
}
