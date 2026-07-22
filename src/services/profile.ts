import { ChangePasswordPayload, UpdateProfilePayload, UserProfileResponse } from "@/types/profile";
import { api, toApiError } from "./api";

export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    const response = await api.get<{ message: string; data: UserProfileResponse }>("/users/profile");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar seu perfil.");
  }
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<void> {
  try {
    await api.put("/users/profile", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível atualizar seu perfil.");
  }
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  try {
    await api.put("/users/change-password", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível alterar sua senha.");
  }
}