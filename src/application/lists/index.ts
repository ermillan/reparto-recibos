import type { IListRepository } from "@/domain/lists/list.port";
import type { ListValuesQuery, ListValueItem } from "@/domain/lists/list.types";

export class GetListValues {
  private repo: IListRepository;
  constructor(repo: IListRepository) {
    this.repo = repo;
  }
  exec(query?: ListValuesQuery): Promise<ListValueItem[]> {
    return this.repo.getListValues(query);
  }
}
