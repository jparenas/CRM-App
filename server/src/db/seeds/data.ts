import * as Knex from "knex";
import faker from "faker";
import { User } from "@s/graphql/types/user";
import { tables, junctionTable } from "../definitions/tables";
import { hash } from "@s/auth/util";
import { Contact } from "@c/types/contact";

var OWNER_ACCESS_ID = 3;
var USER_ID = 1;
var ADMIN_ID = 2;

export async function seed(knex: Knex): Promise<any> {
  await Promise.all([
    knex(tables.users).del(),
    knex(tables.contacts).del(),
    knex(tables.projects).del(),
    knex(junctionTable(tables.users, tables.contacts)).del(),
    knex(junctionTable(tables.users, tables.projects)).del(),
    knex(junctionTable(tables.users, tables.roles)).del()
  ]);

  for (var i = 1; i <= 20; i++) {
    await knex<Contact>(tables.contacts).insert({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email()
    });
  }

  for (var i2 = 1; i2 <= 10; i2++) {
    await knex(tables.projects).insert({
      name: faker.company.companyName(),
      contact_id: i2 * 2,
      stage_id: faker.random.number({ min: 1, max: 4 })
    });
  }

  var admin: Partial<User> = {
    email: "admin@example.com",
    password: await hash("admin"),
    first_name: "Admin",
    last_name: "Admin"
  };

  await knex<User>(tables.users).insert(admin);
  admin.id = (await knex(tables.users)
    .select("id")
    .where({ first_name: "Admin" }))[0]["id"];
  await knex(junctionTable(tables.users, tables.roles)).insert({
    user_id: admin.id,
    role_id: ADMIN_ID
  });

  for (var i3 = 1; i3 <= 10; i3++) {
    await knex(junctionTable(tables.users, tables.contacts)).insert({
      user_id: admin.id,
      contact_id: i3,
      access_id: OWNER_ACCESS_ID
    });
  }
  for (var i4 = 1; i4 <= 5; i4++) {
    await knex(junctionTable(tables.users, tables.projects)).insert({
      user_id: admin.id,
      project_id: i4,
      access_id: OWNER_ACCESS_ID
    });
  }

  var user: Partial<User> = {
    email: "user@example.com",
    password: await hash("user"),
    first_name: "User",
    last_name: "User"
  };

  await knex<User>(tables.users).insert(user);
  user.id = (await knex(tables.users)
    .select("id")
    .where({ first_name: "User" }))[0]["id"];
  await knex(junctionTable(tables.users, tables.roles)).insert({
    user_id: user.id,
    role_id: USER_ID
  });

  for (var i5 = 11; i5 <= 20; i5++) {
    await knex(junctionTable(tables.users, tables.contacts)).insert({
      user_id: user.id,
      contact_id: i5,
      access_id: OWNER_ACCESS_ID
    });
  }
  for (var i6 = 6; i6 <= 10; i6++) {
    await knex(junctionTable(tables.users, tables.projects)).insert({
      user_id: user.id,
      project_id: i6,
      access_id: OWNER_ACCESS_ID
    });
  }
}
