import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { login, logout } from "@/store/slices/authSlice";
import type { LoginResponse } from "@/domain/auth/auth.types";

export function useAuth() {
  const dispatch: AppDispatch = useDispatch();
  const { token, user, mustChangePassword } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = Boolean(token);

  // Mantengo el nombre original: requiredChanguePass
  const requiredChanguePass = Boolean(mustChangePassword);

  const loginUser = (data: LoginResponse) => {
    // Deriva el flag si no lo manejas aún en tu backend/slice
    const derivedMustChange = (data as any)?.code === "PASSWORD_CHANGE_REQUIRED" ? true : false;

    dispatch(
      login({
        token: data.access_token,
        user: data.usuario,
        // Si tu slice admite este campo, lo pasas:
        mustChangePassword: derivedMustChange,
      })
    );
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
    requiredChanguePass,
  };
}
