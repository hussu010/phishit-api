import { connect, clear, close } from "./test-db-connect.helper";

import { faker } from "@faker-js/faker";

import request from "supertest";
import app from "../../index";

import { errorMessages } from "../common/config/messages";
import { getAuthenticatedUserJWT, getUserWithRole } from "./auth.helper";
import { generateJWT } from "../auth/auth.service";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe("GET /users/me", () => {
  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).get("/api/users/me");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 200 if user is authenticated", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("roles");
    expect(res.body).toHaveProperty("adventures");
  });
});

describe("PUT /users/me/username", () => {
  it("should return 401 if user is not authenticated", async () => {
    const username = faker.internet.userName();

    const res = await request(app).put("/api/users/me/username").send({
      username,
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 400 if username is not provided", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .put("/api/users/me/username")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({ path: "username", location: "body" });
  });

  it("should return 409 if username is already taken", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .put("/api/users/me/username")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        username: user.username,
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.USERNAME_ALREADY_EXISTS);
  });

  it("should return 200 if username is updated successfully", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const username = faker.internet.userName();

    const res = await request(app)
      .put("/api/users/me/username")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        username,
      });

    expect(res.status).toBe(200);
    expect(res.body.username).toEqual(username);
  });
});
