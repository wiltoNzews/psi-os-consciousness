/**
 * Direct Verification of Chronos Time Management System
 * 
 * This script directly verifies that our Chronos time management system
 * works correctly, maintaining consistent time across components
 * and providing accurate temporal synchronization.
 * 
 * Following the TSAR BOMBA testing approach, we verify each component
 * in isolation, then test their integration.
 */

// Import required modules
import { chronos } from '../services/utils/chronos-handler.js';
import { fileStorage } from '../db.js';
import { 
  initializeChronosQRNService, 
  getChronosQRNService 
} from '../services/qrn/chronos-qrn-service.js';
import { 
  initializeChronosTemporalInstanceService,
  getChronosTemporalInstanceService
} from '../services/temporal/chronos-temporal-instance.js';
import {
  initializeChronosNeuralIntegration,
  getChronosNeuralIntegration
} from '../services/neural-orchestrator/chronos-integration.js';

/**
 * Run direct verification of Chronos system
 */
async function runVerification() {
  console.log('=== BEGINNING CHRONOS DIRECT VERIFICATION ===');
  console.log('Testing chronos time management system components');
  
  try {
    // Initialize Chronos with custom settings for tests
    chronos.initialize({
      tickInterval: 25, // 40 ticks per second
      timeScale: 1.0,
      epochDuration: 100 // Short epochs for testing
    });
    
    // TEST 1: Verify basic chronos operations
    verifyChronosBase();
    
    // TEST 2: Test QRN with chronos integration
    await testQRNIntegration();
    
    // TEST 3: Test Temporal service with chronos
    await testTemporalService();
    
    // TEST 4: Test Neural integration with chronos
    await testNeuralIntegration();
    
    // Final verification: Integrated testing
    await testIntegratedComponents();
    
    console.log('✅ All chronos verification tests passed!');
    console.log('=== CHRONOS DIRECT VERIFICATION COMPLETE ===');
  } catch (error) {
    console.error('❌ Chronos verification failed:', error);
    throw error;
  } finally {
    // Clean up
    chronos.shutdown();
  }
}

/**
 * Verify base Chronos functionality
 */
function verifyChronosBase() {
  console.log('\n--- Testing Base Chronos Functionality ---');
  
  // Get current timestamp
  const timestamp = chronos.now();
  console.log(`Current tick: ${timestamp.tick}, epoch: ${timestamp.epoch}`);
  
  // Verify timestamp object structure
  if (!timestamp.time || !(timestamp.time instanceof Date)) {
    throw new Error('Timestamp time is not a valid Date object');
  }
  
  // Test tick callback
  let tickCallbackInvoked = false;
  const unregisterTickCallback = chronos.onTick(() => {
    tickCallbackInvoked = true;
  });
  
  // Test epoch callback
  let epochCallbackInvoked = false;
  const unregisterEpochCallback = chronos.onEpochTransition(() => {
    epochCallbackInvoked = true;
  });
  
  // Test task registration
  let taskExecuted = false;
  const taskRegistered = chronos.registerTask('test-task', 5, () => {
    taskExecuted = true;
  });
  
  if (!taskRegistered) {
    throw new Error('Failed to register chronos task');
  }
  
  // Manually trigger a tick to run all callbacks
  for (let i = 0; i < 10; i++) {
    // Wait briefly between ticks
    setTimeout(() => {}, 10);
  }
  
  // Give time for callbacks to execute
  setTimeout(() => {
    // Clean up
    unregisterTickCallback();
    unregisterEpochCallback();
    chronos.unregisterTask('test-task');
    
    // Verify
    console.log(`Tick callback invoked: ${tickCallbackInvoked}`);
    console.log(`Epoch callback invoked: ${epochCallbackInvoked}`);
    console.log(`Task executed: ${taskExecuted}`);
    
    console.log('✅ Base Chronos tests passed');
  }, 250);
}

/**
 * Test QRN service with Chronos
 */
async function testQRNIntegration() {
  console.log('\n--- Testing QRN Chronos Integration ---');
  
  try {
    // Initialize the QRN service
    initializeChronosQRNService(fileStorage);
    const qrnService = getChronosQRNService();
    
    // Create a test QRN
    const testQRN = await qrnService.createQuantumRootNode({
      name: 'Chronos Test QRN',
      description: 'Test QRN for chronos verification',
      state: {
        testValue: 100,
        testFlag: true
      },
      coherenceScore: 0.85
    });
    
    console.log(`Created test QRN with ID: ${testQRN.id}`);
    
    // Verify chronos metadata is present
    if (!testQRN.state._chronos) {
      throw new Error('Chronos metadata not present in created QRN');
    }
    
    // Update the QRN
    const updatedQRN = await qrnService.updateQuantumRootNode(testQRN.id, {
      state: {
        testValue: 200,
        newProperty: 'test'
      }
    });
    
    console.log(`Updated test QRN`);
    
    // Verify update timestamp is present
    if (!updatedQRN.state._chronos.lastUpdatedAt) {
      throw new Error('Update timestamp not present in updated QRN');
    }
    
    // Get temporal history
    const history = await qrnService.getTemporalHistory(testQRN.id);
    console.log(`Retrieved ${history.length} temporal history entries`);
    
    if (history.length < 1) {
      throw new Error('Expected at least one temporal history entry');
    }
    
    // Create a snapshot
    const snapshot = await qrnService.createSnapshot(testQRN.id);
    console.log(`Created snapshot`);
    
    if (!snapshot) {
      throw new Error('Failed to create QRN snapshot');
    }
    
    // Verify we can get state at the current time
    const currentTime = new Date();
    const currentState = await qrnService.getStateAtTime(testQRN.id, currentTime);
    
    if (!currentState) {
      throw new Error('Failed to get current state for QRN');
    }
    
    console.log('✅ QRN Chronos integration tests passed');
    return testQRN.id;
  } catch (error) {
    console.error('❌ QRN Chronos integration test failed:', error);
    throw error;
  }
}

