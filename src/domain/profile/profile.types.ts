// Item (perfil)
export interface ProfileItem {
  id: number;
  codigo: string; // ej. "REP001     " (puede venir con espacios)
  nombre: string; // ej. "Repartidor"
  descripcion: string; // ej. "Acceso para entrega de recibos"
  peso: number; // prioridad/orden
  activo: boolean; // true/false
  estado: "Activo" | "Inactivo";
}

// Metadatos de paginación
export interface Meta {
  page: number;
  pageSize: number;
  total: number;
}

// Respuesta completa
export interface ProfilesResponse {
  items: ProfileItem[];
  meta: Meta;
}

// Query de listado (filtros + paginado)
export interface GetProfilesQuery {
  activo?: boolean; // opcional: si lo omites, trae todos
  nombre?: string; // búsqueda por nombre (contiene)
  page: number; // 1-based
  size: number; // tamaño de página
}

// Cada item de menú
export interface ProfileMenuItem {
  id: number;
  to: string;
  name: string;
  icon: string | null;
  check: boolean;
  sub: ProfileMenuItem[]; // recursivo
}

// Raíz de la respuesta
export interface ProfileMenuResponse {
  menu: ProfileMenuItem[];
}

export interface ProfileMenuItem {
  id: number;
  to: string;
  name: string;
  icon: string | null;
  check: boolean;
  sub: ProfileMenuItem[];
}

export interface ProfileMenuResponse {
  menu: ProfileMenuItem[];
}

// DTO para crear
export interface CreateProfileDto {
  nombre: string;
  descripcion: string;
  activo: boolean;
  opcionIds: number[];
}
