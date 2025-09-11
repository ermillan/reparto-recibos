import { Route } from "react-router-dom";
import GuestGuard from "./middlewares/GuestGuard";
import { ROUTES } from "./routes";
import ChangePasswordPage from "../pages/Auth/ChangePasswordPage";
import LoginPage from "../pages/Auth/LoginPage";

export const PublicRoutes = (
  <>
    <Route
      path={ROUTES.PUBLIC.LOGIN}
      element={
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      }
    />
    <Route path={ROUTES.PUBLIC.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
  </>
);
