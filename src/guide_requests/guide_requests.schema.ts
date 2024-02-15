import { body, param } from "express-validator";
import {
  GuideTypeEnum,
  GuideRequestDocumentTypeEnum,
  StatusEnum,
  GenderEnum,
} from "../common/config/enum";
import { errorMessages } from "../common/config/messages";

const createGuideRequestSchema = [
  body("type").isString().isIn(GuideTypeEnum),
  body("name").isString().isLength({ min: 3, max: 255 }),
  body("phoneNumber").custom((value, { req }) => {
    const phonePattern = /^[9]{1}[0-9]{9}$/;
    if (!phonePattern.test(value)) {
      throw new Error(errorMessages.INVALID_PHONE_NUMBER);
    }
    return true;
  }),
  body("email").isEmail(),
  body("address").isString().isLength({ min: 3, max: 255 }),
  body("gender")
    .isIn(GenderEnum)
    .withMessage(`Invalid gender. Valid values are: ${GenderEnum.join(", ")}`),
  body("dateOfBirth").matches(
    /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/
  ),
  body("message").isString().isLength({ min: 3, max: 255 }),
  body("documents").isArray(),
  body("documents.*.url").isURL(),
  body("documents.*.type").isIn(GuideRequestDocumentTypeEnum),
];

const updateGuideRequestSchema = [
  param("id").isMongoId(),
  body("status").isString().isIn(StatusEnum),
];

export { createGuideRequestSchema, updateGuideRequestSchema };
