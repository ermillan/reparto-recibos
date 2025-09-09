import type { IParamsRepository } from "@/domain/params/params.port";
import type {
  GetSystemParamsResponse,
  UpdateSystemParamsRequest,
  UpdateSystemParamsResponse,
} from "@/domain/params/params.types";

export class GetSystemParameters {
  private repo: IParamsRepository;
  constructor(repo: IParamsRepository) {
    this.repo = repo;
  }
  exec(): Promise<GetSystemParamsResponse> {
    return this.repo.getSystemParameters();
  }
}
export class UpdateSystemParameters {
  private repo: IParamsRepository;
  constructor(repo: IParamsRepository) {
    this.repo = repo;
  }
  exec(payload: UpdateSystemParamsRequest): Promise<UpdateSystemParamsResponse> {
    return this.repo.updateSystemParameters(payload);
  }
}
