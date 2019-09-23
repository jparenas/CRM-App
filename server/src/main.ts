import { config } from "dotenv";
config();

import "module-alias/register";
import "reflect-metadata";

import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import webpack from "webpack";
import middleware from "webpack-dev-middleware";
import hotReload from "webpack-hot-middleware";
import container from "./dependencies/container";
import TYPES from "./dependencies/types";
import { IRouteConfig } from "./routes/interface";
import cookieParser from "cookie-parser";
import jwt from "express-jwt";
import { cookiesSecret, jwtSecret, jwtCookieName } from "./util/consts";
import { HttpException } from "./exceptions/HttpException";

const webpackConfig = require("@vue/cli-service/webpack.config.js");
const compiler = webpack(webpackConfig);

const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.use(compression());
app.use(morgan("combined"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cookiesSecret));

app.use(
  jwt({
    secret: jwtSecret,
    credentialsRequired: false,
    getToken: (req): string | null => {
      if (req.cookies[jwtCookieName] != undefined) {
        return req.cookies[jwtCookieName];
      } else {
        return null;
      }
    }
  })
);

app.use(
  (
    err: HttpException,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.name === "UnauthorizedError" && !req.originalUrl.match(/noAuth$/)) {
      res.clearCookie(jwtCookieName);
      res.redirect("/login");
    } else {
      next();
    }
  }
);

app.use((req, res, next) => {
  console.log(req.user);
  next();
});

if (isProduction) {
  app.use(express.static(path.resolve(__dirname, "../public")));
} else {
  app.use(
    express.static(path.resolve(__dirname, "../public"), {
      index: false
    })
  );
}

app.use((req, res, next) => {
  if (
    (req.originalUrl == "/" || req.originalUrl == "") &&
    req.user != undefined
  ) {
    res.redirect("/dashboard");
  } else {
    next();
  }
});

app.use(container.get<IRouteConfig>(TYPES.IRouteConfig).handler());

if (!isProduction) {
  var webpackMiddleware = middleware(compiler, {
    publicPath: "/"
  });
  app.use(webpackMiddleware);
  app.use(hotReload(compiler));
  app.use("*", function(req, res, next) {
    var filename = path.join(compiler.outputPath, "index.html");
    webpackMiddleware.waitUntilValid(() => {
      webpackMiddleware.fileSystem.readFile(filename, function(err, result) {
        if (err) {
          return next(err);
        }
        res.set("content-type", "text/html");
        res.send(result);
        res.end();
      });
    });
  });
} else {
  app.get("*", function(req: express.Request, res: express.Response) {
    res.sendFile(path.resolve(__dirname, "../public/index.html"));
  });
}

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
