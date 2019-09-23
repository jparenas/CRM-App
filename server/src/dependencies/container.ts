import { Container } from "inversify";
import TYPES from "./types";

import { IDataService } from "@s/service/IDataService";
import { PgDataService } from "@s/service/PgDataService";
import { IDataLoader } from "@s/service/IDataLoader";
import { ServiceDataLoader } from "@s/service/ServiceDataLoader";

import { IRouteConfig } from "@s/routes/interface";
import { RootRoute } from "@s/routes/routes";
import { GraphQLRouter } from "@s/routes/graphql/graphql";
import { ISchema } from "@s/graphql/types/interface";
import { Schema } from "@s/graphql/schema/schema";
import { RootQuery } from "@s/graphql/query/query";
import knex from "knex";
import { MutationRootQuery } from "@s/graphql/mutation/mutation";
import { ContactsService } from "@s/service/contacts/ContactsService";
import { LoginRouter } from "@s/routes/auth/login";
import { AuthService } from "@s/service/auth/AuthService";
import { RolesService } from "@s/service/roles/RolesService";
import { ProjectsService } from "@s/service/projects/ProjectsService";
import { StagesService } from "@s/service/stages/StagesService";

const config = require("@s/remote/knexfile.js");

const container = new Container();

// Interface bindings

container
  .bind<IDataService>(TYPES.IDataService)
  .to(PgDataService)
  .inSingletonScope();
container
  .bind<IDataLoader>(TYPES.IDataLoader)
  .to(ServiceDataLoader)
  .inSingletonScope();
container.bind<ISchema>(TYPES.ISchema).to(Schema);

container.bind<IRouteConfig>(TYPES.IRouteConfig).to(RootRoute);

// Class bindings

container.bind<ContactsService>(ContactsService).toSelf();
container.bind<ProjectsService>(ProjectsService).toSelf();
container.bind<StagesService>(StagesService).toSelf();
container.bind<AuthService>(AuthService).toSelf();
container.bind<RolesService>(RolesService).toSelf();

container.bind<GraphQLRouter>(GraphQLRouter).toSelf();
container.bind<LoginRouter>(LoginRouter).toSelf();
container.bind<RootQuery>(RootQuery).toSelf();
container.bind<MutationRootQuery>(MutationRootQuery).toSelf();

// Provider Bindings

container.bind<knex>(TYPES.knex).toConstantValue(knex(config));

export default container;
