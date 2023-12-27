import Booking from "./bookings.model";
import { Adventure } from "../adventures/adventures.model";
import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";
import { IUser } from "../users/users.interface";

const getBookingsByUser = async (user: IUser) => {
  try {
    const bookings = await Booking.find({
      $or: [{ customer: user._id }, { guide: user._id }],
    })
      .populate("package")
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
      package: packageId,
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

export { createBooking, getBookingsByUser };
