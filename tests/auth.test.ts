import request from "supertest";
import app from "../src/app";

describe("Auth Route Testing : /api/auth", function () {
  test('Without Body Credintial', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
  });
})