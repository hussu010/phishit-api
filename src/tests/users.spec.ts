import { connect, clear, close } from "./test-db-connect.helper";

import { faker } from "@faker-js/faker";

import request from "supertest";
import app from "../../index";

import { errorMessages } from "../common/config/messages";
import { getAuthenticatedUserJWT, getUserWithRole } from "./auth.helper";
import { generateJWT } from "../auth/auth.service";
import { seedAdventures } from "./adventures.helper";

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

describe("PUT /users/me/update-available-status", () => {
  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).put("/api/users/me/update-available-status");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 403 if user is not a guide", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .put("/api/users/me/update-available-status")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        isAvailable: true,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.FORBIDDEN);
  });

  it("should return 400 if isAvailable is not provided", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .put("/api/users/me/update-available-status")
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
      path: "isAvailable",
      location: "body",
    });
  });

  it("should return 200 if isAvailable is updated successfully", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .put("/api/users/me/update-available-status")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        isAvailable: false,
      });

    expect(res.status).toBe(200);
    expect(res.body.isAvailable).toEqual(false);
  });
});

describe("GET /users/:username", () => {
  it("should return 404 if user with username is not found", async () => {
    const res = await request(app).get("/api/users/unknown-username");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
  });

  it("should return 200 if user with username is found", async () => {
    const user = await getUserWithRole("GENERAL");
    const res = await request(app).get(`/api/users/${user.username}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("username");
    expect(res.body.user).toHaveProperty("_id");
    expect(res.body).toHaveProperty("profile");
    expect(res.body).toHaveProperty("adventures");
  });

  it("should return 200, user profile and adventures if exists", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const profileRes = await request(app)
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

    expect(profileRes.status).toEqual(200);

    const numberOfAdventures = 6;
    const numberOfPackages = 6;

    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    const enrollAdventuresRes = await request(app)
      .post(`/api/adventures/${adventures[0]._id}/enroll`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(enrollAdventuresRes.status).toBe(204);

    const res = await request(app).get(`/api/users/${user.username}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("username");
    expect(res.body.user).toHaveProperty("_id");
    expect(res.body).toHaveProperty("profile");
    expect(res.body.profile).toHaveProperty("fullName");
    expect(res.body.profile).toHaveProperty("gender");
    expect(res.body.profile).toHaveProperty("bio");
    expect(res.body).toHaveProperty("adventures");
    expect(res.body.adventures).toBeInstanceOf(Array);
    expect(res.body.adventures).toHaveLength(1);
    expect(res.body.adventures[0]).toHaveProperty("_id");
    expect(res.body.adventures[0]._id).toBe(adventures[0]._id.toString());
  });
});
