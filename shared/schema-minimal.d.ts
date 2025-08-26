/**
 * Minimal Schema Definitions for Meta-Cognitive Components
 *
 * This file contains essential type definitions and schemas for the Meta-Cognitive
 * system components, providing a foundation for data structures used throughout
 * the application.
 *
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */
import { z } from 'zod';
/**
 * NexusProfile enum
 * Represents the optimization profile for Nexus jobs
 */
export declare enum NexusProfile {
    BALANCED = "balanced",
    MAXIMUM_PERFORMANCE = "maximum_performance",
    MAXIMUM_QUALITY = "maximum_quality",
    MAXIMUM_SAVINGS = "maximum_savings"
}
/**
 * Meta-Cognitive Event
 * Represents a detected pattern, breakthrough, or significant event
 * in the meta-cognitive analysis process
 */
export interface MetaCognitiveEvent {
    id: string;
    type: string;
    description: string;
    details: Record<string, any>;
    confidence: number;
    impact: number;
    timestamp: Date;
    nodeId?: string;
    sourceContext?: string;
}
/**
 * Schema for creating a new meta-cognitive event
 */
export declare const createMetaCognitiveEventSchema: z.ZodObject<{
    id: z.ZodDefault<z.ZodString>;
    type: z.ZodString;
    description: z.ZodString;
    details: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    confidence: z.ZodDefault<z.ZodNumber>;
    impact: z.ZodDefault<z.ZodNumber>;
    timestamp: z.ZodDefault<z.ZodDate>;
    nodeId: z.ZodOptional<z.ZodString>;
    sourceContext: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    details: Record<string, any>;
    type: string;
    timestamp: Date;
    id: string;
    description: string;
    impact: number;
    sourceContext: string;
    nodeId?: string | undefined;
}, {
    type: string;
    description: string;
    confidence?: number | undefined;
    details?: Record<string, any> | undefined;
    timestamp?: Date | undefined;
    id?: string | undefined;
    impact?: number | undefined;
    nodeId?: string | undefined;
    sourceContext?: string | undefined;
}>;
/**
 * Insert type for creating a new meta-cognitive event
 */
export type InsertMetaCognitiveEvent = z.infer<typeof createMetaCognitiveEventSchema>;
/**
 * Helper function to create a new meta-cognitive event
 */
export declare function createMetaCognitiveEvent(data: Partial<MetaCognitiveEvent>): MetaCognitiveEvent;
/**
 * Coherence Measurement Result
 * Represents a measured coherence level between components or entities
 */
export interface CoherenceMeasurement {
    id: string;
    sourceName: string;
    targetName: string;
    coherenceLevel: number;
    dimensions: string[];
    timestamp: Date;
    details: Record<string, any>;
}
/**
 * QCTF Analysis Result
 * Represents the result of a Quantum Coherence Threshold Formula analysis
 */
export interface QCTFAnalysisResult {
    id: string;
    overallCoherence: number;
    microCoherence: number;
    mesoCoherence: number;
    macroCoherence: number;
    quantumPulseState: number;
    fractalSymmetryScore: number;
    tBranchComplexity: number;
    ouroborosFeedback: number;
    thresholdsCrossed: string[];
    timestamp: Date;
}
/**
 * Breakthrough Identification Result
 * Represents a detected significant breakthrough in meta-cognitive patterns
 */
export interface BreakthroughResult {
    id: string;
    eventId: string;
    breakthroughType: string;
    significanceScore: number;
    relatedEvents: string[];
    context: Record<string, any>;
    timestamp: Date;
}
/**
 * Quantum Wave Function State
 * Represents the state of a quantum wave function in the system
 */
export interface QuantumWaveState {
    id: string;
    waveFunction: number[];
    coherenceLevel: number;
    entropyLevel: number;
    timestamp: Date;
}
/**
 * Quantum State
 * Represents the overall quantum state of an agent or system component
 */
