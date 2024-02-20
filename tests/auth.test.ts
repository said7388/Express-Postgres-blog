import request from "supertest";
import app from "../src/app";

// All test cases for user registration
describe("Register Route Testing : /api/auth/registration", function () {
  test('Without Body Credintial', async () => {
    const res = await request(app)
      .post('/api/auth/registration')
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  test("With only email", async () => {
    const res = await request(app)
      .post('/api/auth/registration')
      .send({
        email: "abusaidriyaz@gmail.com"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"name" is required`);
  });

  test("With only name", async () => {
    const res = await request(app)
      .post('/api/auth/registration')
      .send({
        name: "abu said"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"email" is required`);
  });

  test("With name and email", async () => {
    const res = await request(app)
      .post('/api/auth/registration')
      .send({
        email: "abusaidriyaz@gmail.com",
        name: "abu said"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"password" is required`);
  });

  test("With existing email", async () => {
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

describe("Login Route Testing : /api/auth/login", function () {
  test('Without Body Credintial', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  test("With only email", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "abusaidriyaz@gmail.com"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"password" is required`);
  });

  test("With only password", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        password: "123456"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"email" is required`);
  });

  test("With invalid email", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "abusaid",
        password: "123456"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(`"email" must be a valid email`);
  });

  test("With wrong password", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "abusaidriyaz@gmail.com",
        password: "123456789"
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual(`Invalid password!`);
  });

  test("With valid credintial", async () => {
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
});