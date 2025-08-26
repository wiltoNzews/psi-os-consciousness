/**
 * Kuramoto Order Parameter Implementation
 * 
 * This module provides functions for calculating the Kuramoto order parameter,
 * a measure of synchronization in coupled oscillator systems.
 * 
 * The Kuramoto order parameter R is defined as:
 * R = |1/N ∑(j=1 to N) exp(i*θj)|
 * 
 * where:
 * - N is the number of oscillators/agents
 * - θj is the phase of oscillator j
 * - R ∈ [0,1], with 0 meaning complete desynchronization and 1 meaning complete synchronization
 * 
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */

/**
 * Calculate the Kuramoto order parameter for a set of phases.
 * 
 * @param phases Array of phase angles in radians
 * @returns Order parameter in range [0,1]
 */
export function computeKuramotoR(phases: number[]): number {
  if (phases.length === 0) return 0;
  
  // Calculate sum of complex exponentials
  let sumReal = 0;
  let sumImag = 0;
  
  for (const phase of phases) {
    sumReal += Math.cos(phase);
    sumImag += Math.sin(phase);
  }
  
  // Calculate magnitude of the complex sum divided by N
  const magnitude = Math.sqrt(sumReal * sumReal + sumImag * sumImag) / phases.length;
  
  // Constrain to [0,1] to handle any potential floating-point errors
  return Math.max(0, Math.min(1, magnitude));
}

/**
 * Convert a set of values to phases in the range [0, 2π]
 * This is useful for mapping arbitrary scalar values to phases
 * 
 * @param values Array of numeric values
 * @param minValue Optional minimum value for normalization (default: min of values)
 * @param maxValue Optional maximum value for normalization (default: max of values)
 * @returns Array of corresponding phases in radians
 */
export function valuesToPhases(
  values: number[], 
  minValue?: number, 
  maxValue?: number
): number[] {
  if (values.length === 0) return [];
  
  // If min/max not provided, calculate from values
  const min = minValue ?? Math.min(...values);
  const max = maxValue ?? Math.max(...values);
  
  // Handle case where all values are the same
  if (min === max) return values.map(() => 0);
  
  // Map values to phases in [0, 2π]
  return values.map(value => {
    const normalized = (value - min) / (max - min);
    return normalized * 2 * Math.PI;
  });
}

/**
 * Calculate coherence from phase values using the Kuramoto order parameter.
 * 
 * @param values Array of numeric values
 * @param targetValue Optional target value to use as reference
 * @returns Coherence value in range [0,1]
 */
export function calculatePhaseCoherence(
  values: number[],
  targetValue?: number
): number {
  if (values.length === 0) return 0;
  
  // Convert values to phases
  const phases = valuesToPhases(values);
  
  // If a target value is provided, adjust phases relative to it
  if (targetValue !== undefined) {
    const targetPhase = targetValue * 2 * Math.PI;
    // Adjust phases to be relative to target
    for (let i = 0; i < phases.length; i++) {
      phases[i] = Math.abs(phases[i] - targetPhase) % (2 * Math.PI);
    }
  }
  
  // Calculate Kuramoto order parameter
  return computeKuramotoR(phases);
}

/**
 * Advanced Kuramoto Model for weighted agents with coupling strengths
 * 
 * @param phases Array of phase angles in radians
 * @param weights Optional array of weights for each agent
 * @param couplingStrength Optional global coupling strength
 * @returns Weighted order parameter in range [0,1]
 */
export function computeWeightedKuramotoR(
  phases: number[], 
  weights?: number[], 
  couplingStrength: number = 1.0
): number {
  if (phases.length === 0) return 0;
  
  // Use uniform weights if not provided
  const agentWeights = weights ?? phases.map(() => 1);
  
  // Ensure weights is the same length as phases
  if (agentWeights.length !== phases.length) {
    throw new Error('Weights array must be the same length as phases array');
  }
  
  // Normalize weights to sum to 1
  const totalWeight = agentWeights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = agentWeights.map(w => w / totalWeight);
  
  // Calculate weighted sum of complex exponentials
  let sumReal = 0;
  let sumImag = 0;
  
  for (let i = 0; i < phases.length; i++) {
    sumReal += normalizedWeights[i] * Math.cos(phases[i]);
    sumImag += normalizedWeights[i] * Math.sin(phases[i]);
  }
  
  // Apply coupling strength
  const magnitude = Math.sqrt(sumReal * sumReal + sumImag * sumImag) * couplingStrength;
  
  // Constrain to [0,1]
  return Math.max(0, Math.min(1, magnitude));
}

/**
 * Calculate phase coherence for complex systems with various agent types
 * 
 * @param agentStates Array of agent state objects
 * @param targetCoherence Optional target coherence value
 * @returns Object containing coherence value and additional metrics
 */
export function calculateComplexPhaseCoherence(
  agentStates: Array<{phase: number, weight?: number, type?: string}>,
  targetCoherence?: number
): {value: number, distribution: {[key: string]: number}, orderParameter: number} {
  if (agentStates.length === 0) {
    return {value: 0, distribution: {}, orderParameter: 0};
  }
  
  // Extract phases and weights
  const phases = agentStates.map(a => a.phase);
  const weights = agentStates.map(a => a.weight ?? 1);
  
  // Calculate standard Kuramoto order parameter
  const r = computeWeightedKuramotoR(phases, weights);
  
  // Calculate distribution of phases by agent type (if available)
  const distribution: {[key: string]: number} = {};
  agentStates.forEach(agent => {
    const type = agent.type ?? 'default';
    if (!distribution[type]) distribution[type] = 0;
    distribution[type]++;
  });
  
  // Calculate coherence value
  // If targetCoherence is specified, we want to be close to that value
  // Otherwise, we aim for the standard 0.7500 attractor
  const defaultTarget = 0.7500;
  const target = targetCoherence ?? defaultTarget;
  
  // Calculate how close we are to the target coherence
  // Using a Gaussian-like function centered at the target
  // The closer to the target, the higher the coherence value
  const sigma = 0.15; // Width of the Gaussian
  const distance = Math.abs(r - target);
  const coherenceValue = Math.exp(-(distance * distance) / (2 * sigma * sigma));
  
  return {
    value: coherenceValue,
    distribution: distribution,
    orderParameter: r
  };
}