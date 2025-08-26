/**
 * Super Minimal Persistence Test
 * 
 * This test is designed to be as minimal as possible while still testing
 * the core functionality of the InMemoryPersistenceLayer. It focuses solely
 * on the save and load operations with explicit timestamp tracking to diagnose
 * potential timing issues and promise handling problems.
 */

import { InMemoryPersistenceLayer } from './mocks/mock-persistence-layer.js';

// Create a minimal type for test data
interface MinimalTestData {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

describe('Super Minimal Persistence Test', () => {
  // Set an extended timeout for diagnostic purposes
  jest.setTimeout(60000);
  
  it('should save and load data with explicit timestamps', async () => {
    console.log('Test starting timestamp:', Date.now());

    // Create a new persistence layer
    const persistenceLayer = new InMemoryPersistenceLayer();
    
    // Create test key
    const testKey = 'super-minimal-test-key';
    
    // Create test data with explicit dates
    const testData: MinimalTestData = {
      id: 'test-123',
      name: 'Super Minimal Test',
      createdAt: new Date('2025-01-01T12:00:00.000Z'),  // Using fixed dates for deterministic testing
      updatedAt: new Date('2025-01-02T12:00:00.000Z'),  // Using fixed dates for deterministic testing
      metadata: {
        testCase: 'super-minimal',
        priority: 'high'
      }
    };

    // Record timestamp before save
    console.log('Before save timestamp:', Date.now());
    
    // Save data
    await persistenceLayer.save(testKey, testData);
    
    // Record timestamp after save
    console.log('After save timestamp:', Date.now());
    
    // Record timestamp before load
    console.log('Before load timestamp:', Date.now());
    
    // Load data
    const loadedData = await persistenceLayer.load(testKey);
    
    // Record timestamp after load
    console.log('After load timestamp:', Date.now());
    
    // Perform assertions
    expect(loadedData).not.toBeNull();
    expect(loadedData?.id).toEqual(testData.id);
    expect(loadedData?.name).toEqual(testData.name);
    
    // Assert on date types and values
    console.log('Loaded createdAt type:', typeof loadedData?.createdAt);
    console.log('Loaded createdAt instanceof Date:', loadedData?.createdAt instanceof Date);
    console.log('Original createdAt:', testData.createdAt.toISOString());
    console.log('Loaded createdAt:', loadedData?.createdAt instanceof Date ? 
                loadedData.createdAt.toISOString() : String(loadedData?.createdAt));
    
    // Final timestamp
    console.log('Test ending timestamp:', Date.now());
  });
});