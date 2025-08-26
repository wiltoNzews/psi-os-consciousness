/**
 * Symbolic to QuantumState Mapping Utilities
 * 
 * This module provides utilities for converting symbolic state representations
 * back to QuantumState enum values, allowing for bidirectional conversion
 * between the symbolic communication protocol and the enum system.
 * 
 * @see SYMBOL_DICTIONARY.md for full documentation on the symbolic protocol
 */

import { QuantumState } from '../../shared/schema-minimal.js';
import { parseSymbolicPrefix } from './symbolic-utils.js';

/**
 * Maps symbolic state representations to their QuantumState enum values
 */
const SYMBOLIC_TO_QUANTUM_STATE: Record<string, QuantumState> = {
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
 * @param symbolicState The symbolic state representation (e.g., 'S+', 'R-')
 * @returns The corresponding QuantumState enum value or null if not found
 * 
 * @example
 * symbolToQuantumState('S+')
 * // Returns: QuantumState.SIM_FLOW
 */
export function symbolToQuantumState(symbolicState: string): QuantumState | null {
  return SYMBOLIC_TO_QUANTUM_STATE[symbolicState] || null;
}

/**
 * Parse a message with symbolic prefix and convert the state to a QuantumState enum value
 * 
 * @param formattedMessage The message with symbolic prefix
 * @returns Object containing timeline, state (as QuantumState), domain, and message
 * 
 * @example
 * parseSymbolicPrefixToState("[α/S+/💻] Task completed")
 * // Returns: { timeline: "α", state: QuantumState.SIM_FLOW, stateSymbol: "S+", domain: "💻", message: "Task completed" }
 */
export function parseSymbolicPrefixToState(formattedMessage: string): {
  message: string;
  timeline?: string;
  state?: QuantumState;
  stateSymbol?: string;
  domain?: string;
} {
  // First, parse the message using the standard parser
  const parsed = parseSymbolicPrefix(formattedMessage);
  
  // Default result
  const result = {
    ...parsed,
    state: undefined as QuantumState | undefined,
    stateSymbol: parsed.state
  };
  
  // Convert the symbolic state to a QuantumState enum value if possible
  if (parsed.state && SYMBOLIC_TO_QUANTUM_STATE[parsed.state]) {
    result.state = SYMBOLIC_TO_QUANTUM_STATE[parsed.state];
  }
  
  return result;
}

/**
 * Extract the QuantumState from a formatted message
 * 
 * @param formattedMessage The message with symbolic prefix
 * @returns The corresponding QuantumState enum value or null if not found
 * 
 * @example
 * extractStateFromMessage("[α/S+/💻] Task completed")
 * // Returns: QuantumState.SIM_FLOW
 */
export function extractStateFromMessage(formattedMessage: string): QuantumState | null {
  const parsed = parseSymbolicPrefix(formattedMessage);
  
  if (parsed.state) {
    return SYMBOLIC_TO_QUANTUM_STATE[parsed.state] || null;
  }
  
  return null;
}

/**
 * Convert a legacy formatted message directly to a QuantumState enum value
 * 
 * @param legacyMessage The message with legacy prefix
 * @returns The corresponding QuantumState enum value or null if not found
 * 
 * @example
 * legacyMessageToState("[QUANTUM_STATE: SIM_FLOW] Task completed")
 * // Returns: QuantumState.SIM_FLOW
 */
export function legacyMessageToState(legacyMessage: string): QuantumState | null {
  const match = legacyMessage.match(/^\[QUANTUM_STATE:\s*([A-Z_]+)\].*/);
  
  if (match && match[1] && QuantumState[match[1] as keyof typeof QuantumState]) {
    const state = match[1] as keyof typeof QuantumState;
    return QuantumState[state];
  }
  
  return null;
}

/**
 * Maps the QuantumState to its human-readable description
 */
export function getQuantumStateDescription(state: QuantumState): string {
  const descriptions: Record<QuantumState, string> = {
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