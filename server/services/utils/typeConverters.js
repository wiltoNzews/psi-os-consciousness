/**
 * Type Conversion Utilities
 *
 * This module provides functions to ensure type consistency
 * when working with data that may come from different sources
 * with different formats.
 *
 * [QUANTUM_STATE: SIM_FLOW]
 */
/**
 * Ensures a value is a string
 *
 * @param value Any value to convert to string
 * @returns String representation of the value
 */
export function ensureString(value) {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        }
        catch (error) {
            return String(value);
        }
    }
    return String(value);
}
/**
 * Ensures a value is an array of strings
 *
 * @param value Any value to convert to string array
 * @returns Array of strings
 */
export function ensureStringArray(value) {
    if (value === null || value === undefined) {
        return [];
    }
    // Already an array, ensure all elements are strings
    if (Array.isArray(value)) {
        return value.map(ensureString);
    }
    // If it's a string, try to parse it as JSON
    if (typeof value === 'string') {
        try {
            var parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed.map(ensureString);
            }
            // If parsing succeeded but result isn't an array, wrap in array
            return [ensureString(parsed)];
        }
        catch (error) {
            // If parsing failed, treat as a single string
            return [value];
        }
    }
    // For any other type, wrap in array
    return [ensureString(value)];
}
/**
 * Ensures a value is a date
 *
 * @param value Any value to convert to date
 * @returns Date object
 */
export function ensureDate(value) {
    if (value instanceof Date) {
        return value;
    }
    if (typeof value === 'string') {
        var parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
        }
    }
    if (typeof value === 'number') {
        return new Date(value);
    }
    // Default to current date if conversion fails
    return new Date();
}
/**
 * Ensures a value is a number
 *
 * @param value Any value to convert to number
 * @param defaultValue Default value if conversion fails
 * @returns Number representation of the value
 */
export function ensureNumber(value, defaultValue) {
    if (defaultValue === void 0) { defaultValue = 0; }
    if (value === null || value === undefined) {
        return defaultValue;
    }
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        var parsed = parseFloat(value);
        if (!isNaN(parsed)) {
            return parsed;
        }
    }
    return defaultValue;
}
/**
 * Ensures a value is a boolean
 *
 * @param value Any value to convert to boolean
 * @param defaultValue Default value if conversion fails
 * @returns Boolean representation of the value
 */
export function ensureBoolean(value, defaultValue) {
    if (defaultValue === void 0) { defaultValue = false; }
    if (value === null || value === undefined) {
        return defaultValue;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        var lowercased = value.toLowerCase();
        if (lowercased === 'true' || lowercased === 'yes' || lowercased === '1') {
            return true;
        }
        if (lowercased === 'false' || lowercased === 'no' || lowercased === '0') {
            return false;
        }
    }
    if (typeof value === 'number') {
        return value !== 0;
    }
    return defaultValue;
}
/**
 * Ensures a value is an object
 *
 * @param value Any value to convert to object
 * @returns Object representation of the value
 */
export function ensureObject(value) {
    if (value === null || value === undefined) {
        return {};
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string') {
        try {
            var parsed = JSON.parse(value);
            if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed;
            }
        }
        catch (error) {
            // Parsing failed, continue to fallback
        }
    }
    // Fallback: create an object with a single property
    return { value: value };
}
