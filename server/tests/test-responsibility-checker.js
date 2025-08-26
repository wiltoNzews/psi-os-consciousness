/**
 * Test script for the Responsibility Checker with Explicit-Implicit Quantum Balance
 * 
 * This script tests the enhanced responsibility checker that implements the
 * Explicit-Implicit Quantum Balance principle to prevent recursion while
 * maintaining adaptability.
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import { checkResponsibility } from '../verification/responsibility-checker.js';

/**
 * Create a test file with specified content
 * 
 * @param {string} filePath - Path to create the test file
 * @param {string} content - Content to write to the file
 */
async function createTestFile(filePath, content) {
  try {
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write the test file
    await fs.writeFile(filePath, content);
    console.log(`Created test file: ${filePath}`);
  } catch (error) {
    console.error(`Error creating test file: ${error.message}`);
  }
}

/**
 * Clean up test files
 * 
 * @param {string} filePath - Path to the test file to remove
 */
async function cleanupTestFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`Removed test file: ${filePath}`);
  } catch (error) {
    console.error(`Error removing test file: ${error.message}`);
  }
}

/**
 * Run tests for the responsibility checker
 */
async function runTests() {
  console.log('===== Testing Responsibility Checker with Explicit-Implicit Quantum Balance =====');
  
  // Test file paths
  const tempDir = './test-temp';
  const goodFile = path.join(tempDir, 'GoodService.ts');
  const badFile = path.join(tempDir, 'BadImpl.ts');
  
  try {
    // Good file with proper responsibility documentation
    const goodContent = `/**
 * User Service
 * 
 * RESPONSIBILITY: Manages user data and authentication
 * This service follows the Single Responsibility Principle by focusing
 * only on user-related operations.
 */
export class UserService {
  constructor() {
    // Initialize user service
  }
  
  // Get user by ID
  async getUserById(id: string) {
    // Implementation
    return { id, name: 'Test User' };
  }
  
  // Authenticate user
  async authenticate(username: string, password: string) {
    // Implementation
    return true;
  }
}`;

    // Bad file with no documentation and multiple responsibilities
    const badContent = `class DatabaseHandler {
  constructor() {}
  connect() {}
  disconnect() {}
  query() {}
}

class Logger {
  constructor() {}
  log() {}
  error() {}
  warn() {}
}

class EmailSender {
  constructor() {}
  send() {}
  validate() {}
}

class Notifier {
  constructor() {}
  notify() {}
}

class ConfigManager {
  constructor() {}
  load() {}
  save() {}
}`;

    // Create test files
    await createTestFile(goodFile, goodContent);
    await createTestFile(badFile, badContent);
    
    // Test good file
    console.log('\nTesting file with good responsibility documentation and structure:');
    const goodResult = await checkResponsibility(goodFile);
    console.log(`Result: ${goodResult.passed ? 'PASSED' : 'FAILED'}`);
    console.log(`Message: ${goodResult.message}`);
    if (goodResult.lineNumbers) {
      console.log(`Found on lines: ${goodResult.lineNumbers.join(', ')}`);
    }
    
    // Test bad file
    console.log('\nTesting file with bad responsibility documentation and structure:');
    const badResult = await checkResponsibility(badFile);
    console.log(`Result: ${badResult.passed ? 'PASSED' : 'FAILED'}`);
    console.log(`Message: ${badResult.message}`);
    if (badResult.lineNumbers) {
      console.log(`Found on lines: ${badResult.lineNumbers.join(', ')}`);
    }
    
    // Cleanup
    await cleanupTestFile(goodFile);
    await cleanupTestFile(badFile);
    await fs.rmdir(tempDir);
    
    console.log('\nTest Results Summary:');
    console.log(`Good file test: ${goodResult.passed ? 'PASSED' : 'FAILED'}`);
    console.log(`Bad file test: ${!badResult.passed ? 'PASSED' : 'FAILED'}`);
    console.log(`Overall test: ${goodResult.passed && !badResult.passed ? 'PASSED' : 'FAILED'}`);
    
  } catch (error) {
    console.error(`Error running tests: ${error.message}`);
  }
}

// Run the tests
runTests();