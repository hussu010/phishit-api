import { connect, clear, close } from "./test-db-connect.helper";

import { faker } from "@faker-js/faker";

import request from "supertest";
import app from "../../index";
import { seedAdventures } from "../seed/adventures";
import { errorMessages } from "../common/config/messages";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe("GET /api/adventures", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/api/adventures");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 200 OK with adventures", async () => {
    const numberOfAdventures = 6;
    const numberOfPackages = 6;

    await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    const res = await request(app).get("/api/adventures");
    expect(res.status).toBe(200);

    expect(res.body.length).toEqual(numberOfAdventures);
    expect(res.body[0].packages.length).toEqual(numberOfPackages);

    expect(res.body[0]).toHaveProperty("_id");
    expect(res.body[0]).toHaveProperty("title");
    expect(res.body[0]).toHaveProperty("description");
    expect(res.body[0]).toHaveProperty("imageUrl");
    expect(res.body[0]).toHaveProperty("imageAlt");
    expect(res.body[0]).toHaveProperty("location");
    expect(res.body[0]).toHaveProperty("packages");

    expect(res.body[0].location).toHaveProperty("type");
    expect(res.body[0].location).toHaveProperty("coordinates");

    expect(res.body[0].packages[0]).toHaveProperty("_id");
    expect(res.body[0].packages[0]).toHaveProperty("title");
    expect(res.body[0].packages[0]).toHaveProperty("price");
    expect(res.body[0].packages[0]).toHaveProperty("description");
    expect(res.body[0].packages[0]).toHaveProperty("duration");
  });
});

describe("GET /api/adventures/:id", () => {
  it("should return 400 Bad Request", async () => {
    const res = await request(app).get("/api/adventures/123");
    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({ path: "id", location: "params" });
  });

  it("should return 404 Not Found", async () => {
    const res = await request(app).get(
      "/api/adventures/5f7a5d713d0f4d1b2c5e3f6e"
    );
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: errorMessages.OBJECT_WITH_ID_NOT_FOUND,
    });
  });

  it("should return 200 OK with adventure", async () => {
    const numberOfAdventures = 6;
    const numberOfPackages = 6;

    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    const res = await request(app).get(`/api/adventures/${adventures[0]._id}`);
    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("imageUrl");
    expect(res.body).toHaveProperty("imageAlt");
    expect(res.body).toHaveProperty("location");
    expect(res.body).toHaveProperty("packages");

    expect(res.body.location).toHaveProperty("type");
    expect(res.body.location).toHaveProperty("coordinates");

    expect(res.body.packages[0]).toHaveProperty("_id");
    expect(res.body.packages[0]).toHaveProperty("title");
    expect(res.body.packages[0]).toHaveProperty("price");
    expect(res.body.packages[0]).toHaveProperty("description");
    expect(res.body.packages[0]).toHaveProperty("duration");
  });
});

describe("POST /api/adventures", () => {
  it("should return 400 Bad Request", async () => {
    const res = await request(app)
      .post("/api/adventures")
      .send({
        title: "a",
        description: "a",
        location: {
          type: "a",
          coordinates: "[0, 0]",
        },
        imageUrl: "a",
        imageAlt: "a",
        images: [
          {
            url: "a",
            position: "a",
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
      path: "title",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "description",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "location.type",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "location.coordinates",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "imageUrl",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "imageAlt",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "images[0].url",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "images[0].position",
      location: "body",
    });
  });

  it("should return 201 Created", async () => {
    const res = await request(app)
      .post("/api/adventures")
      .send({
        title: "a".repeat(3),
        description: "a".repeat(16),
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        imageUrl: faker.image.urlLoremFlickr(),
        imageAlt: faker.lorem.words(3),
        images: [
          {
            url: faker.image.urlLoremFlickr(),
            position: 1,
          },
        ],
      });
    expect(res.status).toBe(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("imageUrl");
    expect(res.body).toHaveProperty("imageAlt");
    expect(res.body).toHaveProperty("location");
    expect(res.body).toHaveProperty("packages");

    expect(res.body.location).toHaveProperty("type");
    expect(res.body.location).toHaveProperty("coordinates");
  });
});
