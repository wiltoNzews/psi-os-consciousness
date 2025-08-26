/**
 * MemPersistentContextService Test Suite
 * 
 * Comprehensive tests for the MemPersistentContextService class with focus on proper date handling
 * via ChronosDateHandler for boundary integrity preservation.
 * 
 * This test suite follows the TSAR BOMBA verification approach with explicit testing
 * of all date serialization/deserialization boundaries, applying GOD MODULARITY FORMULA principles.
 */

import { ChronosDateHandler } from '../services/utils/chronos-date-handler.js';
import { IPersistentContextService, PersistentContext } from '../services/context/persistent-context-service.js';
import { MemPersistentContextService } from '../services/context/mem-persistent-context-service.js';
import { v4 as uuidv4 } from 'uuid';

// Type definitions for test data
interface HistoryChunk {
  id: string;
  content: string;
  timestamp: Date;
  layer: string;
  importance: number;
  source: string;
}

interface MetaInsight {
  id: string;
  observation: string;
  timestamp: Date;
  category: string;
  importance: number;
  confidence: number;
}

interface StrategicPlan {
  id: string;
  taskId: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

interface ContextRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  strength: number;
  timestamp: Date;
}

describe('MemPersistentContextService', () => {
  let contextService: MemPersistentContextService;
  let dateHandler: typeof ChronosDateHandler;
  
  beforeEach(() => {
    // Create a fresh MemPersistentContextService instance for each test
    contextService = new MemPersistentContextService();
    dateHandler = ChronosDateHandler;
  });
  
  describe('Initialization', () => {
    test('should initialize a new session with the correct initial values', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await contextService.initializeSession(sessionId);
      
      // Verify context structure
      expect(context).toBeDefined();
      expect(context.sessionId).toBe(sessionId);
      expect(context.history).toEqual([]);
      expect(context.metaInsights).toEqual([]);
      expect(context.strategicPlans).toEqual([]);
      expect(context.relationships).toEqual([]);
      expect(context.version).toBe(1);
      
      // Verify that lastUpdated is a proper Date object created with ChronosDateHandler
      expect(context.lastUpdated).toBeInstanceOf(Date);
      // Verify that the date is recent (within the last second)
      const now = dateHandler.createDate();
      const timeDiff = now.getTime() - context.lastUpdated.getTime();
      expect(timeDiff).toBeLessThan(1000);
    });
  });
  
  describe('Context Saving and Loading', () => {
    test('should save and load an empty context', async () => {
      const sessionId = `test-${uuidv4()}`;
      const initialContext = await contextService.initializeSession(sessionId);
      
      // Save the context
      await contextService.saveContext(initialContext);
      
      // Load the context
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify equality
      expect(loadedContext).toEqual(expect.objectContaining({
        sessionId: initialContext.sessionId,
        history: initialContext.history,
        metaInsights: initialContext.metaInsights,
        strategicPlans: initialContext.strategicPlans,
        relationships: initialContext.relationships
      }));
      expect(loadedContext?.lastUpdated).toBeInstanceOf(Date);
    });
    
    test('should save and load a context with history chunks', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await contextService.initializeSession(sessionId);
      
      // Create history chunks with proper dates using ChronosDateHandler
      const historyChunk1: HistoryChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'Test history chunk 1',
        timestamp: dateHandler.createDate(),
        layer: 'REACTIVE',
        importance: 5,
        source: 'test'
      };
      
      const historyChunk2: HistoryChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'Test history chunk 2',
        timestamp: new Date(new Date().getTime() - 5000), // 5 seconds ago
        layer: 'STRATEGIC',
        importance: 8,
        source: 'test'
      };
      
      // Add history chunks through the service API
      await contextService.addHistoryChunk(sessionId, historyChunk1);
      await contextService.addHistoryChunk(sessionId, historyChunk2);
      
      // Load context
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify loaded context
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.history.length).toBe(2);
      expect(loadedContext?.history[0].content).toBe('Test history chunk 1');
      expect(loadedContext?.history[1].content).toBe('Test history chunk 2');
      
      // Verify that dates are properly preserved as Date objects
      expect(loadedContext?.history[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.history[1].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.lastUpdated).toBeInstanceOf(Date);
      
      // Verify that date values match
      expect(loadedContext?.history[0].timestamp.getTime()).toBeCloseTo(historyChunk1.timestamp.getTime(), -2);
      expect(loadedContext?.history[1].timestamp.getTime()).toBeCloseTo(historyChunk2.timestamp.getTime(), -2);
    });
    
    test('should save and load a context with meta insights', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Create meta insights with proper dates using ChronosDateHandler
      const insight1: MetaInsight = {
        id: `insight-${uuidv4()}`,
        observation: 'Test insight 1',
        timestamp: dateHandler.createDate(),
        category: 'pattern',
        importance: 7,
        confidence: 0.85
      };
      
      const insight2: MetaInsight = {
        id: `insight-${uuidv4()}`,
        observation: 'Test insight 2',
        timestamp: new Date(new Date().getTime() - 10000), // 10 seconds ago
        category: 'trend',
        importance: 9,
        confidence: 0.92
      };
      
      // Add insights through the service API
      await contextService.addMetaInsight(sessionId, insight1);
      await contextService.addMetaInsight(sessionId, insight2);
      
      // Load context
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify loaded context
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.metaInsights.length).toBe(2);
      expect(loadedContext?.metaInsights[0].observation).toBe('Test insight 1');
      expect(loadedContext?.metaInsights[1].observation).toBe('Test insight 2');
      
      // Verify that dates are properly preserved as Date objects
      expect(loadedContext?.metaInsights[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.metaInsights[1].timestamp).toBeInstanceOf(Date);
      
      // Verify that date values match
      expect(loadedContext?.metaInsights[0].timestamp.getTime()).toBeCloseTo(insight1.timestamp.getTime(), -2);
      expect(loadedContext?.metaInsights[1].timestamp.getTime()).toBeCloseTo(insight2.timestamp.getTime(), -2);
    });
    
    test('should save and load a context with strategic plans', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Create strategic plans with proper dates using ChronosDateHandler
      const plan1: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Test plan 1',
        status: 'pending',
        createdAt: new Date(new Date().getTime() - 60000), // 1 minute ago
        updatedAt: dateHandler.createDate()
      };
      
      const plan2: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Test plan 2',
        status: 'in_progress',
        createdAt: new Date(new Date().getTime() - 120000), // 2 minutes ago
        updatedAt: dateHandler.createDate()
      };
      
      const plan3: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Test plan 3',
        status: 'completed',
        createdAt: new Date(new Date().getTime() - 180000), // 3 minutes ago
        updatedAt: dateHandler.createDate(),
        completedAt: dateHandler.createDate()
      };
      
      // Add plans through the service API
      await contextService.addStrategicPlan(sessionId, plan1);
      await contextService.addStrategicPlan(sessionId, plan2);
      await contextService.addStrategicPlan(sessionId, plan3);
      
      // Load context
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify loaded context
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.strategicPlans.length).toBe(3);
      
      // Verify that dates are properly preserved as Date objects for all plans
      for (let i = 0; i < 3; i++) {
        expect(loadedContext?.strategicPlans[i].createdAt).toBeInstanceOf(Date);
        expect(loadedContext?.strategicPlans[i].updatedAt).toBeInstanceOf(Date);
      }
      
      // Verify that completedAt is preserved for completed plans
      expect(loadedContext?.strategicPlans[2].completedAt).toBeInstanceOf(Date);
      
      // Verify that date values match
      expect(loadedContext?.strategicPlans[0].createdAt.getTime()).toBeCloseTo(plan1.createdAt.getTime(), -2);
      expect(loadedContext?.strategicPlans[1].updatedAt.getTime()).toBeCloseTo(plan2.updatedAt.getTime(), -2);
      expect(loadedContext?.strategicPlans[2].completedAt?.getTime()).toBeCloseTo(plan3.completedAt!.getTime(), -2);
    });
    
    test('should save and load a context with relationships', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Create relationships with proper dates using ChronosDateHandler
      const relationship1: ContextRelationship = {
        id: `rel-${uuidv4()}`,
        sourceId: `src-${uuidv4()}`,
        targetId: `tgt-${uuidv4()}`,
        type: 'reference',
        strength: 0.75,
        timestamp: dateHandler.createDate()
      };
      
      const relationship2: ContextRelationship = {
        id: `rel-${uuidv4()}`,
        sourceId: `src-${uuidv4()}`,
        targetId: `tgt-${uuidv4()}`,
        type: 'dependency',
        strength: 0.92,
        timestamp: new Date(new Date().getTime() - 30000) // 30 seconds ago
      };
      
      // Add relationships through the service API
      await contextService.addRelationship(sessionId, relationship1);
      await contextService.addRelationship(sessionId, relationship2);
      
      // Load context
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify loaded context
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.relationships.length).toBe(2);
      expect(loadedContext?.relationships[0].type).toBe('reference');
      expect(loadedContext?.relationships[1].type).toBe('dependency');
      
      // Verify that dates are properly preserved as Date objects
      expect(loadedContext?.relationships[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.relationships[1].timestamp).toBeInstanceOf(Date);
      
      // Verify that date values match
      expect(loadedContext?.relationships[0].timestamp.getTime()).toBeCloseTo(relationship1.timestamp.getTime(), -2);
      expect(loadedContext?.relationships[1].timestamp.getTime()).toBeCloseTo(relationship2.timestamp.getTime(), -2);
    });
    
    test('should save and load multiple contexts with different session IDs', async () => {
      const sessionId1 = `test-${uuidv4()}`;
      const sessionId2 = `test-${uuidv4()}`;
      
      // Create and initialize both contexts
      await contextService.initializeSession(sessionId1);
      await contextService.initializeSession(sessionId2);
      
      // Add some different data to each context
      await contextService.addHistoryChunk(sessionId1, {
        id: `chunk-${uuidv4()}`,
        content: 'Content for session 1',
        timestamp: dateHandler.createDate(),
        layer: 'REACTIVE',
        importance: 5,
        source: 'test'
      });
      
      await contextService.addHistoryChunk(sessionId2, {
        id: `chunk-${uuidv4()}`,
        content: 'Content for session 2',
        timestamp: dateHandler.createDate(),
        layer: 'STRATEGIC',
        importance: 7,
        source: 'test'
      });
      
      // Load both contexts
      const loadedContext1 = await contextService.loadContext(sessionId1);
      const loadedContext2 = await contextService.loadContext(sessionId2);
      
      // Verify loaded contexts
      expect(loadedContext1).toBeDefined();
      expect(loadedContext2).toBeDefined();
      expect(loadedContext1?.history[0].content).toBe('Content for session 1');
      expect(loadedContext2?.history[0].content).toBe('Content for session 2');
      
      // Verify the contexts are separate and didn't get mixed
      expect(loadedContext1?.sessionId).toBe(sessionId1);
      expect(loadedContext2?.sessionId).toBe(sessionId2);
      expect(loadedContext1?.history.length).toBe(1);
      expect(loadedContext2?.history.length).toBe(1);
    });
    
    test('attempting to load a nonexistent context should return null', async () => {
      const nonExistentSessionId = `nonexistent-${uuidv4()}`;
      const loadedContext = await contextService.loadContext(nonExistentSessionId);
      
      expect(loadedContext).toBeNull();
    });
  });
  
  describe('Adding Data', () => {
    test('should add history chunk to an existing context', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Create a history chunk with ChronosDateHandler
      const historyChunk: HistoryChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'New history chunk',
        timestamp: dateHandler.createDate(),
        layer: 'META_COGNITIVE',
        importance: 9,
        source: 'test'
      };
      
      // Add the chunk
      await contextService.addHistoryChunk(sessionId, historyChunk);
      
      // Load the context to verify
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify that the chunk was added
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.history.length).toBe(1);
      expect(loadedContext?.history[0].content).toBe('New history chunk');
      expect(loadedContext?.history[0].layer).toBe('META_COGNITIVE');
      
      // Verify that version was incremented
      expect(loadedContext?.version).toBe(2);
      
      // Verify that lastUpdated is a Date and was updated
      expect(loadedContext?.lastUpdated).toBeInstanceOf(Date);
      const now = dateHandler.createDate();
      const timeDiff = now.getTime() - loadedContext!.lastUpdated.getTime();
      expect(timeDiff).toBeLessThan(1000);
      
      // Verify that the history chunk's timestamp is a proper Date object
      expect(loadedContext?.history[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.history[0].timestamp.getTime()).toBeCloseTo(historyChunk.timestamp.getTime(), -2);
    });
    
    test('should add meta insight to an existing context', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Create a meta insight with ChronosDateHandler
      const insight: MetaInsight = {
        id: `insight-${uuidv4()}`,
        observation: 'New meta insight',
        timestamp: dateHandler.createDate(),
        category: 'emergence',
        importance: 8,
        confidence: 0.9
      };
      
      // Add the insight
      await contextService.addMetaInsight(sessionId, insight);
      
      // Load the context to verify
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify that the insight was added
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.metaInsights.length).toBe(1);
      expect(loadedContext?.metaInsights[0].observation).toBe('New meta insight');
      expect(loadedContext?.metaInsights[0].category).toBe('emergence');
      
      // Verify that version was incremented
      expect(loadedContext?.version).toBe(2);
      
      // Verify that the meta insight's timestamp is a proper Date object
      expect(loadedContext?.metaInsights[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.metaInsights[0].timestamp.getTime()).toBeCloseTo(insight.timestamp.getTime(), -2);
    });
    
    test('should add strategic plan to an existing context', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Create a strategic plan with ChronosDateHandler
      const plan: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'New strategic plan',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      };
      
      // Add the plan
      await contextService.addStrategicPlan(sessionId, plan);
      
      // Load the context to verify
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify that the plan was added
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.strategicPlans.length).toBe(1);
      expect(loadedContext?.strategicPlans[0].description).toBe('New strategic plan');
      expect(loadedContext?.strategicPlans[0].status).toBe('pending');
      
      // Verify that version was incremented
      expect(loadedContext?.version).toBe(2);
      
      // Verify that the strategic plan's dates are proper Date objects
      expect(loadedContext?.strategicPlans[0].createdAt).toBeInstanceOf(Date);
      expect(loadedContext?.strategicPlans[0].updatedAt).toBeInstanceOf(Date);
      expect(loadedContext?.strategicPlans[0].createdAt.getTime()).toBeCloseTo(plan.createdAt.getTime(), -2);
      expect(loadedContext?.strategicPlans[0].updatedAt.getTime()).toBeCloseTo(plan.updatedAt.getTime(), -2);
    });
    
    test('should add relationship to an existing context', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Create a relationship with ChronosDateHandler
      const relationship: ContextRelationship = {
        id: `rel-${uuidv4()}`,
        sourceId: `src-${uuidv4()}`,
        targetId: `tgt-${uuidv4()}`,
        type: 'causality',
        strength: 0.85,
        timestamp: dateHandler.createDate()
      };
      
      // Add the relationship
      await contextService.addRelationship(sessionId, relationship);
      
      // Load the context to verify
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify that the relationship was added
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.relationships.length).toBe(1);
      expect(loadedContext?.relationships[0].type).toBe('causality');
      expect(loadedContext?.relationships[0].strength).toBe(0.85);
      
      // Verify that version was incremented
      expect(loadedContext?.version).toBe(2);
      
      // Verify that the relationship's timestamp is a proper Date object
      expect(loadedContext?.relationships[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.relationships[0].timestamp.getTime()).toBeCloseTo(relationship.timestamp.getTime(), -2);
    });
    
    test('should throw an error when adding data to a nonexistent context', async () => {
      const nonExistentSessionId = `nonexistent-${uuidv4()}`;
      const historyChunk: HistoryChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'New history chunk',
        timestamp: dateHandler.createDate(),
        layer: 'REACTIVE',
        importance: 5,
        source: 'test'
      };
      
      // Expect adding a history chunk to fail
      await expect(contextService.addHistoryChunk(nonExistentSessionId, historyChunk))
        .rejects.toThrow(`Context not found for session: ${nonExistentSessionId}`);
      
      // Expect adding a meta insight to fail
      await expect(contextService.addMetaInsight(nonExistentSessionId, {
        id: `insight-${uuidv4()}`,
        observation: 'New meta insight',
        timestamp: dateHandler.createDate(),
        category: 'pattern',
        importance: 7,
        confidence: 0.8
      })).rejects.toThrow(`Context not found for session: ${nonExistentSessionId}`);
      
      // Expect adding a strategic plan to fail
      await expect(contextService.addStrategicPlan(nonExistentSessionId, {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'New strategic plan',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      })).rejects.toThrow(`Context not found for session: ${nonExistentSessionId}`);
      
      // Expect adding a relationship to fail
      await expect(contextService.addRelationship(nonExistentSessionId, {
        id: `rel-${uuidv4()}`,
        sourceId: `src-${uuidv4()}`,
        targetId: `tgt-${uuidv4()}`,
        type: 'reference',
        strength: 0.7,
        timestamp: dateHandler.createDate()
      })).rejects.toThrow(`Context not found for session: ${nonExistentSessionId}`);
    });
  });
  
  describe('Updating Strategic Plans', () => {
    test('should update an existing strategic plan', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Create and add a strategic plan
      const planId = `plan-${uuidv4()}`;
      const taskId = `task-${uuidv4()}`;
      const plan: StrategicPlan = {
        id: planId,
        taskId: taskId,
        description: 'Strategic plan to update',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      };
      
      await contextService.addStrategicPlan(sessionId, plan);
      
      // Update the plan
      const updatedPlan = {
        id: planId,
        status: 'in_progress',
        description: 'Updated strategic plan'
      };
      
      await contextService.updateStrategicPlan(sessionId, updatedPlan);
      
      // Load the context to verify
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify that the plan was updated
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.strategicPlans.length).toBe(1);
      expect(loadedContext?.strategicPlans[0].id).toBe(planId);
      expect(loadedContext?.strategicPlans[0].description).toBe('Updated strategic plan');
      expect(loadedContext?.strategicPlans[0].status).toBe('in_progress');
      
      // Verify that version was incremented
      expect(loadedContext?.version).toBe(3);
      
      // Verify that updatedAt was updated and is a proper Date object
      expect(loadedContext?.strategicPlans[0].updatedAt).toBeInstanceOf(Date);
      expect(loadedContext?.strategicPlans[0].updatedAt.getTime()).toBeGreaterThan(plan.updatedAt.getTime());
      
      // Verify that completedAt is still undefined
      expect(loadedContext?.strategicPlans[0].completedAt).toBeUndefined();
    });
    
    test('should set completedAt when updating plan status to completed', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Create and add a strategic plan
      const planId = `plan-${uuidv4()}`;
      const taskId = `task-${uuidv4()}`;
      const plan: StrategicPlan = {
        id: planId,
        taskId: taskId,
        description: 'Strategic plan to complete',
        status: 'in_progress',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      };
      
      await contextService.addStrategicPlan(sessionId, plan);
      
      // Update the plan status to completed
      const updatedPlan = {
        id: planId,
        status: 'completed'
      };
      
      await contextService.updateStrategicPlan(sessionId, updatedPlan);
      
      // Load the context to verify
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify that the plan status was updated
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.strategicPlans.length).toBe(1);
      expect(loadedContext?.strategicPlans[0].status).toBe('completed');
      
      // Verify that completedAt was set and is a proper Date object
      expect(loadedContext?.strategicPlans[0].completedAt).toBeInstanceOf(Date);
      const now = dateHandler.createDate();
      const timeDiff = now.getTime() - loadedContext!.strategicPlans[0].completedAt!.getTime();
      expect(timeDiff).toBeLessThan(1000);
    });
    
    test('should set completedAt when updating plan status to failed', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Create and add a strategic plan
      const planId = `plan-${uuidv4()}`;
      const taskId = `task-${uuidv4()}`;
      const plan: StrategicPlan = {
        id: planId,
        taskId: taskId,
        description: 'Strategic plan to fail',
        status: 'in_progress',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      };
      
      await contextService.addStrategicPlan(sessionId, plan);
      
      // Update the plan status to failed
      const updatedPlan = {
        id: planId,
        status: 'failed'
      };
      
      await contextService.updateStrategicPlan(sessionId, updatedPlan);
      
      // Load the context to verify
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify that the plan status was updated
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.strategicPlans.length).toBe(1);
      expect(loadedContext?.strategicPlans[0].status).toBe('failed');
      
      // Verify that completedAt was set and is a proper Date object
      expect(loadedContext?.strategicPlans[0].completedAt).toBeInstanceOf(Date);
      const now = dateHandler.createDate();
      const timeDiff = now.getTime() - loadedContext!.strategicPlans[0].completedAt!.getTime();
      expect(timeDiff).toBeLessThan(1000);
    });
    
    test('should throw an error when updating a nonexistent plan', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Try to update a nonexistent plan
      const nonExistentPlanId = `nonexistent-${uuidv4()}`;
      const updatedPlan = {
        id: nonExistentPlanId,
        status: 'in_progress'
      };
      
      await expect(contextService.updateStrategicPlan(sessionId, updatedPlan))
        .rejects.toThrow(`Strategic plan not found with ID: ${nonExistentPlanId}`);
    });
  });
  
  describe('Retrieving Data', () => {
    test('should get recent history by layer', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Add history chunks with different layers
      const reactiveChunk: HistoryChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'Reactive chunk 1',
        timestamp: dateHandler.createDate(new Date().getTime() - 5000), // 5 seconds ago
        layer: 'REACTIVE',
        importance: 5,
        source: 'test'
      };
      
      const strategicChunk: HistoryChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'Strategic chunk 1',
        timestamp: dateHandler.createDate(new Date().getTime() - 3000), // 3 seconds ago
        layer: 'STRATEGIC',
        importance: 7,
        source: 'test'
      };
      
      const reactiveChunk2: HistoryChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'Reactive chunk 2',
        timestamp: dateHandler.createDate(), // Now
        layer: 'REACTIVE',
        importance: 6,
        source: 'test'
      };
      
      await contextService.addHistoryChunk(sessionId, reactiveChunk);
      await contextService.addHistoryChunk(sessionId, strategicChunk);
      await contextService.addHistoryChunk(sessionId, reactiveChunk2);
      
      // Get recent reactive history
      const recentReactiveHistory = await contextService.getRecentHistory(sessionId, 'REACTIVE', 5);
      
      // Verify that only reactive history chunks were returned
      expect(recentReactiveHistory.length).toBe(2);
      expect(recentReactiveHistory[0].content).toBe('Reactive chunk 2'); // Most recent first
      expect(recentReactiveHistory[1].content).toBe('Reactive chunk 1');
      
      // Get recent strategic history
      const recentStrategicHistory = await contextService.getRecentHistory(sessionId, 'STRATEGIC', 5);
      
      // Verify that only strategic history chunks were returned
      expect(recentStrategicHistory.length).toBe(1);
      expect(recentStrategicHistory[0].content).toBe('Strategic chunk 1');
    });
    
    test('should get insights by type and minimum importance', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Add insights with different categories and importance
      const insight1: MetaInsight = {
        id: `insight-${uuidv4()}`,
        observation: 'Pattern insight 1',
        timestamp: dateHandler.createDate(),
        category: 'pattern',
        importance: 3,
        confidence: 0.7
      };
      
      const insight2: MetaInsight = {
        id: `insight-${uuidv4()}`,
        observation: 'Pattern insight 2',
        timestamp: dateHandler.createDate(),
        category: 'pattern',
        importance: 8,
        confidence: 0.9
      };
      
      const insight3: MetaInsight = {
        id: `insight-${uuidv4()}`,
        observation: 'Trend insight 1',
        timestamp: dateHandler.createDate(),
        category: 'trend',
        importance: 6,
        confidence: 0.8
      };
      
      await contextService.addMetaInsight(sessionId, insight1);
      await contextService.addMetaInsight(sessionId, insight2);
      await contextService.addMetaInsight(sessionId, insight3);
      
      // Get pattern insights with minimum importance 5
      const highImportancePatternInsights = await contextService.getInsightsByType(sessionId, 'pattern', 5);
      
      // Verify that only high importance pattern insights were returned
      expect(highImportancePatternInsights.length).toBe(1);
      expect(highImportancePatternInsights[0].observation).toBe('Pattern insight 2');
      
      // Get trend insights with minimum importance 5
      const highImportanceTrendInsights = await contextService.getInsightsByType(sessionId, 'trend', 5);
      
      // Verify that only high importance trend insights were returned
      expect(highImportanceTrendInsights.length).toBe(1);
      expect(highImportanceTrendInsights[0].observation).toBe('Trend insight 1');
      
      // Get pattern insights with minimum importance 0 (all)
      const allPatternInsights = await contextService.getInsightsByType(sessionId, 'pattern', 0);
      
      // Verify that all pattern insights were returned
      expect(allPatternInsights.length).toBe(2);
    });
    
    test('should get active strategic plans', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Add strategic plans with different statuses
      const pendingPlan: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Pending plan',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      };
      
      const inProgressPlan: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'In progress plan',
        status: 'in_progress',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      };
      
      const completedPlan: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Completed plan',
        status: 'completed',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate(),
        completedAt: dateHandler.createDate()
      };
      
      const failedPlan: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Failed plan',
        status: 'failed',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate(),
        completedAt: dateHandler.createDate()
      };
      
      await contextService.addStrategicPlan(sessionId, pendingPlan);
      await contextService.addStrategicPlan(sessionId, inProgressPlan);
      await contextService.addStrategicPlan(sessionId, completedPlan);
      await contextService.addStrategicPlan(sessionId, failedPlan);
      
      // Get active strategic plans
      const activePlans = await contextService.getActiveStrategicPlans(sessionId);
      
      // Verify that only pending and in_progress plans were returned
      expect(activePlans.length).toBe(2);
      expect(activePlans.some(p => p.status === 'pending')).toBe(true);
      expect(activePlans.some(p => p.status === 'in_progress')).toBe(true);
      expect(activePlans.some(p => p.status === 'completed')).toBe(false);
      expect(activePlans.some(p => p.status === 'failed')).toBe(false);
    });
    
    test('should search context for matching items', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Add various items with searchable content
      await contextService.addHistoryChunk(sessionId, {
        id: `chunk-${uuidv4()}`,
        content: 'History about quantum computing',
        timestamp: dateHandler.createDate(),
        layer: 'REACTIVE',
        importance: 5,
        source: 'test'
      });
      
      await contextService.addMetaInsight(sessionId, {
        id: `insight-${uuidv4()}`,
        observation: 'Insight about neural networks',
        timestamp: dateHandler.createDate(),
        category: 'pattern',
        importance: 7,
        confidence: 0.8
      });
      
      await contextService.addStrategicPlan(sessionId, {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Plan for quantum algorithm optimization',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      });
      
      // Search for 'quantum'
      const quantumResults = await contextService.searchContext(sessionId, 'quantum');
      
      // Verify that items containing 'quantum' were returned
      expect(quantumResults.length).toBe(2); // History chunk and strategic plan
      
      // Search for 'neural'
      const neuralResults = await contextService.searchContext(sessionId, 'neural');
      
      // Verify that items containing 'neural' were returned
      expect(neuralResults.length).toBe(1); // Meta insight
      
      // Search for nonexistent term
      const nonexistentResults = await contextService.searchContext(sessionId, 'nonexistent');
      
      // Verify that no results were returned
      expect(nonexistentResults.length).toBe(0);
    });
    
    test('retrieving data from nonexistent context should return empty arrays', async () => {
      const nonExistentSessionId = `nonexistent-${uuidv4()}`;
      
      // Get recent history
      const recentHistory = await contextService.getRecentHistory(nonExistentSessionId, 'REACTIVE', 5);
      expect(recentHistory).toEqual([]);
      
      // Get insights by type
      const insights = await contextService.getInsightsByType(nonExistentSessionId, 'pattern', 5);
      expect(insights).toEqual([]);
      
      // Get active strategic plans
      const activePlans = await contextService.getActiveStrategicPlans(nonExistentSessionId);
      expect(activePlans).toEqual([]);
      
      // Search context
      const searchResults = await contextService.searchContext(nonExistentSessionId, 'query');
      expect(searchResults).toEqual([]);
    });
  });

  describe('Interface Compliance and Boundary Integrity', () => {
    test('service fully implements IPersistentContextService interface', () => {
      // Verify that all required interface methods are implemented
      const interfaceMethods: Array<keyof IPersistentContextService> = [
        'initializeSession', 
        'saveContext', 
        'loadContext', 
        'addHistoryChunk', 
        'addMetaInsight', 
        'addStrategicPlan', 
        'updateStrategicPlan', 
        'addRelationship', 
        'getRecentHistory', 
        'getActiveStrategicPlans', 
        'getInsightsByType', 
        'searchContext'
      ];
      
      // Check that all methods are implemented
      for (const method of interfaceMethods) {
        expect(typeof contextService[method]).toBe('function');
      }
    });
    
    test('service properly maintains type boundaries with ChronosDateHandler', async () => {
      const sessionId = `test-${uuidv4()}`;
      await contextService.initializeSession(sessionId);
      
      // Add an item with a date in a different format to test boundary handling
      const now = new Date();
      const nowStr = now.toISOString();
      
      // Use an object with a string date instead of a Date object
      const testObj = {
        id: `test-${uuidv4()}`,
        content: 'Test boundary integrity',
        // Use string date to test boundary handling
        timestamp: nowStr,
        layer: 'REACTIVE',
        importance: 5,
        source: 'test'
      };
      
      // Add the object (the method should handle string dates)
      await contextService.addHistoryChunk(sessionId, testObj as any);
      
      // Load the context to verify boundary handling
      const loadedContext = await contextService.loadContext(sessionId);
      
      // Verify that the date was properly handled and converted to a Date object
      expect(loadedContext?.history[0].timestamp).toBeInstanceOf(Date);
      
      // Verify that the date value is correct
      const expectedDate = new Date(nowStr);
      expect(loadedContext?.history[0].timestamp.getTime()).toBeCloseTo(expectedDate.getTime(), -2);
    });
  });
});