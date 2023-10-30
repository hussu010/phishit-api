import { NextFunction, Request, Response } from "express";
import { getUserUsingPhoneNumber } from "../users/users.service";
import { generateUserOtp, sendSMS } from "./otp.service";
import { successMessages } from "../common/config/messages";
import { getUserViaMethod, generateJWT } from "./auth.service";

const requestOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber } = req.body;
    const user = await getUserUsingPhoneNumber(phoneNumber);

    const { otp, expiresAt } = await generateUserOtp(user, "AUTH");
    const message = `Phish.it OTP: ${otp}`;
    // await sendSMS(phoneNumber, message);

    res.status(200).json({
      message: successMessages.OTP_SENT_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
};

const createJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber, code, method } = req.body;

    const user = await getUserViaMethod({ phoneNumber, method, code });

    const accessToken = await generateJWT(user, "ACCESS");
    const refreshToken = await generateJWT(user, "REFRESH");

    await res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export { requestOTP, createJWT };
