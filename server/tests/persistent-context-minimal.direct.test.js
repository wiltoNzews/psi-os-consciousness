/**
 * Minimal Direct JavaScript Test for Persistent Context
 * 
 * This test focuses on the core date handling functionality of the persistent context
 * system, but uses pure JavaScript to avoid TypeScript transformation issues.
 */

// Create minimal mock implementations that mimic the real system
class InMemoryStore {
  constructor() {
    this.storage = new Map();
  }

  async save(key, data) {
    console.log('[InMemoryStore] Save operation started');
    // Convert dates to ISO strings before serializing
    const serialized = JSON.stringify(data, (k, v) => {
      if (v instanceof Date) {
        return v.toISOString();
      }
      return v;
    });
    this.storage.set(key, serialized);
    console.log('[InMemoryStore] Save operation completed');
    return Promise.resolve();
  }

  async load(key) {
    console.log('[InMemoryStore] Load operation started');
    const data = this.storage.get(key);
    if (!data) return null;
    
    // Parse JSON and convert ISO date strings back to Date objects
    const parsed = JSON.parse(data, this.dateReviver);
    console.log('[InMemoryStore] Load operation completed');
    return Promise.resolve(parsed);
  }

  async getKeys(prefix) {
    console.log('[InMemoryStore] Getting keys with prefix:', prefix);
    const keys = Array.from(this.storage.keys()).filter(key => 
      !prefix || key.startsWith(prefix)
    );
    return Promise.resolve(keys);
  }

  async delete(key) {
    console.log('[InMemoryStore] Deleting key:', key);
    const had = this.storage.has(key);
    this.storage.delete(key);
    return Promise.resolve(had);
  }

  dateReviver(key, value) {
    // ISO date pattern
    const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    
    // If value is a string and matches ISO date pattern, convert to Date
    if (typeof value === 'string' && datePattern.test(value)) {
      return new Date(value);
    }
    return value;
  }
}

// Simplified PersistentContextService
class PersistentContextService {
  constructor(persistenceLayer) {
    this.persistenceLayer = persistenceLayer;
    this.sessionCache = new Map();
  }

  async getContext(sessionId) {
    console.log('[PersistentContextService] Getting context for session:', sessionId);
    
    // Check cache first
    if (this.sessionCache.has(sessionId)) {
      console.log('[PersistentContextService] Returning cached context');
      return this.sessionCache.get(sessionId);
    }
    
    // Load from persistence layer
    let context = await this.loadContext(sessionId);
    
    // If no context exists, initialize a new one
    if (!context) {
      console.log('[PersistentContextService] Creating new context');
      context = this.createEmptyContext(sessionId);
      await this.saveContext(sessionId, context);
    }
    
    // Update cache
    this.sessionCache.set(sessionId, context);
    
    return context;
  }

  async saveContext(sessionId, context) {
    console.log('[PersistentContextService] Saving context for session:', sessionId);
    
    // Add metadata
    context.systemMetadata = {
      ...context.systemMetadata || {},
      lastUpdated: new Date(),
      version: (context.systemMetadata?.version || 0) + 1
    };
    
    // Update cache
    this.sessionCache.set(sessionId, context);
    
    // Save to persistence layer
    await this.persistenceLayer.save(`context-${sessionId}.json`, context);
    
    return context;
  }

  async loadContext(sessionId) {
    console.log('[PersistentContextService] Loading context from persistence layer');
    
    // Load from persistence layer
    const context = await this.persistenceLayer.load(`context-${sessionId}.json`);
    
    return context;
  }

  createEmptyContext(sessionId) {
    return {
      sessionId,
      historyChunks: [],
      strategicPlans: [],
      metaInsights: [],
      contextRelationships: [],
      systemMetadata: {
        created: new Date(),
        lastUpdated: new Date(),
        version: 1
      }
    };
  }

  // Add a history chunk to the context
  async addHistoryChunk(sessionId, chunk) {
    console.log('[PersistentContextService] Adding history chunk');
    
    const context = await this.getContext(sessionId);
    
    // Add timestamp if not provided
    if (!chunk.timestamp) {
      chunk.timestamp = new Date();
    }
    
    // Add the chunk
    context.historyChunks.push(chunk);
    
    // Save the updated context
    await this.saveContext(sessionId, context);
    
    return chunk;
  }

  // Add a strategic plan to the context
  async addStrategicPlan(sessionId, plan) {
    console.log('[PersistentContextService] Adding strategic plan');
    
    const context = await this.getContext(sessionId);
    
    // Add timestamps if not provided
    const now = new Date();
    if (!plan.createdAt) {
      plan.createdAt = now;
    }
    if (!plan.updatedAt) {
      plan.updatedAt = now;
    }
    
    // Add the plan
    context.strategicPlans.push(plan);
    
    // Save the updated context
    await this.saveContext(sessionId, context);
    
    return plan;
  }

