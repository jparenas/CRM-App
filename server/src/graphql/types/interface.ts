import { GraphQLObjectType, GraphQLSchema } from "graphql";

export interface IType {
  graphQLType(): GraphQLObjectType;
}

export interface ISchema {
  graphQLSchema(): GraphQLSchema;
}
