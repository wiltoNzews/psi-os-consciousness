/**
 * Statistical Validator Service
 * 
 * This service provides statistical validation functions for quantum experiments,
 * implementing the standardized formulas from the TSAR BOMBA documentation.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import { QuantumGlossary } from '../qrn/quantum-glossary.js';

// Initialize quantum glossary for context tagging
const quantumGlossary = new QuantumGlossary();

/**
 * Calculate the absolute percentage shift between intent and control bits
 * Implements the standardized REG Shift (ΔP) formula:
 * ΔP = |mean(intent_bits) - mean(control_bits)| · 100%
 * 
 * @param intentBits - Array of bits from intent trials
 * @param controlBits - Array of bits from control trials
 * @returns Percentage shift between intent and control means
 */
export function calculateREGShift(intentBits: number[], controlBits: number[]): number {
  if (!intentBits.length || !controlBits.length) {
    quantumGlossary.logError('Cannot calculate REG shift with empty datasets', new Error('Invalid input'));
    return 0;
  }

  try {
    // Calculate means of both datasets
    const intentMean = intentBits.reduce((sum, bit) => sum + bit, 0) / intentBits.length;
    const controlMean = controlBits.reduce((sum, bit) => sum + bit, 0) / controlBits.length;
    
    // Calculate absolute difference and convert to percentage
    const shift = Math.abs(intentMean - controlMean) * 100;
    
    quantumGlossary.recordFlowMetric(
      'REG_SHIFT',
      'statistical-validator',
      shift,
      { intentSampleSize: intentBits.length, controlSampleSize: controlBits.length }
    );
    
    return shift;
  } catch (error) {
    quantumGlossary.logError('Error calculating REG shift', error as Error);
    return 0;
  }
}

/**
 * Calculate the standard error of the REG shift
 * Used in the significance calculation
 * 
 * @param intentBits - Array of bits from intent trials
 * @returns Standard error of the intent bits
 */
export function calculateStandardError(intentBits: number[]): number {
  if (!intentBits.length) {
    return 0;
  }

  try {
    const mean = intentBits.reduce((sum, bit) => sum + bit, 0) / intentBits.length;
    
    // Calculate variance
    const variance = intentBits.reduce((sum, bit) => sum + Math.pow(bit - mean, 2), 0) / intentBits.length;
    
    // Calculate standard error (standard deviation / sqrt(n))
    return (Math.sqrt(variance) / Math.sqrt(intentBits.length)) * 100;
  } catch (error) {
    quantumGlossary.logError('Error calculating standard error', error as Error);
    return 0;
  }
}

/**
 * Calculate the statistical significance of the REG shift
 * Implements the standardized Significance (σ) formula:
 * σ = ΔP/ΔP_std
 * 
 * @param regShift - The REG shift (ΔP)
 * @param standardError - The standard error (ΔP_std)
 * @returns Significance value (σ)
 */
export function calculateSignificance(regShift: number, standardError: number): number {
  if (standardError === 0) {
    quantumGlossary.logError('Cannot calculate significance with zero standard error', new Error('Invalid input'));
    return 0;
  }

  try {
    const significance = regShift / standardError;
    
    quantumGlossary.recordFlowMetric(
      'SIGNIFICANCE',
      'statistical-validator',
      significance,
      { regShift, standardError }
    );
    
    return significance;
  } catch (error) {
    quantumGlossary.logError('Error calculating significance', error as Error);
    return 0;
  }
}

/**
 * Calculate the stability of a quantum bit sequence
 * Implements the standardized Stability (S) formula:
 * S = 1 - Var(bits)
 * 
 * @param bits - Array of quantum bits
 * @returns Stability value between 0 and 1
 */
export function calculateBitStability(bits: number[]): number {
  if (!bits.length) {
    return 0;
  }

  try {
    const mean = bits.reduce((sum, bit) => sum + bit, 0) / bits.length;
    
    // Calculate variance
    const variance = bits.reduce((sum, bit) => sum + Math.pow(bit - mean, 2), 0) / bits.length;
    
    // Calculate stability (1 - variance)
    const stability = 1 - variance;
    
    quantumGlossary.recordFlowMetric(
      'STABILITY',
      'statistical-validator',
      stability,
      { sampleSize: bits.length, variance }
    );
    
    return stability;
  } catch (error) {
    quantumGlossary.logError('Error calculating bit stability', error as Error);
    return 0;
  }
}

/**
 * Comprehensive statistical analysis of quantum experiment results
 * 
 * @param intentBits - Array of bits from intent trials
 * @param controlBits - Array of bits from control trials
 * @returns Complete statistical analysis results
 */
export function analyzeExperimentalResults(intentBits: number[], controlBits: number[]): {
  regShift: number;
  standardError: number;
  significance: number;
  stability: number;
  pValue: number;
  confidenceInterval: [number, number];
} {
  const regShift = calculateREGShift(intentBits, controlBits);
  const standardError = calculateStandardError(intentBits);
  const significance = calculateSignificance(regShift, standardError);
  const stability = calculateBitStability([...intentBits, ...controlBits]);
  
  // Approximate p-value from z-score (significance)
  // Using simple approximation for normal distribution
  const pValue = Math.min(1, 2 * (1 - normCDF(Math.abs(significance))));
  
  // Calculate 95% confidence interval (±1.96 standard errors)
  const halfInterval = 1.96 * standardError;
  const confidenceInterval: [number, number] = [
    Math.max(0, regShift - halfInterval),
    regShift + halfInterval
  ];
  
  quantumGlossary.recordFlowMetric(
    'EXPERIMENT_ANALYSIS',
    'statistical-validator',
    significance,
    {
      regShift,
      standardError,
      significance,
      stability,
      pValue,
      confidenceInterval,
      intentSampleSize: intentBits.length,
      controlSampleSize: controlBits.length
    }
  );
  
  return {
    regShift,
    standardError,
    significance,
    stability,
    pValue,
    confidenceInterval
  };
}

/**
 * Cumulative distribution function for standard normal distribution
 * Helper function for p-value calculation
 * 
 * @param z - Z-score
 * @returns Cumulative probability
 */
function normCDF(z: number): number {
  // Approximation of the cumulative distribution function
  // for the standard normal distribution
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  
  const p = 0.2316419;
  const c = 0.39894228;
  
  if (z >= 0) {
    const t = 1.0 / (1.0 + p * z);
    return 1.0 - c * Math.exp(-z * z / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * z);
    return c * Math.exp(-z * z / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  }
}

// Export the module
export default {
  calculateREGShift,
  calculateStandardError,
  calculateSignificance,
  calculateBitStability,
  analyzeExperimentalResults
};