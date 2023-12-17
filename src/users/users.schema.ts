import { body } from "express-validator";

const changeUsernameSchema = [
  body("username").trim().isString().isLength({ min: 3, max: 64 }),
];

export { changeUsernameSchema };
