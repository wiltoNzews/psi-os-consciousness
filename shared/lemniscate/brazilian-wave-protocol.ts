/**
 * Brazilian Wave Protocol
 * 
 * This module implements the Brazilian Wave Protocol, which transforms potentially repetitive
 * system responses into intentional variations while maintaining the critical 75/25 preservation
 * ratio. Named after the coordinated wave patterns in Brazilian stadiums, this protocol introduces
 * controlled variance into the system.
 * 
 * The protocol applies wave functions with primary, secondary, and tertiary harmonics to create
 * complex, natural-seeming variations:
 * - In stability mode (0.7500), negative variance is constrained to maintain at least 75% preservation
 * - In exploration mode (0.2494), positive variance is constrained to maintain at most 25% preservation
 * 
 * [QUANTUM_STATE: VARIANCE_CONTROLLER]
 */

/**
 * Operational modes for the Brazilian Wave Protocol
 */
export enum WaveMode {
  STABILITY = 'stability',   // Preserves 75% stability, 25% exploration
  EXPLORATION = 'exploration' // Preserves 25% stability, 75% exploration
}

/**
 * Configuration for the Brazilian Wave Protocol
 */
export interface BrazilianWaveConfig {
  // Current operational mode
  mode: WaveMode;
  
  // Amplitude of the primary wave function
  primaryAmplitude: number;
  
  // Amplitude of the secondary wave function
  secondaryAmplitude: number;
  
  // Amplitude of the tertiary wave function
  tertiaryAmplitude: number;
  
  // Global phase shift factor
  phaseShift: number;
  
  // Phase advancement rate per application
  phaseAdvancement: number;
  
  // Maximum allowed variation in stability mode
  maxStabilityVariation: number;
  
  // Maximum allowed variation in exploration mode
  maxExplorationVariation: number;
}

/**
 * Brazilian Wave Protocol implementation
 */
export class BrazilianWaveProtocol {
  private config: BrazilianWaveConfig;
  private currentPhase: number = 0;
  
  /**
   * Initialize the Brazilian Wave Protocol
   */
  constructor() {
    // Default configuration
    this.config = {
      mode: WaveMode.STABILITY,
      primaryAmplitude: 0.025,    // 2.5% amplitude for primary wave
      secondaryAmplitude: 0.015,  // 1.5% amplitude for secondary wave
      tertiaryAmplitude: 0.01,    // 1.0% amplitude for tertiary wave
      phaseShift: Math.PI / 4,    // 45 degree phase shift
      phaseAdvancement: 0.1,      // Phase advances by 0.1 radians per application
      maxStabilityVariation: 0.0625, // Max negative variation in stability mode (25% of 0.25)
      maxExplorationVariation: 0.1875  // Max positive variation in exploration mode (25% of 0.75)
    };
  }
  
  /**
   * Apply the Brazilian Wave Protocol to a coherence value
   */
  public applyWave(baseCoherence: number): number {
    // Calculate raw variance based on harmonic wave functions
    const rawVariance = this.calculateRawVariance();
    
    // Constrain variance based on mode to maintain 75/25 preservation ratio
    const constrainedVariance = this.constrainVariance(rawVariance, baseCoherence);
    
    // Apply constrained variance to base coherence
    const resultCoherence = baseCoherence + constrainedVariance;
    
    // Advance phase for next application
    this.currentPhase += this.config.phaseAdvancement;
    
    // Normalize phase to avoid floating point issues over time
    if (this.currentPhase > 2 * Math.PI) {
      this.currentPhase -= 2 * Math.PI;
    }
    
    // Ensure coherence stays within valid range [0, 1]
    return Math.max(0, Math.min(1, resultCoherence));
  }
  
