import type { IContractorRepository } from "@/domain/contractors/contractor.port";
import type { ContractorItem, ContractorQuery } from "@/domain/contractors/contractor.type";

export class GetContractors {
  private repo: IContractorRepository;
  constructor(repo: IContractorRepository) {
    this.repo = repo;
  }
  exec(query?: ContractorQuery): Promise<ContractorItem[]> {
    return this.repo.getContractors(query);
  }
}
