import { param, body, query } from "express-validator";

const getAllInteractionsSchema = [
  query("limit").isNumeric().optional(),
  query("offset").isNumeric().optional(),
];

const getAllBookingsSchema = [
  query("limit").isNumeric().optional(),
  query("offset").isNumeric().optional(),
  query("status").isIn(["CANCELLED"]),
];

export { getAllInteractionsSchema, getAllBookingsSchema };
