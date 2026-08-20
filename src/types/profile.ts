export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  cpf?: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}