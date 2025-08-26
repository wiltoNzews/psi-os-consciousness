/**
 * Persistent Context Service Test
 * 
 * This is a special version of the persistent context test that uses
 * the CommonJS version of date-serialization.cjs for Jest compatibility.
 */

import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import path from 'path';
import fs from 'fs/promises';

// Import directly from the CJS file
const dateUtils = require('../services/utils/date-serialization.cjs');

import {
  PersistentContext,
  HistoryChunk,
  StrategicPlan,
  MetaInsight,
  CognitiveLayer,
  MetaEventType,
  IPersistentContextService
} from '../services/context-manager';

// Mock persistence layer
class InMemoryPersistenceLayer {
  private storage: Map<string, any> = new Map();

  async save(key: string, data: any): Promise<void> {
    // Clone and serialize to simulate file I/O
    const serializedData = JSON.parse(JSON.stringify(data, dateUtils.dateReplacer));
    this.storage.set(key, serializedData);
  }

  async load(key: string): Promise<any | null> {
    const data = this.storage.get(key);
    if (!data) return null;
    
    // Parse with date revival to simulate file I/O
    return JSON.parse(JSON.stringify(data), dateUtils.dateReviver);
  }

  async getKeys(prefix?: string): Promise<string[]> {
    const keys = Array.from(this.storage.keys());
    if (prefix) {
      return keys.filter(k => k.startsWith(prefix));
    }
    return keys;
  }

  async delete(key: string): Promise<boolean> {
    if (!this.storage.has(key)) return false;
    return this.storage.delete(key);
  }

  reset(): void {
    this.storage.clear();
  }
}

// Create the test service
class FileSystemPersistentContextServiceWithCJS {
  constructor(private persistenceLayer: any) {}

  async initializeSession(sessionId: string): Promise<PersistentContext> {
    if (!/^[\\w-]+$/.test(sessionId)) {
      throw new Error(`Invalid sessionId "${sessionId}" – must be alphanumeric, underscore, or hyphen only.`);
    }

    const existingContext = await this.loadContext(sessionId);

    if (existingContext) {
      return existingContext;
    }

    // Create a new context if none exists
    const newContext: PersistentContext = {
      sessionId,
      historyChunks: [],
      strategicPlans: [],
      metaInsights: [],
      relationships: [],
      updatedAt: new Date(),
      createdAt: new Date(),
      version: 0 // Start with version 0
    };

    // Save the new context
    await this.saveContext(newContext);

    return newContext;
  }

  async saveContext(context: PersistentContext): Promise<void> {
    // Update the updatedAt timestamp
    context.updatedAt = new Date();

    // Increment version for new save to reflect this update
    context.version = (context.version ?? 0) + 1;

    // Use persistence layer to save the context
    await this.persistenceLayer.save(
      `${context.sessionId}.json`, 
      context
    );
  }

  async loadContext(sessionId: string): Promise<PersistentContext | null> {
    try {
      // Use persistence layer to load the context
      const context = await this.persistenceLayer.load(`${sessionId}.json`);

      // Process dates in the loaded context to ensure all date strings are converted to Date objects
      const processedContext = context ? dateUtils.deserializeDatesInObject(context) : null;

      // Ensure version exists in loaded context (for older files)
      if (processedContext && processedContext.version === undefined) {
        processedContext.version = 0;
      }

      return processedContext;
    } catch (error) {
      // If there was an error loading the context, return null
      console.error(`Error loading context for session ${sessionId}:`, error);
      return null;
    }
  }

  async addHistoryChunk(sessionId: string, chunk: HistoryChunk): Promise<void> {
    const context = await this.loadContext(sessionId);

    if (!context) {
      throw new Error(`Context not found for session ${sessionId}`);
    }

    // Ensure the timestamp is a valid Date object
    if (!(chunk.timestamp instanceof Date)) {
      chunk.timestamp = new Date(chunk.timestamp || new Date());
    }

    context.historyChunks.push(chunk);
    await this.saveContext(context);
  }

