/**
 * Quantum Chunking Test Suite
 * 
 * This test suite validates the functionality of the Quantum Chunking architecture,
 * which enables information processing in quantum-inspired "chunks" that can
 * exist in multiple states simultaneously, be routed to appropriate processors,
 * and eventually collapse into a single state.
 * 
 * [α/S+/🧪] Quantum Chunking Verification Module
 */

import {
  createChunk,
  activateChunkSynapse,
  routeChunk,
  decohereChunkState,
  entangleChunks,
  runLogicDiagnostics,
  suggestPromptRefinement,
  handleQuantumSignal,
  ChunkState,
  ChunkSignalType,
  ChunkDomainEmoji,
  processChunkThroughQuantumPipeline
} from '../utils/quantum-chunking.js';

import { systemLogger, LogLevel, DomainEmoji } from '../utils/symbolic-logger.js';

// Add TEST domain emoji for testing purposes
ChunkDomainEmoji.TEST = '🧪';
ChunkDomainEmoji.CODE = '💻';
ChunkDomainEmoji.ERROR = '🚫';

/**
 * Test Case 1: Create and Verify a New Chunk
 */
function testCreateChunk() {
  console.log('[TEST] Running testCreateChunk...');
  
  // Create a chunk with test content
  const chunk = createChunk(
    "Test content for quantum processing",
    { domain: ChunkDomainEmoji.TEST }
  );
  
  // Verify the chunk properties
  console.assert(typeof chunk.id === 'string', 'Chunk ID should be a string');
  console.assert(chunk.content === "Test content for quantum processing", 'Content should match input');
  console.assert(chunk.state.current === ChunkState.CREATED, 'Initial state should be CREATED');
  console.assert(chunk.state.superposed === false, 'Chunk should not be in superposition initially');
  console.assert(chunk.domain === ChunkDomainEmoji.TEST, 'Domain should match input');
  
  console.log('[TEST] testCreateChunk PASSED');
  return chunk;
}

/**
 * Test Case 2: Activate Chunk Synapse (Enter Superposition)
 */
function testActivateChunkSynapse(chunk) {
  console.log('[TEST] Running testActivateChunkSynapse...');
  
  // Activate the chunk with two possibilities
  const possibilities = ['analysis', 'decision'];
  const superposedChunk = activateChunkSynapse(chunk, possibilities);
  
  // Verify the chunk is now in superposition
  console.assert(superposedChunk.state.current === ChunkState.SUPERPOSED, 'State should be SUPERPOSED');
  console.assert(superposedChunk.state.superposed === true, 'Superposed flag should be true');
  console.assert(Array.isArray(superposedChunk.children), 'Children array should exist');
  console.assert(superposedChunk.children.length === 2, 'Should have two children for possibilities');
  
  // Verify the children properties
  console.assert(superposedChunk.children[0].possibility === 'analysis', 'First possibility should be analysis');
  console.assert(superposedChunk.children[1].possibility === 'decision', 'Second possibility should be decision');
  
  console.log('[TEST] testActivateChunkSynapse PASSED');
  return superposedChunk;
}

/**
 * Test Case 3: Route a Chunk to an Agent
 */
function testRouteChunk(superposedChunk) {
  console.log('[TEST] Running testRouteChunk...');
  
  // Route the chunk to a specific agent
  const targetAgent = 'test-analysis-agent';
  const routedAgent = routeChunk(superposedChunk, targetAgent);
  
  // Verify routing was successful
  console.assert(routedAgent === targetAgent, 'Returned agent should match target');
  console.assert(superposedChunk.state.current === ChunkState.ROUTED, 'State should be ROUTED');
  console.assert(superposedChunk.state.routedTo === targetAgent, 'routedTo property should be set');
  
  // Test automatic routing based on domain
  const codeChunk = createChunk("Code for analysis", { domain: ChunkDomainEmoji.CODE });
  const autoRoutedAgent = routeChunk(codeChunk);
  
  console.assert(autoRoutedAgent === 'code-analysis-agent', 'Code chunk should route to code-analysis-agent');
  console.assert(codeChunk.state.current === ChunkState.ROUTED, 'State should be ROUTED');
  
  console.log('[TEST] testRouteChunk PASSED');
  return superposedChunk;
}

