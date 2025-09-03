import type { AuthRepository } from "@/domain/auth/auth.repository";

export class LoginUseCase {
  constructor(private readonly repo: AuthRepository) {}
  exec(email: string, password: string) {
    return this.repo.login(email, password);
  }
}