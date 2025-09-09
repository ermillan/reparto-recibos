import type {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserByIdResponse,
  UsersAutocompleteQuery,
  UsersAutocompleteResponse,
  UsersPagedResponse,
  UsersQuery,
} from "./user.types";

export interface IUserRepository {
  createUser(payload: CreateUserRequest): Promise<CreateUserResponse>;
  updateUser(payload: UpdateUserRequest): Promise<UpdateUserResponse>;
  deleteUser(id: number): Promise<DeleteUserResponse>;
  getUserById(id: number): Promise<UserByIdResponse>;
  getUsersPaginated(query?: UsersQuery): Promise<UsersPagedResponse>;
  getUsersAutocomplete(query?: UsersAutocompleteQuery): Promise<UsersAutocompleteResponse>;
}
