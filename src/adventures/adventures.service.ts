import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";

import { Adventure, Package } from "./adventures.model";
import { IUser } from "../users/users.interface";
import Booking from "../bookings/bookings.model";
import { logInteraction } from "../backoffice/backoffice.service";

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
  user,
  title,
  description,
  location,
  imageUrl,
  imageAlt,
  images,
}: {
  user: IUser;
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

    logInteraction({
      user,
      action: "create",
      resource: "adventure",
      resourceId: adventure._id,
      data: adventure,
    });

    return adventure;
  } catch (error) {
    throw error;
  }
};

const deleteAdventure = async ({ id, user }: { id: string; user: IUser }) => {
  try {
    const adventure = await Adventure.findByIdAndDelete(id);

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    redis.del(`adventure:${id}`);

    logInteraction({
      user,
      action: "delete",
      resource: "adventure",
      resourceId: adventure._id,
      data: adventure,
    });

    return adventure;
  } catch (error) {
    throw error;
  }
};

const updateAdventure = async ({
  user,
  id,
  title,
  description,
  location,
  imageUrl,
  imageAlt,
  images,
}: {
  user: IUser;
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

    logInteraction({
      user,
      action: "update",
      resource: "adventure",
      resourceId: adventure._id,
      data: adventure,
    });

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
  packageId,
  startDate,
}: {
  adventureId: string;
  packageId: string;
  startDate: string;
}) => {
  try {
    const adventure = await Adventure.findOne({
      _id: adventureId,
    })
      .populate({
        path: "guides",
        select:
          "-phoneNumber -googleId -isActive -__v -createdAt -updatedAt -roles",
      })
      .populate("packages");

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    const adventurePackage = adventure.packages.find(
      (packageItem) => packageItem._id.toString() === packageId
    );

    if (!adventurePackage) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    const bookings = await Booking.find({
      status: {
        $in: ["CONFIRMED"],
      },
    });

    let availableGuides: Object[] = [];

    adventure.guides.filter((guide) => {
      const guideHasBookings = bookings.some((booking) => {
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + adventurePackage.duration);

        return (
          booking.guide.toString() === guide._id.toString() &&
          new Date(endDate) >= booking.startDate &&
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
  user,
  adventureId,
  title,
  price,
  description,
  duration,
}: {
  user: IUser;
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

    logInteraction({
      user,
      action: "create",
      resource: "package",
      resourceId: adventurePackage._id,
      data: adventure,
    });

    return adventurePackage;
  } catch (error) {
    throw error;
  }
};

const updateAdventurePackage = async ({
  user,
  adventureId,
  packageId,
  title,
  price,
  description,
  duration,
}: {
  user: IUser;
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

    logInteraction({
      user,
      action: "update",
      resource: "package",
      resourceId: adventurePackage._id,
      data: adventure,
    });

    return adventurePackage;
  } catch (error) {
    throw error;
  }
};

const removeAdventurePackage = async ({
  user,
  packageId,
  adventureId,
}: {
  user: IUser;
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

    logInteraction({
      user,
      action: "delete",
      resource: "package",
      resourceId: adventurePackage._id,
      data: adventure,
    });

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
