/**
 * File Persistence Layer Test
 * 
 * This is a JavaScript test for the FileSystemPersistenceLayer
 * specifically focusing on date serialization and deserialization.
 */

const { createFileSystemPersistenceLayer } = require('../services/file-persistence-layer');
const fs = require('fs');
const path = require('path');

// Test directory for file operations
const TEST_DIR = './test-data';

describe('FileSystemPersistenceLayer', () => {
  let persistenceLayer;
  
  // Setup before all tests
  beforeAll(() => {
    // Create test directory if it doesn't exist
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
    
    // Create persistence layer with test directory
    persistenceLayer = createFileSystemPersistenceLayer({ 
      baseDir: TEST_DIR 
    });
  });
  
  // Cleanup after all tests
  afterAll(() => {
    // Clean up test files
    if (fs.existsSync(TEST_DIR)) {
      const files = fs.readdirSync(TEST_DIR);
      files.forEach(file => {
        fs.unlinkSync(path.join(TEST_DIR, file));
      });
      fs.rmdirSync(TEST_DIR);
    }
  });
  
  // Test date serialization and deserialization
  test('should correctly handle date objects in serialization/deserialization', async () => {
    console.log('Starting date serialization test');
    
    // Create test object with date
    const now = new Date();
    const testObject = {
      id: 'test-123',
      name: 'Test Object',
      created: now,
      updated: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour ago
      nested: {
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24) // 1 day ago
      }
    };
    
    // Save the object
    await persistenceLayer.save('date-test.json', testObject);
    console.log('Test object saved');
    
    // Load the object
    const loadedObject = await persistenceLayer.load('date-test.json');
    console.log('Test object loaded');
    
    // Verify the dates are properly deserialized
    expect(loadedObject.created instanceof Date).toBe(true);
    expect(loadedObject.updated instanceof Date).toBe(true);
    expect(loadedObject.nested.timestamp instanceof Date).toBe(true);
    
    // Verify the date values match
    expect(loadedObject.created.getTime()).toBe(testObject.created.getTime());
    expect(loadedObject.updated.getTime()).toBe(testObject.updated.getTime());
    expect(loadedObject.nested.timestamp.getTime()).toBe(testObject.nested.timestamp.getTime());
    
    console.log('Date serialization test completed successfully');
  });
  
  // Test basic CRUD operations
  test('should perform basic CRUD operations', async () => {
    // Create
    const testData = { message: 'Hello, world!', timestamp: new Date() };
    await persistenceLayer.save('crud-test.json', testData);
    
    // Read
    const loadedData = await persistenceLayer.load('crud-test.json');
    expect(loadedData.message).toBe('Hello, world!');
    expect(loadedData.timestamp instanceof Date).toBe(true);
    
    // Update
    const updatedData = { ...loadedData, message: 'Updated message' };
    await persistenceLayer.save('crud-test.json', updatedData);
    const loadedUpdatedData = await persistenceLayer.load('crud-test.json');
    expect(loadedUpdatedData.message).toBe('Updated message');
    
    // Delete
    const deleteResult = await persistenceLayer.delete('crud-test.json');
    expect(deleteResult).toBe(true);
    const loadedAfterDelete = await persistenceLayer.load('crud-test.json');
    expect(loadedAfterDelete).toBe(null);
  });
  
  // Test getKeys functionality
  test('should list keys with optional prefix filtering', async () => {
    // Save multiple files
    await persistenceLayer.save('test-1.json', { data: 1 });
    await persistenceLayer.save('test-2.json', { data: 2 });
    await persistenceLayer.save('other-1.json', { data: 3 });
    
    // Get all keys
    const allKeys = await persistenceLayer.getKeys();
    expect(allKeys.length).toBeGreaterThanOrEqual(3);
    
    // Get keys with prefix
    const testKeys = await persistenceLayer.getKeys('test-');
    expect(testKeys.length).toBe(2);
    expect(testKeys.includes('test-1.json')).toBe(true);
    expect(testKeys.includes('test-2.json')).toBe(true);
    
    // Get keys with different prefix
    const otherKeys = await persistenceLayer.getKeys('other-');
    expect(otherKeys.length).toBe(1);
    expect(otherKeys.includes('other-1.json')).toBe(true);
    
    // Cleanup
    await persistenceLayer.delete('test-1.json');
    await persistenceLayer.delete('test-2.json');
    await persistenceLayer.delete('other-1.json');
  });
});