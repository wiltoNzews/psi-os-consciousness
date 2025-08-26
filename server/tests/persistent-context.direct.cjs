/**
 * Direct execution test for Persistent Context Service
 * 
 * This file uses pure JavaScript (CommonJS) to test the core date serialization
 * functionality of the Persistent Context Service without any dependencies on
 * external testing frameworks.
 * 
 * Date serialization/deserialization is a critical component of our persistence layer,
 * as it directly impacts the system's ability to maintain accurate temporal context.
 */

// Simple in-memory storage implementation
class InMemoryStore {
  constructor() {
    this.dataStore = new Map();
    console.log('[Store] Initialized in-memory store');
  }

  async save(key, data) {
    console.log(`[Store] Saving data for key: ${key}`);
    
    // Use .bind(this) to ensure the replacer has the correct 'this' context
    const serializedData = JSON.stringify(data, this.replacer.bind(this));
    this.dataStore.set(key, serializedData);
    
    return true;
  }

  async load(key) {
    console.log(`[Store] Loading data for key: ${key}`);
    
    const serializedData = this.dataStore.get(key);
    if (!serializedData) {
      return null;
    }
    
    // Use .bind(this) to ensure the reviver has the correct 'this' context
    return JSON.parse(serializedData, this.reviver.bind(this));
  }
  
  async getKeys(prefix = '') {
    console.log(`[Store] Getting keys with prefix: ${prefix}`);
    
    return Array.from(this.dataStore.keys())
      .filter(key => key.startsWith(prefix));
  }
  
  async delete(key) {
    console.log(`[Store] Deleting key: ${key}`);
    
    if (this.dataStore.has(key)) {
      this.dataStore.delete(key);
      return true;
    }
    return false;
  }

  // Date handling for JSON serialization
  replacer(key, value) {
    if (value instanceof Date) {
      // Always use our custom format, never raw ISO strings
      return {
        __type: 'date',
        iso: value.toISOString()
      };
    }
    return value;
  }

  // Date handling for JSON parsing
  reviver(key, value) {
    // Check for our custom date format
    if (value && typeof value === 'object' && 
        value.__type === 'date' && 
        value.iso) {
      return new Date(value.iso);
    }
    
    // Also check for ISO date strings
    if (typeof value === 'string' && 
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
      return new Date(value);
    }
    
    return value;
  }
}

// Cognitive layer enum (simplified)
const CognitiveLayer = {
  REACTIVE: 'reactive',
  STRATEGIC: 'strategic',
  META_COGNITIVE: 'meta_cognitive',
  TECHNICAL: 'technical',
  CONCEPTUAL: 'conceptual',
  EMOTIONAL: 'emotional'
};

// Simple persistent context service
class PersistentContextService {
  constructor(persistenceLayer) {
    this.persistenceLayer = persistenceLayer;
    console.log('[Context] Initialized context service');
  }

  async initializeSession(sessionId) {
    console.log(`[Context] Initializing session: ${sessionId}`);
    
    // Create empty context
    const context = this.createEmptyContext(sessionId);
    
    // Save empty context
    await this.persistenceLayer.save(`session:${sessionId}`, context);
    
    return context;
  }

  async getContext(sessionId) {
    console.log(`[Context] Getting context for session: ${sessionId}`);
    
    // Try to load existing context
    const context = await this.persistenceLayer.load(`session:${sessionId}`);
    
    // If no context exists, create a new one
    if (!context) {
      return this.initializeSession(sessionId);
    }
    
    return context;
  }

  async saveContext(sessionId, context) {
    console.log(`[Context] Saving context for session: ${sessionId}`);
    
    // Update the version
    context.version = context.version + 1;
    
    // Save context
    await this.persistenceLayer.save(`session:${sessionId}`, context);
    
    return context;
  }

  createEmptyContext(sessionId) {
    return {
      sessionId,
      version: 1,
      created: new Date(),
      updated: new Date(),
      historyChunks: [],
      metaInsights: [],
      strategicPlans: [],
      relationships: [],
      metrics: {
        stability: 0.95,
        coherence: 0.9,
        efficiency: 0.85
      }
    };
  }

