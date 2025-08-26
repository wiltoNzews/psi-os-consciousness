/**
 * Storage Factory
 * 
 * This module provides a factory pattern for creating storage instances.
 * It enables the application to switch between different storage implementations
 * (file-based, in-memory, database) without changing the application code.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { IStorage } from './storage.js';
import { FileSystemStorage } from './storage.js';
import { PostgreSQLStorage } from './db-storage.js';
import { testConnection } from '../shared/db/db.js';

// Storage implementation types
export enum StorageType {
  FILE_SYSTEM = 'file_system',
  POSTGRESQL = 'postgresql',
  MEMORY = 'memory'
}

/**
 * Creates and returns a storage instance based on the specified type.
 * If no type is specified, it defaults to PostgreSQL if available, then file system.
 */
export async function createStorage(type?: StorageType): Promise<IStorage> {
  // If no type is specified, determine best available
  if (!type) {
    // Try PostgreSQL first if available
    const dbAvailable = await testConnection();
    if (dbAvailable) {
      console.log('✅ Using PostgreSQL storage - database connection successful');
      return new PostgreSQLStorage();
    } else {
      console.log('⚠️ PostgreSQL connection failed, falling back to file system storage');
      return new FileSystemStorage();
    }
  }
  
  // Create specific storage type
  switch (type) {
    case StorageType.POSTGRESQL:
      const dbAvailable = await testConnection();
      if (!dbAvailable) {
        throw new Error('PostgreSQL database is not available');
      }
      return new PostgreSQLStorage();
      
    case StorageType.FILE_SYSTEM:
      return new FileSystemStorage();
      
    case StorageType.MEMORY:
      // In the future we could implement an in-memory storage
      throw new Error('Memory storage not implemented yet');
      
    default:
      return new FileSystemStorage();
  }
}

// Export a factory function that creates a storage instance
export default createStorage;