
const request = require("supertest");
const app = require("../app");

describe("API health check", () => {
  test("GET / returns API information", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Node API Quality Lab");
  });
});

describe("Task input validation", () => {
  test("rejects a missing title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({});

    expect(response.status).toBe(400);
  });

  test("rejects an empty title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "   " });

    expect(response.status).toBe(400);
  });

  test("trims a valid title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "  Learn Node.js  " });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Learn Node.js");
  });

  test("rejects a non-boolean completed value", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Test task" });

    const response = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({ completed: "yes" });

    expect(response.status).toBe(400);
  });

  test("rejects an invalid task ID", async () => {
    const response = await request(app).get("/api/tasks/abc");

    expect(response.status).toBe(400);
  });
});
