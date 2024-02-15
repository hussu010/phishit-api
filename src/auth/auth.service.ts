import jwt from "jsonwebtoken";
import { CustomError } from "../common/interfaces/common";
import User from "../users/users.model";
import { IUser } from "../users/users.interface";
import { errorMessages } from "../common/config/messages";
import { JWTGrantType } from "../common/config/enum";
import {
  REFRESH_TOKEN_VALIDITY,
  ACCESS_TOKEN_VALIDITY,
} from "../common/config/general";
import { verifyOtp, deleteUserOtp } from "./otp.service";
import { getUserUsingPhoneNumber } from "../users/users.service";

import {
  generateGoogleOauthProviderAuthorizationUrl,
  getGoogleUserDetails,
} from "./auth.utils";

const getUserById = async (_id: string): Promise<IUser> => {
  try {
    const user = await User.findById(_id);

    if (!user) {
      throw new Error(errorMessages.INVALID_USER_ID);
    }
    return user;
  } catch (error: any) {
    throw new CustomError(error.message, 401);
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
    } else if (method == "google") {
      const user = await getUserUsingGoogleOauth({
        code,
      });
      return user;
    } else {
      throw new Error(errorMessages.INVALID_AUTH_METHOD);
    }
  } catch (error) {
    throw error;
  }
};

const verifyJWT = async ({
  token,
  type,
}: {
  token: string;
  type: JWTGrantType;
}): Promise<any> => {
  try {
    const payload: any = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      (err: any, decoded: unknown) => {
        if (err) {
          throw new Error(err.message);
        }
        return decoded;
      }
    );

    if (payload.type != type) {
      throw new Error(errorMessages.INVALID_JWT_TYPE);
    }
    return payload;
  } catch (error: any) {
    throw new CustomError(error.message, 401);
  }
};

const generateOauthProviderAuthorizationUrl = async (
  provider: string,
  redirect_uri: string
): Promise<string> => {
  if (provider == "google") {
    return generateGoogleOauthProviderAuthorizationUrl(redirect_uri);
  } else {
    throw new Error(errorMessages.INVALID_OAUTH_PROVIDER);
  }
};

const getUserUsingGoogleOauth = async ({
  code,
}: {
  code: string;
}): Promise<IUser> => {
  try {
    const { id, email, given_name, family_name, picture } =
      await getGoogleUserDetails(code);

    const user = await User.findOne({ googleId: id });

    if (!user) {
      const user = await User.create({
        googleId: id,
        roles: ["GENERAL"],
      });

      // await updateUserProfile({
      //   user,
      //   firstName: given_name,
      //   lastName: family_name,
      //   email,
      //   avatarUrl: picture,
      // });
      return user;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export {
  generateJWT,
  getUserViaMethod,
  verifyJWT,
  getUserById,
  generateOauthProviderAuthorizationUrl,
};
