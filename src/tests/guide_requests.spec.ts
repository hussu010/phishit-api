import { connect, clear, close } from "./test-db-connect.helper";

import { faker } from "@faker-js/faker";

import request from "supertest";
import app from "../../index";
import { errorMessages } from "../common/config/messages";
import { getUserWithRole } from "./auth.helper";
import {
  GuideRequestDocumentTypeEnum,
  GuideTypeEnum,
} from "../common/config/enum";
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

describe("POST /api/guide-requests", () => {
  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).post("/api/guide-requests");

    expect(res.status).toBe(401);
  });

  it("should return 400 if the fields are not provided", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/guide-requests")
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
      path: "type",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "name",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "phoneNumber",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "email",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "address",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "cover_letter",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "documents",
      location: "body",
    });
  });

  it("should return 400 if fields are present but not valid", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/guide-requests")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        type: "INVALID_TYPE",
        name: faker.person.fullName(),
        phoneNumber: "1234567890",
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        cover_letter: faker.lorem.paragraph(),
        documents: [
          {
            url: faker.internet.url(),
            type: "INVALID_TYPE",
          },
        ],
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({
      path: "type",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "documents[0].type",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "phoneNumber",
      location: "body",
    });
  });

  it("should return 200 and create a guide request if fields are valid", async () => {
    const user = await getUserWithRole("GENERAL");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/guide-requests")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        type: faker.helpers.arrayElement(GuideTypeEnum),
        name: faker.person.fullName(),
        phoneNumber: "9800000000",
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        cover_letter: faker.lorem.paragraph(),
        documents: [
          {
            url: faker.internet.url(),
            type: faker.helpers.arrayElement(GuideRequestDocumentTypeEnum),
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.type).toBeDefined();
    expect(res.body.name).toBeDefined();
    expect(res.body.phoneNumber).toBeDefined();
    expect(res.body.email).toBeDefined();
    expect(res.body.address).toBeDefined();
    expect(res.body.cover_letter).toBeDefined();
    expect(res.body.documents).toBeDefined();
    expect(res.body.status).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();
  });
});
