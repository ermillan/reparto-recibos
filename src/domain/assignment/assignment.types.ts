export interface FiltersAssignmentQuery {
  uid: number;
  idContratista?: number;
  periodo?: string;
  distrito?: string;
  porcion?: string;
}

export interface FiltersAssignmentResult {
  periodos: string[];
  distritos: string[];
  provincias: string[];
  porciones: string[];
  contratistas: string[];
}

export interface AssignmentsQuery {
  uid: number;
  idContratista?: number;
  periodo?: string;
  distrito?: string;
  provincia?: string;
  porcion?: string;
  contratista?: string;
  page?: number;
  pageSize?: number;
}

export interface AssignmentItem {
  id: number;
  codigo: string;
  direccion: string;
  distrito: string;
  estado: string;
}

export interface PagedResult<T> {
  [x: string]: number;
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
