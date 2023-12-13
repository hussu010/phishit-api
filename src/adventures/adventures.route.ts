import express from "express";
const router = express.Router();

import { getAll, get, create, remove, update } from "./adventures.controller";
import {
  getAdventureByIdSchema,
  createAdventureSchema,
  updateAdventureSchema,
} from "./adventures.schema";
import { validateRequest } from "../common/middlewares/validator";

router.route("/").get(getAll);
router.route("/:id").get(getAdventureByIdSchema, validateRequest, get);
router.route("/").post(createAdventureSchema, validateRequest, create);
router.route("/:id").put(updateAdventureSchema, validateRequest, update);
router.route("/:id").delete(getAdventureByIdSchema, validateRequest, remove);

export default router;
