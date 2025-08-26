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
var DateTransformer = /** @class */ (function () {
    function DateTransformer() {
    }
    /**
     * Create a new Date instance with current timestamp
     * Uses ChronosDateHandler to ensure consistent date creation
     *
     * @returns {Date} A new Date object with the current timestamp
     */
    DateTransformer.createDate = function () {
        return ChronosDateHandler.createDate();
    };
    /**
     * Serialize an object to JSON with proper date handling
     *
     * @param obj - The object to serialize
     * @returns The serialized JSON string
     */
    DateTransformer.stringify = function (obj) {
        try {
            // Track seen objects to detect circular references
            var seen_1 = new WeakSet();
            return JSON.stringify(obj, function (key, value) {
                // Handle circular references
                if (typeof value === 'object' && value !== null) {
                    if (seen_1.has(value)) {
                        return '[Circular Reference]';
                    }
                    seen_1.add(value);
                }
                // Convert Date objects to ISO strings
                if (value instanceof Date) {
                    return value.toISOString();
                }
                return value;
            });
        }
        catch (error) {
            console.error('Error in DateTransformer.stringify:', error);
            throw new Error("Failed to serialize object with dates: ".concat(error instanceof Error ? error.message : String(error)));
        }
    };
    /**
     * Parse a JSON string with proper date handling
     *
     * @param json - The JSON string to parse
     * @returns The parsed object with Date objects restored
     */
    DateTransformer.parse = function (json) {
        try {
            return JSON.parse(json, function (key, value) {
                // Detect ISO date strings and convert to Date objects
                if (typeof value === 'string' && DateTransformer.isISODateString(value)) {
                    return new Date(value);
                }
                // Handle other values as is
                return value;
            });
        }
        catch (error) {
            console.error('Error in DateTransformer.parse:', error);
            throw new Error("Failed to parse JSON with dates: ".concat(error instanceof Error ? error.message : String(error)));
        }
    };
    /**
     * Recursively transform dates in an object
     *
     * @param obj - The object to transform
     * @param direction - 'serialize' to convert Dates to strings, 'deserialize' for the reverse
     * @returns The transformed object
     */
    DateTransformer.transformDates = function (obj, direction) {
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
            return obj.map(function (item) { return DateTransformer.transformDates(item, direction); });
        }
        // Handle objects
        if (typeof obj === 'object') {
            var result_1 = {};
            Object.keys(obj).forEach(function (key) {
                // Skip circular references marked during serialization
                if (obj[key] === '[Circular Reference]') {
                    result_1[key] = obj[key];
                }
                else {
                    result_1[key] = DateTransformer.transformDates(obj[key], direction);
                }
            });
            return result_1;
        }
        // Return primitives unchanged
        return obj;
    };
    /**
     * Check if a string is in ISO date format
     *
     * @param str - The string to check
     * @returns True if the string is in ISO date format
     */
    DateTransformer.isISODateString = function (str) {
        // Simple ISO date format check: YYYY-MM-DDTHH:MM:SS.sssZ
        var isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
        return isoDateRegex.test(str);
    };
    return DateTransformer;
}());
export { DateTransformer };
