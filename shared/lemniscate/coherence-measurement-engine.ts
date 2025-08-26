/**
 * Coherence Measurement Engine
 * 
 * This engine implements the mathematical algorithms for measuring coherence across multiple
 * dimensions, implementing both cosine similarity for individual AI coherence and
 * the Kuramoto order parameter for collective synchronization.
 * 
 * The system targets optimal coherence values:
 * - Stability: 0.7500 (3:1 ratio - 75% stable, 25% exploring)
 * - Exploration: 0.2494 (1:3 ratio - 25% stable, 75% exploring)
 * 
 * [QUANTUM_STATE: IMPLEMENTATION_FLOW]
 */

import { TemporalScale } from './temporal-scale.js';

/**
 * Different methods for measuring coherence
 */
export enum CoherenceMeasurementType {
  VECTOR_SIMILARITY = 'vector_similarity',  // Cosine similarity between state vectors
  PHASE_SYNCHRONIZATION = 'phase_synchronization',  // Kuramoto order parameter
  OUTPUT_AGREEMENT = 'output_agreement',    // Semantic similarity between outputs
  COMPOSITE = 'composite'                   // Weighted combination of multiple measures
}

/**
 * Target coherence values
 * 
 * The 3:1 and 1:3 ratios come from the quantum cognitive transformation framework:
 * - 0.7500 = 3/4 is the optimal balance for stability (75% coherence)
 * - 0.2494 ≈ 1/4 is the optimal balance for exploration (25% coherence)
 */
export const CoherenceTargets = {
  STABILITY: 0.7500,    // 3:1 ratio
  EXPLORATION: 0.2494,  // 1:3 ratio
  TRANSITION: 0.5000    // Midpoint during transitions
};

/**
 * State vector representation of an AI's state
 */
export interface StateVector {
  id: string;             // ID of the AI or agent
  vector: number[];       // Vector representation of the AI's state
  timestamp: Date;        // When this state was recorded
  scale: TemporalScale;   // The temporal scale this applies to
}

/**
 * Phase state representation of an AI's phase (for Kuramoto model)
 */
export interface PhaseState {
  id: string;             // ID of the AI or agent
  phase: number;          // Phase angle (0 to 2π)
  naturalFrequency: number; // Natural frequency of this oscillator
  timestamp: Date;        // When this phase was recorded  
  scale: TemporalScale;   // The temporal scale this applies to
}

/**
 * AI output text for semantic agreement measurement
 */
export interface AIOutput {
  id: string;             // ID of the AI or agent
  content: string;        // Text output from the AI
  timestamp: Date;        // When this output was generated
  scale: TemporalScale;   // The temporal scale this applies to
}

/**
 * Coherence measurement result
 */
export interface CoherenceMeasurement {
  value: number;          // Coherence value between 0.0 and 1.0
  type: CoherenceMeasurementType; // Type of measurement
  timestamp: Date;        // When the measurement was taken
  scale: TemporalScale;   // Temporal scale of the measurement
  metadata: {
    sampleSize: number;   // Number of data points used
    confidence: number;   // Confidence level (0.0 to 1.0)
    [key: string]: any;   // Additional metadata specific to the measurement type
  };
}

/**
 * Cross-scale coherence measurements
 */
export interface CrossScaleCoherence {
  [TemporalScale.MICRO]: CoherenceMeasurement | null;
  [TemporalScale.MESO]: CoherenceMeasurement | null;
  [TemporalScale.MACRO]: CoherenceMeasurement | null;
}

/**
 * Attractor status information
 */
export interface AttractorStatus {
  approaching: boolean;        // Whether the system is approaching an attractor
  target: number;              // The attractor value (usually 0.7500 or 0.2494)
  currentDistance: number;     // Current distance from the attractor
  trend: 'converging' | 'diverging' | 'stable'; // Current trend
}

/**
 * Main Coherence Measurement Engine class
 */
