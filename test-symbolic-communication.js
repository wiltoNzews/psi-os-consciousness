/**
 * Test script for Symbolic Communication Protocol
 * 
 * This script tests the formatWithSymbolicPrefix function and other utilities
 * from our symbolic-utils.ts module.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { QuantumState } from './shared/schema-minimal.js';
import { formatWithSymbolicPrefix, parseSymbolicPrefix, convertLegacyToSymbolic } from './server/utils/symbolic-utils.js';

/**
 * Run a test of the symbolic communication protocol utilities
 */
async function runTest() {
  console.log("Testing Symbolic Communication Protocol...");
  
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
    const parsed = parseSymbolicPrefix(example);
    console.log(`Original: "${example}"`);
    console.log(`Parsed: ${JSON.stringify(parsed)}`);
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
  
  console.log("Symbolic Communication Protocol test completed.");
}

// Run the test
runTest().catch(error => {
  console.error("Test failed:", error);
});