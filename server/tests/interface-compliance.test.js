/**
 * Interface Compliance Test for EnhancedMockPersistenceLayer
 * 
 * This test validates that the EnhancedMockPersistenceLayer fully implements
 * the required IPersistenceLayer interface with the correct behavior.
 * 
 * BOUNDARY AWARENESS: This test verifies the exact boundary between the test
 * mock implementation and the expected interface behavior.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { EnhancedMockPersistenceLayer } from './mocks/enhanced-mock-persistence-layer.js';

describe('IPersistenceLayer Interface Compliance', () => {
  let persistenceLayer;
  
  beforeEach(() => {
    persistenceLayer = new EnhancedMockPersistenceLayer();
    console.log('[TEST] Created fresh EnhancedMockPersistenceLayer instance');
  });
  
  test('should implement all required interface methods', () => {
    // Verify all required methods are present
    expect(typeof persistenceLayer.save).toBe('function');
    expect(typeof persistenceLayer.load).toBe('function');
    expect(typeof persistenceLayer.get).toBe('function');
    expect(typeof persistenceLayer.getKeys).toBe('function');
    expect(typeof persistenceLayer.delete).toBe('function');
    expect(typeof persistenceLayer.clear).toBe('function');
    
    console.log('[TEST] All required methods are implemented');
  });
  
  test('should save and retrieve objects with proper keys', async () => {
    const testData = [
      { key: 'test1', data: { id: 1, name: 'Test 1', timestamp: new Date() } },
      { key: 'test2', data: { id: 2, name: 'Test 2', timestamp: new Date() } },
      { key: 'test3', data: { id: 3, name: 'Test 3', timestamp: new Date() } }
    ];
    
    // Save all test objects
    for (const item of testData) {
      await persistenceLayer.save(item.key, item.data);
    }
    
    // Get all keys
    const keys = await persistenceLayer.getKeys();
    
    // Verify all keys are present
    expect(keys).toContain('test1');
    expect(keys).toContain('test2');
    expect(keys).toContain('test3');
    expect(keys.length).toBeGreaterThanOrEqual(3); // May have other keys from previous tests
    
    // Load objects by key
    for (const item of testData) {
      const loadedData = await persistenceLayer.load(item.key);
      expect(loadedData).not.toBeNull();
      expect(loadedData.id).toBe(item.data.id);
      expect(loadedData.name).toBe(item.data.name);
      expect(loadedData.timestamp instanceof Date).toBe(true);
    }
    
    // Test the get alias for load
    const loadedViaGet = await persistenceLayer.get('test1');
    expect(loadedViaGet).not.toBeNull();
    expect(loadedViaGet.id).toBe(1);
    
    console.log('[TEST] Save and retrieve operations work correctly');
  });
  
  test('should filter keys by prefix', async () => {
    // Create test data with different prefixes
    await persistenceLayer.save('prefix1-key1', { data: 1 });
    await persistenceLayer.save('prefix1-key2', { data: 2 });
    await persistenceLayer.save('prefix2-key1', { data: 3 });
    await persistenceLayer.save('prefix2-key2', { data: 4 });
    await persistenceLayer.save('no-prefix-key', { data: 5 });
    
    // Get keys with prefix1
    const prefix1Keys = await persistenceLayer.getKeys('prefix1');
    expect(prefix1Keys.length).toBe(2);
    expect(prefix1Keys).toContain('prefix1-key1');
    expect(prefix1Keys).toContain('prefix1-key2');
    expect(prefix1Keys).not.toContain('prefix2-key1');
    
    // Get keys with prefix2
    const prefix2Keys = await persistenceLayer.getKeys('prefix2');
    expect(prefix2Keys.length).toBe(2);
    expect(prefix2Keys).toContain('prefix2-key1');
    expect(prefix2Keys).toContain('prefix2-key2');
    expect(prefix2Keys).not.toContain('prefix1-key1');
    
    console.log('[TEST] Key filtering by prefix works correctly');
  });
  
  test('should delete objects correctly', async () => {
    // Create test data
    await persistenceLayer.save('delete-test-key', { data: 'to be deleted' });
    
    // Verify the object exists
    const beforeDelete = await persistenceLayer.load('delete-test-key');
    expect(beforeDelete).not.toBeNull();
    
    // Delete the object
    const deleteResult = await persistenceLayer.delete('delete-test-key');
    expect(deleteResult).toBe(true);
    
    // Verify the object is gone
    const afterDelete = await persistenceLayer.load('delete-test-key');
    expect(afterDelete).toBeNull();
    
    // Try to delete a non-existent key
    const deleteNonExistent = await persistenceLayer.delete('non-existent-key');
    expect(deleteNonExistent).toBe(false);
    
    console.log('[TEST] Delete operations work correctly');
  });
  
  test('should clear all objects correctly', async () => {
    // Create some test data
    await persistenceLayer.save('clear-test-key1', { data: 1 });
    await persistenceLayer.save('clear-test-key2', { data: 2 });
    
    // Verify objects exist
    const keys = await persistenceLayer.getKeys();
    expect(keys.length).toBeGreaterThan(0);
    
    // Clear all objects
    await persistenceLayer.clear();
    
    // Verify all objects are gone
    const keysAfterClear = await persistenceLayer.getKeys();
    expect(keysAfterClear.length).toBe(0);
    
    console.log('[TEST] Clear operation works correctly');
  });
});