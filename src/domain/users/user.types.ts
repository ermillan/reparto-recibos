export interface CreateUserRequest {
  login?: string | null;
  password?: string | null;
  nombre?: string | null;
  apellidoPaterno?: string | null;
  apellidoMaterno?: string | null;
  email?: string | null;
  numeroDocumento?: string | null;
  idTipoDocumento?: number | null;
  celular?: string | null;
  direccion?: string | null;
  activo: boolean;
  perfilIds?: number[] | null;
  contratistaIds?: number[] | null;
}
export type CreateUserResponse = number;

export interface UpdateUserRequest extends Omit<CreateUserRequest, "password"> {
  id: number;
}
export type UpdateUserResponse = void;
export type DeleteUserResponse = void;

export interface UserByIdResponse {
  id: number;
  codigo?: string | null;
  login?: string | null;
  nombre?: string | null;
  apellidoPaterno?: string | null;
  apellidoMaterno?: string | null;
  email?: string | null;
  numeroDocumento?: string | null;
  idTipoDocumento?: number | null;
  celular?: string | null;
  direccion?: string | null;
  primeraVez: boolean;
  bloqueado: boolean;
  activo: boolean;
  idPerfilDefault?: number | null;
  perfilIds?: number[] | null;
  contratistaIds?: number[] | null;
}

export interface UsersQuery {
  Page?: number;
  Size?: number;
  IdContratistas?: any[] | null;
  Texto?: string;
  Login?: string;
  Codigo?: string;
  Nombre?: string;
  NumeroDocumento?: string;
  Activo?: boolean;
  IdPerfiles?: number[] | undefined;
  IdContratista?: number;
  SortBy?: string;
  Desc?: boolean;
}
export interface UsersPagedMeta {
  page: number;
  pageSize: number;
  total: number;
}
export interface UsersPagedResponse {
  items?: any[] | null;
  meta: UsersPagedMeta;
}

export interface UsersAutocompleteQuery {
  q?: string;
  size?: number;
  activo?: boolean;
  idPerfil?: number;
  idContratista?: number;
}
export interface UserSuggestItem {
  id: number;
  label?: string | null;
  subLabel?: string | null;
}
export type UsersAutocompleteResponse = UserSuggestItem[];
