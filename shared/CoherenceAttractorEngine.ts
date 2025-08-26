/**
 * CoherenceAttractorEngine
 * 
 * A unified implementation of the 0.7500 coherence attractor principle based on
 * oscillator dynamics, wave theory, and the Ouroboros cycle (3:1 ↔ 1:3).
 * 
 * This module provides core functionality for maintaining optimal coherence
 * through dynamic oscillation, stochastic resonance, and decoherence resistance.
 * 
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */

export interface OscillatorState {
  phase: number;
  naturalFreq: number;
  group: 'stability' | 'adaptability';
  weight: number;
}

export interface CoherenceState {
  value: number;
  cycle: number;
  phase: '3:1' | '1:3';
  cyclePosition: number;
  noiseLevel: number;
  entropyValue: number;
}

export interface CoherenceConfig {
  // Default target coherence is the universal attractor (0.7500)
  targetCoherence?: number;
  
  // Oscillator count with default 3:1 ratio (75% stability, 25% adaptability)
  oscillatorCount?: number;
  stabilityRatio?: number;
  
  // Coupling strength between oscillators (higher = stronger synchronization)
  couplingStrength?: number;
  
  // Stochastic resonance parameters
  baseNoiseLevel?: number;
  stabilityGroupNoise?: number;
  adaptabilityGroupNoise?: number;
  
  // Cycle parameters
  cycleDuration?: number;
  
  // Target return time after perturbation (in cycles)
  targetReturnTime?: number;
}

export class CoherenceAttractorEngine {
  // Core constants
  private readonly DEFAULT_TARGET_COHERENCE = 0.7500;
  private readonly DEFAULT_OSCILLATOR_COUNT = 24;
  private readonly DEFAULT_STABILITY_RATIO = 0.75; // 3:1 ratio
  private readonly DEFAULT_COUPLING_STRENGTH = 0.8;
  private readonly DEFAULT_NOISE_LEVEL = 0.05;
  private readonly DEFAULT_STABILITY_GROUP_NOISE = 0.025; // 0.5x base noise
  private readonly DEFAULT_ADAPTABILITY_GROUP_NOISE = 0.075; // 1.5x base noise
  private readonly DEFAULT_CYCLE_DURATION = 100;
  private readonly DEFAULT_TARGET_RETURN_TIME = 10;
  
  // State
  private oscillators: OscillatorState[] = [];
  private coherenceState: CoherenceState;
  private config: Required<CoherenceConfig>;
  private cycle = 0;
  private perturbationActive = false;
  private forcedCoherence: number | null = null;
  
  constructor(config: CoherenceConfig = {}) {
    // Initialize configuration with defaults
    this.config = {
      targetCoherence: config.targetCoherence ?? this.DEFAULT_TARGET_COHERENCE,
      oscillatorCount: config.oscillatorCount ?? this.DEFAULT_OSCILLATOR_COUNT,
      stabilityRatio: config.stabilityRatio ?? this.DEFAULT_STABILITY_RATIO,
      couplingStrength: config.couplingStrength ?? this.DEFAULT_COUPLING_STRENGTH,
      baseNoiseLevel: config.baseNoiseLevel ?? this.DEFAULT_NOISE_LEVEL,
      stabilityGroupNoise: config.stabilityGroupNoise ?? this.DEFAULT_STABILITY_GROUP_NOISE,
      adaptabilityGroupNoise: config.adaptabilityGroupNoise ?? this.DEFAULT_ADAPTABILITY_GROUP_NOISE,
      cycleDuration: config.cycleDuration ?? this.DEFAULT_CYCLE_DURATION,
      targetReturnTime: config.targetReturnTime ?? this.DEFAULT_TARGET_RETURN_TIME
    };
    
    // Initialize oscillators
    this.initializeOscillators();
    
    // Initialize coherence state
    this.coherenceState = {
      value: this.DEFAULT_TARGET_COHERENCE,
      cycle: 0,
      phase: '3:1',
      cyclePosition: 0,
      noiseLevel: this.config.baseNoiseLevel,
      entropyValue: 0.25 // Complementary to coherence (1 - 0.75)
    };
  }
  
