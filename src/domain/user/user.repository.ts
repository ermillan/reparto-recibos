import type { UsersQuery, UsersResponse } from "./user.types";

export interface UserRepository {
  getUsersPaginated(query: UsersQuery): Promise<UsersResponse>;
}
