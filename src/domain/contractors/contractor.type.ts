export interface ContractorQuery {
  Activo?: boolean;
  Nombre?: string;
}
export interface ContractorItem {
  id: number;
  nombre?: string | null;
  activo: boolean;
}
