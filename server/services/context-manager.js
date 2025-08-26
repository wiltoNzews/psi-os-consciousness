/**
 * Context Manager
 * 
 * This module defines the cognitive layers and event types used in the 
 * QCTF architecture. It establishes the hierarchical structure required for
 * properly maintaining the coherence attractors (0.7500/0.2494) that create
 * the Ouroboros Pattern (3:1 ↔ 1:3 ratio).
 */

// Define the cognitive layers of the architecture
export const CognitiveLayer = {
  REACTIVE: 'reactive',       // Immediate response to stimuli
  STRATEGIC: 'strategic',     // Higher-level planning and learning
  META_COGNITIVE: 'meta'      // System self-awareness and optimization
};

// Define the types of meta-cognitive events
export const MetaEventType = {
  INSIGHT: 'insight',                  // Cognitive insights about patterns
  STABILITY_THRESHOLD: 'stability',    // Reaching stability threshold
  COHERENCE_SHIFT: 'coherence',        // Significant coherence shifts
  GOLDEN_RATIO: 'golden_ratio',        // Golden ratio pattern detection
  USER_FEEDBACK: 'user_feedback',      // User feedback on system behavior
  SYSTEM_ADAPTATION: 'adaptation',     // System self-modification events
  RECURSION_DETECTED: 'recursion'      // Detection of harmful recursive patterns
};

/**
 * Definition of a history chunk for persistent memory
 * @typedef {Object} HistoryChunk
 * @property {string} chunkId - Unique identifier for the chunk
 * @property {string} content - Text content of the chunk
 * @property {CognitiveLayer} cognitiveLayer - Cognitive layer this chunk belongs to
 * @property {Date} timestamp - When this chunk was created
 * @property {string} [taskId] - Optional ID of the related task
 * @property {string[]} [tags] - Optional tags for categorization
 */

/**
 * Definition of a meta insight for pattern recognition
 * @typedef {Object} MetaInsight
 * @property {string} insightId - Unique identifier for the insight
 * @property {MetaEventType} eventType - Type of meta-cognitive event
 * @property {string} summary - Short summary of the insight
 * @property {string} observation - Detailed observation
 * @property {Object} details - Structured details about the insight
 * @property {number} confidence - Confidence score (0.0-1.0) 
 * @property {number} importance - Importance score (0.0-1.0)
 * @property {Date} timestamp - When this insight was generated
 * @property {string[]} [tags] - Optional tags for categorization
 */

/**
 * Definition of a strategic plan for future actions
 * @typedef {Object} StrategicPlan
 * @property {string} planId - Unique identifier for the plan
 * @property {string} taskId - ID of the task this plan relates to
 * @property {string} title - Title of the plan
 * @property {string} planSummary - Summary of the plan
 * @property {string} description - Detailed description
 * @property {string[]} steps - Ordered list of steps to execute
 * @property {Object[]} subTasks - List of sub-tasks
 * @property {string[]} expectedOutcomes - Expected outcomes
 * @property {Date} createdAt - When this plan was created
 * @property {Date} updatedAt - When this plan was last updated
 * @property {string} status - Current status (active, completed, etc.)
 * @property {string[]} [tags] - Optional tags for categorization
 */

/**
 * Interface for persistent context services
 * This is an abstract base class, not an actual interface
 */
export class PersistentContextServiceBase {
  /**
   * Initialize a new session with metadata
   * @param {string} sessionId - Unique identifier for the session
   * @param {Object} [metadata] - Optional metadata for the session
   * @returns {Promise<Object>} Session data
   */
  async initializeSession(sessionId, metadata) {
    throw new Error('Not implemented');
  }
  
  /**
   * Load an existing session context
   * @param {string} sessionId - Unique identifier for the session
   * @returns {Promise<Object|null>} Session context or null if not found
   */
  async loadContext(sessionId) {
    throw new Error('Not implemented');
  }
  
  /**
   * Add a history chunk to a session
   * @param {string} sessionId - Unique identifier for the session
   * @param {HistoryChunk} chunk - History chunk to add
   * @returns {Promise<boolean>} Success indicator
   */
  async addHistoryChunk(sessionId, chunk) {
    throw new Error('Not implemented');
  }
  
  /**
   * Store a history chunk (alias for addHistoryChunk)
   * @param {string} sessionId - Unique identifier for the session
   * @param {HistoryChunk} chunk - History chunk to store
   * @returns {Promise<boolean>} Success indicator
   */
  async storeHistoryChunk(sessionId, chunk) {
    throw new Error('Not implemented');
  }
  
  /**
   * Get recent history chunks from a session
   * @param {string} sessionId - Unique identifier for the session
   * @param {CognitiveLayer} [cognitiveLayer] - Optional filter by cognitive layer
   * @param {number} [limit=10] - Maximum number of chunks to return
   * @returns {Promise<HistoryChunk[]>} Array of history chunks
   */
  async getRecentHistory(sessionId, cognitiveLayer, limit) {
    throw new Error('Not implemented');
  }
  
  /**
   * Add a meta insight to a session
   * @param {string} sessionId - Unique identifier for the session
   * @param {MetaInsight} insight - Meta insight to add
   * @returns {Promise<boolean>} Success indicator
   */
  async addMetaInsight(sessionId, insight) {
    throw new Error('Not implemented');
  }
  
  /**
   * Store a meta insight (alias for addMetaInsight)
   * @param {string} sessionId - Unique identifier for the session
   * @param {MetaInsight} insight - Meta insight to store
   * @returns {Promise<boolean>} Success indicator
   */
  async storeMetaInsight(sessionId, insight) {
    throw new Error('Not implemented');
  }
  
  /**
   * Add a strategic plan to a session
   * @param {string} sessionId - Unique identifier for the session
   * @param {StrategicPlan} plan - Strategic plan to add
   * @returns {Promise<boolean>} Success indicator
   */
  async addStrategicPlan(sessionId, plan) {
    throw new Error('Not implemented');
  }
  
  /**
   * Store a state anchor (system snapshot) for a session
   * @param {string} sessionId - Unique identifier for the session
   * @param {Object} state - State data to store
   * @returns {Promise<Object>} Result with success indicator and anchorId
   */
  async storeStateAnchor(sessionId, state) {
    throw new Error('Not implemented');
  }
  
  /**
   * Restore from an anchor state
   * @param {string} sessionId - Unique identifier for the session
   * @param {string} anchorId - ID of the anchor to restore from
   * @returns {Promise<Object>} Result with success indicator and state
   */
  async restoreFromAnchor(sessionId, anchorId) {
    throw new Error('Not implemented');
  }
  
  /**
   * Search across the session context
   * @param {string} sessionId - Unique identifier for the session
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  async searchContext(sessionId, query) {
    throw new Error('Not implemented');
  }
}

// The CognitiveLayer and MetaEventType are already exported above
// The PersistentContextServiceBase class is exported inline with its definition