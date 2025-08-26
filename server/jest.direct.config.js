/**
 * Jest configuration optimized for direct testing of persistence layer
 * without complex transformations
 * 
 * This configuration uses babel-jest instead of ts-jest to reduce
 * transformation overhead that may contribute to timeout issues.
 */

export default {
  testEnvironment: 'node',
  testTimeout: 30000,
  verbose: true,
  testPathIgnorePatterns: [
    "<rootDir>/dist/"
  ],
  // We're testing .js files directly, no transformation needed for them
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.js$" // Ignore transforming .js files
  ],
};