import type {
  CreateProfileRequest,
  CreateProfileResponse,
  DeleteProfileResponse,
  GetAccessOptionsResponse,
  GetProfilesQuery,
  GetProfilesResponse,
  ProfileByIdResponse,
  ProfilesPaginatedQuery,
  ProfilesPaginatedResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "./profile.types";

export interface IProfileRepository {
  createProfile(payload: CreateProfileRequest): Promise<CreateProfileResponse>;
  updateProfile(payload: UpdateProfileRequest): Promise<UpdateProfileResponse>;
  deleteProfile(id: number): Promise<DeleteProfileResponse>;
  getProfileById(id: number): Promise<ProfileByIdResponse>;
  getProfilesPaginated(query?: ProfilesPaginatedQuery): Promise<ProfilesPaginatedResponse>;
  getProfiles(query?: GetProfilesQuery): Promise<GetProfilesResponse>;
  getAccessOptions(): Promise<GetAccessOptionsResponse>;
}
