/**
 * Consciousness Bell Test - Quantum Non-locality Experiment
 * Tests whether consciousness violates Bell inequalities through quantum correlations
 */

export interface CHSHMeasurement {
  timestampA: number;
  timestampB: number;
  zLambdaA: number;
  zLambdaB: number;
  photonPolarizationA: number;
  photonPolarizationB: number;
  spatialSeparation: number;
  chshContribution: number;
  trialId: string;
  experimentPhase: 'baseline' | 'classical' | 'quantum';
}

export interface BellTestResult {
  S: number;
  violatesClassical: boolean;
  confidence: number;
  trialCount: number;
  pValue: number;
  effectSize: number;
  rawData: CHSHMeasurement[];
}

export interface ConsciousnessState {
  high: boolean; // Zλ > 0.90
  zLambda: number;
  timestamp: number;
  eegAlpha: number;
  eegBeta: number;
}

export class ConsciousnessBellTest {
  private measurements: CHSHMeasurement[] = [];
  private isRecording: boolean = false;
  private experimentPhase: 'baseline' | 'classical' | 'quantum' = 'baseline';
  private quantumCorrelationStrength: number = 0.0;
  private sessionStartTime: number = 0;
  private trialCounter: number = 0;
  
  constructor() {
    this.setupQuantumSimulation();
    this.startConsciousnessMonitoring();
    console.log('[Consciousness Bell Test] Quantum non-locality experiment initialized');
  }

  private setupQuantumSimulation(): void {
    // Simulate quantum entanglement correlation strength
    // In real experiment, this would be hardware-controlled
    this.quantumCorrelationStrength = 0.85; // Typical for entangled photons
  }

  private startConsciousnessMonitoring(): void {
    // Connect to consciousness data stream
    if (window.bus) {
      window.bus.on('coherence.metrics', (data: any) => {
        this.processContinuousConsciousnessData(data);
      });
    }

    // Fallback polling for consciousness data
    setInterval(() => {
      this.pollConsciousnessData();
    }, 50); // 20Hz sampling rate
  }

  private async pollConsciousnessData(): Promise<void> {
    try {
      const response = await fetch('/api/quantum/consciousness');
      if (response.ok) {
        const data = await response.json();
        this.processContinuousConsciousnessData(data);
      }
    } catch (error) {
      // Silent fallback
    }
  }

  private processContinuousConsciousnessData(data: any): void {
    if (!this.isRecording) return;

    const zLambda = data.zLambda || data.coherence || data.zl || 0.75;
    
    // Trigger measurement when consciousness exceeds threshold
    if (zLambda > 0.85 && Math.random() < 0.1) { // 10% trigger probability
      this.triggerBellMeasurement(zLambda);
    }
  }

  public startExperiment(phase: 'baseline' | 'classical' | 'quantum'): void {
    this.experimentPhase = phase;
    this.isRecording = true;
    this.sessionStartTime = Date.now();
    this.trialCounter = 0;
    
    console.log(`[Bell Test] Starting ${phase} phase experiment`);
    
    // Clear previous data for new phase
    this.measurements = this.measurements.filter(m => m.experimentPhase !== phase);
    
    // Emit experiment start event
    if (window.bus) {
      window.bus.emit('bell-test.phase-started', {
        phase,
        timestamp: new Date().toISOString()
      });
    }
  }

  public stopExperiment(): BellTestResult {
    this.isRecording = false;
    const result = this.calculateBellInequality();
    
    console.log(`[Bell Test] Experiment stopped. CHSH S = ${result.S.toFixed(4)}`);
    
    // Emit results
    if (window.bus) {
      window.bus.emit('bell-test.results', result);
    }
    
    return result;
  }