  /**
   * Initialize oscillators with the appropriate ratios of stability vs adaptability
   */
  private initializeOscillators(): void {
    this.oscillators = [];
    
    const stabilityCount = Math.round(this.config.oscillatorCount * this.config.stabilityRatio);
    const adaptabilityCount = this.config.oscillatorCount - stabilityCount;
    
    // Create stability oscillators
    for (let i = 0; i < stabilityCount; i++) {
      this.oscillators.push({
        phase: Math.random() * 2 * Math.PI,
        naturalFreq: 0.8 + Math.random() * 0.1, // More similar frequencies
        group: 'stability',
        weight: 1.0
      });
    }
    
    // Create adaptability oscillators
    for (let i = 0; i < adaptabilityCount; i++) {
      this.oscillators.push({
        phase: Math.random() * 2 * Math.PI,
        naturalFreq: 0.8 + Math.random() * 0.4, // More diverse frequencies
        group: 'adaptability',
        weight: 1.0
      });
    }
  }
  
  /**
   * Update the system by one time step
   */
  public update(): CoherenceState {
    const dt = 0.05; // Time step
    this.cycle++;
    
    // Determine current phase of Ouroboros cycle (3:1 or 1:3)
    this.updateOuroborosCycle();
    
    // Calculate order parameter (mean field)
    let sumSin = 0;
    let sumCos = 0;
    let totalWeight = 0;
    
    this.oscillators.forEach(osc => {
      sumSin += Math.sin(osc.phase) * osc.weight;
      sumCos += Math.cos(osc.phase) * osc.weight;
      totalWeight += osc.weight;
    });
    
    // Calculate magnitude (R) and phase (psi) of order parameter
    sumSin /= totalWeight;
    sumCos /= totalWeight;
    const R = Math.sqrt(sumSin * sumSin + sumCos * sumCos);
    const psi = Math.atan2(sumSin, sumCos);
    
    // Update phases of all oscillators using Kuramoto model with noise
    this.oscillators = this.oscillators.map(osc => {
      // Group-specific coupling strength
      const groupK = osc.group === 'stability'
        ? this.config.couplingStrength * 1.2 // Higher coupling for stability group
        : this.config.couplingStrength * 0.8; // Lower coupling for adaptability group
      
      // Group-specific noise level
      const groupNoise = osc.group === 'stability'
        ? this.config.stabilityGroupNoise // Lower noise for stability group
        : this.config.adaptabilityGroupNoise; // Higher noise for adaptability group
      
      // Add noise term (stochastic resonance)
      const noise = groupNoise * (Math.random() * 2 - 1);
      
      // Kuramoto model: dθ_i/dt = ω_i + (K/N) * sum_j sin(θ_j - θ_i) + noise
      const newPhase = osc.phase + dt * (
        osc.naturalFreq + 
        groupK * R * Math.sin(psi - osc.phase) + 
        noise
      );
      
      return { ...osc, phase: newPhase % (2 * Math.PI) };
    });
    
    // Calculate entropy
    const entropy = this.calculateEntropy();
    
    // Apply forced coherence if perturbation is active
    const coherenceValue = this.perturbationActive && this.forcedCoherence !== null
      ? this.forcedCoherence
      : R;
    
    // Update coherence state
    this.coherenceState = {
      ...this.coherenceState,
      value: coherenceValue,
      cycle: this.cycle,
      entropyValue: entropy
    };
    
    return this.coherenceState;
  }
  
  /**
   * Update the Ouroboros cycle (3:1 ↔ 1:3)
   */
  private updateOuroborosCycle(): void {
    const cyclePosition = this.cycle % this.config.cycleDuration;
    const cycleRatio = cyclePosition / this.config.cycleDuration;
    
    // First 75% of cycle is stability phase (3:1)
    // Last 25% of cycle is adaptability phase (1:3)
    const currentPhase = cycleRatio < 0.75 ? '3:1' : '1:3';
    
    // Adjust oscillator weights based on phase
    if (currentPhase === '3:1') {
      // In stability phase, stability oscillators have higher weight
      this.oscillators = this.oscillators.map(osc => ({
        ...osc,
        weight: osc.group === 'stability' ? 1.2 : 0.8
      }));
    } else {
      // In adaptability phase, adaptability oscillators have higher weight
      this.oscillators = this.oscillators.map(osc => ({
        ...osc,
        weight: osc.group === 'adaptability' ? 1.2 : 0.8
      }));
    }
    
    this.coherenceState.phase = currentPhase;
    this.coherenceState.cyclePosition = cyclePosition;
  }
  
