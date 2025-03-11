const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Category = require("../../models/Category");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});

  // Ensure indexes are created before running tests
  await Category.init();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Category Model", () => {
  test("Should create and save a category correctly", async () => {
    const categoryData = { name: "Food", limit: 500 };
    const category = new Category(categoryData);
    const savedCategory = await category.save();

    expect(savedCategory).toHaveProperty("_id");
    expect(savedCategory.name).toBe("Food");
    expect(savedCategory.limit).toBe(500);
  });

  test("Should fail if required fields are missing", async () => {
    const category = new Category({}); // No name or limit
    let error;
    try {
      await category.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors).toHaveProperty("name");
    expect(error.errors).toHaveProperty("limit");
  });

  test("Should enforce unique name constraint", async () => {
    await new Category({ name: "Transport", limit: 300 }).save();

    let error;
    try {
      await new Category({ name: "Transport", limit: 600 }).save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error
  });
});
