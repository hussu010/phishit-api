import express from "express";
const router = express.Router();

import { updateUsername, getMe } from "./users.controller";
import { isAuthorized } from "../common/middlewares/permissions";
import { changeUsernameSchema } from "./users.schema";
import { validateRequest } from "../common/middlewares/validator";

router.get("/me", isAuthorized, getMe);
router.put(
  "/me/username",
  isAuthorized,
  changeUsernameSchema,
  validateRequest,
  updateUsername
);

export default router;
