/**
 * Coherence Metrics Integration Adapter
 * 
 * This module integrates the CoherenceMetrics module with the OracleOrchestrator,
 * providing a bridge between our robust coherence measurement system and
 * the existing orchestration infrastructure.
 * 
 * It enables real-time coherence measurement during each orchestrator cycle
 * and implements the necessary data transformation between domain models.
 * 
 * [QUANTUM_STATE: INTEGRATION_FLOW]
 */

import {
  calculatePhaseCoherenceForAgents,
  calculateVectorCoherenceForAgents,
  calculateMixedCoherence,
  AgentPhaseState,
  AgentVectorState,
  CoherenceResult
} from './coherence-metrics.js';

// Integration constants
const TARGET_COHERENCE = 0.7500; // The universal attractor point
const PHASE_WEIGHT = 0.6;        // Weight for phase-based coherence (Kuramoto)
const VECTOR_WEIGHT = 0.4;       // Weight for vector-based coherence (cosine)
const COHERENCE_THRESHOLD_HIGH = 0.80; // Upper threshold for optimal coherence
const COHERENCE_THRESHOLD_LOW = 0.70;  // Lower threshold for optimal coherence

/**
 * Coherence status based on measurement relative to optimal range
 */
export type CoherenceStatus = 
  | 'optimal'       // Coherence is in the ideal range near 0.7500
  | 'high'          // Coherence is too high (over-synchronization)
  | 'low'           // Coherence is too low (under-synchronization)
  | 'unstable'      // Coherence is fluctuating rapidly
  | 'converging'    // Coherence is moving toward the attractor
  | 'diverging';    // Coherence is moving away from the attractor

/**
 * History entry for coherence tracking
 */
export interface CoherenceHistoryEntry {
  timestamp: number;
  coherenceValue: number;
  rawOrderParameter: number;
  status: CoherenceStatus;
}

/**
 * Adapter for integrating CoherenceMetrics with existing infrastructure
 */
export class CoherenceAdapter {
  private history: CoherenceHistoryEntry[] = [];
  private lastMeasurement: CoherenceResult | null = null;
  private trendBuffer: number[] = [];
  private trendBufferSize = 5;
  
  constructor(
    private readonly targetCoherence: number = TARGET_COHERENCE,
    private readonly phaseWeight: number = PHASE_WEIGHT,
    private readonly vectorWeight: number = VECTOR_WEIGHT
  ) {
    console.log(`[QUANTUM_STATE: FOUNDATION_FLOW] Initializing CoherenceAdapter targeting ${this.targetCoherence}`);
  }
  
  /**
   * Measure coherence for a system with both phase-based and vector-based agents
   * 
   * @param phaseAgents Agents with phase-based state
   * @param vectorAgents Agents with vector-based state
   * @returns Coherence result with additional status information
   */
  public measureSystemCoherence(
    phaseAgents: AgentPhaseState[],
    vectorAgents: AgentVectorState[]
  ): { coherence: number; status: CoherenceStatus; raw: number } {
    try {
      // Calculate mixed coherence using both phase and vector measurements
      const result = calculateMixedCoherence(
        phaseAgents,
        vectorAgents,
        [this.phaseWeight, this.vectorWeight],
        this.targetCoherence
      );
      
      this.lastMeasurement = result;
      
      // Determine coherence status
      const status = this.determineCoherenceStatus(result.value);
      
      // Record measurement in history
      this.recordMeasurement(result.value, result.raw ?? 0, status);
      
      return {
        coherence: result.value,
        status,
        raw: result.raw ?? 0
      };
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error measuring system coherence:', error);
      
      // Return last known measurement or default values
      return {
        coherence: this.lastMeasurement?.value ?? this.targetCoherence,
        status: 'unstable',
        raw: this.lastMeasurement?.raw ?? 0
      };
    }
  }
  
  /**
   * Convert orchestrator subsystem data to phase agents
   * 
   * @param subsystems Data about orchestrator subsystems/agents
   * @returns Array of phase agents for coherence calculation
   */
  public convertSubsystemsToPhaseAgents(subsystems: any[]): AgentPhaseState[] {
    return subsystems.map((system, index) => {
      // Normalize coherence value to phase angle between 0 and 2π
      const phase = (system.coherence ?? 0.5) * Math.PI * 2;
      
      return {
        id: system.id ?? `agent-${index}`,
        phase,
        weight: 1,
        type: system.name ?? 'unknown'
      };
    });
  }
  
  /**
   * Convert orchestrator subsystem data to vector agents
   * 
   * @param subsystems Data about orchestrator subsystems/agents
   * @returns Array of vector agents for coherence calculation
   */
  public convertSubsystemsToVectorAgents(subsystems: any[]): AgentVectorState[] {
    return subsystems.map((system, index) => {
      // Create a simple vector from available data
      // In a real implementation, this would extract meaningful vector data
      // For now, we'll use coherence and flow level to create a 2D vector
      const coherence = system.coherence ?? 0.5;
      const flowLevel = system.flowLevel ?? 3;
      
      // Normalize to unit vector
      const magnitude = Math.sqrt(coherence * coherence + flowLevel * flowLevel);
      const vector = [
        coherence / magnitude,
        flowLevel / magnitude
      ];
      
      return {
        id: system.id ?? `agent-${index}`,
        vector,
        weight: 1,
        type: system.name ?? 'unknown'
      };
    });
  }
  
