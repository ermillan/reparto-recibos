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
import { NavLink, useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Upload,
  LogOut,
  ChevronRight,
  UserSquare2,
  Building2,
  FileText,
} from "lucide-react";

import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Separator } from "@radix-ui/react-separator";
import { useAuth } from "@/hooks/use-auth";
import { GetAuthOptions } from "@/application/auth";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { AuthApi } from "@/infrastructure/services/recibos.api";
import { normalizePath } from "@/lib/utils/path-utils";

// 📝 Tipos para el menú
interface AuthMenuItem {
  id: string;
  name: string;
  to: string;
  sub?: AuthMenuItem[];
}

interface AuthOptionsResponse {
  menu: AuthMenuItem[];
}

const authRepo = new AuthApi();
const getAuthOptions = new GetAuthOptions(authRepo);

// Mapeo de iconos según nombre
const iconMap: Record<string, JSX.Element> = {
  Seguridad: <Shield className="h-4 w-4" />,
  Usuarios: <Users className="h-4 w-4" />,
  "Parámetros del sistema": <UserSquare2 className="h-4 w-4" />,
  "Gestión de Recibos": <FileText className="h-4 w-4" />,
  Perfiles: <Users className="h-4 w-4" />,
  "Carga de Recibos": <Upload className="h-4 w-4" />,
};

export function AppSidebar() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [data, setData] = useState<AuthOptionsResponse | null>(null);

  useEffect(() => {
    (async () => {
      const response = await getAuthOptions.exec();
      setData(response as unknown as AuthOptionsResponse);
    })();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="sidebar-gradient text-white">
      {/* Header */}
      <SidebarHeader className="py-5">
        <div className="flex items-center gap-3">
          <div className="shrink-0 h-8 w-8 rounded-lg bg-white/20 grid place-items-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 group-data-[state=collapsed]/sidebar:hidden">
            <div className="font-semibold leading-tight text-wrap">
              Sistema de entrega de recibos
            </div>
            <div className="text-xs opacity-85 truncate">{user?.login}</div>
            <div className="text-xs opacity-85 truncate">{user?.nombre}</div>
          </div>
        </div>
      </SidebarHeader>

      <Separator orientation="horizontal" className="mx-2 h-[1px] bg-white" />

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/90">Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data?.menu?.map((item) =>
                item.sub && item.sub.length > 0 ? (
                  <Collapsible key={item.id} defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {iconMap[item.name] ?? <Shield className="h-4 w-4" />}
                          <span>{item.name}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.sub.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton asChild>
                                <NavLink to={normalizePath(item.to, subItem.to)}>
                                  {iconMap[subItem.name] ?? <Users className="h-4 w-4" />}
                                  <span>{subItem.name}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <NavLink to={normalizePath(item.to)}>
                        {iconMap[item.name] ?? <FileText className="h-4 w-4" />}
                        <span>{item.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent focus-visible:ring-0">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="transition-colors ease-in-out duration-300 bg-white text-gray-700 hover:bg-red-400 hover:text-white w-full flex items-center justify-center"
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
