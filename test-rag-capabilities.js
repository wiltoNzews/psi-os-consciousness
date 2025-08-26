/**
 * RAG Capabilities Test Script
 * 
 * This script tests the Retrieval-Augmented Generation capabilities
 * of the system by creating embedding seeds and performing semantic searches.
 */

import embeddingServiceInitializer from './server/services/embedding-service-initializer.js';
import embeddingSeedsManager from './server/services/embedding-seeds-manager.js';
import metaRoutingRagService from './server/services/meta-routing-rag-service.js';

// Create a session ID for testing
const sessionId = `test-session-${Date.now()}`;
console.log(`Starting RAG capability test with session ID: ${sessionId}`);

// Main test function
async function testRagCapabilities() {
  console.log('1. Initializing embedding services...');
  await embeddingServiceInitializer.initialize();
  
  // Check health status
  const healthStatus = await embeddingServiceInitializer.healthCheck();
  console.log('Embedding services status:', healthStatus.status);
  console.log('Available services:', healthStatus.services);
  
  console.log('\n2. Creating quantum embedding seeds...');
  
  // Create some embedding seeds for testing
  const seedResults = await Promise.all([
    embeddingSeedsManager.createQuantumSeed(
      sessionId,
      'Coherence Stability',
      'Maintain quantum coherence at 0.7500 to preserve stability while allowing for controlled exploration.',
      {
        type: 'balance',
        coherenceTarget: 0.7500,
        category: 'system-state',
        priority: 'high'
      }
    ),
    embeddingSeedsManager.createQuantumSeed(
      sessionId,
      'Exploration Threshold',
      'Allow exploration at 0.2494 to discover new patterns and insights while maintaining overall stability.',
      {
        type: 'balance',
        explorationTarget: 0.2494,
        category: 'system-state',
        priority: 'high'
      }
    ),
    embeddingSeedsManager.createQuantumSeed(
      sessionId,
      'Golden Ratio Attractor',
      'Align system attractors with the golden ratio (1.618) to maximize natural harmony in quantum states.',
      {
        type: 'attractor',
        goldenRatio: 1.618,
        category: 'mathematical-harmony',
        priority: 'medium'
      }
    ),
    embeddingSeedsManager.createQuantumSeed(
      sessionId,
      'Fractal Lemniscate Pattern',
      'Apply the lemniscate fractal pattern (∞) to create continuous flow between micro and macro states.',
      {
        type: 'pattern',
        pattern: 'lemniscate',
        category: 'fractal-structure',
        priority: 'high'
      }
    )
  ]);
  
  console.log(`Created ${seedResults.length} embedding seeds`);
  seedResults.forEach((result, index) => {
    console.log(`- Seed ${index + 1}: ${result.success ? 'Success' : 'Failed'} - ${result.name || 'Unnamed'}`);
  });
  
  console.log('\n3. Performing semantic search for "quantum coherence ratio"...');
  const searchResults = await embeddingServiceInitializer.semanticSearch('quantum coherence ratio', 3);
  
  console.log(`Found ${searchResults.length} semantic matches:`);
  searchResults.forEach((result, index) => {
    console.log(`Result ${index + 1}: Score ${result.score.toFixed(4)}, ID: ${result.id}, Type: ${result.metadata?.type || 'unknown'}`);
  });
  
  console.log('\n4. Testing meta-routing RAG service with some sample content...');
  
  // Define a sample state
  const sampleState = {
    id: 'sample-state-001',
    name: 'Sample Quantum State',
    description: 'A test state for the RAG capabilities',
    coherenceIndex: 0.68,
    goldenRatioDetected: false,
    timestamp: new Date().toISOString()
  };
  
  // Process a conversation chunk for contextual insight
  const chunkResult = await metaRoutingRagService.processConversationChunk(
    sessionId,
    'How does the 3:1 ratio of coherence to exploration affect system stability?',
    'META_COGNITIVE'
  );
  
  console.log('Conversation chunk processing result:');
  console.log('- Success:', chunkResult.success);
  console.log('- Chunk ID:', chunkResult.chunkId);
  console.log('- Coherence Index:', chunkResult.coherenceIndex?.toFixed(4));
  console.log('- Related Contexts:', chunkResult.relatedContext?.length || 0);
  console.log('- Suggested Seeds:', chunkResult.suggestedSeeds?.length || 0);
  
  // Enhance the state with RAG contextual awareness
  const enhancedState = await metaRoutingRagService.enhanceStateWithContext(
    sampleState,
    sessionId,
    'The quantum balance of 0.7500/0.2494 maintains coherence across fractal dimensions'
  );
  
  console.log('\nEnhanced state with RAG context:');
  console.log('- Original Coherence:', sampleState.coherenceIndex);
  console.log('- Enhanced Coherence:', enhancedState.coherenceIndex?.toFixed(4));
  console.log('- Golden Ratio Detected:', enhancedState.goldenRatioDetected ? 'Yes' : 'No');
  console.log('- Contextual Resonance Query:', enhancedState.contextualResonance?.query);
  console.log('- Relevant Anchors:', enhancedState.contextualResonance?.relevantAnchors);
  console.log('- Relevant Seeds:', enhancedState.contextualResonance?.relevantSeeds);
  
  console.log('\nRAG capabilities test completed successfully!');
}

// Run the test
testRagCapabilities().catch(error => {
  console.error('Error during RAG capabilities test:', error);
});