import express from "express";
const router = express.Router();

import { updateProfile } from "./profiles.controller";
import { isAuthorized } from "../common/middlewares/permissions";
import { validateRequest } from "../common/middlewares/validator";
import { updateProfileSchema } from "./profiles.schema";

router.put(
  "/",
  isAuthorized,
  updateProfileSchema,
  validateRequest,
  updateProfile
);

export default router;
