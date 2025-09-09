import { http } from "@/infrastructure/http/httpClient";
import { ENDPOINTS } from "@/infrastructure/http/endpoints";
import type { AuthRepository } from "@/domain/auth/auth.repository";
import type { LoginResponse } from "@/domain/auth/auth.types";

export class AuthApi implements AuthRepository {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>(ENDPOINTS.login, {
      login: email,
      passwordPlano: password,
    });

    return data;
  }
}
