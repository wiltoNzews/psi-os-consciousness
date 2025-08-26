/**
 * Memory Database Handler
 * 
 * This module provides utilities for working with the PostgreSQL memory database,
 * ensuring all operations maintain the 3:1 quantum balance ratio (75% coherence, 25% exploration).
 * 
 * This file acts as a bridge between the Express routes and the underlying database,
 * with full compatibility between Node.js and Python operations.
 */

import { eq, desc, and, or, sql, inArray } from 'drizzle-orm';
import { db, testConnection } from '../database/db.js';
import * as memorySchema from '../../shared/schema-memory.js';

// Default quantum coherence ratio (75% coherence, 25% exploration)
const DEFAULT_COHERENCE_RATIO = '3:1';

/**
 * Calculate coherence score for a given memory content
 * 
 * @param {string} content - The memory content to analyze
 * @param {string} source - The source of the memory
 * @returns {number} - Coherence score between 0-100
 */
const calculateCoherenceScore = (content, source) => {
  // Basic implementation - can be enhanced with more sophisticated algorithms
  
  // Start with default coherence in middle range
  let baseScore = 50;
  
  // Adjust based on content length (longer content often has more structure)
  const contentLength = content.length;
  if (contentLength > 10000) baseScore += 10;
  else if (contentLength > 5000) baseScore += 5;
  else if (contentLength < 100) baseScore -= 10;
  
  // Adjust based on source
  if (source === memorySchema.MEMORY_SOURCES.CHATGPT) {
    // ChatGPT exports tend to have more structure
    baseScore += 15;
  } else if (source === memorySchema.MEMORY_SOURCES.PYTHON_BOOT_LOADER) {
    // Python boot loader data is highly structured
    baseScore += 20;
  }
  
  // Apply random exploration factor (25% as per 3:1 ratio)
  // This ensures we maintain quantum balance
  const explorationFactor = Math.random() * 25;
  
  // Calculate final score with 75% weight on base, 25% on exploration
  const finalScore = Math.round((baseScore * 0.75) + explorationFactor);
  
  // Ensure result is within 0-100 range
  return Math.min(100, Math.max(0, finalScore));
};

/**
 * Import a memory into the database
 * 
 * @param {Object} memory - Memory object to import
 * @returns {Promise<Object>} - Imported memory
 */
export const importMemory = async (memory) => {
  console.log(`[QUANTUM_STATE: DATABASE_FLOW] Importing memory: ${memory.title}`);
  
  try {
    // Calculate coherence score if not provided
    if (!memory.coherence_score) {
      memory.coherence_score = calculateCoherenceScore(memory.content, memory.source);
    }
    
    // Insert memory into database
    const [insertedMemory] = await db.insert(memorySchema.memories).values(memory).returning();
    
    // Log transaction
    await logTransaction({
      memory_id: insertedMemory.id,
      operation: 'import',
      details: {
        title: memory.title,
        source: memory.source,
        coherence_score: memory.coherence_score
      },
      success: true,
      source: 'memory-db-handler'
    });
    
    console.log(`[QUANTUM_STATE: DATABASE_FLOW] Memory imported successfully with ID: ${insertedMemory.id}`);
    return insertedMemory;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Memory import error:`, error);
    
    // Log error transaction
    await logTransaction({
      operation: 'import',
      details: {
        title: memory.title,
        source: memory.source,
        error: error.message
      },
      success: false,
      error_message: error.message,
      source: 'memory-db-handler'
    });
    
    throw error;
  }
};

/**
 * Update an existing memory
 * 
 * @param {number} id - Memory ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated memory
 */
export const updateMemory = async (id, updates) => {
  console.log(`[QUANTUM_STATE: DATABASE_FLOW] Updating memory: ${id}`);
  
  try {
    // If content or source changed, recalculate coherence score
    if (updates.content || updates.source) {
      // Get current memory
      const [currentMemory] = await db.select().from(memorySchema.memories).where(memorySchema.memories.id.equals(id));
      
      if (currentMemory) {
        const content = updates.content || currentMemory.content;
        const source = updates.source || currentMemory.source;
        updates.coherence_score = calculateCoherenceScore(content, source);
      }
    }
    
    // Update memory
    const [updatedMemory] = await db
      .update(memorySchema.memories)
      .set({
        ...updates,
        updated_at: new Date()
      })
      .where(memorySchema.memories.id.equals(id))
      .returning();
    
    // Log transaction
    await logTransaction({
      memory_id: id,
      operation: 'update',
      details: {
        fields_updated: Object.keys(updates),
        coherence_score: updatedMemory.coherence_score
      },
      success: true,
      source: 'memory-db-handler'
    });
    
    console.log(`[QUANTUM_STATE: DATABASE_FLOW] Memory updated successfully: ${id}`);
    return updatedMemory;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Memory update error:`, error);
    
    // Log error transaction
    await logTransaction({
      memory_id: id,
      operation: 'update',
      details: {
        fields_updated: Object.keys(updates),
        error: error.message
      },
      success: false,
      error_message: error.message,
      source: 'memory-db-handler'
    });
    
    throw error;
  }
};

