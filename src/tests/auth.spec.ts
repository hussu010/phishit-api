import { connect, clear, close } from "./test-db-connect.helper";

import request from "supertest";
import app from "../../index";

import { errorMessages, successMessages } from "../common/config/messages";
import { getUserUsingPhoneNumber } from "../auth/auth.service";
import { generateUserOtp } from "../auth/otp.service";

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

describe("POST /api/v1/auth/jwt/create", () => {
  it("should validate phone number and code is present on the body of request", async () => {
    const res = await request(app)
      .post("/api/auth/jwt/create")
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
          expect.objectContaining({
            msg: errorMessages.INVALID_OTP_LENGTH,
            path: "code",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should validate phone number is valid", async () => {
    const res = await request(app)
      .post("/api/auth/jwt/create")
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

  it("should validate otp is of right length", async () => {
    const res = await request(app)
      .post("/api/auth/jwt/create")
      .send({
        phoneNumber: "9000000000",
        code: "1212",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: errorMessages.INVALID_OTP_LENGTH,
            path: "code",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should validate if the code is valid", async () => {
    const res = await request(app)
      .post("/api/auth/jwt/create")
      .send({
        phoneNumber: "9840000000",
        code: "123456",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.INVALID_OTP,
      })
    );
  });

  it("should return access and refresh token if phone number and code is valid", async () => {
    const phoneNumber = "9840000000";
    const user = await getUserUsingPhoneNumber(phoneNumber);
    const { otp } = await generateUserOtp(user, "AUTH");

    const res = await request(app)
      .post("/api/auth/jwt/create")
      .send({
        phoneNumber,
        code: otp,
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      })
    );
  });
});
