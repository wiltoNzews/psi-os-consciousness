/**
 * File-based Persistent Context Service Implementation
 * 
 * This module implements a file-based persistence service that stores and
 * retrieves context data from the file system. It follows Void-Centered Design
 * principles by explicitly acknowledging boundaries between in-memory and
 * persisted states.
 * 
 * BOUNDARY AWARENESS: This module explicitly manages the transition between
 * in-memory data structures and persisted file representations, ensuring proper
 * handling of complex types like Date objects across this boundary.
 */

import path from 'path';
import { v4 as uuidv4 } from 'uuid';
// Import FileSystemPersistenceLayer at the top level
import { FileSystemPersistenceLayer } from './persistent-context-handler.js';
// Add explicit type annotations to reduce TypeScript errors
import { 
  PersistentContext, 
  HistoryChunk, 
  StrategicPlan, 
  MetaInsight, 
  ContextRelationship,
  IPersistentContextService,
  CognitiveLayer,
  MetaEventType,
} from './context-manager.js';
import { IPersistenceLayer } from './persistent-context-handler.js';
import { ensureDate } from './utils/date-helpers.js';

/**
 * Configuration for the FileSystemPersistentContextService
 */
export interface PersistenceServiceConfig {
  /**
   * Base directory for storing context files
   * Default: './contexts'
   */
  baseDir?: string;
}

/**
 * File System Persistent Context Service
 * 
 * Implements the IPersistentContextService interface using a file-based
 * persistence layer for storing and retrieving context data.
 * 
 * This implementation explicitly acknowledges the boundary between
 * in-memory objects and persisted file representations.
 */
export class FileSystemPersistentContextService implements IPersistentContextService {
  private persistenceLayer: IPersistenceLayer;
  
  /**
   * Create a new FileSystemPersistentContextService with dependency injection
   * 
   * BOUNDARY AWARENESS: The persistence layer is injected, explicitly showing
   * the boundary between this service and the underlying storage mechanism.
   * 
   * @param persistenceLayer The persistence layer to use
   */
  constructor(persistenceLayer: IPersistenceLayer) {
    this.persistenceLayer = persistenceLayer;
  }
  
  /**
   * Initialize a session, creating a new context if it doesn't exist
   * 
   * @param sessionId Unique session identifier
   * @returns The persistent context for the session
   */
  async initializeSession(sessionId: string): Promise<PersistentContext> {
    // BOUNDARY CROSSING: Attempt to load existing context from persistence layer
    const existingContext = await this.loadContext(sessionId);
    
    if (existingContext) {
      console.log(`Loaded existing context for session: ${sessionId}`);
      return existingContext;
    }
    
    // Create a new context if none exists
    console.log(`Creating new context for session: ${sessionId}`);
    const timestamp = new Date();
    
    const newContext: PersistentContext = {
      sessionId,
      historyChunks: [],
      strategicPlans: [],
      metaInsights: [],
      relationships: [],
      createdAt: timestamp,
      updatedAt: timestamp,
      version: 1
    };
    
    // BOUNDARY CROSSING: Save the new context to the persistence layer
    await this.saveContext(newContext);
    return newContext;
  }
  
  /**
   * Save the current context state to persistent storage
   * 
   * BOUNDARY CROSSING: This method explicitly marks the transition from
   * in-memory state to persisted state.
   * 
   * @param context The context to save
   */
  async saveContext(context: PersistentContext): Promise<void> {
    // Update metadata before saving
    context.updatedAt = new Date();
    context.version += 1;
    
    // BOUNDARY CROSSING: Save to persistence layer
    await this.persistenceLayer.save(context.sessionId, context);
  }
  
  /**
   * Load context for a specific session from persistent storage
   * 
   * BOUNDARY CROSSING: This method explicitly marks the transition from
   * persisted state to in-memory state.
   * 
   * @param sessionId Unique session identifier
   * @returns The persistent context if found, null otherwise
   */
  async loadContext(sessionId: string): Promise<PersistentContext | null> {
    // BOUNDARY CROSSING: Load from persistence layer
    const context = await this.persistenceLayer.load(sessionId);
    
    if (!context) {
      return null;
    }
    
    // Ensure dates are properly converted
    // This is necessary because JSON serialization/deserialization can lose date types
    this.ensureDatesInContext(context);
    
    return context;
  }
  
