import { Pagination } from "../types/common";
import { PaginationSortItem } from "@c/types/common";

export function createPaginatedRequest(
  args: any,
  replaceAttributes: Map<string, string[]> = new Map<string, string[]>()
): Pagination {
  var pagination: Pagination = {};
  if (args.first) {
    pagination = { first: args.first };
    if (args.after) {
      pagination.after = args.after;
    }
  }
  if (args.sort) {
    var replacedSortOptions: PaginationSortItem[] = [];
    args.sort.forEach((sort: PaginationSortItem) => {
      var replacements = replaceAttributes.get(sort.sortBy);
      if (replacements) {
        replacements.forEach(column => {
          replacedSortOptions.push({
            sortBy: column,
            descending: sort.descending
          });
        });
      } else {
        replacedSortOptions.push(sort);
      }
    });
    pagination.sort = replacedSortOptions.map(
      (sort: PaginationSortItem): PaginationSortItem => {
        return {
          sortBy: sort.sortBy,
          descending: sort.descending
        };
      }
    );
  }

  if (!pagination.sort || pagination.sort.length == 0) {
    pagination.sort = [{ sortBy: "id", descending: false }];
  }
  return pagination;
}
