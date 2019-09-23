import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLResolveInfo,
  GraphQLID,
  GraphQLBoolean
} from "graphql";
import { ContactType, ContactInputType } from "../types/contact";
import { GraphQLContext } from "@s/graphql/context/context";
import { IType } from "../types/interface";
import { injectable } from "inversify";
import { mapAttributes } from "../util/attributes";
import { ProjectType, ProjectInputType } from "../types/project";
import { StageType, StageInputType } from "../types/stage";

@injectable()
export class MutationRootQuery implements IType {
  graphQLType(): GraphQLObjectType {
    return new GraphQLObjectType({
      name: "MutationType",
      fields: {
        createContact: {
          type: ContactType,
          args: {
            input: {
              type: new GraphQLNonNull(ContactInputType)
            }
          },
          resolve(_, args, context: GraphQLContext, info: GraphQLResolveInfo) {
            return context.dataService.contactsService.createContact({
              user: context.request.user as Express.User,
              fields: mapAttributes(info),
              data: { id: -1, ...args.input }
            });
          }
        },
        updateContact: {
          type: ContactType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLID)
            },
            input: {
              type: new GraphQLNonNull(ContactInputType)
            }
          },
          resolve(_, args, context: GraphQLContext, info: GraphQLResolveInfo) {
            return context.dataService.contactsService.updateContact({
              user: context.request.user as Express.User,
              fields: mapAttributes(info),
              id: args.id,
              data: { id: args.id, ...args.input }
            });
          }
        },
        deleteContact: {
          type: GraphQLBoolean,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLID)
            }
          },
          resolve(_, args, context: GraphQLContext, info: GraphQLResolveInfo) {
            return context.dataService.contactsService.deleteContact({
              user: context.request.user as Express.User,
              id: args.id
            });
          }
        },
        createProject: {
          type: ProjectType,
          args: {
            input: {
              type: new GraphQLNonNull(ProjectInputType)
            }
          },
          resolve(_, args, context: GraphQLContext, info: GraphQLResolveInfo) {
            return context.dataService.projectsService.createProject({
              user: context.request.user as Express.User,
              fields: mapAttributes(info),
              data: { id: -1, ...args.input }
            });
          }
        },
        updateProject: {
          type: ProjectType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLID)
            },
            input: {
              type: new GraphQLNonNull(ProjectInputType)
            }
          },
          resolve(_, args, context: GraphQLContext, info: GraphQLResolveInfo) {
            return context.dataService.projectsService.updateProject({
              user: context.request.user as Express.User,
              fields: mapAttributes(info),
              id: args.id,
              data: { id: args.id, ...args.input }
            });
          }
        },
        deleteProject: {
          type: GraphQLBoolean,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLID)
            }
          },
          resolve(_, args, context: GraphQLContext, info: GraphQLResolveInfo) {
            return context.dataService.projectsService.deleteProject({
              user: context.request.user as Express.User,
              id: args.id
            });
          }
        },
        createStage: {
          type: StageType,
          args: {
            input: {
              type: new GraphQLNonNull(StageInputType)
            }
          },
          resolve(_, args, context: GraphQLContext, info: GraphQLResolveInfo) {
            return context.dataService.stageService.createStage({
              user: context.request.user as Express.User,
              fields: mapAttributes(info),
              data: { id: -1, ...args.input }
            });
          }
        },
        updateStage: {
          type: StageType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLID)
            },
            input: {
              type: new GraphQLNonNull(StageInputType)
            }
          },
          resolve(_, args, context: GraphQLContext, info: GraphQLResolveInfo) {
            return context.dataService.stageService.updateStage({
              user: context.request.user as Express.User,
              fields: mapAttributes(info),
              id: args.id,
              data: { id: args.id, ...args.input }
            });
          }
        },
        deleteStage: {
          type: GraphQLBoolean,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLID)
            }
          },
          resolve(_, args, context: GraphQLContext, info: GraphQLResolveInfo) {
            return context.dataService.stageService.deleteStage({
              user: context.request.user as Express.User,
              id: args.id
            });
          }
        }
      }
    });
  }
}
