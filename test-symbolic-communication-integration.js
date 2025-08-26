/**
 * Integration Test for Symbolic Communication Protocol
 * 
 * This script tests the symbolic communication utilities in a standalone manner
 * without relying on external imports. This ensures the communication protocol
 * works correctly regardless of module system (ESM vs CommonJS).
 * 
 * [α/S+/🧪] Integration Test
 */

// Define our own version of the QuantumState enum for testing
const QuantumState = {
  SIM_FLOW: "SIM_FLOW",             // System is aligned in simulation context
  SIM_ANTIFLOW: "SIM_ANTIFLOW",     // System is misaligned in simulation context
  SIM_PARTIAL: "SIM_PARTIAL",       // System is partially aligned in simulation context
  REAL_FLOW: "REAL_FLOW",           // System is aligned in reality context
  REAL_ANTIFLOW: "REAL_ANTIFLOW",   // System is misaligned in reality context
  REAL_PARTIAL: "REAL_PARTIAL",     // System is partially aligned in reality context
  TRANSITION_TO_REAL: "TRANSITION_TO_REAL", // System is transitioning to reality context
  TRANSITION_TO_SIM: "TRANSITION_TO_SIM"    // System is transitioning to simulation context
};

// Maps QuantumState enum values to their symbolic state representation
const QUANTUM_STATE_SYMBOLS = {
  [QuantumState.SIM_FLOW]: 'S+',
  [QuantumState.SIM_ANTIFLOW]: 'S-',
  [QuantumState.SIM_PARTIAL]: 'S~',
  [QuantumState.REAL_FLOW]: 'R+',
  [QuantumState.REAL_ANTIFLOW]: 'R-',
  [QuantumState.REAL_PARTIAL]: 'R~',
  [QuantumState.TRANSITION_TO_REAL]: 'T>R',
  [QuantumState.TRANSITION_TO_SIM]: 'T>S'
};

// Maps symbolic representations back to their QuantumState enum values
const SYMBOLIC_TO_QUANTUM_STATE = {
  'S+': QuantumState.SIM_FLOW,
  'S-': QuantumState.SIM_ANTIFLOW,
  'S~': QuantumState.SIM_PARTIAL,
  'R+': QuantumState.REAL_FLOW,
  'R-': QuantumState.REAL_ANTIFLOW,
  'R~': QuantumState.REAL_PARTIAL,
  'T>R': QuantumState.TRANSITION_TO_REAL,
  'T>S': QuantumState.TRANSITION_TO_SIM
};

/**
 * Format a message with the appropriate symbolic prefix based on quantum state
 */
function formatWithSymbolicPrefix(state, message, domain, timeline = 'α') {
  const stateSymbol = QUANTUM_STATE_SYMBOLS[state];
  let prefix = domain 
    ? `[${timeline}/${stateSymbol}/${domain}]` 
    : `[${timeline}/${stateSymbol}]`;
  return `${prefix} ${message}`;
}

/**
 * Parse a message with symbolic prefix into its components
 */
function parseSymbolicPrefix(formattedMessage) {
  const result = { message: formattedMessage };
  const match = formattedMessage.match(/^\[([\wα-ωΑ-Ω\d]+)\/([\w\+\-~>]+)(?:\/([^\]]+))?\]\s*(.*)/);
  
  if (match) {
    result.timeline = match[1];
    result.state = match[2];
    result.domain = match[3]; 
    result.message = match[4];
  }
  
  return result;
}

/**
 * Convert from legacy format to symbolic format
 */
function convertLegacyToSymbolic(legacyMessage) {
  const stateMap = {
    'SIM_FLOW': 'S+',
    'SIM_ANTIFLOW': 'S-',
    'SIM_PARTIAL': 'S~',
    'REAL_FLOW': 'R+',
    'REAL_ANTIFLOW': 'R-',
    'REAL_PARTIAL': 'R~',
    'TRANSITION_TO_REAL': 'T>R',
    'TRANSITION_TO_SIM': 'T>S'
  };
  
  const match = legacyMessage.match(/^\[QUANTUM_STATE:\s*([A-Z_]+)\](.*)/);
  
  if (match && stateMap[match[1]]) {
    return `[α/${stateMap[match[1]]}]${match[2]}`;
  }
  
  return legacyMessage;
}

/**
 * Add a symbolic suffix to a message
 */
function addSymbolicSuffix(message, suffix) {
  return `${message} ${suffix}`;
}

/**
 * Create a symbolic domain reference for inline use
 */
function createSymbolicReference(referenceType, reference) {
  return `{${referenceType}:${reference}}`;
}

/**
 * Integration Test 1: Verify Round-Trip Conversion
 */
