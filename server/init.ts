/**
 * Application Initialization
 * 
 * This module handles initialization tasks that need to be performed
 * when the application starts.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { initStorage } from './storage-bridge.js';
import { StorageType } from './storage-factory.js';
import embeddingServiceInitializer from './services/embedding-service-initializer.js';
import embeddingSeedsManager from './services/embedding-seeds-manager.js';

/**
 * Initialize all required application components
 */
export async function initializeApplication(): Promise<void> {
  console.log('[QUANTUM_STATE: INIT_FLOW] Initializing application components...');
  
  // Initialize database storage
  try {
    const storage = await initStorage();
    console.log('[QUANTUM_STATE: INIT_FLOW] Storage system initialized successfully');
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Failed to initialize storage:', error);
    // Continue execution with fallback storage
  }
  
  // Initialize embedding services and RAG capabilities
  try {
    console.log('[QUANTUM_STATE: INIT_FLOW] Initializing vector embedding services...');
    const embeddingsInitialized = await embeddingServiceInitializer.initialize();
    console.log(`[QUANTUM_STATE: INIT_FLOW] Vector embedding services initialized: ${embeddingsInitialized ? 'Success' : 'Fallback mode'}`);
    
    // Initialize embedding seeds manager
    console.log('[QUANTUM_STATE: INIT_FLOW] Initializing embedding seeds manager...');
    const seedsInitialized = await embeddingSeedsManager.initialize();
    console.log(`[QUANTUM_STATE: INIT_FLOW] Embedding seeds manager initialized: ${seedsInitialized ? 'Success' : 'Fallback mode'}`);
    
    // Run a quick embedding service test if initialization was successful
    if (embeddingsInitialized) {
      const healthStatus = await embeddingServiceInitializer.healthCheck();
      console.log(`[QUANTUM_STATE: INIT_FLOW] Embedding services health check: ${healthStatus.status}`);
      console.log(`[QUANTUM_STATE: INIT_FLOW] Available services: OpenAI (${healthStatus.services.openai}), Pinecone (${healthStatus.services.pinecone})`);
    }
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error initializing embedding services:', error);
    console.log('[QUANTUM_STATE: ERROR_FLOW] Will continue with fallback text matching for semantic search');
  }
  
  console.log('[QUANTUM_STATE: INIT_FLOW] Application initialization complete');
}

// Export default for convenience
export default initializeApplication;