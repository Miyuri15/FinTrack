const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Transaction = require('../../models/Transaction');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Transaction Model', () => {
  test('Should create and save a transaction successfully', async () => {
    const transactionData = {
      user: new mongoose.Types.ObjectId(),
      type: 'expense',
      amount: 100,
      currency: 'USD',
      category: 'Food',
      description: 'Groceries',
    };
    const transaction = new Transaction(transactionData);
    const savedTransaction = await transaction.save();

    expect(savedTransaction._id).toBeDefined();
    expect(savedTransaction.type).toBe(transactionData.type);
    expect(savedTransaction.amount).toBe(transactionData.amount);
    expect(savedTransaction.currency).toBe(transactionData.currency);
    expect(savedTransaction.category).toBe(transactionData.category);
    expect(savedTransaction.description).toBe(transactionData.description);
  });

  test('Should fail if required fields are missing', async () => {
    const transactionData = { type: 'expense' }; // Missing amount, currency, category, description
    const transaction = new Transaction(transactionData);
    let error;
    try {
      await transaction.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.amount).toBeDefined();
    expect(error.errors.currency).toBeDefined();
    expect(error.errors.category).toBeDefined();
    expect(error.errors.description).toBeDefined();
  });
});