import jwt from "jsonwebtoken";
import User from "../users/users.model";
import { IUser } from "../users/users.interface";
import { errorMessages } from "../common/config/messages";
import { JWTGrantType } from "../common/config/enum";
import {
  REFRESH_TOKEN_VALIDITY,
  ACCESS_TOKEN_VALIDITY,
} from "../common/config/general";
import { verifyOtp, deleteUserOtp } from "./otp.service";

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

const generateJWT = async (
  user: IUser,
  type: JWTGrantType
): Promise<string> => {
  try {
    let expiresIn: string;
    if (type == "REFRESH") {
      expiresIn = REFRESH_TOKEN_VALIDITY;
    } else {
      expiresIn = ACCESS_TOKEN_VALIDITY;
    }

    const token = jwt.sign(
      {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        type,
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn,
      }
    );
    return token;
  } catch (error) {
    throw error;
  }
};

const getUserViaMethod = async ({
  phoneNumber,
  method,
  code,
}: {
  phoneNumber: string;
  method: string;
  code: string;
}): Promise<IUser> => {
  try {
    if (method == "phone") {
      const user = await getUserUsingPhoneNumber(phoneNumber);
      await verifyOtp(user, code, "AUTH");
      deleteUserOtp(user, "AUTH");
      return user;
    } else {
      throw new Error(errorMessages.INVALID_AUTH_METHOD);
    }
  } catch (error) {
    throw error;
  }
};

export { generateJWT, getUserViaMethod, getUserUsingPhoneNumber };
