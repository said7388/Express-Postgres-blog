import request from "supertest";
import app from "../src/app";

const token = process.env.JWT_TOKEN;

describe("Comment Router Suite : /api/comments", () => {
  test("Should get all comment for a post.", async () => {
    const res = await request(app).get("/api/comments/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });

  test("Should get an error for missing auth token to create new comment.", async () => {
    const res = await request(app).post("/api/comments/create");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication token missing");
  });

  test("Should get an error for payload missing.", async () => {
    const res = await request(app)
      .post("/api/comments/create")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test("Should get an error for missing post_id in payload.", async () => {
    const res = await request(app)
      .post("/api/comments/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "test comment" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`"post_id" is required`);
  });

  test("Should get an error for missing content in payload.", async () => {
    const res = await request(app)
      .post("/api/comments/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ post_id: 1 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`"content" is required`);
  });

  test("Should create a new comment with valid payload.", async () => {
    const res = await request(app)
      .post("/api/comments/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ post_id: 1, content: "test comment" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data).toHaveProperty("id");
  });

  test("Should get an error for missing auth token to update a comment.", async () => {
    const res = await request(app).put("/api/comments/update/1");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication token missing");
  });

  test("Should get an error for missing content in payload.", async () => {
    const res = await request(app)
      .put("/api/comments/update/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`"content" is required`);
  });

  test("Should get an error to update another user comment.", async () => {
    const res = await request(app)
      .put("/api/comments/update/4")
      .send({ content: "test comment updated" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`You are not authorized to update this comment!`);
  });

  test("Should get an error for not found comment when try to update.", async () => {
    const res = await request(app)
      .put("/api/comments/update/2")
      .send({ content: "test comment updated" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`This comment not found!`);
  });

  test("Should successfully update a comment by authorize user.", async () => {
    const res = await request(app)
      .put("/api/comments/update/1")
      .send({ content: "test comment updated" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.message).toBe(`Comment updated successfully!`);
  });

  test("Should get an error to delete another user comment.", async () => {
    const res = await request(app)
      .delete("/api/comments/delete/4")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`You are not authorized to delete this comment!`);
  });

  test("Should get an error for not found comment when try to delete.", async () => {
    const res = await request(app)
      .delete("/api/comments/delete/2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toBe(`This comment not found!`);
  });

  // test("Should successfully delete a comment by authorize user.", async () => {
  //   const res = await request(app)
  //     .delete("/api/comments/delete/6")
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(res.status).toBe(200);
  //   expect(res.body.success).toBeTruthy();
  // });
});