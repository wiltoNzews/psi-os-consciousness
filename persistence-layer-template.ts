/**
 * IPersistenceLayer Implementation Template
 * 
 * This template provides a standardized structure for implementing 
 * the IPersistenceLayer interface with proper date handling and error management.
 * 
 * BOUNDARY AWARENESS: This template explicitly defines the boundary between 
 * in-memory operations and persistence storage, following the Explicit-Implicit
 * Quantum Balance principle.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { IPersistenceLayer } from '../server/services/persistence-layer';

/**
 * Interface for transformer that handles date conversion
 */
export interface IDateTransformer {
  transformDates(obj: any, direction: 'serialize' | 'deserialize'): any;
  serializeDate(date: Date): string;
  deserializeDate(dateStr: string): Date;
}

/**
 * Template implementation of the IPersistenceLayer interface
 * 
 * This class can be extended to create concrete persistence implementations
 * using different storage technologies while maintaining consistent behavior.
 */
export abstract class BasePersistenceLayer implements IPersistenceLayer {
  protected dateTransformer: IDateTransformer;
  
  constructor() {
    // Initialize the date transformer with implementation-specific methods
    this.dateTransformer = {
      transformDates: this.transformDates.bind(this),
      serializeDate: this.serializeDate.bind(this),
      deserializeDate: this.deserializeDate.bind(this)
    };
  }
  
  /**
   * Save a value with the specified key
   * 
   * @param key The unique identifier
   * @param value The value to save
   */
  async save(key: string, value: any): Promise<void> {
    try {
      // Explicitly handle the boundary between object and serialized form
      const processedValue = this.prepareForStorage(value);
      await this.writeToStorage(key, processedValue);
    } catch (error) {
      console.error(`Error saving data with key ${key}:`, error);
      throw new Error(`Failed to save data with key: ${key}`);
    }
  }
  
  /**
   * Load a value by key
   * 
   * @param key The unique identifier
   * @returns The stored value or null if not found
   */
  async load(key: string): Promise<any | null> {
    try {
      const rawData = await this.readFromStorage(key);
      if (rawData === null) return null;
      
      // Explicitly handle the boundary between serialized form and object
      return this.prepareFromStorage(rawData);
    } catch (error) {
      console.error(`Error loading data with key ${key}:`, error);
      return null;
    }
  }
  
  /**
   * Alias for load
   */
  async get(key: string): Promise<any | null> {
    return this.load(key);
  }
  
  /**
   * Get all keys, optionally filtered by prefix
   * 
   * @param prefix Optional key prefix to filter by
   * @returns Array of keys
   */
  abstract getKeys(prefix?: string): Promise<string[]>;
  
  /**
   * Delete a value by key
   * 
   * @param key The unique identifier
   * @returns True if the value was deleted, false if not found
   */
  abstract delete(key: string): Promise<boolean>;
  
  /**
   * Clear all stored values
   */
  abstract clear(): Promise<void>;
  
  /**
   * Read raw data from storage
   * 
   * @param key The unique identifier
   * @returns Raw stored data or null if not found
   */
  protected abstract readFromStorage(key: string): Promise<string | null>;
  
  /**
   * Write raw data to storage
   * 
   * @param key The unique identifier
   * @param value The serialized value to write
   */
  protected abstract writeToStorage(key: string, value: string): Promise<void>;
  
