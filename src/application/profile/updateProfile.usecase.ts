import type { ProfileRepository } from "@/domain/profile/profile.repository";
import type { ProfileItem, UpdateProfileDto } from "@/domain/profile/profile.types";

export class UpdateProfileById {
  private repo: ProfileRepository;

  constructor(repo: ProfileRepository) {
    this.repo = repo;
  }

  async execute(id: number, payload: UpdateProfileDto): Promise<ProfileItem> {
    return this.repo.updateProfileById(id, payload);
  }
}
