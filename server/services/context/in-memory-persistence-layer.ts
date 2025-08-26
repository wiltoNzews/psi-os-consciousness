/**
 * In-Memory Persistence Layer
 * 
 * A simple in-memory implementation of the persistence layer interface
 * for testing purposes. Stores data in memory without writing to disk.
 * 
 * BOUNDARY CONSCIOUSNESS: This module explicitly handles the boundary
 * between in-memory data and the persistent context service by
 * implementing the same interface as the file system persistence.
 * 
 * [CONTEXT: SIMULATION]
 */

import { IPersistenceLayer } from '../persistent-context-handler.js';

/**
 * Simple persistence layer that stores data in memory
 * This provides much faster testing by avoiding file system operations
 */
export class InMemoryPersistenceLayer implements IPersistenceLayer {
  private storage: Map<string, any>;
  
  /**
   * Constructor
   */
  constructor() {
    this.storage = new Map<string, any>();
    console.log('[α/S+/💾] InMemoryPersistenceLayer initialized');
  }
  
  /**
   * Save data with the specified key
   * 
   * @param key Storage key
   * @param data Data to save
   */
  async save(key: string, data: any): Promise<void> {
    // Deep clone the data to simulate serialization/deserialization
    // This ensures we don't keep references to the original objects
    this.storage.set(key, JSON.parse(JSON.stringify(data)));
  }
  
  /**
   * Load data with the specified key
   * 
   * @param key Storage key
   * @returns Stored data, or null if not found
   */
  async load(key: string): Promise<any | null> {
    const data = this.storage.get(key);
    // Deep clone the data to simulate serialization/deserialization
    // This ensures we don't return references to stored objects
    return data ? JSON.parse(JSON.stringify(data)) : null;
  }
  
  /**
   * Delete data with the specified key
   * 
   * @param key Storage key
   * @returns true if data was deleted, false if not found
   */
  async delete(key: string): Promise<boolean> {
    const existed = this.storage.has(key);
    this.storage.delete(key);
    return existed;
  }
  
  /**
   * Get all keys that start with the specified prefix
   * 
   * @param prefix Key prefix to match (optional)
   * @returns Array of matching keys
   */
  async getKeys(prefix?: string): Promise<string[]> {
    const keys: string[] = [];
    
    // If no prefix is provided, return all keys
    if (!prefix) {
      return Array.from(this.storage.keys());
    }
    
    // Filter keys by prefix
    for (const key of this.storage.keys()) {
      if (key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }
  
  /**
   * Clear all data from storage
   */
  async clear(): Promise<void> {
    this.storage.clear();
  }
  
  /**
   * Get the number of items in storage
   * 
   * @returns Number of stored items
   */
  getSize(): number {
    return this.storage.size;
  }
  
  /**
   * Dump the entire storage contents (for debugging)
   * 
   * @returns Object containing all stored data
   */
  dump(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of this.storage.entries()) {
      result[key] = JSON.parse(JSON.stringify(value));
    }
    return result;
  }
}