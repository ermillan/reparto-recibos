import type { Contratista } from "./contractor.type";

export interface ContractorRepository {
  getContractor(): Promise<Contratista[]>;
}
