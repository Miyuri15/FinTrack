// backend/tests/jest.setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
},30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
},30000);