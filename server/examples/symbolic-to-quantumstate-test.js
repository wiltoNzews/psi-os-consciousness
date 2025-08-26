/**
 * Test Script for symbolic-to-quantumstate.js
 * 
 * This script verifies the functionality of the symbolic-to-quantumstate.js
 * utility functions that map symbolic state representations to QuantumState enum values.
 * 
 * [α/S+/🧪] Testing symbolic-to-quantumstate.js utilities
 */

// Direct imports to avoid the TypeScript-style imports that might not work in plain JS
import * as symbolicUtils from '../utils/symbolic-utils.js';
import * as symbolicToQuantumState from '../utils/symbolic-to-quantumstate.js';

// Extract the functions for testing
const { formatWithSymbolicPrefix, parseSymbolicPrefix } = symbolicUtils;
const { 
  symbolToQuantumState, 
  parseSymbolicPrefixToState, 
  extractStateFromMessage, 
  legacyMessageToState, 
  getQuantumStateDescription 
} = symbolicToQuantumState;

// QuantumState enum (mirroring shared/schema-minimal.ts)
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
 * Run tests for symbolToQuantumState()
 */
function testSymbolToQuantumState() {
  console.log('\n[α/S+/🧪] Testing symbolToQuantumState()');
  
  // Test each symbolic state mapping
  const testCases = [
    { symbol: 'S+', expected: QuantumState.SIM_FLOW },
    { symbol: 'S-', expected: QuantumState.SIM_ANTIFLOW },
    { symbol: 'S~', expected: QuantumState.SIM_PARTIAL },
    { symbol: 'R+', expected: QuantumState.REAL_FLOW },
    { symbol: 'R-', expected: QuantumState.REAL_ANTIFLOW },
    { symbol: 'R~', expected: QuantumState.REAL_PARTIAL },
    { symbol: 'T>R', expected: QuantumState.TRANSITION_TO_REAL },
    { symbol: 'T>S', expected: QuantumState.TRANSITION_TO_SIM },
    { symbol: 'INVALID', expected: null }
  ];
  
  testCases.forEach(({ symbol, expected }) => {
    const result = symbolToQuantumState(symbol);
    const passed = result === expected;
    
    console.log(`${passed ? '✅' : '❌'} ${symbol} -> ${result} ${passed ? 'PASSED' : `FAILED (expected ${expected})`}`);
  });
}

/**
 * Run tests for parseSymbolicPrefixToState()
 */
function testParseSymbolicPrefixToState() {
  console.log('\n[α/S+/🧪] Testing parseSymbolicPrefixToState()');
  
  // Test parsing and converting states
  const testCases = [
    { 
      message: '[α/S+/💻] Test message', 
      expected: {
        timeline: 'α',
        state: QuantumState.SIM_FLOW,
        stateSymbol: 'S+',
        domain: '💻',
        message: 'Test message'
      }
    },
    { 
      message: '[2030β/R-/🔒] Security breach', 
      expected: {
        timeline: '2030β',
        state: QuantumState.REAL_ANTIFLOW,
        stateSymbol: 'R-',
        domain: '🔒',
        message: 'Security breach'
      }
    },
    { 
      message: 'Invalid message without symbolic prefix', 
      expected: {
        message: 'Invalid message without symbolic prefix'
      }
    }
  ];
  
  testCases.forEach(({ message, expected }) => {
    const result = parseSymbolicPrefixToState(message);
    const stateMatches = result.state === expected.state;
    const timelineMatches = result.timeline === expected.timeline;
    const messageMatches = result.message === expected.message;
    const passed = stateMatches && timelineMatches && messageMatches;
    
    console.log(`${passed ? '✅' : '❌'} "${message}" -> ${passed ? 'PASSED' : 'FAILED'}`);
    if (!passed) {
      console.log('  Expected:', expected);
      console.log('  Received:', result);
    }
  });
}

/**
 * Run tests for extractStateFromMessage()
 */
function testExtractStateFromMessage() {
  console.log('\n[α/S+/🧪] Testing extractStateFromMessage()');
  
  // Test extracting states from messages
  const testCases = [
    { message: '[α/S+] Success message', expected: QuantumState.SIM_FLOW },
    { message: '[β/R-] Error message', expected: QuantumState.REAL_ANTIFLOW },
    { message: '[γ/T>R] Transition message', expected: QuantumState.TRANSITION_TO_REAL },
    { message: 'Invalid message', expected: null }
  ];
  
  testCases.forEach(({ message, expected }) => {
    const result = extractStateFromMessage(message);
    const passed = result === expected;
    
    console.log(`${passed ? '✅' : '❌'} "${message}" -> ${result} ${passed ? 'PASSED' : `FAILED (expected ${expected})`}`);
  });
}

/**
 * Run tests for legacyMessageToState()
 */
function testLegacyMessageToState() {
  console.log('\n[α/S+/🧪] Testing legacyMessageToState()');
  
  // Test converting legacy messages to states
  const testCases = [
    { message: '[QUANTUM_STATE: SIM_FLOW] Legacy message', expected: QuantumState.SIM_FLOW },
    { message: '[QUANTUM_STATE: REAL_ANTIFLOW] Legacy error', expected: QuantumState.REAL_ANTIFLOW },
    { message: '[QUANTUM_STATE: TRANSITION_TO_REAL] Legacy transition', expected: QuantumState.TRANSITION_TO_REAL },
    { message: '[QUANTUM_STATE: INVALID] Invalid state', expected: null },
    { message: 'Not a legacy message', expected: null }
  ];
  
  testCases.forEach(({ message, expected }) => {
    const result = legacyMessageToState(message);
    const passed = result === expected;
    
    console.log(`${passed ? '✅' : '❌'} "${message}" -> ${result} ${passed ? 'PASSED' : `FAILED (expected ${expected})`}`);
  });
}

/**
 * Run tests for getQuantumStateDescription()
 */
function testGetQuantumStateDescription() {
  console.log('\n[α/S+/🧪] Testing getQuantumStateDescription()');
  
  // Test getting descriptions for states
  const testCases = [
    { state: QuantumState.SIM_FLOW, expected: 'Simulation Success' },
    { state: QuantumState.REAL_ANTIFLOW, expected: 'Reality Failure' },
    { state: QuantumState.TRANSITION_TO_REAL, expected: 'Transitioning to Reality' },
    { state: 'INVALID', expected: 'Unknown State' }
  ];
  
  testCases.forEach(({ state, expected }) => {
    const result = getQuantumStateDescription(state);
    const passed = result === expected;
    
    console.log(`${passed ? '✅' : '❌'} ${state} -> "${result}" ${passed ? 'PASSED' : `FAILED (expected "${expected}")`}`);
  });
}

/**
 * Run all tests
 */
function runTests() {
  console.log('[α/S+/🧪] TESTING SYMBOLIC-TO-QUANTUMSTATE UTILITIES');
  
  testSymbolToQuantumState();
  testParseSymbolicPrefixToState();
  testExtractStateFromMessage();
  testLegacyMessageToState();
  testGetQuantumStateDescription();
  
  console.log('\n[α/S+/✅] ALL TESTS COMPLETED');
}

// Execute the tests
runTests();