/**
 * Delete a memory
 * 
 * @param {number} id - Memory ID
 * @returns {Promise<boolean>} - Success indicator
 */
export const deleteMemory = async (id) => {
  console.log(`[QUANTUM_STATE: DATABASE_FLOW] Deleting memory: ${id}`);
  
  try {
    // Delete memory
    const [deletedMemory] = await db
      .delete(memorySchema.memories)
      .where(memorySchema.memories.id.equals(id))
      .returning();
    
    if (!deletedMemory) {
      throw new Error(`Memory with ID ${id} not found`);
    }
    
    // Log transaction
    await logTransaction({
      memory_id: id,
      operation: 'delete',
      details: {
        title: deletedMemory.title,
        source: deletedMemory.source
      },
      success: true,
      source: 'memory-db-handler'
    });
    
    console.log(`[QUANTUM_STATE: DATABASE_FLOW] Memory deleted successfully: ${id}`);
    return true;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Memory deletion error:`, error);
    
    // Log error transaction
    await logTransaction({
      memory_id: id,
      operation: 'delete',
      details: {
        error: error.message
      },
      success: false,
      error_message: error.message,
      source: 'memory-db-handler'
    });
    
    throw error;
  }
};

/**
 * Get a memory by ID
 * 
 * @param {number} id - Memory ID
 * @returns {Promise<Object>} - Memory object
 */
export const getMemory = async (id) => {
  console.log(`[QUANTUM_STATE: DATABASE_FLOW] Retrieving memory: ${id}`);
  
  try {
    // Get memory
    const [memory] = await db
      .select()
      .from(memorySchema.memories)
      .where(memorySchema.memories.id.equals(id));
    
    if (!memory) {
      throw new Error(`Memory with ID ${id} not found`);
    }
    
    console.log(`[QUANTUM_STATE: DATABASE_FLOW] Memory retrieved successfully: ${id}`);
    return memory;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Memory retrieval error:`, error);
    throw error;
  }
};

/**
 * Get all memories with optional filtering
 * 
 * @param {Object} options - Filter options
 * @param {number} options.limit - Maximum number of records to return
 * @param {number} options.offset - Number of records to skip
 * @param {string} options.source - Filter by source
 * @returns {Promise<Array>} - Array of memory objects
 */
export const getMemories = async ({ limit = 100, offset = 0, source = null } = {}) => {
  console.log(`[QUANTUM_STATE: DATABASE_FLOW] Retrieving memories with limit: ${limit}, offset: ${offset}`);
  
  try {
    // Build query
    let query = db.select().from(memorySchema.memories);
    
    // Apply source filter if provided
    if (source) {
      query = query.where(memorySchema.memories.source.equals(source));
    }
    
    // Apply pagination
    query = query.offset(offset).limit(limit);
    
    // Execute query
    const memories = await query;
    
    console.log(`[QUANTUM_STATE: DATABASE_FLOW] Retrieved ${memories.length} memories`);
    return memories;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Memories retrieval error:`, error);
    throw error;
  }
};

/**
 * Create a coherence snapshot
 * 
 * @param {Object} snapshot - Coherence snapshot data
 * @returns {Promise<Object>} - Created snapshot
 */
export const createCoherenceSnapshot = async (snapshot) => {
  console.log(`[QUANTUM_STATE: DATABASE_FLOW] Creating coherence snapshot`);
  
  try {
    // Insert snapshot into database
    const [newSnapshot] = await db.insert(memorySchema.coherenceSnapshots).values(snapshot).returning();
    
    console.log(`[QUANTUM_STATE: DATABASE_FLOW] Coherence snapshot created successfully with ID: ${newSnapshot.id}`);
    return newSnapshot;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Coherence snapshot creation error:`, error);
    throw error;
  }
};

