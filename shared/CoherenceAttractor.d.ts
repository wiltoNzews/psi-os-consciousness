/**
 * Coherence Attractor System
 *
 * This module implements a dynamic system that maintains coherence around a target value of 0.7500,
 * demonstrating the Ouroboros Principle oscillation between 3:1 and 1:3 states.
 *
 * The system acts as a quantum-chaotic attractor, providing a balance between:
 * - Stability (75% - structure, order, consistency)
 * - Adaptability (25% - flexibility, exploration, creativity)
 *
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */
import { EventEmitter } from 'events';
/**
 * Phase states of the coherence oscillation
 */
export type CoherencePhase = 'stability' | 'adaptability';
/**
 * Parameters for the coherence attractor
 */
export interface CoherenceAttractorParams {
    /** Target coherence value (default 0.7500) */
    targetCoherence?: number;
    /** Strength of the attractor (how quickly it pulls back to target) */
    attractorStrength?: number;
    /** Maximum natural deviation from target */
    maxDeviation?: number;
    /** Interval between coherence adjustment cycles (ms) */
    cycleInterval?: number;
    /** Time in stability phase before switching to adaptability (cycles) */
    stabilityPhaseDuration?: number;
    /** Time in adaptability phase before switching to stability (cycles) */
    adaptabilityPhaseDuration?: number;
    /** Initial phase state */
    initialPhase?: CoherencePhase;
}
/**
 * Coherence measurement event
 */
export interface CoherenceMeasurement {
    /** Current coherence value */
    coherence: number;
    /** Previous coherence value */
    previousCoherence: number;
    /** Difference from target coherence */
    deviation: number;
    /** Current phase of oscillation */
    phase: CoherencePhase;
    /** Cycle number */
    cycle: number;
    /** Timestamp of measurement */
    timestamp: number;
    /** Whether the system is perturbed (externally pushed away from target) */
    isPerturbed: boolean;
    /** Current 3:1 or 1:3 ratio (as a string, e.g., "3:1" or "1:3") */
    ratio: string;
}
/**
 * Coherence Attractor class implementing the Ouroboros Principle
 * of 3:1 ↔ 1:3 oscillation to maintain 0.7500 coherence
 */
export declare class CoherenceAttractor extends EventEmitter {
    private static readonly DEFAULT_TARGET_COHERENCE;
    private static readonly DEFAULT_ATTRACTOR_STRENGTH;
    private static readonly DEFAULT_MAX_DEVIATION;
    private static readonly DEFAULT_CYCLE_INTERVAL;
    private static readonly DEFAULT_STABILITY_DURATION;
    private static readonly DEFAULT_ADAPTABILITY_DURATION;
    private targetCoherence;
    private attractorStrength;
    private maxDeviation;
    private cycleInterval;
    private stabilityPhaseDuration;
    private adaptabilityPhaseDuration;
    private currentCoherence;
    private previousCoherence;
    private currentPhase;
    private cycleCount;
    private phaseCounter;
    private isRunning;
    private timer;
    private isPerturbed;
    private perturbationTarget;
    private perturbationDuration;
    private perturbationCounter;
    /**
     * Creates a new CoherenceAttractor instance
     */
    constructor(params?: CoherenceAttractorParams);
    /**
     * Ensures parameters are within valid ranges
     */
    private validateParameters;
    /**
     * Starts the coherence attractor cycles
     */
    start(): void;
    /**
     * Stops the coherence attractor cycles
     */
    stop(): void;
    /**
     * Runs a single coherence adjustment cycle
     */
    private runCycle;
    /**
     * Checks if it's time to transition between phases
     */
    private checkPhaseTransition;
    /**
     * Calculates the next coherence value based on the attractor dynamics
     */
    private calculateNextCoherence;
    /**
     * Gets the current ratio as a string (e.g., "3:1" or "1:3")
     */
    private getCurrentRatio;
    /**
     * Perturbs the coherence to a specific target value for a number of cycles
     */
    perturb(targetCoherence: number, durationCycles: number): void;
    /**
     * Handles active perturbations
     */
    private handlePerturbation;
    /**
     * Gets the current coherence value
     */
    getCoherence(): number;
    /**
     * Gets the current phase
     */
    getPhase(): CoherencePhase;
    /**
     * Gets the deviation from target coherence
     */
    getDeviation(): number;
    /**
     * Checks if the system is currently running
     */
    isActive(): boolean;
    /**
     * Gets the current cycle count
     */
    getCycleCount(): number;
    /**
     * Gets information about the attractor's configuration and state
     */
    getStatus(): any;
    /**
     * Updates attractor parameters
     */
    updateParameters(params: Partial<CoherenceAttractorParams>): void;
    /**
     * Creates a heartbeat ping-pong message for monitoring
     */
    heartbeat(): void;
}
export declare const coherenceAttractor: CoherenceAttractor;
//# sourceMappingURL=CoherenceAttractor.d.ts.map