import express from "express";
const router = express.Router();

import { getAll, get, create } from "./adventures.controller";
import {
  getAdventureByIdSchema,
  createAdventureSchema,
} from "./adventures.schema";
import { validateRequest } from "../common/middlewares/validator";

router.route("/").get(getAll);
router.route("/:id").get(getAdventureByIdSchema, validateRequest, get);
router.route("/").post(createAdventureSchema, validateRequest, create);

export default router;
