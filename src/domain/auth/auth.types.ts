export interface LoginRequest {
  login?: string | null;
  passwordPlano?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string;
}

export interface LoginResponse {
  access_token: string;
  usuario: User;
  code?: string;
}

export interface ChangePasswordFirstTimeRequest {
  resetToken?: string | null;
  newPassword?: string | null;
}
export type ChangePasswordFirstTimeResponse = void;

export interface ForgotPasswordRequest {
  login?: string | null;
}
export type ForgotPasswordResponse = void;

export interface VerifyRecoveryRequest {
  login?: string | null;
  code?: string | null;
}

export interface ChangePasswordRequest {
  resetToken?: string | null;
  newPassword?: string | null;
}
export type ChangePasswordResponse = void;

export interface MenuOption {
  id: number;
  to?: string | null;
  name?: string | null;
  icon?: string | null;
  check?: boolean | null;
  sub?: MenuOption[] | null;
}
export interface AuthOptionsResponse {
  menu?: MenuOption[] | null;
}

export type VerifyRecoveryResponse = {
  reset_token: string;
  usuario: { id: number; login: string; nombre: string };
};
