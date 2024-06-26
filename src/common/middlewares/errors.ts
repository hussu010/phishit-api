import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

import winston from "../config/winston";

const errorLogger: ErrorRequestHandler = (err, req, res, next) => {
  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  next(err);
};

const errorResponder: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
};

const haltOnTimedout = (req: Request, res: Response, next: NextFunction) => {
  if (!req.timedout) next();
};

export { errorLogger, errorResponder, haltOnTimedout };