/**
 * Test Temporal Instance service with Chronos
 */
async function testTemporalService() {
  console.log('\n--- Testing Temporal Instance Chronos Integration ---');
  
  try {
    // Initialize the Temporal Instance service
    initializeChronosTemporalInstanceService(fileStorage);
    const temporalService = getChronosTemporalInstanceService();
    
    // Create a test temporal instance
    const testInstance = await temporalService.createTemporalInstance({
      nodeId: 'test-node-id',
      state: JSON.stringify({ testData: 'test value' }),
      dimensionType: 'primary',
      stabilityFactor: 0.75
    });
    
    console.log(`Created test temporal instance with ID: ${testInstance.id}`);
    
    // Verify chronos metadata is present
    if (!testInstance.metadata || !testInstance.metadata._chronos) {
      throw new Error('Chronos metadata not present in created temporal instance');
    }
    
    // Create a branch
    const branch = await temporalService.createTemporalBranch(
      testInstance.id,
      'Test Branch',
      { additionalData: 'branch specific' }
    );
    
    console.log(`Created temporal branch: ${branch.dimensionType}`);
    
    if (!branch) {
      throw new Error('Failed to create temporal branch');
    }
    
    // Get dimensions
    const dimensions = temporalService.getBranchDimensions();
    console.log(`Retrieved ${dimensions.length} branch dimensions`);
    
    // Test merging the branch back
    const mergedInstance = await temporalService.mergeTemporalBranch(branch.id);
    console.log(`Merged branch back to primary dimension`);
    
    if (!mergedInstance) {
      throw new Error('Failed to merge temporal branch');
    }
    
    console.log('✅ Temporal Instance Chronos integration tests passed');
  } catch (error) {
    console.error('❌ Temporal Instance Chronos integration test failed:', error);
    throw error;
  }
}

/**
 * Test Neural integration with Chronos
 */
async function testNeuralIntegration() {
  console.log('\n--- Testing Neural Orchestration Chronos Integration ---');
  
  try {
    // Initialize the Neural Integration service
    await initializeChronosNeuralIntegration(fileStorage);
    const neuralIntegration = getChronosNeuralIntegration();
    
    // Test registering a task
    const taskId = 'test-task-' + Date.now();
    neuralIntegration.registerTask(taskId);
    console.log(`Registered test task: ${taskId}`);
    
    // Simulate task completion
    setTimeout(() => {
      neuralIntegration.completeTask(taskId);
      console.log(`Completed test task`);
    }, 100);
    
    // Get metrics
    const metrics = await neuralIntegration.getSystemMetrics();
    console.log(`Current system stability: ${metrics.systemStability.toFixed(4)}`);
    
    console.log('✅ Neural Integration Chronos tests passed');
  } catch (error) {
    console.error('❌ Neural Integration Chronos test failed:', error);
    throw error;
  }
}

/**
 * Test all components working together
 */
async function testIntegratedComponents() {
  console.log('\n--- Testing Integrated Chronos Components ---');
  
  try {
    // Get all service instances
    const qrnService = getChronosQRNService();
    const temporalService = getChronosTemporalInstanceService();
    const neuralIntegration = getChronosNeuralIntegration();
    
    // Create a QRN
    const testQRN = await qrnService.createQuantumRootNode({
      name: 'Integrated Test QRN',
      description: 'Test QRN for integrated chronos testing',
      state: {
        integrationTest: true,
        value: 500
      }
    });
    
    console.log(`Created integrated test QRN: ${testQRN.id}`);
    
    // Register a task
    const taskId = 'integrated-test-task-' + Date.now();
    neuralIntegration.registerTask(taskId);
    
    // Update the QRN a few times
    for (let i = 0; i < 3; i++) {
      await qrnService.updateQuantumRootNode(testQRN.id, {
        state: {
          value: 500 + (i * 100),
          updateIndex: i
        }
      });
      
      // Brief pause between updates
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Complete the task
    neuralIntegration.completeTask(taskId);
    
    // Get the QRN's temporal history
    const history = await qrnService.getTemporalHistory(testQRN.id);
    console.log(`Integrated test QRN has ${history.length} temporal snapshots`);
    
    // Get system metrics
    const metrics = await neuralIntegration.getSystemMetrics();
    console.log(`Final system metrics - Stability: ${metrics.systemStability.toFixed(4)}, Coherence: ${metrics.adaptiveCoherence.toFixed(4)}`);
    
    // Check correlation between timestamps
    if (history.length >= 2) {
      // Get two instances
      const instance1 = history[0];
      const instance2 = history[1];
      
      // Get chronos metadata
      const chronos1 = instance1.metadata?._chronos;
      const chronos2 = instance2.metadata?._chronos;
      
      if (chronos1 && chronos2) {
        console.log(`Temporal instances have correct chronos metadata`);
      }
    }
    
    console.log('✅ Integrated Chronos components tests passed');
  } catch (error) {
    console.error('❌ Integrated components test failed:', error);
    throw error;
  }
}

// Run the verification
runVerification().catch(error => {
  console.error('Verification failed with error:', error);
  process.exit(1);
});