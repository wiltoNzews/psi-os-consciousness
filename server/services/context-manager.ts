/**
 * Context Manager
 * 
 * This module defines the core interfaces and types for the Persistent Context system,
 * which enables WiltonOS to maintain memory across sessions and create a coherent cognitive
 * experience that transcends individual interactions.
 * 
 * The persistent context layer serves as the foundation for memory-centric cognition,
 * allowing different cognitive layers (Reactive, Strategic, Meta-Cognitive) to access
 * and modify shared context according to their specific needs and time horizons.
 */

/**
 * Cognitive processing layers
 * 
 * Traditional processing layers:
 * - REACTIVE: Fast, immediate responses with minimal planning
 * - STRATEGIC: Thorough, planned responses with decomposition and recomposition
 * - META_COGNITIVE: Reflective, system-level improvements and pattern recognition
 * 
 * Multi-dimensional communication layers:
 * - TECHNICAL: Implementation details, code snippets, function calls, file paths
 * - CONCEPTUAL: Framework ideas, principles, and conceptual models
 * - EMOTIONAL: Affective states, excitement, frustration, satisfaction
 */
export enum CognitiveLayer {
  // Traditional processing layers
  REACTIVE = 'reactive',
  STRATEGIC = 'strategic',
  META_COGNITIVE = 'meta_cognitive',
  
  // Multi-dimensional communication layers
  TECHNICAL = 'technical',
  CONCEPTUAL = 'conceptual',
  EMOTIONAL = 'emotional'
}

/**
 * Types of meta-cognitive events
 */
export enum MetaEventType {
  STABILITY_ADJUSTMENT = 'stability-adjustment',
  PATTERN_RECOGNITION = 'pattern-recognition',
  TASK_COMPLETION = 'task-completion',
  TASK_FAILURE = 'task-failure',
  CONTEXT_INTEGRATION = 'context-integration',
  RESONANCE_MEASUREMENT = 'resonance-measurement',
}

/**
 * A chunk of context history
 */
export interface HistoryChunk {
  chunkId: string;
  content: string;
  cognitiveLayer: CognitiveLayer;
  timestamp: Date;
  taskId?: string;
  tags?: string[];
}

/**
 * A strategic plan for task execution
 */
export interface StrategicPlan {
  taskId: string;
  planSummary: string;
  subTasks: string[];
  createdAt: Date;
  updatedAt: Date;  // New field for tracking changes
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  completedAt?: Date;
}

/**
 * A meta-cognitive insight derived from system operation
 */
export interface MetaInsight {
  eventType: MetaEventType;
  summary: string;
  details: Record<string, any>;
  timestamp: Date;
  importance: number; // 0-1 scale
  confidence: number; // 0-1 scale
}

/**
 * Relationship between context elements
 * Enhanced with metadata support for Void-Centered Architecture to
 * explicitly capture relationship context and boundary information
 */
export interface ContextRelationship {
  sourceId: string;
  targetId: string;
  relationshipType: string;
  strength: number; // 0-1 scale
  timestamp: Date;
  metadata?: Record<string, any>; // Additional contextual information
}

/**
 * The complete persistent context for a session
 */
export interface PersistentContext {
  sessionId: string;
  historyChunks: HistoryChunk[];
  strategicPlans: StrategicPlan[];
  metaInsights: MetaInsight[];
  relationships: ContextRelationship[];
  updatedAt: Date;
  createdAt: Date;
  version: number;  // New field for optimistic concurrency control
}

/**
 * Interface for persistent context operations
 */
export interface IPersistentContextService {
  /**
   * Initialize a new session or load existing session
   */
  initializeSession(sessionId: string): Promise<PersistentContext>;
  
  /**
   * Save the current context state
   */
  saveContext(context: PersistentContext): Promise<void>;
  
  /**
   * Load context for a specific session
   */
  loadContext(sessionId: string): Promise<PersistentContext | null>;
  
  /**
   * Add a history chunk to the context
   */
  addHistoryChunk(sessionId: string, chunk: HistoryChunk): Promise<void>;
  
  /**
   * Add a strategic plan to the context
   */
  addStrategicPlan(sessionId: string, plan: StrategicPlan): Promise<void>;
  
  /**
   * Add a meta-cognitive insight to the context
   */
  addMetaInsight(sessionId: string, insight: MetaInsight): Promise<void>;
  
  /**
   * Add a relationship between context elements
   */
  addContextRelationship(sessionId: string, relationship: ContextRelationship): Promise<void>;
  
  /**
   * Get recent history chunks filtered by cognitive layer
   */
  getRecentHistory(sessionId: string, layer: CognitiveLayer, limit: number): Promise<HistoryChunk[]>;
  
  /**
   * Get active strategic plans
   */
  getActiveStrategicPlans(sessionId: string): Promise<StrategicPlan[]>;
  
  /**
   * Get insights by type and importance threshold
   */
  getInsightsByType(sessionId: string, eventType: MetaEventType, minImportance: number): Promise<MetaInsight[]>;
  
  /**
   * Get related context elements by relationship type
   */
  getRelatedContextElements(sessionId: string, sourceId: string, relationshipType: string): Promise<string[]>;
  
  /**
   * Search through context using text query
   */
  searchContext(sessionId: string, query: string): Promise<HistoryChunk[]>;

  /**
   * Update an existing strategic plan (e.g., mark completed or failed)
   */
  updateStrategicPlan(sessionId: string, updatedPlan: StrategicPlan): Promise<void>;
}