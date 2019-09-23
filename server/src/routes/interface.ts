import { RequestHandler } from "express";

export interface IRouteConfig {
  isInitialized: boolean;

  root: string;

  initialize(): void;

  handler(): RequestHandler;
}
