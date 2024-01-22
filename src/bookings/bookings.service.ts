import Booking from "./bookings.model";
import { Adventure } from "../adventures/adventures.model";
import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";
import { IUser } from "../users/users.interface";
import {
  initiateKhaltiPaymentRequest,
  lookupKhaltiPayment,
} from "./bookings.utils";

const getBookingsByUser = async (user: IUser) => {
  try {
    const bookings = await Booking.find({
      $or: [{ customer: user._id }, { guide: user._id }],
    })
      .populate({
        path: "guide",
        select: "-phoneNumber -googleId -isActive -__v -createdAt -updatedAt",
      })
      .populate({
        path: "customer",
        select: "-phoneNumber -googleId -isActive -__v -createdAt -updatedAt",
      });

    return bookings;
  } catch (error) {
    throw error;
  }
};

const getBookingById = async (id: string) => {
  try {
    const booking = await Booking.findOne({ _id: id })
      .populate({
        path: "guide",
        select: "-phoneNumber -googleId -isActive -__v -createdAt -updatedAt",
      })
      .populate({
        path: "customer",
        select: "-phoneNumber -googleId -isActive -__v -createdAt -updatedAt",
      });

    if (!booking) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    return booking;
  } catch (error) {
    throw error;
  }
};

const createBooking = async ({
  user,
  adventureId,
  packageId,
  guideId,
  startDate,
  noOfPeople,
}: {
  user: IUser;
  adventureId: string;
  packageId: string;
  guideId: string;
  startDate: string;
  noOfPeople: number;
}) => {
  try {
    const adventure = await Adventure.findOne({
      _id: adventureId,
      packages: packageId,
      guides: guideId,
    }).populate("packages");

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    const adventurePackage = adventure.packages.find(
      (packageItem) => packageItem._id.toString() === packageId
    );

    const endDate = new Date(
      new Date(startDate).setDate(
        new Date(startDate).getDate() + adventurePackage!.duration
      )
    );

    const isGuideAvailable = await Booking.findOne({
      guide: guideId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
      status: {
        $in: ["CONFIRMED"],
      },
    });

    if (isGuideAvailable) {
      throw new CustomError(errorMessages.GUIDE_NOT_AVAILABLE, 409);
    }

    const booking = await Booking.create({
      adventure: adventureId,
      package: adventurePackage,
      guide: guideId,
      startDate,
      endDate,
      customer: user._id,
      noOfPeople,
    });

    return booking;
  } catch (error) {
    throw error;
  }
};

const initiatePaymentRequest = async ({
  bookingId,
  method,
  redirectUrl,
}: {
  bookingId: string;
  method: string;
  redirectUrl: string;
}) => {
  try {
    const booking = await Booking.findOne({ _id: bookingId }).populate(
      "adventure"
    );

    if (!booking) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    if (
      booking.status === "CONFIRMED" ||
      booking.status === "COMPLETED" ||
      booking.status === "CANCELLED"
    ) {
      throw new CustomError(errorMessages.BOOKING_ALREADY_PROCESSED, 409);
    }

    if (
      method === "KHALTI" &&
      (booking.status === "NEW" ||
        (booking.status === "PENDING" &&
          booking.payment?.expiresAt < new Date()))
    ) {
      const khaltiPaymentRequest = await initiateKhaltiPaymentRequest({
        booking,
        redirectUrl,
      });

      booking.payment = {
        amount: booking.package.price * 100,
        method: "KHALTI",
        pidx: khaltiPaymentRequest.pidx,
        paymentUrl: khaltiPaymentRequest.paymentUrl,
        expiresAt: khaltiPaymentRequest.expiresAt,
        status: "PENDING",
      };
      booking.status = "PENDING";
      await booking.save();

      return khaltiPaymentRequest;
    } else {
      return {
        pidx: booking.payment?.pidx,
        paymentUrl: booking.payment?.paymentUrl,
        expiresAt: booking.payment?.expiresAt,
      };
    }
  } catch (error) {
    throw error;
  }
};

const verifyPaymentRequest = async ({ bookingId }: { bookingId: string }) => {
  try {
    const booking = await Booking.findOne({ _id: bookingId });

    if (!booking) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    if (booking.status !== "PENDING") {
      throw new CustomError(errorMessages.BOOKING_ALREADY_PROCESSED, 409);
    }

    if (booking.payment?.method === "KHALTI") {
      const khaltiPayment = await lookupKhaltiPayment({
        pidx: booking.payment.pidx,
      });

      if (khaltiPayment.status === "Completed") {
        booking.payment.status = "COMPLETED";
        booking.status = "CONFIRMED";
        await booking.save();
        return booking;
      } else if (
        khaltiPayment.status === "Initiated" ||
        khaltiPayment.status === "Pending"
      ) {
        throw new CustomError(errorMessages.PAYMENT_PENDING, 202);
      } else {
        booking.payment.status = "FAILED";
        booking.status = "CANCELLED";
        await booking.save();

        throw new CustomError(errorMessages.PAYMENT_FAILED, 422);
      }
    } else {
      throw new CustomError(errorMessages.INVALID_PAYMENT_METHOD, 400);
    }
  } catch (error) {
    throw error;
  }
};

export {
  createBooking,
  getBookingsByUser,
  initiatePaymentRequest,
  verifyPaymentRequest,
  getBookingById,
};
