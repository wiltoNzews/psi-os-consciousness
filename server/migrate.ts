import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from '../shared/db/db.js';
import * as schema from '../shared/db/schema.js';
import { sql } from 'drizzle-orm';

// Main migration function
async function runMigration() {
  console.log('🔄 Running database migration...');
  
  try {
    // Create the schema if it doesn't exist
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS public`);
    
    // Create tables if they don't exist
    await createTables();
    
    console.log('✅ Database migration completed successfully!');
    
    // Close the database connection
    await pool.end();
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    
    // Close the database connection
    await pool.end();
    process.exit(1);
  }
}

// Creates all database tables
async function createTables() {
  try {
    // Create quantum root nodes table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "quantum_root_nodes" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "state" JSONB DEFAULT '{}',
        "capabilities" JSONB DEFAULT '[]',
        "connections" JSONB DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "last_activity" TIMESTAMP DEFAULT NOW(),
        "coherence_score" INTEGER DEFAULT 5
      )
    `);
    
    // Create neural pathways table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "neural_pathways" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "source_id" UUID NOT NULL REFERENCES "quantum_root_nodes"("id"),
        "target_id" UUID NOT NULL REFERENCES "quantum_root_nodes"("id"),
        "weight" INTEGER NOT NULL DEFAULT 50,
        "type" VARCHAR(100) NOT NULL,
        "metadata" JSONB DEFAULT '{}',
        "path_type" VARCHAR(100),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create meta-cognitive events table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "meta_cognitive_events" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "node_id" UUID REFERENCES "quantum_root_nodes"("id"),
        "type" VARCHAR(100) NOT NULL,
        "description" TEXT NOT NULL,
        "details" JSONB DEFAULT '{}',
        "confidence" INTEGER DEFAULT 0,
        "impact" INTEGER DEFAULT 0,
        "related_events" TEXT,
        "outcome" TEXT,
        "source_context" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create temporal instances table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "temporal_instances" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "node_id" UUID NOT NULL REFERENCES "quantum_root_nodes"("id"),
        "timestamp" TIMESTAMP NOT NULL DEFAULT NOW(),
        "state" TEXT NOT NULL,
        "dimension_type" VARCHAR(100) NOT NULL,
        "parent_id" UUID REFERENCES "temporal_instances"("id"),
        "stability_factor" INTEGER DEFAULT 50,
        "metadata" JSONB DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create chunks table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "chunks" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "qrn_id" UUID REFERENCES "quantum_root_nodes"("id"),
        "parent_task_id" UUID,
        "parent_chunk_id" UUID,
        "original_content" TEXT NOT NULL,
        "processed_content" TEXT,
        "chunk_index" INTEGER NOT NULL,
        "total_chunks" INTEGER NOT NULL,
        "chunk_size" INTEGER NOT NULL,
        "chunk_state" VARCHAR(50) NOT NULL DEFAULT 'created',
        "embedding" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Add self-reference to chunks table
    await db.execute(sql`
      ALTER TABLE "chunks" 
      ADD CONSTRAINT IF NOT EXISTS "chunks_parent_chunk_id_fkey" 
      FOREIGN KEY ("parent_chunk_id") REFERENCES "chunks"("id")
    `);
    
    // Create chunk dependencies table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "chunk_dependencies" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "source_chunk_id" UUID NOT NULL REFERENCES "chunks"("id"),
        "target_chunk_id" UUID NOT NULL REFERENCES "chunks"("id"),
        "type" VARCHAR(100) NOT NULL,
        "strength" INTEGER NOT NULL DEFAULT 50,
        "metadata" JSONB DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create adaptive resonances table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "adaptive_resonances" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "chunk_id" UUID NOT NULL REFERENCES "chunks"("id"),
        "model_type" VARCHAR(100) NOT NULL,
        "strength" INTEGER NOT NULL DEFAULT 50,
        "adaptation_rate" INTEGER NOT NULL DEFAULT 10,
        "metadata" JSONB DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create nexus jobs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "nexus_jobs" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "input" JSONB NOT NULL,
        "options" JSONB NOT NULL,
        "status" VARCHAR(50) NOT NULL DEFAULT 'processing',
        "progress" JSONB NOT NULL,
        "result" JSONB,
        "error" TEXT,
        "metrics" JSONB,
        "stage_metrics" JSONB DEFAULT '{}',
        "start_time" TIMESTAMP NOT NULL DEFAULT NOW(),
        "estimated_completion" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('✅ All tables created successfully');
  } catch (error) {
    console.error('❌ Failed to create tables:', error);
    throw error;
  }
}

// Run the migration script
runMigration();