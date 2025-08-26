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
export declare const ToggleStateSchema: z.ZodObject<{
    active: z.ZodBoolean;
    value: z.ZodNumber;
    lastActivated: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sourceModule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    value: number;
    active: boolean;
    lastActivated?: string | null | undefined;
    sourceModule?: string | null | undefined;
}, {
    value: number;
    active: boolean;
    lastActivated?: string | null | undefined;
    sourceModule?: string | null | undefined;
}>;
export type ToggleState = z.infer<typeof ToggleStateSchema>;
/**
 * Toggles collection schema - holds all possible toggle states
 */
export declare const TogglesSchema: z.ZodObject<{
    stop: z.ZodObject<{
        active: z.ZodBoolean;
        value: z.ZodNumber;
        lastActivated: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sourceModule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    }, {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    }>;
    failsafe: z.ZodObject<{
        active: z.ZodBoolean;
        value: z.ZodNumber;
        lastActivated: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sourceModule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    }, {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    }>;
    reroute: z.ZodObject<{
        active: z.ZodBoolean;
        value: z.ZodNumber;
        lastActivated: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sourceModule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    }, {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    }>;
    wormhole: z.ZodObject<{
        active: z.ZodBoolean;
        value: z.ZodNumber;
        lastActivated: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sourceModule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    }, {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    stop: {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    };
    failsafe: {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    };
    reroute: {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    };
    wormhole: {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    };
}, {
    stop: {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    };
    failsafe: {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    };
    reroute: {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    };
    wormhole: {
        value: number;
        active: boolean;
        lastActivated?: string | null | undefined;
        sourceModule?: string | null | undefined;
    };
}>;
export type Toggles = z.infer<typeof TogglesSchema>;
/**
 * Enhanced scaling metrics schema - parameters for Dimension Scaling Factor calculation
 */
export declare const ScalingMetricsSchema: z.ZodObject<{
    parallelTasks: z.ZodDefault<z.ZodNumber>;
    modules: z.ZodDefault<z.ZodNumber>;
    depth: z.ZodDefault<z.ZodNumber>;
    latency: z.ZodDefault<z.ZodNumber>;
    errorRate: z.ZodDefault<z.ZodNumber>;
    hpcScaleFactor: z.ZodDefault<z.ZodNumber>;
    timelineBranches: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    latency: number;
    parallelTasks: number;
    modules: number;
    depth: number;
    errorRate: number;
    hpcScaleFactor: number;
    timelineBranches: number;
}, {
    latency?: number | undefined;
    parallelTasks?: number | undefined;
    modules?: number | undefined;
    depth?: number | undefined;
    errorRate?: number | undefined;
    hpcScaleFactor?: number | undefined;
    timelineBranches?: number | undefined;
}>;
export type ScalingMetrics = z.infer<typeof ScalingMetricsSchema>;
/**
 * Module coherence schema - coherence values for each Oroboro module
 */
export declare const ModuleCoherenceSchema: z.ZodObject<{
    oracle: z.ZodNumber;
    nova: z.ZodNumber;
    gnosis: z.ZodNumber;
    sanctum: z.ZodNumber;
    halo: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    oracle: number;
    nova: number;
    gnosis: number;
    sanctum: number;
    halo: number;
}, {
    oracle: number;
    nova: number;
    gnosis: number;
    sanctum: number;
    halo: number;
}>;
export type ModuleCoherence = z.infer<typeof ModuleCoherenceSchema>;
/**
 * Enhanced QCTF history entry schema - historical QCTF values with additional metrics
 */
export declare const QCTFHistoryEntrySchema: z.ZodObject<{
    timestamp: z.ZodString;
    qctf: z.ZodNumber;
    gef: z.ZodOptional<z.ZodNumber>;
    qeai: z.ZodOptional<z.ZodNumber>;
    ci: z.ZodOptional<z.ZodNumber>;
    rawQCTF: z.ZodOptional<z.ZodNumber>;
    smoothedQCTF: z.ZodOptional<z.ZodNumber>;
    dimensionFactor: z.ZodOptional<z.ZodNumber>;
    toggleFunction: z.ZodOptional<z.ZodNumber>;
    feedbackFunction: z.ZodOptional<z.ZodNumber>;
    entropy: z.ZodOptional<z.ZodNumber>;
    activeToggles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    qctf: number;
    gef?: number | undefined;
    qeai?: number | undefined;
    ci?: number | undefined;
    rawQCTF?: number | undefined;
    smoothedQCTF?: number | undefined;
    dimensionFactor?: number | undefined;
    toggleFunction?: number | undefined;
    feedbackFunction?: number | undefined;
    entropy?: number | undefined;
    activeToggles?: string[] | undefined;
}, {
    timestamp: string;
    qctf: number;
    gef?: number | undefined;
    qeai?: number | undefined;
    ci?: number | undefined;
    rawQCTF?: number | undefined;
    smoothedQCTF?: number | undefined;
    dimensionFactor?: number | undefined;
    toggleFunction?: number | undefined;
    feedbackFunction?: number | undefined;
    entropy?: number | undefined;
    activeToggles?: string[] | undefined;
}>;
export type QCTFHistoryEntry = z.infer<typeof QCTFHistoryEntrySchema>;
/**
 * Complete QCTF data schema v4.0 - all components needed for QCTF calculation
 */
export declare const QCTFDataSchema: z.ZodObject<{
    gef: z.ZodDefault<z.ZodNumber>;
    qeai: z.ZodDefault<z.ZodNumber>;
    ci: z.ZodDefault<z.ZodNumber>;
    entropyScale: z.ZodDefault<z.ZodNumber>;
    entropy: z.ZodDefault<z.ZodNumber>;
    oroboroConstant: z.ZodDefault<z.ZodNumber>;
    epsilon: z.ZodDefault<z.ZodNumber>;
    kappa: z.ZodDefault<z.ZodNumber>;
    epsilonD: z.ZodDefault<z.ZodNumber>;
    gamma: z.ZodDefault<z.ZodNumber>;
    lambda: z.ZodDefault<z.ZodNumber>;
    k: z.ZodDefault<z.ZodNumber>;
    mu: z.ZodDefault<z.ZodNumber>;
    alpha: z.ZodDefault<z.ZodNumber>;
    beta: z.ZodDefault<z.ZodNumber>;
    eta: z.ZodDefault<z.ZodNumber>;
    maxError: z.ZodDefault<z.ZodNumber>;
    toggleWeights: z.ZodObject<{
        stop: z.ZodDefault<z.ZodNumber>;
        failsafe: z.ZodDefault<z.ZodNumber>;
        reroute: z.ZodDefault<z.ZodNumber>;
        wormhole: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        stop: number;
        failsafe: number;
        reroute: number;
        wormhole: number;
    }, {
        stop?: number | undefined;
        failsafe?: number | undefined;
        reroute?: number | undefined;
        wormhole?: number | undefined;
    }>;
    dimensionScalingFactor: z.ZodDefault<z.ZodNumber>;
    feedbackFunction: z.ZodDefault<z.ZodNumber>;
    toggles: z.ZodDefault<z.ZodObject<{
        stop: z.ZodObject<{
            active: z.ZodBoolean;
            value: z.ZodNumber;
            lastActivated: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            sourceModule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        }, {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        }>;
        failsafe: z.ZodObject<{
            active: z.ZodBoolean;
            value: z.ZodNumber;
            lastActivated: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            sourceModule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        }, {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        }>;
        reroute: z.ZodObject<{
            active: z.ZodBoolean;
            value: z.ZodNumber;
            lastActivated: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            sourceModule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        }, {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        }>;
        wormhole: z.ZodObject<{
            active: z.ZodBoolean;
            value: z.ZodNumber;
            lastActivated: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            sourceModule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        }, {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        stop: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        failsafe: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        reroute: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        wormhole: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
    }, {
        stop: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        failsafe: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        reroute: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        wormhole: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
    }>>;
    scalingMetrics: z.ZodDefault<z.ZodObject<{
        parallelTasks: z.ZodDefault<z.ZodNumber>;
        modules: z.ZodDefault<z.ZodNumber>;
        depth: z.ZodDefault<z.ZodNumber>;
        latency: z.ZodDefault<z.ZodNumber>;
        errorRate: z.ZodDefault<z.ZodNumber>;
        hpcScaleFactor: z.ZodDefault<z.ZodNumber>;
        timelineBranches: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        latency: number;
        parallelTasks: number;
        modules: number;
        depth: number;
        errorRate: number;
        hpcScaleFactor: number;
        timelineBranches: number;
    }, {
        latency?: number | undefined;
        parallelTasks?: number | undefined;
        modules?: number | undefined;
        depth?: number | undefined;
        errorRate?: number | undefined;
        hpcScaleFactor?: number | undefined;
        timelineBranches?: number | undefined;
    }>>;
    moduleCoherence: z.ZodDefault<z.ZodObject<{
        oracle: z.ZodNumber;
        nova: z.ZodNumber;
        gnosis: z.ZodNumber;
        sanctum: z.ZodNumber;
        halo: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        oracle: number;
        nova: number;
        gnosis: number;
        sanctum: number;
        halo: number;
    }, {
        oracle: number;
        nova: number;
        gnosis: number;
        sanctum: number;
        halo: number;
    }>>;
    history: z.ZodDefault<z.ZodArray<z.ZodObject<{
        timestamp: z.ZodString;
        qctf: z.ZodNumber;
        gef: z.ZodOptional<z.ZodNumber>;
        qeai: z.ZodOptional<z.ZodNumber>;
        ci: z.ZodOptional<z.ZodNumber>;
        rawQCTF: z.ZodOptional<z.ZodNumber>;
        smoothedQCTF: z.ZodOptional<z.ZodNumber>;
        dimensionFactor: z.ZodOptional<z.ZodNumber>;
        toggleFunction: z.ZodOptional<z.ZodNumber>;
        feedbackFunction: z.ZodOptional<z.ZodNumber>;
        entropy: z.ZodOptional<z.ZodNumber>;
        activeToggles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        qctf: number;
        gef?: number | undefined;
        qeai?: number | undefined;
        ci?: number | undefined;
        rawQCTF?: number | undefined;
        smoothedQCTF?: number | undefined;
        dimensionFactor?: number | undefined;
        toggleFunction?: number | undefined;
        feedbackFunction?: number | undefined;
        entropy?: number | undefined;
        activeToggles?: string[] | undefined;
    }, {
        timestamp: string;
        qctf: number;
        gef?: number | undefined;
        qeai?: number | undefined;
        ci?: number | undefined;
        rawQCTF?: number | undefined;
        smoothedQCTF?: number | undefined;
        dimensionFactor?: number | undefined;
        toggleFunction?: number | undefined;
        feedbackFunction?: number | undefined;
        entropy?: number | undefined;
        activeToggles?: string[] | undefined;
    }>, "many">>;
    previousRawQCTF: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    previousDeltaQCTF: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    cycleDetection: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        period: z.ZodDefault<z.ZodNumber>;
        phase: z.ZodDefault<z.ZodNumber>;
        amplitude: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        period: number;
        phase: number;
        amplitude: number;
    }, {
        enabled?: boolean | undefined;
        period?: number | undefined;
        phase?: number | undefined;
        amplitude?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    alpha: number;
    beta: number;
    gef: number;
    qeai: number;
    ci: number;
    feedbackFunction: number;
    entropy: number;
    entropyScale: number;
    oroboroConstant: number;
    epsilon: number;
    kappa: number;
    epsilonD: number;
    gamma: number;
    lambda: number;
    k: number;
    mu: number;
    eta: number;
    maxError: number;
    toggleWeights: {
        stop: number;
        failsafe: number;
        reroute: number;
        wormhole: number;
    };
    dimensionScalingFactor: number;
    toggles: {
        stop: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        failsafe: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        reroute: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        wormhole: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
    };
    scalingMetrics: {
        latency: number;
        parallelTasks: number;
        modules: number;
        depth: number;
        errorRate: number;
        hpcScaleFactor: number;
        timelineBranches: number;
    };
    moduleCoherence: {
        oracle: number;
        nova: number;
        gnosis: number;
        sanctum: number;
        halo: number;
    };
    history: {
        timestamp: string;
        qctf: number;
        gef?: number | undefined;
        qeai?: number | undefined;
        ci?: number | undefined;
        rawQCTF?: number | undefined;
        smoothedQCTF?: number | undefined;
        dimensionFactor?: number | undefined;
        toggleFunction?: number | undefined;
        feedbackFunction?: number | undefined;
        entropy?: number | undefined;
        activeToggles?: string[] | undefined;
    }[];
    previousRawQCTF: number | null;
    previousDeltaQCTF: number | null;
    cycleDetection?: {
        enabled: boolean;
        period: number;
        phase: number;
        amplitude: number;
    } | undefined;
}, {
    toggleWeights: {
        stop?: number | undefined;
        failsafe?: number | undefined;
        reroute?: number | undefined;
        wormhole?: number | undefined;
    };
    alpha?: number | undefined;
    beta?: number | undefined;
    gef?: number | undefined;
    qeai?: number | undefined;
    ci?: number | undefined;
    feedbackFunction?: number | undefined;
    entropy?: number | undefined;
    entropyScale?: number | undefined;
    oroboroConstant?: number | undefined;
    epsilon?: number | undefined;
    kappa?: number | undefined;
    epsilonD?: number | undefined;
    gamma?: number | undefined;
    lambda?: number | undefined;
    k?: number | undefined;
    mu?: number | undefined;
    eta?: number | undefined;
    maxError?: number | undefined;
    dimensionScalingFactor?: number | undefined;
    toggles?: {
        stop: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        failsafe: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        reroute: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
        wormhole: {
            value: number;
            active: boolean;
            lastActivated?: string | null | undefined;
            sourceModule?: string | null | undefined;
        };
    } | undefined;
    scalingMetrics?: {
        latency?: number | undefined;
        parallelTasks?: number | undefined;
        modules?: number | undefined;
        depth?: number | undefined;
        errorRate?: number | undefined;
        hpcScaleFactor?: number | undefined;
        timelineBranches?: number | undefined;
    } | undefined;
    moduleCoherence?: {
        oracle: number;
        nova: number;
        gnosis: number;
        sanctum: number;
        halo: number;
    } | undefined;
    history?: {
        timestamp: string;
        qctf: number;
        gef?: number | undefined;
        qeai?: number | undefined;
        ci?: number | undefined;
        rawQCTF?: number | undefined;
        smoothedQCTF?: number | undefined;
        dimensionFactor?: number | undefined;
        toggleFunction?: number | undefined;
        feedbackFunction?: number | undefined;
        entropy?: number | undefined;
        activeToggles?: string[] | undefined;
    }[] | undefined;
    previousRawQCTF?: number | null | undefined;
    previousDeltaQCTF?: number | null | undefined;
    cycleDetection?: {
        enabled?: boolean | undefined;
        period?: number | undefined;
        phase?: number | undefined;
        amplitude?: number | undefined;
    } | undefined;
}>;
export type QCTFData = z.infer<typeof QCTFDataSchema>;
/**
 * Toggle event schema - represents a toggle activation/deactivation event
 */
export declare const ToggleEventSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    toggleType: z.ZodEnum<["stop", "failsafe", "reroute", "wormhole"]>;
    action: z.ZodEnum<["activate", "deactivate"]>;
    sourceModule: z.ZodString;
    targetModule: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reason: z.ZodString;
    timestamp: z.ZodString;
    impact: z.ZodOptional<z.ZodEnum<["HIGH", "MEDIUM", "LOW"]>>;
    value: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    action: "activate" | "deactivate";
    timestamp: string;
    id: string | number;
    sourceModule: string;
    toggleType: "stop" | "failsafe" | "reroute" | "wormhole";
    value?: number | undefined;
    impact?: "HIGH" | "MEDIUM" | "LOW" | undefined;
    targetModule?: string | null | undefined;
}, {
    reason: string;
    action: "activate" | "deactivate";
    timestamp: string;
    id: string | number;
    sourceModule: string;
    toggleType: "stop" | "failsafe" | "reroute" | "wormhole";
    value?: number | undefined;
    impact?: "HIGH" | "MEDIUM" | "LOW" | undefined;
    targetModule?: string | null | undefined;
}>;
export type ToggleEvent = z.infer<typeof ToggleEventSchema>;
/**
 * Authorization matrix for toggle actions by module
 */
export declare const TOGGLE_AUTH_MATRIX: {
    stop: string[];
    failsafe: string[];
    reroute: string[];
    wormhole: string[];
};
//# sourceMappingURL=qctf.d.ts.map