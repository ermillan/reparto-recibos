import { type PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { ENV } from "@/infrastructure/env/config";

export default function AuthGuard({ children }: PropsWithChildren) {
  const location = useLocation();
  const token = Cookies.get(ENV.TOKEN_COOKIE);

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}