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

describe("POST /api/auth/jwt/refresh", () => {
  it("should validate refreshToken is present in the body of request", async () => {
    const res = await request(app)
      .post("/api/auth/jwt/refresh")
      .send({})
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "refreshToken",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should validate refreshToken is a valid JWT", async () => {
    const res = await request(app)
      .post("/api/auth/jwt/refresh")
      .send({
        refreshToken: "invalid-jwt",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "refreshToken",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 401 when jwt is invalid", async () => {
    const res = await request(app)
      .post("/api/auth/jwt/refresh")
      .send({
        refreshToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cThIIoDvwdueQB468K5xDc5633seEFoqwxjF_xSJyQQ",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 401 if accessToken is used to refresh", async () => {
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

    const { accessToken } = res.body;

    const refreshRes = await request(app)
      .post("/api/auth/jwt/refresh")
      .send({
        refreshToken: accessToken,
      })
      .set("Accept", "application/json");

    expect(refreshRes.statusCode).toEqual(401);
    expect(refreshRes.body).toHaveProperty("message");
    expect(refreshRes.body).toEqual(
      expect.objectContaining({
        message: errorMessages.INVALID_JWT_TYPE,
      })
    );
  });

  it("should return 401 if the user does not exist", async () => {
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

    const { refreshToken } = res.body;

    await user.deleteOne();

    const refreshRes = await request(app)
      .post("/api/auth/jwt/refresh")
      .send({
        refreshToken,
      })
      .set("Accept", "application/json");

    expect(refreshRes.statusCode).toEqual(401);
    expect(refreshRes.body).toHaveProperty("message");
    expect(refreshRes.body).toEqual(
      expect.objectContaining({
        message: errorMessages.INVALID_USER_ID,
      })
    );
  });

  it("should return new accessToken for a valid refreshToken", async () => {
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

    const { refreshToken } = res.body;

    const refreshRes = await request(app)
      .post("/api/auth/jwt/refresh")
      .send({
        refreshToken,
      })
      .set("Accept", "application/json");

    expect(refreshRes.statusCode).toEqual(200);
    expect(refreshRes.body).toHaveProperty("accessToken");
    expect(refreshRes.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      })
    );
  });
});

describe("GET /api/auth/o/:provider", () => {
  it("should validate provider is valid", async () => {
    const res = await request(app)
      .get("/api/auth/o/invalid-provider")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "provider",
            location: "params",
          }),
        ]),
      })
    );
  });

  it("should validate redirect_uri is present", async () => {
    const res = await request(app)
      .get("/api/auth/o/google")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "redirect_uri",
            location: "query",
          }),
        ]),
      })
    );
  });

  it("should validate redirect_uri is valid", async () => {
    const res = await request(app)
      .get("/api/auth/o/google?redirect_uri=http://evil.com")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "redirect_uri",
            location: "query",
          }),
        ]),
      })
    );
  });

  it("should return 200 if provider is valid", async () => {
    const res = await request(app)
      .get("/api/auth/o/google?redirect_uri=https://merodera.com/login")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("authorization_url");
  });
});
