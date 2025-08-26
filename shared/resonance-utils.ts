/**
 * Resonance Utilities
 * 
 * This module provides utility functions for calculating resonance between variants
 * in the 5D meta-orchestration system.
 * 
 * [QUANTUM_STATE: CHAOS_FLOW]
 */

import { LokiVariant } from './variant-generator';

// Use LokiVariant as QCTFVariant for compatibility
type QCTFVariant = LokiVariant;

/**
 * Calculates the resonance factor between two QCTF variants.
 * 
 * Enhanced Resonance Formula (R_ij(t)):
 * R_{ij}(t) = GEF(t) · [0.5 (1 - |Q_i - Q_j|) + 0.3 (1 - |Ψ_i - Ψ_j|) + 0.2 (1 - |QEAI_i - QEAI_j|)] e^{-Δt/60} [1 + 2 max(0, Ψ_i - 0.02)]
 * 
 * - GEF: Global Ethical Factor (default = 1.0)
 * - Q_i, Q_j: Variant QCTF values
 * - Ψ_i, Ψ_j: Entropy values
 * - QEAI_i, QEAI_j: Quantum Ethical Alignment Index values
 * - Δt: Time difference (seconds)
 * - Quantum Spike: Resonance doubles at entropy spikes (>0.02)
 * - Temporal Decay: Resonance fades every 60 seconds
 * 
 * @param variant1 First QCTF variant
 * @param variant2 Second QCTF variant
 * @param gef Global Ethical Factor (optional, default = 1.0)
 * @returns Resonance factor [0,1] where 1 is perfect resonance
 */
export function calculateResonance(variant1: QCTFVariant, variant2: QCTFVariant, gef: number = 1.0): number {
  // Constants
  const DECAY_CONSTANT = 60; // seconds
  
  // Calculate time difference in seconds
  const timeDiff = Math.abs(variant1.timestamp - variant2.timestamp) / 1000;
  
  // Calculate QCTF difference (normalized to [0,1])
  const qctfDiff = Math.abs(variant1.qctf - variant2.qctf);
  const normalizedQctfDiff = Math.min(1, qctfDiff / 2); // Divide by 2 since QCTF range is [-1,1]
  
  // Calculate entropy difference
  const entropyDiff = Math.abs(variant1.entropy - variant2.entropy);
  
  // Calculate QEAI difference (with fallback to 0.95 if not present)
  const qeai1 = (variant1 as any).qeai || 0.95;
  const qeai2 = (variant2 as any).qeai || 0.95;
  const qeaiDiff = Math.abs(qeai1 - qeai2);
  
  // Calculate novelty boost (resonance doubles at entropy spikes >0.02)
  const noveltyBoost = 1 + 2 * Math.max(0, Math.max(variant1.entropy, variant2.entropy) - 0.02);
  
  // Calculate temporal decay
  const decay = Math.exp(-timeDiff / DECAY_CONSTANT);
  
  // Calculate alignment components with new weights (50% QCTF, 30% entropy, 20% QEAI)
  const alignment = 
    0.5 * (1 - normalizedQctfDiff) + 
    0.3 * (1 - entropyDiff) + 
    0.2 * (1 - qeaiDiff);
  
  // Final enhanced resonance calculation with GEF, alignment, decay and novelty boost
  const resonanceFactor = gef * alignment * decay * noveltyBoost;
  
  // Ensure resonance is in [0,1]
  return Math.max(0, Math.min(1, resonanceFactor));
}

/**
 * Generates a resonance matrix for a set of variants.
 * 
 * @param variants Array of QCTF variants
 * @returns 2D matrix of resonance values between variants
 */
export function generateResonanceMatrix(variants: QCTFVariant[]): number[][] {
  const n = variants.length;
  const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Calculate resonance between each pair of variants
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1; // Self-resonance is always 1
      } else {
        matrix[i][j] = calculateResonance(variants[i], variants[j]);
      }
    }
  }
  
  return matrix;
}

/**
 * Adjusts variant weights based on resonance.
 * 
 * Variant Weight Adjustment (w_i(t)):
 * w_i(t) = ∑_{j≠i} R_ij(t) / ∑_{k} ∑_{m≠k} R_km(t)
 * 
 * @param variants Array of QCTF variants
 * @param resonanceMatrix 2D matrix of resonance values
 * @returns Array of updated variants with adjusted weights
 */
export function adjustVariantWeights(variants: QCTFVariant[], resonanceMatrix: number[][]): QCTFVariant[] {
  const n = variants.length;
  if (n === 0) return [];
  
  // Calculate the sum of all resonance values (excluding self-resonance)
  let totalResonance = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        totalResonance += resonanceMatrix[i][j];
      }
    }
  }
  
  // If totalResonance is 0, weights remain balanced
  if (totalResonance === 0) {
    const equalWeight = 1 / n;
    return variants.map(variant => ({
      ...variant,
      weight: equalWeight
    }));
  }
  
  // Calculate new weights based on resonance
  const updatedVariants = variants.map((variant, i) => {
    // Sum of resonance values for this variant (excluding self-resonance)
    let variantResonance = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        variantResonance += resonanceMatrix[i][j];
      }
    }
    
    // New weight is proportional to resonance
    const newWeight = variantResonance / totalResonance;
    
    return {
      ...variant,
      weight: newWeight
    };
  });
  
  return updatedVariants;
}

/**
 * Determines which variants should be pruned based on their weights.
 * 
 * @param variants Array of QCTF variants with adjusted weights
 * @param minWeight Minimum weight threshold (variants below this will be pruned)
 * @returns Array of variant IDs to prune
 */
export function determineVariantsToPrune(variants: QCTFVariant[], minWeight = 0.05): string[] {
  return variants
    .filter(variant => variant.weight < minWeight)
    .map(variant => variant.id);
}

/**
 * Generates a heatmap data structure for the frontend visualization.
 * 
 * @param variants Array of QCTF variants
 * @returns Heatmap data object for visualization
 */
export function generateResonanceHeatmap(variants: QCTFVariant[]): {
  variants: string[];
  matrix: number[][];
  timestamp: number;
} {
  const resonanceMatrix = generateResonanceMatrix(variants);
  return {
    variants: variants.map(v => v.id),
    matrix: resonanceMatrix,
    timestamp: Date.now()
  };
}

/**
 * Calculates the 5D QCTF output based on weighted variants.
 * 
 * @param variants Array of weighted QCTF variants
 * @returns 5D QCTF value
 */
export function calculate5DQCTF(variants: QCTFVariant[]): number {
  if (variants.length === 0) return 0;
  
  // Calculate weighted sum of QCTF values
  return variants.reduce((sum, variant) => sum + variant.weight * variant.qctf, 0);
}

/**
 * Calculates the average theta value across all variants, weighted by their importance.
 * 
 * @param variants Array of weighted QCTF variants
 * @returns Weighted average theta
 */
export function calculateAverageTheta(variants: QCTFVariant[]): number {
  if (variants.length === 0) return 0.5;
  
  // Calculate weighted sum of theta values
  const weightedSum = variants.reduce((sum, variant) => sum + variant.weight * variant.theta, 0);
  const weightSum = variants.reduce((sum, variant) => sum + variant.weight, 0);
  
  return weightSum > 0 ? weightedSum / weightSum : 0.5;
}