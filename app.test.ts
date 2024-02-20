import request from "supertest";
import app from "./app";


describe('Test Home Route :/', function () {
  test('Home route should return a text with status code 200', async function () {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).not.toBeNull();
  });
});

describe('Test Posts Route :/posts', function () {
  test('Get All posts', async function () {
    const response = await request(app).get('/api/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });
});

describe("Auth Route Testing : /api/auth", function () {
  test('Without Body Credintial', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
  });
})