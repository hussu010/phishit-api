import { param, body, query } from "express-validator";

const getAllInteractionsSchema = [
  query("limit").isNumeric().optional(),
  query("offset").isNumeric().optional(),
];

export { getAllInteractionsSchema };
