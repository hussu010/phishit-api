import express from "express";
const router = express.Router();

import { requestOTP, createJWT, refreshJWT } from "./auth.controller";
import {
  requestOtpSchema,
  createJWTSchema,
  refreshJWTSchema,
} from "./auth.schema";
import { validateRequest } from "../common/middlewares/validateRequest";

router.post("/otp", requestOtpSchema, validateRequest, requestOTP);
router.post("/jwt/create", createJWTSchema, validateRequest, createJWT);
router.post("/jwt/refresh", refreshJWTSchema, validateRequest, refreshJWT);

export default router;
