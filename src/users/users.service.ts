import { IUser, UserFetchResult } from "./users.interface";
import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";

import User from "./users.model";
import Profile from "../profiles/profiles.model";
import { Adventure } from "../adventures/adventures.model";

const getUserUsingPhoneNumber = async (phoneNumber: string): Promise<IUser> => {
  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      const user = await User.create({ phoneNumber });
      return user;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const changeUsername = async ({
  username,
  user,
}: {
  username: string;
  user: IUser;
}) => {
  try {
    const isUsernameTaken = await User.findOne({ username });

    if (isUsernameTaken) {
      throw new CustomError(errorMessages.USERNAME_ALREADY_EXISTS, 409);
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { username },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const fetchUserByUsername = async (
  username: string
): Promise<UserFetchResult> => {
  try {
    const user = await User.findOne({ username }).select(
      "-phoneNumber -googleId -isActive -__v -createdAt -updatedAt -roles -isAvailable"
    );

    if (!user) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    const profile = await Profile.findOne({ user }).select(
      "-user -__v -createdAt -updatedAt -_id -dateOfBirth -email"
    );

    const adventures = await Adventure.find({ guides: user._id }).select(
      "-guides -packages -__v -createdAt -updatedAt"
    );

    return { user, profile, adventures };
  } catch (error) {
    throw error;
  }
};

export { getUserUsingPhoneNumber, changeUsername, fetchUserByUsername };
