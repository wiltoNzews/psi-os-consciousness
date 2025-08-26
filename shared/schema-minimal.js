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
import { randomUUID } from 'crypto';
/**
 * NexusProfile enum
 * Represents the optimization profile for Nexus jobs
 */
export var NexusProfile;
(function (NexusProfile) {
    NexusProfile["BALANCED"] = "balanced";
    NexusProfile["MAXIMUM_PERFORMANCE"] = "maximum_performance";
    NexusProfile["MAXIMUM_QUALITY"] = "maximum_quality";
    NexusProfile["MAXIMUM_SAVINGS"] = "maximum_savings";
})(NexusProfile || (NexusProfile = {}));
/**
 * Schema for creating a new meta-cognitive event
 */
export const createMetaCognitiveEventSchema = z.object({
    id: z.string().uuid().default(() => randomUUID()),
    type: z.string().min(1),
    description: z.string().min(1),
    details: z.record(z.any()).default({}),
    confidence: z.number().min(0).max(1).default(0.5),
    impact: z.number().min(0).max(1).default(0.5),
    timestamp: z.date().default(() => new Date()),
    nodeId: z.string().uuid().optional(),
    sourceContext: z.string().optional().default('system')
});
/**
 * Helper function to create a new meta-cognitive event
 */
export function createMetaCognitiveEvent(data) {
    const now = new Date();
    // Default values
    const eventData = {
        id: data.id || randomUUID(),
        type: data.type || 'unknown',
        description: data.description || 'Unspecified event',
        details: data.details || {},
        confidence: data.confidence !== undefined ? data.confidence : 0.5,
        impact: data.impact !== undefined ? data.impact : 0.5,
        timestamp: data.timestamp || now,
        nodeId: data.nodeId,
        sourceContext: data.sourceContext || 'system'
    };
    return eventData;
}
/**
 * QuantumState enum
 * Represents the high-level state of the quantum system
 */
export var QuantumState;
(function (QuantumState) {
    // Simulation states
    QuantumState["SIM_FLOW"] = "SIM_FLOW";
    QuantumState["SIM_ANTIFLOW"] = "SIM_ANTIFLOW";
    QuantumState["SIM_PARTIAL"] = "SIM_PARTIAL";
    // Reality states
    QuantumState["REAL_FLOW"] = "REAL_FLOW";
    QuantumState["REAL_ANTIFLOW"] = "REAL_ANTIFLOW";
    QuantumState["REAL_PARTIAL"] = "REAL_PARTIAL";
    // Transition states
    QuantumState["TRANSITION_TO_REAL"] = "TRANSITION_TO_REAL";
    QuantumState["TRANSITION_TO_SIM"] = "TRANSITION_TO_SIM"; // Moving from reality to simulation
})(QuantumState || (QuantumState = {}));
/**
 * Helper function to create a new Nexus job
 */
export function createNexusJob(data) {
    const now = new Date();
    // Default values
    const jobData = {
        id: data.id || randomUUID(),
        name: data.name || 'Unnamed Job',
        description: data.description || '',
        status: data.status || 'pending',
        createdAt: data.createdAt || now,
        updatedAt: data.updatedAt || now,
        completedAt: data.completedAt,
        stages: data.stages || [],
        progress: data.progress || {
            current: 0,
            total: 100,
            stage: 'init'
        },
        metadata: data.metadata || {}
    };
    return jobData;
}
/**
 * Schema for creating a new API key
 */
export const insertApiKeySchema = z.object({
    name: z.string().min(1),
    key: z.string().min(1),
    expiresAt: z.date().optional()
});
/**
 * Schema for creating a new system log
 */
export const insertSystemLogSchema = z.object({
    type: z.enum(['info', 'warning', 'error', 'debug']),
    message: z.string().min(1),
    component: z.string().min(1),
    severity: z.number().min(0).max(10),
    metadata: z.record(z.any()).optional(),
    timestamp: z.date().optional().default(() => new Date())
});
/**
 * Schema for creating a new media asset
 */
export const insertMediaAssetSchema = z.object({
    filename: z.string().min(1),
    mimeType: z.string().min(1),
    size: z.number().min(0),
    path: z.string().min(1),
    metadata: z.record(z.any()).optional(),
    createdAt: z.date().optional().default(() => new Date())
});
/**
 * Zod schema for dataset insertions
 */
export const insertDatasetSchema = z.object({
    name: z.string(),
    description: z.string(),
    source: z.string(),
    type: z.string(),
    size: z.number(),
    format: z.string(),
    metadata: z.record(z.any()).optional().default({}),
    id: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});
/**
 * Zod schema for transformation insertions
 */
export const insertTransformationSchema = z.object({
    datasetId: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.string(),
    parameters: z.record(z.any()).default({}),
    metadata: z.record(z.any()).optional().default({}),
    id: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});
/**
 * Zod schema for analysis model insertions
 */
export const insertAnalysisModelSchema = z.object({
    name: z.string(),
    description: z.string(),
    type: z.string(),
    parameters: z.record(z.any()).default({}),
    metadata: z.record(z.any()).optional().default({}),
    id: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});
/**
 * Zod schema for report insertions
 */
export const insertReportSchema = z.object({
    name: z.string(),
    description: z.string(),
    content: z.string(),
    type: z.string(),
    metadata: z.record(z.any()).optional().default({}),
    id: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});
/**
 * Zod schema for scheduled task insertions
 */
export const insertScheduledTaskSchema = z.object({
    name: z.string(),
    description: z.string(),
    cronExpression: z.string(),
    taskType: z.string(),
    parameters: z.record(z.any()).default({}),
    status: z.enum(['active', 'paused', 'completed', 'failed']).default('active'),
    lastRunAt: z.date().optional(),
    nextRunAt: z.date().optional(),
    metadata: z.record(z.any()).optional().default({}),
    id: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});
// All interfaces and enums are already exported in the file 
// through the declaration statements above
export default {
    createMetaCognitiveEvent,
    createMetaCognitiveEventSchema,
    createNexusJob,
    insertApiKeySchema,
    insertSystemLogSchema,
    insertMediaAssetSchema,
    insertDatasetSchema,
    insertTransformationSchema,
    insertAnalysisModelSchema,
    insertReportSchema,
    insertScheduledTaskSchema
};
//# sourceMappingURL=schema-minimal.js.map