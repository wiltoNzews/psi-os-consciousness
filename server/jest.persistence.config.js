/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // Base settings for persistence tests
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Increase timeout to 60 seconds for diagnostics
  testTimeout: 60000,
  
  // More verbose output
  verbose: true,
  
  // Run only persistence tests
  testMatch: ['**/tests/*persistence*.test.(js|ts)'],
  
  // Add specific options for ts-jest
  transform: {
    // Use ts-jest for TypeScript files, but with specific options
    '^.+\\.tsx?$': [
      'ts-jest', 
      {
        // Faster transpilation - use isolatedModules for diagnostic purposes
        isolatedModules: true,
        // Use ES modules for faster loading
        useESM: true
      }
    ]
  },
  
  // More detailed error reporting
  bail: false,
  
  // Detect open handles (like unresolved promises)
  detectOpenHandles: true,
  
  // Force exit after tests complete
  forceExit: true,
  
  // Run all tests serially in the current process
  runInBand: true
};