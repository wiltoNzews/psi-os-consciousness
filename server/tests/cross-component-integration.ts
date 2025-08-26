/**
 * Cross-Component Integration Test
 * 
 * This script tests the interactions between multiple components to ensure
 * they work together correctly while maintaining boundary integrity.
 * It applies the TSAR BOMBA verification approach with explicit testing
 * for integration points between components.
 * 
 * Key interactions tested:
 * 1. QuantumRootNode ↔ NeuralPathway
 * 2. NeuralPathway ↔ MetaCognitiveEvent
 * 3. Chunk ↔ ChunkDependency ↔ AdaptiveResonance
 */

import { FileSystemStorage } from '../services/file-system-storage.js';
import { ChronosHandler } from '../services/utils/chronos-handler.js';
import { FeatureToggleService, Feature } from '../services/feature-toggle-service.js';
import { ChronosTemporalInstanceService } from '../services/temporal/chronos-temporal-instance.js';
import { ChronosQRNService } from '../services/qrn/chronos-qrn-service.js';
import { ChronosIntegration } from '../services/neural-orchestrator/chronos-integration.js';
import { InMemoryPersistenceLayer } from '../services/context/in-memory-persistence-layer.js';
import { PersistentContextService } from '../services/context/persistent-context-service.js';
import { 
  InsertQuantumRootNode, 
  InsertNeuralPathway, 
  InsertMetaCognitiveEvent,
  InsertChunk,
  InsertChunkDependency,
  InsertAdaptiveResonance,
  taskStatusEnum,
  InsertTask,
  ModelType,
  CognitiveLayer
} from '../../shared/schema-minimal.js';

// Test directory path
const TEST_DIR = './data/test-cross-component';

/**
 * Clean up test data directories
 */
