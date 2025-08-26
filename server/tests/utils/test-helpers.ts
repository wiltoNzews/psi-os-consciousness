/**
 * Test Helpers
 * 
 * This module provides utility functions for tests, following the 
 * Explicit-Implicit Quantum Balance principle.
 * 
 * BOUNDARY AWARENESS: This module explicitly defines the boundary between
 * test specifications and execution environment, providing clear interfaces
 * for test configuration and execution.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

// Prefix template for tests
export interface TestPrefix {
  // Test category or domain
  testCategory: string;
  
  // Component being tested
  componentUnderTest: string;
  
  // Test timeout in milliseconds
  timeoutMs: number;
  
  // Test isolation level (unit, integration, system)
  isolationLevel: 'unit' | 'integration' | 'system';
  
  // Any specific test constraints or requirements
  constraints?: Record<string, any>;
}

// Suffix template for tests
export interface TestSuffix {
  // Whether cleanup is needed after tests
  cleanupNeeded: boolean;
  
  // Expected test outcome
  expectedOutcome: string;
  
  // Any post-test actions or verifications
  postTestActions?: string[];
}

/**
 * Format a test description using PREFIX/SUFFIX templates
 * @param prefix Test prefix data
 * @param description Core test description
 * @param suffix Test suffix data
 * @returns Formatted test description
 */
export function formatTestDescription(
  prefix: TestPrefix,
  description: string,
  suffix: TestSuffix
): string {
  return `[${prefix.testCategory}] ${prefix.componentUnderTest} - ${description} [${prefix.isolationLevel.toUpperCase()}]`;
}

/**
 * Set test timeout for Jest
 * @param timeoutMs Timeout in milliseconds
 */
export function setupTestTimeout(timeoutMs: number): void {
  jest.setTimeout(timeoutMs);
}

/**
 * Run an async function with timeout protection
 * @param fn Function to run
 * @param timeoutMs Timeout in milliseconds
 * @param errorMessage Error message if timeout occurs
 * @returns Promise with the function result
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // Set timeout to reject the promise
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout: ${errorMessage} (${timeoutMs}ms)`));
    }, timeoutMs);
    
    // Run the function
    fn()
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Create a test fixture with unique ID
 * @param prefix Fixture prefix
 * @returns Unique fixture ID
 */
export function createTestFixtureId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/**
 * Compare dates with tolerance for minor differences
 * @param date1 First date
 * @param date2 Second date 
 * @param toleranceMs Tolerance in milliseconds
 * @returns True if dates are within tolerance
 */
export function datesAreWithinTolerance(
  date1: Date,
  date2: Date,
  toleranceMs: number = 10
): boolean {
  return Math.abs(date1.getTime() - date2.getTime()) <= toleranceMs;
}

/**
 * Create a test timeout error
 * @param operationName Operation that timed out
 * @param timeoutMs Timeout in milliseconds
 * @returns Error object
 */
export function createTimeoutError(operationName: string, timeoutMs: number): Error {
  return new Error(`Timeout: ${operationName} exceeded ${timeoutMs}ms`);
}

/**
 * Create mock event data for testing
 * @param type Event type 
 * @param customProps Custom properties
 * @returns Mock event data
 */
export function createMockEventData(
  type: string,
  customProps: Record<string, any> = {}
): Record<string, any> {
  return {
    id: createTestFixtureId('event'),
    type, // Using 'type' instead of 'eventType' for property consistency
    createdAt: new Date(), // Using 'createdAt' instead of 'timestamp' for property consistency
    confidence: 0.95, // Using 'confidence' instead of 'confidenceLevel' for property consistency
    importance: 0.8,
    ...customProps,
  };
}