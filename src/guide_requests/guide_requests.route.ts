import express from "express";
const router = express.Router();

import { getAll, create } from "./guide_requests.controller";
import { isAuthorized, hasRole } from "../common/middlewares/permissions";
import { createGuideRequestSchema } from "./guide_requests.schema";
import { validateRequest } from "../common/middlewares/validator";

router.get("/", isAuthorized, hasRole(["SUPER_ADMIN", "ADMIN"]), getAll);
router.post(
  "/",
  isAuthorized,
  createGuideRequestSchema,
  validateRequest,
  create
);

export default router;