/**
 * Test Case 4: Decohere a Superposed Chunk
 */
function testDecohereChunkState(superposedChunk) {
  console.log('[TEST] Running testDecohereChunkState...');
  
  // Make a copy of the superposed chunk for testing
  const chunkCopy = JSON.parse(JSON.stringify(superposedChunk));
  
  // Decohere the chunk to the first possibility (index 0)
  const collapsedChunk = decohereChunkState(chunkCopy, 0);
  
  // Verify the chunk has collapsed correctly
  console.assert(collapsedChunk.state.current === ChunkState.COLLAPSED, 'State should be COLLAPSED');
  console.assert(collapsedChunk.state.superposed === false, 'Superposed flag should be false');
  console.assert(collapsedChunk.state.collapsed === true, 'Collapsed flag should be true');
  console.assert(collapsedChunk.state.selectedPossibility === 'analysis', 'Selected possibility should be analysis');
  console.assert(collapsedChunk.children === undefined, 'Children array should be removed');
  console.assert(Array.isArray(collapsedChunk.metadata.superpositionHistory), 'Should have superposition history');
  
  console.log('[TEST] testDecohereChunkState PASSED');
  return collapsedChunk;
}

/**
 * Test Case 5: Entangle Two Chunks
 */
function testEntangleChunks() {
  console.log('[TEST] Running testEntangleChunks...');
  
  // Create two chunks to entangle
  const chunkA = createChunk("Chunk A content", { domain: ChunkDomainEmoji.TEST });
  const chunkB = createChunk("Chunk B content", { domain: ChunkDomainEmoji.TEST });
  
  // Entangle the chunks
  const [entangledA, entangledB] = entangleChunks(chunkA, chunkB);
  
  // Verify entanglement
  console.assert(entangledA.state.current === ChunkState.ENTANGLED, 'Chunk A state should be ENTANGLED');
  console.assert(entangledB.state.current === ChunkState.ENTANGLED, 'Chunk B state should be ENTANGLED');
  console.assert(entangledA.state.entangledWith === entangledB.id, 'Chunk A should be entangled with B');
  console.assert(entangledB.state.entangledWith === entangledA.id, 'Chunk B should be entangled with A');
  
  console.log('[TEST] testEntangleChunks PASSED');
  return [entangledA, entangledB];
}

/**
 * Test Case 6: Run Logic Diagnostics (🥶 Logic Lockdown)
 */
function testRunLogicDiagnostics() {
  console.log('[TEST] Running testRunLogicDiagnostics...');
  
  // Create a chunk with content containing logical issues
  const contentWithIssues = "This must always be true, but it can never be false. Since A is true, thus A is true.";
  const chunk = createChunk(contentWithIssues, { domain: ChunkDomainEmoji.TEST });
  
  // Run diagnostics
  const diagnostics = runLogicDiagnostics(chunk);
  
  // Verify diagnostics results
  console.assert(diagnostics.chunkId === chunk.id, 'Diagnostics should reference the chunk');
  console.assert(diagnostics.status === 'completed', 'Diagnostics should be completed');
  console.assert(Array.isArray(diagnostics.results.inconsistencies), 'Should have inconsistencies array');
  console.assert(diagnostics.results.inconsistencies.length > 0, 'Should detect logical issues');
  console.assert(chunk.signalType === ChunkSignalType.LOGIC_LOCKDOWN, 'Chunk should have Logic Lockdown signal');
  
  console.log('[TEST] testRunLogicDiagnostics PASSED');
  return diagnostics;
}

/**
 * Test Case 7: Suggest Prompt Refinement (♻️ Refresh Signal)
 */
