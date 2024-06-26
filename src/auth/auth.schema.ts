import { body, param, query } from "express-validator";
import { errorMessages } from "../common/config/messages";
import { ALLOWED_GOOGLE_OAUTH_REDIRECT_URLS } from "../common/config/general";
import { OauthProviderEnum } from "../common/config/enum";

const requestOtpSchema = [
  body("phoneNumber")
    .matches(/^[9]{1}[0-9]{9}$/)
    .withMessage(errorMessages.INVALID_PHONE_NUMBER),
];

const createJWTSchema = [
  body("method").isIn(["phone", "google"]),
  body("phoneNumber").custom((value, { req }) => {
    const phonePattern = /^[9]{1}[0-9]{9}$/;
    if (req.body.method === "phone" && !phonePattern.test(value)) {
      throw new Error(errorMessages.INVALID_PHONE_NUMBER);
    }
    return true;
  }),
  body("code").custom((value, { req }) => {
    const otpPattern = /^[0-9]{6}$/;
    const googleCodePattern = /^[A-Za-z0-9-_\\.]+$/;

    if (req.body.method === "phone" && !otpPattern.test(value)) {
      throw new Error(errorMessages.INVALID_OTP_LENGTH);
    } else if (req.body.method === "google" && !googleCodePattern.test(value)) {
      throw new Error(errorMessages.INVALID_GOOGLE_CODE);
    }

    return true;
  }),
];

const refreshJWTSchema = [body("refreshToken").isJWT()];

const oauthProviderSchema = [
  param("provider")
    .isIn(OauthProviderEnum)
    .withMessage(
      `Invalid oauth provider. Valid values are: ${OauthProviderEnum.join(
        ", "
      )}`
    ),
  query("redirect_uri")
    .isIn(ALLOWED_GOOGLE_OAUTH_REDIRECT_URLS)
    .withMessage(
      `Invalid redirect_uri. Valid values are: ${ALLOWED_GOOGLE_OAUTH_REDIRECT_URLS.join(
        ", "
      )}`
    ),
];

export {
  requestOtpSchema,
  createJWTSchema,
  refreshJWTSchema,
  oauthProviderSchema,
};
