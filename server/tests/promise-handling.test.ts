/**
 * Promise handling test with explicit error catching
 * This test focuses on thoroughly testing async/await and promise handling
 */

// Add explicit promise handling and error tracking
describe('Promise Handling Test', () => {
  // Set longer timeout
  jest.setTimeout(30000);
  
  // Track if done callback is called
  let doneCallbackCalled = false;

  // Test with done callback
  it('should handle promises with done callback', (done) => {
    console.log('Test with done callback starting:', Date.now());
    
    // This promise will resolve successfully
    const successPromise = new Promise<string>((resolve) => {
      setTimeout(() => {
        console.log('Success promise resolving:', Date.now());
        resolve('success');
      }, 100);
    });
    
    // Execute the promise
    successPromise
      .then((result) => {
        console.log('Success promise resolved with result:', result, Date.now());
        expect(result).toBe('success');
        doneCallbackCalled = true;
        done(); // Signal completion
      })
      .catch((error) => {
        console.error('Error in successPromise (unexpected):', error, Date.now());
        doneCallbackCalled = true;
        done(error); // Signal failure
      });
      
    console.log('Test with done callback initiated:', Date.now());
  });
  
  // Test with async/await
  it('should handle promises with async/await', async () => {
    console.log('Test with async/await starting:', Date.now());
    
    try {
      // This promise will resolve successfully
      const result = await new Promise<string>((resolve) => {
        setTimeout(() => {
          console.log('Async promise resolving:', Date.now());
          resolve('success');
        }, 100);
      });
      
      console.log('Async promise resolved with result:', result, Date.now());
      expect(result).toBe('success');
    } catch (error) {
      console.error('Error in async test (unexpected):', error, Date.now());
      throw error; // Re-throw to fail the test
    }
    
    console.log('Test with async/await completed:', Date.now());
  });
  
  // After all tests complete, verify done callback was called
  afterAll(() => {
    console.log('Done callback called:', doneCallbackCalled, Date.now());
    expect(doneCallbackCalled).toBe(true);
  });
});