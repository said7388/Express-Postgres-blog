import request from "supertest";
import { redis } from "../config/redis.config";
import app from "../src/app";

const token = process.env.JWT_TOKEN;

describe("Reaction Router Suite :/api/reactions", () => {
  test("Should get all reactions for a post.", async () => {
    const res = await request(app).get("/api/reactions/1");

    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
    expect(Array.isArray(res.body.reactions)).toBeTruthy();
  });

  test("Should get error for missing auth token to react a post.", async () => {
    const res = await request(app).put("/api/reactions").send({
      post_id: 1,
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication token missing");
  });

  test("Should get an error for missing post_id in payload.", async () => {
    const res = await request(app).put("/api/reactions").set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(`"post_id" is required`);
  });

  test("Should create or remove a reaction.", async () => {
    const res = await request(app).put("/api/reactions").send({
      post_id: 1,
    }).set('Authorization', `Bearer ${token}`);

    expect(res.body.success).toBeTruthy();
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    // Close the Redis connection after all tests have finished
    await redis.quit();
  });
});
