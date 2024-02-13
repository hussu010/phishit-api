import express from "express";
const router = express.Router();

import { getAll } from "./backoffice.controller";
import { isAuthorized, hasRole } from "../common/middlewares/permissions";
import { getAllInteractionsSchema } from "./backoffice.schema";
import { validateRequest } from "../common/middlewares/validator";

router.get(
  "/interactions",
  isAuthorized,
  hasRole(["SUPER_ADMIN", "ADMIN"]),
  getAllInteractionsSchema,
  validateRequest,
  getAll
);

export default router;
