/**
 * Test Script for Symbolic Log Aggregator
 * 
 * This script demonstrates the symbolic log aggregator in action by
 * collecting, analyzing, and visualizing logs from quantum chunk operations.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { ChunkDomainEmoji, createChunk, activateChunkSynapse, 
         routeChunk, decohereChunkState, entangleChunks, 
         handleQuantumSignal, processChunkThroughQuantumPipeline, 
         ChunkSignalType } from '../utils/quantum-chunking.js';

import { aggregateSymbolicLogs, collectSymbolicLogs, 
         parseLifecycleEvent, trackChunkLifecycles,
         visualizeSymbolicLogs, getPerformanceMetrics } from '../utils/symbolic-log-aggregator.js';

// Array to collect console logs
const capturedLogs = [];

// Override console.log to capture output
const originalConsoleLog = console.log;
console.log = function(...args) {
  const logString = args.join(' ');
  capturedLogs.push(logString);
  originalConsoleLog.apply(console, args);
};

/**
 * Generate a series of test operations to produce symbolic logs
 */
async function generateTestLogs() {
  console.log('[α/🧪/ℹ️] Starting Symbolic Log Aggregator Test');
  
  // Create chunks for testing
  const chunk1 = createChunk('Test content for chunk 1');
  const chunk2 = createChunk('Test content for chunk 2');
  const chunk3 = createChunk('Test content for chunk 3');
  
  // Activate synapses
  const superposedChunk1 = activateChunkSynapse(chunk1, ['approach1', 'approach2', 'approach3']);
  const superposedChunk2 = activateChunkSynapse(chunk2, ['approach1', 'approach2']);
  
  // Route chunks
  const agent1 = routeChunk(superposedChunk1, '📊');
  const agent2 = routeChunk(superposedChunk2, '✨');
  
  // Entangle chunks
  entangleChunks(chunk2, chunk3);
  
  // Process a chunk through the pipeline
  processChunkThroughQuantumPipeline(
    'Analyze this combined test dataset', 
    ['statistical', 'visual', 'exploratory'],
    { domain: '📊' }
  );
  
  // Handle quantum signals
  handleQuantumSignal(ChunkSignalType.LOGIC_LOCKDOWN, chunk1);
  handleQuantumSignal(ChunkSignalType.REFRESH_SIGNAL, chunk2);
  
  // Decohere chunks
  const collapsedChunk1 = decohereChunkState(superposedChunk1);
  const collapsedChunk2 = decohereChunkState(superposedChunk2);
  
  console.log('[α/🧪/ℹ️] Test log generation complete');
  
  return capturedLogs;
}

/**
 * Run the test for the symbolic log aggregator
 */
async function runTest() {
  try {
    // Generate test logs
    await generateTestLogs();
    
    // Filter for symbolic logs only
    const symbolicLogs = collectSymbolicLogs(capturedLogs);
    console.log(`\n[α/🧪/ℹ️] Collected ${symbolicLogs.length} symbolic logs`);
    
    // Demonstrate log aggregation
    console.log('\n[α/🧪/ℹ️] Aggregated Log Summary:');
    const aggregation = aggregateSymbolicLogs(capturedLogs);
    console.table(aggregation);
    
    // Track chunk lifecycles
    const lifecycles = trackChunkLifecycles(capturedLogs);
    console.log(`\n[α/🧪/ℹ️] Tracked ${Object.keys(lifecycles).length} chunks through their lifecycle`);
    
    // Get performance metrics
    const metrics = getPerformanceMetrics(capturedLogs);
    console.log('\n[α/🧪/ℹ️] Performance Metrics:');
    console.table(metrics);
    
    // Visualize the logs
    console.log('\n[α/🧪/ℹ️] Visualizing Symbolic Logs:');
    visualizeSymbolicLogs(capturedLogs);
    
    console.log('\n[α/🧪/✅] Symbolic Log Aggregator Test Completed Successfully');
    
  } catch (error) {
    console.error(`[α/🧪/❌] Test Error: ${error.message}`);
    console.error(error.stack);
  } finally {
    // Restore original console.log
    console.log = originalConsoleLog;
  }
}

// Run the test
runTest();