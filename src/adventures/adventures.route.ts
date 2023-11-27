import express from "express";
const router = express.Router();

import { getAll } from "./adventures.controller";

router.route("/").get(getAll);

export default router;
