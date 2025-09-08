export const ENV = {
  MODE: import.meta.env.MODE as "development" | "production",
  VITE_ENV: import.meta.env.VITE_ENV as "dev" | "prd",
  API_DEV: import.meta.env.VITE_API_BASE_URL_DEV as string,
  API_PRD: import.meta.env.VITE_API_BASE_URL_PRD as string,
  TOKEN_COOKIE: (import.meta.env.VITE_TOKEN_COOKIE as string) ?? "auth_token",
  COOKIE_SECURE: (import.meta.env.VITE_COOKIE_SECURE as string) === "true",
  COOKIE_SAMESITE: (import.meta.env.VITE_COOKIE_SAMESITE as string) || "Lax",
};

export const API_BASE_URL = (ENV.VITE_ENV === "prd" ? ENV.API_PRD : ENV.API_DEV) || "";
