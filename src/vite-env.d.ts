/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: "dev" | "prd";
  readonly VITE_API_BASE_URL_DEV: string;
  readonly VITE_API_BASE_URL_PRD: string;
  readonly VITE_TOKEN_COOKIE: string;
  readonly VITE_COOKIE_SECURE: string;
  readonly VITE_COOKIE_SAMESITE: string;
}