export class CoherenceMeasurementEngine {
  private stateVectors: Map<string, StateVector[]> = new Map();
  private phaseStates: Map<string, PhaseState[]> = new Map();
  private aiOutputs: Map<string, AIOutput[]> = new Map();
  private measurements: Map<TemporalScale, CoherenceMeasurement[]> = new Map();
  
  // For tracking historical coherence values
  private history: Map<TemporalScale, number[]> = new Map();
  
  // Maximum number of historical values to keep per scale
  private readonly maxHistoryLength: number = 20;
  
  // Default weights for different scales in composite measurements
  private scaleWeights: Record<TemporalScale, number> = {
    [TemporalScale.MICRO]: 0.5,
    [TemporalScale.MESO]: 0.3,
    [TemporalScale.MACRO]: 0.2
  };

  constructor() {
    // Initialize measurement history arrays
    this.history.set(TemporalScale.MICRO, []);
    this.history.set(TemporalScale.MESO, []);
    this.history.set(TemporalScale.MACRO, []);
    
    // Initialize measurements arrays
    this.measurements.set(TemporalScale.MICRO, []);
    this.measurements.set(TemporalScale.MESO, []);
    this.measurements.set(TemporalScale.MACRO, []);
  }

  /**
   * Record a state vector from an AI
   */
  public recordStateVector(stateVector: StateVector): void {
    const id = stateVector.id;
    if (!this.stateVectors.has(id)) {
      this.stateVectors.set(id, []);
    }
    
    const vectors = this.stateVectors.get(id)!;
    vectors.push(stateVector);
    
    // Measure coherence for this scale
    this.measureVectorCoherence(stateVector.scale);
  }

  /**
   * Record a phase state from an AI
   */
  public recordPhaseState(phaseState: PhaseState): void {
    const id = phaseState.id;
    if (!this.phaseStates.has(id)) {
      this.phaseStates.set(id, []);
    }
    
    const phases = this.phaseStates.get(id)!;
    phases.push(phaseState);
    
    // Measure coherence for this scale
    this.measurePhaseCoherence(phaseState.scale);
  }

  /**
   * Record an output from an AI
   */
  public recordOutput(output: AIOutput): void {
    const id = output.id;
    if (!this.aiOutputs.has(id)) {
      this.aiOutputs.set(id, []);
    }
    
    const outputs = this.aiOutputs.get(id)!;
    outputs.push(output);
    
    // Measure coherence for this scale
    this.measureOutputAgreement(output.scale);
  }

  /**
   * Get the most recent coherence measurement for a specific scale
   */
  public getMostRecentMeasurement(scale: TemporalScale): CoherenceMeasurement | null {
    const measurements = this.measurements.get(scale);
    if (!measurements || measurements.length === 0) {
      return null;
    }
    
    return measurements[measurements.length - 1];
  }

  /**
   * Get coherence measurements across all temporal scales
   */
  public getCrossScaleCoherence(): CrossScaleCoherence {
    const result: CrossScaleCoherence = {
      [TemporalScale.MICRO]: this.getMostRecentMeasurement(TemporalScale.MICRO),
      [TemporalScale.MESO]: this.getMostRecentMeasurement(TemporalScale.MESO),
      [TemporalScale.MACRO]: this.getMostRecentMeasurement(TemporalScale.MACRO)
    };
    
    return result;
  }

