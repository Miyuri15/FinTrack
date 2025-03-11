const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');

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

describe('User Model', () => {
  test('Should create and save a user successfully', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      contactNumber: '1234567890',
      password: 'password123',
      role: 'user',
    };
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.firstName).toBe(userData.firstName);
    expect(savedUser.lastName).toBe(userData.lastName);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.contactNumber).toBe(userData.contactNumber);
    expect(savedUser.role).toBe(userData.role);
  });

  test('Should fail if required fields are missing', async () => {
    const userData = { firstName: 'John' }; // Missing lastName, email, contactNumber, password
    const user = new User(userData);
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.lastName).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.contactNumber).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });
});