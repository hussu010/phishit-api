import express from "express";
const router = express.Router();

import { getAll } from "./guide_requests.controller";
import { isAuthorized, hasRole } from "../common/middlewares/permissions";

router.get("/", isAuthorized, hasRole(["SUPER_ADMIN", "ADMIN"]), getAll);

export default router;
