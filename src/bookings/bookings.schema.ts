import { body } from "express-validator";

const createBookingSchema = [
  body("adventureId").isMongoId(),
  body("packageId").isMongoId(),
  body("guideId").isMongoId(),
  body("noOfPeople").isInt({ min: 1, max: 10 }),
  body("startDate")
    .isDate()
    .custom((value, { req }) => {
      const { endDate } = req.body;
      if (endDate && new Date(value) > new Date(endDate)) {
        throw new Error("startDate must be before endDate");
      }
      return true;
    }),
];

export { createBookingSchema };
