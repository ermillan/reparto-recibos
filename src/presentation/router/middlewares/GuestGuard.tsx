import { type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function GuestGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, requiredChanguePass } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  if (requiredChanguePass) {
    return <Navigate to="/cambiar-contrasena" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
