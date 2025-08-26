/**
 * Mock Persistence Layer Implementation
 * 
 * This file provides an in-memory implementation of the IPersistenceLayer
 * interface for testing purposes.
 */

/**
 * In-Memory Persistence Layer
 * 
 * A simple in-memory implementation of the persistence layer for testing.
 * This avoids file system access during tests for faster execution.
 */
export class InMemoryPersistenceLayer {
  constructor() {
    this.storage = new Map();
  }

  /**
   * Save data to the in-memory storage
   * @param {string} key - Unique identifier for the data
   * @param {any} data - Data to save
   * @returns {Promise<void>}
   */
  async save(key, data) {
    // Clone and serialize to simulate file I/O
    const serializedData = JSON.parse(JSON.stringify(data, this.dateReplacer));
    this.storage.set(key, serializedData);
  }

  /**
   * Load data from the in-memory storage
   * @param {string} key - Unique identifier for the data
   * @returns {Promise<any | null>} - The data if found, null otherwise
   */
  async load(key) {
    const data = this.storage.get(key);
    if (!data) return null;
    
    // Parse with date revival to simulate file I/O
    return JSON.parse(JSON.stringify(data), this.dateReviver);
  }

  /**
   * Get all keys in the in-memory storage
   * @param {string} [prefix] - Optional prefix to filter keys by
   * @returns {Promise<string[]>} - Array of keys
   */
  async getKeys(prefix) {
    const keys = Array.from(this.storage.keys());
    if (prefix) {
      return keys.filter(k => k.startsWith(prefix));
    }
    return keys;
  }

  /**
   * Delete data from the in-memory storage
   * @param {string} key - Unique identifier for the data
   * @returns {Promise<boolean>} - True if data was deleted, false otherwise
   */
  async delete(key) {
    if (!this.storage.has(key)) return false;
    return this.storage.delete(key);
  }

  /**
   * Reset the in-memory storage
   * Useful for clearing state between tests
   */
  reset() {
    this.storage.clear();
  }

  /**
   * Date replacer function for JSON serialization
   * Converts Date objects to ISO strings with a special prefix
   * @param {string} key - Property key
   * @param {any} value - Property value
   * @returns {any} - Transformed value
   */
  dateReplacer(key, value) {
    if (value instanceof Date) {
      return `__DATE__${value.toISOString()}`;
    }
    return value;
  }

  /**
   * Date reviver function for JSON deserialization
   * Converts specially formatted strings back to Date objects
   * @param {string} key - Property key
   * @param {any} value - Property value
   * @returns {any} - Transformed value
   */
  dateReviver(key, value) {
    if (typeof value === 'string' && value.startsWith('__DATE__')) {
      return new Date(value.slice(8));
    }
    return value;
  }
}