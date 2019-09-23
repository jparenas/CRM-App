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
import { Contact } from "@c/types/contact";
import { addPagination } from "@s/graphql/util/queries";

@injectable()
export class ContactsService {
  private _database: knex;

  constructor(@inject(TYPES.knex) knex: knex) {
    this._database = knex;
  }

  private _filter = (query: knex.QueryBuilder, filter: string) => {
    query.whereRaw("CONCAT(first_name, ' ', last_name) ILIKE ?", [
      `%${filter}%`
    ]);
  };

  allContacts = async (request: PaginatedDataRequest): Promise<(Contact)[]> => {
    if (!request.fields) {
      request.fields = ["*"];
    }
    var query = this._database<Contact>(tables.contacts).select(
      ...request.fields
    );
    if (request.pagination) {
      addPagination(query, request.pagination);
    }
    if (request.filter) {
      this._filter(query, request.filter);
    }
    return await query;
  };

  numberOfContacts = async (filter: string | null): Promise<number> => {
    var query = this._database(tables.contacts).count("*", {
      as: "count"
    });
    if (filter) {
      this._filter(query, filter);
    }
    var count = (await query)[0]["count"];
    return intVal(count);
  };

  contacts = async (
    requests: SpecificDataRequest[]
  ): Promise<(Contact | undefined)[]> => {
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
    }

    var idsRequested = requests.map(request => Number(request.id));

    var rows: Contact[] = await this._database<Contact, Contact>(
      tables.contacts
    )
      .select(Array.from(fields))
      .whereIn("id", idsRequested);

    console.log(
      this._database<Contact, Contact>(tables.contacts)
        .select(Array.from(fields))
        .whereIn("id", idsRequested)
        .toQuery()
    );

    return mapIdsToRows(requests, rows);
  };

  createContact = async (request: CreateRequest<Contact>): Promise<Contact> => {
    var fields = new Set<string>(["id"]);
    if (request.fields) {
      request.fields.forEach(field => fields.add(field));
    }

    delete request.data.id;
    var query = this._database<Contact>(tables.contacts)
      .insert(request.data)
      .returning(Array.from(fields));
    return (await query.then(rows => rows[0])) as Contact;
  };

  updateContact = async (request: UpdateRequest<Contact>): Promise<Contact> => {
    var fields = new Set<string>(["id"]);
    if (request.fields) {
      request.fields.forEach(field => fields.add(field));
    }
    if (request.data.id) {
      delete request.data.id;
    }
    var query = this._database<Contact, Contact>(tables.contacts)
      .where("id", request.id)
      .update(request.data)
      .returning(Array.from(fields));
    return (await query.then(rows => rows[0])) as Contact;
  };

  deleteContact = async (request: SpecificDataRequest): Promise<boolean> => {
    var query = this._database<Contact>(tables.contacts)
      .where("id", request.id)
      .del();
    await query;
    return true;
  };
}
