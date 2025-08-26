/**
 * MetaCognitiveEventUtility
 *
 * This service provides utility functions for processing meta-cognitive events,
 * ensuring consistent handling, proper date transformations, and adherence to
 * the Explicit-Implicit Quantum Balance principle.
 *
 * BOUNDARY AWARENESS: This module explicitly defines the boundary between
 * raw event processing and standardized event transformation, providing
 * utility methods for handling events consistently across the system.
 *
 * [QUANTUM_STATE: SIM_FLOW]
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { DateTransformer } from './DateTransformer.js';
import { MetaEventType } from './MetaCognitiveEventBuilder.js';
/**
 * Validates a MetaCognitiveEvent to ensure it has all required properties
 * and proper formatting according to system standards.
 *
 * @param event The event to validate
 * @returns The validated event (possibly with fixes applied)
 * @throws Error if the event cannot be validated
 */
export function ensureValidMetaCognitiveEvent(event) {
    // Create a copy to avoid modifying the original
    var validatedEvent = __assign({}, event);
    // Check required fields
    if (!validatedEvent.id) {
        throw new Error('MetaCognitiveEvent must have an id');
    }
    if (!validatedEvent.type) {
        // If only eventType exists (legacy format), convert it
        if (validatedEvent.eventType) {
            validatedEvent.type = validatedEvent.eventType;
            delete validatedEvent.eventType;
        }
        else {
            throw new Error('MetaCognitiveEvent must have a type');
        }
    }
    // Check and normalize createdAt
    if (!validatedEvent.createdAt) {
        // If only timestamp exists (legacy format), convert it
        if (validatedEvent.timestamp) {
            validatedEvent.createdAt = validatedEvent.timestamp;
            delete validatedEvent.timestamp;
        }
        else {
            // Default to current time if missing
            validatedEvent.createdAt = DateTransformer.createDate();
        }
    }
    // Ensure createdAt is properly formatted
    if (validatedEvent.createdAt instanceof Date) {
        validatedEvent.createdAt = DateTransformer.serializeDate(validatedEvent.createdAt);
    }
    // Normalize confidenceLevel → confidence if needed
    if (validatedEvent.confidenceLevel !== undefined && validatedEvent.confidence === undefined) {
        validatedEvent.confidence = validatedEvent.confidenceLevel;
        delete validatedEvent.confidenceLevel;
    }
    // Ensure array fields are arrays
    if (validatedEvent.relatedEvents && !Array.isArray(validatedEvent.relatedEvents)) {
        validatedEvent.relatedEvents = [validatedEvent.relatedEvents];
    }
    // Ensure object fields are objects
    if (validatedEvent.sourceContext && typeof validatedEvent.sourceContext !== 'object') {
        try {
            validatedEvent.sourceContext = JSON.parse(validatedEvent.sourceContext);
        }
        catch (_a) {
            validatedEvent.sourceContext = { source: String(validatedEvent.sourceContext) };
        }
    }
    if (validatedEvent.details && typeof validatedEvent.details !== 'object') {
        try {
            validatedEvent.details = JSON.parse(validatedEvent.details);
        }
        catch (_b) {
            validatedEvent.details = { value: validatedEvent.details };
        }
    }
    if (validatedEvent.metadata && typeof validatedEvent.metadata !== 'object') {
        try {
            validatedEvent.metadata = JSON.parse(validatedEvent.metadata);
        }
        catch (_c) {
            validatedEvent.metadata = { value: validatedEvent.metadata };
        }
    }
    return validatedEvent;
}
/**
 * MetaCognitiveEventUtility provides utility methods for processing
 * meta-cognitive events consistently across the system
 */