  /**
   * Transform an object to a serialized format
   * 
   * @param value The value to prepare for storage
   * @returns Serialized value
   */
  protected prepareForStorage(value: any): string {
    try {
      // Transform dates to strings before serialization
      const processedValue = this.dateTransformer.transformDates(value, 'serialize');
      
      // Use a replacer function to handle circular references
      const seen = new WeakSet();
      return JSON.stringify(processedValue, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular Reference]';
          }
          seen.add(value);
        }
        return value;
      });
    } catch (error) {
      console.error('Error preparing data for storage:', error);
      throw new Error('Failed to prepare data for storage due to serialization error');
    }
  }
  
  /**
   * Transform a serialized format back to an object
   * 
   * @param serialized The serialized value from storage
   * @returns Deserialized object
   */
  protected prepareFromStorage(serialized: string): any {
    try {
      // Parse the JSON string
      const parsed = JSON.parse(serialized);
      
      // Transform string dates back to Date objects
      return this.dateTransformer.transformDates(parsed, 'deserialize');
    } catch (error) {
      console.error('Error preparing data from storage:', error);
      throw new Error('Failed to prepare data from storage due to deserialization error');
    }
  }
  
  /**
   * Recursively transform dates in an object
   * 
   * @param obj The object to transform
   * @param direction 'serialize' to convert Dates to strings, 'deserialize' for the reverse
   * @returns The transformed object
   */
  protected transformDates(obj: any, direction: 'serialize' | 'deserialize'): any {
    // Implement date transformation logic similar to EnhancedMockPersistenceLayer
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    // Handle Date objects directly
    if (obj instanceof Date && direction === 'serialize') {
      return this.dateTransformer.serializeDate(obj);
    }
    
    // Handle date strings
    if (typeof obj === 'string' && direction === 'deserialize') {
      // Check for ISO date string format (simplified check)
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
      if (isoDateRegex.test(obj)) {
        return this.dateTransformer.deserializeDate(obj);
      }
      return obj;
    }
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformDates(item, direction));
    }
    
    // Handle objects
    if (typeof obj === 'object') {
      const result: any = {};
      Object.keys(obj).forEach(key => {
        // Skip circular references marked during serialization
        if (obj[key] === '[Circular Reference]') {
          result[key] = obj[key];
        } else {
          result[key] = this.transformDates(obj[key], direction);
        }
      });
      return result;
    }
    
    // Return primitives unchanged
    return obj;
  }
  
  /**
   * Convert a Date to a string
   * 
   * @param date The Date to serialize
   * @returns The serialized date string
   */
  protected serializeDate(date: Date): string {
    return date.toISOString();
  }
  
  /**
   * Convert a string to a Date
   * 
   * @param dateStr The date string to deserialize
   * @returns The deserialized Date object
   */
  protected deserializeDate(dateStr: string): Date {
    return new Date(dateStr);
  }
}

/**
 * Example implementation for in-memory storage
 */
export class MemoryPersistenceLayer extends BasePersistenceLayer {
  private data: Map<string, string>;
  
  constructor() {
    super();
    this.data = new Map<string, string>();
  }
  
  async getKeys(prefix?: string): Promise<string[]> {
    const keys = Array.from(this.data.keys());
    if (prefix) {
      return keys.filter(key => key.startsWith(prefix));
    }
    return keys;
  }
  
  async delete(key: string): Promise<boolean> {
    const existed = this.data.has(key);
    this.data.delete(key);
    return existed;
  }
  
  async clear(): Promise<void> {
    this.data.clear();
  }
  
  protected async readFromStorage(key: string): Promise<string | null> {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  
  protected async writeToStorage(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }
}

/**
 * Example implementation for file system storage
 */
export class FileSystemPersistenceLayer extends BasePersistenceLayer {
  private basePath: string;
  
  constructor(basePath: string) {
    super();
    this.basePath = basePath;
  }
  
  async getKeys(prefix?: string): Promise<string[]> {
    // Implementation would use fs.readdir to list files in the directory
    // and filter by prefix if specified
    throw new Error('Method not implemented');
  }
  
  async delete(key: string): Promise<boolean> {
    // Implementation would use fs.unlink to delete the file
    throw new Error('Method not implemented');
  }
  
  async clear(): Promise<void> {
    // Implementation would delete all files in the base directory
    throw new Error('Method not implemented');
  }
  
  protected async readFromStorage(key: string): Promise<string | null> {
    // Implementation would use fs.readFile to read the file
    throw new Error('Method not implemented');
  }
  
  protected async writeToStorage(key: string, value: string): Promise<void> {
    // Implementation would use fs.writeFile to write the file
    throw new Error('Method not implemented');
  }
}