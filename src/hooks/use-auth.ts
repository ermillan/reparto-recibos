import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { login, logout } from "@/store/slices/authSlice";
import type { LoginResponse } from "@/domain/auth/auth.types";

export function useAuth() {
  const dispatch: AppDispatch = useDispatch();
  const { token, user, mustChangePassword } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = Boolean(token);
  const requiredChanguePass = Boolean(mustChangePassword);

  const loginUser = (data: LoginResponse) => {
    const derivedMustChange = data.code === "PASSWORD_CHANGE_REQUIRED";

    dispatch(
      login({
        token: data.access_token,
        user: data.usuario,
        mustChangePassword: derivedMustChange,
      })
    );

    if (derivedMustChange) {
      // 🔑 usamos el access_token como resetToken
      sessionStorage.setItem("mustChangePassword", "true");
      sessionStorage.setItem("resetToken", data.access_token);
    } else {
      sessionStorage.removeItem("mustChangePassword");
      sessionStorage.removeItem("resetToken");
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    sessionStorage.removeItem("mustChangePassword");
    sessionStorage.removeItem("resetToken");
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
