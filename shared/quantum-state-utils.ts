/**
 * Quantum State Utilities
 * 
 * Helper functions for working with the unified QuantumState enum.
 * These utilities support the Explicit-Implicit Quantum Balance by providing
 * explicit methods to extract and manipulate quantum state information.
 */

import { QuantumState } from './schema-minimal';

/**
 * Determine if a QuantumState is in the simulation context
 */
export function isSimulationState(state: QuantumState): boolean {
  return state.toString().startsWith('SIM_');
}

/**
 * Determine if a QuantumState is in the reality context
 */
export function isRealityState(state: QuantumState): boolean {
  return state.toString().startsWith('REAL_');
}

/**
 * Determine if a QuantumState is in a transition state
 */
export function isTransitionState(state: QuantumState): boolean {
  return state.toString().startsWith('TRANSITION_');
}

/**
 * Determine if a QuantumState represents system alignment (FLOW)
 */
export function isFlowState(state: QuantumState): boolean {
  return state === QuantumState.SIM_FLOW || 
         state === QuantumState.REAL_FLOW;
}

/**
 * Determine if a QuantumState represents system misalignment (ANTIFLOW)
 */
export function isAntiFlowState(state: QuantumState): boolean {
  return state === QuantumState.SIM_ANTIFLOW || 
         state === QuantumState.REAL_ANTIFLOW;
}

/**
 * Determine if a QuantumState represents partial system alignment
 */
export function isPartialFlowState(state: QuantumState): boolean {
  return state === QuantumState.SIM_PARTIAL || 
         state === QuantumState.REAL_PARTIAL;
}

/**
 * Extract the context tag from a QuantumState (for backward compatibility)
 */
export function extractContextTag(state: QuantumState): string {
  if (isSimulationState(state)) {
    return 'SIMULATION';
  } else if (isRealityState(state)) {
    return 'REALITY';
  } else if (state === QuantumState.TRANSITION_TO_REAL) {
    return 'TRANSITION_TO_REALITY';
  } else if (state === QuantumState.TRANSITION_TO_SIM) {
    return 'TRANSITION_TO_SIMULATION';
  } else {
    return 'UNKNOWN';
  }
}

/**
 * Format a message with the appropriate context tag based on quantum state
 */
export function formatWithQuantumState(message: string, state: QuantumState): string {
  // If the message already has a quantum state context tag, don't add another
  if (message.includes('[CONTEXT: SIMULATION]') || 
      message.includes('[CONTEXT: REALITY]') ||
      message.includes('[QUANTUM_STATE:')) {
    return message;
  }
  
  // Add the unified quantum state tag at the beginning of the message
  return `[QUANTUM_STATE: ${state}] ${message}`;
}

/**
 * Convert from the legacy separation of REALITY_MODE boolean and FlowType 
 * to the unified QuantumState enum
 */
export function legacyToQuantumState(isRealityMode: boolean, flowType: string): QuantumState {
  if (isRealityMode) {
    switch (flowType) {
      case 'FLOW':
        return QuantumState.REAL_FLOW;
      case 'ANTIFLOW':
        return QuantumState.REAL_ANTIFLOW;
      default:
        return QuantumState.REAL_PARTIAL;
    }
  } else {
    switch (flowType) {
      case 'FLOW':
        return QuantumState.SIM_FLOW;
      case 'ANTIFLOW':
        return QuantumState.SIM_ANTIFLOW;
      default:
        return QuantumState.SIM_PARTIAL;
    }
  }
}

/**
 * Get the default QuantumState based on the environment
 */
export function getDefaultQuantumState(nodeEnv: string = process.env.NODE_ENV || 'development'): QuantumState {
  return nodeEnv === 'production' ? QuantumState.REAL_FLOW : QuantumState.SIM_FLOW;
}