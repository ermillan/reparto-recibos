import { http } from "@/infrastructure/http/httpClient";
import { ENDPOINTS } from "@/infrastructure/http/endpoints";
import type {
  CreateProfileDto,
  GetProfilesQuery,
  ProfileItem,
  ProfileMenuResponse,
  ProfilesResponse,
  UpdateProfilePayload,
} from "@/domain/profile/profile.types";
import type { ProfileRepository } from "@/domain/profile/profile.repository";

export class ProfileApi implements ProfileRepository {
  async getProfilesPaginated(query: GetProfilesQuery): Promise<ProfilesResponse> {
    const { activo, page, size, nombre } = query;
    const { data } = await http.get<ProfilesResponse>(ENDPOINTS.profilesPaginated, {
      params: { activo, nombre, page, size },
    });
    return data;
  }

  async getProfileById(id: number): Promise<ProfileItem> {
    const { data } = await http.get<ProfileItem>(`${ENDPOINTS.getProfileById}/${id}`);
    return data;
  }

  async createProfile(payload: CreateProfileDto): Promise<ProfileItem> {
    const { data } = await http.post<ProfileItem>(ENDPOINTS.createProfile, payload);
    return data;
  }

  async updateProfileById(id: number, payload: UpdateProfilePayload): Promise<ProfileItem> {
    const { data } = await http.put<ProfileItem>(`${ENDPOINTS.updateProfile}/${id}`, payload);
    return data;
  }

  async deleteProfileById(id: number): Promise<void> {
    await http.delete(`${ENDPOINTS.deleteProfile}/${id}`);
  }

  async getAccessOptions(): Promise<ProfileMenuResponse> {
    const { data } = await http.get<ProfileMenuResponse>(ENDPOINTS.getAccessOptions);
    return data;
  }
}
