// ================== Interfaces ==================
export interface ReceiptItem {
  id: number;
  periodo: string;
  ciclo: string | null;
  idContratista: number | null;
  estado: string;
  fechaInicioSLA: string | null; // ISO date string
  fechaFinSLA: string | null; // ISO date string
  fechaCreacion: string; // ISO date string
  motivoAnulacion: string | null;
  ciclos: string | null;
  contratistas: string | null;
}

export interface ReceiptMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ReceiptResponse {
  items: ReceiptItem[];
  meta: ReceiptMeta;
}
