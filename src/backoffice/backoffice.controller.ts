import { NextFunction, Request, Response } from "express";

import { fetchAllInteractions, fetchAllBookings } from "./backoffice.service";

const getAllInteractions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limitQuery = req.query.limit as string;
    const offsetQuery = req.query.offset as string;

    const { interactions, total, count, limit, offset } =
      await fetchAllInteractions({ limitQuery, offsetQuery });

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

const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limitQuery = req.query.limit as string;
    const offsetQuery = req.query.offset as string;
    const status = req.query.status as string;

    const { bookings, total, count, limit, offset } = await fetchAllBookings({
      limitQuery,
      offsetQuery,
      status,
    });

    res.status(200).json({
      data: bookings,
      total,
      count,
      limit,
      offset,
    });
  } catch (error) {
    next(error);
  }
};

export { getAllInteractions, getAllBookings };
