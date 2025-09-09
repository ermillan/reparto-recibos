import type { IProfileRepository } from "@/domain/profiles/profile.port";
import type {
  CreateProfileRequest,
  CreateProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  DeleteProfileResponse,
  ProfileByIdResponse,
  ProfilesPaginatedQuery,
  ProfilesPaginatedResponse,
  GetProfilesQuery,
  GetProfilesResponse,
  GetAccessOptionsResponse,
} from "@/domain/profiles/profile.types";

export class CreateProfile {
  private repo: IProfileRepository;

  constructor(repo: IProfileRepository) {
    this.repo = repo;
  }

  exec(p: CreateProfileRequest): Promise<CreateProfileResponse> {
    return this.repo.createProfile(p);
  }
}
export class UpdateProfile {
  private repo: IProfileRepository;

  constructor(repo: IProfileRepository) {
    this.repo = repo;
  }

  exec(p: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    return this.repo.updateProfile(p);
  }
}
export class DeleteProfile {
  private repo: IProfileRepository;

  constructor(repo: IProfileRepository) {
    this.repo = repo;
  }

  exec(id: number): Promise<DeleteProfileResponse> {
    return this.repo.deleteProfile(id);
  }
}
export class GetProfileById {
  private repo: IProfileRepository;

  constructor(repo: IProfileRepository) {
    this.repo = repo;
  }

  exec(id: number): Promise<ProfileByIdResponse> {
    return this.repo.getProfileById(id);
  }
}
export class GetProfilesPaginated {
  private repo: IProfileRepository;

  constructor(repo: IProfileRepository) {
    this.repo = repo;
  }

  exec(q?: ProfilesPaginatedQuery): Promise<ProfilesPaginatedResponse> {
    return this.repo.getProfilesPaginated(q);
  }
}

export class GetProfiles {
  private repo: IProfileRepository;

  constructor(repo: IProfileRepository) {
    this.repo = repo;
  }

  exec(q?: GetProfilesQuery): Promise<GetProfilesResponse> {
    return this.repo.getProfiles(q);
  }
}

export class GetAccessOptions {
  private repo: IProfileRepository;

  constructor(repo: IProfileRepository) {
    this.repo = repo;
  }

  exec(): Promise<GetAccessOptionsResponse> {
    return this.repo.getAccessOptions();
  }
}
