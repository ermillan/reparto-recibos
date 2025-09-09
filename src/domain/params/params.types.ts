export interface SystemParams {
  radioGpsMetros: number;
  slaEntregaHoras: number;
  rowVer?: string | null;
}
export type GetSystemParamsResponse = SystemParams;
export type UpdateSystemParamsRequest = SystemParams;
export type UpdateSystemParamsResponse = void;