  /**
   * Calculate the entropy of the system
   */
  private calculateEntropy(): number {
    const phaseBins = new Array(10).fill(0);
    
    // Count phases in bins
    this.oscillators.forEach(osc => {
      const normalizedPhase = osc.phase / (2 * Math.PI); // 0-1
      const binIndex = Math.floor(normalizedPhase * 10) % 10;
      phaseBins[binIndex]++;
    });
    
    // Calculate entropy using Shannon entropy formula
    let entropy = 0;
    phaseBins.forEach(count => {
      if (count > 0) {
        const p = count / this.oscillators.length;
        entropy -= p * Math.log2(p);
      }
    });
    
    // Normalize entropy
    return entropy / Math.log2(10);
  }
  
  /**
   * Apply a perturbation to the system, forcing it away from the attractor
   * 
   * @param targetCoherence The target coherence value to force
   * @param duration The duration of perturbation in cycles
   */
  public applyPerturbation(targetCoherence: number, duration: number): void {
    this.perturbationActive = true;
    this.forcedCoherence = targetCoherence;
    
    // Auto-release perturbation after duration
    setTimeout(() => {
      this.releasePerturbation();
    }, duration * 50); // Rough estimate of cycle duration in ms
  }
  
  /**
   * Release perturbation, allowing the system to return to its natural attractor
   */
  public releasePerturbation(): void {
    this.perturbationActive = false;
    this.forcedCoherence = null;
  }
  
