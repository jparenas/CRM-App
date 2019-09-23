import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLResolveInfo
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { Pagination, SortInputType } from "./common";
import { GraphQLContext } from "../context/context";
import { mapAttributes } from "../util/attributes";
import { createPaginatedRequest } from "../util/request";
import { PAGINATION_ARGS } from "../util/consts";

export const ContactInputType = new GraphQLInputObjectType({
  name: "ContactInput",
  fields: {
    first_name: {
      type: GraphQLString
    },
    last_name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    }
  }
});

export const ContactAttributes = new Map<string, string[]>([
  ["full_name", ["first_name", "last_name"]]
]);

export const ContactType = new GraphQLObjectType({
  name: "Contact",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    first_name: {
      type: GraphQLString
    },
    last_name: {
      type: GraphQLString
    },
    full_name: {
      type: GraphQLString,
      resolve(parentValue) {
        return parentValue.first_name + " " + parentValue.last_name;
      }
    },
    email: {
      type: GraphQLString
    },
    created_at: {
      type: GraphQLDateTime
    },
    updated_at: {
      type: GraphQLDateTime
    }
  }
});

export const ContactListType = new GraphQLObjectType({
  name: "ContactList",
  fields: {
    contacts: {
      type: new GraphQLList(ContactType),
      args: PAGINATION_ARGS,
      resolve(
        parentValue,
        args,
        context: GraphQLContext,
        info: GraphQLResolveInfo
      ) {
        return context.dataService.contactsService.allContacts({
          user: context.request.user as Express.User,
          fields: mapAttributes(info, ContactAttributes),
          pagination: createPaginatedRequest(args, ContactAttributes),
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
        return context.dataService.contactsService.numberOfContacts(
          parentValue._filter
        );
      }
    }
  }
});