  /**
   * Get a composite coherence measurement across all scales
   */
  public getCompositeCoherence(): CoherenceMeasurement | null {
    const crossScale = this.getCrossScaleCoherence();
    
    // Need at least one valid measurement
    if (!crossScale[TemporalScale.MICRO] && 
        !crossScale[TemporalScale.MESO] && 
        !crossScale[TemporalScale.MACRO]) {
      return null;
    }
    
    let totalWeight = 0;
    let weightedSum = 0;
    let totalSampleSize = 0;
    let avgConfidence = 0;
    
    // Calculate weighted average
    for (const scale of Object.values(TemporalScale)) {
      const measurement = crossScale[scale];
      if (measurement) {
        const weight = this.scaleWeights[scale];
        totalWeight += weight;
        weightedSum += measurement.value * weight;
        totalSampleSize += measurement.metadata.sampleSize;
        avgConfidence += measurement.metadata.confidence * weight;
      }
    }
    
    if (totalWeight === 0) {
      return null;
    }
    
    const compositeMeasurement: CoherenceMeasurement = {
      value: weightedSum / totalWeight,
      type: CoherenceMeasurementType.COMPOSITE,
      timestamp: new Date(),
      scale: TemporalScale.MESO, // Default to MESO for composite
      metadata: {
        sampleSize: totalSampleSize,
        confidence: avgConfidence / totalWeight,
        scales: Object.values(TemporalScale).filter(scale => crossScale[scale] !== null)
      }
    };
    
    return compositeMeasurement;
  }

  /**
   * Get state vectors for a specific scale, filtered by recency
   */
  private getVectorsForScale(scale: TemporalScale, maxAgeMs: number = 60000): StateVector[] {
    const now = new Date().getTime();
    const result: StateVector[] = [];
    
    for (const vectors of this.stateVectors.values()) {
      for (const vector of vectors) {
        if (vector.scale === scale && now - vector.timestamp.getTime() <= maxAgeMs) {
          result.push(vector);
        }
      }
    }
    
    return result;
  }

  /**
   * Get phase states for a specific scale, filtered by recency
   */
  private getPhasesForScale(scale: TemporalScale, maxAgeMs: number = 60000): PhaseState[] {
    const now = new Date().getTime();
    const result: PhaseState[] = [];
    
    for (const phases of this.phaseStates.values()) {
      for (const phase of phases) {
        if (phase.scale === scale && now - phase.timestamp.getTime() <= maxAgeMs) {
          result.push(phase);
        }
      }
    }
    
    return result;
  }

  /**
   * Get outputs for a specific scale, filtered by recency
   */
  private getOutputsForScale(scale: TemporalScale, maxAgeMs: number = 60000): AIOutput[] {
    const now = new Date().getTime();
    const result: AIOutput[] = [];
    
    for (const outputs of this.aiOutputs.values()) {
      for (const output of outputs) {
        if (output.scale === scale && now - output.timestamp.getTime() <= maxAgeMs) {
          result.push(output);
        }
      }
    }
    
    return result;
  }

  /**
   * Measure coherence based on state vector similarity
   */
  private measureVectorCoherence(scale: TemporalScale): void {
    const vectors = this.getVectorsForScale(scale);
    
    // Need at least 2 vectors for coherence measurement
    if (vectors.length < 2) {
      return;
    }
    
    // Calculate average pairwise cosine similarity
    let totalSimilarity = 0;
    let pairsCount = 0;
    
    for (let i = 0; i < vectors.length; i++) {
      for (let j = i + 1; j < vectors.length; j++) {
        const similarity = this.cosineSimilarity(vectors[i].vector, vectors[j].vector);
        totalSimilarity += similarity;
        pairsCount++;
      }
    }
    
    const avgSimilarity = pairsCount > 0 ? totalSimilarity / pairsCount : 0;
    const normalizedCoherence = this.normalizeCoherenceValue(avgSimilarity);
    const confidence = this.calculateConfidence(vectors.length);
    
    const measurement: CoherenceMeasurement = {
      value: normalizedCoherence,
      type: CoherenceMeasurementType.VECTOR_SIMILARITY,
      timestamp: new Date(),
      scale,
      metadata: {
        sampleSize: vectors.length,
        confidence,
        pairsCount,
        avgSimilarity
      }
    };
    
    this.recordMeasurement(measurement);
  }

