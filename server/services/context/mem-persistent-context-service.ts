/**
 * In-Memory Persistent Context Service Implementation
 * 
 * This implements IPersistentContextService using in-memory storage, ensuring
 * proper date handling with ChronosDateHandler. This implementation ensures
 * boundary integrity between in-memory operation and serialized form.
 * 
 * BOUNDARY AWARENESS: This module explicitly manages the boundary between
 * volatile memory state and persistent storage following Void-Centered Design
 * principles. It defines clear serialization/deserialization processes for
 * crossing system boundaries.
 * 
 * BOUNDARY MANAGEMENT: All date objects crossing system boundaries are properly
 * handled through ChronosDateHandler to maintain temporal consistency across
 * the system.
 * 
 * RESPONSIBILITY: This module is solely responsible for providing an in-memory
 * implementation of the PersistentContextService interface, managing context
 * storage, retrieval, and modification operations.
 */

import { IPersistentContextService, PersistentContext } from './persistent-context-service.js';
import { ChronosDateHandler } from '../utils/chronos-date-handler.js';

/**
 * In-memory persistence layer
 * 
 * BOUNDARY AWARENESS: This class handles the boundary between in-memory objects
 * and their serialized string representation. It ensures proper serialization
 * and deserialization of objects with dates.
 */
class MemPersistenceLayer {
  private storage: Map<string, string>;
  private dateHandler = ChronosDateHandler;
  
  constructor() {
    this.storage = new Map<string, string>();
  }
  
  /**
   * Save data to in-memory storage
   * 
   * @param key Storage key
   * @param data Data to store
   */
  async save(key: string, data: any): Promise<void> {
    // Use ChronosDateHandler to properly serialize dates
    const serialized = this.dateHandler.stringifyWithDates(data);
    this.storage.set(key, serialized);
  }
  
  /**
   * Load data from in-memory storage
   * 
   * @param key Storage key
   * @returns The loaded data, or null if not found
   */
  async load(key: string): Promise<any | null> {
    const serialized = this.storage.get(key);
    if (!serialized) {
      return null;
    }
    
    // Use ChronosDateHandler to properly deserialize dates
    return this.dateHandler.parseWithDates(serialized);
  }
  
  /**
   * Delete data from in-memory storage
   * 
   * @param key Storage key
   * @returns True if data was deleted, false if not found
   */
  async delete(key: string): Promise<boolean> {
    if (!this.storage.has(key)) {
      return false;
    }
    
    this.storage.delete(key);
    return true;
  }
}

/**
 * In-memory implementation of persistent context service
 * 
 * BOUNDARY AWARENESS: This class implements the PersistentContextService interface
 * and serves as a boundary between the system's context operations and their
 * in-memory persistence. It explicitly manages temporal boundaries with the 
 * ChronosDateHandler.
 * 
 * BOUNDARY MANAGEMENT: All context data crossing system boundaries is properly
 * serialized and deserialized using the persistence layer, with dates being
 * handled correctly through the ChronosDateHandler.
 */
export class MemPersistentContextService implements IPersistentContextService {
  private persistenceLayer: MemPersistenceLayer;
  private dateHandler = ChronosDateHandler;
  
  /**
   * Constructor
   */
  constructor() {
    this.persistenceLayer = new MemPersistenceLayer();
    console.log('MemPersistentContextService initialized');
  }
  
  /**
   * Initialize a new session
   * 
   * BOUNDARY MANAGEMENT: Creates a new context with correct date handling
   * and persists it across the system boundary using the persistence layer.
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
      lastUpdated: this.dateHandler.createDate() // Use ChronosDateHandler for date creation
    };
    
    await this.saveContext(context);
    console.log(`Session initialized: ${sessionId}`);
    
    return context;
  }
  
  /**
   * Save a context
   * 
   * BOUNDARY MANAGEMENT: Updates temporal data using ChronosDateHandler
   * and persists the context across the system boundary through the
   * persistence layer's serialization capabilities.
   * 
   * @param context The context to save
   */
  async saveContext(context: PersistentContext): Promise<void> {
    // Update the version and timestamp
    context.version += 1;
    context.lastUpdated = this.dateHandler.createDate(); // Use ChronosDateHandler for date creation
    
    // Store the context
    await this.persistenceLayer.save(`context:${context.sessionId}`, context);
  }
  
