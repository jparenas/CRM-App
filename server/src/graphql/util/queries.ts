import knex from "knex";
import { Pagination } from "../types/common";

export function addPagination(
  query: knex.QueryBuilder,
  pagination: Pagination
) {
  if (pagination.first) {
    query.limit(pagination.first);
    if (pagination.after !== undefined) {
      query.offset(pagination.after);
    }
  }
  if (pagination.sort) {
    query.orderBy(
      pagination.sort.map((sort): { column: string; order: string } => {
        return { column: sort.sortBy, order: sort.descending ? "desc" : "asc" };
      })
    );
  }
}
