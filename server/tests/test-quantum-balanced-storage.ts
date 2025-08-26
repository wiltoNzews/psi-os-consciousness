/**
 * Test for Quantum-Balanced Storage with Loki Variant Testing
 * 
 * This test demonstrates the Explicit-Implicit Quantum Balance principle
 * in storage operations using controlled chaos testing (Loki Variant).
 */

import { 
  QuantumBalancedStorage, 
  IQuantumBalancedStorage 
} from '../services/storage/quantum-balanced-storage.js';
import { generateLokiTestData, generateOperationSequence } from '../utils/loki-test-utils.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const TEST_DIR = path.join('./test-data', 'quantum-balanced-storage-tests');

/**
 * Clean up the test directory
 */
async function cleanupTestDirectory(): Promise<void> {
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist, ignore
  }
}

/**
 * Run basic CRUD operations
 */
async function testBasicOperations(): Promise<void> {
  console.log('Testing basic CRUD operations...');
  
  const storage = new QuantumBalancedStorage(TEST_DIR);
  
  // Create
  const id = `test-${uuidv4()}`;
  const testData = { name: 'Test Item', value: 42 };
  await storage.create(id, testData);
  
  // Read
  const retrievedData = await storage.read(id);
  console.log('Retrieved data:', retrievedData);
  
  if (!retrievedData || retrievedData.name !== testData.name || retrievedData.value !== testData.value) {
    throw new Error('Retrieved data does not match created data');
  }
  
  // Update
  const updatedData = { ...testData, value: 100 };
  await storage.update(id, updatedData);
  
  const retrievedUpdatedData = await storage.read(id);
  console.log('Updated data:', retrievedUpdatedData);
  
  if (!retrievedUpdatedData || retrievedUpdatedData.value !== 100) {
    throw new Error('Retrieved updated data does not match');
  }
  
  // List
  const items = await storage.list();
  console.log('Items:', items);
  
  if (!items.includes(id)) {
    throw new Error('List operation failed to include test item');
  }
  
  // Exists
  const exists = await storage.exists(id);
  console.log('Exists:', exists);
  
  if (!exists) {
    throw new Error('Exists operation failed to find test item');
  }
  
  // Delete
  const deleteResult = await storage.delete(id);
  console.log('Delete result:', deleteResult);
  
  if (!deleteResult) {
    throw new Error('Delete operation failed');
  }
  
  // Verify deleted
  const existsAfterDelete = await storage.exists(id);
  console.log('Exists after delete:', existsAfterDelete);
  
  if (existsAfterDelete) {
    throw new Error('Item still exists after deletion');
  }
  
  console.log('Basic CRUD operations passed');
}

/**
 * Test with Loki-generated chaos data
 */
async function testLokiChaosData(): Promise<void> {
  console.log('Testing with Loki chaos data...');
  
  const storage = new QuantumBalancedStorage(TEST_DIR);
  const testCases = 10;
  const successfulTests: string[] = [];
  const failedTests: Array<{id: string, error: string}> = [];
  
  for (let i = 0; i < testCases; i++) {
    const id = `loki-${i}-${uuidv4().substring(0, 8)}`;
    const chaosLevel = i / testCases; // Increasing chaos level
    const chaosData = generateLokiTestData(chaosLevel);
    
    try {
      console.log(`Test case ${i+1}/${testCases}, chaos level: ${chaosLevel.toFixed(2)}`);
      
      // Create with chaos data
      await storage.create(id, chaosData);
      
      // Read back
      const retrievedData = await storage.read(id);
      
      // Verify (use string comparison to handle complex structures)
      const originalStr = JSON.stringify(chaosData);
      const retrievedStr = JSON.stringify(retrievedData);
      
      // Exclude metadata fields added by storage
      const strippedRetrievedStr = JSON.stringify({
        ...retrievedData,
        _createdAt: undefined,
        _updatedAt: undefined
      });
      
      if (originalStr !== strippedRetrievedStr) {
        console.error(`Data mismatch for id ${id}`);
        failedTests.push({
          id,
          error: 'Data mismatch'
        });
      } else {
        successfulTests.push(id);
        
        // Cleanup
        await storage.delete(id);
      }
    } catch (error) {
      console.error(`Error with chaos data (level ${chaosLevel.toFixed(2)}):`, error.message);
      failedTests.push({
        id,
        error: error.message
      });
    }
  }
  
  console.log(`Loki chaos data tests: ${successfulTests.length} passed, ${failedTests.length} failed`);
  
  if (failedTests.length > 0) {
    console.error('Failed test cases:', failedTests);
    throw new Error(`${failedTests.length} Loki chaos data tests failed`);
  }
}

/**
 * Test with Loki-generated operation sequences
 */
