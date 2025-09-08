// src/infrastructure/auth/auth.api.ts
import { http } from "@/infrastructure/http/httpClient";
import { ENDPOINTS } from "@/infrastructure/http/endpoints";
import Cookies from "js-cookie";
import { ENV } from "@/infrastructure/env/config";
import type { AuthRepository } from "@/domain/auth/auth.repository";

export class AuthApi implements AuthRepository {
  async login(email: string, password: string) {
    const { data } = await http.post(ENDPOINTS.login, {
      login: email,
      passwordPlano: password,
    });

    const token = data?.access_token as string;
    if (token) {
      Cookies.set(ENV.TOKEN_COOKIE, token, {
        secure: ENV.COOKIE_SECURE,
        sameSite: ENV.COOKIE_SAMESITE as any,
      });
    }

    return data;
  }

  logout() {
    Cookies.remove(ENV.TOKEN_COOKIE);
  }
}