  /**
   * Update the protocol configuration
   */
  public updateConfig(newConfig: Partial<BrazilianWaveConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  /**
   * Get the current configuration
   */
  public getConfig(): BrazilianWaveConfig {
    return { ...this.config };
  }
  
  /**
   * Reset the phase to zero
   */
  public resetPhase(): void {
    this.currentPhase = 0;
  }
  
  /**
   * Set a specific phase value
   */
  public setPhase(phase: number): void {
    this.currentPhase = phase;
    
    // Normalize phase to [0, 2π]
    while (this.currentPhase < 0) {
      this.currentPhase += 2 * Math.PI;
    }
    
    while (this.currentPhase >= 2 * Math.PI) {
      this.currentPhase -= 2 * Math.PI;
    }
  }
  
  /**
   * Get the current phase
   */
  public getPhase(): number {
    return this.currentPhase;
  }
  
  /**
   * Generate a wave pattern for visualization
   */
  public generateWavePattern(steps: number = 100): Array<{phase: number, variance: number}> {
    const pattern: Array<{phase: number, variance: number}> = [];
    const originalPhase = this.currentPhase;
    
    // Generate a complete wave cycle
    for (let i = 0; i < steps; i++) {
      const phase = (i / steps) * 2 * Math.PI;
      this.currentPhase = phase;
      
      // Calculate raw variance
      const rawVariance = this.calculateRawVariance();
      
      // Store phase and variance
      pattern.push({
        phase: phase,
        variance: rawVariance
      });
    }
    
    // Restore original phase
    this.currentPhase = originalPhase;
    
    return pattern;
  }
  
  /**
   * Calculate the preservation ratio for the current mode
   */
  public calculatePreservationRatio(): { stability: number, exploration: number } {
    if (this.config.mode === WaveMode.STABILITY) {
      // Stability mode targets 75% stability, 25% exploration
      return {
        stability: 0.75,
        exploration: 0.25
      };
    } else {
      // Exploration mode targets 25% stability, 75% exploration
      return {
        stability: 0.25,
        exploration: 0.75
      };
    }
  }
  
  /**
   * Calculate raw variance based on the current phase
   */
  private calculateRawVariance(): number {
    // Apply primary, secondary, and tertiary harmonics with phase shifts
    const primaryWave = this.config.primaryAmplitude * Math.sin(this.currentPhase);
    const secondaryWave = this.config.secondaryAmplitude * Math.sin(2 * this.currentPhase + this.config.phaseShift);
    const tertiaryWave = this.config.tertiaryAmplitude * Math.sin(3 * this.currentPhase + 2 * this.config.phaseShift);
    
    // Combine all harmonics
    return primaryWave + secondaryWave + tertiaryWave;
  }
  
  /**
   * Constrain variance to maintain the 75/25 preservation ratio
   */
  private constrainVariance(rawVariance: number, baseCoherence: number): number {
    if (this.config.mode === WaveMode.STABILITY) {
      // In stability mode (0.7500), negative variance is constrained
      // We don't want to go below the 75% threshold
      
      // If variance is negative and would push coherence below the threshold
      if (rawVariance < 0) {
        // Apply stable threshold (0.7500 - 0.0625 = 0.6875)
        const stableThreshold = 0.7500 - this.config.maxStabilityVariation;
        
        // If applying raw variance would go below threshold
        if (baseCoherence + rawVariance < stableThreshold) {
          // Constrain to threshold
          return stableThreshold - baseCoherence;
        }
      }
    } else {
      // In exploration mode (0.2494), positive variance is constrained
      // We don't want to go above the 25% threshold
      
      // If variance is positive and would push coherence above the threshold
      if (rawVariance > 0) {
        // Apply exploration threshold (0.2494 + 0.1875 = 0.4369)
        const explorationThreshold = 0.2494 + this.config.maxExplorationVariation;
        
        // If applying raw variance would go above threshold
        if (baseCoherence + rawVariance > explorationThreshold) {
          // Constrain to threshold
          return explorationThreshold - baseCoherence;
        }
      }
    }
    
    // If no constraints needed, return the raw variance
    return rawVariance;
  }
}

// Singleton instance
let brazilianWaveInstance: BrazilianWaveProtocol | null = null;

/**
 * Get the Brazilian Wave Protocol instance
 */
export function getBrazilianWaveProtocol(): BrazilianWaveProtocol {
  if (!brazilianWaveInstance) {
    brazilianWaveInstance = new BrazilianWaveProtocol();
  }
  
  return brazilianWaveInstance;
}