module.exports = {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  setupFilesAfterEnv: ['./jest.setup.js'],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  collectCoverage: true,
  coverageReporters: ["text", "lcov"],
  maxWorkers: 1, // Ensures Jest runs tests sequentially
  testTimeout: 60000, // Increase timeout if needed
};
