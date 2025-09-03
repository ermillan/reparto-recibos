import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import {
  Home,
  Shield,
  Users,
  FileStack,
  Upload,
  LogOut,
  ChevronRight,
  UserSquare2,
  Building2,
} from "lucide-react";

import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Separator } from "@radix-ui/react-separator";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="sidebar-gradient text-white">
      <SidebarHeader className="py-5">
        <div className="flex items-center gap-3">
          {/* Icono siempre visible */}
          <div className="shrink-0 h-8 w-8 rounded-lg bg-white/20 grid place-items-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>

          {/* Bloque de textos: se oculta solo cuando el sidebar está colapsado */}
          <div className="min-w-0 group-data-[state=collapsed]/sidebar:hidden">
            <div className="font-semibold leading-tight text-wrap">
              Sistema de entrega de recibos
            </div>
            <div className="text-xs opacity-85 truncate">Supervisor calidda</div>
            <div className="text-xs opacity-85 truncate">Matto Choque Javier</div>
          </div>

          {/* Acción/indicador (solo cuando está expandido) */}
          <button
            className="ml-auto text-white/80 hover:text-white transition
                     group-data-[state=collapsed]/sidebar:hidden"
            aria-label="Más opciones"
          >
            {/* <ChevronDown className="h-4 w-4" /> */}
          </button>
        </div>
      </SidebarHeader>

      <Separator orientation="horizontal" className="mx-2 h-[1px] bg-white" />

      <SidebarContent>
        {/* Plataforma / navegación */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/90">Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/seguridad">
                    <Shield className="h-4 w-4" />
                    <span>Seguridad</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/seguridad/perfiles" className="pl-6">
                    <Users className="h-4 w-4" />
                    <span>Perfiles</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenu>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:gap-0 bg-white/20 hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white/50 hover:cursor-pointer">
                        <Shield className="h-4 w-4" />
                        <span>Seguridad</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem >
                          <SidebarMenuSubButton asChild >
                            <NavLink to="/seguridad/perfiles">
                              <Users className="h-4 w-4" />
                              <span>Perfiles</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/seguridad/usuarios">
                              <UserSquare2 className="h-3.5 w-3.5" />
                              <span>Contratistas y otros</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/gestion-recibos">
                    <FileStack className="h-4 w-4" />
                    <span>Gestión de Recibos</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/gestion-recibos/carga" className="pl-6">
                    <Upload className="h-4 w-4" />
                    <span>Carga de Recibos</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent focus-visible:ring-0">
              <Button
                variant="destructive"
                aria-label="Cerrar sesión"
                className="transition-colors ease-in-out duration-300 bg-white text-gray-700 hover:bg-red-400 hover:text-white
            w-full flex items-center justify-center
            group-data-[state=collapsed]/sidebar:w-8
            group-data-[state=collapsed]/sidebar:h-8
            group-data-[state=collapsed]/sidebar:px-0
            group-data-[state=collapsed]/sidebar:gap-2
          "
              >
                <LogOut className="h-4 w-4" />
                <span className="group-data-[state=collapsed]/sidebar:hidden">Cerrar sesión</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
