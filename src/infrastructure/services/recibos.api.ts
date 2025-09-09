import { http } from "@/infrastructure/http/httpClient";
import { ENDPOINTS } from "@/infrastructure/http/endpoints";

/** AUTH */
import type { IAuthRepository } from "@/domain/auth/auth.port";
import type * as Auth from "@/domain/auth/auth.types";

/** CONTRACTORS */
import type { IContractorRepository } from "@/domain/contractors/contractor.port";
import type * as Contractors from "@/domain/contractors/contractor.type";

/** LISTS */
import type { IListRepository } from "@/domain/lists/list.port";
import type * as Lists from "@/domain/lists/list.types";

/** PARAMS */
import type { IParamsRepository } from "@/domain/params/params.port";
import type * as Params from "@/domain/params/params.types";

/** PROFILES */
import type { IProfileRepository } from "@/domain/profiles/profile.port";
import type * as Profiles from "@/domain/profiles/profile.types";

/** USERS */
import type { IUserRepository } from "@/domain/users/user.port";
import type * as Users from "@/domain/users/user.types";

/* ============ AUTH ============ */
export class AuthApi implements IAuthRepository {
  login(p: Auth.LoginRequest) {
    return http.post<Auth.LoginResponse>(ENDPOINTS.login, p).then((r) => r.data);
  }
  changePasswordFirstTime(p: Auth.ChangePasswordFirstTimeRequest) {
    return http
      .post<Auth.ChangePasswordFirstTimeResponse>(ENDPOINTS.changePasswordFirstTime, p)
      .then((r) => r.data);
  }
  forgotPassword(p: Auth.ForgotPasswordRequest) {
    return http.post<Auth.ForgotPasswordResponse>(ENDPOINTS.forgotPassword, p).then((r) => r.data);
  }
  verifyRecovery(p: Auth.VerifyRecoveryRequest) {
    return http.post<Auth.VerifyRecoveryResponse>(ENDPOINTS.verifyRecovery, p).then((r) => r.data);
  }
  changePassword(p: Auth.ChangePasswordRequest) {
    return http.post<Auth.ChangePasswordResponse>(ENDPOINTS.changePassword, p).then((r) => r.data);
  }
  getAuthOptions() {
    return http.get<Auth.AuthOptionsResponse>(ENDPOINTS.getAuthOptions).then((r) => r.data);
  }
}

/* ============ CONTRACTORS ============ */
export class ContractorApi implements IContractorRepository {
  getContractors(q?: Contractors.ContractorQuery) {
    return http
      .get<Contractors.ContractorItem[]>(ENDPOINTS.getContractors, { params: q })
      .then((r) => r.data);
  }
}

/* ============ LISTS ============ */
export class ListApi implements IListRepository {
  getListValues(q?: Lists.ListValuesQuery) {
    return http
      .get<Lists.ListValueItem[]>(ENDPOINTS.getListValues, { params: q })
      .then((r) => r.data);
  }
}

/* ============ PARAMS ============ */
export class ParamsApi implements IParamsRepository {
  getSystemParameters() {
    return http
      .get<Params.GetSystemParamsResponse>(ENDPOINTS.getSystemParameters)
      .then((r) => r.data);
  }
  updateSystemParameters(p: Params.UpdateSystemParamsRequest) {
    return http
      .put<Params.UpdateSystemParamsResponse>(ENDPOINTS.updateSystemParameters, p)
      .then((r) => r.data);
  }
}

/* ============ PROFILES ============ */
export class ProfileApi implements IProfileRepository {
  createProfile(p: Profiles.CreateProfileRequest) {
    return http
      .post<Profiles.CreateProfileResponse>(ENDPOINTS.createProfile, p)
      .then((r) => r.data);
  }
  updateProfile(p: Profiles.UpdateProfileRequest) {
    return http
      .put<Profiles.UpdateProfileResponse>(`${ENDPOINTS.updateProfile}/${p.id}`, p)
      .then((r) => r.data);
  }
  deleteProfile(id: number) {
    return http
      .delete<Profiles.DeleteProfileResponse>(`${ENDPOINTS.deleteProfile}/${id}`)
      .then((r) => r.data);
  }
  getProfileById(id: number) {
    return http
      .get<Profiles.ProfileByIdResponse>(`${ENDPOINTS.getProfileById}/${id}`)
      .then((r) => r.data);
  }
  getProfilesPaginated(q?: Profiles.ProfilesPaginatedQuery) {
    return http
      .get<Profiles.ProfilesPaginatedResponse>(ENDPOINTS.profilesPaginated, { params: q })
      .then((r) => r.data);
  }
  getProfiles(q?: Profiles.GetProfilesQuery) {
    return http
      .get<Profiles.GetProfilesResponse>(ENDPOINTS.getProfiles, { params: q })
      .then((r) => r.data);
  }
  getAccessOptions() {
    return http
      .get<Profiles.GetAccessOptionsResponse>(ENDPOINTS.getAccessOptions)
      .then((r) => r.data);
  }
}

/* ============ USERS ============ */
export class UserApi implements IUserRepository {
  createUser(p: Users.CreateUserRequest) {
    return http.post<Users.CreateUserResponse>(ENDPOINTS.createUser, p).then((r) => r.data);
  }
  updateUser(p: Users.UpdateUserRequest) {
    return http
      .put<Users.UpdateUserResponse>(`${ENDPOINTS.updateUser}/${p.id}`, p)
      .then((r) => r.data);
  }
  deleteUser(id: number) {
    return http
      .delete<Users.DeleteUserResponse>(`${ENDPOINTS.deleteUser}/${id}`)
      .then((r) => r.data);
  }
  getUserById(id: number) {
    return http.get<Users.UserByIdResponse>(`${ENDPOINTS.getUserById}/${id}`).then((r) => r.data);
  }
  getUsersPaginated(q?: Users.UsersQuery) {
    return http
      .get<Users.UsersPagedResponse>(ENDPOINTS.getUsersPaginated, { params: q })
      .then((r) => r.data);
  }
  getUsersAutocomplete(q?: Users.UsersAutocompleteQuery) {
    return http
      .get<Users.UsersAutocompleteResponse>(ENDPOINTS.getUsersAutocomplete, { params: q })
      .then((r) => r.data);
  }
}
