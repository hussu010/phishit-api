import express from "express";
const router = express.Router();

import {
  getAll,
  get,
  create,
  remove,
  update,
  enrollToAdventure,
  unenrollFromAdventure,
  getAvailableGuides,
  createPackage,
  updatePackage,
  removePackage,
} from "./adventures.controller";
import { isAuthorized, hasRole } from "../common/middlewares/permissions";
import {
  getAdventureByIdSchema,
  createAdventureSchema,
  updateAdventureSchema,
  getAdventureGuideSchema,
  getPackageByIdSchema,
  createPackageSchema,
  updatePackageSchema,
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
router.post(
  "/:id/unenroll",
  isAuthorized,
  hasRole(["GUIDE"]),
  getAdventureByIdSchema,
  validateRequest,
  unenrollFromAdventure
);
router.post(
  "/:id/guides",
  isAuthorized,
  getAdventureGuideSchema,
  validateRequest,
  getAvailableGuides
);
router.post(
  "/:id/packages",
  isAuthorized,
  hasRole(["SUPER_ADMIN", "ADMIN"]),
  createPackageSchema,
  validateRequest,
  createPackage
);
router.put(
  "/:id/packages/:packageId",
  isAuthorized,
  hasRole(["SUPER_ADMIN", "ADMIN"]),
  updatePackageSchema,
  validateRequest,
  updatePackage
);
router.delete(
  "/:id/packages/:packageId",
  isAuthorized,
  hasRole(["SUPER_ADMIN"]),
  getPackageByIdSchema,
  validateRequest,
  removePackage
);

export default router;
