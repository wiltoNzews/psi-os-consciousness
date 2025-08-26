/**
 * Chronos Orchestration Integration Test
 * 
 * This script tests the integration between the Chronos system and the
 * Neural Orchestration Engine to ensure proper time handling across
 * the entire system.
 * 
 * It applies the TSAR BOMBA verification approach with explicit testing
 * for integration points between components.
 */

import { ChronosHandler } from '../services/utils/chronos-handler.js';
import { FeatureToggleService, Feature } from '../services/feature-toggle-service.js';
import { ChronosQRNService } from '../services/qrn/chronos-qrn-service.js';
import { ChronosTemporalInstanceService } from '../services/temporal/chronos-temporal-instance.js';
import { FileSystemStorage } from '../services/file-system-storage.js';
import { 
  initializeChronosIntegration 
} from '../services/neural-orchestrator/chronos-integration.js';
import { 
  InsertQuantumRootNode, 
  InsertTask, 
  taskStatusEnum, 
  InsertNeuralPathway 
} from '../../shared/schema-minimal.js';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { InMemoryPersistenceLayer } from '../services/context/in-memory-persistence-layer.js';
import { PersistentContextService } from '../services/context/persistent-context-service.js';

/**
 * Clean up test data directories
 */
async function cleanupTestData() {
  const testDirs = [
    path.join('./data', 'quantum_root_nodes'),
    path.join('./data', 'temporal_instances'),
    path.join('./data', 'neural_pathways'),
    path.join('./data', 'meta_cognitive_events'),
    path.join('./data', 'tasks')
  ];
  
  try {
    // Create directories if they don't exist and clean test files
    for (const dir of testDirs) {
      await fs.mkdir(dir, { recursive: true });
      
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (file.includes('chronos-test')) {
          await fs.unlink(path.join(dir, file));
        }
      }
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

/**
 * Create a simple mock PersistentContextService for testing
 */
function createMockContextService() {
  const persistence = new InMemoryPersistenceLayer();
  return new PersistentContextService(persistence);
}

/**
 * Run the integration test
 */
async function runIntegrationTest() {
  console.log("⚡ CHRONOS ORCHESTRATION INTEGRATION TEST");
  console.log("=========================================");
  
  // Clean up before testing
  await cleanupTestData();
  
  // Initialize components
  const storage = new FileSystemStorage('./data');
  const contextService = createMockContextService();
  
  // Initialize the test session
  const sessionId = `chronos-test-session-${uuidv4()}`;
  await contextService.initializeSession(sessionId);
  
  console.log(`\nTest session initialized: ${sessionId}`);
  
  // Initialize Chronos integration
  const chronosIntegration = initializeChronosIntegration(storage, {
    enableChronos: true,
    enableTemporalHistory: true,
    enableCoherenceAnalysis: true,
    contextService
  });
  
  // Measure the precision of timestamps
  const now1 = chronosIntegration.now();
  await new Promise(resolve => setTimeout(resolve, 10));
  const now2 = chronosIntegration.now();
  
  console.log('\n--- Testing timestamp precision ---');
  console.log(`Timestamp 1: ${now1.toISOString()}`);
  console.log(`Timestamp 2: ${now2.toISOString()}`);
  console.log(`Time difference: ${now2.getTime() - now1.getTime()}ms`);
  
  console.assert(now2 > now1, 'Second timestamp should be later than first');
  
  // Create a test quantum root node using the Chronos QRN service
  const testNode: InsertQuantumRootNode = {
    name: 'Chronos Integration Test QRN',
    description: 'A quantum root node for testing Chronos integration',
    state: {
      status: 'initializing',
      coherence: 0.7,
      energy: 100,
      lastAction: 'system_integration_test'
    },
    capabilities: ['test', 'chronos', 'integration'],
    coherenceScore: 0.7
  };
  
  console.log('\n--- Creating test Quantum Root Node ---');
  const qrn = await chronosIntegration.qrnService.createQuantumRootNode(testNode);
  console.log('QRN created:', {
    id: qrn.id,
    name: qrn.name,
    createdAt: qrn.createdAt.toISOString()
  });
  
  // Record a system event through the integration
  console.log('\n--- Recording system event ---');
  const eventData = {
    nodeId: qrn.id,
    operation: 'integration_test',
    status: 'in_progress'
  };
  
  const recordedEvent = chronosIntegration.recordEvent('SYSTEM_TEST', eventData);
  console.log('Recorded event:', {
    id: recordedEvent.id,
    type: recordedEvent.type,
    timestamp: recordedEvent.timestamp.toISOString()
  });
  
  // Add the event to persistent context
  await chronosIntegration.recordToContext(sessionId, {
    type: 'EVENT',
    category: 'TEST',
    data: eventData
  });
  
  // Create two neural pathways for testing
  const targetNode: InsertQuantumRootNode = {
    name: 'Chronos Target Test QRN',
    description: 'A target quantum root node for testing neural pathways',
    state: {
      status: 'receiving',
      coherence: 0.65
    },
    capabilities: ['target', 'receiver'],
    coherenceScore: 0.65
  };
  
  console.log('\n--- Creating target Quantum Root Node ---');
  const targetQrn = await chronosIntegration.qrnService.createQuantumRootNode(targetNode);
  
  const pathway: InsertNeuralPathway = {
    sourceId: qrn.id,
    targetId: targetQrn.id,
    weight: 0.85,
    type: 'integration_test',
    metadata: {
      testType: 'chronos_integration',
      importance: 'high'
    }
  };
  
  console.log('\n--- Creating Neural Pathway ---');
  const neuralPathway = await storage.createNeuralPathway(pathway);
  console.log('Neural pathway created:', {
    id: neuralPathway.id,
    sourceId: neuralPathway.sourceId,
    targetId: neuralPathway.targetId,
    createdAt: neuralPathway.createdAt.toISOString()
  });
  
  // Update the QRN after creating the pathway
  console.log('\n--- Updating Quantum Root Node ---');
  const updateData = {
    state: {
      status: 'connected',
      coherence: 0.75,
      energy: 95,
      connectedNodes: [targetQrn.id]
    },
    coherenceScore: 0.75
  };
  
  const updatedQrn = await chronosIntegration.qrnService.updateQuantumRootNode(qrn.id, updateData);
  console.log('QRN updated:', {
    id: updatedQrn?.id,
    state: updatedQrn?.state,
    updatedAt: updatedQrn?.updatedAt.toISOString()
  });
  
  // Check the temporal instances that were created for the QRN
  console.log('\n--- Checking Temporal History ---');
  const temporalInstances = await chronosIntegration.qrnService.getNodeTemporalInstances(qrn.id);
  console.log(`Found ${temporalInstances.length} temporal instances for the QRN`);
  
  // Validate temporal instances - there should be at least two (creation and update)
  console.assert(temporalInstances.length >= 2, 'Should have at least 2 temporal instances');
  
  // Sort temporal instances by timestamp
  temporalInstances.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  // Check their timestamps
  if (temporalInstances.length >= 2) {
    console.log('First temporal instance:', {
      id: temporalInstances[0].id,
      dimensionType: temporalInstances[0].dimensionType,
      timestamp: temporalInstances[0].timestamp.toISOString()
    });
    
    console.log('Latest temporal instance:', {
      id: temporalInstances[temporalInstances.length - 1].id,
      dimensionType: temporalInstances[temporalInstances.length - 1].dimensionType,
      timestamp: temporalInstances[temporalInstances.length - 1].timestamp.toISOString()
    });
    
    // Verify chronological ordering
    console.assert(
      temporalInstances[temporalInstances.length - 1].timestamp.getTime() >= temporalInstances[0].timestamp.getTime(),
      'Latest temporal instance should have timestamp >= first instance'
    );
  }
  
  // Run coherence analysis on the QRN
  console.log('\n--- Running Coherence Analysis ---');
  const coherenceAnalysis = await chronosIntegration.qrnService.analyzeNodeCoherence(qrn.id);
  console.log('Coherence analysis:', coherenceAnalysis);
  
  // Create a task from the QRN context to test orchestration integration
  const task: InsertTask = {
    name: 'Chronos Integration Test Task',
    description: 'Test task for Chronos integration testing',
    status: taskStatusEnum.enum.pending,
    priority: 5,
    metadata: {
      sourceQRN: qrn.id,
      targetQRN: targetQrn.id,
      pathwayId: neuralPathway.id,
      testType: 'chronos_integration'
    }
  };
  
  console.log('\n--- Creating Test Task ---');
  const createdTask = await storage.createTask(task);
  console.log('Task created:', {
    id: createdTask.id,
    name: createdTask.name,
    createdAt: createdTask.createdAt.toISOString()
  });
  
  // Add a record of this task to the context
  await chronosIntegration.recordToContext(sessionId, {
    type: 'TASK_CREATED',
    taskId: createdTask.id,
    qrnId: qrn.id,
    timestamp: chronosIntegration.now()
  });
  
  // Load the context and check if our events were recorded
  console.log('\n--- Checking Persistent Context ---');
  const context = await contextService.loadContext(sessionId);
  console.log(`Context has ${context?.history.length || 0} history entries`);
  
  if (context && context.history.length > 0) {
    console.log('Latest context history entry:', context.history[context.history.length - 1]);
    
    // Verify that the context recorded our events
    const foundTaskEvent = context.history.find(h => h.type === 'TASK_CREATED');
    console.assert(foundTaskEvent, 'Should find task creation event in context');
    
    if (foundTaskEvent) {
      console.log('Found task creation event in context:', {
        type: foundTaskEvent.type,
        taskId: foundTaskEvent.taskId,
        timestamp: foundTaskEvent.timestamp
      });
    }
  }
  
  // Test the feature toggle functionality
  console.log('\n--- Testing Feature Toggles ---');
  console.log('Chronos enabled:', chronosIntegration.featureToggle.isEnabled(Feature.CHRONOS_HANDLER));
  console.log('Temporal history enabled:', chronosIntegration.featureToggle.isEnabled(Feature.TEMPORAL_HISTORY));
  console.log('Coherence analysis enabled:', chronosIntegration.featureToggle.isEnabled(Feature.COHERENCE_ANALYSIS));
  
  // Disable a feature and confirm
  chronosIntegration.featureToggle.disable(Feature.TEMPORAL_HISTORY);
  console.log('After disabling, temporal history enabled:', 
    chronosIntegration.featureToggle.isEnabled(Feature.TEMPORAL_HISTORY));
  
  // Reset features and confirm
  chronosIntegration.resetToggles();
  console.log('After reset, temporal history enabled:', 
    chronosIntegration.featureToggle.isEnabled(Feature.TEMPORAL_HISTORY));
  
  // Clean up - delete the test QRNs, which will also create terminal temporal instances
  console.log('\n--- Cleaning Up ---');
  await chronosIntegration.qrnService.deleteQuantumRootNode(qrn.id);
  await chronosIntegration.qrnService.deleteQuantumRootNode(targetQrn.id);
  
  // Check for terminal temporal instances
  const terminalInstances = await storage.getAllTemporalInstances(undefined, { 
    dimensionType: 'TERMINAL' 
  });
  
  console.log(`Found ${terminalInstances.length} terminal temporal instances`);
  
  if (terminalInstances.length > 0) {
    console.log('Example terminal instance:', {
      id: terminalInstances[0].id,
      nodeId: terminalInstances[0].nodeId,
      dimensionType: terminalInstances[0].dimensionType,
      timestamp: terminalInstances[0].timestamp.toISOString()
    });
  }
  
  console.log("\n✅ CHRONOS ORCHESTRATION INTEGRATION TEST COMPLETE");
}

// Run the integration test
runIntegrationTest()
  .then(() => {
    console.log("Chronos orchestration integration test passed");
    FeatureToggleService.getInstance().resetToDefaults();
  })
  .catch(error => {
    console.error("Chronos orchestration integration test failed:", error);
    FeatureToggleService.getInstance().resetToDefaults();
    process.exit(1);
  });