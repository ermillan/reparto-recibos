export interface ListValuesQuery {
  idLista?: number;
  nombreLista?: string;
  activo?: boolean;
}
export interface ListValueItem {
  id: number;
  valorTexto?: string | null;
  activo: boolean;
  orden?: number | null;
  idLista: number;
  nombreLista?: string | null;
}
