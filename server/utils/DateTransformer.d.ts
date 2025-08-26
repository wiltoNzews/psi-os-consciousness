/**
 * Type definitions for DateTransformer.js
 */

export declare class DateTransformer {
  /**
   * Create a new date - entry point for all date creation
   * Uses explicit decohering to maintain quantum balance
   */
  static createDate(source?: string, timepoint?: string | number | Date | object | null): Date;
  
  /**
   * Serialize a date to a string 
   */
  static serializeDate(date: Date | any): string;
  
  /**
   * Deserialize a string to a date
   */
  static deserializeDate(dateStr: string | any): Date | any;
  
  /**
   * Recursively transform dates in an object
   * @param obj The object to transform
   * @param direction 'serialize' to convert Dates to strings, 'deserialize' for the reverse
   */
  static transformDates(obj: any, direction: 'serialize' | 'deserialize'): any;
  
  /**
   * Recursively process an object to handle dates for persistence
   */
  static prepareToPersistence(obj: any): any;

  /**
   * Recursively process an object from persistence to restore dates
   */
  static prepareFromPersistence(obj: any): any;

  /**
   * Serialize an object to JSON with proper date handling
   */
  static stringifyWithDates(obj: any): string;

  /**
   * Parse JSON string with proper date handling 
   */
  static parseWithDates(jsonString: string | any): any;
  
  /**
   * Check if a value is a valid Date object
   */
  static isValidDate(value: any): boolean;
  
  /**
   * Get a safe ISO string (handles invalid dates)
   */
  static safeISOString(value: any): string | null;
}