import express from "express";
const router = express.Router();

import {
  updateUsername,
  getMe,
  updateAvailableStatus,
} from "./users.controller";
import { isAuthorized, hasRole } from "../common/middlewares/permissions";
import {
  changeUsernameSchema,
  updateAvailableStatusSchema,
} from "./users.schema";
import { validateRequest } from "../common/middlewares/validator";

router.get("/me", isAuthorized, getMe);
router.put(
  "/me/username",
  isAuthorized,
  changeUsernameSchema,
  validateRequest,
  updateUsername
);
router.put(
  "/me/update-available-status",
  isAuthorized,
  hasRole(["GUIDE"]),
  updateAvailableStatusSchema,
  validateRequest,
  updateAvailableStatus
);

export default router;
