/**
 * Enhanced Mock Persistence Layer (TypeScript Version)
 *
 * A robust in-memory persistence layer implementation with proper date handling
 * and circular reference detection, following the Explicit-Implicit Quantum Balance principle.
 *
 * 🔗 EXPLICIT PATIENT REPETITION: This persistence layer appropriately handles:
 * - Date serialization and deserialization
 * - Circular reference detection
 * - Standard IPersistenceLayer interface compliance
 *
 * BOUNDARY AWARENESS: This implementation explicitly defines the boundary
 * between in-memory data structures and their persistent form.
 *
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { IPersistenceLayer } from '../../services/persistent-context-handler.js';

// Import DateTransformer from JavaScript file using ES module syntax
import { DateTransformer } from '../../utils/DateTransformer.js';

/**
 * Enhanced Mock Persistence Layer with proper date handling and circular reference detection
 * 
 * @implements {IPersistenceLayer}
 */
export class EnhancedMockPersistenceLayer implements IPersistenceLayer {
  private store: Map<string, string>;

  /**
   * Create a new instance of the enhanced mock persistence layer
   */
  constructor() {
    this.store = new Map();
    console.log('[EnhancedMockPersistenceLayer] Initialized');
  }

  /**
   * Save a value with the specified key
   * 
   * @param {string} key - The unique identifier
   * @param {any} value - The value to save
   * @returns {Promise<void>}
   */
  async save(key: string, value: any): Promise<void> {
    try {
      // Track timing for performance metrics
      const startTime = Date.now();
      
      // Track circular references
      const seen = new WeakSet();
      
      // Serialize with date handling and circular reference detection
      const processedValue = DateTransformer.transformDates(value, 'serialize');
      const serialized = JSON.stringify(processedValue, (key, val) => {
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) {
            return '[Circular Reference]';
          }
          seen.add(val);
        }
        return val;
      });
      
      // Store the serialized value
      this.store.set(key, serialized);
      
      const endTime = Date.now();
      console.log(`[EnhancedMockPersistenceLayer] Saved key "${key}" in ${endTime - startTime}ms`);
    } catch (error) {
      console.error(`[EnhancedMockPersistenceLayer] Error saving data with key ${key}:`, error);
      throw new Error(`Failed to save data with key: ${key}`);
    }
  }

  /**
   * Load a value by key
   * 
   * @param {string} key - The unique identifier
   * @returns {Promise<any|null>} - The stored value or null if not found
   */
  async load(key: string): Promise<any | null> {
    try {
      // Track timing for performance metrics
      const startTime = Date.now();
      
      // Get the serialized value
      const serialized = this.store.get(key);
      
      // Return null if not found
      if (serialized === undefined) {
        return null;
      }
      
      // Deserialize with date handling
      const parsed = JSON.parse(serialized);
      const result = DateTransformer.transformDates(parsed, 'deserialize');
      
      const endTime = Date.now();
      console.log(`[EnhancedMockPersistenceLayer] Loaded key "${key}" in ${endTime - startTime}ms`);
      
      return result;
    } catch (error) {
      console.error(`[EnhancedMockPersistenceLayer] Error loading data with key ${key}:`, error);
      return null;
    }
  }

  /**
   * Alias for load
   * 
   * @param {string} key - The unique identifier
   * @returns {Promise<any|null>} - The stored value or null if not found
   */
  async get(key: string): Promise<any | null> {
    return this.load(key);
  }

  /**
   * Get all keys, optionally filtered by prefix
   * 
   * @param {string} [prefix] - Optional key prefix to filter by
   * @returns {Promise<string[]>} - Array of keys
   */
  async getKeys(prefix?: string): Promise<string[]> {
    try {
      const keys = Array.from(this.store.keys());
      
      // Filter by prefix if provided
      if (prefix) {
        return keys.filter(key => key.startsWith(prefix));
      }
      
      return keys;
    } catch (error) {
      console.error('[EnhancedMockPersistenceLayer] Error getting keys:', error);
      return [];
    }
  }

  /**
   * Delete a value by key
   * 
   * @param {string} key - The unique identifier
   * @returns {Promise<boolean>} - True if the value was deleted, false if not found
   */
  async delete(key: string): Promise<boolean> {
    try {
      // Check if the key exists
      if (!this.store.has(key)) {
        return false;
      }
      
      // Delete the key
      const result = this.store.delete(key);
      console.log(`[EnhancedMockPersistenceLayer] Deleted key "${key}": ${result}`);
      
      return result;
    } catch (error) {
      console.error(`[EnhancedMockPersistenceLayer] Error deleting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all stored values
   * 
   * @returns {Promise<void>}
   */
  async clear(): Promise<void> {
    try {
      this.store.clear();
      console.log('[EnhancedMockPersistenceLayer] Cleared all data');
    } catch (error) {
      console.error('[EnhancedMockPersistenceLayer] Error clearing data:', error);
      throw new Error('Failed to clear data');
    }
  }
}