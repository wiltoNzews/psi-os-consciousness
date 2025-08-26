/**
 * Storage Bridge
 * 
 * This module provides a bridge between the old storage interface and the new
 * storage factory pattern. It creates a singleton instance of the storage
 * that can be imported and used throughout the application.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { IStorage } from './storage.js';
import { createStorage, StorageType } from './storage-factory.js';

// Storage singleton instance
let storageInstance: IStorage | null = null;

/**
 * Initialize the storage system
 * This should be called once during application startup
 */
export async function initStorage(type?: StorageType): Promise<IStorage> {
  if (!storageInstance) {
    storageInstance = await createStorage(type);
    console.log(`[QUANTUM_STATE: SIM_FLOW] Storage initialized with type: ${type || 'auto'}`);
  }
  return storageInstance;
}

/**
 * Get the current storage instance
 * If not initialized, it will initialize with default settings
 */
export async function getStorage(): Promise<IStorage> {
  if (!storageInstance) {
    return initStorage();
  }
  return storageInstance;
}

/**
 * Create a bridge to the old storage interface
 * This exports an object with the same interface as the old storage
 * but delegates to the new storage factory pattern
 */
export const storageBridge = new Proxy({} as IStorage, {
  get(target, prop) {
    return async (...args: any[]) => {
      const storage = await getStorage();
      // @ts-ignore: Dynamic property access
      return storage[prop](...args);
    };
  }
});

// Export default for convenience
export default storageBridge;