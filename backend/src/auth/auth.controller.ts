import { NextFunction, Request, Response } from "express";
import { getUserUsingPhoneNumber } from "../users/users.service";
import { generateUserOtp, sendSMS } from "./otp.service";
import { successMessages } from "../common/config/messages";

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

export { requestOTP };
