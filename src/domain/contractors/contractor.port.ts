import type { ContractorItem, ContractorQuery } from "./contractor.type";

export interface IContractorRepository {
  getContractors(query?: ContractorQuery): Promise<ContractorItem[]>;
}
