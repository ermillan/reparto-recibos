import type { ProfileRepository } from "@/domain/profile/profile.repository";
import type { ProfileItem } from "@/domain/profile/profile.types";

export class GetProfileById {
  private repo: ProfileRepository;

  constructor(repo: ProfileRepository) {
    this.repo = repo;
  }

  async execute(id: number): Promise<ProfileItem> {
    return this.repo.getProfileById(id);
  }
}
