const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Goal = require('../../models/Goal');

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

describe('Goal Model', () => {
  test('Should create and save a goal correctly', async () => {
    const goalData = {
      userId: new mongoose.Types.ObjectId(),
      title: 'Save for vacation',
      targetAmount: 2000,
      savedAmount: 500,
      deadline: new Date('2025-12-31'),
    };

    const goal = new Goal(goalData);
    const savedGoal = await goal.save();

    expect(savedGoal).toHaveProperty('_id');
    expect(savedGoal.title).toBe('Save for vacation');
    expect(savedGoal.targetAmount).toBe(2000);
    expect(savedGoal.savedAmount).toBe(500);
    expect(savedGoal.deadline).toEqual(new Date('2025-12-31'));
  });

  test('Should fail if required fields are missing', async () => {
    const goalData = {
      userId: new mongoose.Types.ObjectId(),
      title: 'Save for vacation', // Missing targetAmount and deadline
    };

    const goal = new Goal(goalData);
    let error;
    try {
      await goal.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors).toHaveProperty('targetAmount');
    expect(error.errors).toHaveProperty('deadline');
  });
});
