import { NextFunction, Request, Response } from "express";

import { getAllInteractions } from "./backoffice.service";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limitQuery = req.query.limit as string;
    const offsetQuery = req.query.offset as string;

    const { interactions, total, count, limit, offset } =
      await getAllInteractions({ limitQuery, offsetQuery });

    res.status(200).json({
      data: interactions,
      total,
      count,
      limit,
      offset,
    });
  } catch (error) {
    next(error);
  }
};

export { getAll };
