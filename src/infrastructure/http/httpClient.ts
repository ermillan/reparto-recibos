import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, ENV } from "@/infrastructure/env/config";

export const http = axios.create({ baseURL: API_BASE_URL });

http.interceptors.request.use((config) => {
  const token = Cookies.get(ENV.TOKEN_COOKIE);
  if (token) {
    config.headers = config.headers || {}; // asegúrate de que exista
    (config.headers as any).set?.("Authorization", `Bearer ${token}`);
    // si config.headers no es AxiosHeaders (p. ej. en SSR), cae en el siguiente:
    if (!(config.headers as any).set) {
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});
