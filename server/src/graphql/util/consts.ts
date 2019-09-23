import { GraphQLInt, GraphQLList } from "graphql";

import { SortInputType } from "../types/common";

export const PAGINATION_ARGS = {
  first: { type: GraphQLInt },
  after: { type: GraphQLInt },
  sort: { type: new GraphQLList(SortInputType) }
};
