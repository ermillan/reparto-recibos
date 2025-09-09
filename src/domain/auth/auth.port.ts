import type {
  LoginRequest,
  LoginResponse,
  ChangePasswordFirstTimeRequest,
  ChangePasswordFirstTimeResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyRecoveryRequest,
  VerifyRecoveryResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  AuthOptionsResponse,
} from "./auth.types";

export interface IAuthRepository {
  login(payload: LoginRequest): Promise<LoginResponse>;
  changePasswordFirstTime(
    payload: ChangePasswordFirstTimeRequest
  ): Promise<ChangePasswordFirstTimeResponse>;
  forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse>;
  verifyRecovery(payload: VerifyRecoveryRequest): Promise<VerifyRecoveryResponse>;
  changePassword(payload: ChangePasswordRequest): Promise<ChangePasswordResponse>;
  getAuthOptions(): Promise<AuthOptionsResponse>;
}
