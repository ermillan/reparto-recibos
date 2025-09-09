export type UsersQuery = {
  Page: number; // 1-based
  Size: number; // page size
  Texto?: string; // puede ser "" (vacío) si quieres Texto=
  Login?: string; // idem
  Codigo?: string;
  Nombre?: string;
  NumeroDocumento?: string;
  Activo?: boolean; // por defecto true si no se envía
  IdPerfil?: number;
  IdContratista?: number;
  SortBy?: string; // campo de orden
  Desc?: boolean; // true -> descendente
};

export type UserItem = {
  id: number;
  codigo: string;
  login: string;
  nombreCompleto: string;
  email: string;
  numeroDocumento: string;
  idTipoDocumento: number;
  activo: boolean;
  bloqueado: boolean;
  primeraVez: boolean;
};

export type UsersResponse = {
  items: UserItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
};
