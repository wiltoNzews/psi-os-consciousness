/**
 * Simple Persistence Layer Test
 * 
 * This test focuses on basic functionality of the EnhancedMockPersistenceLayer
 * to verify it's working correctly before using it in more complex tests.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { EnhancedMockPersistenceLayer } from './mocks/enhanced-mock-persistence-layer.js';
import { formatTestDescription, setupTestTimeout } from './utils/test-helpers.js';
import { v4 as uuidv4 } from 'uuid';

// Define PREFIX/SUFFIX templates for test clarity
const testPrefix = {
  testCategory: 'Persistence',
  componentUnderTest: 'EnhancedMockPersistenceLayer',
  timeoutMs: 5000,
  isolationLevel: 'unit' as const,
};

const testSuffix = {
  cleanupNeeded: false,
  expectedOutcome: 'Basic persistence operations work correctly',
};

describe(
  formatTestDescription(
    testPrefix,
    'Simple Persistence Layer Test',
    testSuffix
  ), 
  () => {
    // Set test timeout explicitly
    setupTestTimeout(testPrefix.timeoutMs);
    
    let persistenceLayer: EnhancedMockPersistenceLayer;
    
    beforeEach(() => {
      persistenceLayer = new EnhancedMockPersistenceLayer();
    });
    
    it('should save and load a simple object correctly', async () => {
      const testKey = `test-key-${uuidv4()}`;
      const testData = {
        message: 'Hello, world!',
        timestamp: new Date(),
        count: 42,
        nested: {
          value: 'Nested value',
          created: new Date(),
        },
      };
      
      // Save the data
      await persistenceLayer.save(testKey, testData);
      
      // Load the data
      const loadedData = await persistenceLayer.load(testKey);
      
      // Verify the data
      expect(loadedData).not.toBeNull();
      expect(loadedData?.message).toBe(testData.message);
      expect(loadedData?.count).toBe(testData.count);
      expect(loadedData?.nested.value).toBe(testData.nested.value);
      
      // Verify dates
      expect(loadedData?.timestamp instanceof Date).toBe(true);
      expect(loadedData?.nested.created instanceof Date).toBe(true);
      
      // Verify date equality within 10ms tolerance
      const timestampDiff = Math.abs(loadedData?.timestamp.getTime() - testData.timestamp.getTime());
      expect(timestampDiff).toBeLessThan(10);
      
      const createdDiff = Math.abs(loadedData?.nested.created.getTime() - testData.nested.created.getTime());
      expect(createdDiff).toBeLessThan(10);
    });
    
    it('should handle null/empty values correctly', async () => {
      const testKey = `null-test-${uuidv4()}`;
      
      // Verify null handling
      await persistenceLayer.save(testKey, null);
      const nullResult = await persistenceLayer.load(testKey);
      expect(nullResult).not.toBeNull(); // The DateTransformer converts null to {}
      
      // Verify empty object handling
      await persistenceLayer.save(testKey, {});
      const emptyResult = await persistenceLayer.load(testKey);
      expect(emptyResult).toEqual({});
    });
    
    it('should implement the getKeys and delete methods correctly', async () => {
      // Create several test keys
      const testKey1 = `prefix-test-1-${uuidv4()}`;
      const testKey2 = `prefix-test-2-${uuidv4()}`;
      const testKey3 = `other-test-${uuidv4()}`;
      
      // Save some data
      await persistenceLayer.save(testKey1, { value: 1 });
      await persistenceLayer.save(testKey2, { value: 2 });
      await persistenceLayer.save(testKey3, { value: 3 });
      
      // Get all keys
      const allKeys = await persistenceLayer.getKeys();
      expect(allKeys.length).toBe(3);
      expect(allKeys).toContain(testKey1);
      expect(allKeys).toContain(testKey2);
      expect(allKeys).toContain(testKey3);
      
      // Get keys with prefix
      const prefixKeys = await persistenceLayer.getKeys('prefix-');
      expect(prefixKeys.length).toBe(2);
      expect(prefixKeys).toContain(testKey1);
      expect(prefixKeys).toContain(testKey2);
      expect(prefixKeys).not.toContain(testKey3);
      
      // Delete a key
      const deleteResult = await persistenceLayer.delete(testKey1);
      expect(deleteResult).toBe(true);
      
      // Verify key was deleted
      const updatedKeys = await persistenceLayer.getKeys();
      expect(updatedKeys.length).toBe(2);
      expect(updatedKeys).not.toContain(testKey1);
      expect(updatedKeys).toContain(testKey2);
      expect(updatedKeys).toContain(testKey3);
      
      // Verify loading deleted key returns null
      const deletedData = await persistenceLayer.load(testKey1);
      expect(deletedData).toBeNull();
      
      // Verify deleting non-existent key
      const nonExistentDelete = await persistenceLayer.delete('non-existent-key');
      expect(nonExistentDelete).toBe(false);
    });
  }
);