  /**
   * Add a history chunk to the context
   * 
   * @param sessionId Unique session identifier
   * @param chunk The history chunk to add
   */
  async addHistoryChunk(sessionId: string, chunk: HistoryChunk): Promise<void> {
    // BOUNDARY CROSSING: Load current context
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      throw new Error(`No context found for session: ${sessionId}`);
    }
    
    // Ensure the chunk has an ID and timestamp
    if (!chunk.chunkId) {
      chunk.chunkId = uuidv4();
    }
    
    chunk.timestamp = ensureDate(chunk.timestamp);
    
    // Add the chunk to the context
    context.historyChunks.push(chunk);
    
    // BOUNDARY CROSSING: Save updated context
    await this.saveContext(context);
  }
  
  /**
   * Add a meta-insight to the context
   * 
   * @param sessionId Unique session identifier
   * @param insight The meta-insight to add
   */
  async addMetaInsight(sessionId: string, insight: MetaInsight): Promise<void> {
    // BOUNDARY CROSSING: Load current context
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      throw new Error(`No context found for session: ${sessionId}`);
    }
    
    // Ensure the insight has a timestamp
    insight.timestamp = ensureDate(insight.timestamp);
    
    // Add the insight to the context
    context.metaInsights.push(insight);
    
    // BOUNDARY CROSSING: Save updated context
    await this.saveContext(context);
  }
  
  /**
   * Add a strategic plan to the context
   * 
   * @param sessionId Unique session identifier
   * @param plan The strategic plan to add
   */
  async addStrategicPlan(sessionId: string, plan: StrategicPlan): Promise<void> {
    // BOUNDARY CROSSING: Load current context
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      throw new Error(`No context found for session: ${sessionId}`);
    }
    
    // Ensure the plan has timestamps
    plan.createdAt = ensureDate(plan.createdAt);
    plan.updatedAt = ensureDate(plan.updatedAt);
    if (plan.completedAt) {
      plan.completedAt = ensureDate(plan.completedAt);
    }
    
    // Add the plan to the context
    context.strategicPlans.push(plan);
    
    // BOUNDARY CROSSING: Save updated context
    await this.saveContext(context);
  }
  
  /**
   * Update an existing strategic plan
   * 
   * @param sessionId Unique session identifier
   * @param updatedPlan The updated strategic plan
   */
  async updateStrategicPlan(sessionId: string, updatedPlan: StrategicPlan): Promise<void> {
    // BOUNDARY CROSSING: Load current context
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      throw new Error(`No context found for session: ${sessionId}`);
    }
    
    // Find the plan to update
    const planIndex = context.strategicPlans.findIndex(p => p.taskId === updatedPlan.taskId);
    
    if (planIndex === -1) {
      throw new Error(`No strategic plan found with taskId: ${updatedPlan.taskId}`);
    }
    
    // Ensure timestamps are Date objects
    updatedPlan.createdAt = ensureDate(updatedPlan.createdAt);
    updatedPlan.updatedAt = new Date(); // Always update the updatedAt timestamp
    if (updatedPlan.completedAt) {
      updatedPlan.completedAt = ensureDate(updatedPlan.completedAt);
    }
    
    // Update the plan
    context.strategicPlans[planIndex] = updatedPlan;
    
    // BOUNDARY CROSSING: Save updated context
    await this.saveContext(context);
  }
  
  /**
   * Add a relationship between context elements
   * 
   * @param sessionId Unique session identifier
   * @param relationship The relationship to add
   */
  /**
   * Add a context relationship to the context
   * 
   * @param sessionId Unique session identifier
   * @param relationship The relationship to add
   */
  async addContextRelationship(sessionId: string, relationship: ContextRelationship): Promise<void> {
    // BOUNDARY CROSSING: Load current context
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      throw new Error(`No context found for session: ${sessionId}`);
    }
    
    // Ensure the relationship has a timestamp
    relationship.timestamp = ensureDate(relationship.timestamp);
    
    // Add the relationship to the context
    context.relationships.push(relationship);
    
    // BOUNDARY CROSSING: Save updated context
    await this.saveContext(context);
  }
  
  /**
   * Add a relationship between context elements
   * @deprecated Use addContextRelationship instead
   * @param sessionId Unique session identifier
   * @param relationship The relationship to add
   */
  async addRelationship(sessionId: string, relationship: ContextRelationship): Promise<void> {
    return this.addContextRelationship(sessionId, relationship);
  }
  
  /**
   * Get recent history chunks filtered by cognitive layer
   * 
   * @param sessionId Unique session identifier
   * @param layer Cognitive layer to filter by
   * @param limit Maximum number of chunks to return
   * @returns Array of history chunks
   */
  async getRecentHistory(sessionId: string, layer: CognitiveLayer, limit: number): Promise<HistoryChunk[]> {
    // BOUNDARY CROSSING: Load current context
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      return [];
    }
    
    // Filter and sort the history chunks
    return context.historyChunks
      .filter(chunk => chunk.cognitiveLayer === layer)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  /**
   * Get active strategic plans
   * 
   * @param sessionId Unique session identifier
   * @returns Array of strategic plans that are not completed or failed
   */
  async getActiveStrategicPlans(sessionId: string): Promise<StrategicPlan[]> {
    // BOUNDARY CROSSING: Load current context
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      return [];
    }
    
    // Filter for active plans (pending or in_progress)
    return context.strategicPlans
      .filter(plan => plan.status === 'pending' || plan.status === 'in_progress')
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  
  /**
   * Get insights filtered by type and importance
   * 
   * @param sessionId Unique session identifier
   * @param eventType Type of meta-event to filter by
   * @param minImportance Minimum importance threshold (0-1)
   * @returns Array of matching insights
   */
  async getInsightsByType(sessionId: string, eventType: MetaEventType, minImportance: number): Promise<MetaInsight[]> {
    // BOUNDARY CROSSING: Load current context
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      return [];
    }
    
    // Filter and sort the insights
    return context.metaInsights
      .filter(insight => insight.eventType === eventType && insight.importance >= minImportance)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  /**
   * Get related context elements by relationship type
   * 
   * @param sessionId Unique session identifier
   * @param sourceId Source element ID
   * @param relationshipType Type of relationship to filter by
   * @returns Array of target element IDs
   */
  async getRelatedContextElements(sessionId: string, sourceId: string, relationshipType: string): Promise<string[]> {
    // BOUNDARY CROSSING: Load current context
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      return [];
    }
    
    // Filter relationships and extract target IDs
    return context.relationships
      .filter(rel => rel.sourceId === sourceId && rel.relationshipType === relationshipType)
      .map(rel => rel.targetId);
  }
  
  /**
   * Search through context using text query
   * 
   * @param sessionId Unique session identifier
   * @param query Search query
   * @returns Array of matching history chunks
   */
  async searchContext(sessionId: string, query: string): Promise<HistoryChunk[]> {
    // BOUNDARY CROSSING: Load current context
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      return [];
    }
    
    // Perform a simple text search across history chunks
    const lowercaseQuery = query.toLowerCase();
    return context.historyChunks
      .filter(chunk => 
        chunk.content.toLowerCase().includes(lowercaseQuery) ||
        (chunk.tags && chunk.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  /**
   * Ensure all dates in the context object are proper Date objects
   * This is necessary because JSON serialization/deserialization can lose date types
   * 
   * @param context The context to process
   */
  private ensureDatesInContext(context: PersistentContext): void {
    // Process top-level dates
    context.createdAt = ensureDate(context.createdAt);
    context.updatedAt = ensureDate(context.updatedAt);
    
    // Process history chunks
    context.historyChunks.forEach(chunk => {
      chunk.timestamp = ensureDate(chunk.timestamp);
    });
    
    // Process strategic plans
    context.strategicPlans.forEach(plan => {
      plan.createdAt = ensureDate(plan.createdAt);
      plan.updatedAt = ensureDate(plan.updatedAt);
      if (plan.completedAt) {
        plan.completedAt = ensureDate(plan.completedAt);
      }
    });
    
    // Process meta-insights
    context.metaInsights.forEach(insight => {
      insight.timestamp = ensureDate(insight.timestamp);
    });
    
    // Process relationships
    context.relationships.forEach(relationship => {
      relationship.timestamp = ensureDate(relationship.timestamp);
    });
  }
}

/**
 * Factory function to create a FileSystemPersistentContextService
 * This follows the dependency injection pattern for easier testing and configuration
 * 
 * @param config Configuration options
 * @returns A new instance of FileSystemPersistentContextService
 */

export function createPersistenceService(config: PersistenceServiceConfig = {}): IPersistentContextService {
  // Create the persistence layer
  const baseDir = config.baseDir || './contexts';
  
  // Create the persistence layer
  const persistenceLayer = new FileSystemPersistenceLayer(baseDir);
  
  // Create the service with our persistence layer
  return new FileSystemPersistentContextService(persistenceLayer);
}

// For backward compatibility, export a default instance
// In a proper DI system, this would be configured at application startup
export const persistentContextService = createPersistenceService();