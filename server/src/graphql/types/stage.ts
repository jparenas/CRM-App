import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLResolveInfo,
  GraphQLList
} from "graphql";
import { GraphQLContext } from "../context/context";
import { createPaginatedRequest } from "../util/request";
import { mapAttributes } from "../util/attributes";
import { PAGINATION_ARGS } from "../util/consts";

export const StageInputType = new GraphQLInputObjectType({
  name: "StageInput",
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const StageType = new GraphQLObjectType({
  name: "Stage",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const StageListType = new GraphQLObjectType({
  name: "StageList",
  fields: {
    stages: {
      type: new GraphQLList(StageType),
      args: PAGINATION_ARGS,
      resolve(
        parentValue,
        args,
        context: GraphQLContext,
        info: GraphQLResolveInfo
      ) {
        return context.dataService.stageService.allStages({
          user: context.request.user as Express.User,
          fields: mapAttributes(info),
          pagination: createPaginatedRequest(args)
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
        return context.dataService.stageService.numberOfStages();
      }
    }
  }
});
