import { api, toApiError } from "@/services/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
    onboardingCompleted?: boolean;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/login`)
    const response = await api.post<LoginResponse>("/login", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível realizar o login.");
  }
}

export async function loginWithGoogle(payload: { idToken: string }): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/login/google", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível realizar o login.");
  }
}

export async function register(payload: RegisterPayload): Promise<void> {
  try {
    await api.post("/register", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível concluir o cadastro.");
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string; resetToken: string }> {
  try {
    const response = await api.post<{ message: string; resetToken: string }>("/forgot-password", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível enviar o link de recuperação.");
  }
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  try {
    await api.post("/reset-password", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível redefinir a senha.");
  }
}
