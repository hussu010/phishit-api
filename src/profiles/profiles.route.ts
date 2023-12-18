import express from "express";
const router = express.Router();

import { updateProfile, getProfile } from "./profiles.controller";
import { isAuthorized } from "../common/middlewares/permissions";
import { validateRequest } from "../common/middlewares/validator";
import { updateProfileSchema } from "./profiles.schema";

router.get("/", isAuthorized, getProfile);
router.put(
  "/",
  isAuthorized,
  updateProfileSchema,
  validateRequest,
  updateProfile
);

export default router;
