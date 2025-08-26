/**
 * Persistent Context Test with Quantum Balance
 * 
 * This test implements the Explicit-Implicit Quantum Balance principle
 * to ensure efficient and reliable context persistence operations, fixing
 * the timeout issues in previous test implementations.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { EnhancedMockPersistenceLayer } from './mocks/enhanced-mock-persistence-layer.js';
import { FileSystemPersistentContextService } from '../services/persistence-layer.js';
import { CognitiveLayer, MetaEventType } from '../services/context-manager.js';
import { formatTestDescription, setupTestTimeout, withTimeout } from './utils/test-helpers.js';
import { v4 as uuidv4 } from 'uuid';

// Define PREFIX/SUFFIX templates
const testPrefix = {
  testCategory: 'Persistence',
  componentUnderTest: 'PersistentContextService',
  timeoutMs: 5000,
  isolationLevel: 'unit' as const,
};

const testSuffix = {
  cleanupNeeded: false, // In-memory storage doesn't require cleanup
  expectedOutcome: 'All operations complete within timeout bounds',
};

describe(
  formatTestDescription(
    testPrefix,
    'Persistent Context Service with Quantum Balance',
    testSuffix
  ), 
  () => {
    // Set test timeout explicitly
    setupTestTimeout(testPrefix.timeoutMs);
    
    let persistenceLayer: EnhancedMockPersistenceLayer;
    let contextService: FileSystemPersistentContextService;
    let testSessionId: string;
    
    beforeEach(() => {
      // Create a new persistence layer for each test
      persistenceLayer = new EnhancedMockPersistenceLayer();
      
      // Create a new context service using our enhanced persistence layer
      contextService = new FileSystemPersistentContextService(persistenceLayer);
      
      // Generate a unique session ID for this test
      testSessionId = `test-session-${uuidv4()}`;
    });
    
    it('should initialize session with proper date handling', async () => {
      // Run operation with explicit timeout
      const context = await withTimeout(
        () => contextService.initializeSession(testSessionId),
        2000,
        'Session initialization timed out'
      );
      
      // Verify context structure
      expect(context).not.toBeNull();
      expect(context.sessionId).toBe(testSessionId);
      expect(context.historyChunks).toEqual([]);
      expect(context.strategicPlans).toEqual([]);
      expect(context.metaInsights).toEqual([]);
      expect(context.relationships).toEqual([]);
      
      // Explicitly verify Date objects using instanceof
      expect(context.createdAt instanceof Date).toBe(true);
      expect(context.updatedAt instanceof Date).toBe(true);
    });
    
    it('should add and retrieve history chunks with proper date handling', async () => {
      // Initialize session
      await contextService.initializeSession(testSessionId);
      
      // Create a history chunk with explicit date
      const timestamp = new Date();
      const historyChunk = {
        chunkId: `chunk-${Date.now()}`,
        content: 'Test content',
        cognitiveLayer: CognitiveLayer.STRATEGIC,
        timestamp: timestamp,
        taskId: 'test-task',
        tags: ['test', 'quantum-balance'],
      };
      
      // Add the chunk with timeout protection
      await withTimeout(
        () => contextService.addHistoryChunk(testSessionId, historyChunk),
        2000,
        'Adding history chunk timed out'
      );
      
      // Retrieve the chunks with timeout protection
      const chunks = await withTimeout(
        () => contextService.getRecentHistory(testSessionId, CognitiveLayer.STRATEGIC, 10),
        2000,
        'Getting history chunks timed out'
      );
      
      // Verify the chunk content
      expect(chunks.length).toBe(1);
      expect(chunks[0].content).toBe('Test content');
      expect(chunks[0].chunkId).toBe(historyChunk.chunkId);
      
      // Explicitly verify the timestamp is a Date object
      expect(chunks[0].timestamp instanceof Date).toBe(true);
      
      // Verify timestamp equality within reasonable tolerance
      const retrievedTime = chunks[0].timestamp.getTime();
      const originalTime = timestamp.getTime();
      expect(Math.abs(retrievedTime - originalTime)).toBeLessThan(10); // Within 10ms
    });
    
    it('should add and update strategic plans with proper date handling', async () => {
      // Initialize session
      await contextService.initializeSession(testSessionId);
      
      // Create strategic plan with explicit dates
      const createdAt = new Date();
      const updatedAt = new Date(createdAt.getTime() + 1000); // 1 second later
      
      const strategicPlan = {
        taskId: 'test-plan-001',
        planSummary: 'Test strategic plan',
        subTasks: ['subtask-1', 'subtask-2'],
        createdAt: createdAt,
        updatedAt: updatedAt,
        status: 'pending' as const,
      };
      
      // Add the plan with timeout protection
      await withTimeout(
        () => contextService.addStrategicPlan(testSessionId, strategicPlan),
        2000,
        'Adding strategic plan timed out'
      );
      
      // Get active plans with timeout protection
      const plans = await withTimeout(
        () => contextService.getActiveStrategicPlans(testSessionId),
        2000,
        'Getting strategic plans timed out'
      );
      
      // Verify the plan content
      expect(plans.length).toBe(1);
      expect(plans[0].planSummary).toBe('Test strategic plan');
      expect(plans[0].taskId).toBe('test-plan-001');
      
      // Explicitly verify dates are Date objects
      expect(plans[0].createdAt instanceof Date).toBe(true);
      expect(plans[0].updatedAt instanceof Date).toBe(true);
      
      // Update the plan status with timeout protection
      const completedAt = new Date();
      const updatedPlan = {
        ...strategicPlan,
        status: 'completed' as const,
        completedAt: completedAt,
      };
      
      await withTimeout(
        () => contextService.updateStrategicPlan(testSessionId, updatedPlan),
        2000,
        'Updating strategic plan timed out'
      );
      
      // Reload the context to verify update
      const context = await withTimeout(
        () => contextService.loadContext(testSessionId),
        2000,
        'Loading context timed out'
      );
      
      // Find the updated plan
      const foundPlan = context.strategicPlans.find(p => p.taskId === 'test-plan-001');
      expect(foundPlan).not.toBeUndefined();
      expect(foundPlan.status).toBe('completed');
      
      // Verify completedAt is a Date object
      expect(foundPlan.completedAt instanceof Date).toBe(true);
      
      // Verify date values within reasonable tolerance
      expect(Math.abs(foundPlan.completedAt.getTime() - completedAt.getTime())).toBeLessThan(10);
    });
    
    it('should add and retrieve meta-cognitive insights with proper date handling', async () => {
      // Initialize session
      await contextService.initializeSession(testSessionId);
      
      // Create a meta-cognitive insight with explicit timestamp
      const timestamp = new Date();
      const insight = {
        eventType: MetaEventType.PATTERN_RECOGNITION,
        summary: 'Test meta-cognitive insight',
        details: { source: 'quantum-balance-test', pattern: 'test-pattern' },
        timestamp: timestamp,
        importance: 0.8,
        confidence: 0.9,
      };
      
      // Add the insight with timeout protection
      await withTimeout(
        () => contextService.addMetaInsight(testSessionId, insight),
        2000,
        'Adding meta-insight timed out'
      );
      
      // Get insights with timeout protection
      const insights = await withTimeout(
        () => contextService.getInsightsByType(
          testSessionId, 
          MetaEventType.PATTERN_RECOGNITION,
          0.5
        ),
        2000,
        'Getting insights timed out'
      );
      
      // Verify insight content
      expect(insights.length).toBe(1);
      expect(insights[0].summary).toBe('Test meta-cognitive insight');
      expect(insights[0].importance).toBeGreaterThanOrEqual(0.5);
      
      // Explicitly verify timestamp is a Date object
      expect(insights[0].timestamp instanceof Date).toBe(true);
      
      // Verify timestamp value within reasonable tolerance
      expect(Math.abs(insights[0].timestamp.getTime() - timestamp.getTime())).toBeLessThan(10);
    });
    
    it('should search context with proper results and timing', async () => {
      // Initialize session
      await contextService.initializeSession(testSessionId);
      
      // Create a unique search term
      const searchTerm = `searchable-${uuidv4()}`;
      
      // Add a chunk with the search term
      const chunk = {
        chunkId: uuidv4(),
        content: `This is a ${searchTerm} content that should be findable`,
        cognitiveLayer: CognitiveLayer.REACTIVE,
        timestamp: new Date(),
        taskId: 't-search-1',
        tags: ['search', 'test'],
      };
      
      // Add the chunk with timeout protection
      await withTimeout(
        () => contextService.addHistoryChunk(testSessionId, chunk),
        2000,
        'Adding history chunk timed out'
      );
      
      // Search for the term with timeout protection
      const searchResults = await withTimeout(
        () => contextService.searchContext(testSessionId, searchTerm),
        2000,
        'Context search timed out'
      );
      
      // Verify search results
      expect(searchResults.length).toBeGreaterThan(0);
      const foundChunk = searchResults.find(c => c.content.includes(searchTerm));
      expect(foundChunk).toBeDefined();
      expect(foundChunk.tags).toContain('search');
      
      // Explicitly verify timestamp is a Date object
      expect(foundChunk.timestamp instanceof Date).toBe(true);
    });
  }
);