/**
 * Memory Schema Definition
 * 
 * This module defines the database schema for the memory system,
 * ensuring a consistent schema between Node.js (Drizzle) and Python (SQLModel).
 * 
 * Follows the 3:1 quantum balance ratio: 75% coherence, 25% exploration.
 */

import { pgTable, serial, text, timestamp, json, integer, boolean } from "drizzle-orm/pg-core";

// Memory sources
export const MEMORY_SOURCES = {
  CHATGPT: 'chatgpt',
  BROWSER: 'browser',
  FINANCE: 'finance',
  PERSONAL: 'personal',
  PYTHON_BOOT_LOADER: 'python-boot-loader'
};

// Memory content types
export const MEMORY_CONTENT_TYPES = {
  TEXT: 'text',
  JSON: 'json',
  BINARY: 'binary'
};

// Memory status
export const MEMORY_STATUS = {
  IMPORTING: 'importing',
  ANALYZING: 'analyzing',
  PROCESSED: 'processed',
  ERROR: 'error'
};

// Memories table
export const memories = pgTable('memories', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  content_type: text('content_type').notNull().default(MEMORY_CONTENT_TYPES.TEXT),
  source: text('source').notNull().default(MEMORY_SOURCES.CHATGPT),
  status: text('status').notNull().default(MEMORY_STATUS.IMPORTING),
  metadata: json('metadata').default({}),
  coherence_score: integer('coherence_score').default(0),
  imported_by: text('imported_by').notNull().default('node'),
  imported_at: timestamp('imported_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// Coherence snapshots table
export const coherence_snapshots = pgTable('coherence_snapshots', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  coherence_ratio: text('coherence_ratio').notNull().default('3:1'),
  coherence_score: integer('coherence_score').notNull(),
  stability_score: integer('stability_score').notNull(),
  exploration_score: integer('exploration_score').notNull(),
  metadata: json('metadata').default({}),
  source: text('source').notNull().default('node')
});

// Memory transactions table
export const memory_transactions = pgTable('memory_transactions', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  memory_id: integer('memory_id'),
  operation: text('operation').notNull(),
  details: json('details').default({}),
  success: boolean('success').notNull().default(true),
  error_message: text('error_message'),
  source: text('source').notNull().default('node')
});

// API keys table
export const api_keys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  service: text('service').notNull(),
  key_identifier: text('key_identifier').notNull(),
  active: boolean('active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  last_used_at: timestamp('last_used_at')
});

// Export all tables
export default {
  memories,
  coherence_snapshots,
  memory_transactions,
  api_keys
};