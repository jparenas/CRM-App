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
import { Project } from "@c/types/project";
import { addPagination } from "@s/graphql/util/queries";

@injectable()
export class ProjectsService {
  private _database: knex;

  constructor(@inject(TYPES.knex) knex: knex) {
    this._database = knex;
  }

  allProjects = async (request: PaginatedDataRequest): Promise<(Project)[]> => {
    if (request.fields) {
      request.fields.push("contact_id");
      request.fields.push("stage_id");
    } else {
      request.fields = ["*"];
    }
    var query = this._database<Project>(tables.projects).select(
      ...request.fields
    );
    if (request.pagination !== undefined) {
      addPagination(query, request.pagination);
    }
    if (request.filter) {
      query.whereRaw("CONCAT(name) ILIKE ?", [`%${request.filter}%`]);
    }
    return await query;
  };

  numberOfProjects = async (): Promise<number> => {
    var count = (await this._database(tables.projects).count("*", {
      as: "count"
    }))[0]["count"];
    return intVal(count);
  };

  project = async (
    requests: SpecificDataRequest[]
  ): Promise<(Project | undefined)[]> => {
    var fields = new Set<string>();

    requests.forEach(request => {
      if (request.fields) {
        request.fields.forEach(field => fields.add(field));
      }
    });

    if (fields.size == 0) {
      fields.add("*");
    } else {
      fields.add("id");
      fields.add("contact_id");
      fields.add("stage_id");
    }

    var idsRequested = requests.map(request => Number(request.id));

    var rows: Project[] = await this._database<Project, Project>(
      tables.projects
    )
      .select(Array.from(fields))
      .whereIn("id", idsRequested);

    return mapIdsToRows(requests, rows);
  };

  createProject = async (request: CreateRequest<Project>): Promise<Project> => {
    var fields = new Set<string>(["id"]);
    if (request.fields) {
      request.fields.forEach(field => fields.add(field));
    }

    delete request.data.id;
    var query = this._database<Project>(tables.projects)
      .insert(request.data)
      .returning(Array.from(fields));
    return (await query.then(rows => rows[0])) as Project;
  };

  updateProject = async (request: UpdateRequest<Project>): Promise<Project> => {
    var fields = new Set<string>(["id"]);
    if (request.fields) {
      request.fields.forEach(field => fields.add(field));
    }

    if (request.data.id) {
      delete request.data.id;
    }

    if (!(request.data as any).contact_id) {
      (request.data as any).contact_id = null;
    }
    var query = this._database<Project, Project>(tables.projects)
      .where("id", request.id)
      .update(request.data)
      .returning(Array.from(fields));
    return (await query.then(rows => rows[0])) as Project;
  };

  deleteProject = async (request: SpecificDataRequest): Promise<boolean> => {
    var query = this._database<Project>(tables.projects)
      .where("id", request.id)
      .del();
    await query;
    return true;
  };
}
