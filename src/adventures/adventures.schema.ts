import { param } from "express-validator";

const getAdventureByIdSchema = [param("id").isMongoId()];

export { getAdventureByIdSchema };
