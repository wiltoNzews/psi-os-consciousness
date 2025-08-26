/**
 * Global Jest setup
 * 
 * This file is loaded by Jest before running tests to set up the
 * testing environment. It configures globals, mocks, or environment
 * variables needed for tests.
 * 
 * Updated for Void-Centered Design approach to testing.
 */

// Register path to CommonJS date-serialization module for tests
global.__DATE_SERIALIZATION_PATH__ = './server/services/utils/date-serialization.cjs';

// Provide path mapping for tests
global.__TEST_UTILS_PATH__ = './server/tests/utils';

// Set environment flag for tests
process.env.NODE_ENV = 'test';

// For authentic tests, we want to see the console output
// to verify real interactions with the file system
process.env.VERBOSE_TEST_LOGS = 'true';

// We keep the original console functions
// This allows our authentic tests to properly 
// log interactions with the real environment
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Export the original console functions for tests to use
global.__ORIGINAL_CONSOLE__ = {
  log: originalConsoleLog,
  error: originalConsoleError,
  warn: originalConsoleWarn
};