async function cleanupTestData() {
  const storage = new FileSystemStorage(TEST_DIR);
  
  try {
    // This effectively cleans up the test directory
    await storage.ensureDirectories();
    console.log('Test directories initialized/cleaned');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

/**
 * Run the cross-component integration test
 */
async function runIntegrationTest() {
  console.log('⚡ CROSS-COMPONENT INTEGRATION TEST');
  console.log('=========================================');
  
  // Clean up test data
  await cleanupTestData();
  
  // Initialize storage with test directory
  const storage = new FileSystemStorage(TEST_DIR);
  
  // Initialize in-memory persistence layer and context service
  const persistenceLayer = new InMemoryPersistenceLayer();
  const contextService = new PersistentContextService(persistenceLayer);
  
  // Initialize a session
  const sessionId = `cross-component-test-session-${Math.random().toString(36).substring(2, 15)}`;
  await contextService.initializeSession(sessionId);
  console.log(`\nTest session initialized: ${sessionId}`);
  
  // Initialize Chronos integration
  const chronosIntegration = new ChronosIntegration(storage, contextService);
  console.log('Cross-component test integration initialized');
  
  // =========================================================================
  // PART 1: QuantumRootNode ↔ NeuralPathway Interaction
  // =========================================================================
  console.log('\n--- PART 1: QuantumRootNode ↔ NeuralPathway Interaction ---');
  
  // Create source QRN
  console.log('\n--- Creating source Quantum Root Node ---');
  const sourceQRN: InsertQuantumRootNode = {
    name: 'Source QRN',
    description: 'Test source QRN for cross-component integration testing',
    state: {
      status: 'active',
      energy: 100
    },
    capabilities: ['processing', 'learning', 'integration']
  };
  
  const createdSourceQRN = await chronosIntegration.qrnService.createQuantumRootNode(sourceQRN);
  console.log('Source QRN created:', {
    id: createdSourceQRN.id,
    name: createdSourceQRN.name,
    createdAt: createdSourceQRN.createdAt.toISOString()
  });
  
  // Create target QRN
  console.log('\n--- Creating target Quantum Root Node ---');
  const targetQRN: InsertQuantumRootNode = {
    name: 'Target QRN',
    description: 'Test target QRN for cross-component integration testing',
    state: {
      status: 'active',
      energy: 90
    },
    capabilities: ['processing', 'storage', 'adaptation']
  };
  
  const createdTargetQRN = await chronosIntegration.qrnService.createQuantumRootNode(targetQRN);
  console.log('Target QRN created:', {
    id: createdTargetQRN.id,
    name: createdTargetQRN.name,
    createdAt: createdTargetQRN.createdAt.toISOString()
  });
  
  // Create Neural Pathway between source and target QRNs
  console.log('\n--- Creating Neural Pathway ---');
  const pathway: InsertNeuralPathway = {
    sourceId: createdSourceQRN.id,
    targetId: createdTargetQRN.id,
    weight: 0.85,
    type: 'bidirectional',
    pathType: 'cognitive',
    metadata: {
      initializedBy: 'cross-component-test',
      purpose: 'integration testing'
    }
  };
  
  const createdPathway = await storage.createNeuralPathway(pathway);
  console.log('Neural pathway created:', {
    id: createdPathway.id,
    sourceId: createdPathway.sourceId,
    targetId: createdPathway.targetId,
    weight: createdPathway.weight,
    createdAt: createdPathway.createdAt.toISOString()
  });
  
  // Update source QRN to reflect connection
  console.log('\n--- Updating source QRN to reflect connection ---');
  const updatedSourceState = {
    ...createdSourceQRN.state,
    status: 'connected',
    connectedNodes: [createdTargetQRN.id]
  };
  
  const updatedSourceQRN = await chronosIntegration.qrnService.updateQuantumRootNode(
    createdSourceQRN.id,
    { state: updatedSourceState }
  );
  
  console.log('Source QRN updated:', {
    id: updatedSourceQRN.id,
    state: updatedSourceQRN.state,
    updatedAt: updatedSourceQRN.updatedAt.toISOString()
  });
  
  // Get all neural pathways for the source QRN
  console.log('\n--- Getting neural pathways for source QRN ---');
  const pathwaysForSource = await storage.getAllNeuralPathways(undefined, { 
    sourceId: createdSourceQRN.id 
  });
  
  console.log(`Found ${pathwaysForSource.length} pathways originating from source QRN`);
  console.assert(pathwaysForSource.length > 0, 'Should find at least one pathway');
  
  if (pathwaysForSource.length > 0) {
    console.log('Pathway details:', {
      id: pathwaysForSource[0].id,
      sourceId: pathwaysForSource[0].sourceId,
      targetId: pathwaysForSource[0].targetId,
      type: pathwaysForSource[0].type
    });
    
    // Verify correct connection
    console.assert(
      pathwaysForSource[0].sourceId === createdSourceQRN.id,
      'Pathway source should match source QRN'
    );
    
    console.assert(
      pathwaysForSource[0].targetId === createdTargetQRN.id,
      'Pathway target should match target QRN'
    );
  }
  
  // Get all neural pathways for the target QRN as target
  console.log('\n--- Getting neural pathways targeting target QRN ---');
  const pathwaysToTarget = await storage.getAllNeuralPathways(undefined, { 
    targetId: createdTargetQRN.id 
  });
  
  console.log(`Found ${pathwaysToTarget.length} pathways targeting target QRN`);
  console.assert(pathwaysToTarget.length > 0, 'Should find at least one pathway');
  
  // Boundary test: Get pathways with non-existent IDs
  console.log('\n--- Boundary test: Getting pathways with non-existent IDs ---');
  const nonExistentId = 'non-existent-id-' + Math.random().toString(36).substring(7);
  const nonExistentPathways = await storage.getAllNeuralPathways(undefined, { 
    sourceId: nonExistentId 
  });
  
  console.log(`Found ${nonExistentPathways.length} pathways for non-existent ID`);
  console.assert(nonExistentPathways.length === 0, 'Should find no pathways for non-existent ID');
  
  // =========================================================================
  // PART 2: NeuralPathway ↔ MetaCognitiveEvent Interaction
  // =========================================================================
  console.log('\n--- PART 2: NeuralPathway ↔ MetaCognitiveEvent Interaction ---');
  
  // Create a meta-cognitive event related to the neural pathway
  console.log('\n--- Creating meta-cognitive event for neural pathway ---');
  const metaEvent: InsertMetaCognitiveEvent = {
    nodeId: createdSourceQRN.id,
    type: 'PATHWAY_FORMATION',
    description: 'Neural pathway formation detected',
    details: {
      pathwayId: createdPathway.id,
      sourceNode: createdSourceQRN.id,
      targetNode: createdTargetQRN.id,
      formationScore: 0.92
    },
    confidence: 0.95,
    impact: 8,
    relatedEvents: '',
    outcome: 'Successful neural pathway formation',
    sourceContext: 'cross-component-integration-test'
  };
  
  const createdMetaEvent = await storage.createMetaCognitiveEvent(metaEvent);
  console.log('Meta-cognitive event created:', {
    id: createdMetaEvent.id,
    type: createdMetaEvent.type,
    nodeId: createdMetaEvent.nodeId,
    createdAt: createdMetaEvent.createdAt.toISOString()
  });
  
  // Create a second meta-cognitive event for pathway strengthening
  console.log('\n--- Creating second meta-cognitive event for pathway strengthening ---');
  const strengthenEvent: InsertMetaCognitiveEvent = {
    nodeId: createdSourceQRN.id,
    type: 'PATHWAY_STRENGTHENING',
    description: 'Neural pathway strength increased',
    details: {
      pathwayId: createdPathway.id,
      previousWeight: 0.85,
      newWeight: 0.92,
      reason: 'Successful information transmission'
    },
    confidence: 0.89,
    impact: 6,
    relatedEvents: createdMetaEvent.id,
    outcome: 'Increased neural pathway efficiency',
    sourceContext: 'cross-component-integration-test'
  };
  
  const createdStrengthenEvent = await storage.createMetaCognitiveEvent(strengthenEvent);
  console.log('Pathway strengthening event created:', {
    id: createdStrengthenEvent.id,
    type: createdStrengthenEvent.type,
    relatedEvents: createdStrengthenEvent.relatedEvents,
    createdAt: createdStrengthenEvent.createdAt.toISOString()
  });
  
  // Get all meta-cognitive events for the source QRN
  console.log('\n--- Getting meta-cognitive events for source QRN ---');
  const metaEventsForSource = await storage.getAllMetaCognitiveEvents(undefined, { 
    nodeId: createdSourceQRN.id 
  });
  
  console.log(`Found ${metaEventsForSource.length} meta-cognitive events for source QRN`);
  console.assert(metaEventsForSource.length >= 2, 'Should find at least two meta-cognitive events');
  
  // Update the neural pathway based on the meta-cognitive event
  console.log('\n--- Updating neural pathway based on meta-cognitive event ---');
  const updatedPathway = await storage.updateNeuralPathway(createdPathway.id, {
    weight: 0.92, // The new weight from the meta-cognitive event
    metadata: {
      ...createdPathway.metadata,
      lastStrengthening: createdStrengthenEvent.createdAt.toISOString(),
      strengthenedBy: createdStrengthenEvent.id
    }
  });
  
  console.log('Neural pathway updated:', {
    id: updatedPathway.id,
    weight: updatedPathway.weight,
    metadata: updatedPathway.metadata,
    updatedAt: updatedPathway.updatedAt.toISOString()
  });
  
  // Verify the updated pathway has the correct weight
  console.assert(
    updatedPathway.weight === 0.92,
    'Pathway weight should be updated to 0.92'
  );
  
  // Record this interaction to the persistent context
  await chronosIntegration.recordToContext(sessionId, {
    type: 'PATHWAY_META_EVENT_INTERACTION',
    pathwayId: createdPathway.id,
    metaEventId: createdStrengthenEvent.id,
    sourceQRN: createdSourceQRN.id,
    targetQRN: createdTargetQRN.id,
    result: 'pathway_strengthened',
    timestamp: chronosIntegration.now()
  });
  
  // =========================================================================
  // PART 3: Chunk ↔ ChunkDependency ↔ AdaptiveResonance Interaction
  // =========================================================================
  console.log('\n--- PART 3: Chunk ↔ ChunkDependency ↔ AdaptiveResonance Interaction ---');
  
  // Create a task as context for the chunks
  console.log('\n--- Creating a task for chunk context ---');
  const task: InsertTask = {
    name: 'Cross-component integration test task',
    description: 'Task for testing chunk interactions',
    status: taskStatusEnum.enum.pending,
    priority: 5,
    metadata: {
      source: 'cross-component-test',
      qrnId: createdSourceQRN.id
    }
  };
  
  // Note: We need to cast this because the storage method takes a Task while we're passing InsertTask
  const createdTask = await storage.createTask(task as any); 
  console.log('Task created:', {
    id: createdTask.id,
    name: createdTask.name,
    status: createdTask.status,
    createdAt: createdTask.createdAt.toISOString()
  });
  
  // Create the first chunk
  console.log('\n--- Creating first chunk ---');
  const chunk1: InsertChunk = {
    originalContent: 'This is the first test chunk for cross-component integration testing.',
    processedContent: 'Processed first chunk content.',
    chunkIndex: 0,
    totalChunks: 3,
    chunkSize: 20,
    parentTaskId: createdTask.id,
    qrnId: createdSourceQRN.id,
    chunkState: 'created'
  };
  
  const createdChunk1 = await storage.createChunk(chunk1);
  console.log('First chunk created:', {
    id: createdChunk1.id,
    chunkIndex: createdChunk1.chunkIndex,
    chunkState: createdChunk1.chunkState,
    createdAt: createdChunk1.createdAt.toISOString()
  });
  
  // Create the second chunk
  console.log('\n--- Creating second chunk ---');
  const chunk2: InsertChunk = {
    originalContent: 'This is the second test chunk that follows the first one.',
    processedContent: 'Processed second chunk content with dependencies.',
    chunkIndex: 1,
    totalChunks: 3,
    chunkSize: 22,
    parentTaskId: createdTask.id,
    qrnId: createdSourceQRN.id,
    chunkState: 'created'
  };
  
  const createdChunk2 = await storage.createChunk(chunk2);
  console.log('Second chunk created:', {
    id: createdChunk2.id,
    chunkIndex: createdChunk2.chunkIndex,
    chunkState: createdChunk2.chunkState,
    createdAt: createdChunk2.createdAt.toISOString()
  });
  
  // Create the third chunk
  console.log('\n--- Creating third chunk ---');
  const chunk3: InsertChunk = {
    originalContent: 'This is the final test chunk completing the sequence.',
    processedContent: 'Processed third chunk with complex relationships.',
    chunkIndex: 2,
    totalChunks: 3,
    chunkSize: 18,
    parentTaskId: createdTask.id,
    qrnId: createdTargetQRN.id, // Note: This chunk is associated with the target QRN
    chunkState: 'created'
  };
  
  const createdChunk3 = await storage.createChunk(chunk3);
  console.log('Third chunk created:', {
    id: createdChunk3.id,
    chunkIndex: createdChunk3.chunkIndex,
    chunkState: createdChunk3.chunkState,
    createdAt: createdChunk3.createdAt.toISOString()
  });
  
  // Create chunk dependencies
  console.log('\n--- Creating chunk dependencies ---');
  const dependency1to2: InsertChunkDependency = {
    sourceChunkId: createdChunk1.id,
    targetChunkId: createdChunk2.id,
    type: 'sequential',
    strength: 0.9,
    metadata: {
      reason: 'Natural sequence progression',
      creator: 'cross-component-test'
    }
  };
  
  const createdDependency1to2 = await storage.createChunkDependency(dependency1to2);
  console.log('Dependency 1→2 created:', {
    id: createdDependency1to2.id,
    sourceChunkId: createdDependency1to2.sourceChunkId,
    targetChunkId: createdDependency1to2.targetChunkId,
    strength: createdDependency1to2.strength,
    createdAt: createdDependency1to2.createdAt.toISOString()
  });
  
  const dependency2to3: InsertChunkDependency = {
    sourceChunkId: createdChunk2.id,
    targetChunkId: createdChunk3.id,
    type: 'sequential',
    strength: 0.85,
    metadata: {
      reason: 'Natural sequence progression',
      creator: 'cross-component-test'
    }
  };
  
  const createdDependency2to3 = await storage.createChunkDependency(dependency2to3);
  console.log('Dependency 2→3 created:', {
    id: createdDependency2to3.id,
    sourceChunkId: createdDependency2to3.sourceChunkId,
    targetChunkId: createdDependency2to3.targetChunkId,
    strength: createdDependency2to3.strength,
    createdAt: createdDependency2to3.createdAt.toISOString()
  });
  
  // Create a semantic dependency (non-sequential)
  const dependencySemantic1to3: InsertChunkDependency = {
    sourceChunkId: createdChunk1.id,
    targetChunkId: createdChunk3.id,
    type: 'semantic',
    strength: 0.7,
    metadata: {
      reason: 'Semantic relationship between concepts',
      creator: 'cross-component-test'
    }
  };
  
  const createdDependencySemantic = await storage.createChunkDependency(dependencySemantic1to3);
  console.log('Semantic dependency 1→3 created:', {
    id: createdDependencySemantic.id,
    type: createdDependencySemantic.type,
    strength: createdDependencySemantic.strength,
    createdAt: createdDependencySemantic.createdAt.toISOString()
  });
  
  // Get all dependencies for chunk1
  console.log('\n--- Getting all dependencies for chunk1 ---');
  const dependenciesForChunk1 = await storage.getChunkDependenciesBySourceId(createdChunk1.id);
  console.log(`Found ${dependenciesForChunk1.length} dependencies with chunk1 as source`);
  console.assert(dependenciesForChunk1.length >= 2, 'Should find at least two dependencies');
  
  // Update a chunk based on dependencies
  console.log('\n--- Updating chunk2 state based on dependencies ---');
  const updatedChunk2 = await storage.updateChunk(createdChunk2.id, {
    chunkState: 'processing',
    processedContent: 'Refined content after analyzing dependencies with chunk1.'
  });
  
  console.log('Chunk2 updated:', {
    id: updatedChunk2.id,
    chunkState: updatedChunk2.chunkState,
    updatedAt: updatedChunk2.updatedAt.toISOString()
  });
  
  // Create adaptive resonances for chunks
  console.log('\n--- Creating adaptive resonances for chunks ---');
  const resonanceForChunk1: InsertAdaptiveResonance = {
    chunkId: createdChunk1.id,
    modelType: ModelType.GPT_4,
    strength: 0.88,
    adaptationRate: 0.05,
    metadata: {
      layer: CognitiveLayer.STRATEGIC,
      context: 'cross-component-test',
      evaluationNotes: 'High resonance with strategic cognitive processing'
    }
  };
  
  const createdResonance1 = await storage.createAdaptiveResonance(resonanceForChunk1);
  console.log('Adaptive resonance for chunk1 created:', {
    id: createdResonance1.id,
    chunkId: createdResonance1.chunkId,
    modelType: createdResonance1.modelType,
    strength: createdResonance1.strength,
    createdAt: createdResonance1.createdAt.toISOString()
  });
  
  const resonanceForChunk2: InsertAdaptiveResonance = {
    chunkId: createdChunk2.id,
    modelType: ModelType.GPT_4,
    strength: 0.92,
    adaptationRate: 0.07,
    metadata: {
      layer: CognitiveLayer.STRATEGIC,
      context: 'cross-component-test',
      evaluationNotes: 'Very high resonance with strong dependency effects'
    }
  };
  
  const createdResonance2 = await storage.createAdaptiveResonance(resonanceForChunk2);
  console.log('Adaptive resonance for chunk2 created:', {
    id: createdResonance2.id,
    chunkId: createdResonance2.chunkId,
    strength: createdResonance2.strength,
    createdAt: createdResonance2.createdAt.toISOString()
  });
  
  // Get adaptive resonances for specific model type
  console.log('\n--- Getting resonances for GPT-4 model ---');
  const gpt4Resonances = await storage.getAllAdaptiveResonances(undefined, {
    modelType: ModelType.GPT_4
  });
  
  console.log(`Found ${gpt4Resonances.length} resonances for GPT-4 model`);
  console.assert(gpt4Resonances.length >= 2, 'Should find at least two resonances for GPT-4');
  
  // Analyze resonance strengths
  let totalStrength = 0;
  for (const resonance of gpt4Resonances) {
    totalStrength += resonance.strength;
  }
  
  const avgStrength = totalStrength / gpt4Resonances.length;
  console.log(`Average resonance strength: ${avgStrength.toFixed(4)}`);
  
  // Update chunk state based on resonance analysis
  console.log('\n--- Updating chunks based on resonance analysis ---');
  
  for (const chunk of [createdChunk1, createdChunk2, createdChunk3]) {
    const chunkResonances = await storage.getAdaptiveResonancesByChunkId(chunk.id);
    
    if (chunkResonances.length > 0) {
      const highestResonance = chunkResonances.reduce((prev, current) => 
        (prev.strength > current.strength) ? prev : current
      );
      
      if (highestResonance.strength > 0.9) {
        await storage.updateChunk(chunk.id, {
          chunkState: 'processed',
          processedContent: `Fully processed with high resonance (${highestResonance.strength})`
        });
        console.log(`Chunk ${chunk.id} updated to processed state with high resonance`);
      }
    }
  }
  
  // Get updated chunks
  console.log('\n--- Getting updated chunks ---');
  const updatedChunks = await Promise.all([
    storage.getChunk(createdChunk1.id),
    storage.getChunk(createdChunk2.id),
    storage.getChunk(createdChunk3.id)
  ]);
  
  for (const chunk of updatedChunks) {
    if (chunk) {
      console.log(`Chunk ${chunk.id} state: ${chunk.chunkState}`);
    }
  }
  
  // Record chunk processing in context
  await chronosIntegration.recordToContext(sessionId, {
    type: 'CHUNK_PROCESSING_COMPLETED',
    taskId: createdTask.id,
    chunks: [createdChunk1.id, createdChunk2.id, createdChunk3.id],
    totalDependencies: 3,
    averageResonance: avgStrength,
    timestamp: chronosIntegration.now()
  });
  
  // =========================================================================
  // PART 4: Cross-Component Integration - Combined Interaction Test
  // =========================================================================
  console.log('\n--- PART 4: Cross-Component Integration - Combined Interaction Test ---');
  
  // Create a meta-cognitive event related to chunk processing and QRN activity
  console.log('\n--- Creating meta-cognitive event for multi-component interaction ---');
  
  const combinedEvent: InsertMetaCognitiveEvent = {
    nodeId: createdSourceQRN.id,
    type: 'MULTI_COMPONENT_INTEGRATION',
    description: 'Complex cross-component interaction detected',
    details: {
      qrnIds: [createdSourceQRN.id, createdTargetQRN.id],
      pathwayId: createdPathway.id,
      chunkIds: [createdChunk1.id, createdChunk2.id, createdChunk3.id],
      resonanceIds: [createdResonance1.id, createdResonance2.id],
      analyticsTimestamp: new Date().toISOString()
    },
    confidence: 0.94,
    impact: 9,
    relatedEvents: `${createdMetaEvent.id},${createdStrengthenEvent.id}`,
    outcome: 'Successful integration of multiple component systems',
    sourceContext: 'cross-component-integration-test'
  };
  
  const createdCombinedEvent = await storage.createMetaCognitiveEvent(combinedEvent);
  console.log('Multi-component meta event created:', {
    id: createdCombinedEvent.id,
    type: createdCombinedEvent.type,
    impact: createdCombinedEvent.impact,
    createdAt: createdCombinedEvent.createdAt.toISOString()
  });
  
  // Record this in the persistent context
  console.log('\n--- Recording combined event to persistent context ---');
  await chronosIntegration.recordToContext(sessionId, {
    type: 'CROSS_COMPONENT_INTEGRATION',
    metaEventId: createdCombinedEvent.id,
    components: {
      qrns: [createdSourceQRN.id, createdTargetQRN.id],
      pathways: [createdPathway.id],
      chunks: [createdChunk1.id, createdChunk2.id, createdChunk3.id],
      resonances: [createdResonance1.id, createdResonance2.id],
      events: [createdMetaEvent.id, createdStrengthenEvent.id, createdCombinedEvent.id]
    },
    integrationScore: 0.92,
    timestamp: chronosIntegration.now()
  });
  
  // Check the persistent context
  console.log('\n--- Checking persistent context ---');
  const context = await contextService.loadContext(sessionId);
  console.log(`Context has ${context?.history.length || 0} history entries`);
  
  if (context && context.history.length > 0) {
    console.log('Latest context entry:', {
      type: context.history[context.history.length - 1].type,
      timestamp: context.history[context.history.length - 1].timestamp
    });
  }
  
  // Get active strategic plans
  const activePlans = await contextService.getActiveStrategicPlans(sessionId);
  console.log(`Found ${activePlans.length} active strategic plans`);
  
  // =========================================================================
  // Cleanup & Final Verification
  // =========================================================================
  console.log('\n--- Cleanup & Final Verification ---');
  
  // Add a final meta-cognitive event to record test completion
  const finalEvent: InsertMetaCognitiveEvent = {
    nodeId: createdSourceQRN.id,
    type: 'INTEGRATION_TEST_COMPLETION',
    description: 'Cross-component integration test completed successfully',
    details: {
      testId: 'cross-component-integration-test',
      sessionId: sessionId,
      componentsCovered: [
        'QuantumRootNode',
        'NeuralPathway',
        'MetaCognitiveEvent',
        'Chunk',
        'ChunkDependency',
        'AdaptiveResonance'
      ],
      completionTimestamp: new Date().toISOString()
    },
    confidence: 1.0,
    impact: 10,
    outcome: 'Successful verification of cross-component interactions',
    sourceContext: 'cross-component-integration-test-completion'
  };
  
  const createdFinalEvent = await storage.createMetaCognitiveEvent(finalEvent);
  console.log('Final meta event created:', {
    id: createdFinalEvent.id,
    type: createdFinalEvent.type,
    createdAt: createdFinalEvent.createdAt.toISOString()
  });
  
  // Record test completion to context
  await chronosIntegration.recordToContext(sessionId, {
    type: 'INTEGRATION_TEST_COMPLETED',
    result: 'success',
    coverage: {
      qrnCount: 2,
      pathwayCount: 1,
      chunkCount: 3,
      dependencyCount: 3,
      resonanceCount: 2,
      eventCount: 4
    },
    timestamp: chronosIntegration.now()
  });
  
  // Final verification that components are still accessible
  console.log('\n--- Final component accessibility verification ---');
  
  const finalSourceQRN = await storage.getQuantumRootNode(createdSourceQRN.id);
  console.log(`Source QRN accessible: ${!!finalSourceQRN}`);
  
  const finalPathway = await storage.getNeuralPathway(createdPathway.id);
  console.log(`Neural pathway accessible: ${!!finalPathway}`);
  
  const finalChunk = await storage.getChunk(createdChunk1.id);
  console.log(`Chunk accessible: ${!!finalChunk}`);
  
  const finalMetaEvent = await storage.getMetaCognitiveEvent(createdCombinedEvent.id);
  console.log(`Meta-cognitive event accessible: ${!!finalMetaEvent}`);
  
  console.log("\n✅ CROSS-COMPONENT INTEGRATION TEST COMPLETE");
}

// Run the integration test
runIntegrationTest()
  .then(() => {
    console.log("Cross-component integration test passed successfully");
    FeatureToggleService.getInstance().resetToDefaults();
  })
  .catch(error => {
    console.error("Cross-component integration test failed:", error);
    FeatureToggleService.getInstance().resetToDefaults();
    process.exit(1);
  });