import Profile from "./profiles.model";
import { IUser } from "../users/users.interface";
import { DICEBEAR_URL } from "../common/config/general";
import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";

const getUserProfile = async (user: IUser) => {
  try {
    const userProfile = await Profile.findOne({ user });
    if (!userProfile) {
      throw new CustomError(errorMessages.PROFILE_NOT_FOUND, 404);
    }
    return userProfile;
  } catch (error) {
    throw error;
  }
};

const updateUserProfile = async ({
  user,
  fullName,
  email,
  gender,
  dateOfBirth,
  bio,
}: {
  user: IUser;
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
}) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user },
      {
        fullName,
        email,
        gender,
        dateOfBirth,
        bio,
        avatar: `${DICEBEAR_URL}?seed=${user.username}`,
      },
      { new: true, upsert: true }
    );

    return profile;
  } catch (error) {
    throw error;
  }
};

export { updateUserProfile, getUserProfile };
