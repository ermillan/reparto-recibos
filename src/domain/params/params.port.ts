import type {
  GetSystemParamsResponse,
  UpdateSystemParamsRequest,
  UpdateSystemParamsResponse,
} from "./params.types";

export interface IParamsRepository {
  getSystemParameters(): Promise<GetSystemParamsResponse>;
  updateSystemParameters(payload: UpdateSystemParamsRequest): Promise<UpdateSystemParamsResponse>;
}
