export interface SavePreferencesPayload {
  skills: string[];
  levels: string[];
  precision: number;
}

export interface UserPreference {
  UserId: string;
  Keywords: string[];
  Levels: string[];
  SimilarityPercent: number;
}

export interface UserPreferencesResponse {
  message: string;
  data: UserPreference;
}