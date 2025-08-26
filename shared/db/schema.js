import { pgTable, varchar, text, integer, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import * as z from 'zod';
// Quantum Root Nodes
export var quantumRootNodes = pgTable('quantum_root_nodes', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    state: jsonb('state').default({}),
    capabilities: jsonb('capabilities').default([]),
    connections: jsonb('connections').default({}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    lastActivity: timestamp('last_activity').defaultNow(),
    coherenceScore: integer('coherence_score').default(5),
});
export var insertQuantumRootNodeSchema = createInsertSchema(quantumRootNodes, {
    state: z.record(z.any()).default({}),
    capabilities: z.array(z.string()).default([]),
    connections: z.record(z.any()).default({}),
}).omit({ id: true, createdAt: true, updatedAt: true });
// Neural Pathways
export var neuralPathways = pgTable('neural_pathways', {
    id: uuid('id').primaryKey().defaultRandom(),
    sourceId: uuid('source_id').notNull().references(function () { return quantumRootNodes.id; }),
    targetId: uuid('target_id').notNull().references(function () { return quantumRootNodes.id; }),
    weight: integer('weight').notNull().default(50),
    type: varchar('type', { length: 100 }).notNull(),
    metadata: jsonb('metadata').default({}),
    pathType: varchar('path_type', { length: 100 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export var insertNeuralPathwaySchema = createInsertSchema(neuralPathways, {
    metadata: z.record(z.any()).default({}),
}).omit({ id: true, createdAt: true, updatedAt: true });
// Meta-Cognitive Events
export var metaCognitiveEvents = pgTable('meta_cognitive_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    nodeId: uuid('node_id').references(function () { return quantumRootNodes.id; }),
    type: varchar('type', { length: 100 }).notNull(),
    description: text('description').notNull(),
    details: jsonb('details').default({}),
    confidence: integer('confidence').default(0),
    impact: integer('impact').default(0),
    relatedEvents: text('related_events'),
    outcome: text('outcome'),
    sourceContext: text('source_context'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
export var insertMetaCognitiveEventSchema = createInsertSchema(metaCognitiveEvents, {
    details: z.record(z.any()).default({}),
}).omit({ id: true, createdAt: true });
// Temporal Instances
export var temporalInstances = pgTable('temporal_instances', {
    id: uuid('id').primaryKey().defaultRandom(),
    nodeId: uuid('node_id').notNull().references(function () { return quantumRootNodes.id; }),
    timestamp: timestamp('timestamp').notNull().defaultNow(),
    state: text('state').notNull(),
    dimensionType: varchar('dimension_type', { length: 100 }).notNull(),
    parentId: uuid('parent_id').references(function () { return temporalInstances.id; }),
    stabilityFactor: integer('stability_factor').default(50),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export var insertTemporalInstanceSchema = createInsertSchema(temporalInstances, {
    metadata: z.record(z.any()).default({}),
}).omit({ id: true, createdAt: true, updatedAt: true });
// Chunks
export var chunks = pgTable('chunks', {
    id: uuid('id').primaryKey().defaultRandom(),
    qrnId: uuid('qrn_id').references(function () { return quantumRootNodes.id; }),
    parentTaskId: uuid('parent_task_id'),
    parentChunkId: uuid('parent_chunk_id').references(function () { return chunks.id; }),
    originalContent: text('original_content').notNull(),
    processedContent: text('processed_content'),
    chunkIndex: integer('chunk_index').notNull(),
    totalChunks: integer('total_chunks').notNull(),
    chunkSize: integer('chunk_size').notNull(),
    chunkState: varchar('chunk_state', { length: 50 }).default('created').notNull(),
    embedding: jsonb('embedding'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export var insertChunkSchema = createInsertSchema(chunks).omit({ id: true, createdAt: true, updatedAt: true });
// Chunk Dependencies
export var chunkDependencies = pgTable('chunk_dependencies', {
    id: uuid('id').primaryKey().defaultRandom(),
    sourceChunkId: uuid('source_chunk_id').notNull().references(function () { return chunks.id; }),
    targetChunkId: uuid('target_chunk_id').notNull().references(function () { return chunks.id; }),
    type: varchar('type', { length: 100 }).notNull(),
    strength: integer('strength').notNull().default(50),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export var insertChunkDependencySchema = createInsertSchema(chunkDependencies, {
    metadata: z.record(z.any()).default({}),
}).omit({ id: true, createdAt: true, updatedAt: true });
// Adaptive Resonances
export var adaptiveResonances = pgTable('adaptive_resonances', {
    id: uuid('id').primaryKey().defaultRandom(),
    chunkId: uuid('chunk_id').notNull().references(function () { return chunks.id; }),
    modelType: varchar('model_type', { length: 100 }).notNull(),
    strength: integer('strength').notNull().default(50),
    adaptationRate: integer('adaptation_rate').notNull().default(10),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export var insertAdaptiveResonanceSchema = createInsertSchema(adaptiveResonances, {
    metadata: z.record(z.any()).default({}),
}).omit({ id: true, createdAt: true, updatedAt: true });
// Nexus Jobs
export var nexusJobs = pgTable('nexus_jobs', {
    id: uuid('id').primaryKey().defaultRandom(),
    input: jsonb('input').notNull(),
    options: jsonb('options').notNull(),
    status: varchar('status', { length: 50 }).notNull().default('processing'),
    progress: jsonb('progress').notNull(),
    result: jsonb('result'),
    error: text('error'),
    metrics: jsonb('metrics'),
    stageMetrics: jsonb('stage_metrics').default({}),
    startTime: timestamp('start_time').notNull().defaultNow(),
    estimatedCompletion: timestamp('estimated_completion'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export var insertNexusJobSchema = createInsertSchema(nexusJobs).omit({
    id: true,
    progress: true,
    stageMetrics: true,
    startTime: true,
    createdAt: true,
    updatedAt: true
});
