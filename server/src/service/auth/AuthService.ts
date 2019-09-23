import { injectable, inject } from "inversify";
import TYPES from "@s/dependencies/types";
import knex from "knex";
import { tables } from "@s/db/definitions/tables";
import { verify } from "@s/auth/util";
import { UserSession, User } from "@s/graphql/types/user";
import { RolesService } from "../roles/RolesService";

export enum VERIFICATION_STATUS {
  SUCCESSFUL,
  RENEW_PASSWORD,
  UNSUCCESSFUL
}

@injectable()
export class AuthService {
  private _database: knex;
  private _rolesService: RolesService;

  public constructor(
    @inject(TYPES.knex) knex: knex,
    rolesService: RolesService
  ) {
    this._database = knex;
    this._rolesService = rolesService;
  }

  public async verifyPassword(
    email: string,
    password: string
  ): Promise<VERIFICATION_STATUS> {
    var user = await this._database<User>(tables.users)
      .select("email", "password")
      .where({
        email: email
      });
    if (user.length == 1) {
      if (user[0].password && (await verify(password, user[0].password))) {
        return VERIFICATION_STATUS.SUCCESSFUL;
      }
    }
    return VERIFICATION_STATUS.UNSUCCESSFUL;
  }

  public async getSession(email: string): Promise<UserSession> {
    return {
      email: email,
      admin: await this._rolesService.isAdmin(email)
    };
  }
}
