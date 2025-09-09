import type { ContractorRepository } from "@/domain/contractor/contractor.repository";
import type { Contratista } from "@/domain/contractor/contractor.type";

export class GetContractors {
  private repo: ContractorRepository;

  constructor(repo: ContractorRepository) {
    this.repo = repo;
  }

  async execute(): Promise<Contratista[]> {
    return this.repo.getContractor();
  }
}
