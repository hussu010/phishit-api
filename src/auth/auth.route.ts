import express from "express";
const router = express.Router();

import {
  requestOTP,
  createJWT,
  refreshJWT,
  getOauthProvider,
} from "./auth.controller";
import {
  requestOtpSchema,
  createJWTSchema,
  refreshJWTSchema,
  oauthProviderSchema,
} from "./auth.schema";
import { validateRequest } from "../common/middlewares/validator";

router.post("/otp", requestOtpSchema, validateRequest, requestOTP);
router.post("/jwt/create", createJWTSchema, validateRequest, createJWT);
router.post("/jwt/refresh", refreshJWTSchema, validateRequest, refreshJWT);
router.get(
  "/o/:provider",
  oauthProviderSchema,
  validateRequest,
  getOauthProvider
);

export default router;
