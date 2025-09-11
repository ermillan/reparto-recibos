import { Route } from "react-router-dom";
import { ROUTES } from "./routes";
import DashboardLayout from "../layouts/dashboard-layout";

import { DashboardPage } from "../pages/Dashboard";
import {
  CreateProfilePage,
  ConsultProfilesPage,
  CreateUserPage,
  ConsultUsersPage,
} from "../pages/Security";
import { ReceiptUploadPage } from "../pages/receipts";

export const PrivateRoutes = (
  <Route element={<DashboardLayout />}>
    <Route path={ROUTES.PRIVATE.DASHBOARD} element={<DashboardPage />} />

    {/* Seguridad */}
    <Route path={ROUTES.PRIVATE.SECURITY.PROFILES} element={<ConsultProfilesPage />} />
    <Route path={ROUTES.PRIVATE.SECURITY.CREATE_PROFILE} element={<CreateProfilePage />} />
    <Route path={ROUTES.PRIVATE.SECURITY.UPDATE_PROFILE} element={<CreateProfilePage />} />

    <Route path={ROUTES.PRIVATE.SECURITY.USERS} element={<ConsultUsersPage />} />
    <Route path={ROUTES.PRIVATE.SECURITY.CREATE_USER} element={<CreateUserPage />} />
    <Route path={ROUTES.PRIVATE.SECURITY.UPDATE_USER} element={<CreateUserPage />} />

    {/* Recibos */}
    <Route path={ROUTES.PRIVATE.RECEIPTS.UPLOAD} element={<ReceiptUploadPage />} />
    <Route path={ROUTES.PRIVATE.RECEIPTS.ROOT} element={<div>Gestión de Recibos</div>} />
    <Route path={ROUTES.PRIVATE.RECEIPTS.LEGACY_UPLOAD} element={<div>Carga de Recibos</div>} />
  </Route>
);
