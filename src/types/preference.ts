export interface SavePreferencesPayload {
  skills: string[];
  levels: string[];
}

export interface UserPreference {
  UserId: string;
  Skills: string[];
  Levels: string[];
}

export interface UserPreferencesResponse {
  message: string;
  data: UserPreference[];
}