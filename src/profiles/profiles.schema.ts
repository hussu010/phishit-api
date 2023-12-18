import { body } from "express-validator";
import { GenderEnum } from "../common/config/enum";

const updateProfileSchema = [
  body("fullName").isLength({ min: 6, max: 64 }).isString(),
  body("email").isEmail(),
  body("gender")
    .isIn(GenderEnum)
    .withMessage(`Invalid gender. Valid values are: ${GenderEnum.join(", ")}`),
  body("dateOfBirth").isDate(),
  body("bio").isLength({ min: 3, max: 254 }).isString(),
];

export { updateProfileSchema };
