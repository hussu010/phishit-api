import express from "express";
const router = express.Router();

import { getAll, get } from "./adventures.controller";
import { getAdventureByIdSchema } from "./adventures.schema";
import { validateRequest } from "../common/middlewares/validator";

router.route("/").get(getAll);
router.route("/:id").get(getAdventureByIdSchema, validateRequest, get);

export default router;