  /**
   * Load a context
   * 
   * BOUNDARY MANAGEMENT: Retrieves context data across the persistence boundary,
   * ensuring proper date handling for serialized date objects through the
   * persistence layer's deserialization mechanisms.
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
   * BOUNDARY MANAGEMENT: Maintains temporal integrity by applying ChronosDateHandler
   * for any missing timestamps and ensuring proper serialization across
   * the persistence boundary for history data.
   * 
   * @param sessionId The session ID
   * @param chunk The chunk to add
   */
  async addHistoryChunk(sessionId: string, chunk: any): Promise<void> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Add the chunk to the history - use ChronosDateHandler for date creation
    context.history.push({
      ...chunk,
      timestamp: chunk.timestamp || this.dateHandler.createDate()
    });
    
    // Save the updated context
    await this.saveContext(context);
  }
  
  /**
   * Add a meta insight to a context
   * 
   * BOUNDARY MANAGEMENT: Enforces temporal consistency when crossing
   * the persistence boundary by ensuring proper timestamp handling with 
   * ChronosDateHandler while maintaining contextual metadata integrity.
   * 
   * @param sessionId The session ID
   * @param insight The insight to add
   */
  async addMetaInsight(sessionId: string, insight: any): Promise<void> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Add the insight to the meta insights - use ChronosDateHandler for date creation
    context.metaInsights.push({
      ...insight,
      timestamp: insight.timestamp || this.dateHandler.createDate()
    });
    
    // Save the updated context
    await this.saveContext(context);
  }
  
  /**
   * Add a strategic plan to a context
   * 
   * BOUNDARY MANAGEMENT: Ensures object temporal coherence across 
   * the persistence boundary by handling all required date fields with
   * ChronosDateHandler and maintaining consistency when creating new plans.
   * 
   * @param sessionId The session ID
   * @param plan The plan to add
   */
  async addStrategicPlan(sessionId: string, plan: any): Promise<void> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      throw new Error(`Context not found for session: ${sessionId}`);
    }
    
    // Ensure we have all required date fields using ChronosDateHandler
    const now = this.dateHandler.createDate();
    
    // Add the plan to the strategic plans
    context.strategicPlans.push({
      ...plan,
      createdAt: plan.createdAt || now,
      updatedAt: plan.updatedAt || now,
      status: plan.status || 'pending'
    });
    
    // Save the updated context
    await this.saveContext(context);
  }
  
  /**
   * Update a strategic plan in a context
   * 
   * BOUNDARY MANAGEMENT: Handles complex state transitions with boundary integrity
   * by ensuring proper temporal references (updatedAt, completedAt) are maintained
   * with consistent ChronosDateHandler usage, especially during status transitions.
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
    
    // Update the plan with ChronosDateHandler for date creation
    context.strategicPlans[planIndex] = {
      ...context.strategicPlans[planIndex],
      ...updatedPlan,
      updatedAt: this.dateHandler.createDate()
    };
    
    // If the plan status changed to completed or failed, set the completedAt
    if (
      (updatedPlan.status === 'completed' || updatedPlan.status === 'failed') && 
      !context.strategicPlans[planIndex].completedAt
    ) {
      context.strategicPlans[planIndex].completedAt = this.dateHandler.createDate();
    }
    
    // Save the updated context
    await this.saveContext(context);
  }
  
  /**
   * Add a relationship to a context
   * 
   * BOUNDARY MANAGEMENT: Maintains relationship temporal coherence by ensuring 
   * consistent timestamp handling with ChronosDateHandler. Timestamp is preserved 
   * if present in the input relationship or created using the date handler if absent, 
   * ensuring temporal consistency across the persistence boundary.
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
      timestamp: relationship.timestamp || this.dateHandler.createDate()
    });
    
    // Save the updated context
    await this.saveContext(context);
  }
  
  /**
   * Get recent history from a context
   * 
   * BOUNDARY MANAGEMENT: Handles cross-boundary temporal ordering with 
   * explicit ChronosDateHandler.deserializeDate usage for timestamp comparison.
   * Ensures consistent date handling across the persistence boundary during 
   * both storage and retrieval, maintaining temporal coherence.
   * 
   * @param sessionId The session ID
   * @param layer The layer to filter by
   * @param limit The maximum number of history items to get
   * @returns The recent history
   */
  async getRecentHistory(sessionId: string, layer: string, limit: number): Promise<any[]> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      // Return empty array instead of throwing for graceful degradation
      return [];
    }
    
    // Filter by layer
    const filtered = context.history.filter(h => h.layer === layer);
    
    // Sort by timestamp (newest first)
    const sorted = filtered.sort((a, b) => 
      this.dateHandler.deserializeDate(b.timestamp).getTime() - 
      this.dateHandler.deserializeDate(a.timestamp).getTime()
    );
    
    // Return the most recent items
    return sorted.slice(0, limit);
  }
  
  /**
   * Get active strategic plans from a context
   * 
   * BOUNDARY MANAGEMENT: Provides critical status-based filtering at the 
   * persistence boundary, ensuring only active plans (pending or in_progress)
   * cross the boundary. Handles graceful degradation for non-existent contexts
   * to maintain system resilience and boundary integrity.
   * 
   * @param sessionId The session ID
   * @returns The active strategic plans
   */
  async getActiveStrategicPlans(sessionId: string): Promise<any[]> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      // Return empty array instead of throwing for graceful degradation
      return [];
    }
    
    // Return plans that are not completed or failed
    return context.strategicPlans.filter(p => 
      p.status === 'pending' || p.status === 'in_progress'
    );
  }
  
  /**
   * Get insights by type from a context
   * 
   * BOUNDARY MANAGEMENT: Implements dual-parameter boundary filtering
   * to ensure only insights meeting both type and importance thresholds
   * cross the persistence boundary. Maintains system degradation resilience
   * at the boundary through empty array fallback when context is not found.
   * 
   * @param sessionId The session ID
   * @param eventType The event type to filter by
   * @param minImportance The minimum importance to filter by
   * @returns The matching insights
   */
  async getInsightsByType(sessionId: string, eventType: string, minImportance: number): Promise<any[]> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      // Return empty array instead of throwing for graceful degradation
      return [];
    }
    
    // Filter insights by category (which is the type) and importance
    return context.metaInsights.filter(i => 
      i.category === eventType && 
      (i.importance || 0) >= minImportance
    );
  }
  
  /**
   * Search a context for items matching a query
   * 
   * BOUNDARY MANAGEMENT: Provides cross-boundary search capabilities
   * with unified query processing across different data types (history,
   * insights, plans). Implements an abstraction layer that hides the
   * complexity of the underlying data structures, allowing consistent
   * queries across the persistence boundary while maintaining
   * graceful degradation for non-existent contexts.
   * 
   * @param sessionId The session ID
   * @param query The search query
   * @returns The matching items
   */
  async searchContext(sessionId: string, query: string): Promise<any[]> {
    const context = await this.loadContext(sessionId);
    if (!context) {
      // Return empty array instead of throwing for graceful degradation
      return [];
    }
    
    const results: any[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Helper function to check if an object contains the query string
    const containsQuery = (obj: any): boolean => {
      // Convert to string and check
      const str = JSON.stringify(obj).toLowerCase();
      return str.includes(lowerQuery);
    };
    
    // Search history items
    for (const item of context.history) {
      if (containsQuery(item)) {
        results.push(item);
      }
    }
    
    // Search meta insights
    for (const item of context.metaInsights) {
      if (containsQuery(item)) {
        results.push(item);
      }
    }
    
    // Search strategic plans
    for (const item of context.strategicPlans) {
      if (containsQuery(item)) {
        results.push(item);
      }
    }
    
    return results;
  }
}

export default MemPersistentContextService;