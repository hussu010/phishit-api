import { connect, clear, close } from "./test-db-connect.helper";

import request from "supertest";
import app from "../../index";
import { getAuthenticatedUserJWT } from "./auth.helper";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe("PUT /api/v1/profiles", () => {
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
