/**
 * Date Serialization Utilities Type Definitions
 */

/**
 * JSON replacer function for date serialization
 * @param key Property key
 * @param value Property value
 * @returns Value to serialize
 */
export function dateReplacer(key: string, value: any): any;

/**
 * JSON reviver function for date deserialization
 * @param key Property key
 * @param value Property value
 * @returns Revived value
 */
export function dateReviver(key: string, value: any): any;

/**
 * Serialize an object to JSON with proper date handling
 * @param data Data to serialize
 * @returns JSON string
 */
export function stringifyWithDates(data: any): string;

/**
 * Parse JSON with proper date revival
 * @param json JSON string to parse
 * @returns Parsed data with dates restored
 */
export function parseWithDates(json: string): any;

/**
 * Process an object recursively to convert date strings to Date objects
 * @param obj Object to process
 * @returns Object with dates restored
 */
export function processObjectWithDates(obj: any): any;

/**
 * Deep clone an object with proper date handling
 * @param obj Object to clone
 * @returns Cloned object with dates preserved
 */
export function deepCloneWithDates<T>(obj: T): T;