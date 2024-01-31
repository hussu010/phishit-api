import { connect, clear, close } from "./test-db-connect.helper";

import { faker } from "@faker-js/faker";

import request from "supertest";
import app from "../../index";
import { seedAdventures } from "./adventures.helper";
import { errorMessages } from "../common/config/messages";
import {
  getAuthenticatedUserJWT,
  getDeletedUserJWT,
  getUserWithRole,
} from "./auth.helper";
import { generateJWT } from "../auth/auth.service";
import Booking from "../bookings/bookings.model";

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
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .post("/api/adventures")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 401 if invalid jwt type is provided", async () => {
    const { refreshToken } = await getAuthenticatedUserJWT();
    const res = await request(app)
      .post("/api/adventures")
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
      .post("/api/adventures")
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

  it("should return 403 if user is not an admin", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .post("/api/adventures")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.FORBIDDEN);
  });

  it("should return 400 Bad Request", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/adventures")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
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
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/adventures")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
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

describe("DELETE /api/adventures/:id", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .delete("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 403 if user is not an admin", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .delete("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.FORBIDDEN);
  });

  it("should return 403 if user is not an SUPER_ADMIN", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .delete("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.FORBIDDEN);
  });

  it("should return 400 Bad Request with invalid id", async () => {
    const user = await getUserWithRole("SUPER_ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .delete("/api/adventures/123")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({ path: "id", location: "params" });
  });

  it("should return 404 when adventure is not found", async () => {
    const user = await getUserWithRole("SUPER_ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .delete("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: errorMessages.OBJECT_WITH_ID_NOT_FOUND,
    });
  });

  it("should return 204 if the adventure is deleted successfully", async () => {
    const user = await getUserWithRole("SUPER_ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 6;
    const numberOfPackages = 6;

    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    const res = await request(app)
      .delete(`/api/adventures/${adventures[0]._id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(204);
  });
});

describe("PUT /api/adventures/:id", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .post("/api/adventures")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 403 if user is not an admin", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .post("/api/adventures")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.FORBIDDEN);
  });

  it("should return 400 Bad Request with invalid paramters", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .put("/api/adventures/123")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
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
      path: "id",
      location: "params",
    });
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

  it("should return 404 Not Found", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .put("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
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
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: errorMessages.OBJECT_WITH_ID_NOT_FOUND,
    });
  });

  it("should return 200 OK when adventure is updated", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 6;
    const numberOfPackages = 6;

    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    const newTitle = "a".repeat(3);
    const newDescription = "a".repeat(16);
    const newLocation = {
      type: "Point",
      coordinates: [0, 0],
    };
    const newImageUrl = faker.image.urlLoremFlickr();
    const newImageAlt = faker.lorem.words(3);
    const newImages = [
      {
        url: faker.image.urlLoremFlickr(),
        position: 1,
      },
      {
        url: faker.image.urlLoremFlickr(),
        position: 2,
      },
    ];

    const res = await request(app)
      .put(`/api/adventures/${adventures[0]._id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: newTitle,
        description: newDescription,
        location: newLocation,
        imageUrl: newImageUrl,
        imageAlt: newImageAlt,
        images: newImages,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("imageUrl");
    expect(res.body).toHaveProperty("imageAlt");
    expect(res.body).toHaveProperty("location");

    expect(res.body.title).toEqual(newTitle);
    expect(res.body.description).toEqual(newDescription);
    expect(res.body.location).toEqual(newLocation);
    expect(res.body.imageUrl).toEqual(newImageUrl);
    expect(res.body.imageAlt).toEqual(newImageAlt);

    const expectedImages = newImages.map((img) => expect.objectContaining(img));
    expect(res.body.images).toEqual(expect.arrayContaining(expectedImages));
  });
});

describe("POST /api/adventures/:id/enroll", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/enroll")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 403 if user is not an guide", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/enroll")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.FORBIDDEN);
  });

  it("should return 400 Bad Request with invalid id", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/adventures/123/enroll")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({ path: "id", location: "params" });
  });

  it("should return 404 if adventure does not exists", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/enroll")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: errorMessages.OBJECT_WITH_ID_NOT_FOUND,
    });
  });

  it("should return 204 No Content when user is enrolled", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 6;
    const numberOfPackages = 6;

    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    const res = await request(app)
      .post(`/api/adventures/${adventures[0]._id}/enroll`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(204);

    const resUserInfo = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(resUserInfo.status).toBe(200);
    expect(resUserInfo.body).toHaveProperty("adventures");
    expect(resUserInfo.body.adventures).toBeInstanceOf(Array);
    expect(resUserInfo.body.adventures.length).toBe(1);
  });

  it("should return 409 Conflict when user is already enrolled", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 6;
    const numberOfPackages = 6;

    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    await request(app)
      .post(`/api/adventures/${adventures[0]._id}/enroll`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    const res = await request(app)
      .post(`/api/adventures/${adventures[0]._id}/enroll`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      message: errorMessages.GUIDE_ALREADY_ENROLLED,
    });
  });
});

