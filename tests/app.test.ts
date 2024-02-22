import request from "supertest";
import { redis } from "../config/redis.config";
import app from "../src/app";

describe('Test Home Route :/', function () {
  test('Home route should return a text with status code 200', async function () {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toEqual("Welcome to our Blog!");
  });

  afterAll(async () => {
    // Close the Redis connection after all tests have finished
    await redis.quit();
  });
});


