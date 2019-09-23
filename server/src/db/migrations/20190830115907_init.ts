import * as Knex from "knex";
import { tables, junctionTable, tableField } from "../definitions/tables";
import { ON_UPDATE_TIMESTAMP_SQL, onUpdateTrigger } from "../util";

export async function up(knex: Knex): Promise<any> {
  await knex.raw(ON_UPDATE_TIMESTAMP_SQL);

  await knex.schema
    .createTable(tables.users, t => {
      t.increments("id")
        .unsigned()
        .primary();
      t.string("first_name", 100).notNullable();
      t.string("last_name", 100).notNullable();
      t.string("email", 254)
        .notNullable()
        .unique();
      t.string("password", 128).notNullable();
      t.timestamps(true, true);
    })
    .createTable(tables.contacts, t => {
      t.increments("id")
        .unsigned()
        .primary();
      t.string("first_name", 100).notNullable();
      t.string("last_name", 100).notNullable();
      t.string("email", 254).unique();
      t.timestamps(true, true);
    })
    .createTable(tables.stages, t => {
      t.increments("id")
        .unsigned()
        .primary();
      t.string("name", 100).notNullable();
    })
    .createTable(tables.projects, t => {
      t.increments("id")
        .unsigned()
        .primary();
      t.string("name", 100).notNullable();
      t.integer("stage_id")
        .references(tableField(tables.stages, "id"))
        .onDelete("SET NULL");
      t.integer("contact_id")
        .references(tableField(tables.contacts, "id"))
        .onDelete("SET NULL");
      t.timestamps(true, true);
    })
    .createTable(tables.permissions, t => {
      t.increments("id")
        .unsigned()
        .primary();
      t.string("name")
        .notNullable()
        .unique();
      t.string("localized_name").notNullable();
      t.boolean("default_value").notNullable();
    })
    .createTable(tables.roles, t => {
      t.increments("id")
        .unsigned()
        .primary();
      t.string("name").notNullable();
      t.boolean("admin")
        .notNullable()
        .defaultTo(false);
    })
    .createTable(tables.accessType, t => {
      t.increments("id")
        .unsigned()
        .primary();
      t.string("name")
        .notNullable()
        .unique();
    })
    .createTable(junctionTable(tables.users, tables.contacts), t => {
      t.integer("user_id")
        .notNullable()
        .references(tableField(tables.users, "id"))
        .onDelete("CASCADE");
      t.integer("contact_id")
        .notNullable()
        .references(tableField(tables.contacts, "id"))
        .onDelete("CASCADE");
      t.integer("access_id")
        .notNullable()
        .references(tableField(tables.accessType, "id"))
        .onDelete("CASCADE")
        .defaultTo(1);
      t.primary(["user_id", "contact_id"]);
    })
    .createTable(junctionTable(tables.users, tables.projects), t => {
      t.integer("user_id")
        .notNullable()
        .references(tableField(tables.users, "id"))
        .onDelete("CASCADE");
      t.integer("project_id")
        .notNullable()
        .references(tableField(tables.projects, "id"))
        .onDelete("CASCADE");
      t.integer("access_id")
        .notNullable()
        .references(tableField(tables.accessType, "id"))
        .onDelete("CASCADE")
        .defaultTo(1);
      t.primary(["user_id", "project_id"]);
    })
    .createTable(junctionTable(tables.users, tables.roles), t => {
      t.integer("user_id")
        .notNullable()
        .references(tableField(tables.users, "id"))
        .onDelete("CASCADE")
        .primary();
      t.integer("role_id")
        .notNullable()
        .references(tableField(tables.roles, "id"))
        .onDelete("CASCADE");
    })
    .createTable(junctionTable(tables.roles, tables.permissions), t => {
      t.integer("role_id")
        .notNullable()
        .references(tableField(tables.roles, "id"))
        .onDelete("CASCADE");
      t.integer("permission_id")
        .notNullable()
        .references(tableField(tables.permissions, "id"))
        .onDelete("CASCADE");
      t.boolean("value").notNullable();
      t.primary(["role_id", "permission_id"]);
    });

  await Promise.all([
    knex.raw(onUpdateTrigger(tables.users)),
    knex.raw(onUpdateTrigger(tables.contacts)),
    knex.raw(onUpdateTrigger(tables.projects))
  ]);

  return Promise.all([
    knex(tables.accessType).insert([
      { name: "Read" },
      { name: "Write" },
      { name: "Owner" }
    ]),
    knex(tables.roles).insert([
      { name: "User" },
      { name: "Admin", admin: true }
    ]),
    knex(tables.stages).insert([
      { name: "Initiating" },
      { name: "Planning" },
      { name: "Executing" },
      { name: "Closed" }
    ])
  ]);
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTable(junctionTable(tables.users, tables.contacts))
    .dropTable(junctionTable(tables.users, tables.roles))
    .dropTable(junctionTable(tables.users, tables.projects))
    .dropTable(junctionTable(tables.roles, tables.permissions))
    .dropTable(tables.users)
    .dropTable(tables.permissions)
    .dropTable(tables.roles)
    .dropTable(tables.projects)
    .dropTable(tables.stages)
    .dropTable(tables.accessType)
    .dropTable(tables.contacts);
}
