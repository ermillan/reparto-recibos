import { type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ENV } from "@/infrastructure/env/config";

export default function GuestGuard({ children }: PropsWithChildren) {
  const token = Cookies.get(ENV.TOKEN_COOKIE);
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
