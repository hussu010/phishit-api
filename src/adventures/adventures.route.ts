import express from "express";
const router = express.Router();

import { getAll, get, create, remove, update } from "./adventures.controller";
import { isAuthorized, hasRole } from "../common/middlewares/permissions";
import {
  getAdventureByIdSchema,
  createAdventureSchema,
  updateAdventureSchema,
} from "./adventures.schema";
import { validateRequest } from "../common/middlewares/validator";

router.route("/").get(getAll);
router.route("/:id").get(getAdventureByIdSchema, validateRequest, get);
router
  .route("/")
  .post(
    isAuthorized,
    hasRole(["SUPER_ADMIN", "ADMIN"]),
    createAdventureSchema,
    validateRequest,
    create
  );
router
  .route("/:id")
  .put(
    isAuthorized,
    hasRole(["SUPER_ADMIN", "ADMIN"]),
    updateAdventureSchema,
    validateRequest,
    update
  );
router
  .route("/:id")
  .delete(
    isAuthorized,
    hasRole(["SUPER_ADMIN", "ADMIN"]),
    getAdventureByIdSchema,
    validateRequest,
    remove
  );

export default router;
