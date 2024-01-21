import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";

import { Adventure } from "./adventures.model";
import { IUser } from "../users/users.interface";
import Booking from "../bookings/bookings.model";

const getAdventures = async () => {
  try {
    const adventures = await Adventure.find();
    return adventures;
  } catch (error) {
    throw error;
  }
};

const getAdventureById = async (id: string) => {
  try {
    const adventure = await Adventure.findById(id)
      .populate({
        path: "guides",
        select: "-phoneNumber -googleId -isActive -__v -createdAt -updatedAt",
      })
      .populate("packages");

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    return adventure;
  } catch (error) {
    throw error;
  }
};

const createAdventure = async ({
  title,
  description,
  location,
  imageUrl,
  imageAlt,
  images,
}: {
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  images: {
    url: string;
    position: number;
  }[];
}) => {
  try {
    const adventure = await Adventure.create({
      title,
      description,
      location,
      imageUrl,
      imageAlt,
      images,
    });

    return adventure;
  } catch (error) {
    throw error;
  }
};

const deleteAdventure = async (id: string) => {
  try {
    const adventure = await Adventure.findByIdAndDelete(id);

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    return adventure;
  } catch (error) {
    throw error;
  }
};

const updateAdventure = async ({
  id,
  title,
  description,
  location,
  imageUrl,
  imageAlt,
  images,
}: {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  images: {
    url: string;
    position: number;
  }[];
}) => {
  try {
    const adventure = await Adventure.findByIdAndUpdate(
      id,
      {
        title,
        description,
        location,
        imageUrl,
        imageAlt,
        images,
      },
      { new: true }
    );

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    return adventure;
  } catch (error) {
    throw error;
  }
};

const enrollGuideToAdventure = async ({
  id,
  user,
}: {
  id: string;
  user: IUser;
}) => {
  try {
    const adventure = await Adventure.findById(id);

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    const isGuideAlreadyEnrolled = adventure.guides.some(
      (guide) => guide._id.toString() === user._id.toString()
    );

    if (isGuideAlreadyEnrolled) {
      throw new CustomError(errorMessages.GUIDE_ALREADY_ENROLLED, 409);
    }

    adventure.guides.push(user);
    await adventure.save();

    return adventure;
  } catch (error) {
    throw error;
  }
};

const unenrollGuideFromAdventure = async ({
  id,
  user,
}: {
  id: string;
  user: IUser;
}) => {
  try {
    const adventure = await Adventure.findById(id);

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    const isGuideAlreadyEnrolled = adventure.guides.some(
      (guide) => guide._id.toString() === user._id.toString()
    );

    if (!isGuideAlreadyEnrolled) {
      throw new CustomError(errorMessages.GUIDE_NOT_ENROLLED, 409);
    }

    adventure.guides = adventure.guides.filter(
      (guide) => guide._id.toString() !== user._id.toString()
    );
    await adventure.save();

    return adventure;
  } catch (error) {
    throw error;
  }
};

const fetchAvailableGuides = async ({
  adventureId,
  startDate,
}: {
  adventureId: string;
  startDate: string;
}) => {
  try {
    const adventure = await Adventure.findOne({
      _id: adventureId,
    }).populate({
      path: "guides",
      select:
        "-phoneNumber -googleId -isActive -__v -createdAt -updatedAt -roles",
    });

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    const bookings = await Booking.find({
      adventure: adventureId,
      status: {
        $in: ["CONFIRMED"],
      },
    });

    let availableGuides: Object[] = [];

    adventure.guides.filter((guide) => {
      const isGuideAvailable = bookings.some((booking) => {
        return (
          booking.guide.toString() === guide._id.toString() &&
          new Date(startDate) >= booking.startDate &&
          new Date(startDate) <= booking.endDate
        );
      });

      availableGuides.push({
        ...guide.toObject(),
        isAvailable: !isGuideAvailable,
      });
    });

    return availableGuides;
  } catch (error) {
    throw error;
  }
};

export {
  getAdventures,
  getAdventureById,
  createAdventure,
  deleteAdventure,
  updateAdventure,
  enrollGuideToAdventure,
  unenrollGuideFromAdventure,
  fetchAvailableGuides,
};
