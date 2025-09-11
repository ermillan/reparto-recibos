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
    const derivedMustChange = (data as any)?.code === "PASSWORD_CHANGE_REQUIRED";

    dispatch(
      login({
        token: data.access_token,
        user: data.usuario,
        mustChangePassword: derivedMustChange,
      })
    );

    if (derivedMustChange) {
      // 🔑 Guardamos el access_token como resetToken
      sessionStorage.setItem("mustChangePassword", "true");
      sessionStorage.setItem("resetToken", data.access_token);
    } else {
      sessionStorage.removeItem("mustChangePassword");
      sessionStorage.removeItem("resetToken");
    }
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
