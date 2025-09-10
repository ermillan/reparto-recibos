import { type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function GuestGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, requiredChanguePass } = useAuth();

  // Si NO está autenticado, mostrar los children (login, register, etc.)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Si está autenticado pero debe cambiar contraseña
  if (requiredChanguePass) {
    return <Navigate to="/cambiar-contrasena" replace />;
  }

  // Si está autenticado y no debe cambiar contraseña
  return <Navigate to="/dashboard" replace />;
}
