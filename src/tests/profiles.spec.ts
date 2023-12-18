import { connect, clear, close } from "./test-db-connect.helper";

import request from "supertest";
import app from "../../index";
import { errorMessages } from "../common/config/messages";
import { getAuthenticatedUserJWT, getDeletedUserJWT } from "./auth.helper";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe("GET /api/profiles", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .get("/api/profiles")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 401 if invalid jwt type is provided", async () => {
    const { refreshToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .get("/api/profiles")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${refreshToken}`);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.INVALID_JWT_TYPE,
      })
    );
  });

  it("should return 401 if user associated with jwt not found", async () => {
    const accessToken = await getDeletedUserJWT();

    const res = await request(app)
      .get("/api/profiles")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.USER_ASSOCIATED_WITH_JWT_NOT_FOUND,
      })
    );
  });

  it("should return 404 if profile associated with user is not found", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .get("/api/profiles")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.PROFILE_NOT_FOUND,
      })
    );
  });

  it("should return 200 and profile if the user is authenticated and has profile", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    await request(app)
      .put("/api/profiles")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        fullName: "Trilok Technology",
        email: "random@email.com",
        gender: "MALE",
        dateOfBirth: "1998-10-10",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      });

    const res = await request(app)
      .get("/api/profiles")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        fullName: expect.any(String),
        email: expect.any(String),
        gender: expect.any(String),
        dateOfBirth: expect.any(String),
        bio: expect.any(String),
        avatar: expect.any(String),
      })
    );
  });
});

describe("PUT /api/profiles", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .put("/api/profiles")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 400 if the request body is invalid", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();
    const res = await request(app)
      .put("/api/profiles")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        fullName: "aa",
        email: "aaa",
        gender: "RANDOM",
        dateOfBirth: "YYYY-MM-DD",
        bio: "aa",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "gender",
            location: "body",
          }),
          expect.objectContaining({
            path: "dateOfBirth",
            location: "body",
          }),
          expect.objectContaining({
            path: "fullName",
            location: "body",
          }),
          expect.objectContaining({
            path: "email",
            location: "body",
          }),
          expect.objectContaining({
            path: "bio",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 200 and profile if the user is authenticated", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .put("/api/profiles")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        fullName: "Trilok Technology",
        email: "random@email.com",
        gender: "MALE",
        dateOfBirth: "1998-10-10",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        fullName: expect.any(String),
        email: expect.any(String),
        gender: expect.any(String),
        dateOfBirth: expect.any(String),
        bio: expect.any(String),
        avatar: expect.any(String),
      })
    );
  });
});
