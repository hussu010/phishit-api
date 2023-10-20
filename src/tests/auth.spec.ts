import { connect, clear, close } from "./test-db-connect.helper";

import request from "supertest";
import app from "../../index";

import { errorMessages, successMessages } from "../common/config/messages";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe("POST /api/auth/otp", () => {
  it("should throw 400 if phoneNumber is not present on the body of the request", async () => {
    const res = await request(app)
      .post("/api/auth/otp")
      .send({})
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: errorMessages.INVALID_PHONE_NUMBER,
            path: "phoneNumber",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should throw 400 if phoneNumber is not valid", async () => {
    const res = await request(app)
      .post("/api/auth/otp")
      .send({
        phoneNumber: "8000000000",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: errorMessages.INVALID_PHONE_NUMBER,
            path: "phoneNumber",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 200 if phoneNumber is valid", async () => {
    const res = await request(app)
      .post("/api/auth/otp")
      .send({
        phoneNumber: "9840000000",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: successMessages.OTP_SENT_SUCCESSFULLY,
      })
    );
  });

  it("should throw 500 if SMS cannot be sent", async () => {
    // TODO: Implement this test
  });
});
