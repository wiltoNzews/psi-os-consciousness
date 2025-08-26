/**
 * Lemniscate System Constants
 * 
 * This file contains the core constants and interfaces used across
 * the Brazilian Wave Protocol and Quantum Coherence Threshold Formula.
 */

// Fundamental Coherence Thresholds
export const STABILITY_COHERENCE = 0.7500;  // 3:1 ratio (75% coherent, 25% non-coherent)
export const EXPLORATION_COHERENCE = 0.2494; // 1:3 ratio (25% coherent, 75% non-coherent)
export const COHERENCE_PRODUCT = STABILITY_COHERENCE * (1 / EXPLORATION_COHERENCE); // Should be ~3.0072

// Temporal Scale Frequencies (relative to meso scale)
export const TEMPORAL_SCALE_FREQUENCIES = {
  MICRO: 4.0,    // 4x faster than meso scale
  MESO: 1.0,     // Reference scale (1x)
  MACRO: 0.25    // 4x slower than meso scale
};

// Wave Mode Types
export const WaveMode = {
  HARMONIC: 'harmonic', // Regular, balanced oscillations
  CHAOTIC: 'chaotic',   // High-variability, exploratory oscillations
  RESONANT: 'resonant', // Golden ratio based oscillations
  QUANTUM: 'quantum'    // Direct implementation of quantum coherence
};

// Default Wave Configuration
export const DefaultWaveConfig = {
  mode: WaveMode.HARMONIC,
  baseCoherence: STABILITY_COHERENCE,
  variability: 0.12,
  useQuantumThresholds: true
};

// Temporal Layer Interfaces
export const TemporalLayer = {
  MICRO: 'micro',
  MESO: 'meso',
  MACRO: 'macro'
};

// QCTF Calculator Constants
export const QCTF_CONSTANTS = {
  // Smoothing alpha values for each temporal scale
  SMOOTHING_ALPHA: {
    [TemporalLayer.MICRO]: 0.6,  // Faster response
    [TemporalLayer.MESO]: 0.3,   // Medium response
    [TemporalLayer.MACRO]: 0.1   // Slower, more stable response
  },
  
  // Normalization ranges
  NORMALIZATION: {
    MIN_POSSIBLE: 0.0,
    MAX_POSSIBLE: 1.0
  },
  
  // Weights for scale combination
  COMBINATION_WEIGHTS: {
    [TemporalLayer.MICRO]: 0.25,
    [TemporalLayer.MESO]: 0.5,
    [TemporalLayer.MACRO]: 0.25
  }
};

// Mathematical constants
export const MATHEMATICAL_CONSTANTS = {
  GOLDEN_RATIO: 1.618033988749895, // φ (phi)
  PI: Math.PI, 
  E: Math.E
};

// Wave Generation Constants
export const WAVE_CONSTANTS = {
  DEFAULT_POINTS: 100,
  DEFAULT_DURATION: 10, // in seconds
  FREQUENCY_MULTIPLIER: {
    [TemporalLayer.MICRO]: 5,  // Higher frequency for micro scale
    [TemporalLayer.MESO]: 1,   // Base frequency for meso scale
    [TemporalLayer.MACRO]: 0.2 // Lower frequency for macro scale
  },
  AMPLITUDE: {
    [TemporalLayer.MICRO]: 0.15,
    [TemporalLayer.MESO]: 0.25,
    [TemporalLayer.MACRO]: 0.35
  }
};

// Insight Types
export const InsightType = {
  CREATIVE: 'creative',
  STRUCTURED: 'structured',
  BALANCED: 'balanced',
  QUANTUM: 'quantum'
};

// Helper Functions
export const calculateCoherenceRatio = (coherence) => {
  const nonCoherence = 1 - coherence;
  return coherence / nonCoherence;
};

export const calculateInverseRatio = (coherence) => {
  const nonCoherence = 1 - coherence;
  return 1 / nonCoherence;
};

export const calculateCoherenceProduct = (coherence) => {
  return coherence * calculateInverseRatio(coherence);
};

export const isNearStabilityThreshold = (coherence, tolerance = 0.02) => {
  return Math.abs(coherence - STABILITY_COHERENCE) <= tolerance;
};

export const isNearExplorationThreshold = (coherence, tolerance = 0.02) => {
  return Math.abs(coherence - EXPLORATION_COHERENCE) <= tolerance;
};

export const formatNumber = (value) => {
  return parseFloat(value.toFixed(4));
};

export default {
  STABILITY_COHERENCE,
  EXPLORATION_COHERENCE,
  COHERENCE_PRODUCT,
  TEMPORAL_SCALE_FREQUENCIES,
  WaveMode,
  DefaultWaveConfig,
  TemporalLayer,
  QCTF_CONSTANTS,
  MATHEMATICAL_CONSTANTS,
  WAVE_CONSTANTS,
  InsightType,
  calculateCoherenceRatio,
  calculateInverseRatio,
  calculateCoherenceProduct,
  isNearStabilityThreshold,
  isNearExplorationThreshold,
  formatNumber
};