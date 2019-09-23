import { injectable, inject } from "inversify";
import TYPES from "@s/dependencies/types";
import knex from "knex";
import { tables, junctionTable } from "@s/db/definitions/tables";

@injectable()
export class RolesService {
  private _database: knex;

  public constructor(@inject(TYPES.knex) knex: knex) {
    this._database = knex;
  }

  public async getRoles(email: string): Promise<any> {
    return true;
  }

  public async isAdmin(email: string): Promise<boolean> {
    var query = this._database
      .select(tables.roles + ".admin")
      .from(tables.roles)
      .innerJoin(
        junctionTable(tables.roles, tables.users),
        tables.roles + ".id",
        junctionTable(tables.roles, tables.users) + ".role_id"
      )
      .innerJoin(
        tables.users,
        tables.users + ".id",
        junctionTable(tables.roles, tables.users) + ".user_id"
      )
      .where(tables.users + ".email", email);
    var rows = await query;

    return rows.some(row => row.admin);
  }
}
