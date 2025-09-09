import type { IAuthRepository } from "@/domain/auth/auth.port";
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
} from "@/domain/auth/auth.types";

export class Login {
  private repo: IAuthRepository;
  constructor(repo: IAuthRepository) {
    this.repo = repo;
  }
  exec(payload: LoginRequest): Promise<LoginResponse> {
    return this.repo.login(payload);
  }
}
export class ChangePasswordFirstTime {
  private repo: IAuthRepository;
  constructor(repo: IAuthRepository) {
    this.repo = repo;
  }
  exec(payload: ChangePasswordFirstTimeRequest): Promise<ChangePasswordFirstTimeResponse> {
    return this.repo.changePasswordFirstTime(payload);
  }
}
export class ForgotPassword {
  private repo: IAuthRepository;
  constructor(repo: IAuthRepository) {
    this.repo = repo;
  }
  exec(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return this.repo.forgotPassword(payload);
  }
}
export class VerifyRecovery {
  private repo: IAuthRepository;
  constructor(repo: IAuthRepository) {
    this.repo = repo;
  }
  exec(payload: VerifyRecoveryRequest): Promise<VerifyRecoveryResponse> {
    return this.repo.verifyRecovery(payload);
  }
}
export class ChangePassword {
  private repo: IAuthRepository;
  constructor(repo: IAuthRepository) {
    this.repo = repo;
  }
  exec(payload: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return this.repo.changePassword(payload);
  }
}
export class GetAuthOptions {
  private repo: IAuthRepository;
  constructor(repo: IAuthRepository) {
    this.repo = repo;
  }
  exec(): Promise<AuthOptionsResponse> {
    return this.repo.getAuthOptions();
  }
}
