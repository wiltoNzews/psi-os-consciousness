/**
 * Coherence Metrics Interface
 * 
 * This module provides a unified interface for measuring coherence in
 * multi-agent AI systems, with support for both phase-based (Kuramoto)
 * and vector-based approaches.
 * 
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */

import { 
  computeKuramotoR, 
  valuesToPhases,
  calculatePhaseCoherence,
  calculateComplexPhaseCoherence
} from './KuramotoParameter.js';

import { 
  computeCosineSimilarity,
  normalizeCosineSimilarity,
  calculateVectorCoherence,
  calculateComplexVectorCoherence
} from './VectorAlignment.js';

/**
 * Agent Phase State interface
 */
export interface AgentPhaseState {
  id: string;
  phase: number;
  weight?: number;
  type?: string;
}

/**
 * Agent Vector State interface
 */
export interface AgentVectorState {
  id: string;
  vector: number[];
  weight?: number;
  type?: string;
}

/**
 * Coherence calculation result
 */
export interface CoherenceResult {
  value: number;              // Main coherence value in [0,1]
  raw?: number;               // Raw order parameter value
  details?: {                 // Additional calculation details
    byType?: {[key: string]: number};
    pairwise?: number[];
    meanSimilarity?: number;
    distribution?: {[key: string]: number};
  };
}

/**
 * Calculate coherence for phase-based agents (Kuramoto model)
 * 
 * @param agents Array of agent phase states
 * @param targetCoherence Optional target coherence value (defaults to 0.7500)
 * @returns Coherence calculation result
 */
export function calculatePhaseCoherenceForAgents(
  agents: AgentPhaseState[],
  targetCoherence?: number
): CoherenceResult {
  if (agents.length === 0) {
    return { value: 0, raw: 0, details: {} };
  }
  
  // Extract phases and weights
  const phases = agents.map(a => a.phase);
  const weights = agents.map(a => a.weight ?? 1);
  
  // For simple cases (no types, uniform weights)
  if (agents.every(a => !a.type) && weights.every(w => w === weights[0])) {
    const r = computeKuramotoR(phases);
    
    // Apply target coherence transformation if provided
    const target = targetCoherence ?? 0.7500;
    const sigma = 0.15;
    const distance = Math.abs(r - target);
    const coherenceValue = Math.exp(-(distance * distance) / (2 * sigma * sigma));
    
    return {
      value: coherenceValue,
      raw: r
    };
  }
  
  // For complex cases with types and weights
  const result = calculateComplexPhaseCoherence(
    agents.map(a => ({
      phase: a.phase,
      weight: a.weight,
      type: a.type
    })),
    targetCoherence
  );
  
  return {
    value: result.value,
    raw: result.orderParameter,
    details: {
      distribution: result.distribution
    }
  };
}

/**
 * Calculate coherence for vector-based agents
 * 
 * @param agents Array of agent vector states
 * @param targetVector Optional target vector
 * @param targetCoherence Optional target coherence value (defaults to 0.7500)
 * @returns Coherence calculation result
 */
export function calculateVectorCoherenceForAgents(
  agents: AgentVectorState[],
  targetVector?: number[],
  targetCoherence?: number
): CoherenceResult {
  if (agents.length === 0) {
    return { value: 0, raw: 0, details: {} };
  }
  
  // For simple cases (no types, uniform weights)
  if (agents.every(a => !a.type) && agents.every(a => !a.weight || a.weight === 1)) {
    const vectors = agents.map(a => a.vector);
    const result = calculateVectorCoherence(vectors, targetVector);
    
    return {
      value: result.value,
      raw: result.meanSimilarity,
      details: {
        meanSimilarity: result.meanSimilarity,
        pairwise: result.pairwiseSimilarities
      }
    };
  }
  
  // For complex cases with types and weights
  const result = calculateComplexVectorCoherence(
    agents.map(a => ({
      vector: a.vector,
      weight: a.weight,
      type: a.type
    })),
    targetVector
  );
  
  return {
    value: result.value,
    raw: result.meanSimilarity,
    details: {
      byType: result.byType,
      meanSimilarity: result.meanSimilarity
    }
  };
}

/**
 * Calculate coherence for a mixed collection of agents
 * 
 * @param phaseAgents Array of phase-based agents
 * @param vectorAgents Array of vector-based agents
 * @param weights Optional weights for phase vs vector coherence (defaults to [0.5, 0.5])
 * @param targetCoherence Optional target coherence value (defaults to 0.7500)
 * @returns Combined coherence calculation result
 */
export function calculateMixedCoherence(
  phaseAgents: AgentPhaseState[],
  vectorAgents: AgentVectorState[],
  weights: [number, number] = [0.5, 0.5],
  targetCoherence?: number
): CoherenceResult {
  // Calculate coherence for each type
  const phaseResult = calculatePhaseCoherenceForAgents(phaseAgents, targetCoherence);
  const vectorResult = calculateVectorCoherenceForAgents(vectorAgents, undefined, targetCoherence);
  
  // Normalize weights
  const totalWeight = weights[0] + weights[1];
  const normalizedWeights: [number, number] = [
    weights[0] / totalWeight,
    weights[1] / totalWeight
  ];
  
  // Calculate weighted average coherence
  const combinedValue = 
    phaseResult.value * normalizedWeights[0] + 
    vectorResult.value * normalizedWeights[1];
  
  // Create combined raw value (if available)
  const combinedRaw = 
    (phaseResult.raw !== undefined && vectorResult.raw !== undefined) ?
    phaseResult.raw * normalizedWeights[0] + vectorResult.raw * normalizedWeights[1] :
    undefined;
  
  return {
    value: combinedValue,
    raw: combinedRaw,
    details: {
      // Combine details from both calculations
      byType: vectorResult.details?.byType,
      pairwise: [
        ...(phaseResult.details?.pairwise || []),
        ...(vectorResult.details?.pairwise || [])
      ],
      meanSimilarity: vectorResult.details?.meanSimilarity,
      distribution: phaseResult.details?.distribution
    }
  };
}

/**
 * Main function to calculate coherence for any type of agent state
 * 
 * @param agents Array of agent states (either phase-based or vector-based)
 * @param targetCoherence Optional target coherence value (defaults to 0.7500)
 * @returns Coherence calculation result
 */
export function getCoherenceMetric<T extends AgentPhaseState | AgentVectorState>(
  agents: T[],
  targetCoherence?: number
): CoherenceResult {
  if (agents.length === 0) {
    return { value: 0, raw: 0, details: {} };
  }
  
  // Determine agent type by checking first agent
  const firstAgent = agents[0];
  
  // Check if we have phase-based agents
  if ('phase' in firstAgent) {
    return calculatePhaseCoherenceForAgents(
      agents as AgentPhaseState[],
      targetCoherence
    );
  }
  
  // Check if we have vector-based agents
  if ('vector' in firstAgent) {
    return calculateVectorCoherenceForAgents(
      agents as AgentVectorState[],
      undefined,
      targetCoherence
    );
  }
  
  // Default case (shouldn't reach here if types are correct)
  console.error('[QUANTUM_STATE: ERROR_FLOW] Unknown agent state type');
  return { value: 0, raw: 0, details: {} };
}

// Export utility functions too for convenience
export {
  computeKuramotoR,
  valuesToPhases,
  computeCosineSimilarity,
  normalizeCosineSimilarity
};