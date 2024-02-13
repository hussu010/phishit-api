import express from "express";
const router = express.Router();

import { getAll, create, updateApproval } from "./guide_requests.controller";
import { isAuthorized, hasRole } from "../common/middlewares/permissions";
import {
  createGuideRequestSchema,
  updateGuideRequestSchema,
} from "./guide_requests.schema";
import { validateRequest } from "../common/middlewares/validator";

router.get("/", isAuthorized, hasRole(["SUPER_ADMIN", "ADMIN"]), getAll);
router.post(
  "/",
  isAuthorized,
  createGuideRequestSchema,
  validateRequest,
  create
);
router.put(
  "/:id/status",
  isAuthorized,
  hasRole(["SUPER_ADMIN", "ADMIN"]),
  updateGuideRequestSchema,
  validateRequest,
  updateApproval
);

export default router;
