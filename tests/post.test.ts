import request from "supertest";
import app from "../src/app";

describe('Test Posts Route :/api/posts', function () {
  test('Get All posts', async function () {
    const response = await request(app).get('/api/posts');
    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });
});