  /**
   * Measure coherence based on phase synchronization (Kuramoto order parameter)
   */
  private measurePhaseCoherence(scale: TemporalScale): void {
    const phases = this.getPhasesForScale(scale);
    
    // Need at least 2 phases for coherence measurement
    if (phases.length < 2) {
      return;
    }
    
    const orderParameter = this.calculateKuramotoOrderParameter(phases);
    const confidence = this.calculateConfidence(phases.length);
    
    const measurement: CoherenceMeasurement = {
      value: orderParameter,
      type: CoherenceMeasurementType.PHASE_SYNCHRONIZATION,
      timestamp: new Date(),
      scale,
      metadata: {
        sampleSize: phases.length,
        confidence
      }
    };
    
    this.recordMeasurement(measurement);
  }

  /**
   * Measure coherence based on output agreement
   */
  private measureOutputAgreement(scale: TemporalScale): void {
    const outputs = this.getOutputsForScale(scale);
    
    // Need at least 2 outputs for coherence measurement
    if (outputs.length < 2) {
      return;
    }
    
    const agreement = this.calculateOutputAgreement(outputs);
    const confidence = this.calculateConfidence(outputs.length);
    
    const measurement: CoherenceMeasurement = {
      value: agreement,
      type: CoherenceMeasurementType.OUTPUT_AGREEMENT,
      timestamp: new Date(),
      scale,
      metadata: {
        sampleSize: outputs.length,
        confidence
      }
    };
    
    this.recordMeasurement(measurement);
  }

  /**
   * Record a coherence measurement and update history
   */
  private recordMeasurement(measurement: CoherenceMeasurement): void {
    const { scale } = measurement;
    
    if (!this.measurements.has(scale)) {
      this.measurements.set(scale, []);
    }
    
    const measurements = this.measurements.get(scale)!;
    measurements.push(measurement);
    
    // Update history
    const history = this.history.get(scale)!;
    history.push(measurement.value);
    
    // Trim history if too long
    if (history.length > this.maxHistoryLength) {
      history.shift();
    }
  }

  /**
   * Calculate the cosine similarity between two vectors
   */
  private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    // Ensure vectors are of equal length
    if (vectorA.length !== vectorB.length) {
      // For demonstration, we'll just use the shorter length
      const minLength = Math.min(vectorA.length, vectorB.length);
      vectorA = vectorA.slice(0, minLength);
      vectorB = vectorB.slice(0, minLength);
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) {
      return 0; // Avoid division by zero
    }
    