var MetaCognitiveEventUtility = /** @class */ (function () {
    function MetaCognitiveEventUtility() {
    }
    /**
     * Normalize a meta-cognitive event's properties to ensure consistency
     * @param event Meta-cognitive event to normalize
     * @param options Normalization options
     * @returns Normalized meta-cognitive event
     */
    MetaCognitiveEventUtility.normalizeEvent = function (event, options) {
        if (options === void 0) { options = {}; }
        var normalizedEvent = __assign({}, event);
        // Set default options
        var normalizePropertyNames = options.normalizePropertyNames !== false;
        var normalizeDates = options.normalizeDates !== false;
        var normalizeRelatedEvents = options.normalizeRelatedEvents !== false;
        var normalizeSourceContext = options.normalizeSourceContext !== false;
        // Normalize property names
        if (normalizePropertyNames) {
            // Rename 'eventType' to 'type' if needed
            if ('eventType' in normalizedEvent && !('type' in normalizedEvent)) {
                normalizedEvent.type = normalizedEvent.eventType;
                delete normalizedEvent.eventType;
            }
            // Rename 'timestamp' to 'createdAt' if needed
            if ('timestamp' in normalizedEvent && !('createdAt' in normalizedEvent)) {
                normalizedEvent.createdAt = normalizedEvent.timestamp;
                delete normalizedEvent.timestamp;
            }
            // Rename 'confidenceLevel' to 'confidence' if needed
            if ('confidenceLevel' in normalizedEvent && !('confidence' in normalizedEvent)) {
                normalizedEvent.confidence = normalizedEvent.confidenceLevel;
                delete normalizedEvent.confidenceLevel;
            }
        }
        // Normalize dates
        if (normalizeDates) {
            // Ensure createdAt is a Date object
            if (normalizedEvent.createdAt) {
                if (typeof normalizedEvent.createdAt === 'string') {
                    normalizedEvent.createdAt = DateTransformer.deserializeDate(normalizedEvent.createdAt);
                }
                else if (!(normalizedEvent.createdAt instanceof Date)) {
                    normalizedEvent.createdAt = DateTransformer.createDate();
                }
            }
            else {
                normalizedEvent.createdAt = DateTransformer.createDate();
            }
        }
        // Normalize relatedEvents
        if (normalizeRelatedEvents) {
            // Ensure relatedEvents is an array
            if (!normalizedEvent.relatedEvents) {
                normalizedEvent.relatedEvents = [];
            }
            else if (typeof normalizedEvent.relatedEvents === 'string') {
                // If it's a comma-separated string, split it
                normalizedEvent.relatedEvents = normalizedEvent.relatedEvents.split(',').map(function (id) { return id.trim(); });
            }
            else if (!Array.isArray(normalizedEvent.relatedEvents)) {
                // If it's not an array, convert it
                normalizedEvent.relatedEvents = [normalizedEvent.relatedEvents];
            }
        }
        // Normalize sourceContext
        if (normalizeSourceContext) {
            // Ensure sourceContext is a record
            if (!normalizedEvent.sourceContext) {
                normalizedEvent.sourceContext = {};
            }
            else if (typeof normalizedEvent.sourceContext === 'string') {
                try {
                    // If it's a JSON string, parse it
                    normalizedEvent.sourceContext = JSON.parse(normalizedEvent.sourceContext);
                }
                catch (_a) {
                    // If parsing fails, create a simple object
                    normalizedEvent.sourceContext = { source: normalizedEvent.sourceContext };
                }
            }
        }
        // Apply additional property normalizations
        if (options.additionalProperties) {
            for (var _i = 0, _b = Object.entries(options.additionalProperties); _i < _b.length; _i++) {
                var _c = _b[_i], property = _c[0], transformFn = _c[1];
                if (property in normalizedEvent) {
                    normalizedEvent[property] = transformFn(normalizedEvent[property]);
                }
            }
        }
        return normalizedEvent;
    };
    /**
     * Filter an array of meta-cognitive events based on the provided options
     * @param events Array of meta-cognitive events
     * @param options Filter options
     * @returns Filtered array of meta-cognitive events
     */
    MetaCognitiveEventUtility.filterEvents = function (events, options) {
        if (options === void 0) { options = {}; }
        var filteredEvents = __spreadArray([], events, true);
        // Filter by event type
        if (options.includeTypes && options.includeTypes.length > 0) {
            filteredEvents = filteredEvents.filter(function (event) { var _a; return (_a = options.includeTypes) === null || _a === void 0 ? void 0 : _a.includes(event.type); });
        }
        if (options.excludeTypes && options.excludeTypes.length > 0) {
            filteredEvents = filteredEvents.filter(function (event) { var _a; return !((_a = options.excludeTypes) === null || _a === void 0 ? void 0 : _a.includes(event.type)); });
        }
        // Filter by importance
        if (options.minImportance !== undefined) {
            filteredEvents = filteredEvents.filter(function (event) {
                return event.importance !== undefined && event.importance >= options.minImportance;
            });
        }
        if (options.maxImportance !== undefined) {
            filteredEvents = filteredEvents.filter(function (event) {
                return event.importance !== undefined && event.importance <= options.maxImportance;
            });
        }
        // Filter by confidence
        if (options.minConfidence !== undefined) {
            filteredEvents = filteredEvents.filter(function (event) {
                return event.confidence !== undefined && event.confidence >= options.minConfidence;
            });
        }
        if (options.maxConfidence !== undefined) {
            filteredEvents = filteredEvents.filter(function (event) {
                return event.confidence !== undefined && event.confidence <= options.maxConfidence;
            });
        }
        // Filter by date range
        if (options.startDate) {
            filteredEvents = filteredEvents.filter(function (event) {
                return event.createdAt !== undefined && event.createdAt >= options.startDate;
            });
        }
        if (options.endDate) {
            filteredEvents = filteredEvents.filter(function (event) {
                return event.createdAt !== undefined && event.createdAt <= options.endDate;
            });
        }
        // Filter by node IDs
        if (options.nodeIds && options.nodeIds.length > 0) {
            filteredEvents = filteredEvents.filter(function (event) { var _a; return event.nodeId !== undefined && ((_a = options.nodeIds) === null || _a === void 0 ? void 0 : _a.includes(event.nodeId)); });
        }
        // Apply limit
        if (options.limit !== undefined && options.limit > 0) {
            filteredEvents = filteredEvents.slice(0, options.limit);
        }
        return filteredEvents;
    };
    /**
     * Enrich a meta-cognitive event with additional information
     * @param event Meta-cognitive event to enrich
     * @param additionalData Additional data to add to the event
     * @returns Enriched meta-cognitive event
     */
    MetaCognitiveEventUtility.enrichEvent = function (event, additionalData) {
        // Create a copy of the event
        var enrichedEvent = __assign({}, event);
        // Add additional data to the event details
        if (!enrichedEvent.details) {
            enrichedEvent.details = {};
        }
        enrichedEvent.details = __assign(__assign({}, enrichedEvent.details), additionalData);
        return enrichedEvent;
    };
    /**
     * Merge multiple meta-cognitive events into a single event
     * @param events Array of meta-cognitive events to merge
     * @param mergeStrategy Strategy for merging conflicting values ('first', 'last', 'average')
     * @returns Merged meta-cognitive event
     */
    MetaCognitiveEventUtility.mergeEvents = function (events, mergeStrategy) {
        if (mergeStrategy === void 0) { mergeStrategy = 'last'; }
        if (events.length === 0) {
            throw new Error('Cannot merge empty array of events');
        }
        if (events.length === 1) {
            return events[0];
        }
        // Initialize the merged event with the first event's properties
        var mergedEvent = __assign({}, events[0]);
        // Set of properties to merge specially
        var specialProperties = ['details', 'relatedEvents', 'sourceContext', 'metadata'];
        // Set of numeric properties for averaging
        var numericProperties = ['importance', 'confidence'];
        // Merge the remaining events
        for (var i = 1; i < events.length; i++) {
            var event_1 = events[i];
            // Merge special properties
            for (var _i = 0, specialProperties_1 = specialProperties; _i < specialProperties_1.length; _i++) {
                var prop = specialProperties_1[_i];
                if (event_1[prop]) {
                    if (!mergedEvent[prop]) {
                        mergedEvent[prop] = {};
                    }
                    if (Array.isArray(event_1[prop])) {
                        // If it's an array, concatenate and remove duplicates
                        if (Array.isArray(mergedEvent[prop])) {
                            mergedEvent[prop] = __spreadArray([], new Set(__spreadArray(__spreadArray([], mergedEvent[prop], true), event_1[prop], true)), true);
                        }
                        else {
                            mergedEvent[prop] = event_1[prop];
                        }
                    }
                    else if (typeof event_1[prop] === 'object') {
                        // If it's an object, merge recursively
                        mergedEvent[prop] = __assign(__assign({}, mergedEvent[prop]), event_1[prop]);
                    }
                }
            }
            // For numeric properties, apply the merge strategy
            for (var _a = 0, numericProperties_1 = numericProperties; _a < numericProperties_1.length; _a++) {
                var prop = numericProperties_1[_a];
                if (event_1[prop] !== undefined) {
                    if (mergeStrategy === 'first') {
                        // Keep the first value, do nothing
                    }
                    else if (mergeStrategy === 'last') {
                        // Use the last value
                        mergedEvent[prop] = event_1[prop];
                    }
                    else if (mergeStrategy === 'average' && typeof event_1[prop] === 'number') {
                        // Calculate the running average
                        if (typeof mergedEvent[prop] !== 'number') {
                            mergedEvent[prop] = event_1[prop];
                        }
                        else {
                            mergedEvent[prop] = ((mergedEvent[prop] * i) + event_1[prop]) / (i + 1);
                        }
                    }
                }
            }
            // For createdAt, use the earliest or latest date based on merge strategy
            if (event_1.createdAt) {
                if (mergeStrategy === 'first') {
                    // Keep the first date, do nothing
                }
                else if (mergeStrategy === 'last' || mergeStrategy === 'average') {
                    // Use the latest date (for 'average' still use latest for dates)
                    var eventDate = event_1.createdAt instanceof Date ? event_1.createdAt : new Date(event_1.createdAt);
                    var mergedDate = mergedEvent.createdAt instanceof Date ? mergedEvent.createdAt : new Date(mergedEvent.createdAt);
                    if (eventDate > mergedDate) {
                        mergedEvent.createdAt = eventDate;
                    }
                }
            }
            // Handle description: concatenate with delimiters
            if (event_1.description) {
                if (!mergedEvent.description) {
                    mergedEvent.description = event_1.description;
                }
                else {
                    mergedEvent.description = "".concat(mergedEvent.description, "; ").concat(event_1.description);
                }
            }
        }
        return mergedEvent;
    };
    /**
     * Aggregate meta-cognitive events based on the provided options
     * @param events Array of meta-cognitive events
     * @param options Aggregation options
     * @returns Aggregated data
     */
    MetaCognitiveEventUtility.aggregateEvents = function (events, options) {
        var groupBy = options.groupBy, aggregation = options.aggregation, aggregateField = options.aggregateField;
        // Check if aggregateField is provided for non-count aggregations
        if (aggregation !== 'count' && !aggregateField) {
            throw new Error("aggregateField is required for ".concat(aggregation, " aggregation"));
        }
        // Group events by the specified field
        var groupedEvents = {};
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_2 = events_1[_i];
            var groupValue = String(event_2[groupBy] || 'undefined');
            if (!groupedEvents[groupValue]) {
                groupedEvents[groupValue] = [];
            }
            groupedEvents[groupValue].push(event_2);
        }
        // Aggregate the grouped events
        var result = {};
        for (var _a = 0, _b = Object.entries(groupedEvents); _a < _b.length; _a++) {
            var _c = _b[_a], groupValue = _c[0], groupEvents = _c[1];
            if (aggregation === 'count') {
                result[groupValue] = groupEvents.length;
            }
            else {
                // Extract values from the specified field
                var values = groupEvents
                    .map(function (event) { return event[aggregateField]; })
                    .filter(function (value) { return value !== undefined && typeof value === 'number'; });
                if (values.length === 0) {
                    result[groupValue] = null;
                    continue;
                }
                // Calculate the aggregation
                switch (aggregation) {
                    case 'avg':
                        result[groupValue] = values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
                        break;
                    case 'sum':
                        result[groupValue] = values.reduce(function (sum, value) { return sum + value; }, 0);
                        break;
                    case 'min':
                        result[groupValue] = Math.min.apply(Math, values);
                        break;
                    case 'max':
                        result[groupValue] = Math.max.apply(Math, values);
                        break;
                }
            }
        }
        return result;
    };
    /**
     * Convert a legacy event object to a standardized meta-cognitive event
     * @param legacyEvent Legacy event object
     * @returns Standardized meta-cognitive event
     */
    MetaCognitiveEventUtility.convertLegacyEvent = function (legacyEvent) {
        // Normalize the event properties first
        var normalizedEvent = this.normalizeEvent(legacyEvent);
        // If the event already has a type property, use it
        // Otherwise, try to derive it from other properties
        var eventType = normalizedEvent.type;
        if (!eventType) {
            if (legacyEvent.eventType) {
                eventType = legacyEvent.eventType;
            }
            else if (legacyEvent.type) {
                eventType = legacyEvent.type;
            }
            else if (legacyEvent.category) {
                eventType = "".concat(legacyEvent.category, ":").concat(legacyEvent.action || 'EVENT');
            }
            else {
                eventType = MetaEventType.SYSTEM_ADAPTATION;
            }
        }
        // Construct the converted event
        return {
            id: normalizedEvent.id || legacyEvent.id || legacyEvent.eventId || legacyEvent.recordId || legacyEvent._id,
            type: eventType,
            createdAt: normalizedEvent.createdAt,
            description: normalizedEvent.description || legacyEvent.message || legacyEvent.text || legacyEvent.content,
            details: normalizedEvent.details || legacyEvent.data || legacyEvent.payload || legacyEvent.body || {},
            importance: normalizedEvent.importance !== undefined ? normalizedEvent.importance : 0.5,
            confidence: normalizedEvent.confidence !== undefined ? normalizedEvent.confidence : 0.8,
            relatedEvents: normalizedEvent.relatedEvents || [],
            sourceContext: normalizedEvent.sourceContext || { source: legacyEvent.source || legacyEvent.origin || 'system' },
            nodeId: normalizedEvent.nodeId || legacyEvent.nodeId || legacyEvent.qrnId,
            metadata: normalizedEvent.metadata || legacyEvent.meta || legacyEvent.metadata || {},
        };
    };
    /**
     * Batch convert multiple legacy events to standardized meta-cognitive events
     * @param legacyEvents Array of legacy event objects
     * @returns Array of standardized meta-cognitive events
     */
    MetaCognitiveEventUtility.batchConvertLegacyEvents = function (legacyEvents) {
        var _this = this;
        return legacyEvents.map(function (event) { return _this.convertLegacyEvent(event); });
    };
    /**
     * Serialize a meta-cognitive event for storage or transmission
     * @param event Meta-cognitive event to serialize
     * @returns Serialized meta-cognitive event
     */
    MetaCognitiveEventUtility.serializeEvent = function (event) {
        return DateTransformer.toPersistence(event);
    };
    /**
     * Deserialize a meta-cognitive event from storage or transmission
     * @param serializedEvent Serialized meta-cognitive event
     * @returns Deserialized meta-cognitive event
     */
    MetaCognitiveEventUtility.deserializeEvent = function (serializedEvent) {
        return DateTransformer.fromPersistence(serializedEvent);
    };
    /**
     * Format a meta-cognitive event for display or logging
     * @param event Meta-cognitive event to format
     * @param format Output format ('simple' or 'detailed')
     * @returns Formatted event string
     */
    MetaCognitiveEventUtility.formatEventForDisplay = function (event, format) {
        if (format === void 0) { format = 'simple'; }
        if (format === 'simple') {
            var timestamp = event.createdAt instanceof Date
                ? event.createdAt.toISOString()
                : new Date(event.createdAt).toISOString();
            return "[".concat(timestamp, "] ").concat(event.type, ": ").concat(event.description || 'No description');
        }
        else {
            return JSON.stringify(event, function (key, value) {
                if (value instanceof Date) {
                    return value.toISOString();
                }
                return value;
            }, 2);
        }
    };
    return MetaCognitiveEventUtility;
}());
export { MetaCognitiveEventUtility };
