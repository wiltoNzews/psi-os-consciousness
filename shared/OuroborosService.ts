/**
 * Ouroboros Service
 * 
 * This service coordinates the dynamic oscillation between Structure (3:1) and Adaptability (1:3)
 * based on the Ouroboros Principle. It manages the coherence attractor and provides methods
 * to interact with and observe the system's coherence state.
 * 
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */

import { EventEmitter } from 'events';
import { coherenceAttractor, CoherenceMeasurement } from './CoherenceAttractor.js';

export interface OuroborosState {
  /** Current coherence value (0-1) */
  coherence: number;
  
  /** Current phase (stability or adaptability) */
  phase: 'stability' | 'adaptability';
  
  /** Current ratio (3:1 or 1:3) */
  ratio: string;
  
  /** Whether the system has been perturbed */
  isPerturbed: boolean;
  
  /** Current cycle number */
  cycle: number;
  
  /** Whether the system is running */
  isActive: boolean;
  
  /** Timestamp of last update */
  timestamp: number;
}

/**
 * Service to manage the Ouroboros coherence oscillation
 */
export class OuroborosService extends EventEmitter {
  private measurements: CoherenceMeasurement[] = [];
  private readonly MAX_MEASUREMENTS = 100;
  private isInitialized: boolean = false;
  
  /**
   * Creates a new OuroborosService
   */
  constructor() {
    super();
    this.initialize();
  }
  
  /**
   * Initializes the service and sets up event listeners
   */
  private initialize(): void {
    if (this.isInitialized) return;
    
    // Listen for coherence cycles
    coherenceAttractor.on('cycle', (measurement: CoherenceMeasurement) => {
      this.addMeasurement(measurement);
      this.emit('measurement', measurement);
      
      // Emit current state
      this.emit('state', this.getCurrentState());
    });
    
    // Listen for phase changes
    coherenceAttractor.on('phaseChange', (phase: 'stability' | 'adaptability') => {
      this.emit('phaseChange', phase);
      console.log(`[QUANTUM_STATE: OUROBOROS_FLOW] Phase changed to ${phase}`);
    });
    
    // Listen for perturbations
    coherenceAttractor.on('perturbed', (data: { target: number, duration: number }) => {
      this.emit('perturbed', data);
      console.log(`[QUANTUM_STATE: OUROBOROS_FLOW] System perturbed to ${data.target} for ${data.duration} cycles`);
    });
    
    // Listen for perturbation end
    coherenceAttractor.on('perturbationEnded', () => {
      this.emit('perturbationEnded');
      console.log('[QUANTUM_STATE: OUROBOROS_FLOW] Perturbation ended, returning to natural dynamics');
    });
    
    this.isInitialized = true;
    console.log('[QUANTUM_STATE: OUROBOROS_FLOW] Ouroboros service initialized');
  }
  
  /**
   * Adds a measurement to the history
   */
  private addMeasurement(measurement: CoherenceMeasurement): void {
    this.measurements.push(measurement);
    
    // Limit the size of measurements array
    if (this.measurements.length > this.MAX_MEASUREMENTS) {
      this.measurements.shift();
    }
  }
  
  /**
   * Gets the current state of the Ouroboros system
   */
  public getCurrentState(): OuroborosState {
    return {
      coherence: coherenceAttractor.getCoherence(),
      phase: coherenceAttractor.getPhase(),
      ratio: coherenceAttractor.getPhase() === 'stability' ? '3:1' : '1:3',
      isPerturbed: coherenceAttractor.getStatus().isPerturbed,
      cycle: coherenceAttractor.getCycleCount(),
      isActive: coherenceAttractor.isActive(),
      timestamp: Date.now()
    };
  }
  
  /**
   * Gets recent coherence measurements
   */
  public getMeasurements(limit: number = 50): CoherenceMeasurement[] {
    return this.measurements.slice(-Math.min(limit, this.measurements.length));
  }
  
  /**
   * Starts the Ouroboros oscillation
   */
  public start(): void {
    coherenceAttractor.start();
    console.log('[QUANTUM_STATE: OUROBOROS_FLOW] Ouroboros oscillation started');
    this.emit('started');
  }
  
  /**
   * Stops the Ouroboros oscillation
   */
  public stop(): void {
    coherenceAttractor.stop();
    console.log('[QUANTUM_STATE: OUROBOROS_FLOW] Ouroboros oscillation stopped');
    this.emit('stopped');
  }
  