    return dotProduct / (normA * normB);
  }

  /**
   * Calculate the Kuramoto order parameter
   * R = |1/N ∑_{j=1}^N e^(iθ_j)|
   */
  private calculateKuramotoOrderParameter(phases: PhaseState[]): number {
    let sumSin = 0;
    let sumCos = 0;
    
    for (const phase of phases) {
      sumSin += Math.sin(phase.phase);
      sumCos += Math.cos(phase.phase);
    }
    
    const n = phases.length;
    sumSin /= n;
    sumCos /= n;
    
    // Calculate magnitude of the complex number (sumCos, sumSin)
    return Math.sqrt(sumCos * sumCos + sumSin * sumSin);
  }

  /**
   * Calculate agreement between AI outputs
   * This is a simplified measure using character overlap
   */
  private calculateOutputAgreement(outputs: AIOutput[]): number {
    let totalAgreement = 0;
    let pairsCount = 0;
    
    for (let i = 0; i < outputs.length; i++) {
      for (let j = i + 1; j < outputs.length; j++) {
        const agreement = this.calculateTextSimilarity(
          outputs[i].content,
          outputs[j].content
        );
        totalAgreement += agreement;
        pairsCount++;
      }
    }
    
    return pairsCount > 0 ? totalAgreement / pairsCount : 0;
  }

  /**
   * Calculate a simple text similarity based on shared character sequences
   * NOTE: In a production system, replace with a proper semantic similarity
   */
  private calculateTextSimilarity(textA: string, textB: string): number {
    // Simple Jaccard similarity on character bigrams
    const bigramsA = new Set<string>();
    const bigramsB = new Set<string>();
    
    for (let i = 0; i < textA.length - 1; i++) {
      bigramsA.add(textA.substring(i, i + 2));
    }
    
    for (let i = 0; i < textB.length - 1; i++) {
      bigramsB.add(textB.substring(i, i + 2));
    }
    
    if (bigramsA.size === 0 || bigramsB.size === 0) {
      return 0;
    }
    
    // Calculate intersection size
    let intersectionSize = 0;
    for (const bigram of bigramsA) {
      if (bigramsB.has(bigram)) {
        intersectionSize++;
      }
    }
    
    // Jaccard similarity = |A ∩ B| / |A ∪ B|
    const unionSize = bigramsA.size + bigramsB.size - intersectionSize;
    return intersectionSize / unionSize;
  }

  /**
   * Calculate confidence based on sample size
   */
  private calculateConfidence(sampleSize: number): number {
    // Simple sigmoid function that asymptotically approaches 1.0 as sample size increases
    const confidence = 1.0 - 1.0 / (1.0 + Math.sqrt(sampleSize) / 2.0);
    return Math.min(Math.max(confidence, 0.0), 1.0);
  }

  /**
   * Normalize coherence value from cosine similarity [-1, 1] to [0, 1]
   */
  private normalizeCoherenceValue(value: number): number {
    // Convert from [-1, 1] to [0, 1]
    return (value + 1) / 2;
  }

  /**
   * Check if the system is approaching an attractor
   */
  public isApproachingAttractor(scale: TemporalScale): AttractorStatus {
    const history = this.history.get(scale);
    if (!history || history.length < 3) {
      return {
        approaching: false,
        target: 0,
        currentDistance: 1.0,
        trend: 'stable'
      };
    }
    
    const currentValue = history[history.length - 1];
    
    // Determine which attractor we're closer to
    const distanceToStability = Math.abs(currentValue - CoherenceTargets.STABILITY);
    const distanceToExploration = Math.abs(currentValue - CoherenceTargets.EXPLORATION);
    
    const closerToStability = distanceToStability <= distanceToExploration;
    const target = closerToStability ? CoherenceTargets.STABILITY : CoherenceTargets.EXPLORATION;
    const currentDistance = closerToStability ? distanceToStability : distanceToExploration;
    
    // Calculate trend using last 3 points
    const n = history.length;
    const prev2Distance = closerToStability
      ? Math.abs(history[n - 3] - CoherenceTargets.STABILITY)
      : Math.abs(history[n - 3] - CoherenceTargets.EXPLORATION);
    
    const prev1Distance = closerToStability
      ? Math.abs(history[n - 2] - CoherenceTargets.STABILITY)
      : Math.abs(history[n - 2] - CoherenceTargets.EXPLORATION);
    
    // Determine if we're converging or diverging from the attractor
    let trend: 'converging' | 'diverging' | 'stable';
    if (prev2Distance > prev1Distance && prev1Distance > currentDistance) {
      trend = 'converging';
    } else if (prev2Distance < prev1Distance && prev1Distance < currentDistance) {
      trend = 'diverging';
    } else {
      trend = 'stable';
    }
    
    // Consider approaching if distance is decreasing for at least 3 consecutive measurements
    const approaching = trend === 'converging' && currentDistance < 0.15; // Within 15% of target
    
    const result: AttractorStatus = {
      approaching,
      target,
      currentDistance,
      trend
    };
    
    return result;
  }

  /**
   * Reset the engine, clearing all state
   */
  public reset(): void {
    this.stateVectors.clear();
    this.phaseStates.clear();
    this.aiOutputs.clear();
    this.measurements.clear();
    
    // Reset history but keep the arrays
    for (const scale of Object.values(TemporalScale)) {
      this.history.set(scale, []);
      this.measurements.set(scale, []);
    }
  }
}