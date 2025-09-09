import type { ProfileRepository } from "@/domain/profile/profile.repository";

export class GetProfileById {
  private repo: ProfileRepository;

  constructor(repo: ProfileRepository) {
    this.repo = repo;
  }

  async execute(id: number): Promise<void> {
    return this.repo.deleteProfileById(id);
  }
}