function testSuggestPromptRefinement() {
  console.log('[TEST] Running testSuggestPromptRefinement...');
  
  // Create a chunk with vague content
  const vagueContent = "Do some stuff with the things and improve etc.";
  const chunk = createChunk(vagueContent, { domain: ChunkDomainEmoji.TEST });
  
  // Generate refinement suggestions
  const refinement = suggestPromptRefinement(chunk);
  
  // Verify refinement results
  console.assert(refinement.chunkId === chunk.id, 'Refinement should reference the chunk');
  console.assert(refinement.originalContent === vagueContent, 'Original content should be preserved');
  console.assert(Array.isArray(refinement.suggestions), 'Should have suggestions array');
  console.assert(refinement.suggestions.length > 0, 'Should have at least one suggestion');
  console.assert(chunk.signalType === ChunkSignalType.REFRESH_SIGNAL, 'Chunk should have Refresh Signal');
  
  console.log('[TEST] testSuggestPromptRefinement PASSED');
  return refinement;
}

/**
 * Test Case 8: Handle Quantum Signals
 */
function testHandleQuantumSignal() {
  console.log('[TEST] Running testHandleQuantumSignal...');
  
  // Create a test chunk
  const chunk = createChunk("Test content", { domain: ChunkDomainEmoji.TEST });
  
  // Test handling Logic Lockdown signal
  const lockdownResult = handleQuantumSignal(ChunkSignalType.LOGIC_LOCKDOWN, chunk);
  console.assert(lockdownResult.status === 'completed', 'Logic Lockdown should be handled');
  console.assert(chunk.signalType === ChunkSignalType.LOGIC_LOCKDOWN, 'Chunk should have Logic Lockdown signal');
  
  // Reset chunk and test Refresh Signal
  chunk.signalType = ChunkSignalType.NONE;
  const refreshResult = handleQuantumSignal(ChunkSignalType.REFRESH_SIGNAL, chunk);
  console.assert(refreshResult.suggestions.length > 0, 'Refresh Signal should generate suggestions');
  console.assert(chunk.signalType === ChunkSignalType.REFRESH_SIGNAL, 'Chunk should have Refresh Signal');
  
  // Test error signal
  const errorResult = handleQuantumSignal(ChunkSignalType.ERROR, chunk);
  console.assert(errorResult.status === 'error', 'Error signal status should be error');
  
  // Test handling with no chunk
  const noChunkResult = handleQuantumSignal(ChunkSignalType.LOGIC_LOCKDOWN);
  console.assert(noChunkResult.status === 'error', 'No chunk should return error status');
  
  console.log('[TEST] testHandleQuantumSignal PASSED');
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('\n[α/S+/🧪] QUANTUM CHUNKING TEST SUITE STARTED\n');
  
  try {
    // Run the tests in sequence
    const chunk = testCreateChunk();
    const superposedChunk = testActivateChunkSynapse(chunk);
    const routedChunk = testRouteChunk(superposedChunk);
    const collapsedChunk = testDecohereChunkState(routedChunk);
    const [entangledA, entangledB] = testEntangleChunks();
    const diagnostics = testRunLogicDiagnostics();
    const refinement = testSuggestPromptRefinement();
    testHandleQuantumSignal();
    
    console.log('\n[α/S+/🧪] QUANTUM CHUNKING TEST SUITE COMPLETED SUCCESSFULLY\n');
    
    // Optional: test the complete pipeline
    console.log('[α/S+/🧪] Testing full quantum pipeline...');
    const result = processChunkThroughQuantumPipeline(
      "Analyze this data set for patterns",
      ['statistical', 'visual', 'temporal'],
      { domain: ChunkDomainEmoji.TEST }
    );
    console.log('[α/S+/🧪] Pipeline test completed successfully');
    
  } catch (error) {
    console.error(`\n[α/S-/🚫] TEST FAILURE: ${error.message}\n`);
    console.error(error);
  }
}

// Run the tests
runTests();