import { Request, Response, NextFunction } from "express";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    next();
  } else {
    res.redirect("/login" + req.originalUrl);
  }
}