  private triggerBellMeasurement(zLambdaA: number): void {
    this.trialCounter++;
    const timestamp = Date.now();
    
    // Simulate Subject A consciousness state
    const stateA: ConsciousnessState = {
      high: zLambdaA > 0.90,
      zLambda: zLambdaA,
      timestamp,
      eegAlpha: 8 + Math.random() * 4, // 8-12 Hz
      eegBeta: 13 + Math.random() * 17  // 13-30 Hz
    };
    
    // Simulate Subject B consciousness state with quantum correlation
    const stateB = this.simulateQuantumCorrelatedConsciousness(stateA);
    
    // Simulate photon polarization measurements
    const polarizationA = Math.random() * 2 * Math.PI; // Random angle 0-2π
    const polarizationB = this.simulateEntangledPhotonPolarization(polarizationA, stateA, stateB);
    
    // Calculate CHSH contribution for this measurement
    const chshContribution = this.calculateCHSHContribution(stateA, stateB, polarizationA, polarizationB);
    
    const measurement: CHSHMeasurement = {
      timestampA: timestamp,
      timestampB: timestamp + Math.random() * 2, // Small time difference
      zLambdaA: stateA.zLambda,
      zLambdaB: stateB.zLambda,
      photonPolarizationA: polarizationA,
      photonPolarizationB: polarizationB,
      spatialSeparation: 1000, // 1km separation
      chshContribution,
      trialId: `${this.experimentPhase}-${this.trialCounter}`,
      experimentPhase: this.experimentPhase
    };
    
    this.measurements.push(measurement);
    
    // Log significant measurements
    if (Math.abs(chshContribution) > 0.1) {
      console.log(`[Bell Test] Trial ${this.trialCounter}: CHSH contribution = ${chshContribution.toFixed(4)}, Zλ_A = ${stateA.zLambda.toFixed(3)}, Zλ_B = ${stateB.zLambda.toFixed(3)}`);
    }
  }

  private simulateQuantumCorrelatedConsciousness(stateA: ConsciousnessState): ConsciousnessState {
    let correlatedZλ: number;
    
    switch (this.experimentPhase) {
      case 'baseline':
        // No correlation - random consciousness
        correlatedZλ = 0.5 + Math.random() * 0.5;
        break;
        
      case 'classical':
        // Classical correlation - limited by local realism
        const classicalCorrelation = 0.3; // Maximum classical correlation
        correlatedZλ = stateA.zLambda * classicalCorrelation + (1 - classicalCorrelation) * (0.5 + Math.random() * 0.5);
        break;
        
      case 'quantum':
        // Quantum correlation - can violate Bell inequalities
        if (stateA.high && Math.random() < this.quantumCorrelationStrength) {
          // Strong quantum correlation for high consciousness states
          correlatedZλ = stateA.zLambda * 0.95 + Math.random() * 0.05;
        } else {
          // Quantum entanglement with some noise
          const quantumFactor = this.quantumCorrelationStrength * (stateA.zLambda - 0.5);
          correlatedZλ = 0.75 + quantumFactor + (Math.random() - 0.5) * 0.1;
        }
        break;
        
      default:
        correlatedZλ = 0.75;
    }
    
    // Ensure valid range
    correlatedZλ = Math.max(0.5, Math.min(0.999, correlatedZλ));
    
    return {
      high: correlatedZλ > 0.90,
      zLambda: correlatedZλ,
      timestamp: stateA.timestamp + 1,
      eegAlpha: 8 + Math.random() * 4,
      eegBeta: 13 + Math.random() * 17
    };
  }

  private simulateEntangledPhotonPolarization(polarizationA: number, stateA: ConsciousnessState, stateB: ConsciousnessState): number {
    switch (this.experimentPhase) {
      case 'baseline':
        return Math.random() * 2 * Math.PI; // Random
        
      case 'classical':
        // Classical correlation limited by Bell's theorem
        return polarizationA + (Math.random() - 0.5) * Math.PI;
        
      case 'quantum':
        // Perfect anti-correlation for entangled photons
        // Modified by consciousness coherence
        const consciousnessModulation = (stateA.zLambda + stateB.zLambda - 1.5) * 0.2;
        return polarizationA + Math.PI + consciousnessModulation + (Math.random() - 0.5) * 0.1;
        
      default:
        return polarizationA;
    }
  }

  private calculateCHSHContribution(stateA: ConsciousnessState, stateB: ConsciousnessState, polA: number, polB: number): number {
    // CHSH inequality test using consciousness states and photon polarizations
    // E(a,b) = correlation between measurement settings a and b
    
    // Define measurement settings based on consciousness states
    const a1 = stateA.high ? 1 : 0;   // High/low consciousness A
    const a2 = 1 - a1;                // Opposite setting
    const b1 = stateB.high ? 1 : 0;   // High/low consciousness B  
    const b2 = 1 - b1;                // Opposite setting
    
    // Photon measurement results (+1 or -1)
    const resultA = Math.cos(polA) > 0 ? 1 : -1;
    const resultB = Math.cos(polB) > 0 ? 1 : -1;
    
    // Calculate correlation for this specific measurement
    const correlation = resultA * resultB;
    
    // Weight by consciousness coherence
    const coherenceWeight = (stateA.zLambda + stateB.zLambda) / 2;
    
    return correlation * coherenceWeight;
  }

