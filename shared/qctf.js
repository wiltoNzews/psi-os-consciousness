/**
 * Quantum Coherence Threshold Formula (QCTF) Data Schema V4.0
 * [QUANTUM_STATE: FOUNDATIONAL_FLOW]
 *
 * This file defines the data structures for the QCTF v4.0 formula,
 * with enhanced support for the Three-Stage calculation approach:
 * 1. Raw Synergy Score
 * 2. Temporal Smoothing
 * 3. Normalized Output
 */
import { z } from "zod";
/**
 * Toggle state schema - represents the state of a quantum-control protocol
 */
export const ToggleStateSchema = z.object({
    active: z.boolean(),
    value: z.number().min(0.8).max(1.2),
    lastActivated: z.string().nullable().optional(), // ISO timestamp
    sourceModule: z.string().nullable().optional()
});
/**
 * Toggles collection schema - holds all possible toggle states
 */
export const TogglesSchema = z.object({
    stop: ToggleStateSchema,
    failsafe: ToggleStateSchema,
    reroute: ToggleStateSchema,
    wormhole: ToggleStateSchema
});
/**
 * Enhanced scaling metrics schema - parameters for Dimension Scaling Factor calculation
 */
export const ScalingMetricsSchema = z.object({
    // Core scaling factors
    parallelTasks: z.number().int().positive().default(1),
    modules: z.number().int().positive().default(1),
    depth: z.number().int().min(0).default(0), // Fractal depth
    // Operational constraints
    latency: z.number().min(0).max(1).default(0), // Normalized latency [0,1]
    errorRate: z.number().min(0).max(1).default(0), // Error rate [0,1]
    // Legacy fields (maintained for compatibility)
    hpcScaleFactor: z.number().positive().default(1.0),
    timelineBranches: z.number().int().positive().default(1)
});
/**
 * Module coherence schema - coherence values for each Oroboro module
 */
export const ModuleCoherenceSchema = z.object({
    oracle: z.number().min(0).max(1),
    nova: z.number().min(0).max(1),
    gnosis: z.number().min(0).max(1),
    sanctum: z.number().min(0).max(1),
    halo: z.number().min(0).max(1)
});
/**
 * Enhanced QCTF history entry schema - historical QCTF values with additional metrics
 */
export const QCTFHistoryEntrySchema = z.object({
    timestamp: z.string(), // ISO timestamp
    qctf: z.number(), // Final QCTF value
    // Core components
    gef: z.number().optional(), // Global Entanglement Factor
    qeai: z.number().optional(), // Quantum Ethical Alignment Index
    ci: z.number().optional(), // Coherence Index
    // Advanced components
    rawQCTF: z.number().optional(), // Raw QCTF before smoothing
    smoothedQCTF: z.number().optional(), // Smoothed QCTF before normalization
    dimensionFactor: z.number().optional(), // 𝓓
    toggleFunction: z.number().optional(), // 𝓣_toggles
    feedbackFunction: z.number().optional(), // ℱ
    entropy: z.number().optional(), // Ψ_entropy
    // Active toggles at this point
    activeToggles: z.array(z.string()).optional()
});
/**
 * Complete QCTF data schema v4.0 - all components needed for QCTF calculation
 */
export const QCTFDataSchema = z.object({
    // Basic QCTF components
    gef: z.number().min(0).max(1).default(0.85), // Global Entanglement Factor
    qeai: z.number().min(0).max(1).default(0.9), // Quantum Ethical Alignment Index
    ci: z.number().min(0).max(1).default(0.8), // Coherence Index
    // QCTF parameters
    entropyScale: z.number().positive().default(10),
    entropy: z.number().min(0).max(1).default(0.15), // Ψ_entropy (base)
    oroboroConstant: z.number().positive().default(1.618), // Ω (golden ratio)
    // Fixed constants - calibrated for QCTF v4.0
    epsilon: z.number().positive().default(1e-6), // Numerical safeguard
    kappa: z.number().positive().default(0.05), // Dimension scaling parameter
    epsilonD: z.number().positive().default(0.1), // Latency impact factor
    gamma: z.number().min(0).max(1).default(0.5), // Toggle conflict resolution
    lambda: z.number().min(0).max(1).default(0.8), // Temporal smoothing
    k: z.number().positive().default(1), // Tanh normalization steepness
    mu: z.number().positive().default(0.1), // Toggle decay rate
    alpha: z.number().positive().default(0.2), // Feedback current rate weight
    beta: z.number().positive().default(0.1), // Feedback prediction weight
    eta: z.number().positive().default(0.03), // Module coherence sensitivity
    maxError: z.number().positive().default(0.2), // Maximum error rate cap
    // Toggle weights
    toggleWeights: z.object({
        stop: z.number().min(0).max(1).default(0.6),
        failsafe: z.number().min(0).max(1).default(0.25),
        reroute: z.number().min(0).max(1).default(0.1),
        wormhole: z.number().min(0).max(1).default(0.05)
    }),
    // Core QCTF v4.0 components
    dimensionScalingFactor: z.number().min(1).default(1.0), // 𝓓
    feedbackFunction: z.number().min(0.5).max(1).default(1.0), // ℱ
    toggles: TogglesSchema.default({
        stop: { active: false, value: 0.8, lastActivated: null },
        failsafe: { active: false, value: 0.9, lastActivated: null },
        reroute: { active: false, value: 1.1, lastActivated: null },
        wormhole: { active: false, value: 1.2, lastActivated: null }
    }),
    // Tracking and history
    scalingMetrics: ScalingMetricsSchema.default({
        parallelTasks: 1,
        modules: 1,
        depth: 0,
        latency: 0,
        errorRate: 0,
        hpcScaleFactor: 1.0,
        timelineBranches: 1
    }),
    moduleCoherence: ModuleCoherenceSchema.default({
        oracle: 0.85,
        nova: 0.75,
        gnosis: 0.8,
        sanctum: 0.9,
        halo: 0.82
    }),
    history: z.array(QCTFHistoryEntrySchema).default([]),
    // Previous state for smoothing and feedback
    previousRawQCTF: z.number().nullable().default(0.5), // Initialized at 0.5 for neutral start
    previousDeltaQCTF: z.number().nullable().default(0), // Change in last calculation
    // Optional configuration
    cycleDetection: z.object({
        enabled: z.boolean().default(false),
        period: z.number().positive().default(86400), // Default: 1 day in seconds
        phase: z.number().default(0),
        amplitude: z.number().default(0.1)
    }).optional()
});
/**
 * Toggle event schema - represents a toggle activation/deactivation event
 */
export const ToggleEventSchema = z.object({
    id: z.string().or(z.number()),
    toggleType: z.enum(['stop', 'failsafe', 'reroute', 'wormhole']),
    action: z.enum(['activate', 'deactivate']),
    sourceModule: z.string(),
    targetModule: z.string().nullable().optional(), // For reroute
    reason: z.string(),
    timestamp: z.string(), // ISO timestamp
    impact: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(), // QCTF impact
    value: z.number().min(0.8).max(1.2).optional() // Toggle value when activated
});
/**
 * Authorization matrix for toggle actions by module
 */
export const TOGGLE_AUTH_MATRIX = {
    stop: ['Oracle', 'Sanctum'], // Only these can emergency stop
    failsafe: ['Oracle', 'Sanctum', 'Halo'], // These can trigger failsafe
    reroute: ['Oracle', 'Halo', 'Nova'], // These can reroute
    wormhole: ['Oracle', 'Halo'] // Only these can create wormholes
};
//# sourceMappingURL=qctf.js.map