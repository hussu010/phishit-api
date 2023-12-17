import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import User from "../../users/users.model";

import { errorMessages } from "../config/messages";
import { CustomError } from "../interfaces/common";

const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    const payload: any = jwt.verify(
      // TODO: add type to payload
      accessToken as string,
      process.env.JWT_SECRET_KEY as string,
      (err: any, decoded: unknown) => {
        if (err) {
          throw new CustomError(err.message, 401);
        }
        return decoded;
      }
    );

    if (payload.type != "ACCESS") {
      throw new CustomError(errorMessages.INVALID_JWT_TYPE, 401);
    }

    const user = await User.findById(payload._id);
    if (!user) {
      throw new CustomError(
        errorMessages.USER_ASSOCIATED_WITH_JWT_NOT_FOUND,
        401
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const hasRole = (role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.roles.some((r) => role.includes(r))) {
        throw new CustomError(errorMessages.FORBIDDEN, 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export { isAuthorized, hasRole };
