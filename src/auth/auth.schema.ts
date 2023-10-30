import { body, param, query } from "express-validator";
import { errorMessages, successMessages } from "../common/config/messages";

const requestOtpSchema = [
  body("phoneNumber")
    .matches(/^[9]{1}[0-9]{9}$/)
    .withMessage(errorMessages.INVALID_PHONE_NUMBER),
];

const createJWTSchema = [
  body("method").default("phone").isIn(["phone", "google"]),
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

export { requestOtpSchema, createJWTSchema };
