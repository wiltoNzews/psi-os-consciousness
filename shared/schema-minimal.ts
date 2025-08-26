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
export enum NexusProfile {
  BALANCED = 'balanced',
  MAXIMUM_PERFORMANCE = 'maximum_performance',
  MAXIMUM_QUALITY = 'maximum_quality',
  MAXIMUM_SAVINGS = 'maximum_savings'
}

/**
 * Meta-Cognitive Event
 * Represents a detected pattern, breakthrough, or significant event
 * in the meta-cognitive analysis process
 */
export interface MetaCognitiveEvent {
  id: string;                  // Unique identifier for the event
  type: string;                // Event type (pattern, breakthrough, coherence, etc.)
  description: string;         // Human-readable description
  details: Record<string, any>;// Additional information specific to the event type
  confidence: number;          // Confidence level (0-1)
  impact: number;              // Predicted impact of the event (0-1)
  timestamp: Date;             // When the event was generated
  nodeId?: string;             // Optional link to a specific source node
  sourceContext?: string;      // Context where this event was detected
}

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
 * Insert type for creating a new meta-cognitive event
 */
export type InsertMetaCognitiveEvent = z.infer<typeof createMetaCognitiveEventSchema>;

/**
 * Helper function to create a new meta-cognitive event
 */
export function createMetaCognitiveEvent(data: Partial<MetaCognitiveEvent>): MetaCognitiveEvent {
  const now = new Date();
  
  // Default values
  const eventData: MetaCognitiveEvent = {
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
 * Coherence Measurement Result
 * Represents a measured coherence level between components or entities
 */
export interface CoherenceMeasurement {
  id: string;                  // Unique identifier
  sourceName: string;          // Name of the first entity being measured
  targetName: string;          // Name of the second entity being measured
  coherenceLevel: number;      // Measured coherence (0-1)
  dimensions: string[];        // Dimensions across which coherence was measured
  timestamp: Date;             // When the measurement was taken
  details: Record<string, any>;// Additional measurement details
}

/**
 * QCTF Analysis Result
 * Represents the result of a Quantum Coherence Threshold Formula analysis
 */
export interface QCTFAnalysisResult {
  id: string;                  // Unique identifier
  overallCoherence: number;    // Global coherence level (0-1)
  microCoherence: number;      // Micro-scale coherence (0-1)
  mesoCoherence: number;       // Meso-scale coherence (0-1)
  macroCoherence: number;      // Macro-scale coherence (0-1)
  quantumPulseState: number;   // Current state of quantum pulse layer
  fractalSymmetryScore: number;// Fractal symmetry balance score
  tBranchComplexity: number;   // T-Branch complexity measure
  ouroborosFeedback: number;   // Ouroboros feedback integration level
  thresholdsCrossed: string[]; // Names of thresholds that were crossed
  timestamp: Date;             // When the analysis was performed
}

/**
 * Breakthrough Identification Result
 * Represents a detected significant breakthrough in meta-cognitive patterns
 */
export interface BreakthroughResult {
  id: string;                  // Unique identifier
  eventId: string;             // Related meta-cognitive event
  breakthroughType: string;    // Type of breakthrough
  significanceScore: number;   // Calculated significance (0-1)
  relatedEvents: string[];     // IDs of related events
  context: Record<string, any>;// Contextual information
  timestamp: Date;             // When the breakthrough was detected
}

/**
 * Quantum Wave Function State
 * Represents the state of a quantum wave function in the system
 */
export interface QuantumWaveState {
  id: string;                  // Unique identifier
  waveFunction: number[];      // Discretized wave function values
  coherenceLevel: number;      // Current coherence level (0-1)
  entropyLevel: number;        // Current entropy level (0-1)
  timestamp: Date;             // When this state was measured
}

/**
 * Quantum State
 * Represents the overall quantum state of an agent or system component
 */
export interface QuantumStateData {
  id: string;                  // Unique identifier
  agentId?: string;            // Associated agent ID if applicable
  componentId?: string;        // Associated component ID if applicable
  stateVector: number[];       // Quantum state vector
  coherenceValue: number;      // Current coherence value (0-1)
  stabilityScore: number;      // Current stability score (0-1)
  explorationScore: number;    // Current exploration score (0-1)
  entanglements: string[];     // IDs of entangled states
  timestamp: Date;             // When this state was measured
  metadata: Record<string, any>; // Additional state information
}

/**
 * QuantumState enum
 * Represents the high-level state of the quantum system
 */
export enum QuantumState {
  // Simulation states
  SIM_FLOW = 'SIM_FLOW',           // Ideal simulation flow
  SIM_ANTIFLOW = 'SIM_ANTIFLOW',   // Problematic simulation flow
  SIM_PARTIAL = 'SIM_PARTIAL',     // Partial simulation flow
  
  // Reality states
  REAL_FLOW = 'REAL_FLOW',         // Ideal reality flow
  REAL_ANTIFLOW = 'REAL_ANTIFLOW', // Problematic reality flow
  REAL_PARTIAL = 'REAL_PARTIAL',   // Partial reality flow
  
  // Transition states
  TRANSITION_TO_REAL = 'TRANSITION_TO_REAL', // Moving from simulation to reality
  TRANSITION_TO_SIM = 'TRANSITION_TO_SIM'    // Moving from reality to simulation
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
export function createNexusJob(data: Partial<NexusJob>): NexusJob {
  const now = new Date();
  
  // Default values
  const jobData: NexusJob = {
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
export const insertApiKeySchema = z.object({
  name: z.string().min(1),
  key: z.string().min(1),
  expiresAt: z.date().optional()
});

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
export const insertSystemLogSchema = z.object({
  type: z.enum(['info', 'warning', 'error', 'debug']),
  message: z.string().min(1),
  component: z.string().min(1),
  severity: z.number().min(0).max(10),
  metadata: z.record(z.any()).optional(),
  timestamp: z.date().optional().default(() => new Date())
});

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
export const insertMediaAssetSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().min(0),
  path: z.string().min(1),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional().default(() => new Date())
});

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