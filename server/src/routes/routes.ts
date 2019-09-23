import { injectable, inject } from "inversify";
import { Router, RequestHandler } from "express";
import { GraphQLRouter } from "./graphql/graphql";
import { IRouteConfig } from "./interface";
import { LoginRouter } from "./auth/login";

@injectable()
export class RootRoute implements IRouteConfig {
  private _router: Router;
  private _graphQlRouter: GraphQLRouter;
  private _loginRouter: LoginRouter;

  public isInitialized = false;

  public root = "/";

  public constructor(graphQlRouter: GraphQLRouter, loginRouter: LoginRouter) {
    this._router = Router();
    this._graphQlRouter = graphQlRouter;
    this._loginRouter = loginRouter;
  }

  private _addToRouter(routeConfig: IRouteConfig) {
    this._router.use(routeConfig.root, routeConfig.handler());
  }

  public initialize(): void {
    this._addToRouter(this._graphQlRouter);
    this._addToRouter(this._loginRouter);

    this.isInitialized = true;
  }

  public handler(): RequestHandler {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this._router;
  }
}
