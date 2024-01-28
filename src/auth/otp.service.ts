import axios from "axios";

import { IUser } from "../users/users.interface";
import { OtpType } from "../common/config/enum";
import Otp from "./otp.model";
import { OTP_EXPIRATION_DURATION } from "../common/config/general";
import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";

const calculateOtpExpirationTime = (): number => {
  const now = new Date();
  const expirationTime = now.setTime(now.getTime() + OTP_EXPIRATION_DURATION);
  return expirationTime;
};

const generateUserOtp = async (
  user: IUser,
  type: OtpType
): Promise<{ otp: number; expiresAt: number }> => {
  try {
    // const otp = Math.floor(100000 + Math.random() * 900000);  // TODO: uncomment this line and comment the next line
    const otp = 123456;
    const expiresAt = calculateOtpExpirationTime();

    await Otp.findOneAndUpdate(
      {
        user: user._id,
        type: type,
      },
      {
        code: otp,
        expiresAt,
      },
      { new: true, upsert: true }
    );
    return { otp: otp, expiresAt: expiresAt };
  } catch (error) {
    throw error;
  }
};

const sendSMS = async (phoneNumber: number, message: string) => {
  try {
    const response = await axios.post(
      "https://sms.aakashsms.com/sms/v3/send/",
      {
        auth_token: process.env.SMS_API_KEY,
        to: phoneNumber,
        text: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.error) {
      throw new CustomError(errorMessages.CANNOT_SEND_OTP, 503);
    }
  } catch (error) {
    throw error;
  }
};

const verifyOtp = async (user: IUser, otp: string, type: OtpType) => {
  try {
    const otpRecord = await Otp.findOne({
      user: user._id,
      type: type,
      code: otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      throw new CustomError(errorMessages.INVALID_OTP, 401);
    }
  } catch (error) {
    throw error;
  }
};

const deleteUserOtp = async (user: IUser, type: OtpType): Promise<void> => {
  try {
    await Otp.deleteMany({ user: user._id, type: type });
  } catch (error) {
    throw error;
  }
};

export { generateUserOtp, sendSMS, verifyOtp, deleteUserOtp };
