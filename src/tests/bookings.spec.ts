import { connect, clear, close } from "./test-db-connect.helper";

import { faker } from "@faker-js/faker";

import request from "supertest";
import app from "../../index";

import { getUserWithRole } from "./auth.helper";
import { generateJWT } from "../auth/auth.service";
import { errorMessages } from "../common/config/messages";
import { seedAdventures } from "../seed/adventures";
import Booking from "../bookings/bookings.model";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe("POST /api/bookings", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app).post("/api/bookings").send({});
    expect(res.status).toBe(401);
  });

  it("should return 400 if no parameters are provided", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({
      path: "adventureId",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "packageId",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "guideId",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "startDate",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "noOfPeople",
      location: "body",
    });
  });

  it("should return 400 if adventureId, packageId and guideId are not valid mongo ids and startDate is not valid date", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: "123",
        packageId: "123",
        guideId: "123",
        startDate: "123",
        noOfPeople: 100,
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({
      path: "adventureId",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "packageId",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "guideId",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "startDate",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "noOfPeople",
      location: "body",
    });
  });

  it("should return 404 if adventure with provided id does not exist", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: "5f7a5d713d0f4d1b2c5e3f6e",
        packageId: "5f7a5d713d0f4d1b2c5e3f6e",
        guideId: "5f7a5d713d0f4d1b2c5e3f6e",
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
  });

  it("should return 409 if guide is not available for provided dates", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const priorBooking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    await Booking.findByIdAndUpdate(
      priorBooking.body._id,
      {
        status: "CONFIRMED",
      },
      { new: true }
    );

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(errorMessages.GUIDE_NOT_AVAILABLE);
  });

  it("should return 201 if parameters are valid and guide is available", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    expect(res.status).toBe(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("adventure");
    expect(res.body).toHaveProperty("package");
    expect(res.body).toHaveProperty("guide");
    expect(res.body).toHaveProperty("startDate");
    expect(res.body).toHaveProperty("endDate");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
  });
});
