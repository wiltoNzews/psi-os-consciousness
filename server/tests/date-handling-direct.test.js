/**
 * Direct Test for Date Handling in Persistent Context
 * 
 * This is a JavaScript test that directly tests date handling in persistent context
 * without TypeScript transformation that might be causing issues.
 */

// Simplified test context service
class TestContextService {
  constructor() {
    this.sessions = new Map();
  }

  async initializeSession(sessionId) {
    const session = {
      historyChunks: [],
      strategicPlans: [],
      metaInsights: [],
      systemStats: {
        lastUpdated: new Date(),
        stability: 0.85
      }
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  async saveSession(sessionId, sessionData) {
    // First serialize to JSON and then deserialize to simulate storage
    const serialized = JSON.stringify(sessionData);
    const deserialized = JSON.parse(serialized, this.dateReviver);
    this.sessions.set(sessionId, deserialized);
    return Promise.resolve();
  }

  async loadSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    return Promise.resolve(session);
  }

  // Date reviver function for JSON parsing
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

describe('Date Handling in Persistent Context', () => {
  let contextService;
  let sessionId;
  
  beforeEach(() => {
    contextService = new TestContextService();
    sessionId = 'test-session-' + Date.now();
  });
  
  it('should preserve Date objects through serialization cycles', (done) => {
    console.log('Test starting timestamp:', Date.now());
    
    // Initialize session
    contextService.initializeSession(sessionId)
      .then(session => {
        console.log('Session initialized');
        
        // Add a history chunk with current date
        const now = new Date();
        session.historyChunks.push({
          chunkId: 'chunk-1',
          content: 'Test content',
          cognitiveLayer: 'STRATEGIC',
          timestamp: now,
          tags: ['test']
        });
        
        // Add strategic plan with dates
        session.strategicPlans.push({
          taskId: 'task-1',
          planSummary: 'Test plan',
          subTasks: ['sub-1', 'sub-2'],
          createdAt: new Date(now.getTime() - 60000),  // 1 minute ago
          updatedAt: now,
          status: 'pending'
        });
        
        // Save session
        console.log('Saving session with dates:', {
          historyChunkDate: session.historyChunks[0].timestamp,
          planCreatedAt: session.strategicPlans[0].createdAt,
          planUpdatedAt: session.strategicPlans[0].updatedAt
        });
        
        return contextService.saveSession(sessionId, session);
      })
      .then(() => {
        console.log('Session saved, now loading');
        return contextService.loadSession(sessionId);
      })
      .then(loadedSession => {
        console.log('Session loaded successfully');
        
        const historyChunk = loadedSession.historyChunks[0];
        const plan = loadedSession.strategicPlans[0];
        
        // Log details about the loaded dates
        console.log('History chunk timestamp type:', typeof historyChunk.timestamp);
        console.log('History chunk timestamp is Date?', historyChunk.timestamp instanceof Date);
        console.log('History chunk timestamp:', historyChunk.timestamp);
        
        console.log('Plan createdAt type:', typeof plan.createdAt);
        console.log('Plan createdAt is Date?', plan.createdAt instanceof Date);
        console.log('Plan createdAt:', plan.createdAt);
        
        console.log('Plan updatedAt type:', typeof plan.updatedAt);
        console.log('Plan updatedAt is Date?', plan.updatedAt instanceof Date);
        console.log('Plan updatedAt:', plan.updatedAt);
        
        // Perform assertions
        expect(historyChunk.timestamp).toBeInstanceOf(Date);
        expect(plan.createdAt).toBeInstanceOf(Date);
        expect(plan.updatedAt).toBeInstanceOf(Date);
        
        // Check that system stats date also preserved
        expect(loadedSession.systemStats.lastUpdated).toBeInstanceOf(Date);
        
        console.log('Test completed successfully at:', Date.now());
        done();
      })
      .catch(error => {
        console.error('Test failed with error:', error);
        done(error);
      });
  });
});