// infrastructure/http/httpClient.ts
import axios, { AxiosHeaders, type AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/infrastructure/env/config";
import { store } from "@/store/store";

export const http = axios.create({ baseURL: API_BASE_URL });

function ensureAxiosHeaders(h: AxiosRequestConfig["headers"]) {
  return AxiosHeaders.from((h ?? {}) as Record<string, any>);
}

http.interceptors.request.use((config) => {
  const token = store.getState().auth?.token;

  // Asegura que headers sea AxiosHeaders
  config.headers = ensureAxiosHeaders(config.headers);

  if (token) {
    // Ahora sí, usa la API tipada de AxiosHeaders
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }

  return config;
});
