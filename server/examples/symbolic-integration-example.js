/**
 * Symbolic Communication Protocol Integration Example
 * 
 * This demonstrates the integration of the Symbolic Communication Protocol
 * with the QuantumState enum system, showing a full cycle of formatting messages
 * with symbolic prefixes and parsing them back to QuantumState enum values.
 * 
 * [α/S+/💻] Example script for WiltonOS symbolic communication protocol
 */

// Direct imports to avoid the TypeScript-style imports that might not work in plain JS
// We'll use relative path imports instead
import * as symbolicUtils from '../utils/symbolic-utils.js';
import * as symbolicToQuantumState from '../utils/symbolic-to-quantumstate.js';

// Extract the functions we need
const { formatWithSymbolicPrefix, parseSymbolicPrefix, addSymbolicSuffix } = symbolicUtils;
const { symbolToQuantumState, parseSymbolicPrefixToState, getQuantumStateDescription } = symbolicToQuantumState;

// For standalone script testing, we'll define a QuantumState enum matching schema-minimal.ts
const QuantumState = {
  SIM_FLOW: "SIM_FLOW",
  SIM_ANTIFLOW: "SIM_ANTIFLOW",
  SIM_PARTIAL: "SIM_PARTIAL",
  REAL_FLOW: "REAL_FLOW",
  REAL_ANTIFLOW: "REAL_ANTIFLOW",
  REAL_PARTIAL: "REAL_PARTIAL",
  TRANSITION_TO_REAL: "TRANSITION_TO_REAL",
  TRANSITION_TO_SIM: "TRANSITION_TO_SIM"
};

/**
 * Example: Format messages with symbolic prefixes
 */
function demonstrateFormatting() {
  console.log('\n[α/S+/📝] DEMONSTRATION: Formatting Messages with Symbolic Prefixes');
  
  // Basic formatting with just state
  const basicMessage = formatWithSymbolicPrefix(
    QuantumState.SIM_FLOW,
    "Basic message with simulation flow state"
  );
  console.log(basicMessage);
  
  // Formatting with domain
  const domainMessage = formatWithSymbolicPrefix(
    QuantumState.REAL_FLOW,
    "Message with domain indicating a production deployment",
    "🚀"
  );
  console.log(domainMessage);
  
  // Formatting with domain and custom timeline
  const timelineMessage = formatWithSymbolicPrefix(
    QuantumState.TRANSITION_TO_REAL,
    "Message with custom timeline for future planning",
    "🔮",
    "2030β"
  );
  console.log(timelineMessage);
  
  // Formatting error states
  const errorMessage = formatWithSymbolicPrefix(
    QuantumState.REAL_ANTIFLOW,
    "System crash detected in module X",
    "🚨"
  );
  console.log(errorMessage);
  
  // Adding a symbolic suffix
  const messageWithSuffix = addSymbolicSuffix(
    formatWithSymbolicPrefix(
      QuantumState.SIM_PARTIAL,
      "Tests completed with 80% pass rate"
    ),
    "⚠️"
  );
  console.log(messageWithSuffix);
}

/**
 * Example: Parse messages with symbolic prefixes
 */
function demonstrateParsing() {
  console.log('\n[α/S+/🔍] DEMONSTRATION: Parsing Messages with Symbolic Prefixes');
  
  // Parse a basic message
  const message1 = "[α/S+] Basic simulation success message";
  const parsed1 = parseSymbolicPrefix(message1);
  console.log('Parsed basic message:', parsed1);
  
  // Parse a message with domain
  const message2 = "[α/R+/🚀] Deployment completed successfully";
  const parsed2 = parseSymbolicPrefix(message2);
  console.log('Parsed message with domain:', parsed2);
  
  // Parse a message with custom timeline and domain
  const message3 = "[2030β/T>R/🔮] Transitioning to production in future timeline";
  const parsed3 = parseSymbolicPrefix(message3);
  console.log('Parsed message with timeline and domain:', parsed3);
  
  // Parse an error message
  const message4 = "[α/R-/🚨] Critical error in module X";
  const parsed4 = parseSymbolicPrefix(message4);
  console.log('Parsed error message:', parsed4);
}

/**
 * Example: Convert symbolic states to QuantumState enum values
 */
function demonstrateStateConversion() {
  console.log('\n[α/S+/⚛️] DEMONSTRATION: Converting Symbolic States to QuantumState');
  
  // Basic symbolic state conversion
  console.log('S+ → ', symbolToQuantumState('S+'));
  console.log('R- → ', symbolToQuantumState('R-'));
  console.log('T>R → ', symbolToQuantumState('T>R'));
  
  // Invalid state handling
  console.log('INVALID → ', symbolToQuantumState('INVALID'));
  
  // Parse a message and extract the state in one operation
  const message = "[α/S+/💻] Task completed successfully";
  const fullParsed = parseSymbolicPrefixToState(message);
  console.log('Full parsed message with state conversion:', fullParsed);
  
  // Get human-readable description of a state (TypeScript version only)
  if (typeof getQuantumStateDescription === 'function') {
    console.log('State description:', getQuantumStateDescription(QuantumState.SIM_FLOW));
  }
}

/**
 * Example: Full integration cycle
 */
function demonstrateFullCycle() {
  console.log('\n[α/S+/🔄] DEMONSTRATION: Full Integration Cycle');
  
  // 1. Start with a QuantumState
  const state = QuantumState.SIM_FLOW;
  console.log('Starting state:', state);
  
  // 2. Format a message with this state
  const formattedMessage = formatWithSymbolicPrefix(state, "Test message for full cycle", "🧪");
  console.log('Formatted message:', formattedMessage);
  
  // 3. Parse the message
  const parsed = parseSymbolicPrefix(formattedMessage);
  console.log('Parsed components:', parsed);
  
  // 4. Convert back to a QuantumState
  const recoveredState = symbolToQuantumState(parsed.state);
  console.log('Recovered state:', recoveredState);
  
  // 5. Verify the cycle is complete
  console.log('Cycle complete:', state === recoveredState);
}

/**
 * Run all demonstrations
 */
function runSymbolicIntegrationDemo() {
  console.log('[α/S+/🚀] SYMBOLIC COMMUNICATION PROTOCOL INTEGRATION DEMO');
  
  demonstrateFormatting();
  demonstrateParsing();
  demonstrateStateConversion();
  demonstrateFullCycle();
  
  console.log('\n[α/S+/✅] DEMO COMPLETED SUCCESSFULLY');
}

// Execute the demo
runSymbolicIntegrationDemo();