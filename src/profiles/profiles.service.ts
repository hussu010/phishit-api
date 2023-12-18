import Profile from "./profiles.model";
import { IUser } from "../users/users.interface";
import { DICEBEAR_URL } from "../common/config/general";

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

export { updateUserProfile };
