/**
 * Custom Jest Test Runner
 * 
 * This script is designed to execute Jest tests with the proper module
 * resolution to avoid ESM/CommonJS conflicts. It provides a way to
 * run the tests without modifying the main application code.
 */

// Force use of the CommonJS module
process.env.USE_CJS_DATE_SERIALIZATION = 'true';

// Using dynamic import for ES modules
import('jest').then(jestModule => {
  jestModule.default.run([
    'server/tests/persistent-context-with-cjs.test.ts',
    '--verbose'
  ]);
});