  // Get recent history chunks
  async getRecentHistory(sessionId, limit = 10) {
    console.log('[PersistentContextService] Getting recent history');
    
    const context = await this.getContext(sessionId);
    
    // Sort by timestamp (newest first) and take the most recent
    return context.historyChunks
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
}

describe('Minimal Persistent Context Test (Direct)', () => {
  let persistenceLayer;
  let contextService;
  let sessionId;
  
  beforeEach(() => {
    persistenceLayer = new InMemoryStore();
    contextService = new PersistentContextService(persistenceLayer);
    sessionId = 'test-session-' + Date.now();
  });
  
  it('should initialize a new context with proper date handling', (done) => {
    console.log('Test starting at:', new Date().toISOString());
    
    contextService.getContext(sessionId)
      .then(context => {
        console.log('Context initialized');
        
        // Verify SystemMetadata dates
        expect(context.systemMetadata.created).toBeInstanceOf(Date);
        expect(context.systemMetadata.lastUpdated).toBeInstanceOf(Date);
        
        done();
      })
      .catch(error => {
        console.error('Test failed:', error);
        done(error);
      });
  });
  
  it('should preserve dates in history chunks through serialization', (done) => {
    console.log('Test starting at:', new Date().toISOString());
    
    // Create a history chunk with explicit date
    const historyDate = new Date('2025-01-01T12:00:00.000Z');
    const historyChunk = {
      chunkId: 'test-chunk-1',
      content: 'Test content for date preservation',
      cognitiveLayer: 'STRATEGIC',
      timestamp: historyDate,
      tags: ['test', 'date-handling']
    };
    
    contextService.addHistoryChunk(sessionId, historyChunk)
      .then(() => {
        console.log('History chunk added, now retrieving it');
        return contextService.getRecentHistory(sessionId);
      })
      .then(recentHistory => {
        console.log('Retrieved recent history');
        
        // Should have our test chunk
        expect(recentHistory.length).toBeGreaterThan(0);
        
        const retrievedChunk = recentHistory[0];
        
        // Verify the date was preserved
        expect(retrievedChunk.timestamp).toBeInstanceOf(Date);
        expect(retrievedChunk.timestamp.toISOString()).toBe(historyDate.toISOString());
        
        // Force a reload from persistence to verify serialization cycle
        contextService.sessionCache.delete(sessionId);
        
        return contextService.getRecentHistory(sessionId);
      })
      .then(recentHistoryAfterReload => {
        console.log('Retrieved history after cache clear (forced reload from persistence)');
        
        const retrievedChunkAfterReload = recentHistoryAfterReload[0];
        
        // Verify date still preserved after full serialization cycle
        expect(retrievedChunkAfterReload.timestamp).toBeInstanceOf(Date);
        expect(retrievedChunkAfterReload.timestamp.toISOString()).toBe(historyDate.toISOString());
        
        done();
      })
      .catch(error => {
        console.error('Test failed:', error);
        done(error);
      });
  });
  
  it('should preserve dates in strategic plans through serialization', (done) => {
    console.log('Test starting at:', new Date().toISOString());
    
    // Create strategic plan with explicit dates
    const createdDate = new Date('2025-01-01T12:00:00.000Z');
    const updatedDate = new Date('2025-01-02T12:00:00.000Z');
    
    const strategicPlan = {
      taskId: 'test-task-1',
      planSummary: 'Test strategic plan for date handling',
      subTasks: ['subtask-1', 'subtask-2'],
      createdAt: createdDate,
      updatedAt: updatedDate,
      status: 'pending'
    };
    
    contextService.addStrategicPlan(sessionId, strategicPlan)
      .then(addedPlan => {
        console.log('Strategic plan added');
        
        // Verify dates in the returned plan
        expect(addedPlan.createdAt).toBeInstanceOf(Date);
        expect(addedPlan.updatedAt).toBeInstanceOf(Date);
        expect(addedPlan.createdAt.toISOString()).toBe(createdDate.toISOString());
        expect(addedPlan.updatedAt.toISOString()).toBe(updatedDate.toISOString());
        
        // Force a reload from persistence
        contextService.sessionCache.delete(sessionId);
        
        return contextService.getContext(sessionId);
      })
      .then(reloadedContext => {
        console.log('Context reloaded from persistence');
        
        // Should have our test plan
        expect(reloadedContext.strategicPlans.length).toBe(1);
        
        const reloadedPlan = reloadedContext.strategicPlans[0];
        
        // Verify dates preserved through serialization
        expect(reloadedPlan.createdAt).toBeInstanceOf(Date);
        expect(reloadedPlan.updatedAt).toBeInstanceOf(Date);
        expect(reloadedPlan.createdAt.toISOString()).toBe(createdDate.toISOString());
        expect(reloadedPlan.updatedAt.toISOString()).toBe(updatedDate.toISOString());
        
        done();
      })
      .catch(error => {
        console.error('Test failed:', error);
        done(error);
      });
  });
});