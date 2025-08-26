/**
 * Utility functions for handling date serialization and deserialization
 */
/**
 * Safely stringify an object, handling circular references
 * @param obj The object to stringify
 * @returns JSON string
 */
export function safeStringify(obj) {
    var seen = new WeakSet();
    return JSON.stringify(obj, function (key, value) {
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
}
/**
 * Safely parses JSON with date conversion
 * @param jsonString The JSON string to parse
 * @returns The parsed object with dates converted
 */
export function parseJsonWithDates(jsonString) {
    try {
        return JSON.parse(jsonString, dateReviver);
    }
    catch (e) {
        console.error('Error parsing JSON with dates:', e);
        throw e;
    }
}
/**
 * Date helper functions for persistent context operations
 */
/**
 * Ensures a value is a valid Date object
 * @param date Date to validate
 * @returns Valid Date object
 */
export function ensureDate(date) {
    if (date instanceof Date) {
        return date;
    }
    if (date) {
        var parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
        }
    }
    return new Date();
}
/**
 * Reviver function for JSON.parse to convert date strings back to Date objects
 * @param key Property key
 * @param value Property value
 * @returns Converted value
 */
export function dateReviver(key, value) {
    // Check if the value is a string and matches an ISO date pattern
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(value)) {
        return new Date(value);
    }
    // Convert ISO strings back to Dates for known timestamp fields
    if (['timestamp', 'createdAt', 'updatedAt', 'completedAt'].includes(key) && typeof value === 'string') {
        return new Date(value);
    }
    return value;
}
/**
 * Replacer function for JSON.stringify to convert Date objects to ISO strings
 * @param key Property key
 * @param value Property value
 * @returns Converted value
 */
export function dateReplacer(key, value) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    return value;
}
