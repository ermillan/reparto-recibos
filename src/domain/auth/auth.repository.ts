export interface AuthRepository {
  login(email: string, password: string): Promise<{ access_token: string }>;
  logout(): void;
}