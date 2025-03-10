const mongoose = require('mongoose');
const connectDB = require('../../config/db');

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    close: jest.fn().mockResolvedValue(true),
  },
}));

describe('Database Connection', () => {
  test('Should connect to MongoDB successfully', async () => {
    await expect(connectDB()).resolves.not.toThrow();
  });
});