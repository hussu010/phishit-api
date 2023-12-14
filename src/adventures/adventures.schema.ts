import { param, body } from "express-validator";

const getAdventureByIdSchema = [param("id").isMongoId()];

const createAdventureSchema = [
  body("title").trim().isString().isLength({ min: 3, max: 64 }),
  body("description").isString().isLength({ min: 16, max: 1024 }),
  body("location").isObject(),
  body("location.type").isString().equals("Point"),
  body("location.coordinates").isArray(),
  body("location.coordinates.*").isNumeric(),
  body("imageUrl").isURL(),
  body("imageAlt").isString().isLength({ min: 3, max: 50 }),
  body("images").isArray(),
  body("images.*.url").isURL(),
  body("images.*.position").isNumeric(),
];

const updateAdventureSchema = [
  ...getAdventureByIdSchema,
  ...createAdventureSchema,
];

export { getAdventureByIdSchema, createAdventureSchema, updateAdventureSchema };
