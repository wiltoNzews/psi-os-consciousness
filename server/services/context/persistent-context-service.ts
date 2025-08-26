/**
 * Persistent Context Service Interface
 * 
 * Defines the contract for context persistence following Void-Centered Design
 * principles by explicitly acknowledging the boundary between in-memory
 * operations and persisted data.
 * 
 * BOUNDARY DEFINITION: This service defines the critical boundary between
 * the ephemeral in-memory context and the persistent storage layer, ensuring
 * data integrity and consistency across this boundary.
 * 
 * RESPONSIBILITY: This service has the sole responsibility of managing the
 * persistence of context data, including versioning, history tracking, and
 * the transformation between runtime and persisted formats.
 */
import { ChronosDateHandler } from '../utils/chronos-date-handler.js';

/**
 * Interface for a persistent context
 */
export interface PersistentContext {
  sessionId: string;
  history: any[];
  metaInsights: any[];
  strategicPlans: any[];
  relationships: any[];
  version: number;
  lastUpdated: Date;
}

/**
 * Interface for the persistent context service
 */
export interface IPersistentContextService {
  initializeSession(sessionId: string): Promise<PersistentContext>;
  saveContext(context: PersistentContext): Promise<void>;
  loadContext(sessionId: string): Promise<PersistentContext | null>;
  addHistoryChunk(sessionId: string, chunk: any): Promise<void>;
  addMetaInsight(sessionId: string, insight: any): Promise<void>;
  addStrategicPlan(sessionId: string, plan: any): Promise<void>;
  updateStrategicPlan(sessionId: string, updatedPlan: any): Promise<void>;
  addRelationship(sessionId: string, relationship: any): Promise<void>;
  getRecentHistory(sessionId: string, layer: string, limit: number): Promise<any[]>;
  getActiveStrategicPlans(sessionId: string): Promise<any[]>;
  getInsightsByType(sessionId: string, eventType: string, minImportance: number): Promise<any[]>;
  searchContext(sessionId: string, query: string): Promise<any[]>;
}

/**
 * Implementation of the persistent context service
 */
export class PersistentContextService implements IPersistentContextService {
  private persistenceLayer: any;
  
  /**
   * Constructor
   * 
   * @param persistenceLayer The persistence layer to use
   */
  constructor(persistenceLayer: any) {
    this.persistenceLayer = persistenceLayer;
    console.log('PersistentContextService initialized');
  }
  
  /**
   * Initialize a new session
   * 
   * @param sessionId The session ID
   * @returns The initialized context
   */
  async initializeSession(sessionId: string): Promise<PersistentContext> {
    console.log(`Creating new context for session: ${sessionId}`);
    
    const context: PersistentContext = {
      sessionId,
      history: [],
      metaInsights: [],
      strategicPlans: [],
      relationships: [],
      version: 1,
      lastUpdated: ChronosDateHandler.createDate()
    };
    
    await this.saveContext(context);
    console.log(`Session initialized: ${sessionId}`);
    
    return context;
  }
  
  /**
   * Save a context
   * 
   * @param context The context to save
   */
  async saveContext(context: PersistentContext): Promise<void> {
    // Update the version and timestamp
    context.version += 1;
    context.lastUpdated = ChronosDateHandler.createDate();
    
    // Store the context
    await this.persistenceLayer.save(`context:${context.sessionId}`, context);
  }
  
  /**
   * Load a context
   * 
   * @param sessionId The session ID
   * @returns The loaded context, or null if not found
   */
  async loadContext(sessionId: string): Promise<PersistentContext | null> {
    return await this.persistenceLayer.load(`context:${sessionId}`);
  }
  
  /**
   * Add a history chunk to a context
   * 
   * @param sessionId The session ID
   * @param chunk The chunk to add
   */
  async addHistoryChunk(sessionId: string, chunk: any): Promise<void> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Add the chunk to the history
    context.history.push({
      ...chunk,
      timestamp: chunk.timestamp || ChronosDateHandler.createDate()
    });
    
