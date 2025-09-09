import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { login, logout } from "@/store/slices/authSlice";
import type { LoginResponse } from "@/domain/auth/auth.types";

export function useAuth() {
  const dispatch: AppDispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = Boolean(token);

  const loginUser = (data: LoginResponse) => {
    dispatch(login({ token: data.access_token, user: data.usuario }));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    token,
    user,
    isAuthenticated,
    loginUser,
    logoutUser,
  };
}
