import { connect, clear, close } from "./test-db-connect.helper";

import request from "supertest";
import app from "../../index";

import { faker } from "@faker-js/faker";

import { getUserWithRole } from "./auth.helper";
import { generateJWT } from "../auth/auth.service";
import { errorMessages } from "../common/config/messages";
import { seedAdventures } from "./adventure.helper";
import Booking from "../bookings/bookings.model";

import * as bookingsUtils from "../bookings/bookings.utils";
import { CustomError } from "../common/interfaces/common";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe("GET /api/bookings", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app).get("/api/bookings");
    expect(res.status).toBe(401);
  });

  it("should return 200 if user is logged in", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should return 200 if user is logged in and has bookings", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2023-12-12",
        noOfPeople: 5,
      });

    const res = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("_id");
    expect(res.body[0]).toHaveProperty("adventure");
    expect(res.body[0]).toHaveProperty("package");
    expect(res.body[0]).toHaveProperty("guide");
    expect(res.body[0]).toHaveProperty("startDate");
    expect(res.body[0]).toHaveProperty("endDate");
  });
});

describe("GET /api/bookings/:id", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app).get("/api/bookings/123");
    expect(res.status).toBe(401);
  });

  it("should return 400 if invalid boooking id is provided", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .get("/api/bookings/123")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({
      path: "id",
      location: "params",
    });
  });

  it("should return 404 if booking with provided id does not exist", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const fakeBookingId = "5f7a5d713d0f4d1b2c5e3f6e";

    const res = await request(app)
      .get(`/api/bookings/${fakeBookingId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
  });

  it("should return 200 if booking with provided id exists", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 1,
      numberOfPackages: 1,
      numberOfGuides: 1,
    });

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        noOfPeople: 5,
        startDate: "2023-12-12",
      });

    const res = await request(app)
      .get(`/api/bookings/${booking.body._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("adventure");
    expect(res.body).toHaveProperty("package");
    expect(res.body).toHaveProperty("guide");
    expect(res.body).toHaveProperty("startDate");
    expect(res.body).toHaveProperty("endDate");
    expect(res.body).toHaveProperty("customer");
    expect(res.body).toHaveProperty("noOfPeople");
    expect(res.body).toHaveProperty("status");
  });

  it("should return 200 and payment information if payment is initiated", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 1,
      numberOfPackages: 1,
      numberOfGuides: 1,
    });

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        noOfPeople: 5,
        startDate: "2023-12-12",
      });

    const initiatePayment = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl: "http://localhost:3000/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    const res = await request(app)
      .get(`/api/bookings/${booking.body._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("adventure");
    expect(res.body).toHaveProperty("package");
    expect(res.body).toHaveProperty("guide");
    expect(res.body).toHaveProperty("startDate");
    expect(res.body).toHaveProperty("endDate");
    expect(res.body).toHaveProperty("customer");
    expect(res.body).toHaveProperty("noOfPeople");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("payment");
    expect(res.body.payment).toHaveProperty("status");
    expect(res.body.payment).toHaveProperty("method");
    expect(res.body.payment).toHaveProperty("amount");
  });
});

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

describe("POST /api/bookings/:id/initiate-payment", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .post("/api/bookings/123/initiate-payment")
      .send({});
    expect(res.status).toBe(401);
  });

  it("should return 400 if no parameters are provided", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/bookings/123/initiate-payment")
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
      path: "method",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "redirectUrl",
      location: "body",
    });
  });

  it("should return 400 if type and redirectUrl is not valid", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/bookings/123/initiate-payment")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "INVALID",
        redirectUrl: "INVALID",
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({
      path: "method",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "redirectUrl",
      location: "body",
    });
  });

  it("should return 404 if booking with provided id does not exist", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/bookings/5f7a5d713d0f4d1b2c5e3f6e/initiate-payment")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl: "http://localhost:3000/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
  });

  it("should return 409 if booking is already processed", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const booking = await request(app)
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
      booking.body._id,
      {
        status: "CONFIRMED",
      },
      { new: true }
    );

    const res = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl: "http://127.0.0.1:3000/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(errorMessages.BOOKING_ALREADY_PROCESSED);
  });

  it("should return 503 if booking is not processed and type is valid but payment request fails", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    jest
      .spyOn(bookingsUtils, "initiateKhaltiPaymentRequest")
      .mockRejectedValue(new CustomError("Error", 503));

    const res = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl:
          "https://phishit-ui-dev.tnbswap.com/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(res.status).toBe(503);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 200 if booking is not processed and type is valid", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    expect(booking.status).toBe(201);
    expect(booking.body).toHaveProperty("status");
    expect(booking.body.status).toBe("NEW");

    const fakeKhaltiResponse = {
      pidx: "QXnwaNmqwmFnNL7EaSM5a9",
      paymentUrl: "https://test-pay.khalti.com/?pidx=QXnwaNmqwmFnNL7EaSM5a9",
      expiresAt: new Date(),
    };
    jest
      .spyOn(bookingsUtils, "initiateKhaltiPaymentRequest")
      .mockResolvedValue(fakeKhaltiResponse);

    const res = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl:
          "https://phishit-ui.tnbswap.com/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("pidx");
    expect(res.body).toHaveProperty("paymentUrl");
    expect(res.body).toHaveProperty("expiresAt");

    const bookingHasPaymentInfo = await Booking.findOne({
      _id: booking.body._id,
    });

    expect(bookingHasPaymentInfo).toHaveProperty("payment");
    expect(bookingHasPaymentInfo?.payment).toHaveProperty("amount");
    expect(bookingHasPaymentInfo?.payment).toHaveProperty("method");
    expect(bookingHasPaymentInfo?.payment).toHaveProperty("pidx");
    expect(bookingHasPaymentInfo?.payment).toHaveProperty("paymentUrl");
    expect(bookingHasPaymentInfo?.payment).toHaveProperty("expiresAt");
    expect(bookingHasPaymentInfo?.payment).toHaveProperty("status");
    expect(bookingHasPaymentInfo?.payment.status).toBe("PENDING");
  });

  it("should return the same payment link if the payment is not expired", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    expect(booking.status).toBe(201);
    expect(booking.body).toHaveProperty("status");
    expect(booking.body.status).toBe("NEW");

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60000);

    const fakeKhaltiResponse = {
      pidx: faker.database.mongodbObjectId(),
      paymentUrl: faker.internet.url(),
      expiresAt,
    };
    jest
      .spyOn(bookingsUtils, "initiateKhaltiPaymentRequest")
      .mockResolvedValue(fakeKhaltiResponse);

    const oldResponse = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl:
          "https://phishit-ui.tnbswap.com/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(oldResponse.status).toBe(200);
    expect(oldResponse.body).toHaveProperty("pidx");
    expect(oldResponse.body).toHaveProperty("paymentUrl");
    expect(oldResponse.body).toHaveProperty("expiresAt");

    const newFakeKhaltiResponse = {
      pidx: faker.database.mongodbObjectId(),
      paymentUrl: faker.internet.url(),
      expiresAt: faker.date.past(),
    };
    jest
      .spyOn(bookingsUtils, "initiateKhaltiPaymentRequest")
      .mockResolvedValue(newFakeKhaltiResponse);

    const res = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl:
          "https://phishit-ui.tnbswap.com/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("pidx");
    expect(res.body).toHaveProperty("paymentUrl");
    expect(res.body).toHaveProperty("expiresAt");
    expect(res.body.pidx).toBe(oldResponse.body.pidx);
    expect(res.body.paymentUrl).toBe(oldResponse.body.paymentUrl);
    expect(res.body.expiresAt).toBe(oldResponse.body.expiresAt);
  });

  it("should return the different payment link if the payment is expired", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    expect(booking.status).toBe(201);
    expect(booking.body).toHaveProperty("status");
    expect(booking.body.status).toBe("NEW");

    const fakeKhaltiResponse = {
      pidx: faker.database.mongodbObjectId(),
      paymentUrl: faker.internet.url(),
      expiresAt: faker.date.past(),
    };
    jest
      .spyOn(bookingsUtils, "initiateKhaltiPaymentRequest")
      .mockResolvedValue(fakeKhaltiResponse);

    const oldResponse = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl:
          "https://phishit-ui.tnbswap.com/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(oldResponse.status).toBe(200);
    expect(oldResponse.body).toHaveProperty("pidx");
    expect(oldResponse.body).toHaveProperty("paymentUrl");
    expect(oldResponse.body).toHaveProperty("expiresAt");

    const newFakeKhaltiResponse = {
      pidx: faker.database.mongodbObjectId(),
      paymentUrl: faker.internet.url(),
      expiresAt: faker.date.past(),
    };
    jest
      .spyOn(bookingsUtils, "initiateKhaltiPaymentRequest")
      .mockResolvedValue(newFakeKhaltiResponse);

    const res = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl:
          "https://phishit-ui.tnbswap.com/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("pidx");
    expect(res.body).toHaveProperty("paymentUrl");
    expect(res.body).toHaveProperty("expiresAt");
    expect(res.body.pidx).toBe(newFakeKhaltiResponse.pidx);
    expect(res.body.paymentUrl).toBe(newFakeKhaltiResponse.paymentUrl);
    expect(res.body.expiresAt).toBe(
      newFakeKhaltiResponse.expiresAt.toISOString()
    );
  });
});

describe("POST /api/bookings/:id/verify-payment", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .post("/api/bookings/123/verify-payment")
      .send({});
    expect(res.status).toBe(401);
  });

  it("should return 400 if invalid boooking id is provided", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/bookings/123/verify-payment")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({
      path: "id",
      location: "params",
    });
  });

  it("should return 404 if booking with provided id does not exist", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/bookings/5f7a5d713d0f4d1b2c5e3f6e/verify-payment")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl: "http://127.0.0.1:3000/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
  });

  it("should return 409 if booking is already processed", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const booking = await request(app)
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
      booking.body._id,
      {
        status: "CONFIRMED",
      },
      { new: true }
    );

    const res = await request(app)
      .post(`/api/bookings/${booking.body._id}/verify-payment`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(errorMessages.BOOKING_ALREADY_PROCESSED);
  });

  it("should return 503 if booking is not processed but payment verification fails", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    const fakeKhaltiResponse = {
      pidx: "QXnwaNmqwmFnNL7EaSM5a9",
      paymentUrl: "https://test-pay.khalti.com/?pidx=QXnwaNmqwmFnNL7EaSM5a9",
      expiresAt: new Date(),
    };
    jest
      .spyOn(bookingsUtils, "initiateKhaltiPaymentRequest")
      .mockResolvedValue(fakeKhaltiResponse);

    const initiatePaymentResponse = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl: "http://127.0.0.1:3000/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(initiatePaymentResponse.status).toBe(200);

    jest
      .spyOn(bookingsUtils, "lookupKhaltiPayment")
      .mockRejectedValue(new CustomError("Error", 503));

    const res = await request(app)
      .post(`/api/bookings/${booking.body._id}/verify-payment`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(503);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 202 if booking is not processed but payment verification is pending", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    const fakeinitiateKhaltiPaymentResponse = {
      pidx: "QXnwaNmqwmFnNL7EaSM5a9",
      paymentUrl: "https://test-pay.khalti.com/?pidx=QXnwaNmqwmFnNL7EaSM5a9",
      expiresAt: new Date(),
    };
    jest
      .spyOn(bookingsUtils, "initiateKhaltiPaymentRequest")
      .mockResolvedValue(fakeinitiateKhaltiPaymentResponse);

    const initiatePaymentResponse = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl: "http://127.0.0.1:3000/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(initiatePaymentResponse.status).toBe(200);

    const fakeKhaltiResponse = {
      pidx: "QXnwaNmqwmFnNL7EaSM5a9",
      total_amount: 1000,
      status: "Initiated",
      transaction_id: "123",
    };
    jest
      .spyOn(bookingsUtils, "lookupKhaltiPayment")
      .mockResolvedValue(fakeKhaltiResponse);

    const res = await request(app)
      .post(`/api/bookings/${booking.body._id}/verify-payment`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(errorMessages.PAYMENT_PENDING);
  });

  it("should return 422 if booking is not processed but payment verification is failed", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    const fakeinitiateKhaltiPaymentResponse = {
      pidx: "QXnwaNmqwmFnNL7EaSM5a9",
      paymentUrl: "https://test-pay.khalti.com/?pidx=QXnwaNmqwmFnNL7EaSM5a9",
      expiresAt: new Date(),
    };
    jest
      .spyOn(bookingsUtils, "initiateKhaltiPaymentRequest")
      .mockResolvedValue(fakeinitiateKhaltiPaymentResponse);

    const initiatePaymentResponse = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl: "http://127.0.0.1:3000/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(initiatePaymentResponse.status).toBe(200);

    const fakeKhaltiResponse = {
      pidx: "QXnwaNmqwmFnNL7EaSM5a9",
      total_amount: 1000,
      status: "Expired",
      transaction_id: "123",
    };
    jest
      .spyOn(bookingsUtils, "lookupKhaltiPayment")
      .mockResolvedValue(fakeKhaltiResponse);

    const res = await request(app)
      .post(`/api/bookings/${booking.body._id}/verify-payment`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(errorMessages.PAYMENT_FAILED);

    const failedBooking = await Booking.findOne({
      _id: booking.body._id,
    });
    expect(failedBooking).toHaveProperty("payment");
    expect(failedBooking?.status).toBe("CANCELLED");
    expect(failedBooking?.payment.status).toBe("FAILED");
  });

  it("should return 200 if booking is not processed and type is valid", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const adventures = await seedAdventures({
      numberOfAdventures: 2,
      numberOfPackages: 2,
      numberOfGuides: 2,
    });

    const booking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    const fakeinitiateKhaltiPaymentResponse = {
      pidx: "QXnwaNmqwmFnNL7EaSM5a9",
      paymentUrl: "https://test-pay.khalti.com/?pidx=QXnwaNmqwmFnNL7EaSM5a9",
      expiresAt: new Date(),
    };
    jest
      .spyOn(bookingsUtils, "initiateKhaltiPaymentRequest")
      .mockResolvedValue(fakeinitiateKhaltiPaymentResponse);

    const initiatePaymentResponse = await request(app)
      .post(`/api/bookings/${booking.body._id}/initiate-payment`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        method: "KHALTI",
        redirectUrl: "http://127.0.0.1:3000/bookings/5f7a5d713d0f4d1b2c5e3f6e",
      });

    expect(initiatePaymentResponse.status).toBe(200);

    const fakeKhaltiResponse = {
      pidx: "QXnwaNmqwmFnNL7EaSM5a9",
      total_amount: 1000,
      status: "Completed",
      transaction_id: "123",
    };
    jest
      .spyOn(bookingsUtils, "lookupKhaltiPayment")
      .mockResolvedValue(fakeKhaltiResponse);

    const res = await request(app)
      .post(`/api/bookings/${booking.body._id}/verify-payment`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("adventure");
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("CONFIRMED");
    expect(res.body).toHaveProperty("payment");
    expect(res.body.payment.status).toBe("COMPLETED");
  });
});
