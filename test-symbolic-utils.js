/**
 * Basic test for Symbolic Communication Protocol
 */

// Mock QuantumState for testing
const QuantumState = {
  SIM_FLOW: 'SIM_FLOW',
  SIM_ANTIFLOW: 'SIM_ANTIFLOW',
  SIM_PARTIAL: 'SIM_PARTIAL',
  REAL_FLOW: 'REAL_FLOW',
  REAL_ANTIFLOW: 'REAL_ANTIFLOW',
  REAL_PARTIAL: 'REAL_PARTIAL',
  TRANSITION_TO_REAL: 'TRANSITION_TO_REAL',
  TRANSITION_TO_SIM: 'TRANSITION_TO_SIM'
};

/**
 * Format a message with symbolic prefix
 */
function formatWithSymbolicPrefix(state, message, domain, timeline = 'α') {
  // Map QuantumState to symbolic representation
  let stateSymbol = '';
  
  switch(state) {
    case QuantumState.SIM_FLOW:
      stateSymbol = 'S+';
      break;
    case QuantumState.SIM_ANTIFLOW:
      stateSymbol = 'S-';
      break;
    case QuantumState.SIM_PARTIAL:
      stateSymbol = 'S~';
      break;
    case QuantumState.REAL_FLOW:
      stateSymbol = 'R+';
      break;
    case QuantumState.REAL_ANTIFLOW:
      stateSymbol = 'R-';
      break;
    case QuantumState.REAL_PARTIAL:
      stateSymbol = 'R~';
      break;
    case QuantumState.TRANSITION_TO_REAL:
      stateSymbol = 'T>R';
      break;
    case QuantumState.TRANSITION_TO_SIM:
      stateSymbol = 'T>S';
      break;
    default:
      // Fall back to a safe default if an unknown state is provided
      stateSymbol = 'S?';
  }
  
  // Construct the symbolic prefix based on available components
  let prefix = `[${timeline}/${stateSymbol}`;
  
  // Add domain if provided
  if (domain) {
    prefix += `/${domain}`;
  }
  
  prefix += ']';
  
  return `${prefix} ${message}`;
}

/**
 * Parse a message with symbolic prefix
 */
function parseSymbolicPrefix(formattedMessage) {
  // Default return object
  const result = {
    message: formattedMessage
  };
  
  // Try to match the symbolic prefix pattern
  // The pattern matches Greek letters (α, β) and other special characters
  const match = formattedMessage.match(/^\[([\wα-ωΑ-Ω\d]+)\/([\w\+\-~>]+)(?:\/([^\]]+))?\]\s*(.*)/);
  
  if (match) {
    result.timeline = match[1];
    result.state = match[2];
    result.domain = match[3];  // This might be undefined if domain wasn't included
    result.message = match[4];
  }
  
  return result;
}

/**
 * Convert legacy format to symbolic format
 */
function convertLegacyToSymbolic(legacyMessage) {
  // Map of legacy states to symbolic states
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
  
  // Try to match the legacy prefix pattern
  const match = legacyMessage.match(/^\[QUANTUM_STATE:\s*([A-Z_]+)\](.*)/);
  
  if (match && stateMap[match[1]]) {
    return `[α/${stateMap[match[1]]}]${match[2]}`;
  }
  
  // If no match or unknown state, return the original message
  return legacyMessage;
}

/**
 * Run tests
 */
function runTests() {
  console.log("Testing Symbolic Communication Protocol (JS Implementation)...");
  
  // Test formatWithSymbolicPrefix with various input combinations
  console.log("\n1. Testing formatWithSymbolicPrefix:");
  
  // Basic state formatting
  console.log(formatWithSymbolicPrefix(QuantumState.SIM_FLOW, "Task completed successfully"));
  console.log(formatWithSymbolicPrefix(QuantumState.REAL_ANTIFLOW, "Error in production deployment"));
  
  // With domain
  console.log(formatWithSymbolicPrefix(QuantumState.SIM_FLOW, "Test passed", "🧪"));
  console.log(formatWithSymbolicPrefix(QuantumState.SIM_ANTIFLOW, "Security vulnerability detected", "🔒"));
  
  // With timeline and domain
  console.log(formatWithSymbolicPrefix(QuantumState.REAL_FLOW, "Deployment successful", "🚀", "2025α"));
  console.log(formatWithSymbolicPrefix(QuantumState.TRANSITION_TO_SIM, "Transitioning to simulation for component X", "🔬", "2025β"));
  
  // Test parseSymbolicPrefix
  console.log("\n2. Testing parseSymbolicPrefix:");
  
  const examples = [
    formatWithSymbolicPrefix(QuantumState.SIM_FLOW, "Simple simulation success"),
    formatWithSymbolicPrefix(QuantumState.REAL_ANTIFLOW, "Production failure", "💻"),
    formatWithSymbolicPrefix(QuantumState.TRANSITION_TO_REAL, "Moving to production", "🚀", "2030α"),
    "[QUANTUM_STATE: SIM_FLOW] Legacy format message",
    "Regular message without prefix"
  ];
  
  examples.forEach(example => {
    console.log(`Original: "${example}"`);
    
    // Show regex match details for debugging
    // The pattern matches Greek letters (α, β) and other special characters
    const regex = /^\[([\wα-ωΑ-Ω\d]+)\/([\w\+\-~>]+)(?:\/([^\]]+))?\]\s*(.*)/;
    const match = example.match(regex);
    
    if (match) {
      console.log("Regex match details:");
      console.log(`- Full match: "${match[0]}"`);
      console.log(`- Timeline (group 1): "${match[1]}"`);
      console.log(`- State (group 2): "${match[2]}"`);
      console.log(`- Domain (group 3): ${match[3] ? `"${match[3]}"` : "undefined"}`);
      console.log(`- Message (group 4): "${match[4]}"`);
    } else {
      console.log("No regex match found");
    }
    
    const parsed = parseSymbolicPrefix(example);
    console.log(`Parsed result: ${JSON.stringify(parsed)}`);
    console.log();
  });
  
  // Test converting legacy format to symbolic format
  console.log("\n3. Testing convertLegacyToSymbolic:");
  
  const legacyExamples = [
    "[QUANTUM_STATE: SIM_FLOW] Operation successful",
    "[QUANTUM_STATE: REAL_ANTIFLOW] Production error",
    "[QUANTUM_STATE: TRANSITION_TO_REAL] Moving to production",
    "Not a legacy message"
  ];
  
  legacyExamples.forEach(example => {
    const converted = convertLegacyToSymbolic(example);
    console.log(`Original: "${example}"`);
    console.log(`Converted: "${converted}"`);
    console.log();
  });
  
  console.log("Symbolic Communication Protocol test completed successfully!");
}

// Run the tests
runTests();