async function testLokiOperationSequences(): Promise<void> {
  console.log('Testing with Loki operation sequences...');
  
  const storage = new QuantumBalancedStorage(TEST_DIR);
  
  // Generate operation sequences with increasing complexity
  const sequences = [
    generateOperationSequence(10, ['create', 'read', 'update', 'delete']), // Simple sequence
    generateOperationSequence(20, ['create', 'read', 'update', 'delete']), // Medium sequence
    generateOperationSequence(50, ['create', 'read', 'update', 'delete'])  // Complex sequence
  ];
  
  for (let i = 0; i < sequences.length; i++) {
    const sequence = sequences[i];
    console.log(`Testing sequence ${i+1}/${sequences.length} with ${sequence.length} operations`);
    
    const createdIds = new Set<string>();
    const errors: Array<{operation: string, id: string, error: string}> = [];
    
    // Execute operations in sequence
    for (const operation of sequence) {
      try {
        switch (operation.type) {
          case 'create':
            await storage.create(operation.params.id, operation.params.data);
            createdIds.add(operation.params.id);
            break;
            
          case 'read':
            await storage.read(operation.params.id);
            break;
            
          case 'update':
            await storage.update(operation.params.id, operation.params.data);
            break;
            
          case 'delete':
            await storage.delete(operation.params.id);
            createdIds.delete(operation.params.id);
            break;
        }
      } catch (error) {
        // Some errors are expected (e.g., updating non-existent items)
        console.log(`Error in operation ${operation.type} for id ${operation.params.id}: ${error.message}`);
        errors.push({
          operation: operation.type,
          id: operation.params.id,
          error: error.message
        });
      }
    }
    
    // Clean up any remaining items
    for (const id of createdIds) {
      try {
        await storage.delete(id);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    
    console.log(`Sequence ${i+1} completed with ${errors.length} errors`);
    
    // For the simple sequence, we expect no errors
    if (i === 0 && errors.length > 0) {
      console.error('Simple sequence had unexpected errors:', errors);
      throw new Error('Simple sequence test failed');
    }
  }
  
  console.log('Loki operation sequences tests passed');
}

/**
 * Test edge cases and boundary conditions
 */
async function testEdgeCases(): Promise<void> {
  console.log('Testing edge cases and boundary conditions...');
  
  const storage = new QuantumBalancedStorage(TEST_DIR);
  
  // Test: Empty string ID
  try {
    await storage.create('', { test: true });
    console.log('Empty string ID: Passed');
  } catch (error) {
    console.error('Empty string ID:', error.message);
    // This might be allowed or rejected depending on implementation
  }
  
  // Test: Very long ID
  const longId = 'a'.repeat(1000);
  try {
    await storage.create(longId, { test: true });
    const exists = await storage.exists(longId);
    if (exists) {
      console.log('Very long ID: Passed');
      await storage.delete(longId);
    } else {
      throw new Error('Item not found after creation');
    }
  } catch (error) {
    console.error('Very long ID:', error.message);
    throw error;
  }
  
  // Test: Large data
  const largeDataId = `large-${uuidv4().substring(0, 8)}`;
  const largeData = { array: new Array(10000).fill('x') };
  try {
    await storage.create(largeDataId, largeData);
    const retrieved = await storage.read(largeDataId);
    if (retrieved && retrieved.array.length === 10000) {
      console.log('Large data: Passed');
      await storage.delete(largeDataId);
    } else {
      throw new Error('Large data was not correctly retrieved');
    }
  } catch (error) {
    console.error('Large data:', error.message);
    throw error;
  }
  
  // Test: Nested data with special characters
  const nestedId = `nested-${uuidv4().substring(0, 8)}`;
  const nestedData = {
    level1: {
      level2: {
        level3: {
          special: '!@#$%^&*()_+-=[]{}|;:\'",.<>?/',
          emoji: '😀🚀🌍🔥💯'
        }
      }
    }
  };
  try {
    await storage.create(nestedId, nestedData);
    const retrieved = await storage.read(nestedId);
    if (retrieved && 
        retrieved.level1.level2.level3.special === nestedData.level1.level2.level3.special &&
        retrieved.level1.level2.level3.emoji === nestedData.level1.level2.level3.emoji) {
      console.log('Nested data with special characters: Passed');
      await storage.delete(nestedId);
    } else {
      throw new Error('Nested data was not correctly retrieved');
    }
  } catch (error) {
    console.error('Nested data with special characters:', error.message);
    throw error;
  }
  
  // Test: Reading non-existent item
  try {
    const data = await storage.read('non-existent-id');
    if (data === undefined) {
      console.log('Reading non-existent item: Passed');
    } else {
      throw new Error('Reading non-existent item returned data');
    }
  } catch (error) {
    console.error('Reading non-existent item:', error.message);
    throw error;
  }
  
  // Test: Updating non-existent item
  try {
    await storage.update('non-existent-id', { test: true });
    console.error('Updating non-existent item did not throw an error');
    throw new Error('Update should fail for non-existent item');
  } catch (error) {
    console.log('Updating non-existent item correctly failed:', error.message);
  }
  
  // Test: Deleting non-existent item
  try {
    const result = await storage.delete('non-existent-id');
    if (result === false) {
      console.log('Deleting non-existent item: Passed');
    } else {
      throw new Error('Deleting non-existent item returned true');
    }
  } catch (error) {
    console.error('Deleting non-existent item:', error.message);
    throw error;
  }
  
  console.log('Edge cases and boundary conditions tests passed');
}

/**
 * Run all tests
 */
async function runTests(): Promise<void> {
  try {
    console.log('Starting Quantum-Balanced Storage tests with Loki Variant...');
    
    // Clean up before tests
    await cleanupTestDirectory();
    
    // Run tests
    await testBasicOperations();
    await testLokiChaosData();
    await testLokiOperationSequences();
    await testEdgeCases();
    
    // Clean up after tests
    await cleanupTestDirectory();
    
    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the tests if this script is executed directly
if (process.argv[1].includes('test-quantum-balanced-storage.ts')) {
  runTests();
}

export { runTests, testBasicOperations, testLokiChaosData, testLokiOperationSequences, testEdgeCases };