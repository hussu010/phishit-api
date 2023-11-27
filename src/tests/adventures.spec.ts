import { connect, clear, close } from "./test-db-connect.helper";

import request from "supertest";
import app from "../../index";
import { seedAdventures } from "../seed/adventures";

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
    expect(res.body[0]).toHaveProperty("summary");
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
