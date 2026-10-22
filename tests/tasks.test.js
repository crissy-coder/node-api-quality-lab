
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

  
test.each(["get", "put", "delete"])(
  "%s rejects non-canonical task IDs",
  async (method) => {
    const response = await request(app)[method](
      "/api/tasks/0x1"
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid task ID");
  }
);

  test("accepts a valid ID for GET, PUT, and DELETE", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Regression test task" });

    expect(created.status).toBe(201);

    const id = created.body.id;

    const fetched = await request(app).get(`/api/tasks/${id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.id).toBe(id);

    const updated = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ completed: true });

    expect(updated.status).toBe(200);
    expect(updated.body.completed).toBe(true);

    const deleted = await request(app).delete(`/api/tasks/${id}`);
    expect(deleted.status).toBe(204);

    const missing = await request(app).get(`/api/tasks/${id}`);
    expect(missing.status).toBe(404);
  });


  
  test.each(["0x1", "1e0", "1.0", "+1", "0", "-1", "01", " 1"])(
    "rejects non-canonical task ID: %s",
    async (id) => {
      const response = await request(app).get(`/api/tasks/${encodeURIComponent(id)}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid task ID");
    }
  );

  test("rejects unsafe integer task IDs", async () => {
    const response = await request(app).get(
      "/api/tasks/9007199254740992"
    );

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
