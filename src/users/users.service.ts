import User from "./users.model";
import { IUser } from "./users.interface";
import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";

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

export { getUserUsingPhoneNumber, changeUsername };