/**
 * Get the latest coherence snapshot
 * 
 * @returns {Promise<Object>} - Latest coherence snapshot
 */
export const getLatestCoherenceSnapshot = async () => {
  console.log(`[QUANTUM_STATE: DATABASE_FLOW] Retrieving latest coherence snapshot`);
  
  try {
    // Get latest snapshot
    const [snapshot] = await db
      .select()
      .from(memorySchema.coherenceSnapshots)
      .orderBy(memorySchema.coherenceSnapshots.timestamp.desc())
      .limit(1);
    
    console.log(`[QUANTUM_STATE: DATABASE_FLOW] Latest coherence snapshot retrieved successfully`);
    return snapshot;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Coherence snapshot retrieval error:`, error);
    throw error;
  }
};

/**
 * Log a transaction
 * 
 * @param {Object} transaction - Transaction to log
 * @returns {Promise<Object>} - Logged transaction
 */
export const logTransaction = async (transaction) => {
  try {
    // Insert transaction into database
    const [loggedTransaction] = await db.insert(memorySchema.memoryTransactions).values(transaction).returning();
    
    return loggedTransaction;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Transaction logging error:`, error);
    // Don't throw here - we don't want failing transactions to break the main flow
    return null;
  }
};

/**
 * Get transactions for a memory
 * 
 * @param {number} memoryId - Memory ID
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} - Array of transaction objects
 */
export const getTransactions = async (memoryId = null, limit = 100) => {
  try {
    // Build query
    let query = db.select().from(memorySchema.memoryTransactions);
    
    // Apply memory ID filter if provided
    if (memoryId !== null) {
      query = query.where(memorySchema.memoryTransactions.memory_id.equals(memoryId));
    }
    
    // Apply ordering and limit
    query = query.orderBy(memorySchema.memoryTransactions.timestamp.desc()).limit(limit);
    
    // Execute query
    const transactions = await query;
    
    return transactions;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Transactions retrieval error:`, error);
    throw error;
  }
};

/**
 * Store an API key
 * 
 * @param {Object} apiKey - API key data
 * @returns {Promise<Object>} - Stored API key
 */
export const storeApiKey = async (apiKey) => {
  console.log(`[QUANTUM_STATE: DATABASE_FLOW] Storing API key for ${apiKey.service}`);
  
  try {
    // Insert API key into database
    const [storedKey] = await db.insert(memorySchema.apiKeys).values(apiKey).returning();
    
    console.log(`[QUANTUM_STATE: DATABASE_FLOW] API key stored successfully with ID: ${storedKey.id}`);
    return storedKey;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] API key storage error:`, error);
    throw error;
  }
};

/**
 * Get active API key for a service
 * 
 * @param {string} service - Service name
 * @returns {Promise<Object>} - API key
 */
export const getActiveApiKey = async (service) => {
  console.log(`[QUANTUM_STATE: DATABASE_FLOW] Getting active API key for ${service}`);
  
  try {
    // Get active API key
    const [apiKey] = await db
      .select()
      .from(memorySchema.apiKeys)
      .where(memorySchema.apiKeys.service.equals(service))
      .where(memorySchema.apiKeys.active.equals(true))
      .orderBy(memorySchema.apiKeys.created_at.desc())
      .limit(1);
    
    return apiKey || null;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] API key retrieval error:`, error);
    throw error;
  }
};