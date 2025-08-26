/**
 * Coherence Metrics Module Entry Point
 * 
 * This file exports all coherence metric functionality from the coherence-metrics directory.
 * It serves as the main entry point for accessing coherence calculation capabilities.
 * 
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */

// Export all from CoherenceMetrics.ts (main interface)
export * from './coherence-metrics/CoherenceMetrics.js';

// Additional direct exports from submodules if needed
// These are already re-exported from CoherenceMetrics, but can be accessed directly if needed
export { 
  computeKuramotoR,
  valuesToPhases,
  calculatePhaseCoherence,
  computeWeightedKuramotoR,
  calculateComplexPhaseCoherence
} from './coherence-metrics/KuramotoParameter.js';

export {
  computeCosineSimilarity,
  normalizeCosineSimilarity,
  computeEuclideanSimilarity,
  calculateMeanVector,
  calculateVectorCoherence,
  calculateComplexVectorCoherence
} from './coherence-metrics/VectorAlignment.js';

// Additional exports for other modules that depend on them
/**
 * Calculate the Quantum Coherence Threshold Formula (QCTF)
 * 
 * @param params Formula parameters 
 * @returns QCTF value
 */
export function calculateQCTF(params: {
  CI?: number;
  GEF?: number;
  QEAI?: number;
  theta?: number;
} = {}): number {
  // Set defaults for any missing parameters
  const CI = params.CI ?? 0.75; // Coherence Index (baseline coherence)
  const GEF = params.GEF ?? 0.68; // Global Entropy Factor
  const QEAI = params.QEAI ?? 0.33; // Quantum Entanglement AI Index
  const theta = params.theta ?? 0.0; // Phase parameter (0 for Yang/stability, 1 for Yin/exploration)
  
  // Calculate QCTF = CI + (GEF × QEAI × cos θ)
  const phaseModulation = Math.cos(theta * Math.PI / 2);
  return CI + (GEF * QEAI * phaseModulation);
}

/**
 * Constants for the Ouroboros cycle
 */
export const OUROBOROS_CONSTANTS = {
  // The 3:1 ratio for stability:exploration cycles
  STABILITY_CYCLES: 3,
  EXPLORATION_CYCLES: 1,
  
  // Cycle lengths for each mode (derived from the cycle ratio)
  STABILITY_CYCLE_LENGTH: 30,  // 30 cycles in stability mode
  EXPLORATION_CYCLE_LENGTH: 10, // 10 cycles in exploration mode
  
  // Threshold values
  STABILITY_MODE_COHERENCE: 0.75,
  EXPLORATION_MODE_COHERENCE: 0.25,
  
  // Transition thresholds
  SWITCH_TO_STABILITY_ABOVE: 0.85,
  SWITCH_TO_EXPLORATION_BELOW: 0.65,
  SWITCH_TO_EXPLORE_BELOW: 0.65, // Synonym for SWITCH_TO_EXPLORATION_BELOW for backward compat
  
  // Target for perfect attractor alignment
  ATTRACTOR_TARGET: 0.7500,
  TARGET_COHERENCE: 0.7500,
  TARGET_TOLERANCE: 0.05
};