const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Notification = require('../../models/Notification');

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

describe('Notification Model', () => {
  test('Should create and save a notification successfully', async () => {
    const notificationData = {
      user: new mongoose.Types.ObjectId(),
      message: 'Test Notification',
      type: 'transaction',
    };
    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();

    expect(savedNotification._id).toBeDefined();
    expect(savedNotification.message).toBe(notificationData.message);
    expect(savedNotification.type).toBe(notificationData.type);
  });

  test('Should fail if required fields are missing', async () => {
    const notificationData = { message: 'Test Notification' }; // Missing user and type
    const notification = new Notification(notificationData);
    let error;
    try {
      await notification.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.user).toBeDefined();
    expect(error.errors.type).toBeDefined();
  });
});