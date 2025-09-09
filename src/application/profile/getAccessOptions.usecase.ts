import type { ProfileRepository } from "@/domain/profile/profile.repository";
import type { ProfileMenuResponse } from "@/domain/profile/profile.types";

export class GetAccessOptions {
  private repo: ProfileRepository;

  constructor(repo: ProfileRepository) {
    this.repo = repo;
  }

  async execute(): Promise<ProfileMenuResponse> {
    return this.repo.getAccessOptions();
  }
}
