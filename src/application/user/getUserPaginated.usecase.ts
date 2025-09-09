import type { UserRepository } from "@/domain/user/user.repository";
import type { UsersQuery, UsersResponse } from "@/domain/user/user.types";

export class GetUserPaginated {
  private repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async execute(payload: UsersQuery): Promise<UsersResponse> {
    return this.repo.getUsersPaginated(payload);
  }
}
