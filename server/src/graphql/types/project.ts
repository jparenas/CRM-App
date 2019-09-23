import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLResolveInfo,
  GraphQLList,
  GraphQLInt
} from "graphql";
import { GraphQLContext } from "@s/graphql/context/context";
import { ContactType, ContactAttributes } from "./contact";
import { mapAttributes } from "../util/attributes";
import { StageType } from "./stage";
import { GraphQLDateTime } from "graphql-iso-date";
import { createPaginatedRequest } from "../util/request";
import { PAGINATION_ARGS } from "../util/consts";

export const ProjectInputType = new GraphQLInputObjectType({
  name: "ProjectInput",
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    stage_id: {
      type: GraphQLID
    },
    contact_id: {
      type: GraphQLID
    }
  }
});

export const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    stage: {
      type: StageType,
      resolve(
        parentValue,
        args,
        context: GraphQLContext,
        info: GraphQLResolveInfo
      ) {
        if (parentValue.stage_id) {
          return context.dataLoader.stage({
            user: context.request.user as Express.User,
            id: parentValue.stage_id
          });
        } else {
          return null;
        }
      }
    },
    contact: {
      type: ContactType,
      resolve(
        parentValue,
        args,
        context: GraphQLContext,
        info: GraphQLResolveInfo
      ) {
        if (parentValue.contact_id) {
          return context.dataLoader.contact({
            user: context.request.user as Express.User,
            id: parentValue.contact_id,
            fields: mapAttributes(info, ContactAttributes)
          });
        } else {
          return null;
        }
      }
    },
    created_at: {
      type: GraphQLDateTime
    },
    updated_at: {
      type: GraphQLDateTime
    }
  }
});

export const ProjectListType = new GraphQLObjectType({
  name: "ProjectList",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      args: PAGINATION_ARGS,
      resolve(
        parentValue,
        args,
        context: GraphQLContext,
        info: GraphQLResolveInfo
      ) {
        var pagination = createPaginatedRequest(args);
        return context.dataService.projectsService.allProjects({
          user: context.request.user as Express.User,
          fields: mapAttributes(info),
          pagination: pagination,
          filter: parentValue._filter
        });
      }
    },
    totalCount: {
      type: GraphQLInt,
      resolve(
        parentValue: any,
        args: any,
        context: GraphQLContext,
        info: GraphQLResolveInfo
      ) {
        return context.dataService.projectsService.numberOfProjects();
      }
    }
  }
});
