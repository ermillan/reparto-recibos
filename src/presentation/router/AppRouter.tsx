import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoutes } from "./public-routes";
import { PrivateRoutes } from "./private-routes";
import { ROUTES } from "./routes";

export default function AppRouter() {
  return (
    <Routes>
      {PublicRoutes}
      {PrivateRoutes}

      {/* Fallback */}
      <Route path={ROUTES.FALLBACK} element={<Navigate to={ROUTES.PUBLIC.LOGIN} replace />} />
    </Routes>
  );
}
