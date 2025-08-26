/**
 * Date serialization utilities for safely handling date objects in JSON
 * This module provides functions for serializing and deserializing Date objects
 * for safe JSON serialization and deserialization.
 * 
 * This is the CommonJS version specifically for Jest tests.
 */

/**
 * Serialize a date into a string with ISO format and type annotation
 * @param {Date} date The date to serialize
 * @returns {string} A string representation with type information
 */
function serializeDate(date) {
    if (!(date instanceof Date)) return date;
    return `__date:${date.toISOString()}`;
}

/**
 * Deserialize a date string back into a Date object
 * @param {string} str The string to deserialize
 * @returns {Date|string} A Date object or the original string if not a serialized date
 */
function deserializeDate(str) {
    if (typeof str !== 'string' || !str.startsWith('__date:')) return str;
    return new Date(str.substring(7));
}

/**
 * Safely deserialize a date string, handling potential parse errors
 * @param {string} str The string to deserialize
 * @returns {Date|string} A Date object or the original string
 */
function safeDeserializeDate(str) {
    try {
        return deserializeDate(str);
    } catch (e) {
        return str;
    }
}

/**
 * Serialize object entries, recursively handling date objects
 * @param {Object} obj The object to process
 * @returns {Object} A new object with serialized dates
 */
function serializeObjectEntries(obj) {
    if (obj === null || obj === undefined) return obj;
    if (obj instanceof Date) return serializeDate(obj);
    
    if (Array.isArray(obj)) {
        return obj.map(serializeObjectEntries);
    }
    
    if (typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = serializeObjectEntries(value);
        }
        return result;
    }
    
    return obj;
}

/**
 * Deserialize object entries, recursively handling date strings
 * @param {Object} obj The object to process
 * @returns {Object} A new object with deserialized dates
 */
function deserializeObjectEntries(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') return safeDeserializeDate(obj);
    
    if (Array.isArray(obj)) {
        return obj.map(deserializeObjectEntries);
    }
    
    if (typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = deserializeObjectEntries(value);
        }
        return result;
    }
    
    return obj;
}

/**
 * Serialize dates in an object (modifies the object in place)
 * @param {Object} obj The object to modify
 * @returns {Object} The modified object
 */
function serializeDatesInObject(obj) {
    if (obj === null || obj === undefined) return obj;
    
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = serializeObjectEntries(obj[i]);
        }
        return obj;
    }
    
    if (typeof obj === 'object' && !(obj instanceof Date)) {
        for (const [key, value] of Object.entries(obj)) {
            obj[key] = serializeObjectEntries(value);
        }
        return obj;
    }
    
    return serializeObjectEntries(obj);
}

/**
 * Deserialize dates in an object (modifies the object in place)
 * @param {Object} obj The object to modify
 * @returns {Object} The modified object with dates restored
 */
function deserializeDatesInObject(obj) {
    if (obj === null || obj === undefined) return obj;
    
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = deserializeObjectEntries(obj[i]);
        }
        return obj;
    }
    
    if (typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
            obj[key] = deserializeObjectEntries(value);
        }
        return obj;
    }
    
    return deserializeObjectEntries(obj);
}

/**
 * Replacer function for JSON.stringify to handle Date objects
 * @param {string} key The current key being processed
 * @param {any} value The value to process
 * @returns {any} The processed value
 */
function dateReplacer(key, value) {
    return value instanceof Date ? serializeDate(value) : value;
}

/**
 * Reviver function for JSON.parse to handle serialized date strings
 * @param {string} key The current key being processed
 * @param {any} value The value to process
 * @returns {any} The processed value
 */
function dateReviver(key, value) {
    if (typeof value === 'string' && value.startsWith('__date:')) {
        return deserializeDate(value);
    }
    return value;
}

/**
 * Stringify an object with proper date handling
 * @param {Object} obj The object to stringify
 * @returns {string} JSON string with serialized dates
 */
function stringifyWithDates(obj) {
    return JSON.stringify(obj, dateReplacer);
}

/**
 * Parse a JSON string with proper date revival
 * @param {string} json The JSON string to parse
 * @returns {Object} The parsed object with deserialized dates
 */
function parseWithDates(json) {
    return JSON.parse(json, dateReviver);
}

/**
 * Process an object recursively to convert date strings to Date objects
 * @param {Object} obj The object to process
 * @returns {Object} The processed object
 */
function processObjectWithDates(obj) {
    return deserializeObjectEntries(obj);
}

/**
 * Deep clone an object with date preservation
 * @param {Object} obj The object to clone
 * @returns {Object} A deep clone with preserved Date objects
 */
function deepCloneWithDates(obj) {
    return deserializeDatesInObject(serializeDatesInObject(obj));
}

module.exports = {
    // Original functions
    serializeDate,
    deserializeDate,
    safeDeserializeDate,
    serializeObjectEntries,
    deserializeObjectEntries,
    serializeDatesInObject,
    deserializeDatesInObject,
    
    // Functions declared in the .d.ts file
    dateReplacer,
    dateReviver,
    stringifyWithDates,
    parseWithDates,
    processObjectWithDates,
    deepCloneWithDates
};