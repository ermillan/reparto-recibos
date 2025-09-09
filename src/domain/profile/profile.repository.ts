import type {
  CreateProfileDto,
  GetProfilesQuery,
  ProfileItem,
  ProfileMenuResponse,
  ProfilesResponse,
  UpdateProfileDto,
} from "./profile.types";

export interface ProfileRepository {
  getProfilesPaginated(query: GetProfilesQuery): Promise<ProfilesResponse>;
  getProfileById(id: number): Promise<ProfileItem>;
  createProfile(payload: CreateProfileDto): Promise<ProfileItem>;
  updateProfileById(id: number, payload: UpdateProfileDto): Promise<ProfileItem>;
  deleteProfileById(id: number): Promise<void>;
  getAccessOptions(): Promise<ProfileMenuResponse>; // ← NO array, según tu payload
}
