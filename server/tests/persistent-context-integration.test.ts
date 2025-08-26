/**
 * Integration tests for the Persistent Context functionality
 * 
 * These tests verify that the persistence layer correctly stores and retrieves context
 * information across different cognitive layers, enabling WiltonOS's memory-centric 
 * cognitive architecture.
 */

// NOTE: context-manager.ts and persistence-layer.ts are intentionally located
// in server/services/ for the current implementation. This is the verified
// working structure. Do not move these files without updating ALL import paths
// throughout the project.

import { expect } from 'chai';
import { PersistentContext, HistoryChunk, StrategicPlan, MetaInsight, CognitiveLayer, MetaEventType } from '../services/context-manager.js';
import { persistentContextService } from '../services/persistence-layer.js';
import { persistentOrchestrationEngine } from '../services/neural-orchestrator/persistent-orchestration-engine.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

describe('Persistent Context Integration Tests', () => {
  let testSessionId: string;
  let contextFilePath: string;

  // Create a unique session ID for each test run to avoid conflicts
  before(async () => {
    testSessionId = `test-session-${uuidv4()}`;
    contextFilePath = path.join(process.cwd(), 'contexts', `${testSessionId}.json`);
    
    // Initialize the session
    await persistentOrchestrationEngine.initializeSession(testSessionId);
  });

  // Clean up after all tests are complete
  after(async () => {
    // Remove the test context file if it exists
    if (fs.existsSync(contextFilePath)) {
      fs.unlinkSync(contextFilePath);
    }
  });

  describe('Persistent Context Operations', () => {
    it('should initialize a session and create a context file', async () => {
      // Verify that the context file was created
      expect(fs.existsSync(contextFilePath)).to.be.true;

      // Load the context and verify basic structure
      const context = await persistentContextService.loadContext(testSessionId);
      expect(context).to.not.be.null;
      expect(context?.sessionId).to.equal(testSessionId);
      expect(context?.historyChunks).to.be.an('array').that.is.empty;
      expect(context?.strategicPlans).to.be.an('array').that.is.empty;
      expect(context?.metaInsights).to.be.an('array').that.is.empty;
    });

    it('should add and retrieve history chunks', async () => {
      // Create a test history chunk
      const historyChunk: HistoryChunk = {
        chunkId: uuidv4(),
        content: 'Test history entry',
        cognitiveLayer: CognitiveLayer.STRATEGIC,
        timestamp: new Date(),
        taskId: 'test-task-001',
        tags: ['test', 'integration']
      };

      // Add the chunk
      await persistentContextService.addHistoryChunk(testSessionId, historyChunk);

      // Verify chunk retrieval
      const history = await persistentContextService.getRecentHistory(
        testSessionId,
        CognitiveLayer.STRATEGIC,
        10
      );

      expect(history).to.be.an('array').with.lengthOf(1);
      expect(history[0].content).to.equal('Test history entry');
      expect(history[0].tags).to.deep.equal(['test', 'integration']);
    });

    it('should add and retrieve strategic plans', async () => {
      // Create a test strategic plan
      const strategicPlan: StrategicPlan = {
        taskId: 'test-plan-001',
        planSummary: 'Test strategic plan',
        subTasks: ['subtask-1', 'subtask-2'],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending'
      };

      // Add the plan
      await persistentContextService.addStrategicPlan(testSessionId, strategicPlan);

      // Verify plan retrieval
      const plans = await persistentContextService.getActiveStrategicPlans(testSessionId);

      expect(plans).to.be.an('array').with.lengthOf(1);
      expect(plans[0].planSummary).to.equal('Test strategic plan');
      expect(plans[0].status).to.equal('pending');
    });

    it('should add and retrieve meta-cognitive insights', async () => {
      // Create a test meta insight
      const insight: MetaInsight = {
        eventType: MetaEventType.PATTERN_RECOGNITION,
        summary: 'Test meta-cognitive insight',
        details: { source: 'integration-test', pattern: 'test-pattern' },
        timestamp: new Date(),
        importance: 0.8,
        confidence: 0.9
      };

      // Add the insight
      await persistentContextService.addMetaInsight(testSessionId, insight);

      // Verify insight retrieval
      const insights = await persistentContextService.getInsightsByType(
        testSessionId,
        MetaEventType.PATTERN_RECOGNITION,
        0.5
      );

      expect(insights).to.be.an('array').with.lengthOf(1);
      expect(insights[0].summary).to.equal('Test meta-cognitive insight');
      expect(insights[0].importance).to.equal(0.8);
    });

    it('should persist context between service restarts', async () => {
      // Create a unique identifier to verify across restarts
      const uniqueId = uuidv4();
      
      // Add a history chunk with the unique identifier
      const historyChunk: HistoryChunk = {
        chunkId: uniqueId,
        content: `Persistence test with ID: ${uniqueId}`,
        cognitiveLayer: CognitiveLayer.META_COGNITIVE,
        timestamp: new Date(),
        taskId: 'test-task-002',
        tags: ['persistence', 'restart']
      };

      // Add the chunk
      await persistentContextService.addHistoryChunk(testSessionId, historyChunk);
      
      // Simulate service restart by creating a new instance and loading the context
      const newContextService = persistentContextService;
      await newContextService.initializeSession(testSessionId);
      
      // Verify the chunk is still there after "restart"
      const history = await newContextService.getRecentHistory(
        testSessionId,
        CognitiveLayer.META_COGNITIVE,
        10
      );
      
      expect(history).to.be.an('array');
      const foundChunk = history.find(chunk => chunk.chunkId === uniqueId);
      expect(foundChunk).to.not.be.undefined;
      expect(foundChunk?.content).to.include(uniqueId);
    });

    it('should search context based on query text', async () => {
      // Add a history chunk with unique searchable content
      const searchTerm = `searchable-${uuidv4()}`;
      const historyChunk: HistoryChunk = {
        chunkId: uuidv4(),
        content: `This is a ${searchTerm} content that should be findable`,
        cognitiveLayer: CognitiveLayer.REACTIVE,
        timestamp: new Date(),
        taskId: 'test-task-003',
        tags: ['search', 'test']
      };
      
      // Add the chunk
      await persistentContextService.addHistoryChunk(testSessionId, historyChunk);
      
      // Search for the chunk using the search term
      const searchResults = await persistentContextService.searchContext(testSessionId, searchTerm);
      
      expect(searchResults).to.be.an('array').with.lengthOf.at.least(1);
      const foundChunk = searchResults.find(chunk => chunk.content.includes(searchTerm));
      expect(foundChunk).to.not.be.undefined;
      expect(foundChunk?.tags).to.deep.include('search');
    });
  });
});