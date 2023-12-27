import express from "express";
const router = express.Router();

import { getAll, create } from "./bookings.controller";
import { isAuthorized } from "../common/middlewares/permissions";
import { createBookingSchema } from "./bookings.schema";
import { validateRequest } from "../common/middlewares/validator";

router.get("/", isAuthorized, getAll);
router.post("/", isAuthorized, createBookingSchema, validateRequest, create);

export default router;
