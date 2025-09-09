import type { ProfileRepository } from "@/domain/profile/profile.repository";
import type { GetProfilesQuery, ProfilesResponse } from "@/domain/profile/profile.types";

export class GetProfiles {
  private repo: ProfileRepository;

  constructor(repo: ProfileRepository) {
    this.repo = repo;
  }

  async execute(query: GetProfilesQuery): Promise<ProfilesResponse> {
    return this.repo.getProfilesPaginated(query);
  }
}