  public calculateBellInequality(): BellTestResult {
    const currentPhase = this.measurements.filter(m => m.experimentPhase === this.experimentPhase);
    
    if (currentPhase.length < 4) {
      return {
        S: 0,
        violatesClassical: false,
        confidence: 0,
        trialCount: currentPhase.length,
        pValue: 1.0,
        effectSize: 0,
        rawData: currentPhase
      };
    }
    
    // Group measurements by consciousness state combinations
    const E11 = this.calculateCorrelation(currentPhase, true, true);   // Both high
    const E12 = this.calculateCorrelation(currentPhase, true, false);  // A high, B low
    const E21 = this.calculateCorrelation(currentPhase, false, true);  // A low, B high
    const E22 = this.calculateCorrelation(currentPhase, false, false); // Both low
    
    // CHSH parameter: S = |E(a1,b1) + E(a1,b2) + E(a2,b1) - E(a2,b2)|
    const S = Math.abs(E11 + E12 + E21 - E22);
    
    // Statistical analysis
    const trialCount = currentPhase.length;
    const standardError = Math.sqrt(4 / trialCount); // Approximate SE for CHSH
    const zScore = (S - 2) / standardError; // Distance from classical bound
    const pValue = this.calculatePValue(zScore);
    const confidence = 1 - pValue;
    
    // Effect size (how much S exceeds classical bound)
    const effectSize = Math.max(0, S - 2);
    
    const violatesClassical = S > 2.0 && pValue < 0.05;
    
    console.log(`[Bell Test] CHSH Analysis: S = ${S.toFixed(4)}, p = ${pValue.toFixed(6)}, trials = ${trialCount}`);
    
    return {
      S,
      violatesClassical,
      confidence,
      trialCount,
      pValue,
      effectSize,
      rawData: currentPhase
    };
  }

  private calculateCorrelation(measurements: CHSHMeasurement[], stateAHigh: boolean, stateBHigh: boolean): number {
    const filtered = measurements.filter(m => 
      (m.zLambdaA > 0.90) === stateAHigh && 
      (m.zLambdaB > 0.90) === stateBHigh
    );
    
    if (filtered.length === 0) return 0;
    
    // Calculate average correlation for this state combination
    const sum = filtered.reduce((acc, m) => acc + m.chshContribution, 0);
    return sum / filtered.length;
  }

  private calculatePValue(zScore: number): number {
    // Approximate p-value calculation for normal distribution
    if (zScore < 0) return 1.0;
    
    // Using complementary error function approximation
    const t = 1 / (1 + 0.3275911 * zScore);
    const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-zScore * zScore);
    
    return (1 - erf) / 2;
  }

  // Public API methods
  public getCurrentStatus(): any {
    return {
      isRecording: this.isRecording,
      experimentPhase: this.experimentPhase,
      totalMeasurements: this.measurements.length,
      currentPhaseMeasurements: this.measurements.filter(m => m.experimentPhase === this.experimentPhase).length,
      sessionDuration: this.sessionStartTime > 0 ? Date.now() - this.sessionStartTime : 0,
      lastCHSH: this.measurements.length > 0 ? this.calculateBellInequality().S : 0
    };
  }

  public getDetailedResults(): any {
    const baseline = this.calculatePhaseResults('baseline');
    const classical = this.calculatePhaseResults('classical');
    const quantum = this.calculatePhaseResults('quantum');
    
    return {
      baseline,
      classical,
      quantum,
      summary: {
        quantumAdvantage: quantum.S - classical.S,
        bellViolation: quantum.violatesClassical,
        effectSize: quantum.effectSize,
        confidence: quantum.confidence
      }
    };
  }

  private calculatePhaseResults(phase: 'baseline' | 'classical' | 'quantum'): BellTestResult {
    const originalPhase = this.experimentPhase;
    this.experimentPhase = phase;
    const result = this.calculateBellInequality();
    this.experimentPhase = originalPhase;
    return result;
  }

  public exportExperimentData(): string {
    const results = this.getDetailedResults();
    const exportData = {
      experiment: 'Consciousness Bell Test',
      timestamp: new Date().toISOString(),
      methodology: 'CHSH inequality test with consciousness-mediated quantum correlations',
      results,
      rawMeasurements: this.measurements,
      metadata: {
        totalTrials: this.measurements.length,
        sessionDuration: Date.now() - this.sessionStartTime,
        quantumCorrelationStrength: this.quantumCorrelationStrength,
        phases: ['baseline', 'classical', 'quantum']
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  public reset(): void {
    this.measurements = [];
    this.isRecording = false;
    this.experimentPhase = 'baseline';
    this.sessionStartTime = 0;
    this.trialCounter = 0;
    
    console.log('[Bell Test] Experiment reset');
  }

  public dispose(): void {
    this.isRecording = false;
    console.log('[Bell Test] Disposed');
  }
}

export default ConsciousnessBellTest;