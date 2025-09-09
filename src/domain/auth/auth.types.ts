export interface LoginRequest {
  login?: string | null;
  passwordPlano?: string | null;
}
export type LoginResponse = unknown; // cambia a { token: string; user: ... } si aplica

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
export type VerifyRecoveryResponse = void;

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
