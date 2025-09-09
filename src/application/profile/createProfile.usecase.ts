import type { ProfileRepository } from "@/domain/profile/profile.repository";
import type { CreateProfileDto, ProfileItem } from "@/domain/profile/profile.types";

export class CreateProfile {
  private repo: ProfileRepository;

  constructor(repo: ProfileRepository) {
    this.repo = repo;
  }

  async execute(payload: CreateProfileDto): Promise<ProfileItem> {
    return this.repo.createProfile(payload);
  }
}
