import { http } from "@/infrastructure/http/httpClient";
import { ENDPOINTS } from "@/infrastructure/http/endpoints";
import type { UsersQuery, UsersResponse } from "@/domain/user/user.types";
import type { UserRepository } from "@/domain/user/user.repository";

export class UserApi implements UserRepository {
  async getUsersPaginated(query: UsersQuery): Promise<UsersResponse> {
    const {
      Page,
      Size,
      Texto,
      Login,
      Codigo,
      Nombre,
      NumeroDocumento,
      Activo = true,
      IdPerfil,
      IdContratista,
      SortBy,
      Desc,
    } = query;

    const { data } = await http.get<UsersResponse>(ENDPOINTS.getUsersPaginated, {
      params: {
        Page,
        Size,
        Texto,
        Login,
        Codigo,
        Nombre,
        NumeroDocumento,
        Activo,
        IdPerfil,
        IdContratista,
        SortBy,
        Desc,
      },
    });
    return data;
  }
}
