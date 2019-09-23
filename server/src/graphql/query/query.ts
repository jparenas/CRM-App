import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLResolveInfo,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString
} from "graphql";
import {
  ContactType,
  ContactListType,
  ContactAttributes
} from "../types/contact";
import { GraphQLContext } from "@s/graphql/context/context";
import { mapAttributes } from "../util/attributes";
import { IType } from "../types/interface";
import { injectable } from "inversify";
import { Pagination } from "../types/common";
import { ProjectType, ProjectListType } from "../types/project";
import { StageType, StageListType } from "../types/stage";

@injectable()
export class RootQuery implements IType {
  graphQLType(): GraphQLObjectType {
    return new GraphQLObjectType({
      name: "QueryType",
      fields: () => ({
        contacts: {
          type: ContactListType,
          args: { filter: { type: GraphQLString } },
          resolve(_, args) {
            return { _filter: args.filter };
          }
        },
        contact: {
          type: ContactType,
          args: { id: { type: GraphQLNonNull(GraphQLID) } },
          resolve(
            parentValue,
            args,
            context: GraphQLContext,
            info: GraphQLResolveInfo
          ) {
            return context.dataLoader.contact({
              user: context.request.user as Express.User,
              id: args.id,
              fields: mapAttributes(info, ContactAttributes)
            });
          }
        },
        projects: {
          type: ProjectListType,
          args: { filter: { type: GraphQLString } },
          resolve(_, args) {
            return { _filter: args.filter };
          }
        },
        project: {
          type: ProjectType,
          args: { id: { type: GraphQLNonNull(GraphQLID) } },
          resolve(
            parentValue,
            args,
            context: GraphQLContext,
            info: GraphQLResolveInfo
          ) {
            return context.dataLoader.project({
              user: context.request.user as Express.User,
              id: args.id,
              fields: mapAttributes(info)
            });
          }
        },
        stages: {
          type: StageListType,
          resolve() {
            return {};
          }
        },
        stage: {
          type: StageType,
          args: { id: { type: GraphQLNonNull(GraphQLID) } },
          resolve(
            parentValue,
            args,
            context: GraphQLContext,
            info: GraphQLResolveInfo
          ) {
            return context.dataLoader.stage({
              user: context.request.user as Express.User,
              id: args.id,
              fields: mapAttributes(info)
            });
          }
        }
      })
    });
  }
}
