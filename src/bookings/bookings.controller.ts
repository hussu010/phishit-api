import { NextFunction, Request, Response } from "express";
import {
  createBooking,
  getBookingsByUser,
  initiatePaymentRequest,
  verifyPaymentRequest,
} from "./bookings.service";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const bookings = await getBookingsByUser(user);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

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

const initiatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { method, redirectUrl } = req.body;
    const payment = await initiatePaymentRequest({
      bookingId: id,
      method,
      redirectUrl,
    });
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const booking = await verifyPaymentRequest({ bookingId: id });
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export { create, getAll, initiatePayment, verifyPayment };
