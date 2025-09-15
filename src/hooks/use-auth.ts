import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { login, logout } from "@/store/slices/authSlice";
import type { LoginResponse } from "@/domain/auth/auth.types";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function useAuth() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { token, user, mustChangePassword } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = Boolean(token);
  const requiredChanguePass = Boolean(mustChangePassword);

  const isTokenExpired = useCallback(() => {
    if (!token) return true;
    const decoded = decodeJwt(token);
    if (!decoded?.exp) return true;

    const now = Math.floor(Date.now() / 1000); // segundos
    return decoded.exp < now;
  }, [token]);

  const logoutUser = useCallback(() => {
    dispatch(logout());
    sessionStorage.removeItem("mustChangePassword");
    sessionStorage.removeItem("resetToken");
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("⏱ Revisando token a:", new Date().toLocaleTimeString());

      if (token && isTokenExpired()) {
        console.warn("⚠️ Token expirado, cerrando sesión...");
        logoutUser();
        navigate("/login");
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [token, isTokenExpired, logoutUser, navigate]);

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
      sessionStorage.setItem("mustChangePassword", "true");
      sessionStorage.setItem("resetToken", data.access_token);
    } else {
      sessionStorage.removeItem("mustChangePassword");
      sessionStorage.removeItem("resetToken");
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    loginUser,
    logoutUser,
    requiredChanguePass,
    isTokenExpired,
  };
}