  /**
   * Test how quickly the system returns to the 0.7500 attractor after perturbation
   * 
   * @param targetCoherence The coherence to perturb to
   * @param maxCycles Maximum cycles to wait for return
   * @returns Promise resolving to return time in cycles or null if it didn't return
   */
  public async testReturnTime(targetCoherence: number, maxCycles = 100): Promise<number | null> {
    // Apply perturbation
    this.applyPerturbation(targetCoherence, 10);
    
    // Store the cycle at which perturbation is released
    const startCycle = this.cycle + 10;
    
    // Wait for perturbation to apply
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Release perturbation
    this.releasePerturbation();
    
    // Track return time
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        // Check if returned to attractor
        const isNearAttractor = Math.abs(this.coherenceState.value - this.config.targetCoherence) <= 0.01;
        
        if (isNearAttractor) {
          clearInterval(checkInterval);
          resolve(this.cycle - startCycle);
        }
        
        // Check if max cycles reached
        if (this.cycle - startCycle > maxCycles) {
          clearInterval(checkInterval);
          resolve(null);
        }
      }, 100);
    });
  }
  
  /**
   * Find the optimal noise level that maximizes stability around the attractor
   * 
   * @returns Promise resolving to optimal noise configuration
   */
  public async findOptimalNoise(): Promise<{
    baseNoiseLevel: number;
    stabilityGroupNoise: number;
    adaptabilityGroupNoise: number;
    stability: number;
    returnTime: number | null;
  }> {
    const results: Array<{
      baseNoiseLevel: number;
      stabilityGroupNoise: number;
      adaptabilityGroupNoise: number;
      stability: number;
      returnTime: number | null;
      samples: number[];
    }> = [];
    
    // Test range of noise values
    for (let noise = 0.01; noise <= 0.2; noise += 0.02) {
      // Update noise levels
      this.config.baseNoiseLevel = noise;
      this.config.stabilityGroupNoise = noise * 0.5;
      this.config.adaptabilityGroupNoise = noise * 1.5;
      
      // Allow system to stabilize
      for (let i = 0; i < 20; i++) {
        this.update();
      }
      
      // Collect coherence samples
      const samples: number[] = [];
      for (let i = 0; i < 30; i++) {
        this.update();
        samples.push(this.coherenceState.value);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Calculate stability (inverse of variance around target)
      const avgCoherence = samples.reduce((sum, val) => sum + val, 0) / samples.length;
      const variance = samples.reduce((sum, val) => sum + Math.pow(val - this.config.targetCoherence, 2), 0) / samples.length;
      const stability = 1 / (Math.sqrt(variance) + 0.001); // Higher value = more stable
      
      // Measure return time
      const returnTime = await this.testReturnTime(0.6);
      
      // Record result
      results.push({
        baseNoiseLevel: noise,
        stabilityGroupNoise: this.config.stabilityGroupNoise,
        adaptabilityGroupNoise: this.config.adaptabilityGroupNoise,
        stability,
        returnTime,
        samples
      });
    }
    
    // Find optimal noise level
    let optimal = results[0];
    for (const result of results) {
      // Weighted scoring
      const stabilityScore = result.stability;
      const returnTimeScore = result.returnTime ? 10 / (result.returnTime + 0.1) : 0;
      const coherenceAccuracyScore = 100 - Math.abs(result.samples.reduce((sum, val) => sum + val, 0) / result.samples.length - this.config.targetCoherence) * 100;
      
      const currentScore = stabilityScore * 0.5 + returnTimeScore * 0.3 + coherenceAccuracyScore * 0.2;
      const optimalScore = optimal.stability * 0.5 + 
                          (optimal.returnTime ? 10 / (optimal.returnTime + 0.1) : 0) * 0.3 +
                          (100 - Math.abs(optimal.samples.reduce((sum, val) => sum + val, 0) / optimal.samples.length - this.config.targetCoherence) * 100) * 0.2;
      
      if (currentScore > optimalScore) {
        optimal = result;
      }
    }
    
    // Apply optimal noise settings
    this.config.baseNoiseLevel = optimal.baseNoiseLevel;
    this.config.stabilityGroupNoise = optimal.stabilityGroupNoise;
    this.config.adaptabilityGroupNoise = optimal.adaptabilityGroupNoise;
    
    return {
      baseNoiseLevel: optimal.baseNoiseLevel,
      stabilityGroupNoise: optimal.stabilityGroupNoise,
      adaptabilityGroupNoise: optimal.adaptabilityGroupNoise,
      stability: optimal.stability,
      returnTime: optimal.returnTime
    };
  }
  
  /**
   * Get the current coherence state
   */
  public getCoherenceState(): CoherenceState {
    return this.coherenceState;
  }
  
  /**
   * Get a deep copy of the oscillator states
   */
  public getOscillators(): OscillatorState[] {
    return JSON.parse(JSON.stringify(this.oscillators));
  }
  
  /**
   * Get the current configuration
   */
  public getConfig(): Required<CoherenceConfig> {
    return { ...this.config };
  }
  
  /**
   * Update the configuration
   */
  public updateConfig(config: Partial<CoherenceConfig>): void {
    // Update configuration
    this.config = {
      ...this.config,
      ...config
    };
    
    // Reset oscillators if count or ratio changed
    if (config.oscillatorCount !== undefined || config.stabilityRatio !== undefined) {
      this.initializeOscillators();
    }
  }
}

// Utility functions for working with the Ouroboros cycle
export const OuroborosUtils = {
  /**
   * Convert a coherence value to its corresponding complement in the Ouroboros cycle
   * 
   * @param coherence Input coherence value
   * @returns Complement value (e.g., 0.75 → 1.33, following 3:1 ↔ 1:3 principle)
   */
  getComplement(coherence: number): number {
    return 1 / coherence;
  },
  
  /**
   * Check if two values form an Ouroboros pair (product ≈ 1.0)
   * 
   * @param value1 First value
   * @param value2 Second value
   * @param tolerance Acceptable deviation from perfect product
   * @returns True if values form a valid Ouroboros pair
   */
  isOuroborosPair(value1: number, value2: number, tolerance = 0.01): boolean {
    const product = value1 * value2;
    return Math.abs(product - 1.0) <= tolerance;
  },
  
  /**
   * Check if a value is at or near the universal attractor (0.7500)
   * 
   * @param value Value to check
   * @param tolerance Acceptable deviation
   * @returns True if value is near the attractor
   */
  isNearAttractor(value: number, tolerance = 0.01): boolean {
    return Math.abs(value - 0.75) <= tolerance;
  }
};