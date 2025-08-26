/**
 * Brazilian Wave Protocol - Shared Constants & Types
 * 
 * This module provides shared constants and types for the Brazilian Wave Protocol.
 * It ensures consistent values across client and server components.
 * 
 * [QUANTUM_STATE: SHARED_BRAZILIAN_WAVE]
 */

// Core constants
export const STABILITY_COHERENCE = 0.7500;    // 3:1 ratio stability threshold (75%)
export const EXPLORATION_COHERENCE = 0.2494;  // 1:3 ratio exploration threshold (24.94%)
export const COHERENCE_PRODUCT = STABILITY_COHERENCE * (1 / EXPLORATION_COHERENCE); // Should equal ~3.0072

// Wave mode enum
export const WaveMode = {
  HARMONIC: 'harmonic',    // Regular, balanced oscillations
  CHAOTIC: 'chaotic',      // Higher variability, exploratory oscillations
  RESONANT: 'resonant',    // Amplifying specific temporal scales
  QUANTUM: 'quantum'       // Direct implementation of quantum coherence principles
};

// Temporal layer enum
export const TemporalLayer = {
  MICRO: 'micro',   // Fast oscillations (moments, seconds)
  MESO: 'meso',     // Medium oscillations (minutes, hours)
  MACRO: 'macro'    // Slow oscillations (days, weeks)
};

// Wave constants
export const WAVE_CONSTANTS = {
  // Base frequency multipliers for each temporal layer
  LAYER_MULTIPLIERS: {
    [TemporalLayer.MICRO]: 4.0,   // Faster oscillations
    [TemporalLayer.MESO]: 1.0,    // Medium oscillations
    [TemporalLayer.MACRO]: 0.25   // Slower oscillations
  },
  // Golden ratio (phi) constant for resonant mode
  PHI: 1.618033988749895,
  // Quantum coherence thresholds
  STABILITY_THRESHOLD: STABILITY_COHERENCE,
  EXPLORATION_THRESHOLD: EXPLORATION_COHERENCE,
  // Oscillation period for cycling through coherence states (in time units)
  CYCLE_PERIOD: 12.0,
  // Phase shift between layers to create nested fractals
  LAYER_PHASE_SHIFTS: {
    [TemporalLayer.MICRO]: 0,      // Base phase
    [TemporalLayer.MESO]: Math.PI / 3,    // Shifted by 60 degrees
    [TemporalLayer.MACRO]: 2 * Math.PI / 3 // Shifted by 120 degrees
  }
};

// Wave configuration interface (shared between client and server)
export const DefaultWaveConfig = {
  mode: WaveMode.HARMONIC,
  baseCoherence: STABILITY_COHERENCE, // Exact 0.7500 value
  variability: 0.12,  // Allows full oscillation between stability and exploration
  useQuantumThresholds: true  // Whether to enforce exact QCTF thresholds
};