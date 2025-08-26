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
  private readonly DEFAULT_TARGET_COHERENCE = 0.7500;
  private readonly DEFAULT_OSCILLATOR_COUNT = 24;
  private readonly DEFAULT_STABILITY_RATIO = 0.75; // 3:1 ratio
  private readonly DEFAULT_COUPLING_STRENGTH = 0.8;
  private readonly DEFAULT_NOISE_LEVEL = 0.05;
  private readonly DEFAULT_STABILITY_GROUP_NOISE = 0.025; // 0.5x base noise
  private readonly DEFAULT_ADAPTABILITY_GROUP_NOISE = 0.075; // 1.5x base noise
  private readonly DEFAULT_CYCLE_DURATION = 100;
  private readonly DEFAULT_TARGET_RETURN_TIME = 10;

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
      entropyValue: 0
    };
  }

  /**
   * Initialize oscillators with the appropriate ratios of stability vs adaptability
   */
  private initializeOscillators(): void {
    this.oscillators = [];
    const stabilityCount = Math.floor(this.config.oscillatorCount * this.config.stabilityRatio);
    const adaptabilityCount = this.config.oscillatorCount - stabilityCount;
    
    // Create stability oscillators
    for (let i = 0; i < stabilityCount; i++) {
      this.oscillators.push({
        phase: Math.random() * 2 * Math.PI, // Random initial phase
        naturalFreq: 0.9 + Math.random() * 0.2, // Slower frequency (0.9-1.1)
        group: 'stability',
        weight: 1.0
      });
    }
    
    // Create adaptability oscillators
    for (let i = 0; i < adaptabilityCount; i++) {
      this.oscillators.push({
        phase: Math.random() * 2 * Math.PI, // Random initial phase
        naturalFreq: 1.1 + Math.random() * 0.4, // Faster frequency (1.1-1.5)
        group: 'adaptability',
        weight: 1.0
      });
    }
  }

  /**
   * Update the system by one time step
   */
  public update(): CoherenceState {
    this.cycle++;
    
    // For each oscillator, update its phase based on:
    // 1. Its natural frequency
    // 2. Coupling with other oscillators
    // 3. Noise (stochastic resonance)
    for (let i = 0; i < this.oscillators.length; i++) {
      const oscillator = this.oscillators[i];
      
      // Calculate coupling term (mean field)
      let sumSin = 0;
      let sumCos = 0;
      for (const other of this.oscillators) {
        sumSin += Math.sin(other.phase);
        sumCos += Math.cos(other.phase);
      }
      const meanPhase = Math.atan2(sumSin, sumCos);
      
      // Apply appropriate noise level based on oscillator group
      const noise = oscillator.group === 'stability'
        ? this.config.stabilityGroupNoise
        : this.config.adaptabilityGroupNoise;
      
      // Apply random noise (for stochastic resonance)
      const noiseAmount = (Math.random() * 2 - 1) * noise;
      
      // Update phase using Kuramoto model with noise
      oscillator.phase += 
        oscillator.naturalFreq + // Natural frequency term
        this.config.couplingStrength * Math.sin(meanPhase - oscillator.phase) + // Coupling term
        noiseAmount; // Noise term
      
      // Keep phase in valid range [0, 2π)
      oscillator.phase = oscillator.phase % (2 * Math.PI);
      if (oscillator.phase < 0) {
        oscillator.phase += 2 * Math.PI;
      }
    }
    
    // Calculate order parameter (coherence)
    let sumSin = 0;
    let sumCos = 0;
    for (const oscillator of this.oscillators) {
      sumSin += oscillator.weight * Math.sin(oscillator.phase);
      sumCos += oscillator.weight * Math.cos(oscillator.phase);
    }
    
    const totalWeight = this.oscillators.reduce((sum, osc) => sum + osc.weight, 0);
    sumSin /= totalWeight;
    sumCos /= totalWeight;
    
    // Calculate coherence (R value in Kuramoto model)
    let coherence = Math.sqrt(sumSin * sumSin + sumCos * sumCos);
    
    // Apply forced coherence if perturbation is active
    if (this.perturbationActive && this.forcedCoherence !== null) {
      coherence = this.forcedCoherence;
    }
    
    // Update the Ouroboros cycle
    this.updateOuroborosCycle();
    
    // Calculate entropy
    const entropy = this.calculateEntropy();
    
    // Update coherence state
    this.coherenceState = {
      value: coherence,
      cycle: this.cycle,
      phase: this.coherenceState.phase,
      cyclePosition: this.coherenceState.cyclePosition,
      noiseLevel: this.config.baseNoiseLevel,
      entropyValue: entropy
    };
    
    return this.coherenceState;
  }

  /**
   * Update the Ouroboros cycle (3:1 ↔ 1:3)
   */
  private updateOuroborosCycle(): void {
    // Calculate cycle position (0-100)
    this.coherenceState.cyclePosition = (this.cycle % this.config.cycleDuration) / 
      this.config.cycleDuration * 100;
    
    // Update phase based on cycle position (75% of time in 3:1, 25% in 1:3)
    if (this.coherenceState.cyclePosition < 75) {
      this.coherenceState.phase = '3:1';
    } else {
      this.coherenceState.phase = '1:3';
    }
    
    // Gradually adjust oscillator weights based on the current phase
    const transitionSpeed = 0.01;
    for (const oscillator of this.oscillators) {
      if (this.coherenceState.phase === '3:1') {
        // In 3:1 phase, stability oscillators have higher weight
        if (oscillator.group === 'stability') {
          oscillator.weight = Math.min(1.5, oscillator.weight + transitionSpeed);
        } else {
          oscillator.weight = Math.max(0.5, oscillator.weight - transitionSpeed);
        }
      } else {
        // In 1:3 phase, adaptability oscillators have higher weight
        if (oscillator.group === 'adaptability') {
          oscillator.weight = Math.min(1.5, oscillator.weight + transitionSpeed);
        } else {
          oscillator.weight = Math.max(0.5, oscillator.weight - transitionSpeed);
        }
      }
    }
  }

  /**
   * Calculate the entropy of the system
   */
  private calculateEntropy(): number {
    // Convert phases to bins (discretize the phase space)
    const binCount = 16; // Number of bins
    const bins = new Array(binCount).fill(0);
    
    // Count oscillators in each phase bin
    for (const oscillator of this.oscillators) {
      const binIndex = Math.floor(oscillator.phase / (2 * Math.PI) * binCount) % binCount;
      bins[binIndex]++;
    }
    
    // Calculate Shannon entropy: -sum(p_i * log(p_i))
    let entropy = 0;
    for (let count of bins) {
      if (count > 0) {
        const probability = count / this.oscillators.length;
        entropy -= probability * Math.log(probability);
      }
    }
    
    // Normalize entropy to [0, 1] range (divide by log(binCount))
    return entropy / Math.log(binCount);
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
    
    // Reset perturbation after duration
    setTimeout(() => {
      this.releasePerturbation();
    }, duration * 100); // Approximate time for cycles
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
    
    // Wait until perturbation is released
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Measure cycles until return to attractor
    let cyclesElapsed = 0;
    const startCycle = this.cycle;
    
    while (cyclesElapsed < maxCycles) {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      cyclesElapsed = this.cycle - startCycle;
      
      // Check if return to attractor
      if (OuroborosUtils.isNearAttractor(this.coherenceState.value)) {
        return cyclesElapsed;
      }
    }
    
    // Did not return within maxCycles
    return null;
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
    const testLevels = [0.02, 0.035, 0.05, 0.065, 0.08, 0.095, 0.11];
    const results: {
      baseNoiseLevel: number;
      stabilityRatio: number;
      adaptabilityRatio: number;
      stability: number;
      returnTime: number | null;
    }[] = [];
    
    // Test different noise levels
    for (const baseNoise of testLevels) {
      // Test different stability/adaptability ratios
      for (const stabilityRatio of [0.4, 0.5, 0.6]) {
        for (const adaptabilityRatio of [1.4, 1.5, 1.6]) {
          // Update config with test values
          this.updateConfig({
            baseNoiseLevel: baseNoise,
            stabilityGroupNoise: baseNoise * stabilityRatio,
            adaptabilityGroupNoise: baseNoise * adaptabilityRatio
          });
          
          // Run for a bit to stabilize
          for (let i = 0; i < 30; i++) {
            this.update();
            await new Promise(resolve => setTimeout(resolve, 10));
          }
          
          // Measure stability (variance over 20 cycles)
          const samples: number[] = [];
          for (let i = 0; i < 20; i++) {
            this.update();
            samples.push(this.coherenceState.value);
            await new Promise(resolve => setTimeout(resolve, 10));
          }
          
          // Calculate stability (negative variance - higher is better)
          const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
          const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 0), 0) / samples.length;
          const stability = 1 - variance;
          
          // Test return time
          const returnTime = await this.testReturnTime(0.65, 30);
          
          results.push({
            baseNoiseLevel: baseNoise,
            stabilityRatio,
            adaptabilityRatio,
            stability,
            returnTime
          });
        }
      }
    }
    
    // Find best configuration (prioritize both stability and fast return)
    let bestResult = results[0];
    
    for (const result of results) {
      const currentScore = (result.stability * 0.7) + 
        (result.returnTime !== null ? (30 - result.returnTime) / 30 * 0.3 : 0);
      const bestScore = (bestResult.stability * 0.7) + 
        (bestResult.returnTime !== null ? (30 - bestResult.returnTime) / 30 * 0.3 : 0);
      
      if (currentScore > bestScore) {
        bestResult = result;
      }
    }
    
    // Apply the best configuration
    this.updateConfig({
      baseNoiseLevel: bestResult.baseNoiseLevel,
      stabilityGroupNoise: bestResult.baseNoiseLevel * bestResult.stabilityRatio,
      adaptabilityGroupNoise: bestResult.baseNoiseLevel * bestResult.adaptabilityRatio
    });
    
    return {
      baseNoiseLevel: bestResult.baseNoiseLevel,
      stabilityGroupNoise: bestResult.baseNoiseLevel * bestResult.stabilityRatio,
      adaptabilityGroupNoise: bestResult.baseNoiseLevel * bestResult.adaptabilityRatio,
      stability: bestResult.stability,
      returnTime: bestResult.returnTime
    };
  }

  /**
   * Get the current coherence state
   */
  public getCoherenceState(): CoherenceState {
    return { ...this.coherenceState };
  }

  /**
   * Get a deep copy of the oscillator states
   */
  public getOscillators(): OscillatorState[] {
    return this.oscillators.map(osc => ({ ...osc }));
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
    
    // If oscillator count or ratio changed, reinitialize oscillators
    if (
      config.oscillatorCount !== undefined ||
      config.stabilityRatio !== undefined
    ) {
      this.initializeOscillators();
    }
  }
}

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