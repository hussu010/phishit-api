import express from "express";
const router = express.Router();

import {
  getAll,
  create,
  initiatePayment,
  verifyPayment,
} from "./bookings.controller";
import { isAuthorized } from "../common/middlewares/permissions";
import {
  createBookingSchema,
  initiatePaymentSchema,
  verifyPaymentSchema,
} from "./bookings.schema";
import { validateRequest } from "../common/middlewares/validator";

router.get("/", isAuthorized, getAll);
router.post("/", isAuthorized, createBookingSchema, validateRequest, create);
router.post(
  "/:id/initiate-payment",
  isAuthorized,
  initiatePaymentSchema,
  validateRequest,
  initiatePayment
);
router.post(
  "/:id/verify-payment",
  isAuthorized,
  verifyPaymentSchema,
  validateRequest,
  verifyPayment
);

export default router;
