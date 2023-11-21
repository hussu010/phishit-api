import { NextFunction, Request, Response } from "express";
import { getUserUsingPhoneNumber } from "../users/users.service";
import { generateUserOtp, sendSMS } from "./otp.service";
import { successMessages } from "../common/config/messages";
import {
  getUserViaMethod,
  generateJWT,
  verifyJWT,
  getUserById,
  generateOauthProviderAuthorizationUrl,
} from "./auth.service";

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

const refreshJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    const payload = await verifyJWT({
      token: refreshToken,
      type: "REFRESH",
    });

    const user = await getUserById(payload._id);

    const accessToken = await generateJWT(user, "ACCESS");

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const getOauthProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { provider } = req.params;
    const redirect_uri = req.query.redirect_uri as string;

    const authorization_url = await generateOauthProviderAuthorizationUrl(
      provider,
      redirect_uri
    );

    res.status(200).json({
      authorization_url,
    });
  } catch (error) {
    next(error);
  }
};

export { requestOTP, createJWT, refreshJWT, getOauthProvider };
