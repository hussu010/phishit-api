import express from "express";
const router = express.Router();

import { getAllInteractions, getAllBookings } from "./backoffice.controller";
import { isAuthorized, hasRole } from "../common/middlewares/permissions";
import {
  getAllInteractionsSchema,
  getAllBookingsSchema,
} from "./backoffice.schema";
import { validateRequest } from "../common/middlewares/validator";

router.get(
  "/interactions",
  isAuthorized,
  hasRole(["SUPER_ADMIN", "ADMIN"]),
  getAllInteractionsSchema,
  validateRequest,
  getAllInteractions
);
router.get(
  "/bookings",
  isAuthorized,
  hasRole(["SUPER_ADMIN", "ADMIN"]),
  getAllBookingsSchema,
  validateRequest,
  getAllBookings
);

export default router;
