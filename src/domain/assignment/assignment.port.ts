import type {
  FiltersAssignmentQuery,
  FiltersAssignmentResult,
  AssignmentsQuery,
  AssignmentItem,
  PagedResult,
} from "./assignment.types";

export interface IAssignmentRepository {
  getFilters(query: FiltersAssignmentQuery): Promise<FiltersAssignmentResult>;
  getAssignmentsPaginated(query: AssignmentsQuery): Promise<PagedResult<AssignmentItem>>;
}
