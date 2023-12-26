import express from "express";
const router = express.Router();

import {
  getAll,
  get,
  create,
  remove,
  update,
  enrollToAdventure,
} from "./adventures.controller";
import { isAuthorized, hasRole } from "../common/middlewares/permissions";
import {
  getAdventureByIdSchema,
  createAdventureSchema,
  updateAdventureSchema,
} from "./adventures.schema";
import { validateRequest } from "../common/middlewares/validator";

router.get("/", getAll);
router.get("/:id", getAdventureByIdSchema, validateRequest, get);
router.post(
  "/",
  isAuthorized,
  hasRole(["SUPER_ADMIN", "ADMIN"]),
  createAdventureSchema,
  validateRequest,
  create
);
router.put(
  "/:id",
  isAuthorized,
  hasRole(["SUPER_ADMIN", "ADMIN"]),
  updateAdventureSchema,
  validateRequest,
  update
);
router.delete(
  "/:id",
  isAuthorized,
  hasRole(["SUPER_ADMIN"]),
  getAdventureByIdSchema,
  validateRequest,
  remove
);
router.post(
  "/:id/enroll",
  isAuthorized,
  hasRole(["GUIDE"]),
  getAdventureByIdSchema,
  validateRequest,
  enrollToAdventure
);

export default router;
