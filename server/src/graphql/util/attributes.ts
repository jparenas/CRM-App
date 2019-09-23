import {
  GraphQLResolveInfo,
  SelectionNode,
  FieldNode,
  InlineFragmentNode
} from "graphql";
import { Pagination } from "../types/common";

export function mapAttributes(
  info: GraphQLResolveInfo,
  replaceAttributes: Map<string, string[]> = new Map<string, string[]>()
): string[] {
  var attributes = info.fieldNodes[0]
    .selectionSet!.selections.filter(
      node => (node as FieldNode).selectionSet == undefined
    )
    .map(node => (node as FieldNode).name.value)
    .filter(name => name !== "__typename");

  replaceAttributes.forEach((value, key) => {
    var index = attributes.indexOf(key);
    if (index > -1) {
      attributes.splice(index, 1);
      value.forEach(field => attributes.push(field));
    }
  });
  return attributes;
}
