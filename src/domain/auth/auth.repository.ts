import type { LoginResponse } from "./auth.types";

export interface AuthRepository {
  login(email: string, password: string): Promise<LoginResponse>;
}
