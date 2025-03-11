const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    jest.setTimeout(90000); // Increase timeout to 90 seconds
    mongoServer = await MongoMemoryServer.create(); // Start in-memory MongoDB
    const uri = mongoServer.getUri(); // Get the connection URI
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false, // Disable indexing during tests
    });
});

afterAll(async () => {
    jest.setTimeout(90000); // Increase timeout to 90 seconds
    await mongoose.disconnect(); // Disconnect Mongoose
    await mongoServer.stop(); // Stop the in-memory MongoDB
});