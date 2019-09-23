import { Router, RequestHandler } from "express";
import expressGraphQl from "express-graphql";
import { GraphQLContext } from "@s/graphql/context/context";
import { injectable, inject } from "inversify";
import { IRouteConfig } from "../interface";
import TYPES from "@s/dependencies/types";
import { IDataService } from "@s/service/IDataService";
import { ISchema } from "@s/graphql/types/interface";
import { IDataLoader } from "@s/service/IDataLoader";
import { authenticate } from "../util";

const isProduction = process.env.NODE_ENV === "production";

@injectable()
export class GraphQLRouter implements IRouteConfig {
  private _router: Router;
  private _dataService: IDataService;
  private _dataLoader: IDataLoader;
  private _schema: ISchema;

  public isInitialized = false;

  public root = "/graphql";

  public constructor(
    @inject(TYPES.IDataService) dataService: IDataService,
    @inject(TYPES.IDataLoader) dataLoader: IDataLoader,
    @inject(TYPES.ISchema) schema: ISchema
  ) {
    this._router = Router();
    this._dataService = dataService;
    this._dataLoader = dataLoader;
    this._schema = schema;
  }

  public initialize(): void {
    if (!isProduction) {
      this._router.use(
        "/noAuth",
        expressGraphQl(req => ({
          schema: this._schema.graphQLSchema(),
          graphiql: true,
          context: <GraphQLContext>{
            request: req,
            dataService: this._dataService,
            dataLoader: this._dataLoader
          }
        }))
      );
    }

    this._router.use(
      "/",
      authenticate,
      expressGraphQl(req => ({
        schema: this._schema.graphQLSchema(),
        graphiql: !isProduction,
        context: <GraphQLContext>{
          request: req,
          dataService: this._dataService,
          dataLoader: this._dataLoader
        }
      }))
    );

    this.isInitialized = true;
  }

  public handler(): RequestHandler {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this._router;
  }
}
