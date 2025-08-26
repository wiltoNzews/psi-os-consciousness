/**
 * Mode Controller - Shared Constants & Types
 * 
 * This module provides shared constants and types for the Lemniscate Mode Controller.
 * 
 * [QUANTUM_STATE: SHARED_MODE_CONTROLLER]
 */

// Import constants from brazilian-wave-protocol to ensure consistency
import { STABILITY_COHERENCE, EXPLORATION_COHERENCE } from './brazilian-wave-protocol.js';

// Temporal scale enum (used for coherence measurement scales)
export const TemporalScale = {
  MICRO: 'micro',   // Fast oscillations (seconds, minutes)
  MESO: 'meso',     // Medium oscillations (hours, days)
  MACRO: 'macro'    // Slow oscillations (weeks, months)
};

// Lemniscate mode enum (current operating mode)
export const LemniscateMode = {
  STABILITY: 'stability',       // High coherence mode (75%)
  EXPLORATION: 'exploration',   // Low coherence mode (25%)
  BALANCED: 'balanced',         // Balanced mode (oscillating)
  QUANTUM: 'quantum'            // Quantum precision mode
};

// Interface for the controller state
export const DefaultControllerState = {
  currentMode: LemniscateMode.BALANCED,
  currentCoherence: 0.5,
  isTransitioning: false,
  temporalScales: {
    [TemporalScale.MICRO]: {
      active: true,
      mode: LemniscateMode.BALANCED,
      coherence: 0.5,
      lastUpdate: new Date()
    },
    [TemporalScale.MESO]: {
      active: true,
      mode: LemniscateMode.BALANCED,
      coherence: 0.5,
      lastUpdate: new Date()
    },
    [TemporalScale.MACRO]: {
      active: true,
      mode: LemniscateMode.BALANCED,
      coherence: 0.5,
      lastUpdate: new Date()
    }
  },
  insights: [],
  lastUpdate: new Date()
};