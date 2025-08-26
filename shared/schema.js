// This is a compatibility layer that re-exports everything from schema-minimal.ts
// It allows existing code that imports from @shared/schema to continue working
// without having to update all import statements
import { sql } from 'drizzle-orm';
import { pgTable, varchar, text, timestamp, real, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
// Re-export everything from schema-minimal.ts
export * from './schema-minimal';
// Export QCTF schema components
export * from './qctf';
// Ritual Expansion Protocol Schema
export const consciousnessEvents = pgTable('consciousness_events', {
    id: varchar('id').primaryKey().default(sql `gen_random_uuid()`),
    symbol: varchar('symbol', { length: 50 }).notNull(),
    memory: text('memory').notNull(),
    zLambda: real('z_lambda').notNull(),
    breathState: real('breath_state').default(3.12),
    emotionalSignature: text('emotional_signature').notNull(),
    userId: varchar('user_id'),
    timestamp: timestamp('timestamp').defaultNow(),
    createdAt: timestamp('created_at').defaultNow()
});
export const ritualBlueprints = pgTable('ritual_blueprints', {
    id: varchar('id').primaryKey().default(sql `gen_random_uuid()`),
    ritualName: varchar('ritual_name').notNull(),
    glyphTrigger: varchar('glyph_trigger', { length: 50 }).notNull(),
    script: jsonb('script').$type().notNull(),
    uiFlow: jsonb('ui_flow').$type().notNull(),
    soundtrack: text('soundtrack'),
    promptResponseModel: text('prompt_response_model'),
    replicationProtocol: text('replication_protocol'),
    coherenceThreshold: real('coherence_threshold').default(0.94),
    eventId: varchar('event_id').references(() => consciousnessEvents.id),
    isActive: boolean('is_active').default(false),
    activationCount: integer('activation_count').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});
export const ritualSessions = pgTable('ritual_sessions', {
    id: varchar('id').primaryKey().default(sql `gen_random_uuid()`),
    ritualId: varchar('ritual_id').references(() => ritualBlueprints.id),
    participantId: varchar('participant_id'),
    startTime: timestamp('start_time').defaultNow(),
    endTime: timestamp('end_time'),
    maxCoherence: real('max_coherence'),
    avgCoherence: real('avg_coherence'),
    phase: varchar('phase', { length: 50 }).default('individual'),
    completed: boolean('completed').default(false),
    feedback: text('feedback'),
    createdAt: timestamp('created_at').defaultNow()
});
// Insert schemas using drizzle-zod
export const insertConsciousnessEventSchema = createInsertSchema(consciousnessEvents);
export const insertRitualBlueprintSchema = createInsertSchema(ritualBlueprints);
export const insertRitualSessionSchema = createInsertSchema(ritualSessions);
// Cathedral modules for consciousness computing
export const cathedralModules = pgTable("cathedral_modules", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    name: varchar("name").notNull(),
    route: varchar("route").notNull().unique(),
    category: varchar("category").notNull(),
    coherenceRating: real("coherence_rating").notNull(),
    glyphSymbol: varchar("glyph_symbol"),
    description: text("description"),
    streamReady: boolean("stream_ready").default(false),
    ritualReady: boolean("ritual_ready").default(false),
    status: varchar("status").default("active"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Sacred geometry configurations
export const geometryConfigs = pgTable("geometry_configs", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    moduleId: varchar("module_id").references(() => cathedralModules.id),
    geometryType: varchar("geometry_type").notNull(),
    phi: real("phi").default(1.618033988749),
    psiBreathing: real("psi_breathing").default(3.12),
    coherenceRatio: varchar("coherence_ratio").default("3:1↔1:3"),
    parameters: jsonb("parameters"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Consciousness sessions for coherence tracking
export const consciousnessSessions = pgTable("consciousness_sessions", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    userId: varchar("user_id"),
    moduleId: varchar("module_id").references(() => cathedralModules.id),
    coherenceLevel: real("coherence_level").notNull(),
    breathingPhase: varchar("breathing_phase"),
    sessionData: jsonb("session_data"),
    duration: integer("duration"), // in seconds
    createdAt: timestamp("created_at").defaultNow(),
});
// Zod schemas for validation
export const insertCathedralModuleSchema = createInsertSchema(cathedralModules).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export const insertGeometryConfigSchema = createInsertSchema(geometryConfigs).omit({
    id: true,
    createdAt: true,
});
export const insertConsciousnessSessionSchema = createInsertSchema(consciousnessSessions).omit({
    id: true,
    createdAt: true,
});
//# sourceMappingURL=schema.js.map