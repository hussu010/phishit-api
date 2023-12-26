import { NextFunction, Request, Response } from "express";
import { createBooking } from "./bookings.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adventureId, packageId, guideId, startDate, noOfPeople } = req.body;
    const user = req.user!;

    const booking = await createBooking({
      adventureId,
      packageId,
      guideId,
      startDate,
      user,
      noOfPeople,
    });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export { create };
