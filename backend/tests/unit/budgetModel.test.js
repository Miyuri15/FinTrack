const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Budget = require('../../models/Budget');

let mongoServer;

beforeAll(async () => {
  // Set up an in-memory MongoDB server for testing
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect Mongoose to the in-memory database
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Close the Mongoose connection and stop the in-memory MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Budget Model', () => {
  test('Should create and save a budget object correctly', async () => {
    const budgetData = {
      user: new mongoose.Types.ObjectId(),
      month: 'March',
      budgetName: 'Test Budget',
      amount: 1000,
      spendings: [{ category: 'Food', amount: 200, spent: 50 }],
    };

    const budget = new Budget(budgetData);
    const savedBudget = await budget.save();

    // Assertions
    expect(savedBudget).toHaveProperty('_id');
    expect(savedBudget).toHaveProperty('month', 'March');
    expect(savedBudget).toHaveProperty('budgetName', 'Test Budget');
    expect(savedBudget.amount).toBe(1000);
    expect(savedBudget.spendings[0].category).toBe('Food');
    expect(savedBudget.spendings[0].amount).toBe(200);
    expect(savedBudget.spendings[0].spent).toBe(50);
  });

  test('Should fail if required fields are missing', async () => {
    const budgetData = {
      user: new mongoose.Types.ObjectId(),
      month: 'March',
      // Missing budgetName, amount
      spendings: [{ category: 'Food', amount: 200, spent: 50 }],
    };

    const budget = new Budget(budgetData);
    let error;
    try {
      await budget.save();
    } catch (err) {
      error = err;
    }
    
    expect(error).toBeDefined();
    expect(error.errors).toHaveProperty('budgetName');
    expect(error.errors).toHaveProperty('amount');
  });
});
