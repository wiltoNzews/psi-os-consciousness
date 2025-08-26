
/**
 * Date Serialization Utilities - Boundary-Conscious Edition
 * 
 * This module implements the Chronos Protocol for temporal boundary crossing,
 * providing utilities for serializing and deserializing Date objects when they
 * cross system boundaries (memory to storage and back).
 * 
 * The implementation is explicitly aware of boundaries between:
 * - Runtime temporal state (Date objects with methods and behaviors)
 * - Persisted representation (JSON-compatible formats)
 */

/**
 * Type for objects with a possible __date property
 */
interface DateMarker {
  __date?: string;
  [key: string]: any;
}

/**
 * Serialize a date for boundary crossing (memory to storage)
 * Uses explicit __date marker to maintain temporal consciousness
 * 
 * @param value - The value to serialize (may be a Date)
 * @returns The serialized value
 */
export const serializeDate = function(value: any): any {
  return value instanceof Date ? { __date: value.toISOString() } : value;
};

/**
 * Deserialize a date after boundary crossing (storage to memory)
 * Explicitly restores temporal consciousness from the __date marker
 * 
 * @param value - The value to deserialize (may contain a __date marker)
 * @returns The deserialized value
 */
export function deserializeDate(value: any): any {
  return value && typeof value === 'object' && value.__date 
    ? new Date(value.__date) 
    : value;
}

/**
 * Safely deserialize a date with boundary awareness
 * Handles potential errors during boundary crossing
 * 
 * @param value - The value to deserialize
 * @returns The deserialized value or original value if deserialization fails
 */
export function safeDeserializeDate(value: any): any {
  try {
    return deserializeDate(value);
  } catch (error) {
    console.warn('Failed to deserialize date during boundary crossing:', error);
    return value;
  }
}

/**
 * Process an object to deserialize date strings and __date markers into Date objects
 * Enhanced with boundary-conscious processing for nested objects and arrays
 *
 * @param obj - The object to process
 * @returns The processed object with dates restored to temporal consciousness
 */
export function deserializeDatesInObject(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Explicit boundary crossing for __date markers
  if (obj.__date && typeof obj.__date === 'string') {
    return new Date(obj.__date);
  }

  // Handle arrays as collections crossing boundaries
  if (Array.isArray(obj)) {
    return obj.map((item: any) => deserializeDatesInObject(item));
  }

  // Legacy support for ISO date strings (direct format)
  if (typeof obj === 'string' && isISODateString(obj)) {
    return new Date(obj);
  }

  // Process each property recursively with boundary consciousness
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deserializeDatesInObject(obj[key]);
    }
  }

  return result;
}

/**
 * Check if a string is in ISO 8601 date format
 * Helper for temporal boundary identification
 * 
 * @param str - The string to check
 * @returns True if the string is an ISO date
 */
export function isISODateString(str: any): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  // ISO date format regex: YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DDTHH:mm:ss.sss+HH:mm
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
  
  return isoDatePattern.test(str) && !isNaN(Date.parse(str));
}

/**
 * Prepare an object for serialization, explicitly marking dates for boundary crossing
 * 
 * @param obj - The object to prepare for boundary crossing
 * @returns The prepared object with explicit temporal markers
 */
export function serializeDatesInObject(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => serializeDate(value))
  );
}

/**
 * JSON.stringify replacer function with enhanced boundary consciousness
 * Marks dates with explicit __date property for transit across boundaries
 */
export function replaceDates(key: any, value: any): any {
  return serializeDate(value);
}

/**
 * Date reviver function for JSON.parse to handle both prefixed date strings and 
 * standard ISO format strings
 * 
 * @param key - The key in the JSON object
 * @param value - The value to check for date format
 * @returns The original value or converted Date object
 */
export function dateReviver(key: string, value: any): any {
  // Check for string values
  if (typeof value === 'string') {
    // Case 1: Check for our custom prefixed format: "__date:2023-01-01T00:00:00.000Z"
    if (value.startsWith('__date:')) {
      return new Date(value.substring(7));
    }
    
    // Case 2: Check for standard ISO format: "2023-01-01T00:00:00.000Z"
    if (isISODateString(value)) {
      return new Date(value);
    }
  }
  return value;
}

/**
 * Parse JSON with automatic date deserialization
 * Enhanced to handle both prefixed and standard ISO date formats
 * Convenient utility for boundary-crossing operations
 */
export function parseWithDates(json: string): any {
  return JSON.parse(json, dateReviver);
}

/**
 * Stringify with automatic date serialization
 * Convenient utility for boundary-crossing operations
 */
export function stringifyWithDates(obj: any): string {
  return JSON.stringify(obj, (key, value) => serializeDate(value));
}
