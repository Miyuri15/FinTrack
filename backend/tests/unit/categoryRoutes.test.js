const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Category = require("../../models/Category");
const categoryRoutes = require("../../routes/categoryRoutes");

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });

  app = express();
  app.use(express.json());
  app.use("/categories", categoryRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Category Routes", () => {
  test("Should create a new category", async () => {
    const res = await request(app).post("/categories").send({ name: "Entertainment", limit: 200 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Entertainment");
    expect(res.body.limit).toBe(200);
  });

  test("Should fetch all categories", async () => {
    await new Category({ name: "Groceries", limit: 400 }).save();

    const res = await request(app).get("/categories");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Should delete a category", async () => {
    const category = await new Category({ name: "Travel", limit: 500 }).save();

    const res = await request(app).delete(`/categories/${category._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Category deleted successfully");
  });
});
