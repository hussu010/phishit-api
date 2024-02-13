import { connect, clear, close } from "./test-db-connect.helper";

import request from "supertest";
import app from "../../index";
import { seedInteractions } from "./backoffice.helper";
import { errorMessages } from "../common/config/messages";
import { getAuthenticatedUserJWT, getUserWithRole } from "./auth.helper";
import { generateJWT } from "../auth/auth.service";
import Booking from "../bookings/bookings.model";
import redisClient from "../common/config/redis-client";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
  await redisClient.flushall();
});
afterAll(async () => await close());

describe("GET /backoffice/interactions", () => {
  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).get("/api/backoffice/interactions");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 403 if user is not an admin", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .get("/api/backoffice/interactions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 400 if limit or offset is not a number", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .get(
        "/api/backoffice/interactions?limit=not-a-number&offset=not-a-number"
      )
      .set("Authorization", `Bearer ${accessToken}`);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({ path: "limit", location: "query" });
    expect(errorDetails).toContainEqual({ path: "offset", location: "query" });
  });

  it("should return 200 with no interactions if there are no interactions", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .get("/api/backoffice/interactions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveLength(0);
  });

  it("should return 200 with interactions if there are interactions", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    await seedInteractions({ noOfInteractions: 10 });

    const res = await request(app)
      .get("/api/backoffice/interactions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveLength(10);
  });

  it("should return 200 with interactions and pagination details", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    await seedInteractions({ noOfInteractions: 20 });

    const res = await request(app)
      .get("/api/backoffice/interactions?limit=5&offset=18")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveLength(2);
    expect(res.body).toHaveProperty("total");
    expect(res.body.total).toBe(20);
    expect(res.body).toHaveProperty("count");
    expect(res.body.count).toBe(2);
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("offset");
  });
});
