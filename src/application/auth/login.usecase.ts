import type { AuthRepository } from "@/domain/auth/auth.repository";

export class LoginUseCase {
  private readonly repo: AuthRepository;
  constructor(repo: AuthRepository) {
    this.repo = repo;
  }
  exec(email: string, password: string) {
    return this.repo.login(email, password);
  }
}
