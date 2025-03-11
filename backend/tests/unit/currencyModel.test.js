const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Currency = require('../../models/Currency');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Currency Model', () => {
  test('Should create and save a currency successfully', async () => {
    const currencyData = { code: 'USD', name: 'US Dollar', exchangeRate: 1.0 };
    const currency = new Currency(currencyData);
    const savedCurrency = await currency.save();

    expect(savedCurrency._id).toBeDefined();
    expect(savedCurrency.code).toBe(currencyData.code);
    expect(savedCurrency.name).toBe(currencyData.name);
    expect(savedCurrency.exchangeRate).toBe(currencyData.exchangeRate);
  });

  test('Should fail if required fields are missing', async () => {
    const currencyData = { code: 'USD' }; // Missing name and exchangeRate
    const currency = new Currency(currencyData);
    let error;
    try {
      await currency.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.exchangeRate).toBeDefined();
  });
});