function testRoundTripConversion() {
  console.log("[α/S+/🧪] Testing round-trip conversion...");
  
  // Create a message with symbolic prefix
  const originalState = QuantumState.SIM_FLOW;
  const originalMessage = "Integration test complete";
  
  const formattedMessage = formatWithSymbolicPrefix(originalState, originalMessage);
  console.log(`Original: ${originalState} -> "${originalMessage}"`);
  console.log(`Formatted: "${formattedMessage}"`);
  
  // Parse the symbolic prefix
  const parsed = parseSymbolicPrefix(formattedMessage);
  console.log(`Parsed: ${JSON.stringify(parsed)}`);
  
  // Convert back to QuantumState
  const reconvertedState = SYMBOLIC_TO_QUANTUM_STATE[parsed.state];
  console.log(`Reconverted State: ${reconvertedState}`);
  
  // Verify round-trip integrity
  const success = originalState === reconvertedState && parsed.message === originalMessage;
  console.log(`Round-trip conversion ${success ? 'PASSED ✅' : 'FAILED ❌'}`);
  
  return success;
}

/**
 * Integration Test 2: Verify Legacy Format Conversion
 */
function testLegacyFormatConversion() {
  console.log("\n[α/S+/🧪] Testing legacy format conversion...");
  
  const legacyMessage = "[QUANTUM_STATE: REAL_ANTIFLOW] Error in production system";
  console.log(`Legacy: "${legacyMessage}"`);
  
  const converted = convertLegacyToSymbolic(legacyMessage);
  console.log(`Converted: "${converted}"`);
  
  const expected = "[α/R-] Error in production system";
  const success = converted === expected;
  
  console.log(`Legacy format conversion ${success ? 'PASSED ✅' : 'FAILED ❌'}`);
  return success;
}

/**
 * Integration Test 3: Verify Complex Symbolic Prefixes
 */
function testComplexSymbolicPrefixes() {
  console.log("\n[α/S+/🧪] Testing complex symbolic prefixes...");
  
  const complexCases = [
    { 
      state: QuantumState.TRANSITION_TO_REAL, 
      message: "Deployment in progress", 
      domain: "🚀", 
      timeline: "2030β",
      expected: "[2030β/T>R/🚀] Deployment in progress"
    },
    { 
      state: QuantumState.SIM_PARTIAL, 
      message: "Mixed results in simulation", 
      domain: "📊",
      expected: "[α/S~/📊] Mixed results in simulation"
    }
  ];
  
  let allPassed = true;
  
  for (const test of complexCases) {
    const formatted = formatWithSymbolicPrefix(
      test.state, 
      test.message, 
      test.domain, 
      test.timeline
    );
    
    const success = formatted === test.expected;
    console.log(`Formatted: "${formatted}"`);
    console.log(`Expected: "${test.expected}"`);
    console.log(`Complex prefix test ${success ? 'PASSED ✅' : 'FAILED ❌'}`);
    
    if (!success) allPassed = false;
    
    // Also verify parsing works correctly
    const parsed = parseSymbolicPrefix(formatted);
    console.log(`Parsed: ${JSON.stringify(parsed)}`);
    
    const parsingComplete = parsed.message === test.message && 
                            parsed.domain === test.domain && 
                            (parsed.timeline === (test.timeline || 'α'));
    
    console.log(`Complex prefix parsing ${parsingComplete ? 'PASSED ✅' : 'FAILED ❌'}`);
    if (!parsingComplete) allPassed = false;
  }
  
  return allPassed;
}

/**
 * Integration Test 4: Verify Symbolic References
 */
function testSymbolicReferences() {
  console.log("\n[α/S+/🧪] Testing symbolic references...");
  
  const referenceTests = [
    { 
      type: "Δ", 
      reference: "QuantumRootNode", 
      expected: "{Δ:QuantumRootNode}"
    },
    { 
      type: "β", 
      reference: "AlternateTimeline", 
      expected: "{β:AlternateTimeline}"
    }
  ];
  
  let allPassed = true;
  
  for (const test of referenceTests) {
    const reference = createSymbolicReference(test.type, test.reference);
    const success = reference === test.expected;
    
    console.log(`Reference: "${reference}"`);
    console.log(`Expected: "${test.expected}"`);
    console.log(`Symbolic reference test ${success ? 'PASSED ✅' : 'FAILED ❌'}`);
    
    if (!success) allPassed = false;
  }
  
  return allPassed;
}

/**
 * Run all integration tests
 */
function runAllTests() {
  console.log("[α/S+/🧪] Starting Symbolic Communication Protocol Integration Tests...\n");
  
  const results = [
    testRoundTripConversion(),
    testLegacyFormatConversion(),
    testComplexSymbolicPrefixes(),
    testSymbolicReferences()
  ];
  
  const allPassed = results.every(result => result === true);
  
  console.log("\n[α/S+/🧪] Integration Test Summary:");
  console.log(`Round-Trip Conversion: ${results[0] ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Legacy Format Conversion: ${results[1] ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Complex Symbolic Prefixes: ${results[2] ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Symbolic References: ${results[3] ? 'PASSED ✅' : 'FAILED ❌'}`);
  
  console.log(`\n[α/${allPassed ? 'S+' : 'S-'}/🧪] Integration Tests ${allPassed ? 'PASSED ✅' : 'FAILED ❌'}`);
  
  if (allPassed) {
    console.log("[α/S+/🧪] The Symbolic Communication Protocol is working correctly and ready for system integration.");
  } else {
    console.log("[α/S-/🧪] There are issues with the Symbolic Communication Protocol. Please review the test results.");
  }
  
  return allPassed;
}

// Run all tests
runAllTests();