/**
 * ChronosDateHandler
 * 
 * A utility for handling date serialization and deserialization across system boundaries
 * with support for the Explicit-Implicit Quantum Balance principle.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { IDateTransformer } from '../../interfaces/IDateTransformer';

/**
 * Chronos Date Handler implementation of IDateTransformer
 */
export const ChronosDateHandler: IDateTransformer = {
  /**
   * Create a new Date object following the Explicit-Implicit Quantum Balance principle
   * By explicitly choosing the date creation strategy, we avoid recursive definition loops
   * while preserving quantum adaptation capability.
   * 
   * @returns A new Date object representing the current time
   */
  createDate(): Date {
    return new Date();
  },
  
  /**
   * Format a date in ISO format for display purposes
   * 
   * @param date The Date to format
   * @returns The formatted date string
   */
  formatDateISO(date: Date): string {
    return date.toISOString();
  },
  
  /**
   * Transform dates in an object when crossing system boundaries
   * 
   * @param obj The object containing dates to transform
   * @param direction 'serialize' to convert Dates to strings, 'deserialize' for the reverse
   * @returns The transformed object with dates properly handled
   */
  transformDates(obj: any, direction: 'serialize' | 'deserialize'): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    // Handle Date objects directly
    if (obj instanceof Date && direction === 'serialize') {
      return this.serializeDate(obj);
    }
    
    // Handle date strings
    if (typeof obj === 'string' && direction === 'deserialize') {
      // Check for ISO date string format
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
      if (isoDateRegex.test(obj)) {
        return this.deserializeDate(obj);
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
  },
  
  /**
   * Serialize a Date object to a string representation
   * 
   * @param date The Date to serialize
   * @returns The serialized date string in ISO format
   */
  serializeDate(date: Date): string {
    return date.toISOString();
  },
  
  /**
   * Deserialize a string to a Date object
   * 
   * @param dateStr The date string to deserialize
   * @returns The deserialized Date object
   */
  deserializeDate(dateStr: string): Date {
    return new Date(dateStr);
  }
};