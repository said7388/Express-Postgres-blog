import request from "supertest";
import app from "../src/app";

const token = process.env.JWT_TOKEN;

describe('Test suites for Posts Route :/api/posts', function () {
  test('Get All posts', async function () {
    const response = await request(app).get('/api/posts');
    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  test("Request protected route without token.", async function () {
    const response = await request(app).get('/api/posts/me');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication token missing");
  });

  test("Get all post for a user with token.", async function () {
    const response = await request(app).get('/api/posts/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  test("Get a single post by id.", async function () {
    const response = await request(app).get('/api/posts/view/1');
    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(Object(response.body.data)).toBeTruthy();
  });
});

