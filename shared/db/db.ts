import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema.js';
import * as dotenv from 'dotenv';

dotenv.config();

// Get database URL from environment or use default value
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/quantum_nexus';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 10000, // Time to wait for a connection to become available
});

// Log the connection status to help with debugging
pool.on('connect', (client) => {
  console.log('New PostgreSQL client connected');
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err);
});

// Create a Drizzle ORM instance with the connection pool and our schema
export const db = drizzle(pool, { schema });

// Function to test the database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connection successful');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    return false;
  }
}

// Export the pool for direct queries if needed
export { pool };