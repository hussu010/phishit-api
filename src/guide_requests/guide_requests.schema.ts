import { body, param } from "express-validator";
import {
  GuideTypeEnum,
  GuideRequestDocumentTypeEnum,
  StatusEnum,
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
  body("message").isString().isLength({ min: 3, max: 255 }),
  body("documents").isArray(),
  body("documents.*.url").isURL(),
  body("documents.*.type").isIn(GuideRequestDocumentTypeEnum),
];

const updateGuideRequestApprovalSchema = [
  param("id").isMongoId(),
  body("status").isString().isIn(StatusEnum),
];

export { createGuideRequestSchema, updateGuideRequestApprovalSchema };
