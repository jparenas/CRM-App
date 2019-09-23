import { Router, RequestHandler } from "express";
import { injectable, inject } from "inversify";
import { IRouteConfig } from "../interface";
import TYPES from "@s/dependencies/types";
import { IDataService } from "@s/service/IDataService";
import express from "express";
import { AuthService, VERIFICATION_STATUS } from "@s/service/auth/AuthService";
import { jwtCookieName, jwtSecret } from "@s/util/consts";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

@injectable()
export class LoginRouter implements IRouteConfig {
  private _router: Router;
  private _authService: AuthService;

  public isInitialized = false;

  public root = "/auth/login";

  public constructor(authService: AuthService) {
    this._router = Router();
    this._authService = authService;
  }

  public initialize(): void {
    this._router.post(
      "/",
      async (req: express.Request, res: express.Response) => {
        var email = req.body.email;
        var password = req.body.password;

        if (email === undefined || password === undefined) {
          res.json({
            error: "No user/password supplied"
          });
          return;
        }

        var status = await this._authService.verifyPassword(email, password);

        switch (status) {
          case VERIFICATION_STATUS.RENEW_PASSWORD:
          case VERIFICATION_STATUS.SUCCESSFUL: {
            var session = await this._authService.getSession(email);
            var token = jwt.sign(session, jwtSecret);
            res.cookie(jwtCookieName, token, {
              signed: false
            });
            if (status === VERIFICATION_STATUS.RENEW_PASSWORD) {
              res.json({
                successful: true,
                url: "/settings/change_password"
              });
            } else {
              res.json({
                successful: true
              });
            }
            break;
          }
          case VERIFICATION_STATUS.UNSUCCESSFUL: {
            res.json({
              error: "Wrong user/password"
            });
            break;
          }
        }
      }
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
