import { injectable, inject } from "inversify";
import TYPES from "@s/dependencies/types";
import knex from "knex";
import { tables } from "@s/db/definitions/tables";

export enum PERMISSION {
  ENABLED,
  DISABLED
}

const DB_TO_PERMISSION = new Map<boolean, PERMISSION>([
  [true, PERMISSION.ENABLED],
  [false, PERMISSION.DISABLED]
]);

@injectable()
export class PermissionService {
  private _database: knex;

  public constructor(@inject(TYPES.knex) knex: knex) {
    this._database = knex;
  }

  public async getPermissions(email: string): Promise<Map<string, PERMISSION>> {
    return new Map<string, PERMISSION>([["yo", PERMISSION.ENABLED]]);
  }

  public async getPermission(
    email: string,
    permission: string
  ): Promise<PERMISSION> {
    return PERMISSION.ENABLED;
  }

  private async _getFilteredPermissions(
    email: string,
    filters: string[]
  ): Promise<any> {
    var query = this._database().select("Roles.");
  }
}
