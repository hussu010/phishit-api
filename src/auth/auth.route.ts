import express from "express";
const router = express.Router();

import { requestOTP } from "./auth.controller";

router.post("/otp", requestOTP);

export default router;
