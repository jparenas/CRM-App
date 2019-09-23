import { GraphQLSchema } from "graphql";
import { RootQuery } from "../query/query";
import { MutationRootQuery } from "../mutation/mutation";
import { ISchema } from "../types/interface";
import { injectable } from "inversify";

@injectable()
export class Schema implements ISchema {
  private _rootQuery: RootQuery;
  private _mutationRootQuery: MutationRootQuery;

  constructor(rootQuery: RootQuery, mutationRootQuery: MutationRootQuery) {
    this._rootQuery = rootQuery;
    this._mutationRootQuery = mutationRootQuery;
  }

  graphQLSchema() {
    return new GraphQLSchema({
      query: this._rootQuery.graphQLType(),
      mutation: this._mutationRootQuery.graphQLType()
    });
  }
}