    // Save the updated context
    await this.saveContext(context);
  }
  
  /**
   * Add a meta insight to a context
   * 
   * @param sessionId The session ID
   * @param insight The insight to add
   */
  async addMetaInsight(sessionId: string, insight: any): Promise<void> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Add the insight to the meta insights
    context.metaInsights.push({
      ...insight,
      timestamp: insight.timestamp || ChronosDateHandler.createDate()
    });
    
    // Save the updated context
    await this.saveContext(context);
  }
  
  /**
   * Add a strategic plan to a context
   * 
   * @param sessionId The session ID
   * @param plan The plan to add
   */
  async addStrategicPlan(sessionId: string, plan: any): Promise<void> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Add the plan to the strategic plans
    context.strategicPlans.push({
      ...plan,
      timestamp: plan.timestamp || ChronosDateHandler.createDate(),
      status: plan.status || 'active'
    });
    
    // Save the updated context
    await this.saveContext(context);
  }
  
  /**
   * Update a strategic plan in a context
   * 
   * @param sessionId The session ID
   * @param updatedPlan The updated plan
   */
  async updateStrategicPlan(sessionId: string, updatedPlan: any): Promise<void> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Find the plan to update
    const planIndex = context.strategicPlans.findIndex(p => p.id === updatedPlan.id);
    if (planIndex === -1) {
      throw new Error(`Strategic plan not found with ID: ${updatedPlan.id}`);
    }
    
    // Update the plan
    context.strategicPlans[planIndex] = {
      ...context.strategicPlans[planIndex],
      ...updatedPlan,
      updatedAt: ChronosDateHandler.createDate()
    };
    
    // Save the updated context
    await this.saveContext(context);
  }
  
  /**
   * Add a relationship to a context
   * 
   * @param sessionId The session ID
   * @param relationship The relationship to add
   */
  async addRelationship(sessionId: string, relationship: any): Promise<void> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Add the relationship to the relationships
    context.relationships.push({
      ...relationship,
      timestamp: relationship.timestamp || ChronosDateHandler.createDate()
    });
    
    // Save the updated context
    await this.saveContext(context);
  }
  
  /**
   * Get recent history from a context
   * 
   * @param sessionId The session ID
   * @param layer The layer to filter by
   * @param limit The maximum number of history items to get
   * @returns The recent history
   */
  async getRecentHistory(sessionId: string, layer: string, limit: number): Promise<any[]> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Filter by layer and limit results
    const filtered = context.history.filter(h => h.layer === layer);
    return filtered.slice(-limit);
  }
  
  /**
   * Get active strategic plans from a context
   * 
   * @param sessionId The session ID
   * @returns The active strategic plans
   */
  async getActiveStrategicPlans(sessionId: string): Promise<any[]> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Return active plans
    return context.strategicPlans.filter(p => p.status === 'active');
  }
  
  /**
   * Get insights by type from a context
   * 
   * @param sessionId The session ID
   * @param eventType The event type to filter by
   * @param minImportance The minimum importance to filter by
   * @returns The matching insights
   */
  async getInsightsByType(sessionId: string, eventType: string, minImportance: number): Promise<any[]> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Filter insights by type and importance
    return context.metaInsights.filter(i => 
      i.type === eventType && 
      (i.importance || 0) >= minImportance
    );
  }
  
  /**
   * Search a context for items matching a query
   * 
   * @param sessionId The session ID
   * @param query The search query
   * @returns The matching items
   */
  async searchContext(sessionId: string, query: string): Promise<any[]> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    const results: any[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Search history
    for (const item of context.history) {
      if (JSON.stringify(item).toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'history', item });
      }
    }
    
    // Search meta insights
    for (const item of context.metaInsights) {
      if (JSON.stringify(item).toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'insight', item });
      }
    }
    
    // Search strategic plans
    for (const item of context.strategicPlans) {
      if (JSON.stringify(item).toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'plan', item });
      }
    }
    
    return results;
  }
}