/**
 * Brazilian Wave Transformer
 * 
 * This service implements the simplified Brazilian Wave Transformation
 * from the GOD Formula: P_{t+1} = 0.75 · P_t + 0.25 · N(P_t,σ)
 * 
 * It provides practical ways to apply the 75%/25% (3:1) coherence-novelty
 * balance for pattern transformation and evolution.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import quantumGlossary from '../qrn/quantum-glossary.js';

// Constants from the GOD Formula
const COHERENCE_RATIO = 0.75; // The fundamental 3:1 ratio (75%)
const NOVELTY_RATIO = 0.25;   // The complementary 1:3 ratio (25%)
const GOLDEN_RATIO = 1.618;   // Φ (phi) for oscillation detection

/**
 * Variation generator function interface
 * Represents the N(P_t,σ) term in the formula
 */
export interface VariationGenerator<T> {
  (currentState: T, sigma: number): T;
}

/**
 * Brazilian Wave Transformer class
 * Implements the simplified practical form of the GOD Formula
 */
export class BrazilianWaveTransformer {
  /**
   * Transform a numerical value using the Brazilian Wave formula
   * 
   * @param currentValue - Current value (P_t)
   * @param sigma - Variation strength (novelty degree)
   * @returns Next value (P_{t+1})
   */
  public static transformValue(currentValue: number, sigma: number = 0.1): number {
    // Generate random variation with normal distribution around current value
    // This represents the N(P_t,σ) term in the formula
    const randomVariation = this.generateGaussianNoise(currentValue, sigma);
    
    // Apply the Brazilian Wave formula: P_{t+1} = 0.75 · P_t + 0.25 · N(P_t,σ)
    const nextValue = (COHERENCE_RATIO * currentValue) + (NOVELTY_RATIO * randomVariation);
    
    return nextValue;
  }
  
  /**
   * Transform an array of numerical values using the Brazilian Wave formula
   * 
   * @param currentValues - Array of current values
   * @param sigma - Variation strength (novelty degree)
   * @returns Array of next values
   */
  public static transformArray(currentValues: number[], sigma: number = 0.1): number[] {
    return currentValues.map(value => this.transformValue(value, sigma));
  }
  
  /**
   * Transform a generic state object using the Brazilian Wave formula
   * 
   * @param currentState - Current state object (P_t)
   * @param variationGenerator - Function to generate new variations
   * @param sigma - Variation strength (novelty degree)
   * @returns Next state (P_{t+1})
   */
  public static transformState<T>(
    currentState: T,
    variationGenerator: VariationGenerator<T>,
    sigma: number = 0.1
  ): T {
    try {
      // Generate variation using the provided generator function
      // This represents the N(P_t,σ) term in the formula
      const variation = variationGenerator(currentState, sigma);
      
      // For objects, we need to properly combine current and variation
      // This varies based on the type of data
      
      if (typeof currentState === 'number') {
        // For numbers, we can directly apply the formula
        return ((COHERENCE_RATIO * (currentState as number)) + 
                (NOVELTY_RATIO * (variation as number))) as T;
      } 
      else if (Array.isArray(currentState)) {
        // For arrays, apply formula to each element
        if (!Array.isArray(variation)) {
          throw new Error('Variation must be array when current state is array');
        }
        
        return currentState.map((val, index) => {
          if (typeof val === 'number' && typeof variation[index] === 'number') {
            return (COHERENCE_RATIO * val) + (NOVELTY_RATIO * variation[index]);
          }
          return val; // Non-numeric values are preserved
        }) as T;
      }
      else if (typeof currentState === 'object' && currentState !== null) {
        // For objects, apply formula to each numeric property
        const result = { ...currentState };
        
        for (const key in variation) {
          if (
            typeof (currentState as any)[key] === 'number' && 
            typeof (variation as any)[key] === 'number'
          ) {
            (result as any)[key] = 
              (COHERENCE_RATIO * (currentState as any)[key]) + 
              (NOVELTY_RATIO * (variation as any)[key]);
          }
        }
        
        return result;
      }
      
      // For other types, return as is
      return currentState;
    } catch (error) {
      quantumGlossary.logError('Error transforming state', error as Error);
      return currentState; // Return unchanged on error
    }
  }
  
  /**
   * Chain multiple iterations of the Brazilian Wave transformation
   * 
   * @param initialState - Starting state (P_0)
   * @param iterations - Number of iterations to perform
   * @param sigma - Variation strength (novelty degree)
   * @returns Final state after all iterations
   */
  public static iterativeTransform(
    initialState: number,
    iterations: number = 1,
    sigma: number = 0.1
  ): number {
    let currentState = initialState;
    
    for (let i = 0; i < iterations; i++) {
      currentState = this.transformValue(currentState, sigma);
    }
    
    return currentState;
  }
  
