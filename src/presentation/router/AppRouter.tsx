import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/presentation/pages/Login";
import Dashboard from "@/presentation/pages/Dashboard";
import GuestGuard from "@/presentation/router/middlewares/GuestGuard";
import DashboardLayout from "@/presentation/layouts/dashboard-layout"

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
        <Route path="/seguridad" element={<div>Seguridad</div>} />
        <Route path="/seguridad/perfiles" element={<div>Perfiles</div>} />
        <Route path="/contratistas" element={<div>Contratistas</div>} />
        <Route path="/gestion-recibos" element={<div>Gestión de Recibos</div>} />
        <Route path="/gestion-recibos/carga" element={<div>Carga de Recibos</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
