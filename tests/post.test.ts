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

  test("Should get an error for protected route without token.", async function () {
    const response = await request(app).get('/api/posts/me');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication token missing");
  });

  test("Should get all post for an authentic user.", async function () {
    const response = await request(app).get('/api/posts/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  test("Should get a single post by id.", async function () {
    const response = await request(app).get('/api/posts/view/1');
    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(Object(response.body.data)).toBeTruthy();
  });

  test("Should get an error for a non-existing post.", async function () {
    const response = await request(app).get('/api/posts/view/2');
    expect(response.status).toBe(404);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toBe("Post not found!");
  });

  test("Should get an error for missing auth token to create new post.", async () => {
    const res = await request(app).post("/api/posts/create");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication token missing");
  });

  test("Should get an error for payload missing.", async () => {
    const res = await request(app)
      .post("/api/posts/create")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test("Should get an error for missing title in payload.", async () => {
    const res = await request(app)
      .post("/api/posts/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "test blog post" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`"title" is required`);
  });

  test("Should get an error for missing content in payload.", async () => {
    const res = await request(app)
      .post("/api/posts/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "This is a test post title" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`"content" is required`);
  });

  test("Should create a new post with valid payload.", async () => {
    const res = await request(app)
      .post("/api/posts/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "This is a test post title", content: "This is a test blog post" });

    expect(res.body.message).toBe("New post created successfully!");
    expect(res.status).toBe(201);
    expect(res.body.success).toBeTruthy();
  });

  test("Should get an error for missing auth token to update a post.", async () => {
    const res = await request(app).put("/api/posts/update/1");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication token missing");
  });

  test("Should get an error to update another user post.", async () => {
    const res = await request(app)
      .put("/api/posts/update/3")
      .send({ content: "test post updated" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`You are not authorized to update this post!`);
  });

  test("Should get an error for not found post when try to update.", async () => {
    const res = await request(app)
      .put("/api/posts/update/2")
      .send({ content: "test post updated" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`This post not found!`);
  });

  test("Should successfully update a post by authorize user.", async () => {
    const res = await request(app)
      .put("/api/posts/update/1")
      .send({ content: "test post updated" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.message).toBe(`Post updated successfully!`);
  });

  test("Should get an error to delete another user post.", async () => {
    const res = await request(app)
      .delete("/api/posts/delete/3")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`You are not authorized to delete this post!`);
  });

  test("Should get an error for not found post when try to delete.", async () => {
    const res = await request(app)
      .delete("/api/posts/delete/2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`This post not found!`);
  });
});