export interface ProfileMenuOption {
  id: number;
  to?: string | null;
  name?: string | null;
  icon?: string | null;
  check?: boolean | null;
  sub?: ProfileMenuOption[] | null;
}

export interface CreateProfileRequest {
  nombre?: string | null;
  descripcion?: string | null;
  activo: boolean;
  opcionIds?: number[] | null;
}
export type CreateProfileResponse = void;

export interface UpdateProfileRequest extends CreateProfileRequest {
  id: number;
}
export type UpdateProfileResponse = void;

export type DeleteProfileResponse = void;

export interface ProfileByIdResponse {
  id: number;
  codigo?: string | null;
  nombre?: string | null;
  descripcion?: string | null;
  activo: boolean;
  estado?: string | null;
  peso: number;
  menu?: ProfileMenuOption[] | null;
}

export interface ProfilesPaginatedQuery {
  page?: number;
  size?: number;
  Activo?: boolean;
  nombre?: string;
}
export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
}
export interface ProfilesPaginatedResponse {
  items?: any[] | null;
  meta: PageMeta;
}

export interface GetProfilesQuery {
  activo?: boolean;
  nombre?: string;
}
export type GetProfilesResponse = any[];

export type GetAccessOptionsResponse = ProfileByIdResponse;
