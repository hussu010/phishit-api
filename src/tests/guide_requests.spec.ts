import { connect, clear, close } from "./test-db-connect.helper";

import { faker } from "@faker-js/faker";

import request from "supertest";
import app from "../../index";
import { errorMessages } from "../common/config/messages";
import {
  getAuthenticatedUserJWT,
  getDeletedUserJWT,
  getUserWithRole,
} from "./auth.helper";
import { seedGuideRequests } from "./guide_requests.helper";
import { generateJWT } from "../auth/auth.service";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe("GET /api/guide-requests", () => {
  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).get("/api/guide-requests");

    expect(res.status).toBe(401);
  });

  it("should return 403 if user is not admin or super-admin", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .get("/api/guide-requests")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(errorMessages.FORBIDDEN);
  });

  it("should return 200 and all guide requests", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    await seedGuideRequests({ numberOfGuideRequests: 10 });

    const res = await request(app)
      .get("/api/guide-requests")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(10);
    expect(res.body[0].type).toBeDefined();
    expect(res.body[0].name).toBeDefined();
    expect(res.body[0].phoneNumber).toBeDefined();
    expect(res.body[0].email).toBeDefined();
    expect(res.body[0].address).toBeDefined();
    expect(res.body[0].cover_letter).toBeDefined();
    expect(res.body[0].documents).toBeDefined();
    expect(res.body[0].status).toBeDefined();
    expect(res.body[0].createdAt).toBeDefined();
    expect(res.body[0].updatedAt).toBeDefined();
  });
});
