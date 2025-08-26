/**
 * Ultra-minimal test with no ts-jest transformation
 * This test is designed to diagnose issues with the Jest testing infrastructure
 */

describe('Ultra Minimal Test', () => {
  it('should work with simple in-memory operations', (done) => {
    console.log('Test starting timestamp:', Date.now());
    
    // Create a simple in-memory storage
    const storage = new Map();
    const testKey = 'test-key';
    const testData = { message: 'Hello World' };
    
    console.log('Before save timestamp:', Date.now());
    // Save data
    storage.set(testKey, JSON.stringify(testData));
    console.log('After save timestamp:', Date.now());
    
    console.log('Before load timestamp:', Date.now());
    // Load data
    const loadedDataStr = storage.get(testKey);
    const loadedData = JSON.parse(loadedDataStr);
    console.log('After load timestamp:', Date.now());
    
    // Test
    expect(loadedData).toEqual(testData);
    console.log('Test ending timestamp:', Date.now());
    
    // Explicitly call done to signal test completion
    done();
  });
});