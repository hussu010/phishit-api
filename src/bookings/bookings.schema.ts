import { body, param } from "express-validator";
import { PaymentMethodEnum } from "../common/config/enum";
import { ALLOWED_PAYMENT_REDIRECT_URLS } from "../common/config/general";

const getBookingByIdSchema = [param("id").isMongoId()];

const createBookingSchema = [
  body("adventureId").isMongoId(),
  body("packageId").isMongoId(),
  body("guideId").isMongoId(),
  body("noOfPeople").isInt({ min: 1, max: 10 }),
  body("startDate")
    .isDate()
    .custom((value, { req }) => {
      const { endDate } = req.body;
      if (endDate && new Date(value) > new Date(endDate)) {
        throw new Error("startDate must be before endDate");
      }
      return true;
    }),
];

const initiatePaymentSchema = [
  body("method").isIn(PaymentMethodEnum),
  body("redirectUrl").isString(),
  param("id").isMongoId(),
];

const verifyPaymentSchema = [param("id").isMongoId()];

export {
  createBookingSchema,
  initiatePaymentSchema,
  verifyPaymentSchema,
  getBookingByIdSchema,
};
