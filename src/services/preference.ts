import { SavePreferencesPayload, UserPreference, UserPreferencesResponse } from "@/types/preference";
import { api, toApiError } from "./api";

export async function saveUserPreferences(payload: SavePreferencesPayload): Promise<void> {
  try {
    await api.post("/preferences", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível salvar suas preferências.");
  }
}

export async function getUserPreferences(): Promise<UserPreference> {
  try {
    const response = await api.get<UserPreferencesResponse>("/preferences");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar suas preferências.");
  }
}