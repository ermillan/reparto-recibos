import { type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function GuestGuard({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
