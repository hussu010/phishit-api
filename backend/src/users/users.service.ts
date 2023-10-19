import User from "./users.model";
import { IUser } from "./users.interface";

const getUserUsingPhoneNumber = async (phoneNumber: string): Promise<IUser> => {
  try {
    const user = await User.findOneAndUpdate(
      {
        phoneNumber,
      },
      {
        phoneNumber,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return user;
  } catch (error) {
    throw error;
  }
};

export { getUserUsingPhoneNumber };
