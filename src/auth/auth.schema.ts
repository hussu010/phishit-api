import { body, param, query } from "express-validator";
import { errorMessages, successMessages } from "../common/config/messages";

const requestOtpSchema = [
  body("phoneNumber")
    .matches(/^[9]{1}[0-9]{9}$/)
    .withMessage(errorMessages.INVALID_PHONE_NUMBER),
];

export { requestOtpSchema };