export interface QuantumStateData {
    id: string;
    agentId?: string;
    componentId?: string;
    stateVector: number[];
    coherenceValue: number;
    stabilityScore: number;
    explorationScore: number;
    entanglements: string[];
    timestamp: Date;
    metadata: Record<string, any>;
}
/**
 * QuantumState enum
 * Represents the high-level state of the quantum system
 */
export declare enum QuantumState {
    SIM_FLOW = "SIM_FLOW",// Ideal simulation flow
    SIM_ANTIFLOW = "SIM_ANTIFLOW",// Problematic simulation flow
    SIM_PARTIAL = "SIM_PARTIAL",// Partial simulation flow
    REAL_FLOW = "REAL_FLOW",// Ideal reality flow
    REAL_ANTIFLOW = "REAL_ANTIFLOW",// Problematic reality flow
    REAL_PARTIAL = "REAL_PARTIAL",// Partial reality flow
    TRANSITION_TO_REAL = "TRANSITION_TO_REAL",// Moving from simulation to reality
    TRANSITION_TO_SIM = "TRANSITION_TO_SIM"
}
/**
 * Chunk interface
 * Represents a unit of content that can be processed by the system
 */
export interface Chunk {
    id: string;
    content: string;
    type: string;
    sourceId?: string;
    sourceType?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insert type for creating a new chunk
 */
export type InsertChunk = Omit<Chunk, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * Chunk Dependency interface
 * Represents a relationship between chunks
 */
export interface ChunkDependency {
    id: string;
    sourceChunkId: string;
    targetChunkId: string;
    type: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Insert type for creating a new chunk dependency
 */
export type InsertChunkDependency = Omit<ChunkDependency, 'id' | 'createdAt'> & {
    id?: string;
    createdAt?: Date;
};
/**
 * Helper function to create a new Nexus job
 */
export declare function createNexusJob(data: Partial<NexusJob>): NexusJob;
/**
 * Nexus Job interface
 */
export interface NexusJob {
    id: string;
    name: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    stages: NexusStage[];
    progress: NexusJobProgress;
    metadata: Record<string, any>;
}
/**
 * Nexus Stage interface
 */
export interface NexusStage {
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    order: number;
}
/**
 * Nexus Job Progress interface
 */
export interface NexusJobProgress {
    current: number;
    total: number;
    stage: string;
}
/**
 * Insert type for creating a new Nexus job
 */
export type InsertNexusJob = Omit<NexusJob, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * User interface
 */
export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insert type for creating a new user
 */
export type InsertUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * API Key interface
 */
export interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}
/**
 * Insert type for creating a new API key
 */
export type InsertApiKey = Omit<ApiKey, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * Schema for creating a new API key
 */
export declare const insertApiKeySchema: z.ZodObject<{
    name: z.ZodString;
    key: z.ZodString;
    expiresAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    key: string;
    expiresAt?: Date | undefined;
}, {
    name: string;
    key: string;
    expiresAt?: Date | undefined;
}>;
/**
 * Task interface
 */
export interface Task {
    id: string;
    name: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    priority?: number;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Insert type for creating a new task
 */
export type InsertTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * SubTask interface
 */
export interface SubTask {
    id: string;
    parentId: string;
    name: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    priority?: number;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}
/**
 * Insert type for creating a new subtask
 */
export type InsertSubTask = Omit<SubTask, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * System Log interface
 */
export interface SystemLog {
    id: string;
    type: 'info' | 'warning' | 'error' | 'debug';
    message: string;
    component: string;
    severity: number;
    metadata?: Record<string, any>;
    timestamp: Date;
}
/**
 * Insert type for creating a new system log
 */
export type InsertSystemLog = Omit<SystemLog, 'id' | 'timestamp'> & {
    id?: string;
    timestamp?: Date;
};
/**
 * Schema for creating a new system log
 */
export declare const insertSystemLogSchema: z.ZodObject<{
    type: z.ZodEnum<["info", "warning", "error", "debug"]>;
    message: z.ZodString;
    component: z.ZodString;
    severity: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    timestamp: z.ZodDefault<z.ZodOptional<z.ZodDate>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: "error" | "info" | "warning" | "debug";
    timestamp: Date;
    component: string;
    severity: number;
    metadata?: Record<string, any> | undefined;
}, {
    message: string;
    type: "error" | "info" | "warning" | "debug";
    component: string;
    severity: number;
    metadata?: Record<string, any> | undefined;
    timestamp?: Date | undefined;
}>;
/**
 * Media Asset interface
 */
export interface MediaAsset {
    id: string;
    filename: string;
    mimeType: string;
    size: number;
    path: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Insert type for creating a new media asset
 */
export type InsertMediaAsset = Omit<MediaAsset, 'id' | 'createdAt'> & {
    id?: string;
    createdAt?: Date;
};
/**
 * Schema for creating a new media asset
 */
export declare const insertMediaAssetSchema: z.ZodObject<{
    filename: z.ZodString;
    mimeType: z.ZodString;
    size: z.ZodNumber;
    path: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDefault<z.ZodOptional<z.ZodDate>>;
}, "strip", z.ZodTypeAny, {
    path: string;
    filename: string;
    createdAt: Date;
    mimeType: string;
    size: number;
    metadata?: Record<string, any> | undefined;
}, {
    path: string;
    filename: string;
    mimeType: string;
    size: number;
    metadata?: Record<string, any> | undefined;
    createdAt?: Date | undefined;
}>;
/**
 * Adaptive Resonance interface
 */
export interface AdaptiveResonance {
    id: string;
    sourceId: string;
    targetId: string;
    resonanceScore: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insert type for creating a new adaptive resonance record
 */
export type InsertAdaptiveResonance = Omit<AdaptiveResonance, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * Quantum Root Node interface
 */
export interface QuantumRootNode {
    id: string;
    name: string;
    type: string;
    status: string;
    content: string;
    connections: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insert type for creating a new quantum root node
 */
export type InsertQuantumRootNode = Omit<QuantumRootNode, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * Neural Pathway interface
 */
export interface NeuralPathway {
    id: string;
    sourceId: string;
    targetId: string;
    sourceName?: string;
    targetName?: string;
    pathType?: string;
    strength?: number;
    latency?: number;
    bandwidth?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insert type for creating a new neural pathway
 */
export type InsertNeuralPathway = Omit<NeuralPathway, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * Temporal Instance interface
 */
export interface TemporalInstance {
    id: string;
    type: string;
    reference: string;
    timestamp: Date;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Insert type for creating a new temporal instance
 */
export type InsertTemporalInstance = Omit<TemporalInstance, 'id' | 'createdAt'> & {
    id?: string;
    createdAt?: Date;
};
/**
 * Dataset interface
 */
export interface Dataset {
    id: string;
    name: string;
    description: string;
    source: string;
    type: string;
    size: number;
    format: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insert type for creating a new dataset
 */
export type InsertDataset = Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * Zod schema for dataset insertions
 */
export declare const insertDatasetSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    source: z.ZodString;
    type: z.ZodString;
    size: z.ZodNumber;
    format: z.ZodString;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    source: string;
    name: string;
    type: string;
    metadata: Record<string, any>;
    description: string;
    size: number;
    format: string;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    source: string;
    name: string;
    type: string;
    description: string;
    size: number;
    format: string;
    metadata?: Record<string, any> | undefined;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
/**
 * Transformation interface
 */
export interface Transformation {
    id: string;
    datasetId: string;
    name: string;
    description: string;
    type: string;
    parameters: Record<string, any>;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insert type for creating a new transformation
 */
export type InsertTransformation = Omit<Transformation, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * Zod schema for transformation insertions
 */
export declare const insertTransformationSchema: z.ZodObject<{
    datasetId: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    type: z.ZodString;
    parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
    metadata: Record<string, any>;
    description: string;
    datasetId: string;
    parameters: Record<string, any>;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    name: string;
    type: string;
    description: string;
    datasetId: string;
    metadata?: Record<string, any> | undefined;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    parameters?: Record<string, any> | undefined;
}>;
/**
 * Analysis Model interface
 */
export interface AnalysisModel {
    id: string;
    name: string;
    description: string;
    type: string;
    parameters: Record<string, any>;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insert type for creating a new analysis model
 */
export type InsertAnalysisModel = Omit<AnalysisModel, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * Zod schema for analysis model insertions
 */
export declare const insertAnalysisModelSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    type: z.ZodString;
    parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
    metadata: Record<string, any>;
    description: string;
    parameters: Record<string, any>;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    name: string;
    type: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    parameters?: Record<string, any> | undefined;
}>;
/**
 * Report interface
 */
export interface Report {
    id: string;
    name: string;
    description: string;
    content: string;
    type: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insert type for creating a new report
 */
export type InsertReport = Omit<Report, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * Zod schema for report insertions
 */
export declare const insertReportSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    content: z.ZodString;
    type: z.ZodString;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
    metadata: Record<string, any>;
    content: string;
    description: string;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    name: string;
    type: string;
    content: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
/**
 * Scheduled Task interface
 */
export interface ScheduledTask {
    id: string;
    name: string;
    description: string;
    cronExpression: string;
    taskType: string;
    parameters: Record<string, any>;
    status: 'active' | 'paused' | 'completed' | 'failed';
    lastRunAt?: Date;
    nextRunAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insert type for creating a new scheduled task
 */
export type InsertScheduledTask = Omit<ScheduledTask, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
/**
 * Zod schema for scheduled task insertions
 */
export declare const insertScheduledTaskSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    cronExpression: z.ZodString;
    taskType: z.ZodString;
    parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    status: z.ZodDefault<z.ZodEnum<["active", "paused", "completed", "failed"]>>;
    lastRunAt: z.ZodOptional<z.ZodDate>;
    nextRunAt: z.ZodOptional<z.ZodDate>;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    metadata: Record<string, any>;
    status: "active" | "completed" | "failed" | "paused";
    description: string;
    parameters: Record<string, any>;
    cronExpression: string;
    taskType: string;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    lastRunAt?: Date | undefined;
    nextRunAt?: Date | undefined;
}, {
    name: string;
    description: string;
    cronExpression: string;
    taskType: string;
    metadata?: Record<string, any> | undefined;
    status?: "active" | "completed" | "failed" | "paused" | undefined;
    id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    parameters?: Record<string, any> | undefined;
    lastRunAt?: Date | undefined;
    nextRunAt?: Date | undefined;
}>;
declare const _default: {
    createMetaCognitiveEvent: typeof createMetaCognitiveEvent;
    createMetaCognitiveEventSchema: z.ZodObject<{
        id: z.ZodDefault<z.ZodString>;
        type: z.ZodString;
        description: z.ZodString;
        details: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
        confidence: z.ZodDefault<z.ZodNumber>;
        impact: z.ZodDefault<z.ZodNumber>;
        timestamp: z.ZodDefault<z.ZodDate>;
        nodeId: z.ZodOptional<z.ZodString>;
        sourceContext: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        confidence: number;
        details: Record<string, any>;
        type: string;
        timestamp: Date;
        id: string;
        description: string;
        impact: number;
        sourceContext: string;
        nodeId?: string | undefined;
    }, {
        type: string;
        description: string;
        confidence?: number | undefined;
        details?: Record<string, any> | undefined;
        timestamp?: Date | undefined;
        id?: string | undefined;
        impact?: number | undefined;
        nodeId?: string | undefined;
        sourceContext?: string | undefined;
    }>;
    createNexusJob: typeof createNexusJob;
    insertApiKeySchema: z.ZodObject<{
        name: z.ZodString;
        key: z.ZodString;
        expiresAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        key: string;
        expiresAt?: Date | undefined;
    }, {
        name: string;
        key: string;
        expiresAt?: Date | undefined;
    }>;
    insertSystemLogSchema: z.ZodObject<{
        type: z.ZodEnum<["info", "warning", "error", "debug"]>;
        message: z.ZodString;
        component: z.ZodString;
        severity: z.ZodNumber;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        timestamp: z.ZodDefault<z.ZodOptional<z.ZodDate>>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        type: "error" | "info" | "warning" | "debug";
        timestamp: Date;
        component: string;
        severity: number;
        metadata?: Record<string, any> | undefined;
    }, {
        message: string;
        type: "error" | "info" | "warning" | "debug";
        component: string;
        severity: number;
        metadata?: Record<string, any> | undefined;
        timestamp?: Date | undefined;
    }>;
    insertMediaAssetSchema: z.ZodObject<{
        filename: z.ZodString;
        mimeType: z.ZodString;
        size: z.ZodNumber;
        path: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        createdAt: z.ZodDefault<z.ZodOptional<z.ZodDate>>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        filename: string;
        createdAt: Date;
        mimeType: string;
        size: number;
        metadata?: Record<string, any> | undefined;
    }, {
        path: string;
        filename: string;
        mimeType: string;
        size: number;
        metadata?: Record<string, any> | undefined;
        createdAt?: Date | undefined;
    }>;
    insertDatasetSchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        source: z.ZodString;
        type: z.ZodString;
        size: z.ZodNumber;
        format: z.ZodString;
        metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        id: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodDate>;
        updatedAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        source: string;
        name: string;
        type: string;
        metadata: Record<string, any>;
        description: string;
        size: number;
        format: string;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }, {
        source: string;
        name: string;
        type: string;
        description: string;
        size: number;
        format: string;
        metadata?: Record<string, any> | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    insertTransformationSchema: z.ZodObject<{
        datasetId: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        type: z.ZodString;
        parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
        metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        id: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodDate>;
        updatedAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
        metadata: Record<string, any>;
        description: string;
        datasetId: string;
        parameters: Record<string, any>;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }, {
        name: string;
        type: string;
        description: string;
        datasetId: string;
        metadata?: Record<string, any> | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        parameters?: Record<string, any> | undefined;
    }>;
    insertAnalysisModelSchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        type: z.ZodString;
        parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
        metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        id: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodDate>;
        updatedAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
        metadata: Record<string, any>;
        description: string;
        parameters: Record<string, any>;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }, {
        name: string;
        type: string;
        description: string;
        metadata?: Record<string, any> | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        parameters?: Record<string, any> | undefined;
    }>;
    insertReportSchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        content: z.ZodString;
        type: z.ZodString;
        metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        id: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodDate>;
        updatedAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
        metadata: Record<string, any>;
        content: string;
        description: string;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }, {
        name: string;
        type: string;
        content: string;
        description: string;
        metadata?: Record<string, any> | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    insertScheduledTaskSchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        cronExpression: z.ZodString;
        taskType: z.ZodString;
        parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
        status: z.ZodDefault<z.ZodEnum<["active", "paused", "completed", "failed"]>>;
        lastRunAt: z.ZodOptional<z.ZodDate>;
        nextRunAt: z.ZodOptional<z.ZodDate>;
        metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        id: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodDate>;
        updatedAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        metadata: Record<string, any>;
        status: "active" | "completed" | "failed" | "paused";
        description: string;
        parameters: Record<string, any>;
        cronExpression: string;
        taskType: string;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        lastRunAt?: Date | undefined;
        nextRunAt?: Date | undefined;
    }, {
        name: string;
        description: string;
        cronExpression: string;
        taskType: string;
        metadata?: Record<string, any> | undefined;
        status?: "active" | "completed" | "failed" | "paused" | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        parameters?: Record<string, any> | undefined;
        lastRunAt?: Date | undefined;
        nextRunAt?: Date | undefined;
    }>;
};
export default _default;
//# sourceMappingURL=schema-minimal.d.ts.map