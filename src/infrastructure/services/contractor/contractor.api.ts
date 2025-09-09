import { http } from "@/infrastructure/http/httpClient";
import { ENDPOINTS } from "@/infrastructure/http/endpoints";
import type { ContractorRepository } from "@/domain/contractor/contractor.repository";
import type { Contratista } from "@/domain/contractor/contractor.type";

export class ContractorApi implements ContractorRepository {
  async getContractor(): Promise<Contratista[]> {
    const { data } = await http.get<Contratista[]>(ENDPOINTS.getContractors);
    return data;
  }
}
