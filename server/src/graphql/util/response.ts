import { SpecificDataRequest } from "../types/common";
import { Row } from "@c/types/common";

export function mapIdsToRows<T extends Row>(
  requests: SpecificDataRequest[],
  rows: T[]
): (T | undefined)[] {
  var idsRequested = requests.map(request => Number(request.id));

  var idToRow = new Map<number, T>();
  rows.forEach(row => idToRow.set(Number(row.id), row));

  return idsRequested.map(id => idToRow.get(id));
}
