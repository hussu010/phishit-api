import express from "express";
const router = express.Router();

import {
  getAll,
  get,
  create,
  initiatePayment,
  verifyPayment,
  cancel,
} from "./bookings.controller";
import { isAuthorized } from "../common/middlewares/permissions";
import {
  createBookingSchema,
  initiatePaymentSchema,
  verifyPaymentSchema,
  getBookingByIdSchema,
} from "./bookings.schema";
import { validateRequest } from "../common/middlewares/validator";

router.get("/", isAuthorized, getAll);
router.get("/:id", isAuthorized, getBookingByIdSchema, validateRequest, get);
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
router.post(
  "/:id/cancel",
  isAuthorized,
  getBookingByIdSchema,
  validateRequest,
  isAuthorized,
  cancel
);

export default router;
