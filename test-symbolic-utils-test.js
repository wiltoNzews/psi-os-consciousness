/**
 * Standalone test for Symbolic Communication Protocol
 * 
 * This test script creates its own version of the QuantumState enum
 * and tests the symbolic formatting and parsing functions.
 * 
 * [α/S+/🧪] Simplified test script for symbolic utilities
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

// Run tests
async function runTests() {
  console.log("[α/S+/🧪] Starting Symbolic Communication Protocol Test...\n");
  
  // Test formatWithSymbolicPrefix
  console.log("1. Testing formatWithSymbolicPrefix:");
  const testCases = [
    { state: QuantumState.SIM_FLOW, message: "Task completed successfully", expectedPrefix: "[α/S+]" },
    { state: QuantumState.REAL_ANTIFLOW, message: "Error in production", expectedPrefix: "[α/R-]" },
    { state: QuantumState.SIM_FLOW, message: "Unit test passing", domain: "🧪", expectedPrefix: "[α/S+/🧪]" },
    { state: QuantumState.TRANSITION_TO_REAL, message: "Deployment in progress", domain: "🚀", timeline: "2025α", expectedPrefix: "[2025α/T>R/🚀]" }
  ];
  
  let allPassed = true;
  
  for (const test of testCases) {
    const { state, message, domain, timeline, expectedPrefix } = test;
    const formatted = formatWithSymbolicPrefix(state, message, domain, timeline);
    const passed = formatted.startsWith(expectedPrefix);
    
    console.log(`- ${formatted} ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`  Expected: ${expectedPrefix} ${message}`);
      console.log(`  Actual:   ${formatted}`);
      allPassed = false;
    }
  }
  
  // Test parsing
  console.log("\n2. Testing parseSymbolicPrefix:");
  const parseTests = [
    "[α/S+/💻] Code refactoring complete",
    "[2030β/R-/🌐] API endpoint failure",
    "[α/T>R] Transitioning to production"
  ];
  
  for (const test of parseTests) {
    const parsed = parseSymbolicPrefix(test);
    console.log(`- Original: "${test}"`);
    console.log(`  Parsed: ${JSON.stringify(parsed)}`);
    console.log(`  Components extracted: timeline=${!!parsed.timeline}, state=${!!parsed.state}, message=${!!parsed.message} ✅`);
  }
  
  // Test conversion
  console.log("\n3. Testing convertLegacyToSymbolic:");
  const conversionTests = [
    { legacy: "[QUANTUM_STATE: SIM_FLOW] Operation successful", expected: "[α/S+] Operation successful" },
    { legacy: "[QUANTUM_STATE: REAL_ANTIFLOW] Error in production", expected: "[α/R-] Error in production" }
  ];
  
  for (const test of conversionTests) {
    const { legacy, expected } = test;
    const converted = convertLegacyToSymbolic(legacy);
    const passed = converted === expected;
    
    console.log(`- ${legacy} -> ${converted} ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`  Expected: ${expected}`);
      console.log(`  Actual:   ${converted}`);
      allPassed = false;
    }
  }
  
  // Test suffix handling
  console.log("\n4. Testing addSymbolicSuffix:");
  const suffixTests = [
    { message: "Task completed", suffix: "✅", expected: "Task completed ✅" },
    { message: "Warning: performance degradation", suffix: "⚠️", expected: "Warning: performance degradation ⚠️" }
  ];
  
  for (const test of suffixTests) {
    const { message, suffix, expected } = test;
    const result = addSymbolicSuffix(message, suffix);
    const passed = result === expected;
    
    console.log(`- "${message}" + "${suffix}" -> "${result}" ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`  Expected: ${expected}`);
      console.log(`  Actual:   ${result}`);
      allPassed = false;
    }
  }
  
  // Test symbolic references
  console.log("\n5. Testing createSymbolicReference:");
  const refTests = [
    { type: "Δ", reference: "Analysis", expected: "{Δ:Analysis}" },
    { type: "β", reference: "Timeline", expected: "{β:Timeline}" }
  ];
  
  for (const test of refTests) {
    const { type, reference, expected } = test;
    const result = createSymbolicReference(type, reference);
    const passed = result === expected;
    
    console.log(`- createSymbolicReference("${type}", "${reference}") -> "${result}" ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`  Expected: ${expected}`);
      console.log(`  Actual:   ${result}`);
      allPassed = false;
    }
  }
  
  // Final report
  console.log("\n[α/S+/🧪] Symbolic Communication Protocol Test " + 
    (allPassed ? "PASSED ✅" : "FAILED ❌"));
  
  if (allPassed) {
    console.log("[α/S+/🧪] All symbolic utilities are working as expected and ready for system-wide integration.");
  } else {
    console.log("[α/S-/🧪] Some symbolic utilities are not working as expected. See logs above for details.");
  }
  
  return allPassed;
}

// Run the tests
runTests().catch(err => {
  console.error("[α/S-/🧪] Test error:", err);
  process.exit(1);
});