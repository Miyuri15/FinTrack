module.exports = {
  preset: '@shelf/jest-mongodb', // Use Jest MongoDB preset
  testEnvironment: 'node', // Set the test environment to Node.js
  setupFilesAfterEnv: ['./jest.setup.js'], // Path to the setup file
  testTimeout: 90000, // Set global timeout to 90 seconds
  maxWorkers: 1, // Run tests sequentially
};