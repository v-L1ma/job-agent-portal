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

export interface VerifyEmailPayload {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export async function verifyEmail(payload: VerifyEmailPayload): Promise<VerifyEmailResponse> {
  try {
    const response = await api.post<VerifyEmailResponse>("/verify-email", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível verificar seu e-mail.");
  }
}

export interface ResendConfirmationPayload {
  email: string;
}

export interface ResendConfirmationResponse {
  message: string;
}

export async function resendConfirmation(payload: ResendConfirmationPayload): Promise<ResendConfirmationResponse> {
  try {
    const response = await api.post<ResendConfirmationResponse>("/resend-confirmation", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível reenviar o e-mail de confirmação.");
  }
}

export interface ForgotPasswordResponse {
  message: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
  try {
    const response = await api.post<ForgotPasswordResponse>("/forgot-password", payload);
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