  async addHistoryChunk(sessionId, chunk) {
    console.log(`[Context] Adding history chunk to session: ${sessionId}`);
    
    // Get current context
    const context = await this.getContext(sessionId);
    
    // Ensure chunk has required fields
    if (!chunk.timestamp) {
      chunk.timestamp = new Date();
    }
    
    // Add chunk to history
    context.historyChunks.push(chunk);
    context.updated = new Date();
    
    // Save updated context
    return this.saveContext(sessionId, context);
  }

  async addStrategicPlan(sessionId, plan) {
    console.log(`[Context] Adding strategic plan to session: ${sessionId}`);
    
    // Get current context
    const context = await this.getContext(sessionId);
    
    // Ensure plan has required fields
    if (!plan.timestamp) {
      plan.timestamp = new Date();
    }
    
    if (!plan.targetDate) {
      // Default target date is 1 hour in the future
      plan.targetDate = new Date(Date.now() + 60 * 60 * 1000);
    }
    
    // Add plan
    context.strategicPlans.push(plan);
    context.updated = new Date();
    
    // Save updated context
    return this.saveContext(sessionId, context);
  }

  async getRecentHistory(sessionId, limit = 10) {
    console.log(`[Context] Getting recent history for session: ${sessionId}`);
    
    // Get current context
    const context = await this.getContext(sessionId);
    
    // Return most recent chunks
    return context.historyChunks
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

/**
 * Run a direct test of the Persistent Context Service
 */
async function runDirectTest() {
  console.log('STARTING DIRECT TEST OF PERSISTENT CONTEXT SERVICE');
  console.log('===============================================');
  
  // Create store and service
  const store = new InMemoryStore();
  const contextService = new PersistentContextService(store);
  
  // Create a test session
  const sessionId = `test-session-${Date.now()}`;
  console.log(`\nTest session ID: ${sessionId}`);
  
  try {
    // Test 1: Initialize session
    console.log('\nTEST 1: Initialize Session');
    console.log('------------------------');
    const initialContext = await contextService.initializeSession(sessionId);
    console.log('Initial context created with version:', initialContext.version);
    console.log('Initial context created at:', initialContext.created);
    
    // Check that created field is a Date object
    const createdIsDate = initialContext.created instanceof Date;
    console.log('Created field is Date object:', createdIsDate);
    
    // Test 2: Add history chunk
    console.log('\nTEST 2: Add History Chunk');
    console.log('-----------------------');
    
    const testChunk = {
      chunkId: `chunk-${Date.now()}`,
      content: 'This is a test history chunk',
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      timestamp: new Date(),
      tags: ['test', 'history']
    };
    
    const contextWithChunk = await contextService.addHistoryChunk(sessionId, testChunk);
    console.log('Context version after adding chunk:', contextWithChunk.version);
    console.log('History chunks count:', contextWithChunk.historyChunks.length);
    
    // Check that the chunk's timestamp is a Date object
    const chunkTimestampIsDate = contextWithChunk.historyChunks[0].timestamp instanceof Date;
    console.log('Chunk timestamp is Date object:', chunkTimestampIsDate);
    
    // Test 3: Add strategic plan
    console.log('\nTEST 3: Add Strategic Plan');
    console.log('------------------------');
    
    const testPlan = {
      planId: `plan-${Date.now()}`,
      name: 'Test Strategic Plan',
      description: 'A test plan for our direct test',
      tasks: ['task-1', 'task-2'],
      timestamp: new Date(),
      targetDate: new Date(Date.now() + 60 * 60 * 1000) // 1 hour in future
    };
    
    const contextWithPlan = await contextService.addStrategicPlan(sessionId, testPlan);
    console.log('Context version after adding plan:', contextWithPlan.version);
    console.log('Strategic plans count:', contextWithPlan.strategicPlans.length);
    
    // Check that the plan's dates are Date objects
    const planTimestampIsDate = contextWithPlan.strategicPlans[0].timestamp instanceof Date;
    const planTargetIsDate = contextWithPlan.strategicPlans[0].targetDate instanceof Date;
    console.log('Plan timestamp is Date object:', planTimestampIsDate);
    console.log('Plan target date is Date object:', planTargetIsDate);
    
    // Test 4: Retrieve context from scratch
    console.log('\nTEST 4: Retrieve Context');
    console.log('----------------------');
    
    const retrievedContext = await contextService.getContext(sessionId);
    console.log('Retrieved context version:', retrievedContext.version);
    console.log('Retrieved context updated:', retrievedContext.updated);
    
    // Check that the retrieved dates are Date objects
    const retrievedCreatedIsDate = retrievedContext.created instanceof Date;
    const retrievedUpdatedIsDate = retrievedContext.updated instanceof Date;
    console.log('Retrieved created is Date object:', retrievedCreatedIsDate);
    console.log('Retrieved updated is Date object:', retrievedUpdatedIsDate);
    
    // Check chunk and plan dates in retrieved context
    const retrievedChunkTimestampIsDate = retrievedContext.historyChunks[0].timestamp instanceof Date;
    const retrievedPlanTimestampIsDate = retrievedContext.strategicPlans[0].timestamp instanceof Date;
    const retrievedPlanTargetIsDate = retrievedContext.strategicPlans[0].targetDate instanceof Date;
    
    console.log('Retrieved chunk timestamp is Date object:', retrievedChunkTimestampIsDate);
    console.log('Retrieved plan timestamp is Date object:', retrievedPlanTimestampIsDate);
    console.log('Retrieved plan target is Date object:', retrievedPlanTargetIsDate);
    
    // Test 5: Get recent history
    console.log('\nTEST 5: Get Recent History');
    console.log('------------------------');
    
    // Add another history chunk with a later timestamp
    const newerChunk = {
      chunkId: `chunk-${Date.now() + 1}`,
      content: 'This is a more recent history chunk',
      cognitiveLayer: CognitiveLayer.META_COGNITIVE,
      timestamp: new Date(Date.now() + 1000), // 1 second later
      tags: ['test', 'recent']
    };
    
    await contextService.addHistoryChunk(sessionId, newerChunk);
    
    // Get recent history
    const recentHistory = await contextService.getRecentHistory(sessionId, 5);
    console.log('Recent history chunks:', recentHistory.length);
    
    // Check ordering (most recent first)
    const correctOrder = recentHistory[0].content === newerChunk.content;
    console.log('History is ordered correctly (newest first):', correctOrder);
    
    // Check that timestamps in recent history are Date objects
    const recentChunkTimestampIsDate = recentHistory[0].timestamp instanceof Date;
    console.log('Recent chunk timestamp is Date object:', recentChunkTimestampIsDate);
    
    // Verify overall test results
    const allPassed = 
      createdIsDate && 
      chunkTimestampIsDate && 
      planTimestampIsDate && 
      planTargetIsDate &&
      retrievedCreatedIsDate &&
      retrievedUpdatedIsDate &&
      retrievedChunkTimestampIsDate &&
      retrievedPlanTimestampIsDate &&
      retrievedPlanTargetIsDate &&
      recentChunkTimestampIsDate &&
      correctOrder;
    
    console.log('\nTEST SUMMARY');
    console.log('-----------');
    console.log('All tests passed:', allPassed ? 'YES' : 'NO');
    
    if (!allPassed) {
      console.log('FAILURES:');
      if (!createdIsDate) console.log('- Initial context created is not a Date');
      if (!chunkTimestampIsDate) console.log('- Chunk timestamp is not a Date');
      if (!planTimestampIsDate) console.log('- Plan timestamp is not a Date');
      if (!planTargetIsDate) console.log('- Plan target date is not a Date');
      if (!retrievedCreatedIsDate) console.log('- Retrieved created is not a Date');
      if (!retrievedUpdatedIsDate) console.log('- Retrieved updated is not a Date');
      if (!retrievedChunkTimestampIsDate) console.log('- Retrieved chunk timestamp is not a Date');
      if (!retrievedPlanTimestampIsDate) console.log('- Retrieved plan timestamp is not a Date');
      if (!retrievedPlanTargetIsDate) console.log('- Retrieved plan target is not a Date');
      if (!recentChunkTimestampIsDate) console.log('- Recent chunk timestamp is not a Date');
      if (!correctOrder) console.log('- History is not ordered correctly');
    }
    
    return allPassed;
    
  } catch (error) {
    console.error('ERROR in test:', error);
    return false;
  }
}

// Run the test
(async () => {
  try {
    const success = await runDirectTest();
    console.log('\nDIRECT TEST COMPLETE:', success ? 'SUCCESS' : 'FAILURE');
    
    // In Node.js environment, exit with appropriate code
    if (typeof process !== 'undefined') {
      process.exit(success ? 0 : 1);
    }
  } catch (error) {
    console.error('FATAL ERROR:', error);
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
  }
})();

// For use with Node.js
module.exports = { InMemoryStore, PersistentContextService };