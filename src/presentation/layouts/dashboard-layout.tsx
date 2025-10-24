import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Contenido */}
        <SidebarInset className="flex flex-col flex-1 min-h-screen overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b">
            <div className="flex h-14 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 border-none" />
              <h1 className="text-base sm:text-lg font-semibold text-center">
                Sistema de Reparto de Recibos
              </h1>
            </div>
          </header>

          {/* Contenido scrollable sin romper ancho */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
