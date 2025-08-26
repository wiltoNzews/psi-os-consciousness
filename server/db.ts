// BOUNDARY AWARENESS: Storage layer implementation
// This file defines the boundary between application code and storage implementation
// It is kept for compatibility with existing code that imports from db.ts
// We're now using in-memory and file-based storage instead of a SQL database ORM
// See DRIZZLE_REMOVAL_DOCUMENTATION.md for details

import { MemStorage, FileSystemStorage } from './storage.js';
import { MemPersistentContextService } from './services/context/mem-persistent-context-service.js';
import { IPersistentContextService } from './services/context/persistent-context-service.js';

// Create persistent instances of our storage implementations
export const memStorage = new MemStorage();
export const fileStorage = new FileSystemStorage('./data');

// Use FileSystemStorage in production, MemStorage otherwise
// BOUNDARY AWARENESS: This is the critical production/development boundary for storage selection
export const storage = process.env.NODE_ENV === 'production'
    ? fileStorage 
    : memStorage;

// Make sure the console log matches our actual implementation logic
console.log(`Using ${process.env.NODE_ENV === 'production' ? 'FileSystemStorage' : 'MemStorage'} for primary storage`);

// Context service implementation that properly implements the IPersistentContextService interface
// This resolves the architectural mismatch between MemStorage and IPersistentContextService
export const persistentContextService: IPersistentContextService = new MemPersistentContextService();

// Default export for backward compatibility - DEPRECATED
// BOUNDARY AWARENESS: This is the explicit boundary between ORM-based and file-based storage
export const db = {
  // This is a stub for compatibility with existing code that used SQL queries
  // All storage operations are now handled by MemStorage and FileSystemStorage
  query: (text: string, params: any[] = []) => {
    console.error('DEPRECATED: db.query() called but SQL database has been removed');
    console.error('See DRIZZLE_REMOVAL_DOCUMENTATION.md for migration details');
    return Promise.resolve({ rows: [] });
  }
};
