/**
 * Embedding Service Initializer
 * 
 * This module initializes and coordinates between different embedding services,
 * providing a unified interface for embedding operations and handling 
 * fallback mechanisms to ensure system resilience.
 * 
 * [QUANTUM_STATE: EMBEDDING_FLOW]
 */

import vectorEmbeddingService from './vector-embedding-service.js';
import vectorEmbeddingFallback from './vector-embedding-fallback.js';

// Service status
let primaryInitialized = false;
let fallbackInitialized = false;

/**
 * Initialize all embedding services
 */
async function initialize() {
  console.log('Initializing embedding services...');
  
  // Initialize the primary embedding service (OpenAI + Pinecone)
  primaryInitialized = await vectorEmbeddingService.initialize();
  
  // Initialize the fallback service
  fallbackInitialized = await vectorEmbeddingFallback.initialize();
  
  console.log('Embedding services initialization status: \n      - Primary (OpenAI/Pinecone): ' + 
              (primaryInitialized ? 'Success' : 'Failed') + 
              '\n      - Fallback (Local): ' + 
              (fallbackInitialized ? 'Success' : 'Failed'));
  
  return primaryInitialized || fallbackInitialized;
}

/**
 * Perform semantic search using available services
 */
async function semanticSearch(query, limit = 5) {
  try {
    // Try primary service first
    if (primaryInitialized) {
      const results = await vectorEmbeddingService.semanticSearch(query, limit);
      if (results && results.length > 0) {
        return results;
      }
    }
    
    // If primary service failed or returned no results, try fallback
    console.log('No results from primary embedding service, trying fallback...');
    if (fallbackInitialized) {
      return await vectorEmbeddingFallback.semanticSearch(query, limit);
    }
    
    return [];
  } catch (error) {
    console.error('Error during semantic search:', error);
    
    // If error in primary, try fallback
    try {
      if (fallbackInitialized) {
        console.log('Primary search failed, using fallback service...');
        return await vectorEmbeddingFallback.semanticSearch(query, limit);
      }
    } catch (fallbackError) {
      console.error('Fallback search also failed:', fallbackError);
    }
    
    return [];
  }
}

/**
 * Create embedding seed using available services
 */
async function createQuantumSeed(sessionId, seedName, content, metadata = {}) {
  try {
    // Try primary service first
    if (primaryInitialized) {
      const result = await vectorEmbeddingService.createEmbeddingSeed(sessionId, seedName, content, metadata);
      if (result.success) {
        return result;
      }
    }
    
    // If primary service failed, try fallback
    if (fallbackInitialized) {
      console.log('Primary embedding service failed, using fallback for seed creation...');
      return await vectorEmbeddingFallback.createEmbeddingSeed(sessionId, seedName, content, metadata);
    }
    
    return { success: false, error: 'No embedding services available' };
  } catch (error) {
    console.error('Error creating quantum seed:', error);
    
    // If error in primary, try fallback
    try {
      if (fallbackInitialized) {
        return await vectorEmbeddingFallback.createEmbeddingSeed(sessionId, seedName, content, metadata);
      }
    } catch (fallbackError) {
      console.error('Fallback seed creation also failed:', fallbackError);
    }
    
    return { success: false, error: 'All embedding services failed' };
  }
}

/**
 * Create text embedding using available services
 */
async function createEmbedding(text) {
  try {
    // Try primary service first
    if (primaryInitialized) {
      const embedding = await vectorEmbeddingService.createEmbedding(text);
      if (embedding) {
        return embedding;
      }
    }
    
    // If primary service failed, try fallback
    if (fallbackInitialized) {
      console.log('Primary embedding service failed, using fallback...');
      return await vectorEmbeddingFallback.createEmbedding(text);
    }
    
    return null;
  } catch (error) {
    console.error('Error creating embedding:', error);
    
    // If error in primary, try fallback
    try {
      if (fallbackInitialized) {
        return await vectorEmbeddingFallback.createEmbedding(text);
      }
    } catch (fallbackError) {
      console.error('Fallback embedding also failed:', fallbackError);
    }
    
    return null;
  }
}

/**
 * Check health status of embedding services
 */
async function healthCheck() {
  const services = {
    openai: primaryInitialized ? 'available' : 'unavailable',
    pinecone: primaryInitialized ? 'available' : 'unavailable',
    fallback: fallbackInitialized ? 'available' : 'unavailable'
  };
  
  const status = (primaryInitialized || fallbackInitialized) ? 'operational' : 'degraded';
  
  return {
    status,
    services
  };
}

export default {
  initialize,
  semanticSearch,
  createQuantumSeed,
  createEmbedding,
  healthCheck
};