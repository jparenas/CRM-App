const TYPES = {
  IDataService: Symbol.for("IDataService"),
  IDataLoader: Symbol.for("IDataLoader"),
  IRouteConfig: Symbol.for("IRouteConfig"),
  ISchema: Symbol.for("ISchema"),

  knex: Symbol.for("knex")
};

export default TYPES;