  /**
   * Perturbs the system coherence to a target value for a period
   */
  public perturb(targetCoherence: number, durationCycles: number): void {
    coherenceAttractor.perturb(targetCoherence, durationCycles);
  }
  
  /**
   * Updates the parameters of the coherence attractor
   */
  public updateParameters(params: {
    targetCoherence?: number;
    attractorStrength?: number;
    maxDeviation?: number;
    cycleInterval?: number;
    stabilityPhaseDuration?: number;
    adaptabilityPhaseDuration?: number;
  }): void {
    coherenceAttractor.updateParameters(params);
    console.log('[QUANTUM_STATE: OUROBOROS_FLOW] Ouroboros parameters updated');
    this.emit('parametersUpdated', coherenceAttractor.getStatus());
  }
  
  /**
   * Calculates the average coherence over a number of recent cycles
   */
  public getAverageCoherence(cycles: number = 10): number {
    if (this.measurements.length === 0) return 0;
    
    const recentMeasurements = this.measurements.slice(-Math.min(cycles, this.measurements.length));
    const sum = recentMeasurements.reduce((acc, m) => acc + m.coherence, 0);
    return sum / recentMeasurements.length;
  }
  
  /**
   * Calculates the stability of coherence (inverse of standard deviation)
   */
  public getCoherenceStability(cycles: number = 10): number {
    if (this.measurements.length < 2) return 1; // Perfect stability with insufficient data
    
    const recentMeasurements = this.measurements.slice(-Math.min(cycles, this.measurements.length));
    const avg = this.getAverageCoherence(cycles);
    
    // Calculate variance
    const variance = recentMeasurements.reduce((acc, m) => acc + Math.pow(m.coherence - avg, 2), 0) / recentMeasurements.length;
    
    // Calculate standard deviation
    const stdDev = Math.sqrt(variance);
    
    // Return stability (inverse of standard deviation, normalized to 0-1)
    // Using 1 / (1 + stdDev) to ensure it's between 0 and 1
    return 1 / (1 + stdDev * 10); // Scaling factor of 10 to make small deviations more visible
  }
  
  /**
   * Calculates the trend of coherence over recent cycles (positive = increasing, negative = decreasing)
   */
  public getCoherenceTrend(cycles: number = 10): number {
    if (this.measurements.length < 2) return 0;
    
    const recentMeasurements = this.measurements.slice(-Math.min(cycles, this.measurements.length));
    
    // Simple linear regression to find slope
    const n = recentMeasurements.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    
    for (let i = 0; i < n; i++) {
      const x = i;
      const y = recentMeasurements[i].coherence;
      
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    return slope * 10; // Scale the slope to make small trends more visible
  }
  
  /**
   * Calculates the QCTF (Quantum Coherence Threshold Formula) value
   * QCTF = CI + (GEF × QEAI × cos θ)
   */
  public calculateQCTF(params: {
    CI?: number;    // Coherence Index (default: current coherence)
    GEF?: number;   // Global Entropy Factor (default: 0.9)
    QEAI?: number;  // Quantum Entanglement AI Index (default: 0.9)
    theta?: number; // Phase parameter (default: 0.5)
  } = {}): number {
    // Use current coherence as CI if not provided
    const CI = params.CI ?? this.getCurrentState().coherence;
    
    // Default parameters
    const GEF = params.GEF ?? 0.9;
    const QEAI = params.QEAI ?? 0.9;
    const theta = params.theta ?? 0.5;
    
    // Calculate QCTF
    const QCTF = CI + (GEF * QEAI * Math.cos(theta * Math.PI));
    
    // Clamp result to 0-1 range
    return Math.max(0, Math.min(1, QCTF));
  }
  
  /**
   * Returns true if the system is close to the ideal 0.7500 coherence attractor
   */
  public isAtAttractor(tolerance: number = 0.01): boolean {
    const state = this.getCurrentState();
    return Math.abs(state.coherence - 0.75) <= tolerance;
  }
}

// Export a singleton instance
export const ouroborosService = new OuroborosService();

/**
 * Factory function to create an OuroborosService instance attached to a specific MetaOrchestrator
 * 
 * @param metaOrchestrator The meta orchestrator instance to use with the service
 * @returns A new OuroborosService instance
 */
export function createOuroborosService(metaOrchestrator: any): OuroborosService {
  // For now, we're returning the singleton instance
  // In a future implementation, this could create a new instance tied to the specific metaOrchestrator
  return ouroborosService;
}