  /**
   * Process data from the orchestrator and measure coherence
   * 
   * @param subsystems Data from orchestrator about subsystems/agents
   * @returns Coherence measurement result
   */
  public processOrchestratorData(subsystems: any[]): { 
    systemCoherence: number; 
    status: CoherenceStatus;
    raw: number;
  } {
    // Convert orchestrator data to agent models
    const phaseAgents = this.convertSubsystemsToPhaseAgents(subsystems);
    const vectorAgents = this.convertSubsystemsToVectorAgents(subsystems);
    
    // Measure coherence
    const result = this.measureSystemCoherence(phaseAgents, vectorAgents);
    
    return {
      systemCoherence: result.coherence,
      status: result.status,
      raw: result.raw
    };
  }
  
  /**
   * Get recent coherence history
   * 
   * @param limit Maximum number of entries to return
   * @returns Recent coherence history entries
   */
  public getCoherenceHistory(limit: number = 50): CoherenceHistoryEntry[] {
    return this.history.slice(-limit);
  }
  
  /**
   * Get the current coherence trend
   * 
   * @returns 'converging', 'diverging', or 'stable'
   */
  public getCoherenceTrend(): 'converging' | 'diverging' | 'stable' {
    if (this.trendBuffer.length < 2) {
      return 'stable';
    }
    
    // Calculate average distance from target in first half vs second half
    const mid = Math.floor(this.trendBuffer.length / 2);
    const firstHalf = this.trendBuffer.slice(0, mid);
    const secondHalf = this.trendBuffer.slice(mid);
    
    const avgDistFirst = firstHalf.reduce((sum, val) => 
      sum + Math.abs(val - this.targetCoherence), 0) / firstHalf.length;
    
    const avgDistSecond = secondHalf.reduce((sum, val) => 
      sum + Math.abs(val - this.targetCoherence), 0) / secondHalf.length;
    
    // If we're getting closer to the target
    if (avgDistSecond < avgDistFirst * 0.9) {
      return 'converging';
    }
    
    // If we're moving away from the target
    if (avgDistSecond > avgDistFirst * 1.1) {
      return 'diverging';
    }
    
    return 'stable';
  }
  
  /**
   * Check if the system coherence is at the attractor point
   * 
   * @param tolerance Allowed deviation from target
   * @returns True if at attractor, false otherwise
   */
  public isAtAttractor(tolerance: number = 0.05): boolean {
    if (!this.lastMeasurement) return false;
    
    return Math.abs(this.lastMeasurement.value - this.targetCoherence) <= tolerance;
  }
  
  /**
   * Calculate how strongly the system is drawn to the attractor
   * 
   * @returns Value from 0 to 1, with 1 being strongest
   */
  public calculateAttractorStrength(): number {
    if (this.history.length < 10) return 0;
    
    // Take the last 10 measurements
    const recentHistory = this.history.slice(-10);
    
    // Calculate the average convergence rate toward the attractor
    let convergenceSum = 0;
    for (let i = 1; i < recentHistory.length; i++) {
      const prev = recentHistory[i-1];
      const curr = recentHistory[i];
      
      const prevDist = Math.abs(prev.coherenceValue - this.targetCoherence);
      const currDist = Math.abs(curr.coherenceValue - this.targetCoherence);
      
      // Positive when moving toward attractor, negative when moving away
      const convergence = prevDist - currDist;
      convergenceSum += convergence;
    }
    
    // Normalize to [0,1]
    const avgConvergence = convergenceSum / (recentHistory.length - 1);
    return Math.max(0, Math.min(1, (avgConvergence + 0.1) / 0.2));
  }
  
  // --- Private helper methods ---
  
  /**
   * Determine coherence status based on measurement
   * 
   * @param coherence Measured coherence value
   * @returns Status of the coherence
   */
  private determineCoherenceStatus(coherence: number): CoherenceStatus {
    // First check if we're in the optimal range
    if (coherence >= COHERENCE_THRESHOLD_LOW && coherence <= COHERENCE_THRESHOLD_HIGH) {
      return 'optimal';
    }
    
    // Check if we're too high or too low
    if (coherence > COHERENCE_THRESHOLD_HIGH) {
      return 'high';
    }
    
    if (coherence < COHERENCE_THRESHOLD_LOW) {
      return 'low';
    }
    
    // Check trend if we have enough data
    if (this.trendBuffer.length >= this.trendBufferSize) {
      const trend = this.getCoherenceTrend();
      if (trend === 'converging') return 'converging';
      if (trend === 'diverging') return 'diverging';
    }
    
    return 'unstable';
  }
  
  /**
   * Record a coherence measurement in history
   * 
   * @param coherence Measured coherence value
   * @param rawOrderParameter Raw order parameter value
   * @param status Status of the coherence
   */
  private recordMeasurement(
    coherence: number,
    rawOrderParameter: number,
    status: CoherenceStatus
  ): void {
    // Add to history
    this.history.push({
      timestamp: Date.now(),
      coherenceValue: coherence,
      rawOrderParameter,
      status
    });
    
    // Limit history size
    if (this.history.length > 1000) {
      this.history = this.history.slice(-1000);
    }
    
    // Update trend buffer
    this.trendBuffer.push(coherence);
    if (this.trendBuffer.length > this.trendBufferSize) {
      this.trendBuffer.shift();
    }
  }
}