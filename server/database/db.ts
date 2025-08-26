/**
 * Unified PostgreSQL Database Connection
 * 
 * This module provides a shared PostgreSQL connection for both Node.js and Python.
 * It follows the 3:1 quantum balance ratio (75% coherence, 25% exploration).
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as memorySchema from '../../shared/schema-memory.js';
import * as path from 'path';
import * as fs from 'fs';

// Get database URL from environment or use default value
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/quantum_nexus';

// Create a PostgreSQL connection pool with quantum coherence settings
const pool = new Pool({
  connectionString: DATABASE_URL,
  // Connection balance: 75% stability (max connections), 25% exploration (idle timeout)
  max: 20, // Stability: Maximum number of clients in the pool
  idleTimeoutMillis: 15000, // Exploration: Allow connections to adapt
  connectionTimeoutMillis: 10000, // Time to wait for a connection to become available
});

// Log the connection status for real-time debugging
pool.on('connect', (client) => {
  console.log('[QUANTUM_STATE: CONNECTION_FLOW] New PostgreSQL client connected with coherence integrity');
});

pool.on('error', (err) => {
  console.error('[QUANTUM_STATE: ERROR_FLOW] PostgreSQL pool error:', err);
});

// Create a Drizzle ORM instance with the connection pool and memory schema
export const db = drizzle(pool, { schema: { ...memorySchema } });

// Function to run migrations
export const runMigrations = async () => {
  try {
    console.log(`[QUANTUM_STATE: DATABASE_FLOW] Starting database migrations for WiltonOS Memory System`);
    
    // Create migrations directory if it doesn't exist
    const migrationsDir = path.join(__dirname, '../../drizzle');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log(`[QUANTUM_STATE: DATABASE_FLOW] Created migrations directory at ${migrationsDir}`);
    }
    
    // Run migrations
    await migrate(db, { migrationsFolder: migrationsDir });
    console.log(`[QUANTUM_STATE: DATABASE_FLOW] Database migrations completed successfully`);
    
    return true;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Database migration error:`, error);
    return false;
  }
};

// Function to test the database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('[QUANTUM_STATE: DATABASE_FLOW] PostgreSQL connection successful - quantum coherence maintained');
    client.release();
    return true;
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] PostgreSQL connection failed:', error);
    return false;
  }
};

// Export pool for direct queries if needed
export { pool };