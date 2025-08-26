/**
 * WiltonOS Memory Schema
 * 
 * This schema defines the database tables and types for the memory system.
 * It's shared between the Node.js and Python parts of the application.
 */

import { pgTable, serial, varchar, text, timestamp, integer, boolean, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

/**
 * Memory Sources Enum
 * 
 * Sources of memory data in the system.
 */
export const MEMORY_SOURCES = {
  CHATGPT: 'chatgpt',
  BROWSER: 'browser',
  FINANCE: 'finance',
  PERSONAL: 'personal',
  PYTHON_BOOT_LOADER: 'python-boot-loader'
} as const;

/**
 * Memory Content Types Enum
 * 
 * Types of content that can be stored in memory.
 */
export const MEMORY_CONTENT_TYPES = {
  TEXT: 'text',
  JSON: 'json',
  BINARY: 'binary'
} as const;

/**
 * Memory Status Enum
 * 
 * Status of memory processing.
 */
export const MEMORY_STATUS = {
  IMPORTING: 'importing',
  ANALYZING: 'analyzing',
  PROCESSED: 'processed',
  ERROR: 'error'
} as const;

/**
 * Memories Table
 * 
 * Stores all imported memory content.
 */
export const memories = pgTable('memories', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  content_type: text('content_type').notNull().default(sql`'text'`),
  source: text('source').notNull().default(sql`'chatgpt'`),
  status: text('status').notNull().default(sql`'importing'`),
  metadata: jsonb('metadata').notNull().default({}),
  coherence_score: integer('coherence_score'),
  imported_by: text('imported_by').notNull().default('node'),
  imported_at: timestamp('imported_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

/**
 * Coherence Snapshots Table
 * 
 * Stores system coherence metrics over time.
 */
export const coherenceSnapshots = pgTable('coherence_snapshots', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  coherence_ratio: text('coherence_ratio').notNull().default('3:1'),
  coherence_score: integer('coherence_score').notNull(),
  stability_score: integer('stability_score').notNull(),
  exploration_score: integer('exploration_score').notNull(),
  metadata: jsonb('metadata').notNull().default({}),
  source: text('source').notNull().default('node')
});

/**
 * Memory Transactions Table
 * 
 * Logs operations performed on memories.
 */
export const memoryTransactions = pgTable('memory_transactions', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  memory_id: integer('memory_id'),
  operation: text('operation').notNull(),
  details: jsonb('details').notNull().default({}),
  success: boolean('success').notNull().default(true),
  error_message: text('error_message'),
  source: text('source').notNull().default('node')
});

/**
 * API Keys Table
 * 
 * Stores references to API keys for external services.
 */
export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  service: text('service').notNull(),
  key_identifier: text('key_identifier').notNull(),
  active: boolean('active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  last_used_at: timestamp('last_used_at')
});

/**
 * Insert Schemas (for validation)
 */
export const insertMemorySchema = createInsertSchema(memories).omit({ 
  id: true,
  imported_at: true,
  updated_at: true
});

export const insertCoherenceSnapshotSchema = createInsertSchema(coherenceSnapshots).omit({ 
  id: true,
  timestamp: true
});

export const insertMemoryTransactionSchema = createInsertSchema(memoryTransactions).omit({ 
  id: true,
  timestamp: true
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ 
  id: true,
  created_at: true,
  last_used_at: true
});

/**
 * TypeScript Types
 */
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type InsertCoherenceSnapshot = z.infer<typeof insertCoherenceSnapshotSchema>;
export type InsertMemoryTransaction = z.infer<typeof insertMemoryTransactionSchema>;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

export type Memory = typeof memories.$inferSelect;
export type CoherenceSnapshot = typeof coherenceSnapshots.$inferSelect;
export type MemoryTransaction = typeof memoryTransactions.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;