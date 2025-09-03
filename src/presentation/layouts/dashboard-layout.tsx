import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen w-full">
        {/* Header del contenido */}
        <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b">
          <div className="flex h-14 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {/* <Separator orientation="vertical" className="mx-2 h-6" /> */}
            <h1 className="text-base sm:text-lg font-semibold">
              Consulta de Perfiles
            </h1>
          </div>
        </header>

        {/* Contenido de las rutas hijas */}
        <div className="p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
