/**
 * DateTransformer - Handles date serialization/deserialization with circular reference detection
 *
 * This utility ensures proper conversion of Date objects to ISO strings and back,
 * while also safely handling circular references in complex objects.
 *
 * 🔗 EXPLICIT PATIENT REPETITION: This transformer applies the Explicit-Implicit 
 * Quantum Balance principle by explicitly handling date conversion while maintaining
 * the implicit structure of the objects being transformed.
 *
 * BOUNDARY AWARENESS: This implementation explicitly defines the boundary
 * between in-memory date objects and their serialized string form.
 *
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { ChronosDateHandler } from './chronos-date-handler.js';

/**
 * DateTransformer class for handling date serialization and deserialization
 */
export class DateTransformer {
  /**
   * Create a new Date instance with current timestamp
   * Uses ChronosDateHandler to ensure consistent date creation
   * 
   * @returns {Date} A new Date object with the current timestamp
   */
  static createDate(): Date {
    return ChronosDateHandler.createDate();
  }

  /**
   * Serialize an object to JSON with proper date handling
   *
   * @param obj - The object to serialize
   * @returns The serialized JSON string
   */
  static stringify(obj: any): string {
    try {
      // Track seen objects to detect circular references
      const seen = new WeakSet();
      
      return JSON.stringify(obj, (key, value) => {
        // Handle circular references
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular Reference]';
          }
          seen.add(value);
        }
        
        // Convert Date objects to ISO strings
        if (value instanceof Date) {
          return value.toISOString();
        }
        
        return value;
      });
    } catch (error) {
      console.error('Error in DateTransformer.stringify:', error);
      throw new Error(`Failed to serialize object with dates: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Parse a JSON string with proper date handling
   *
   * @param json - The JSON string to parse
   * @returns The parsed object with Date objects restored
   */
  static parse(json: string): any {
    try {
      return JSON.parse(json, (key, value) => {
        // Detect ISO date strings and convert to Date objects
        if (typeof value === 'string' && DateTransformer.isISODateString(value)) {
          return new Date(value);
        }
        
        // Handle other values as is
        return value;
      });
    } catch (error) {
      console.error('Error in DateTransformer.parse:', error);
      throw new Error(`Failed to parse JSON with dates: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Recursively transform dates in an object
   *
   * @param obj - The object to transform
   * @param direction - 'serialize' to convert Dates to strings, 'deserialize' for the reverse
   * @returns The transformed object
   */
  static transformDates(obj: any, direction: 'serialize' | 'deserialize'): any {
    // Handle null/undefined
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    // Handle Date objects directly
    if (obj instanceof Date && direction === 'serialize') {
      return obj.toISOString();
    }
    
    // Handle date strings
    if (typeof obj === 'string' && direction === 'deserialize') {
      // Check for ISO date string format
      if (DateTransformer.isISODateString(obj)) {
        return new Date(obj);
      }
      return obj;
    }
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => DateTransformer.transformDates(item, direction));
    }
    
    // Handle objects
    if (typeof obj === 'object') {
      const result: Record<string, any> = {};
      Object.keys(obj).forEach(key => {
        // Skip circular references marked during serialization
        if (obj[key] === '[Circular Reference]') {
          result[key] = obj[key];
        } else {
          result[key] = DateTransformer.transformDates(obj[key], direction);
        }
      });
      return result;
    }
    
    // Return primitives unchanged
    return obj;
  }

  /**
   * Check if a string is in ISO date format
   *
   * @param str - The string to check
   * @returns True if the string is in ISO date format
   */
  static isISODateString(str: string): boolean {
    // Simple ISO date format check: YYYY-MM-DDTHH:MM:SS.sssZ
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    return isoDateRegex.test(str);
  }
}