describe("POST /api/adventures/:id/unenroll", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/unenroll")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 403 if user is not an guide", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/unenroll")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.FORBIDDEN);
  });

  it("should return 400 Bad Request with invalid id", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/adventures/123/unenroll")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({ path: "id", location: "params" });
  });

  it("should return 404 if adventure does not exists", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/unenroll")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: errorMessages.OBJECT_WITH_ID_NOT_FOUND,
    });
  });

  it("should return 204 No Content when user is unenrolled", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 6;
    const numberOfPackages = 6;

    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    const enrollGuide = await request(app)
      .post(`/api/adventures/${adventures[0]._id}/enroll`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(enrollGuide.status).toBe(204);

    const res = await request(app)
      .post(`/api/adventures/${adventures[0]._id}/unenroll`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(204);
  });

  it("should return 409 Conflict when user is not enrolled", async () => {
    const user = await getUserWithRole("GUIDE");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 6;
    const numberOfPackages = 6;

    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    const res = await request(app)
      .post(`/api/adventures/${adventures[0]._id}/unenroll`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      message: errorMessages.GUIDE_NOT_ENROLLED,
    });
  });
});

describe("GET /api/adventures/:id/guides", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/guides")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 400 Bad Request with invalid id", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .post("/api/adventures/123/guides")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({ path: "id", location: "params" });
    expect(errorDetails).toContainEqual({
      path: "startDate",
      location: "body",
    });
  });

  it("should return 404 if adventure does not exists", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/guides")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        startDate: new Date(),
      });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: errorMessages.OBJECT_WITH_ID_NOT_FOUND,
    });
  });

  it("should return 200 OK with available guides", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const adventures = await seedAdventures({
      numberOfAdventures: 1,
      numberOfPackages: 1,
      numberOfGuides: 5,
    });

    const res = await request(app)
      .post(`/api/adventures/${adventures[0]._id}/guides`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        startDate: new Date(),
      });

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(5);
    expect(res.body[0]).toHaveProperty("_id");
    expect(res.body[0]).toHaveProperty("username");
  });

  it("should return 200 OK with empty array when no guides are available", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const adventures = await seedAdventures({
      numberOfAdventures: 1,
      numberOfPackages: 1,
      numberOfGuides: 0,
    });

    const res = await request(app)
      .post(`/api/adventures/${adventures[0]._id}/guides`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        startDate: new Date(),
      });

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });

  it("should list out unavailable guides", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const adventures = await seedAdventures({
      numberOfAdventures: 1,
      numberOfPackages: 1,
      numberOfGuides: 5,
    });

    const priorBooking = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        adventureId: adventures[0]._id,
        packageId: adventures[0].packages[0]._id,
        guideId: adventures[0].guides[0]._id,
        startDate: "2020-10-10",
        noOfPeople: 5,
      });

    await Booking.findByIdAndUpdate(
      priorBooking.body._id,
      {
        status: "CONFIRMED",
      },
      { new: true }
    );

    const res = await request(app)
      .post(`/api/adventures/${adventures[0]._id}/guides`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        startDate: "2020-10-10",
      });

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(5);
    expect(res.body[0]).toHaveProperty("_id");
    expect(res.body[0]).toHaveProperty("username");
    expect(res.body[0]).toHaveProperty("isAvailable");
    expect(res.body[0].isAvailable).toBe(false);
  });
});

describe("POST /api/adventures/:id/packages", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/packages")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 403 if user is not an admin", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/packages")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.FORBIDDEN);
  });

  it("should return 400 Bad Request with invalid id and other parameters", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/adventures/123/packages")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "a",
        price: "a",
        description: "a",
        duration: "a",
      });
    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));

    expect(errorDetails).toContainEqual({
      path: "id",
      location: "params",
    });
    expect(errorDetails).toContainEqual({
      path: "title",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "price",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "description",
      location: "body",
    });
  });

  it("should return 404 Not Found if adventure does not exists", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .post("/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/packages")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "a".repeat(3),
        price: 100,
        description: "a".repeat(16),
        duration: 1,
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
  });

  it("should return 201 Created when package is created", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 1;
    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages: 0,
    });

    const res = await request(app)
      .post(`/api/adventures/${adventures[0]._id}/packages`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "a".repeat(3),
        price: 100,
        description: "a".repeat(16),
        duration: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("price");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("duration");

    const resAdventure = await request(app).get(
      `/api/adventures/${adventures[0]._id}`
    );

    expect(resAdventure.status).toBe(200);
    expect(resAdventure.body.packages).toBeInstanceOf(Array);
    expect(resAdventure.body.packages.length).toBe(1);
    expect(resAdventure.body.packages[0]).toHaveProperty("_id");
    expect(resAdventure.body.packages[0]._id).toBe(res.body._id);
  });
});

