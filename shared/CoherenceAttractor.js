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
 * Coherence Attractor class implementing the Ouroboros Principle
 * of 3:1 ↔ 1:3 oscillation to maintain 0.7500 coherence
 */
export class CoherenceAttractor extends EventEmitter {
    static DEFAULT_TARGET_COHERENCE = 0.7500;
    static DEFAULT_ATTRACTOR_STRENGTH = 0.9;
    static DEFAULT_MAX_DEVIATION = 0.15;
    static DEFAULT_CYCLE_INTERVAL = 15000; // 15 seconds
    static DEFAULT_STABILITY_DURATION = 12; // cycles
    static DEFAULT_ADAPTABILITY_DURATION = 4; // cycles
    targetCoherence;
    attractorStrength;
    maxDeviation;
    cycleInterval;
    stabilityPhaseDuration;
    adaptabilityPhaseDuration;
    currentCoherence;
    previousCoherence;
    currentPhase;
    cycleCount = 0;
    phaseCounter = 0;
    isRunning = false;
    timer = null;
    isPerturbed = false;
    perturbationTarget = null;
    perturbationDuration = 0;
    perturbationCounter = 0;
    /**
     * Creates a new CoherenceAttractor instance
     */
    constructor(params = {}) {
        super();
        this.targetCoherence = params.targetCoherence ?? CoherenceAttractor.DEFAULT_TARGET_COHERENCE;
        this.attractorStrength = params.attractorStrength ?? CoherenceAttractor.DEFAULT_ATTRACTOR_STRENGTH;
        this.maxDeviation = params.maxDeviation ?? CoherenceAttractor.DEFAULT_MAX_DEVIATION;
        this.cycleInterval = params.cycleInterval ?? CoherenceAttractor.DEFAULT_CYCLE_INTERVAL;
        this.stabilityPhaseDuration = params.stabilityPhaseDuration ?? CoherenceAttractor.DEFAULT_STABILITY_DURATION;
        this.adaptabilityPhaseDuration = params.adaptabilityPhaseDuration ?? CoherenceAttractor.DEFAULT_ADAPTABILITY_DURATION;
        this.currentPhase = params.initialPhase ?? 'stability';
        // Initialize coherence at target
        this.currentCoherence = this.targetCoherence;
        this.previousCoherence = this.currentCoherence;
        this.validateParameters();
        console.log(`[QUANTUM_STATE: ATTRACTOR_FLOW] Coherence Attractor created with target ${this.targetCoherence}`);
    }
    /**
     * Ensures parameters are within valid ranges
     */
    validateParameters() {
        if (this.targetCoherence < 0 || this.targetCoherence > 1) {
            throw new Error('Target coherence must be between 0 and 1');
        }
        if (this.attractorStrength <= 0 || this.attractorStrength > 1) {
            throw new Error('Attractor strength must be greater than 0 and at most 1');
        }
        if (this.maxDeviation < 0 || this.maxDeviation > 0.5) {
            throw new Error('Maximum deviation must be between 0 and 0.5');
        }
        if (this.cycleInterval < 1000) {
            throw new Error('Cycle interval must be at least 1000ms (1 second)');
        }
        if (this.stabilityPhaseDuration < 1) {
            throw new Error('Stability phase duration must be at least 1 cycle');
        }
        if (this.adaptabilityPhaseDuration < 1) {
            throw new Error('Adaptability phase duration must be at least 1 cycle');
        }
    }
    /**
     * Starts the coherence attractor cycles
     */
    start() {
        if (this.isRunning) {
            this.stop();
        }
        this.isRunning = true;
        console.log(`[QUANTUM_STATE: ATTRACTOR_FLOW] Coherence Attractor started with interval: ${this.cycleInterval}ms`);
        // Run first cycle immediately
        this.runCycle();
        // Schedule subsequent cycles
        this.timer = setInterval(() => this.runCycle(), this.cycleInterval);
    }
    /**
     * Stops the coherence attractor cycles
     */
    stop() {
        if (!this.isRunning)
            return;
        this.isRunning = false;
        console.log('[QUANTUM_STATE: ATTRACTOR_FLOW] Coherence Attractor stopped');
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    /**
     * Runs a single coherence adjustment cycle
     */
    runCycle() {
        // Increment cycle count
        this.cycleCount++;
        this.phaseCounter++;
        // Store previous value
        this.previousCoherence = this.currentCoherence;
        // Check if we need to transition between phases
        this.checkPhaseTransition();
        // Calculate next coherence value
        this.currentCoherence = this.calculateNextCoherence();
        // Log the cycle
        console.log(`[QUANTUM_STATE: ATTRACTOR_FLOW] Cycle ${this.cycleCount}: Phase=${this.currentPhase}, Coherence=${this.previousCoherence.toFixed(4)} → ${this.currentCoherence.toFixed(4)}`);
        // Create measurement event
        const measurement = {
            coherence: this.currentCoherence,
            previousCoherence: this.previousCoherence,
            deviation: this.currentCoherence - this.targetCoherence,
            phase: this.currentPhase,
            cycle: this.cycleCount,
            timestamp: Date.now(),
            isPerturbed: this.isPerturbed,
            ratio: this.getCurrentRatio()
        };
        // Emit cycle event
        this.emit('cycle', measurement);
        // Handle perturbation if active
        this.handlePerturbation();
    }
    /**
     * Checks if it's time to transition between phases
     */
    checkPhaseTransition() {
        const phaseDuration = this.currentPhase === 'stability'
            ? this.stabilityPhaseDuration
            : this.adaptabilityPhaseDuration;
        if (this.phaseCounter >= phaseDuration) {
            // Switch phases
            this.currentPhase = this.currentPhase === 'stability' ? 'adaptability' : 'stability';
            this.phaseCounter = 0;
            // Emit phase change event
            this.emit('phaseChange', this.currentPhase);
            console.log(`[QUANTUM_STATE: ATTRACTOR_FLOW] Phase changed to ${this.currentPhase}`);
        }
    }
    /**
     * Calculates the next coherence value based on the attractor dynamics
     */
    calculateNextCoherence() {
        if (this.isPerturbed && this.perturbationTarget !== null) {
            // When perturbed, move toward the perturbation target
            return this.perturbationTarget;
        }
        // Base calculation starts from the target coherence
        let nextCoherence = this.targetCoherence;
        // Add random deviation - stronger in adaptability phase, weaker in stability phase
        const deviationFactor = this.currentPhase === 'stability' ? 0.4 : 1.0;
        const randomDeviation = (Math.random() * 2 - 1) * this.maxDeviation * deviationFactor;
        nextCoherence += randomDeviation;
        // Apply attractor force pulling back toward target (stronger in stability phase)
        const attractorFactor = this.currentPhase === 'stability' ? 1.0 : 0.6;
        const deviation = this.currentCoherence - this.targetCoherence;
        const pullback = -deviation * this.attractorStrength * attractorFactor;
        nextCoherence = this.currentCoherence + pullback;
        // Ensure coherence stays within bounds
        return Math.max(0, Math.min(1, nextCoherence));
    }
    /**
     * Gets the current ratio as a string (e.g., "3:1" or "1:3")
     */
    getCurrentRatio() {
        return this.currentPhase === 'stability' ? '3:1' : '1:3';
    }
    /**
     * Perturbs the coherence to a specific target value for a number of cycles
     */
    perturb(targetCoherence, durationCycles) {
        if (targetCoherence < 0 || targetCoherence > 1) {
            throw new Error('Perturbation target must be between 0 and 1');
        }
        if (durationCycles <= 0) {
            throw new Error('Perturbation duration must be positive');
        }
        this.isPerturbed = true;
        this.perturbationTarget = targetCoherence;
        this.perturbationDuration = durationCycles;
        this.perturbationCounter = 0;
        console.log(`[QUANTUM_STATE: ATTRACTOR_FLOW] System perturbed to ${targetCoherence} for ${durationCycles} cycles`);
        // Emit perturbation event
        this.emit('perturbed', { target: targetCoherence, duration: durationCycles });
    }
    /**
     * Handles active perturbations
     */
    handlePerturbation() {
        if (!this.isPerturbed || this.perturbationTarget === null) {
            return;
        }
        this.perturbationCounter++;
        // Check if perturbation is complete
        if (this.perturbationCounter >= this.perturbationDuration) {
            this.isPerturbed = false;
            this.perturbationTarget = null;
            this.perturbationDuration = 0;
            this.perturbationCounter = 0;
            console.log('[QUANTUM_STATE: ATTRACTOR_FLOW] Perturbation ended, returning to natural dynamics');
            // Emit perturbation ended event
            this.emit('perturbationEnded');
        }
    }
    /**
     * Gets the current coherence value
     */
    getCoherence() {
        return this.currentCoherence;
    }
    /**
     * Gets the current phase
     */
    getPhase() {
        return this.currentPhase;
    }
    /**
     * Gets the deviation from target coherence
     */
    getDeviation() {
        return this.currentCoherence - this.targetCoherence;
    }
    /**
     * Checks if the system is currently running
     */
    isActive() {
        return this.isRunning;
    }
    /**
     * Gets the current cycle count
     */
    getCycleCount() {
        return this.cycleCount;
    }
    /**
     * Gets information about the attractor's configuration and state
     */
    getStatus() {
        return {
            targetCoherence: this.targetCoherence,
            currentCoherence: this.currentCoherence,
            phase: this.currentPhase,
            phaseCounter: this.phaseCounter,
            cycleCount: this.cycleCount,
            isRunning: this.isRunning,
            isPerturbed: this.isPerturbed,
            perturbationTarget: this.perturbationTarget,
            perturbationDuration: this.perturbationDuration,
            perturbationCounter: this.perturbationCounter,
            attractorStrength: this.attractorStrength,
            maxDeviation: this.maxDeviation,
            cycleInterval: this.cycleInterval,
            stabilityPhaseDuration: this.stabilityPhaseDuration,
            adaptabilityPhaseDuration: this.adaptabilityPhaseDuration,
            currentRatio: this.getCurrentRatio()
        };
    }
    /**
     * Updates attractor parameters
     */
    updateParameters(params) {
        const needsRestart = this.isRunning && 'cycleInterval' in params;
        if (needsRestart) {
            this.stop();
        }
        if (params.targetCoherence !== undefined) {
            this.targetCoherence = params.targetCoherence;
        }
        if (params.attractorStrength !== undefined) {
            this.attractorStrength = params.attractorStrength;
        }
        if (params.maxDeviation !== undefined) {
            this.maxDeviation = params.maxDeviation;
        }
        if (params.cycleInterval !== undefined) {
            this.cycleInterval = params.cycleInterval;
        }
        if (params.stabilityPhaseDuration !== undefined) {
            this.stabilityPhaseDuration = params.stabilityPhaseDuration;
        }
        if (params.adaptabilityPhaseDuration !== undefined) {
            this.adaptabilityPhaseDuration = params.adaptabilityPhaseDuration;
        }
        this.validateParameters();
        console.log('[QUANTUM_STATE: ATTRACTOR_FLOW] Coherence Attractor parameters updated');
        if (needsRestart) {
            this.start();
        }
    }
    /**
     * Creates a heartbeat ping-pong message for monitoring
     */
    heartbeat() {
        const timestamp = new Date().toISOString();
        // Emit ping event
        console.log(`[QUANTUM_STATE: ATTRACTOR_FLOW] Heartbeat: ping at ${timestamp}`);
        this.emit('ping', { timestamp });
        // Simulate a response delay
        setTimeout(() => {
            const responseTimestamp = new Date().toISOString();
            console.log(`[QUANTUM_STATE: ATTRACTOR_FLOW] Heartbeat: pong at ${responseTimestamp}`);
            this.emit('pong', {
                pingTimestamp: timestamp,
                pongTimestamp: responseTimestamp
            });
        }, 50);
    }
}
// Export a singleton instance for the application to use
export const coherenceAttractor = new CoherenceAttractor();
//# sourceMappingURL=CoherenceAttractor.js.map