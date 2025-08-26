/**
 * Date Serialization Test
 * 
 * This test specifically focuses on the date serialization issues that are
 * causing persistence test failures. It validates that dates are properly
 * serialized and deserialized when saved to and loaded from the persistence layer.
 */

// Import required dependencies
import { v4 as uuidv4 } from 'uuid';
import { HistoryChunk, CognitiveLayer } from '../services/context-manager.js';
import { InMemoryPersistenceLayer } from './mocks/mock-persistence-layer.js';

// Create a test suite for date serialization
describe('Date Serialization Test', () => {
  // Set a longer timeout for the test
  jest.setTimeout(10000);

  // Create variables to hold test objects
  let persistenceLayer: InMemoryPersistenceLayer;
  let testDate: Date;
  let testChunk: HistoryChunk;
  
  // Setup before each test
  beforeEach(() => {
    // Initialize the in-memory persistence layer
    persistenceLayer = new InMemoryPersistenceLayer();
    
    // Create a specific date for testing
    testDate = new Date();
    console.log('Original Date:', testDate.toISOString());
    
    // Create a test history chunk with the test date
    testChunk = {
      chunkId: uuidv4(),
      content: 'Test content for date serialization',
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      timestamp: testDate,
      tags: ['test', 'date-serialization']
    };
  });
  
  // Test for date serialization issues
  it('should properly serialize and deserialize dates in objects', async () => {
    // Save the test chunk to the persistence layer
    const key = `test-chunk-${testChunk.chunkId}`;
    console.log('Saving chunk with timestamp:', testChunk.timestamp.toISOString());
    await persistenceLayer.save(key, testChunk);
    
    // Load the test chunk from the persistence layer
    const loadedChunk = await persistenceLayer.load(key) as HistoryChunk;
    console.log('Loaded chunk timestamp type:', typeof loadedChunk.timestamp);
    
    // Check if the timestamp is a Date object
    expect(loadedChunk.timestamp instanceof Date).toBe(true);
    console.log('Loaded Date:', loadedChunk.timestamp.toISOString());
    
    // Check if the timestamps match
    expect(loadedChunk.timestamp.getTime()).toBe(testChunk.timestamp.getTime());
  });
  
  // Test for date serialization with JSON stringify/parse
  it('should handle dates correctly with JSON stringify and parse', () => {
    // Serialize the object to JSON
    const serialized = JSON.stringify(testChunk);
    console.log('Serialized:', serialized);
    
    // Deserialize with a custom date reviver function
    const deserialized = JSON.parse(serialized, (key, value) => {
      // Convert ISO date strings back to Date objects
      if (typeof value === 'string' && 
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
        return new Date(value);
      }
      return value;
    });
    
    // Check if the timestamp is correctly revived as a Date
    expect(deserialized.timestamp instanceof Date).toBe(true);
    console.log('Deserialized Date:', deserialized.timestamp.toISOString());
    
    // Compare timestamps
    expect(deserialized.timestamp.getTime()).toBe(testChunk.timestamp.getTime());
  });
});