describe("PUT /api/adventures/:id/packages/:packageId", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .put(
        "/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/packages/5f7a5d713d0f4d1b2c5e3f6e"
      )
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 403 if user is not an admin", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .put(
        "/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/packages/5f7a5d713d0f4d1b2c5e3f6e"
      )
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.FORBIDDEN);
  });

  it("should return 400 Bad Request with invalid id and other parameters", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .put("/api/adventures/123/packages/123")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "a",
        price: "a",
        description: "a",
        duration: "a",
      });
    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));
    expect(errorDetails).toContainEqual({ path: "id", location: "params" });
    expect(errorDetails).toContainEqual({
      path: "packageId",
      location: "params",
    });
    expect(errorDetails).toContainEqual({
      path: "title",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "price",
      location: "body",
    });
    expect(errorDetails).toContainEqual({
      path: "description",
      location: "body",
    });
  });

  it("should return 404 Not Found if adventure does not exists", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .put(
        `/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/packages/5f7a5d713d0f4d1b2c5e3f6e`
      )
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "a".repeat(3),
        price: 100,
        description: "a".repeat(16),
        duration: 1,
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
  });

  it("should return 404 Not Found if package does not exists", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 1;
    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages: 0,
    });

    const res = await request(app)
      .put(
        `/api/adventures/${adventures[0]._id}/packages/5f7a5d713d0f4d1b2c5e3f6e`
      )
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "a".repeat(3),
        price: 100,
        description: "a".repeat(16),
        duration: 1,
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
  });

  it("should return 200 OK when package is updated", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 1;
    const numberOfPackages = 1;
    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    const newTitle = "a".repeat(3);
    const newPrice = 100;
    const newDescription = "a".repeat(16);
    const newDuration = 1;

    const res = await request(app)
      .put(
        `/api/adventures/${adventures[0]._id}/packages/${adventures[0].packages[0]._id}`
      )
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: newTitle,
        price: newPrice,
        description: newDescription,
        duration: newDuration,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("price");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("duration");

    expect(res.body.title).toEqual(newTitle);
    expect(res.body.price).toEqual(newPrice);
    expect(res.body.description).toEqual(newDescription);
    expect(res.body.duration).toEqual(newDuration);

    const resAdventure = await request(app).get(
      `/api/adventures/${adventures[0]._id}`
    );

    expect(resAdventure.status).toBe(200);
    expect(resAdventure.body.packages).toBeInstanceOf(Array);
    expect(resAdventure.body.packages.length).toBe(1);
    expect(resAdventure.body.packages[0]).toHaveProperty("title");
    expect(resAdventure.body.packages[0].title).toBe(newTitle);
  });
});

describe("DELETE /api/adventures/:id/packages/:packageId", () => {
  it("should return 401 if user is not logged in", async () => {
    const res = await request(app)
      .delete(
        "/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/packages/5f7a5d713d0f4d1b2c5e3f6e"
      )
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 403 if user is not an admin", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .delete(
        "/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/packages/5f7a5d713d0f4d1b2c5e3f6e"
      )
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.FORBIDDEN);
  });

  it("should return 400 Bad Request with invalid id", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .delete("/api/adventures/123/packages/123")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeInstanceOf(Array);

    const errorDetails = res.body.errors.map((error) => ({
      path: error.path,
      location: error.location,
    }));
    expect(errorDetails).toContainEqual({ path: "id", location: "params" });
    expect(errorDetails).toContainEqual({
      path: "packageId",
      location: "params",
    });
  });

  it("should return 404 Not Found if adventure does not exists", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app)
      .delete(
        "/api/adventures/5f7a5d713d0f4d1b2c5e3f6e/packages/5f7a5d713d0f4d1b2c5e3f6e"
      )
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
  });

  it("should return 404 Not Found if package does not exists", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 1;
    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages: 0,
    });

    const res = await request(app)
      .delete(
        `/api/adventures/${adventures[0]._id}/packages/5f7a5d713d0f4d1b2c5e3f6e`
      )
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
  });

  it("should return 204 No Content when package is deleted", async () => {
    const user = await getUserWithRole("ADMIN");
    const accessToken = await generateJWT(user, "ACCESS");

    const numberOfAdventures = 1;
    const numberOfPackages = 1;
    const adventures = await seedAdventures({
      numberOfAdventures,
      numberOfPackages,
    });

    const res = await request(app)
      .delete(
        `/api/adventures/${adventures[0]._id}/packages/${adventures[0].packages[0]._id}`
      )
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(204);

    const resAdventure = await request(app).get(
      `/api/adventures/${adventures[0]._id}`
    );

    expect(resAdventure.status).toBe(200);
    expect(resAdventure.body.packages).toBeInstanceOf(Array);
    expect(resAdventure.body.packages.length).toBe(0);
  });
});
