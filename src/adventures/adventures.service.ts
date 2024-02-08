import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";

import { Adventure, Package } from "./adventures.model";
import { IUser } from "../users/users.interface";
import Booking from "../bookings/bookings.model";

import redis from "../common/config/redis-client";

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
    const cachedAdventure = await redis.get(`adventure:${id}`);

    if (cachedAdventure) {
      return JSON.parse(cachedAdventure);
    }

    const adventure = await Adventure.findById(id)
      .populate({
        path: "guides",
        select: "-phoneNumber -googleId -isActive -__v -createdAt -updatedAt",
      })
      .populate("packages")
      .lean();

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    await redis.set(`adventure:${id}`, JSON.stringify(adventure));
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

    redis.del(`adventure:${id}`);

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

    redis.del(`adventure:${id}`);

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

    redis.del(`adventure:${id}`);

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

    redis.del(`adventure:${id}`);

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
      const guideHasBookings = bookings.some((booking) => {
        return (
          booking.guide.toString() === guide._id.toString() &&
          new Date(startDate) >= booking.startDate &&
          new Date(startDate) <= booking.endDate
        );
      });

      const isGuideAvailable = !guideHasBookings && guide.isAvailable;

      availableGuides.push({
        ...guide.toObject(),
        isAvailable: isGuideAvailable,
      });
    });

    return availableGuides;
  } catch (error) {
    throw error;
  }
};

const createAdventurePackage = async ({
  adventureId,
  title,
  price,
  description,
  duration,
}: {
  adventureId: string;
  title: string;
  price: number;
  description: string;
  duration: number;
}) => {
  try {
    const adventure = await Adventure.findById(adventureId);

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    const adventurePackage = await Package.create({
      title,
      price,
      description,
      duration,
    });

    adventure.packages.push(adventurePackage);
    await adventure.save();

    redis.del(`adventure:${adventureId}`);

    return adventurePackage;
  } catch (error) {
    throw error;
  }
};

const updateAdventurePackage = async ({
  adventureId,
  packageId,
  title,
  price,
  description,
  duration,
}: {
  adventureId: string;
  packageId: string;
  title: string;
  price: number;
  description: string;
  duration: number;
}) => {
  try {
    const adventure = await Adventure.findById(adventureId);

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    const adventurePackage = await Package.findByIdAndUpdate(
      packageId,
      {
        title,
        price,
        description,
        duration,
      },
      { new: true }
    );

    if (!adventurePackage) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    redis.del(`adventure:${adventureId}`);

    return adventurePackage;
  } catch (error) {
    throw error;
  }
};

const removeAdventurePackage = async ({
  packageId,
  adventureId,
}: {
  packageId: string;
  adventureId: string;
}) => {
  try {
    const adventure = await Adventure.findById(adventureId);

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    const adventurePackage = await Package.findByIdAndDelete(packageId);

    if (!adventurePackage) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    adventure.packages = adventure.packages.filter(
      (packageItem) => packageItem.toString() !== packageId
    );
    await adventure.save();

    redis.del(`adventure:${adventureId}`);

    return adventurePackage;
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
  updateAdventurePackage,
  createAdventurePackage,
  removeAdventurePackage,
};
