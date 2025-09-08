import { http } from "@/infrastructure/http/httpClient";
import { ENDPOINTS } from "@/infrastructure/http/endpoints";
import Cookies from "js-cookie";
import { ENV } from "@/infrastructure/env/config";

export async function login(email: string, password: string) {
  const { data } = await http.post(ENDPOINTS.login, { login: email, passwordPlano: password });
  const token = data?.access_token as string;
  if (token) {
    Cookies.set(ENV.TOKEN_COOKIE, token, {
      secure: ENV.COOKIE_SECURE,
      sameSite: ENV.COOKIE_SAMESITE as any,
    });
  }
  return data;
}

export function logout() {
  Cookies.remove(ENV.TOKEN_COOKIE);
}
