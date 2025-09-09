import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/presentation/pages/Login";
import Dashboard from "@/presentation/pages/Dashboard";
import GuestGuard from "@/presentation/router/middlewares/GuestGuard";
import DashboardLayout from "@/presentation/layouts/dashboard-layout";
import CreateProfile from "@/presentation/pages/CreateProfile";
import ConsultContractor from "@/presentation/pages/ConsultContractor";
import CreateContractor from "@/presentation/pages/CreateContractor";
import ConsultProfiles from "@/presentation/pages/ConsultProfile";
import ReceiptUpload from "@/presentation/pages/ReceiptUpload";

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route
        path="/login"
        element={
          <GuestGuard>
            <Login />
          </GuestGuard>
        }
      />

      {/* Privadas */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/seguridad/perfiles" element={<ConsultProfiles />} />
        <Route path="/seguridad/perfiles/crear-perfil" element={<CreateProfile />} />
        <Route path="/seguridad/perfiles/actualizar-perfil/:id" element={<CreateProfile />} />

        <Route path="/seguridad/contratista" element={<ConsultContractor />} />
        <Route path="/seguridad/contratista/crear-contratista" element={<CreateContractor />} />
        <Route
          path="/seguridad/contratista/actualizar-contratista/:id"
          element={<CreateContractor />}
        />

        <Route path="/gestion-recibos/carga-recibos" element={<ReceiptUpload />} />
        <Route path="/gestion-recibos" element={<div>Gestión de Recibos</div>} />
        <Route path="/gestion-recibos/carga" element={<div>Carga de Recibos</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
