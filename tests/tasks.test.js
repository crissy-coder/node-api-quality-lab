
const request = require("supertest");
const app = require("../app");

describe("API health check", () => {
  test("GET / returns API information", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Node API Quality Lab");
  });
});
