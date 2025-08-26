/**
 * Ultra-minimal JavaScript test for Persistent Context
 * 
 * This test is stripped down to the absolute minimum to diagnose jest execution issues.
 * It avoids all TypeScript transformations and complex dependencies.
 */

// Force reasonable timeout
jest.setTimeout(30000);

describe('Ultra-Minimal Persistent Context Test', () => {
  // Very basic test for in-memory context
  it('should handle basic context operations with in-memory storage', (done) => {
    console.log('Starting ultra-minimal context test at:', Date.now());
    
    // Create a simple in-memory context store without any dependencies
    class InMemoryStore {
      constructor() {
        this.storage = new Map();
      }
      
      async save(key, data) {
        console.log('Saving context at:', Date.now());
        this.storage.set(key, JSON.stringify(data, this.replacer.bind(this)));
        return true;
      }
      
      async load(key) {
        console.log('Loading context at:', Date.now());
        const data = this.storage.get(key);
        return data ? JSON.parse(data, this.reviver.bind(this)) : null;
      }
      
      // Custom JSON replacer for dates
      replacer(key, value) {
        if (value instanceof Date) {
          return { __date: value.toISOString() };
        }
        return value;
      }
      
      // Custom JSON reviver for dates
      reviver(key, value) {
        if (value && typeof value === 'object' && value.__date) {
          return new Date(value.__date);
        }
        return value;
      }
    }
    
    // Create a very simple context service
    class MinimalContextService {
      constructor(storage) {
        this.storage = storage;
      }
      
      async initializeSession(sessionId) {
        console.log('Initializing session at:', Date.now());
        
        // Try to load existing context
        let context = await this.storage.load(sessionId);
        
        // Create new context if none exists
        if (!context) {
          context = {
            sessionId: sessionId,
            historyChunks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1
          };
          await this.storage.save(sessionId, context);
        }
        
        return context;
      }
      
      async saveContext(context) {
        console.log('Saving context at:', Date.now());
        context.updatedAt = new Date();
        await this.storage.save(context.sessionId, context);
        return context;
      }
      
      async addHistoryChunk(sessionId, chunk) {
        console.log('Adding history chunk at:', Date.now());
        
        // Load context
        const context = await this.storage.load(sessionId);
        if (!context) {
          throw new Error(`Session ${sessionId} not found`);
        }
        
        // Add chunk
        context.historyChunks.push(chunk);
        context.updatedAt = new Date();
        context.version += 1;
        
        // Save context
        await this.storage.save(sessionId, context);
        
        return context;
      }
    }
    
    // Run the test
    async function runTest() {
      try {
        // Create components
        const storage = new InMemoryStore();
        const service = new MinimalContextService(storage);
        const sessionId = `test-session-${Date.now()}`;
        
        // Initialize session
        console.log('Before session initialize at:', Date.now());
        const context = await service.initializeSession(sessionId);
        console.log('After session initialize at:', Date.now());
        
        // Verify base context
        expect(context).toBeTruthy();
        expect(context.sessionId).toBe(sessionId);
        expect(context.historyChunks).toEqual([]);
        expect(context.createdAt instanceof Date).toBe(true);
        expect(context.updatedAt instanceof Date).toBe(true);
        
        // Add a history chunk
        console.log('Before adding chunk at:', Date.now());
        const chunk = {
          id: `chunk-${Date.now()}`,
          content: 'Test content',
          timestamp: new Date()
        };
        
        const updatedContext = await service.addHistoryChunk(sessionId, chunk);
        console.log('After adding chunk at:', Date.now());
        
        // Verify updated context
        expect(updatedContext.historyChunks.length).toBe(1);
        expect(updatedContext.historyChunks[0].id).toBe(chunk.id);
        expect(updatedContext.historyChunks[0].content).toBe(chunk.content);
        expect(updatedContext.historyChunks[0].timestamp instanceof Date).toBe(true);
        
        // Test reloading context
        console.log('Before reload at:', Date.now());
        const reloadedContext = await service.initializeSession(sessionId);
        console.log('After reload at:', Date.now());
        
        // Verify reloaded context
        expect(reloadedContext.historyChunks.length).toBe(1);
        expect(reloadedContext.historyChunks[0].id).toBe(chunk.id);
        expect(reloadedContext.historyChunks[0].timestamp instanceof Date).toBe(true);
        
        console.log('Test completed successfully at:', Date.now());
        done();
      } catch (error) {
        console.error('Test failed:', error);
        done(error);
      }
    }
    
    // Start the test
    runTest();
  });
});