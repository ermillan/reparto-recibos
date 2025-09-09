import type { IUserRepository } from "@/domain/users/user.port";
import type {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
  UserByIdResponse,
  UsersQuery,
  UsersPagedResponse,
  UsersAutocompleteQuery,
  UsersAutocompleteResponse,
} from "@/domain/users/user.types";

export class CreateUser {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }
  exec(p: CreateUserRequest): Promise<CreateUserResponse> {
    return this.repo.createUser(p);
  }
}

export class UpdateUser {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }
  exec(p: UpdateUserRequest): Promise<UpdateUserResponse> {
    return this.repo.updateUser(p);
  }
}

export class DeleteUser {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }
  exec(id: number): Promise<DeleteUserResponse> {
    return this.repo.deleteUser(id);
  }
}

export class GetUserById {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }
  exec(id: number): Promise<UserByIdResponse> {
    return this.repo.getUserById(id);
  }
}

export class GetUsersPaginated {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }
  exec(q?: UsersQuery): Promise<UsersPagedResponse> {
    return this.repo.getUsersPaginated(q);
  }
}

export class GetUsersAutocomplete {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }
  exec(q?: UsersAutocompleteQuery): Promise<UsersAutocompleteResponse> {
    return this.repo.getUsersAutocomplete(q);
  }
}
