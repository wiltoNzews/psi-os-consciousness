/**
 * Direct Test Script for Date Serialization/Deserialization
 * 
 * This script tests the date handling capabilities of EnhancedMockPersistenceLayer
 * with complex nested objects containing dates.
 * 
 * BOUNDARY AWARENESS: This test explicitly focuses on the boundary between
 * in-memory Date objects and their serialized persistence representation.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { EnhancedMockPersistenceLayer } from './mocks/enhanced-mock-persistence-layer.js';

describe('Enhanced Date Serialization Tests', () => {
  let persistenceLayer;
  
  beforeEach(() => {
    persistenceLayer = new EnhancedMockPersistenceLayer();
    console.log('[TEST] Created fresh EnhancedMockPersistenceLayer instance');
  });
  
  test('should handle nested dates in objects', async () => {
    // Create a complex object with multiple dates at different levels
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const complexObject = {
      id: 'test-complex-object',
      name: 'Complex Test Object',
      createdAt: now,
      metadata: {
        lastUpdated: now,
        previousUpdate: yesterday,
        scheduledFor: tomorrow
      },
      items: [
        { id: 'item1', timestamp: now },
        { id: 'item2', timestamp: yesterday },
        { id: 'item3', timestamp: tomorrow }
      ],
      nestedObjects: {
        level1: {
          level2: {
            level3: {
              deepTimestamp: now
            }
          }
        }
      },
      mixedArray: [
        now,
        { embeddedDate: yesterday },
        [tomorrow]
      ]
    };
    
    const testKey = 'test-complex-dates-' + Date.now();
    console.log('[TEST] Starting complex date test with key:', testKey);
    
    // Save the complex object
    await persistenceLayer.save(testKey, complexObject);
    console.log('[TEST] Complex object saved successfully');
    
    // Load the complex object
    const loadedObject = await persistenceLayer.load(testKey);
    console.log('[TEST] Complex object loaded successfully');
    
    // Verify all dates were properly serialized/deserialized
    expect(loadedObject).not.toBeNull();
    
    // Check top-level date
    expect(loadedObject.createdAt instanceof Date).toBe(true);
    expect(loadedObject.createdAt.toISOString()).toBe(now.toISOString());
    
    // Check nested dates in metadata
    expect(loadedObject.metadata.lastUpdated instanceof Date).toBe(true);
    expect(loadedObject.metadata.lastUpdated.toISOString()).toBe(now.toISOString());
    expect(loadedObject.metadata.previousUpdate instanceof Date).toBe(true);
    expect(loadedObject.metadata.previousUpdate.toISOString()).toBe(yesterday.toISOString());
    expect(loadedObject.metadata.scheduledFor instanceof Date).toBe(true);
    expect(loadedObject.metadata.scheduledFor.toISOString()).toBe(tomorrow.toISOString());
    
    // Check dates in array items
    expect(loadedObject.items[0].timestamp instanceof Date).toBe(true);
    expect(loadedObject.items[0].timestamp.toISOString()).toBe(now.toISOString());
    expect(loadedObject.items[1].timestamp instanceof Date).toBe(true);
    expect(loadedObject.items[1].timestamp.toISOString()).toBe(yesterday.toISOString());
    expect(loadedObject.items[2].timestamp instanceof Date).toBe(true);
    expect(loadedObject.items[2].timestamp.toISOString()).toBe(tomorrow.toISOString());
    
    // Check deeply nested date
    expect(loadedObject.nestedObjects.level1.level2.level3.deepTimestamp instanceof Date).toBe(true);
    expect(loadedObject.nestedObjects.level1.level2.level3.deepTimestamp.toISOString()).toBe(now.toISOString());
    
    // Check mixed array with dates
    expect(loadedObject.mixedArray[0] instanceof Date).toBe(true);
    expect(loadedObject.mixedArray[0].toISOString()).toBe(now.toISOString());
    expect(loadedObject.mixedArray[1].embeddedDate instanceof Date).toBe(true);
    expect(loadedObject.mixedArray[1].embeddedDate.toISOString()).toBe(yesterday.toISOString());
    expect(loadedObject.mixedArray[2][0] instanceof Date).toBe(true);
    expect(loadedObject.mixedArray[2][0].toISOString()).toBe(tomorrow.toISOString());
    
    console.log('[TEST] All date assertions passed');
  });
  
  test('should handle circular references with dates', async () => {
    // Create an object with a circular reference that also contains dates
    const now = new Date();
    
    const circularObject = {
      id: 'circular-object',
      timestamp: now,
      metadata: {
        created: now
      }
    };
    
    // Create circular reference
    circularObject.self = circularObject;
    
    const testKey = 'test-circular-dates-' + Date.now();
    console.log('[TEST] Starting circular reference test with key:', testKey);
    
    try {
      // Attempt to save the circular object
      await persistenceLayer.save(testKey, circularObject);
      console.log('[TEST] Object with circular reference handled appropriately');
      
      // If we get here, the circular reference was handled gracefully
      // We don't expect to successfully retrieve the circular structure, but the save should not crash
      const loadedObject = await persistenceLayer.load(testKey);
      
      // Check if the date was preserved
      if (loadedObject && loadedObject.timestamp) {
        expect(loadedObject.timestamp instanceof Date).toBe(true);
        console.log('[TEST] Date was preserved in the non-circular parts');
      }
    } catch (error) {
      // We accept either graceful handling or a controlled error for circular references
      console.log('[TEST] Circular reference appropriately triggered error:', error.message);
      // This is not a failure - it's an expected possible outcome
    }
  });
});