/**
 * DateTransformer
 * 
 * A utility class to handle date serialization and transformation
 * across system boundaries, ensuring consistent date handling.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

/**
 * Standard date format used for serialization
 */
const DATE_ISO_FORMAT = 'ISO';

/**
 * Static class for date handling with enhanced functionality
 */
export class DateTransformer {
  /**
   * Create a new date - entry point for all date creation
   * Uses explicit decohering to maintain quantum balance
   */
  static createDate(source = 'system', timepoint = null) {
    switch (source) {
      case 'fromISO':
        return timepoint ? new Date(timepoint) : new Date();
      case 'fromTimestamp':
        return timepoint ? new Date(parseInt(timepoint)) : new Date();
      case 'fromComponents':
        if (timepoint && typeof timepoint === 'object') {
          const { year, month, day, hours, minutes, seconds, ms } = timepoint;
          return new Date(
            year || new Date().getFullYear(),
            (month || 1) - 1,
            day || 1,
            hours || 0,
            minutes || 0,
            seconds || 0,
            ms || 0
          );
        }
        return new Date();
      case 'system':
      default:
        return new Date();
    }
  }

  /**
   * Transform dates in an object to strings for serialization
   */
  static transformDates(obj, direction) {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    try {
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
        const result = {};
        Object.keys(obj).forEach(key => {
          // Skip circular references
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
    } catch (error) {
      console.error(`Error transforming dates (${direction}):`, error);
      // Return original object in case of error
      return obj;
    }
  }

  /**
   * Convert a Date to a string
   */
  static serializeDate(date) {
    try {
      if (!(date instanceof Date)) {
        return date;
      }
      
      return date.toISOString();
    } catch (error) {
      console.error('Error serializing date:', error);
      return String(date);
    }
  }

  /**
   * Convert a string to a Date
   */
  static deserializeDate(dateStr) {
    if (typeof dateStr !== 'string') {
      return dateStr;
    }
    
    return new Date(dateStr);
  }

  /**
   * Recursively process an object to handle dates for persistence
   */
  static prepareToPersistence(obj) {
    return this.transformDates(obj, 'serialize');
  }

  /**
   * Recursively process an object from persistence to restore dates
   */
  static prepareFromPersistence(obj) {
    return this.transformDates(obj, 'deserialize');
  }

  /**
   * Serialize an object to JSON with proper date handling
   */
  static stringifyWithDates(obj) {
    const processed = this.transformDates(obj, 'serialize');
    const seen = new WeakSet();
    return JSON.stringify(processed, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular Reference]';
        }
        seen.add(value);
      }
      return value;
    });
  }

  /**
   * Parse JSON string with proper date handling 
   */
  static parseWithDates(jsonString) {
    if (typeof jsonString !== 'string') {
      return jsonString;
    }
    
    try {
      const parsed = JSON.parse(jsonString);
      return this.transformDates(parsed, 'deserialize');
    } catch {
      return jsonString;
    }
  }
}