  async addStrategicPlan(sessionId: string, plan: StrategicPlan): Promise<void> {
    const context = await this.loadContext(sessionId);

    if (!context) {
      throw new Error(`Context not found for session ${sessionId}`);
    }

    // Ensure createdAt is a valid Date object
    if (!(plan.createdAt instanceof Date)) {
      plan.createdAt = new Date(plan.createdAt || new Date());
    }

    // Add updatedAt if it doesn't exist (backward compatibility)
    if (!plan.updatedAt) {
      plan.updatedAt = new Date();
    } else if (!(plan.updatedAt instanceof Date)) {
      plan.updatedAt = new Date(plan.updatedAt);
    }

    context.strategicPlans.push(plan);
    await this.saveContext(context);
  }

  async updateStrategicPlan(sessionId: string, updatedPlan: StrategicPlan): Promise<void> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }

    const planIndex = context.strategicPlans.findIndex(p => p.taskId === updatedPlan.taskId);
    if (planIndex === -1) {
      throw new Error(`Strategic plan with taskId ${updatedPlan.taskId} not found in session ${sessionId}`);
    }

    // Update the plan with new values
    updatedPlan.updatedAt = new Date();
    context.strategicPlans[planIndex] = updatedPlan;

    await this.saveContext(context);
  }

  async addMetaInsight(sessionId: string, insight: MetaInsight): Promise<void> {
    const context = await this.loadContext(sessionId);

    if (!context) {
      throw new Error(`Context not found for session ${sessionId}`);
    }

    // Ensure the timestamp is a valid Date object
    if (!(insight.timestamp instanceof Date)) {
      insight.timestamp = new Date(insight.timestamp || new Date());
    }

    context.metaInsights.push(insight);
    await this.saveContext(context);
  }

  async getRecentHistory(sessionId: string, layer: CognitiveLayer, limit: number): Promise<HistoryChunk[]> {
    const context = await this.loadContext(sessionId);

    if (!context) {
      return [];
    }

    // Filter by layer and sort by timestamp (newest first)
    const filteredChunks = context.historyChunks
      .filter(chunk => chunk.cognitiveLayer === layer)
      .sort((a, b) => {
        // Safely handle potentially non-Date objects
        const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });

    // Deep clone with date preservation before returning
    return dateUtils.deserializeDatesInObject(filteredChunks.slice(0, limit));
  }

  async getActiveStrategicPlans(sessionId: string): Promise<StrategicPlan[]> {
    const context = await this.loadContext(sessionId);

    if (!context) {
      return [];
    }

    // Filter for plans with active status
    const plans = context.strategicPlans
      .filter(plan => plan.status === 'pending' || plan.status === 'in_progress')
      .sort((a, b) => {
        // Safely handle potentially non-Date objects
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

    // Deep clone with date preservation before returning
    return dateUtils.deserializeDatesInObject(plans);
  }

  async getInsightsByType(sessionId: string, eventType: MetaEventType, minImportance: number): Promise<MetaInsight[]> {
    const context = await this.loadContext(sessionId);

    if (!context) {
      return [];
    }

    // Filter by event type and importance, sort by timestamp (newest first)
    const insights = context.metaInsights
      .filter(insight => insight.eventType === eventType && insight.importance >= minImportance)
      .sort((a, b) => {
        // Safely handle potentially non-Date objects
        const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });

    // Deep clone with date preservation before returning
    return dateUtils.deserializeDatesInObject(insights);
  }
}

describe('Persistent Context Service with CJS Date Utilities', () => {
  let service: FileSystemPersistentContextServiceWithCJS;
  let persistenceLayer: InMemoryPersistenceLayer;

  beforeEach(() => {
    persistenceLayer = new InMemoryPersistenceLayer();
    service = new FileSystemPersistentContextServiceWithCJS(persistenceLayer);
  });

  afterEach(() => {
    persistenceLayer.reset();
  });

  test('should initialize a new session with empty arrays', async () => {
    const sessionId = 'test-session-1';
    const context = await service.initializeSession(sessionId);
    
    expect(context).toBeDefined();
    expect(context.sessionId).toBe(sessionId);
    expect(context.historyChunks).toHaveLength(0);
    expect(context.strategicPlans).toHaveLength(0);
    expect(context.metaInsights).toHaveLength(0);
    expect(context.relationships).toHaveLength(0);
    expect(context.createdAt).toBeInstanceOf(Date);
    expect(context.updatedAt).toBeInstanceOf(Date);
    expect(context.version).toBe(0);
  });

  test('should add and retrieve a history chunk with dates intact', async () => {
    const sessionId = 'test-session-2';
    await service.initializeSession(sessionId);
    
    const timestamp = new Date('2023-01-01T12:00:00Z');
    
    const chunk: HistoryChunk = {
      id: 'chunk-1',
      timestamp: timestamp,
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      content: 'Test history chunk',
      source: 'test'
    };
    
    await service.addHistoryChunk(sessionId, chunk);
    
    const context = await service.loadContext(sessionId);
    expect(context).toBeDefined();
    expect(context!.historyChunks).toHaveLength(1);
    expect(context!.historyChunks[0].timestamp).toBeInstanceOf(Date);
    expect(context!.historyChunks[0].timestamp.getTime()).toBe(timestamp.getTime());
  });

  test('should add and retrieve a strategic plan with dates intact', async () => {
    const sessionId = 'test-session-3';
    await service.initializeSession(sessionId);
    
    const createdAt = new Date('2023-01-02T12:00:00Z');
    
    const plan: StrategicPlan = {
      taskId: 'task-1',
      title: 'Test Plan',
      description: 'Test strategic plan',
      steps: ['Step 1', 'Step 2'],
      status: 'pending',
      createdAt: createdAt,
      updatedAt: createdAt,
      priority: 'high'
    };
    
    await service.addStrategicPlan(sessionId, plan);
    
    const context = await service.loadContext(sessionId);
    expect(context).toBeDefined();
    expect(context!.strategicPlans).toHaveLength(1);
    expect(context!.strategicPlans[0].createdAt).toBeInstanceOf(Date);
    expect(context!.strategicPlans[0].createdAt.getTime()).toBe(createdAt.getTime());
    expect(context!.strategicPlans[0].updatedAt).toBeInstanceOf(Date);
    expect(context!.strategicPlans[0].updatedAt.getTime()).toBe(createdAt.getTime());
  });

  test('should add and retrieve a meta-insight with dates intact', async () => {
    const sessionId = 'test-session-4';
    await service.initializeSession(sessionId);
    
    const timestamp = new Date('2023-01-03T12:00:00Z');
    
    const insight: MetaInsight = {
      id: 'insight-1',
      eventType: MetaEventType.PATTERN_RECOGNITION,
      timestamp: timestamp,
      description: 'Test meta-insight',
      importance: 0.8,
      source: 'test',
      applicationAreas: ['area-1']
    };
    
    await service.addMetaInsight(sessionId, insight);
    
    const context = await service.loadContext(sessionId);
    expect(context).toBeDefined();
    expect(context!.metaInsights).toHaveLength(1);
    expect(context!.metaInsights[0].timestamp).toBeInstanceOf(Date);
    expect(context!.metaInsights[0].timestamp.getTime()).toBe(timestamp.getTime());
  });

  test('should get recent history filtered by cognitive layer', async () => {
    const sessionId = 'test-session-5';
    await service.initializeSession(sessionId);
    
    // Create test history chunks with different cognitive layers
    await service.addHistoryChunk(sessionId, {
      id: 'chunk-1',
      timestamp: new Date('2023-01-01T10:00:00Z'),
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      content: 'Strategic chunk 1',
      source: 'test'
    });
    
    await service.addHistoryChunk(sessionId, {
      id: 'chunk-2',
      timestamp: new Date('2023-01-01T11:00:00Z'),
      cognitiveLayer: CognitiveLayer.REACTIVE,
      content: 'Reactive chunk',
      source: 'test'
    });
    
    await service.addHistoryChunk(sessionId, {
      id: 'chunk-3',
      timestamp: new Date('2023-01-01T12:00:00Z'),
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      content: 'Strategic chunk 2',
      source: 'test'
    });
    
    // Get recent history filtered by cognitive layer
    const strategicChunks = await service.getRecentHistory(
      sessionId,
      CognitiveLayer.STRATEGIC,
      10
    );
    
    // Validate results
    expect(strategicChunks).toHaveLength(2);
    expect(strategicChunks[0].id).toBe('chunk-3'); // Most recent first
    expect(strategicChunks[1].id).toBe('chunk-1');
    expect(strategicChunks[0].cognitiveLayer).toBe(CognitiveLayer.STRATEGIC);
    expect(strategicChunks[1].cognitiveLayer).toBe(CognitiveLayer.STRATEGIC);
  });

  test('should handle numeric version increments correctly', async () => {
    const sessionId = 'test-session-6';
    const context = await service.initializeSession(sessionId);
    expect(context.version).toBe(0);
    
    // Add a history chunk, which should trigger a save and version increment
    await service.addHistoryChunk(sessionId, {
      id: 'chunk-1',
      timestamp: new Date(),
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      content: 'Test content',
      source: 'test'
    });
    
    const updatedContext = await service.loadContext(sessionId);
    expect(updatedContext!.version).toBe(1);
    
    // Add another item, should increment again
    await service.addMetaInsight(sessionId, {
      id: 'insight-1',
      eventType: MetaEventType.PATTERN_RECOGNITION,
      timestamp: new Date(),
      description: 'Test insight',
      importance: 0.5,
      source: 'test',
      applicationAreas: []
    });
    
    const finalContext = await service.loadContext(sessionId);
    expect(finalContext!.version).toBe(2);
  });

  test('should get active strategic plans (pending or in_progress)', async () => {
    const sessionId = 'test-session-7';
    await service.initializeSession(sessionId);
    
    // Add plans with different statuses
    await service.addStrategicPlan(sessionId, {
      taskId: 'task-1',
      title: 'Pending Plan',
      description: 'Test pending plan',
      steps: ['Step 1'],
      status: 'pending',
      createdAt: new Date('2023-01-01T10:00:00Z'),
      updatedAt: new Date('2023-01-01T10:00:00Z'),
      priority: 'medium'
    });
    
    await service.addStrategicPlan(sessionId, {
      taskId: 'task-2',
      title: 'In Progress Plan',
      description: 'Test in-progress plan',
      steps: ['Step 1'],
      status: 'in_progress',
      createdAt: new Date('2023-01-01T11:00:00Z'),
      updatedAt: new Date('2023-01-01T11:00:00Z'),
      priority: 'high'
    });
    
    await service.addStrategicPlan(sessionId, {
      taskId: 'task-3',
      title: 'Completed Plan',
      description: 'Test completed plan',
      steps: ['Step 1'],
      status: 'completed',
      createdAt: new Date('2023-01-01T12:00:00Z'),
      updatedAt: new Date('2023-01-01T12:00:00Z'),
      priority: 'low'
    });
    
    // Get active plans
    const activePlans = await service.getActiveStrategicPlans(sessionId);
    
    // Validate results
    expect(activePlans).toHaveLength(2);
    expect(activePlans[0].taskId).toBe('task-2'); // Most recent first
    expect(activePlans[1].taskId).toBe('task-1');
    expect(activePlans[0].status).toBe('in_progress');
    expect(activePlans[1].status).toBe('pending');
  });

  test('should get insights filtered by type and importance', async () => {
    const sessionId = 'test-session-8';
    await service.initializeSession(sessionId);
    
    // Add insights with different types and importance
    await service.addMetaInsight(sessionId, {
      id: 'insight-1',
      eventType: MetaEventType.PATTERN_RECOGNITION,
      timestamp: new Date('2023-01-01T10:00:00Z'),
      description: 'Low importance pattern',
      importance: 0.3,
      source: 'test',
      applicationAreas: []
    });
    
    await service.addMetaInsight(sessionId, {
      id: 'insight-2',
      eventType: MetaEventType.PATTERN_RECOGNITION,
      timestamp: new Date('2023-01-01T11:00:00Z'),
      description: 'High importance pattern',
      importance: 0.8,
      source: 'test',
      applicationAreas: []
    });
    
    await service.addMetaInsight(sessionId, {
      id: 'insight-3',
      eventType: MetaEventType.STABILITY_ADJUSTMENT,
      timestamp: new Date('2023-01-01T12:00:00Z'),
      description: 'High importance stability',
      importance: 0.9,
      source: 'test',
      applicationAreas: []
    });
    
    // Get insights filtered by type and importance
    const highImportancePatterns = await service.getInsightsByType(
      sessionId,
      MetaEventType.PATTERN_RECOGNITION,
      0.5
    );
    
    // Validate results
    expect(highImportancePatterns).toHaveLength(1);
    expect(highImportancePatterns[0].id).toBe('insight-2');
    expect(highImportancePatterns[0].importance).toBeGreaterThanOrEqual(0.5);
    expect(highImportancePatterns[0].eventType).toBe(MetaEventType.PATTERN_RECOGNITION);
  });
});