import type { ReceiptResponse } from "../archives/archive.types";

export interface IReceiptRepository {
  validateReceipts(periodo: string, file: File): Promise<any>;

  getReceiptsPaginated(query?: { page?: number; pageSize?: number }): Promise<ReceiptResponse>;

  confirmReceipts(loteId: number, fechaInicioSlaUtc: string): Promise<any>;

  cancelReceipt(loteId: number, motivo: string): Promise<any>;
}
