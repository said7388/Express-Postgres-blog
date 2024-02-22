import request from "supertest";
import { redis } from "../config/redis.config";
import app from "../src/app";

// All test cases for user registration
describe("Test suites for Register Route : /api/auth/registration", function () {
  test('Should get an error for payload credintials.', async () => {
    const res = await request(app)
      .post('/api/auth/registration')
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  test("Should get an error for only email in payload.", async () => {
    const res = await request(app)
      .post('/api/auth/registration')
      .send({
        email: "abusaidriyaz@gmail.com"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"name" is required`);
  });

  test("Should get an error for only name in payload.", async () => {
    const res = await request(app)
      .post('/api/auth/registration')
      .send({
        name: "abu said"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"email" is required`);
  });

  test("Should get an error for name and email in payload.", async () => {
    const res = await request(app)
      .post('/api/auth/registration')
      .send({
        email: "abusaidriyaz@gmail.com",
        name: "abu said"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"password" is required`);
  });

  test("Should get an error for an existing email.", async () => {
    const res = await request(app)
      .post('/api/auth/registration')
      .send({
        email: "abusaidriyaz@gmail.com",
        name: "abu said",
        password: "12345678"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`User already exists with the email!`);
  });

  // test("With valid credintial", async () => {
  //   const res = await request(app)
  //     .post('/api/auth/registration')
  //     .send({
  //       email: "abusaidriyaz2@gmail.com",
  //       name: "abu said",
  //       password: "12345678"
  //     });

  //   expect(res.statusCode).toEqual(201);
  //   expect(res.body.success).toEqual(true);
  //   expect(res.body.message).toEqual(`User registration successfully!`);
  // });
});

describe("Test suites for Login Route : /api/auth/login", function () {
  test('Should get an error for missing Body Credintial', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  test("Should get an error for only email in payload.", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "abusaidriyaz@gmail.com"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"password" is required`);
  });

  test("Should get an error for only password in payload.", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        password: "123456"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"email" is required`);
  });

  test("Should get an error for an invalid email", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "abusaid",
        password: "123456"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"email" must be a valid email`);
  });

  test("Should get an error for a wrong password", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "abusaidriyaz@gmail.com",
        password: "123456789"
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual(`Invalid password!`);
  });

  test("should success with valid credintial", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "abusaidriyaz@gmail.com",
        password: "12345678"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual(`User login successfully!`);
    expect(res.body.token).toBeDefined();
  });

  afterAll(async () => {
    // Close the Redis connection after all tests have finished
    await redis.quit();
  });
});