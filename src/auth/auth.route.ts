import express from "express";
const router = express.Router();

import { requestOTP } from "./auth.controller";
import { requestOtpSchema } from "./auth.schema";
import { validateRequest } from "../common/middlewares/validateRequest";

router.post("/otp", requestOtpSchema, validateRequest, requestOTP);

export default router;
