import { injectable, inject } from "inversify";
import {
  SpecificDataRequest,
  CreateRequest,
  UpdateRequest,
  PaginatedDataRequest
} from "../../graphql/types/common";
import knex from "knex";
import TYPES from "@s/dependencies/types";
import { mapIdsToRows } from "../../graphql/util/response";
import { tables } from "@s/db/definitions/tables";

import { intVal } from "../util";
import { Stage } from "@c/types/stage";
import { addPagination } from "@s/graphql/util/queries";

@injectable()
export class StagesService {
  private _database: knex;

  constructor(@inject(TYPES.knex) knex: knex) {
    this._database = knex;
  }

  allStages = async (request: PaginatedDataRequest): Promise<(Stage)[]> => {
    if (!request.fields) {
      request.fields = ["*"];
    } else {
      request.fields.push("id");
    }
    var query = this._database<Stage>(tables.stages).select(...request.fields);
    if (request.pagination !== undefined) {
      addPagination(query, request.pagination);
    }
    return await query;
  };

  numberOfStages = async (): Promise<number> => {
    var count = (await this._database(tables.stages).count("*", {
      as: "count"
    }))[0]["count"];
    return intVal(count);
  };

  stage = async (
    requests: SpecificDataRequest[]
  ): Promise<(Stage | undefined)[]> => {
    var ids = new Set<number>(requests.map(request => Number(request.id)));

    var rows: Stage[] = await this._database(tables.stages)
      .select("*")
      .whereIn("id", Array.from(ids));

    return mapIdsToRows(requests, rows);
  };

  createStage = async (request: CreateRequest<Stage>): Promise<Stage> => {
    var fields = new Set<string>(["id"]);
    if (request.fields) {
      request.fields.forEach(field => fields.add(field));
    }

    delete request.data.id;
    var query = this._database<Stage>(tables.stages)
      .insert(request.data)
      .returning(Array.from(fields));
    return (await query.then(rows => rows[0])) as Stage;
  };

  updateStage = async (request: UpdateRequest<Stage>): Promise<Stage> => {
    var fields = new Set<string>(["id"]);
    if (request.fields) {
      request.fields.forEach(field => fields.add(field));
    }

    if (request.data.id) {
      delete request.data.id;
    }
    var query = this._database<Stage, Stage>(tables.projects)
      .where("id", request.id)
      .update(request.data)
      .returning(Array.from(fields));
    return (await query.then(rows => rows[0])) as Stage;
  };

  deleteStage = async (request: SpecificDataRequest): Promise<boolean> => {
    var query = this._database<Stage>(tables.projects)
      .where("id", request.id)
      .del();
    await query;
    return true;
  };
}
