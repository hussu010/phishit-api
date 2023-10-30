import express from "express";
const router = express.Router();

import { requestOTP, createJWT } from "./auth.controller";
import { requestOtpSchema, createJWTSchema } from "./auth.schema";
import { validateRequest } from "../common/middlewares/validateRequest";

router.post("/otp", requestOtpSchema, validateRequest, requestOTP);
router.post("/jwt/create", createJWTSchema, validateRequest, createJWT);

export default router;
