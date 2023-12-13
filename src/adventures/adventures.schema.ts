import { param, body } from "express-validator";

const getAdventureByIdSchema = [param("id").isMongoId()];

const createAdventureSchema = [
  body("title").isString().isLength({ min: 3, max: 50 }),
  body("description").isString().isLength({ min: 3, max: 500 }),
  body("location").isObject(),
  body("location.type").isString().equals("Point"),
  body("location.coordinates").isArray(),
  body("location.coordinates.*").isNumeric(),
  body("imageUrl").isString().isLength({ min: 3, max: 500 }),
  body("imageAlt").isString().isLength({ min: 3, max: 50 }),
  body("images").isArray(),
  body("images.*.url").isURL(),
  body("images.*.position").isNumeric(),
];

export { getAdventureByIdSchema, createAdventureSchema };
