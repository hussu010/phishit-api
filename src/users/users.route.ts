import express from "express";
const router = express.Router();

import { updateUsername } from "./users.controller";
import { isAuthorized } from "../common/middlewares/permissions";
import { changeUsernameSchema } from "./users.schema";
import { validateRequest } from "../common/middlewares/validator";

router.put(
  "/me/username",
  isAuthorized,
  changeUsernameSchema,
  validateRequest,
  updateUsername
);

export default router;
