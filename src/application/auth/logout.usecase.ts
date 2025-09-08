import type { AuthRepository } from "@/domain/auth/auth.repository";

export class LogoutUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute() {
    return this.authRepository.logout();
  }
}
