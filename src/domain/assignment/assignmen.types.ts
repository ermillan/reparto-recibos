export interface FiltersAssignmentResult {
  periodos: string[];
  distritos: string[];
  porciones: string[];
  contratistas: string[];
}

export interface AssignmentItem {
  idLote: number;
  periodo: string;
  estado: string;
  idContratista: number;
  contratista: string;
  filasValidas: number;
  filasInvalidas: number;
  filasTotal: number;
  fechaInicioSLA?: string;
  fechaFinSLA?: string;
  ciclo?: number;
  porcion?: string;
  predio?: string;
  unidadLectura?: string;
  distrito?: string;
  tipoCliente?: string;
  numeroRecibo?: string;
  repartidor: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