  /**
   * Create a time series of transformations starting from an initial state
   * 
   * @param initialState - Starting state (P_0)
   * @param steps - Number of steps to simulate
   * @param sigma - Variation strength (novelty degree)
   * @returns Array of states over time [P_0, P_1, P_2, ..., P_n]
   */
  public static generateTimeSeries(
    initialState: number,
    steps: number = 10,
    sigma: number = 0.1
  ): number[] {
    const series = [initialState];
    let currentState = initialState;
    
    for (let i = 0; i < steps; i++) {
      currentState = this.transformValue(currentState, sigma);
      series.push(currentState);
    }
    
    return series;
  }
  
  /**
   * Check if a series of values exhibits golden ratio oscillation
   * 
   * @param series - Array of values to analyze
   * @returns True if golden ratio pattern is detected
   */
  public static detectGoldenRatioOscillation(series: number[]): boolean {
    // Need at least 5 points for meaningful analysis
    if (series.length < 5) return false;
    
    // Find local extrema (peaks and valleys)
    const extrema: number[] = [];
    for (let i = 1; i < series.length - 1; i++) {
      if ((series[i] > series[i-1] && series[i] > series[i+1]) || 
          (series[i] < series[i-1] && series[i] < series[i+1])) {
        extrema.push(series[i]);
      }
    }
    
    // Need at least 2 extrema to calculate a ratio
    if (extrema.length < 2) return false;
    
    // Calculate ratios between consecutive extrema
    const ratios: number[] = [];
    for (let i = 0; i < extrema.length - 1; i++) {
      const ratio = Math.max(extrema[i], extrema[i+1]) / 
                    Math.min(extrema[i], extrema[i+1]);
      ratios.push(ratio);
    }
    
    // Check if any ratio is close to golden ratio (1.618)
    const isGoldenRatioPresent = ratios.some(ratio => 
      Math.abs(ratio - GOLDEN_RATIO) < 0.1
    );
    
    return isGoldenRatioPresent;
  }
  
  /**
   * Adaptive transformation with varying sigma based on distance from attractor
   * 
   * @param currentValue - Current value
   * @param attractor - Attractor value (default: 0.75)
   * @param baseSigma - Base variation strength
   * @returns Next value with adaptive variation
   */
  public static adaptiveTransform(
    currentValue: number,
    attractor: number = 0.75,
    baseSigma: number = 0.1
  ): number {
    // Calculate distance from attractor
    const distance = Math.abs(currentValue - attractor);
    
    // Adjust sigma based on distance (farther = higher sigma)
    const adaptiveSigma = baseSigma * (1 + distance);
    
    // Apply transformation with adaptive sigma
    return this.transformValue(currentValue, adaptiveSigma);
  }
  
  /**
   * Complex state transformation with multi-dimensional attractions
   * Implements a more complete version of the GOD Formula with
   * multiple dimensional factors
   * 
   * @param state - Multi-dimensional state object
   * @param attractors - Attractor values for each dimension
   * @param sigmas - Variation strengths for each dimension
   * @returns Transformed state
   */
  public static complexTransform(
    state: Record<string, number>,
    attractors: Record<string, number>,
    sigmas: Record<string, number>
  ): Record<string, number> {
    const result: Record<string, number> = {};
    
    // Transform each dimension separately
    for (const dimension in state) {
      if (attractors[dimension] !== undefined) {
        // Get current value and parameters
        const currentValue = state[dimension];
        const attractor = attractors[dimension];
        const sigma = sigmas[dimension] || 0.1;
        
        // Calculate influence factor based on distance to attractor
        const distance = Math.abs(currentValue - attractor);
        const influenceFactor = Math.exp(-distance); // Exponential decay
        
        // Generate variation
        const variation = this.generateGaussianNoise(currentValue, sigma);
        
        // Apply weighted Brazilian Wave formula
        result[dimension] = 
          (COHERENCE_RATIO * currentValue) + 
          (NOVELTY_RATIO * variation) +
          (influenceFactor * (attractor - currentValue));
      } else {
        // If no attractor defined, use simple transform
        result[dimension] = this.transformValue(state[dimension], sigmas[dimension] || 0.1);
      }
    }
    
    return result;
  }
  
  /**
   * Generate Gaussian (normal) distributed random noise
   * This implements the N(P_t,σ) function in the formula
   * 
   * @param mean - Mean value (center of distribution)
   * @param stdDev - Standard deviation (sigma)
   * @returns Random value with normal distribution
   */
  private static generateGaussianNoise(mean: number, stdDev: number): number {
    // Box-Muller transform for generating Gaussian distribution
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Convert [0,1) to (0,1)
    while (v === 0) v = Math.random();
    
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    
    // Scale and shift by mean and standard deviation
    return mean + (z * stdDev);
  }
}

export default BrazilianWaveTransformer;