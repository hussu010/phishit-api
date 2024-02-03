import { body } from "express-validator";

const changeUsernameSchema = [
  body("username").trim().isString().isLength({ min: 3, max: 64 }),
];

const updateAvailableStatusSchema = [body("isAvailable").isBoolean()];

export { changeUsernameSchema, updateAvailableStatusSchema };
