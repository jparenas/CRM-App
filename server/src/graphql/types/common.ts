import { Id, PaginationSortItem } from "@c/types/common";
import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull
} from "graphql";

declare global {
  namespace Express {
    interface User {}

    interface Request {
      user?: User;
    }
  }
}

export interface Pagination {
  first?: number;
  after?: number;
  sort?: PaginationSortItem[];
}

export interface DataRequest {
  user: Express.User;
  fields?: string[];
}

export interface PaginatedDataRequest extends DataRequest {
  pagination?: Pagination;
  filter?: string | null;
}

export interface SpecificDataRequest extends DataRequest {
  id: Id;
}

export interface CreateRequest<T> extends DataRequest {
  data: T;
}

export interface UpdateRequest<T> extends DataRequest {
  id: Id;
  data: T;
}

export const SortInputType = new GraphQLInputObjectType({
  name: "SortInputType",
  fields: {
    sortBy: {
      type: new GraphQLNonNull(GraphQLString)
    },
    descending: {
      type: GraphQLBoolean
    }
  }
});
