/**
 * Symbolic to QuantumState Mapping Utilities
 * 
 * This module provides utilities for converting symbolic state representations
 * back to QuantumState enum values, allowing for bidirectional conversion
 * between the symbolic communication protocol and the enum system.
 * 
 * @see SYMBOL_DICTIONARY.md for full documentation on the symbolic protocol
 */

// Self-contained version of QuantumState enum to avoid import issues
// This matches the definition in shared/schema-minimal.ts
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
 * Maps symbolic state representations to their QuantumState enum values
 */
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
 * Convert a symbolic state representation to a QuantumState enum value
 * 
 * @param {string} symbolicState - The symbolic state representation (e.g., 'S+', 'R-')
 * @returns {string|null} - The corresponding QuantumState enum value or null if not found
 * 
 * @example
 * symbolToQuantumState('S+')
 * // Returns: QuantumState.SIM_FLOW
 */
export function symbolToQuantumState(symbolicState) {
  return SYMBOLIC_TO_QUANTUM_STATE[symbolicState] || null;
}

/**
 * Parse a message with symbolic prefix and convert the state to a QuantumState enum value
 * 
 * @param {string} formattedMessage - The message with symbolic prefix
 * @param {Function} parseFunc - The parsing function to use (default: parseSymbolicPrefix)
 * @returns {Object} - Object containing timeline, state (as QuantumState), domain, and message
 * 
 * @example
 * parseSymbolicPrefixToState("[α/S+/💻] Task completed")
 * // Returns: { timeline: "α", state: QuantumState.SIM_FLOW, stateSymbol: "S+", domain: "💻", message: "Task completed" }
 */
export function parseSymbolicPrefixToState(formattedMessage, parseFunc) {
  // Use provided parser or import parseSymbolicPrefix from the main utility file
  const parseFunction = parseFunc || parseSymbolicPrefixFromImport;
  
  // First, parse the message using the parser
  const parsed = parseFunction(formattedMessage);
  
  // Convert the symbolic state to a QuantumState enum value if possible
  if (parsed.state && SYMBOLIC_TO_QUANTUM_STATE[parsed.state]) {
    return {
      ...parsed,
      stateSymbol: parsed.state,  // Keep the original symbolic representation
      state: SYMBOLIC_TO_QUANTUM_STATE[parsed.state]  // Replace with the enum value
    };
  }
  
  // If no conversion is possible, return the original parsed object
  return parsed;
}

// Helper function to parse symbolic prefixes
function parseSymbolicPrefixFromImport(formattedMessage) {
  // Default implementation if import isn't available
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
 * Extract the QuantumState from a formatted message
 * 
 * @param {string} formattedMessage - The message with symbolic prefix
 * @returns {string|null} - The corresponding QuantumState enum value or null if not found
 * 
 * @example
 * extractStateFromMessage("[α/S+/💻] Task completed")
 * // Returns: QuantumState.SIM_FLOW
 */
export function extractStateFromMessage(formattedMessage) {
  const parsed = parseSymbolicPrefixFromImport(formattedMessage);
  
  if (parsed.state) {
    return SYMBOLIC_TO_QUANTUM_STATE[parsed.state] || null;
  }
  
  return null;
}

/**
 * Convert a legacy formatted message directly to a QuantumState enum value
 * 
 * @param {string} legacyMessage - The message with legacy prefix
 * @returns {string|null} - The corresponding QuantumState enum value or null if not found
 * 
 * @example
 * legacyMessageToState("[QUANTUM_STATE: SIM_FLOW] Task completed")
 * // Returns: QuantumState.SIM_FLOW
 */
export function legacyMessageToState(legacyMessage) {
  const match = legacyMessage.match(/^\[QUANTUM_STATE:\s*([A-Z_]+)\].*/);
  
  if (match && match[1] && QuantumState[match[1]]) {
    return QuantumState[match[1]];
  }
  
  return null;
}

/**
 * Maps the QuantumState to its human-readable description
 * 
 * @param {string} state - The QuantumState enum value
 * @returns {string} - Human-readable description of the state
 * 
 * @example
 * getQuantumStateDescription(QuantumState.SIM_FLOW)
 * // Returns: "Simulation Success"
 */
export function getQuantumStateDescription(state) {
  const descriptions = {
    [QuantumState.SIM_FLOW]: 'Simulation Success',
    [QuantumState.SIM_ANTIFLOW]: 'Simulation Failure',
    [QuantumState.SIM_PARTIAL]: 'Simulation Partial Success',
    [QuantumState.REAL_FLOW]: 'Reality Success',
    [QuantumState.REAL_ANTIFLOW]: 'Reality Failure',
    [QuantumState.REAL_PARTIAL]: 'Reality Partial Success',
    [QuantumState.TRANSITION_TO_REAL]: 'Transitioning to Reality',
    [QuantumState.TRANSITION_TO_SIM]: 'Transitioning to Simulation'
  };
  
  return descriptions[state] || 'Unknown State';
}