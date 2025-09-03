import Cookies from "js-cookie";
import { ENV } from "@/infrastructure/env/config";

export const TokenStorage = {
  get: () => Cookies.get(ENV.TOKEN_COOKIE),
  set: (token: string) =>
    Cookies.set(ENV.TOKEN_COOKIE, token, {
      secure: ENV.COOKIE_SECURE,
      sameSite: ENV.COOKIE_SAMESITE as any,
    }),
  remove: () => Cookies.remove(ENV.TOKEN_COOKIE),
};