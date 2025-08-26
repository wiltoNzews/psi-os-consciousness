/**
 * Jest Setup File with Explicit-Implicit Quantum Balance
 * 
 * This setup file applies the Explicit-Implicit Quantum Balance principle
 * by explicitly defining test environment preparation while implicitly 
 * handling the test context.
 * 
 * 🔗 EXPLICIT PATIENT REPETITION: Patience is required during test setup,
 * especially for persistence layer operations with date handling.
 * 
 * BOUNDARY AWARENESS: This setup explicitly defines the boundary
 * between test preparation and test execution.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

// Extend Jest timeout for all tests
jest.setTimeout(60000);

// Mock console errors during tests to reduce noise
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out specific expected errors
  const errorMsg = args[0]?.toString() || '';
  if (
    errorMsg.includes('date serialization') ||
    errorMsg.includes('circular structure') ||
    errorMsg.includes('could not be cloned')
  ) {
    // Suppress these expected errors
    return;
  }
  
  // Pass through other errors
  originalConsoleError(...args);
};

// Clean up after all tests
afterAll(() => {
  // Restore console.error
  console.error = originalConsoleError;
});