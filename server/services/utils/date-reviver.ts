/**
 * Date handling utilities for persistence layer
 * 
 * This module provides functions for handling date serialization and deserialization
 * to ensure consistent handling of Date objects across the persistence layer.
 */

/**
 * ISO 8601 date regex pattern for detecting serialized dates
 * This matches ISO format date strings like "2023-01-01T12:00:00.000Z"
 */
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

/**
 * Date reviver function to convert date strings back to Date objects
 * Enhanced to handle both prefixed date formats and standard ISO format
 * @param key - The property key
 * @param value - The property value
 * @returns The converted value or original value
 */
export function dateReviver(key: string, value: any): any {
  // Check for string values
  if (typeof value === 'string') {
    // Case 1: Check for our custom prefixed format: "__date:2023-01-01T00:00:00.000Z"
    if (value.startsWith('__date:')) {
      return new Date(value.substring(7));
    }
    
    // Case 2: Check for standard ISO format: "2023-01-01T00:00:00.000Z"
    if (ISO_DATE_PATTERN.test(value)) {
      return new Date(value);
    }
  }
  return value;
}

/**
 * Process an object by parsing it as JSON with date conversion
 * @param data Any object that might contain date strings
 * @returns The processed object with Date objects properly restored
 */
export function processWithDateReviver<T = any>(data: any): T {
  if (!data) return data as T;
  
  try {
    // If data is already serialized as string, just parse it
    if (typeof data === 'string') {
      return JSON.parse(data, dateReviver) as T;
    }
    
    // Otherwise serialize and deserialize to process all nested properties
    const serialized = JSON.stringify(data);
    return JSON.parse(serialized, dateReviver) as T;
  } catch (error) {
    console.error('Error processing data with date reviver:', error);
    // Return original data if processing fails
    return data as T;
  }
}

/**
 * Safe stringify function that handles circular references
 * @param data The data to stringify
 * @returns JSON string or empty string on error
 */
export function safeStringify(data: any): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error in safeStringify:', error);
    return '';
  }
}

// CommonJS compatibility for Jest tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ISO_DATE_PATTERN,
    dateReviver,
    processWithDateReviver,
    safeStringify
  };
}