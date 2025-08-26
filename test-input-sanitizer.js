/**
 * Test Script for Input Sanitizer
 * 
 * This script demonstrates how the input sanitizer handles various types of problematic inputs
 * and improves the robustness of the Quantum Chunking Framework.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { processInput, sanitizeChunkContent, sanitizeTaskProfile, detectInputErrorSignals } from './server/utils/input-sanitizer.js';
import { ChunkSignalType, ChunkDomainEmoji, createChunk, processChunkThroughQuantumPipeline } from './server/utils/quantum-chunking.js';
import { systemLogger } from './server/utils/symbolic-logger.js';

/**
 * Run tests for the input sanitizer
 */
async function runTests() {
  console.log('🧪 Running Input Sanitizer Tests...\n');
  
  // Test 1: Basic sanitization of inputs with typos
  console.log('Test 1: Basic typo correction');
  const typoExample = "Thsi is a smiple text wiht sume typos adn mistakes!!!!";
  const sanitized = sanitizeChunkContent(typoExample);
  console.log(`Original: ${typoExample}`);
  console.log(`Sanitized: ${sanitized}`);
  console.log();
  
  // Test 2: Handling null/undefined inputs
  console.log('Test 2: Handling null inputs');
  const nullResult = sanitizeChunkContent(null);
  console.log(`Result of sanitizing null: "${nullResult}"`);
  console.log();
  
  // Test 3: Task profile validation
  console.log('Test 3: Task profile validation');
  const invalidProfile = {
    depth: 'extreme', // invalid value
    urgency: 'yesterday', // invalid value
    // domain missing entirely
    complexity: 'super-complex', // invalid value
    mainRequirement: 'perfection' // invalid value
  };
  const validatedProfile = sanitizeTaskProfile(invalidProfile);
  console.log('Invalid profile:', invalidProfile);
  console.log('Validated profile:', validatedProfile);
  console.log();
  
  // Test 4: Signal detection from problematic input
  console.log('Test 4: Signal detection');
  const ambiguousInput = "I'm not sure what to do with this... whatever is best?? somehow make it good!";
  const validProfile = {
    depth: 'moderate',
    urgency: 'medium',
    domain: 'general',
    complexity: 'moderate',
    creativityNeeded: false,
    costSensitivity: 'medium',
    ethicalConsiderations: false,
    mainRequirement: 'balance'
  };
  const detectedSignal = detectInputErrorSignals(ambiguousInput, validProfile);
  console.log(`Ambiguous input: "${ambiguousInput}"`);
  console.log(`Detected signal: ${detectedSignal}`);
  console.log();
  
  // Test 5: End-to-end processing with typos and "fat finger" mistakes
  console.log('Test 5: End-to-end processing with "fat fingered" input');
  const fatFingeredInput = "Hlep! I fat fingered tihs message nd cant' type properly todya!!";
  
  // Create a task profile focusing on accuracy
  const accuracyProfile = {
    depth: 'moderate',
    urgency: 'high',
    domain: 'documentation',
    complexity: 'moderate',
    creativityNeeded: false,
    costSensitivity: 'low',
    ethicalConsiderations: false,
    mainRequirement: 'accuracy'
  };
  
  // Process the input end-to-end
  const processedInput = processInput(fatFingeredInput, accuracyProfile);
  console.log('Processed input result:', processedInput);
  
  // Create a chunk with the processed input
  const chunk = createChunk(processedInput.content, {
    domain: processedInput.domain,
    signalType: processedInput.signalType
  });
  
  console.log(`Created chunk with ID: ${chunk.id}`);
  console.log(`Applied signal: ${chunk.signalType}`);
  console.log(`Selected domain: ${chunk.domain}`);
  console.log(`Sanitized content: "${chunk.content}"`);
  console.log();
  
  // Test 6: Full pipeline processing with problematic input
  console.log('Test 6: Full quantum pipeline with sanitization');
  const result = processChunkThroughQuantumPipeline(
    "Tihs is an importnat message that neads to be procesesd urgently! But I made typos!!!",
    ['analysis', 'correction', 'implementation'],
    { taskProfile: accuracyProfile }
  );
  
  console.log(`Pipeline result chunk ID: ${result.id}`);
  console.log(`Final state: ${result.state.current}`);
  console.log(`Applied signal: ${result.signalType}`);
  console.log(`Content: "${result.content}"`);
  console.log();
  
  console.log('✅ All tests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});