export type Id = string;

export interface Row {
  id: Id;
}

export type PaginationSortItem = { sortBy: string; descending: boolean };
