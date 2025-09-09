import type { ListValueItem, ListValuesQuery } from "./list.types";

export interface IListRepository {
  getListValues(query?: ListValuesQuery): Promise<ListValueItem[]>;
}
