/**
 * MemPersistentContextService Test Suite
 * 
 * Comprehensive tests for the MemPersistentContextService class with focus on proper date handling
 * via ChronosDateHandler for boundary integrity preservation.
 * 
 * This test suite follows the TSAR BOMBA verification approach with explicit testing
 * of all date serialization/deserialization boundaries.
 */

import { ChronosDateHandler } from '../services/utils/chronos-date-handler.js';
import { IPersistentContextService, PersistentContext } from '../services/context/persistent-context-service.js';
import { MemPersistentContextService } from '../services/context/mem-persistent-context-service.js';
import { MemStorage } from '../storage.js';
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

describe('MemStorage', () => {
  let memStorage: MemStorage;
  let dateHandler: typeof ChronosDateHandler;
  
  beforeEach(() => {
    // Create a fresh MemStorage instance for each test
    memStorage = new MemStorage();
    dateHandler = ChronosDateHandler;
  });
  
  describe('Initialization', () => {
    test('should initialize a new session with the correct initial values', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await memStorage.initializeSession(sessionId);
      
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
      const initialContext = await memStorage.initializeSession(sessionId);
      
      // Save the context
      await memStorage.saveContext(initialContext);
      
      // Load the context
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify equality
      expect(loadedContext).toEqual(initialContext);
      expect(loadedContext?.lastUpdated).toBeInstanceOf(Date);
    });
    
    test('should save and load a context with history chunks', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await memStorage.initializeSession(sessionId);
      
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
        timestamp: dateHandler.createDate(new Date().getTime() - 5000), // 5 seconds ago
        layer: 'STRATEGIC',
        importance: 8,
        source: 'test'
      };
      
      // Add history chunks to context
      context.history.push(historyChunk1, historyChunk2);
      
      // Update context metadata
      context.version++;
      context.lastUpdated = dateHandler.createDate();
      
      // Save context
      await memStorage.saveContext(context);
      
      // Load context
      const loadedContext = await memStorage.loadContext(sessionId);
      
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
      expect(loadedContext?.history[0].timestamp.getTime()).toBe(historyChunk1.timestamp.getTime());
      expect(loadedContext?.history[1].timestamp.getTime()).toBe(historyChunk2.timestamp.getTime());
    });
    
    test('should save and load a context with meta insights', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await memStorage.initializeSession(sessionId);
      
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
        timestamp: dateHandler.createDate(new Date().getTime() - 10000), // 10 seconds ago
        category: 'trend',
        importance: 9,
        confidence: 0.92
      };
      
      // Add insights to context
      context.metaInsights.push(insight1, insight2);
      
      // Update context metadata
      context.version++;
      context.lastUpdated = dateHandler.createDate();
      
      // Save context
      await memStorage.saveContext(context);
      
      // Load context
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify loaded context
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.metaInsights.length).toBe(2);
      expect(loadedContext?.metaInsights[0].observation).toBe('Test insight 1');
      expect(loadedContext?.metaInsights[1].observation).toBe('Test insight 2');
      
      // Verify that dates are properly preserved as Date objects
      expect(loadedContext?.metaInsights[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.metaInsights[1].timestamp).toBeInstanceOf(Date);
      
      // Verify that date values match
      expect(loadedContext?.metaInsights[0].timestamp.getTime()).toBe(insight1.timestamp.getTime());
      expect(loadedContext?.metaInsights[1].timestamp.getTime()).toBe(insight2.timestamp.getTime());
    });
    
    test('should save and load a context with strategic plans', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await memStorage.initializeSession(sessionId);
      
      // Create strategic plans with proper dates using ChronosDateHandler
      const plan1: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Test plan 1',
        status: 'pending',
        createdAt: dateHandler.createDate(new Date().getTime() - 60000), // 1 minute ago
        updatedAt: dateHandler.createDate()
      };
      
      const plan2: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Test plan 2',
        status: 'in_progress',
        createdAt: dateHandler.createDate(new Date().getTime() - 120000), // 2 minutes ago
        updatedAt: dateHandler.createDate()
      };
      
      const plan3: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Test plan 3',
        status: 'completed',
        createdAt: dateHandler.createDate(new Date().getTime() - 180000), // 3 minutes ago
        updatedAt: dateHandler.createDate(),
        completedAt: dateHandler.createDate()
      };
      
      // Add plans to context
      context.strategicPlans.push(plan1, plan2, plan3);
      
      // Update context metadata
      context.version++;
      context.lastUpdated = dateHandler.createDate();
      
      // Save context
      await memStorage.saveContext(context);
      
      // Load context
      const loadedContext = await memStorage.loadContext(sessionId);
      
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
      expect(loadedContext?.strategicPlans[0].createdAt.getTime()).toBe(plan1.createdAt.getTime());
      expect(loadedContext?.strategicPlans[1].updatedAt.getTime()).toBe(plan2.updatedAt.getTime());
      expect(loadedContext?.strategicPlans[2].completedAt?.getTime()).toBe(plan3.completedAt?.getTime());
    });
    
    test('should save and load a context with relationships', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await memStorage.initializeSession(sessionId);
      
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
        timestamp: dateHandler.createDate(new Date().getTime() - 30000) // 30 seconds ago
      };
      
      // Add relationships to context
      context.relationships.push(relationship1, relationship2);
      
      // Update context metadata
      context.version++;
      context.lastUpdated = dateHandler.createDate();
      
      // Save context
      await memStorage.saveContext(context);
      
      // Load context
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify loaded context
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.relationships.length).toBe(2);
      expect(loadedContext?.relationships[0].type).toBe('reference');
      expect(loadedContext?.relationships[1].type).toBe('dependency');
      
      // Verify that dates are properly preserved as Date objects
      expect(loadedContext?.relationships[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.relationships[1].timestamp).toBeInstanceOf(Date);
      
      // Verify that date values match
      expect(loadedContext?.relationships[0].timestamp.getTime()).toBe(relationship1.timestamp.getTime());
      expect(loadedContext?.relationships[1].timestamp.getTime()).toBe(relationship2.timestamp.getTime());
    });
    
    test('should save and load multiple contexts with different session IDs', async () => {
      const sessionId1 = `test-${uuidv4()}`;
      const sessionId2 = `test-${uuidv4()}`;
      
      // Create and initialize both contexts
      const context1 = await memStorage.initializeSession(sessionId1);
      const context2 = await memStorage.initializeSession(sessionId2);
      
      // Add some different data to each context
      context1.history.push({
        id: `chunk-${uuidv4()}`,
        content: 'Content for session 1',
        timestamp: dateHandler.createDate(),
        layer: 'REACTIVE',
        importance: 5,
        source: 'test'
      });
      
      context2.history.push({
        id: `chunk-${uuidv4()}`,
        content: 'Content for session 2',
        timestamp: dateHandler.createDate(),
        layer: 'STRATEGIC',
        importance: 7,
        source: 'test'
      });
      
      // Update metadata
      context1.version++;
      context1.lastUpdated = dateHandler.createDate();
      context2.version++;
      context2.lastUpdated = dateHandler.createDate();
      
      // Save both contexts
      await memStorage.saveContext(context1);
      await memStorage.saveContext(context2);
      
      // Load both contexts
      const loadedContext1 = await memStorage.loadContext(sessionId1);
      const loadedContext2 = await memStorage.loadContext(sessionId2);
      
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
      const loadedContext = await memStorage.loadContext(nonExistentSessionId);
      
      expect(loadedContext).toBeNull();
    });
  });
  
  describe('Adding Data', () => {
    test('should add history chunk to an existing context', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
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
      await memStorage.addHistoryChunk(sessionId, historyChunk);
      
      // Load the context to verify
      const loadedContext = await memStorage.loadContext(sessionId);
      
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
      expect(loadedContext?.history[0].timestamp.getTime()).toBe(historyChunk.timestamp.getTime());
    });
    
    test('should add meta insight to an existing context', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a meta insight with ChronosDateHandler
      const metaInsight: MetaInsight = {
        id: `insight-${uuidv4()}`,
        observation: 'New meta insight',
        timestamp: dateHandler.createDate(),
        category: 'pattern',
        importance: 8,
        confidence: 0.87
      };
      
      // Add the insight
      await memStorage.addMetaInsight(sessionId, metaInsight);
      
      // Load the context to verify
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify that the insight was added
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.metaInsights.length).toBe(1);
      expect(loadedContext?.metaInsights[0].observation).toBe('New meta insight');
      expect(loadedContext?.metaInsights[0].category).toBe('pattern');
      
      // Verify that version was incremented
      expect(loadedContext?.version).toBe(2);
      
      // Verify that lastUpdated is a Date and was updated
      expect(loadedContext?.lastUpdated).toBeInstanceOf(Date);
      
      // Verify that the meta insight's timestamp is a proper Date object
      expect(loadedContext?.metaInsights[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.metaInsights[0].timestamp.getTime()).toBe(metaInsight.timestamp.getTime());
    });
    
    test('should add strategic plan to an existing context', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a strategic plan with ChronosDateHandler
      const strategicPlan: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'New strategic plan',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      };
      
      // Add the plan
      await memStorage.addStrategicPlan(sessionId, strategicPlan);
      
      // Load the context to verify
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify that the plan was added
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.strategicPlans.length).toBe(1);
      expect(loadedContext?.strategicPlans[0].description).toBe('New strategic plan');
      expect(loadedContext?.strategicPlans[0].status).toBe('pending');
      
      // Verify that version was incremented
      expect(loadedContext?.version).toBe(2);
      
      // Verify that all dates are proper Date objects
      expect(loadedContext?.strategicPlans[0].createdAt).toBeInstanceOf(Date);
      expect(loadedContext?.strategicPlans[0].updatedAt).toBeInstanceOf(Date);
      expect(loadedContext?.strategicPlans[0].createdAt.getTime()).toBe(strategicPlan.createdAt.getTime());
      expect(loadedContext?.strategicPlans[0].updatedAt.getTime()).toBe(strategicPlan.updatedAt.getTime());
    });
    
    test('should add relationship to an existing context', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a relationship with ChronosDateHandler
      const relationship: ContextRelationship = {
        id: `rel-${uuidv4()}`,
        sourceId: `src-${uuidv4()}`,
        targetId: `tgt-${uuidv4()}`,
        type: 'semantic',
        strength: 0.65,
        timestamp: dateHandler.createDate()
      };
      
      // Add the relationship
      await memStorage.addRelationship(sessionId, relationship);
      
      // Load the context to verify
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify that the relationship was added
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.relationships.length).toBe(1);
      expect(loadedContext?.relationships[0].type).toBe('semantic');
      expect(loadedContext?.relationships[0].strength).toBe(0.65);
      
      // Verify that version was incremented
      expect(loadedContext?.version).toBe(2);
      
      // Verify that the relationship's timestamp is a proper Date object
      expect(loadedContext?.relationships[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.relationships[0].timestamp.getTime()).toBe(relationship.timestamp.getTime());
    });
    
    test('attempting to add data to a nonexistent context should throw an error', async () => {
      const nonExistentSessionId = `nonexistent-${uuidv4()}`;
      
      // Create a history chunk
      const historyChunk: HistoryChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'New history chunk',
        timestamp: dateHandler.createDate(),
        layer: 'REACTIVE',
        importance: 5,
        source: 'test'
      };
      
      // Attempt to add to nonexistent context
      await expect(memStorage.addHistoryChunk(nonExistentSessionId, historyChunk))
        .rejects.toThrow(/Context not found/);
    });
  });
  
  describe('Updating Data', () => {
    test('should update an existing strategic plan', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a strategic plan with ChronosDateHandler
      const planId = `plan-${uuidv4()}`;
      const taskId = `task-${uuidv4()}`;
      
      const strategicPlan: StrategicPlan = {
        id: planId,
        taskId: taskId,
        description: 'Initial plan description',
        status: 'pending',
        createdAt: dateHandler.createDate(new Date().getTime() - 60000), // 1 minute ago
        updatedAt: dateHandler.createDate(new Date().getTime() - 60000)  // 1 minute ago
      };
      
      // Add the plan
      await memStorage.addStrategicPlan(sessionId, strategicPlan);
      
      // Create an updated plan
      const updatedPlan: StrategicPlan = {
        id: planId,
        taskId: taskId,
        description: 'Updated plan description',
        status: 'in_progress',
        createdAt: strategicPlan.createdAt, // This should not change
        updatedAt: dateHandler.createDate() // This should be updated
      };
      
      // Update the plan
      await memStorage.updateStrategicPlan(sessionId, updatedPlan);
      
      // Load the context to verify
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify that the plan was updated
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.strategicPlans.length).toBe(1);
      expect(loadedContext?.strategicPlans[0].description).toBe('Updated plan description');
      expect(loadedContext?.strategicPlans[0].status).toBe('in_progress');
      
      // Verify that version was incremented
      expect(loadedContext?.version).toBe(3); // 1 (init) + 1 (add) + 1 (update)
      
      // Verify that dates are handled correctly
      expect(loadedContext?.strategicPlans[0].createdAt).toBeInstanceOf(Date);
      expect(loadedContext?.strategicPlans[0].updatedAt).toBeInstanceOf(Date);
      expect(loadedContext?.strategicPlans[0].createdAt.getTime()).toBe(strategicPlan.createdAt.getTime()); // Should not change
      expect(loadedContext?.strategicPlans[0].updatedAt.getTime()).toBe(updatedPlan.updatedAt.getTime()); // Should be updated
    });
    
    test('should update a strategic plan to completed status and set completedAt', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a strategic plan with ChronosDateHandler
      const planId = `plan-${uuidv4()}`;
      const taskId = `task-${uuidv4()}`;
      
      const strategicPlan: StrategicPlan = {
        id: planId,
        taskId: taskId,
        description: 'Plan to complete',
        status: 'in_progress',
        createdAt: dateHandler.createDate(new Date().getTime() - 120000), // 2 minutes ago
        updatedAt: dateHandler.createDate(new Date().getTime() - 60000)   // 1 minute ago
      };
      
      // Add the plan
      await memStorage.addStrategicPlan(sessionId, strategicPlan);
      
      // Create an updated plan with completed status
      const updatedPlan: StrategicPlan = {
        id: planId,
        taskId: taskId,
        description: 'Plan to complete',
        status: 'completed',
        createdAt: strategicPlan.createdAt,
        updatedAt: dateHandler.createDate(),
        completedAt: dateHandler.createDate() // Setting completedAt
      };
      
      // Update the plan
      await memStorage.updateStrategicPlan(sessionId, updatedPlan);
      
      // Load the context to verify
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify that the plan was updated and completedAt was set
      expect(loadedContext).toBeDefined();
      expect(loadedContext?.strategicPlans.length).toBe(1);
      expect(loadedContext?.strategicPlans[0].status).toBe('completed');
      expect(loadedContext?.strategicPlans[0].completedAt).toBeInstanceOf(Date);
      expect(loadedContext?.strategicPlans[0].completedAt?.getTime()).toBe(updatedPlan.completedAt?.getTime());
    });
    
    test('attempting to update a nonexistent plan should throw an error', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a strategic plan that doesn't exist in storage
      const nonExistentPlan: StrategicPlan = {
        id: `nonexistent-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'This plan does not exist',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      };
      
      // Attempt to update nonexistent plan
      await expect(memStorage.updateStrategicPlan(sessionId, nonExistentPlan))
        .rejects.toThrow(/Strategic plan not found/);
    });
  });
  
  describe('Retrieving Data', () => {
    test('should get recent history filtered by layer', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await memStorage.initializeSession(sessionId);
      
      // Create history chunks with different layers and timestamps
      const chunks = [
        {
          id: `chunk-1`,
          content: 'Reactive chunk 1',
          timestamp: dateHandler.createDate(new Date().getTime() - 5000), // 5 seconds ago
          layer: 'REACTIVE',
          importance: 3,
          source: 'test'
        },
        {
          id: `chunk-2`,
          content: 'Strategic chunk 1',
          timestamp: dateHandler.createDate(new Date().getTime() - 15000), // 15 seconds ago
          layer: 'STRATEGIC',
          importance: 7,
          source: 'test'
        },
        {
          id: `chunk-3`,
          content: 'Reactive chunk 2',
          timestamp: dateHandler.createDate(new Date().getTime() - 25000), // 25 seconds ago
          layer: 'REACTIVE',
          importance: 5,
          source: 'test'
        },
        {
          id: `chunk-4`,
          content: 'Meta-cognitive chunk',
          timestamp: dateHandler.createDate(new Date().getTime() - 20000), // 20 seconds ago
          layer: 'META_COGNITIVE',
          importance: 9,
          source: 'test'
        },
        {
          id: `chunk-5`,
          content: 'Strategic chunk 2',
          timestamp: dateHandler.createDate(new Date().getTime() - 10000), // 10 seconds ago
          layer: 'STRATEGIC',
          importance: 4,
          source: 'test'
        }
      ];
      
      // Add all chunks to context
      context.history.push(...chunks);
      
      // Update context metadata
      context.version++;
      context.lastUpdated = dateHandler.createDate();
      
      // Save context
      await memStorage.saveContext(context);
      
      // Test retrieving REACTIVE layer history, limit 2
      const reactiveHistory = await memStorage.getRecentHistory(sessionId, 'REACTIVE', 2);
      
      // Verify retrieved history
      expect(reactiveHistory).toBeDefined();
      expect(reactiveHistory.length).toBe(2);
      expect(reactiveHistory[0].content).toBe('Reactive chunk 1'); // Most recent first
      expect(reactiveHistory[1].content).toBe('Reactive chunk 2');
      
      // Verify dates are preserved
      expect(reactiveHistory[0].timestamp).toBeInstanceOf(Date);
      expect(reactiveHistory[1].timestamp).toBeInstanceOf(Date);
      
      // Test retrieving STRATEGIC layer history, limit 1
      const strategicHistory = await memStorage.getRecentHistory(sessionId, 'STRATEGIC', 1);
      
      // Verify retrieved history
      expect(strategicHistory).toBeDefined();
      expect(strategicHistory.length).toBe(1);
      expect(strategicHistory[0].content).toBe('Strategic chunk 2'); // Most recent first
      
      // Test retrieving META_COGNITIVE layer history
      const metaCognitiveHistory = await memStorage.getRecentHistory(sessionId, 'META_COGNITIVE', 5);
      
      // Verify retrieved history
      expect(metaCognitiveHistory).toBeDefined();
      expect(metaCognitiveHistory.length).toBe(1);
      expect(metaCognitiveHistory[0].content).toBe('Meta-cognitive chunk');
    });
    
    test('should get active strategic plans', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await memStorage.initializeSession(sessionId);
      
      // Create various strategic plans with different statuses
      const plans = [
        {
          id: `plan-1`,
          taskId: `task-1`,
          description: 'Pending plan',
          status: 'pending',
          createdAt: dateHandler.createDate(new Date().getTime() - 60000), // 1 minute ago
          updatedAt: dateHandler.createDate(new Date().getTime() - 30000)  // 30 seconds ago
        },
        {
          id: `plan-2`,
          taskId: `task-2`,
          description: 'In progress plan',
          status: 'in_progress',
          createdAt: dateHandler.createDate(new Date().getTime() - 120000), // 2 minutes ago
          updatedAt: dateHandler.createDate(new Date().getTime() - 20000)   // 20 seconds ago
        },
        {
          id: `plan-3`,
          taskId: `task-3`,
          description: 'Completed plan',
          status: 'completed',
          createdAt: dateHandler.createDate(new Date().getTime() - 180000), // 3 minutes ago
          updatedAt: dateHandler.createDate(new Date().getTime() - 10000),  // 10 seconds ago
          completedAt: dateHandler.createDate(new Date().getTime() - 10000) // 10 seconds ago
        },
        {
          id: `plan-4`,
          taskId: `task-4`,
          description: 'Failed plan',
          status: 'failed',
          createdAt: dateHandler.createDate(new Date().getTime() - 240000), // 4 minutes ago
          updatedAt: dateHandler.createDate(new Date().getTime() - 5000),   // 5 seconds ago
          completedAt: dateHandler.createDate(new Date().getTime() - 5000)  // 5 seconds ago
        }
      ];
      
      // Add plans to context
      context.strategicPlans.push(...plans);
      
      // Update context metadata
      context.version++;
      context.lastUpdated = dateHandler.createDate();
      
      // Save context
      await memStorage.saveContext(context);
      
      // Get active strategic plans (should include pending and in_progress)
      const activePlans = await memStorage.getActiveStrategicPlans(sessionId);
      
      // Verify retrieved plans
      expect(activePlans).toBeDefined();
      expect(activePlans.length).toBe(2); // Only pending and in_progress plans
      
      // Check that we have the correct plans
      const pendingPlan = activePlans.find(p => p.status === 'pending');
      const inProgressPlan = activePlans.find(p => p.status === 'in_progress');
      
      expect(pendingPlan).toBeDefined();
      expect(inProgressPlan).toBeDefined();
      expect(pendingPlan?.description).toBe('Pending plan');
      expect(inProgressPlan?.description).toBe('In progress plan');
      
      // Verify dates are preserved
      expect(pendingPlan?.createdAt).toBeInstanceOf(Date);
      expect(pendingPlan?.updatedAt).toBeInstanceOf(Date);
      expect(inProgressPlan?.createdAt).toBeInstanceOf(Date);
      expect(inProgressPlan?.updatedAt).toBeInstanceOf(Date);
    });
    
    test('should get insights by type and minimum importance', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await memStorage.initializeSession(sessionId);
      
      // Create meta insights with different categories and importance scores
      const insights = [
        {
          id: `insight-1`,
          observation: 'Pattern insight - high importance',
          timestamp: dateHandler.createDate(),
          category: 'pattern',
          importance: 8,
          confidence: 0.9
        },
        {
          id: `insight-2`,
          observation: 'Pattern insight - low importance',
          timestamp: dateHandler.createDate(),
          category: 'pattern',
          importance: 3,
          confidence: 0.7
        },
        {
          id: `insight-3`,
          observation: 'Trend insight - high importance',
          timestamp: dateHandler.createDate(),
          category: 'trend',
          importance: 9,
          confidence: 0.95
        },
        {
          id: `insight-4`,
          observation: 'Trend insight - medium importance',
          timestamp: dateHandler.createDate(),
          category: 'trend',
          importance: 6,
          confidence: 0.8
        },
        {
          id: `insight-5`,
          observation: 'Anomaly insight - high importance',
          timestamp: dateHandler.createDate(),
          category: 'anomaly',
          importance: 10,
          confidence: 0.98
        }
      ];
      
      // Add insights to context
      context.metaInsights.push(...insights);
      
      // Update context metadata
      context.version++;
      context.lastUpdated = dateHandler.createDate();
      
      // Save context
      await memStorage.saveContext(context);
      
      // Get pattern insights with importance >= 5
      const highImportancePatterns = await memStorage.getInsightsByType(sessionId, 'pattern', 5);
      
      // Verify retrieved insights
      expect(highImportancePatterns).toBeDefined();
      expect(highImportancePatterns.length).toBe(1);
      expect(highImportancePatterns[0].observation).toBe('Pattern insight - high importance');
      
      // Get trend insights with importance >= 5
      const highImportanceTrends = await memStorage.getInsightsByType(sessionId, 'trend', 5);
      
      // Verify retrieved insights
      expect(highImportanceTrends).toBeDefined();
      expect(highImportanceTrends.length).toBe(2);
      
      // Get all pattern insights
      const allPatterns = await memStorage.getInsightsByType(sessionId, 'pattern', 0);
      
      // Verify retrieved insights
      expect(allPatterns).toBeDefined();
      expect(allPatterns.length).toBe(2);
      
      // Verify dates are preserved
      expect(highImportancePatterns[0].timestamp).toBeInstanceOf(Date);
      expect(highImportanceTrends[0].timestamp).toBeInstanceOf(Date);
      expect(allPatterns[0].timestamp).toBeInstanceOf(Date);
    });
    
    test('should search context based on content', async () => {
      const sessionId = `test-${uuidv4()}`;
      const context = await memStorage.initializeSession(sessionId);
      
      // Create various elements with searchable content
      const historyChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'History chunk mentioning neural networks',
        timestamp: dateHandler.createDate(),
        layer: 'STRATEGIC',
        importance: 7,
        source: 'test'
      };
      
      const metaInsight = {
        id: `insight-${uuidv4()}`,
        observation: 'Insight about neural pattern recognition',
        timestamp: dateHandler.createDate(),
        category: 'pattern',
        importance: 8,
        confidence: 0.85
      };
      
      const strategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Plan to implement quantum computing algorithm',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      };
      
      // Add elements to context
      context.history.push(historyChunk);
      context.metaInsights.push(metaInsight);
      context.strategicPlans.push(strategicPlan);
      
      // Update context metadata
      context.version++;
      context.lastUpdated = dateHandler.createDate();
      
      // Save context
      await memStorage.saveContext(context);
      
      // Search for "neural"
      const neuralResults = await memStorage.searchContext(sessionId, 'neural');
      
      // Verify search results
      expect(neuralResults).toBeDefined();
      expect(neuralResults.length).toBe(2); // Should match both history chunk and meta insight
      
      // Search for "quantum"
      const quantumResults = await memStorage.searchContext(sessionId, 'quantum');
      
      // Verify search results
      expect(quantumResults).toBeDefined();
      expect(quantumResults.length).toBe(1); // Should match only the strategic plan
      expect(quantumResults[0].description).toBe('Plan to implement quantum computing algorithm');
      
      // Verify dates are preserved in search results
      const historyResult = neuralResults.find((r: any) => r.content?.includes('neural networks'));
      expect(historyResult.timestamp).toBeInstanceOf(Date);
      
      const insightResult = neuralResults.find((r: any) => r.observation?.includes('neural pattern'));
      expect(insightResult.timestamp).toBeInstanceOf(Date);
      
      const planResult = quantumResults[0];
      expect(planResult.createdAt).toBeInstanceOf(Date);
      expect(planResult.updatedAt).toBeInstanceOf(Date);
    });
    
    test('retrieving data from nonexistent context should return empty arrays', async () => {
      const nonExistentSessionId = `nonexistent-${uuidv4()}`;
      
      // Attempt to get history for nonexistent context
      const history = await memStorage.getRecentHistory(nonExistentSessionId, 'REACTIVE', 10);
      expect(history).toEqual([]);
      
      // Attempt to get insights for nonexistent context
      const insights = await memStorage.getInsightsByType(nonExistentSessionId, 'pattern', 5);
      expect(insights).toEqual([]);
      
      // Attempt to get plans for nonexistent context
      const plans = await memStorage.getActiveStrategicPlans(nonExistentSessionId);
      expect(plans).toEqual([]);
      
      // Attempt to search nonexistent context
      const searchResults = await memStorage.searchContext(nonExistentSessionId, 'test');
      expect(searchResults).toEqual([]);
    });
  });
  
  describe('Multiple Round-Trip Tests', () => {
    test('should preserve date integrity through multiple serialization cycles', async () => {
      const sessionId = `test-${uuidv4()}`;
      const initialContext = await memStorage.initializeSession(sessionId);
      
      // Original date to track through cycles
      const originalCreatedAt = dateHandler.createDate();
      
      // Add a strategic plan with the date to track
      const plan: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Plan to track through cycles',
        status: 'pending',
        createdAt: originalCreatedAt,
        updatedAt: dateHandler.createDate()
      };
      
      // First save: Add the plan
      await memStorage.addStrategicPlan(sessionId, plan);
      
      // First load
      const firstLoad = await memStorage.loadContext(sessionId);
      
      // First update: Update the plan
      const updatedPlan = { 
        ...firstLoad!.strategicPlans[0], 
        description: 'Updated plan description',
        status: 'in_progress' 
      };
      await memStorage.updateStrategicPlan(sessionId, updatedPlan);
      
      // Second load
      const secondLoad = await memStorage.loadContext(sessionId);
      
      // Add history chunk while preserving the plan
      const historyChunk: HistoryChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'Test history chunk',
        timestamp: dateHandler.createDate(),
        layer: 'REACTIVE',
        importance: 5,
        source: 'test'
      };
      await memStorage.addHistoryChunk(sessionId, historyChunk);
      
      // Third load
      const thirdLoad = await memStorage.loadContext(sessionId);
      
      // Final update: Update plan to completed
      const completedPlan = {
        ...thirdLoad!.strategicPlans[0],
        status: 'completed',
        completedAt: dateHandler.createDate()
      };
      await memStorage.updateStrategicPlan(sessionId, completedPlan);
      
      // Final load
      const finalLoad = await memStorage.loadContext(sessionId);
      
      // Verify date preservation through all cycles
      expect(finalLoad!.strategicPlans[0].createdAt).toBeInstanceOf(Date);
      expect(finalLoad!.strategicPlans[0].createdAt.getTime()).toBe(originalCreatedAt.getTime());
      
      // Verify version increments correctly
      expect(finalLoad!.version).toBe(5); // 1 (init) + 1 (add plan) + 1 (update plan) + 1 (add history) + 1 (update to completed)
    });
    
    test('should handle complex nested objects with dates through multiple operations', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a strategic plan with a complex metadata object containing dates
      const complexPlan: any = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Plan with complex metadata',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate(),
        metadata: {
          history: [
            { event: 'created', timestamp: dateHandler.createDate(new Date().getTime() - 60000) },
            { event: 'reviewed', timestamp: dateHandler.createDate(new Date().getTime() - 30000) }
          ],
          related: {
            precedingTask: {
              id: `task-${uuidv4()}`,
              completedAt: dateHandler.createDate(new Date().getTime() - 120000)
            },
            followupTasks: [
              { id: `task-${uuidv4()}`, scheduledFor: dateHandler.createDate(new Date().getTime() + 60000) },
              { id: `task-${uuidv4()}`, scheduledFor: dateHandler.createDate(new Date().getTime() + 120000) }
            ]
          },
          metrics: {
            lastCalculated: dateHandler.createDate(),
            values: {
              complexity: 0.75,
              priority: 0.9,
              lastUpdated: dateHandler.createDate()
            }
          }
        }
      };
      
      // Add plan with complex metadata
      await memStorage.addStrategicPlan(sessionId, complexPlan);
      
      // Load the context
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Modify the complex metadata
      const planToUpdate = loadedContext!.strategicPlans[0] as any;
      planToUpdate.metadata.history.push({
        event: 'updated',
        timestamp: dateHandler.createDate()
      });
      planToUpdate.metadata.metrics.values.lastUpdated = dateHandler.createDate();
      planToUpdate.status = 'in_progress';
      planToUpdate.updatedAt = dateHandler.createDate();
      
      // Update the plan
      await memStorage.updateStrategicPlan(sessionId, planToUpdate);
      
      // Load the context again
      const finalContext = await memStorage.loadContext(sessionId);
      const finalPlan = finalContext!.strategicPlans[0] as any;
      
      // Verify all nested dates are preserved as Date objects
      expect(finalPlan.createdAt).toBeInstanceOf(Date);
      expect(finalPlan.updatedAt).toBeInstanceOf(Date);
      expect(finalPlan.metadata.history[0].timestamp).toBeInstanceOf(Date);
      expect(finalPlan.metadata.history[1].timestamp).toBeInstanceOf(Date);
      expect(finalPlan.metadata.history[2].timestamp).toBeInstanceOf(Date);
      expect(finalPlan.metadata.related.precedingTask.completedAt).toBeInstanceOf(Date);
      expect(finalPlan.metadata.related.followupTasks[0].scheduledFor).toBeInstanceOf(Date);
      expect(finalPlan.metadata.related.followupTasks[1].scheduledFor).toBeInstanceOf(Date);
      expect(finalPlan.metadata.metrics.lastCalculated).toBeInstanceOf(Date);
      expect(finalPlan.metadata.metrics.values.lastUpdated).toBeInstanceOf(Date);
      
      // Verify the new history entry was correctly added
      expect(finalPlan.metadata.history.length).toBe(3);
      expect(finalPlan.metadata.history[2].event).toBe('updated');
    });
  });
  
  describe('Edge Cases and Error Handling', () => {
    test('should handle very old dates correctly', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a history chunk with a very old date
      const oldDate = new Date('1900-01-01T00:00:00Z');
      const historyChunk: HistoryChunk = {
        id: `chunk-${uuidv4()}`,
        content: 'Very old history chunk',
        timestamp: dateHandler.createDate(oldDate),
        layer: 'REACTIVE',
        importance: 5,
        source: 'test'
      };
      
      // Add the chunk
      await memStorage.addHistoryChunk(sessionId, historyChunk);
      
      // Load the context
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify the old date was preserved correctly
      expect(loadedContext?.history[0].timestamp).toBeInstanceOf(Date);
      expect(loadedContext?.history[0].timestamp.getTime()).toBe(oldDate.getTime());
    });
    
    test('should handle future dates correctly', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a strategic plan with a future date
      const futureDate = new Date('2100-01-01T00:00:00Z');
      const strategicPlan: StrategicPlan = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Future plan',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate()
      };
      
      // Add custom future date property
      (strategicPlan as any).scheduledExecutionDate = dateHandler.createDate(futureDate);
      
      // Add the plan
      await memStorage.addStrategicPlan(sessionId, strategicPlan);
      
      // Load the context
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify the future date was preserved correctly
      expect((loadedContext?.strategicPlans[0] as any).scheduledExecutionDate).toBeInstanceOf(Date);
      expect((loadedContext?.strategicPlans[0] as any).scheduledExecutionDate.getTime()).toBe(futureDate.getTime());
    });
    
    test('should handle unexpected null dates gracefully', async () => {
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a plan with some null dates
      const strategicPlan: any = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Plan with null dates',
        status: 'pending',
        createdAt: dateHandler.createDate(),
        updatedAt: dateHandler.createDate(),
        specialDates: {
          estimatedCompletion: null,
          lastReview: dateHandler.createDate(),
          nextReview: null
        }
      };
      
      // Add the plan
      await memStorage.addStrategicPlan(sessionId, strategicPlan);
      
      // Load the context
      const loadedContext = await memStorage.loadContext(sessionId);
      
      // Verify non-null dates are preserved as Date objects
      expect(loadedContext?.strategicPlans[0].createdAt).toBeInstanceOf(Date);
      expect(loadedContext?.strategicPlans[0].updatedAt).toBeInstanceOf(Date);
      expect((loadedContext?.strategicPlans[0] as any).specialDates.lastReview).toBeInstanceOf(Date);
      
      // Verify null dates remain null
      expect((loadedContext?.strategicPlans[0] as any).specialDates.estimatedCompletion).toBeNull();
      expect((loadedContext?.strategicPlans[0] as any).specialDates.nextReview).toBeNull();
    });
    
    test('should handle date comparison edge cases properly', async () => {
      // Create two dates with the exact same timestamp
      const date1 = dateHandler.createDate('2023-05-15T12:30:45.123Z');
      const date2 = dateHandler.createDate('2023-05-15T12:30:45.123Z');
      
      // Create two dates with exactly 1ms difference
      const date3 = dateHandler.createDate('2023-05-15T12:30:45.123Z');
      const date4 = dateHandler.createDate('2023-05-15T12:30:45.124Z');
      
      // Test equal dates
      expect(date1.getTime()).toBe(date2.getTime());
      
      // Test dates with 1ms difference
      expect(date4.getTime() - date3.getTime()).toBe(1);
      
      // Use these dates in a context
      const sessionId = `test-${uuidv4()}`;
      await memStorage.initializeSession(sessionId);
      
      // Create a strategic plan with these dates
      const strategicPlan: any = {
        id: `plan-${uuidv4()}`,
        taskId: `task-${uuidv4()}`,
        description: 'Plan with precision dates',
        status: 'pending',
        createdAt: date1,
        updatedAt: date2,
        preciseDates: {
          date1: date1,
          date2: date2,
          date3: date3,
          date4: date4
        }
      };
      
      // Add the plan
      await memStorage.addStrategicPlan(sessionId, strategicPlan);
      
      // Load the context
      const loadedContext = await memStorage.loadContext(sessionId);
      const loadedPlan = loadedContext?.strategicPlans[0] as any;
      
      // Verify precision of dates is maintained after serialization/deserialization
      expect(loadedPlan.preciseDates.date1.getTime()).toBe(date1.getTime());
      expect(loadedPlan.preciseDates.date2.getTime()).toBe(date2.getTime());
      expect(loadedPlan.preciseDates.date3.getTime()).toBe(date3.getTime());
      expect(loadedPlan.preciseDates.date4.getTime()).toBe(date4.getTime());
      
      // Verify the 1ms difference is preserved
      expect(loadedPlan.preciseDates.date4.getTime() - loadedPlan.preciseDates.date3.getTime()).toBe(1);
    });
  });
});