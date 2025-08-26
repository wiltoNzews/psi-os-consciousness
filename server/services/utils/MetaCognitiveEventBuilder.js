/**
 * MetaCognitiveEventBuilder
 *
 * Builder pattern implementation for creating standardized meta-cognitive events.
 * This centralized utility ensures consistent event creation across the system.
 *
 * BOUNDARY AWARENESS: This module explicitly defines the boundary between
 * raw event data and the standardized MetaCognitiveEvent interface, ensuring
 * proper formatting and validation.
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
import { v4 as uuidv4 } from 'uuid';
import { DateTransformer } from './DateTransformer.js';
/**
 * Standard meta-cognitive event types
 */
export var MetaEventType;
(function (MetaEventType) {
    // System-level events
    MetaEventType["SYSTEM_STARTUP"] = "system:startup";
    MetaEventType["SYSTEM_SHUTDOWN"] = "system:shutdown";
    MetaEventType["SYSTEM_ERROR"] = "system:error";
    MetaEventType["SYSTEM_WARNING"] = "system:warning";
    MetaEventType["SYSTEM_INFO"] = "system:info";
    MetaEventType["SYSTEM_ADAPTATION"] = "system:adaptation";
    // Task-related events
    MetaEventType["TASK_CREATED"] = "task:created";
    MetaEventType["TASK_UPDATED"] = "task:updated";
    MetaEventType["TASK_COMPLETED"] = "task:completed";
    MetaEventType["TASK_FAILED"] = "task:failed";
    MetaEventType["TASK_ALLOCATED"] = "task:allocated";
    // Chunk-related events
    MetaEventType["CHUNK_CREATED"] = "chunk:created";
    MetaEventType["CHUNK_PROCESSED"] = "chunk:processed";
    MetaEventType["CHUNK_MERGED"] = "chunk:merged";
    // Neural events
    MetaEventType["NEURAL_PATHWAY_CREATED"] = "neural:pathway_created";
    MetaEventType["NEURAL_PATHWAY_STRENGTHENED"] = "neural:pathway_strengthened";
    MetaEventType["NEURAL_PATHWAY_WEAKENED"] = "neural:pathway_weakened";
    // Quantum-related events
    MetaEventType["QUANTUM_DECOHERENCE"] = "quantum:decoherence";
    MetaEventType["QUANTUM_ENTANGLEMENT"] = "quantum:entanglement";
    MetaEventType["QUANTUM_SUPERPOSITION"] = "quantum:superposition";
    // Feedback events
    MetaEventType["FEEDBACK_RECEIVED"] = "feedback:received";
    MetaEventType["FEEDBACK_PROCESSED"] = "feedback:processed";
    // Insight events
    MetaEventType["INSIGHT_DISCOVERED"] = "insight:discovered";
    MetaEventType["INSIGHT_APPLIED"] = "insight:applied";
    // Meta-cognitive events
    MetaEventType["META_REFLECTION"] = "meta:reflection";
    MetaEventType["META_ADAPTATION"] = "meta:adaptation";
    MetaEventType["META_LEARNING"] = "meta:learning";
})(MetaEventType || (MetaEventType = {}));
/**
 * Builder class for creating MetaCognitiveEvent objects
 */
var MetaCognitiveEventBuilder = /** @class */ (function () {
    function MetaCognitiveEventBuilder() {
        this.event = {
            id: uuidv4(),
            createdAt: DateTransformer.createDate(),
            confidence: 1.0,
            importance: 0.5
        };
    }
    /**
     * Create a new MetaCognitiveEventBuilder instance
     */
    MetaCognitiveEventBuilder.create = function (initialData) {
        if (initialData === void 0) { initialData = {}; }
        var builder = new MetaCognitiveEventBuilder();
        // Apply initial data if provided
        Object.entries(initialData).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            // Use type-safe property assignment
            switch (key) {
                case 'id':
                    builder.withId(value);
                    break;
                case 'type':
                    builder.withType(value);
                    break;
                case 'nodeId':
                    builder.withNodeId(value);
                    break;
                case 'description':
                    builder.withDescription(value);
                    break;
                case 'createdAt':
                    builder.withCreatedAt(value);
                    break;
                case 'confidence':
                    builder.withConfidence(value);
                    break;
                case 'importance':
                    builder.withImportance(value);
                    break;
                case 'relatedEvents':
                    builder.withRelatedEvents(value);
                    break;
                case 'sourceContext':
                    builder.withSourceContext(value);
                    break;
                case 'outcome':
                    builder.withOutcome(value);
                    break;
                case 'details':
                    builder.withDetails(value);
                    break;
                case 'metadata':
                    builder.withMetadata(value);
                    break;
                default:
                    // Skip unknown properties
                    console.warn("Ignoring unknown MetaCognitiveEvent property: ".concat(key));
            }
        });
        return builder;
    };
    /**
     * Create event from source and operation
     */
    MetaCognitiveEventBuilder.fromSourceOperation = function (source, operation, metadata) {
        if (metadata === void 0) { metadata = {}; }
        var builder = new MetaCognitiveEventBuilder();
        builder.withType("".concat(source, ":").concat(operation));
        builder.withDescription("Operation ".concat(operation, " from ").concat(source));
        if (Object.keys(metadata).length > 0) {
            builder.withMetadata(metadata);
        }
        return builder;
    };
    /**
     * Set the event ID (explicitly added to fix withId errors)
     */
    MetaCognitiveEventBuilder.prototype.withId = function (id) {
        this.event.id = id;
        return this;
    };
    /**
     * Set the event type
     */
    MetaCognitiveEventBuilder.prototype.withType = function (type) {
        this.event.type = type;
        return this;
    };
    /**
     * Set the event node ID
     */
    MetaCognitiveEventBuilder.prototype.withNodeId = function (nodeId) {
        this.event.nodeId = nodeId;
        return this;
    };
    /**
     * Set the event description
     */
    MetaCognitiveEventBuilder.prototype.withDescription = function (description) {
        this.event.description = description;
        return this;
    };
    /**
     * Set the event creation date
     */
    MetaCognitiveEventBuilder.prototype.withCreatedAt = function (date) {
        this.event.createdAt = date || DateTransformer.createDate();
        return this;
    };
    /**
     * Set the event confidence level
     */
    MetaCognitiveEventBuilder.prototype.withConfidence = function (confidence) {
        this.event.confidence = Math.max(0, Math.min(1, confidence));
        return this;
    };
    /**
     * Set the event importance level
     */
    MetaCognitiveEventBuilder.prototype.withImportance = function (importance) {
        this.event.importance = Math.max(0, Math.min(1, importance));
        return this;
    };
    /**
     * Set the event impact level (alias for importance for backward compatibility)
     */
    MetaCognitiveEventBuilder.prototype.withImpact = function (impact) {
        return this.withImportance(impact);
    };
    /**
     * Set the event outcome
     */
    MetaCognitiveEventBuilder.prototype.withOutcome = function (outcome) {
        this.event.outcome = outcome;
        return this;
    };
    /**
     * Add related events by ID
     * Note: relatedEvents is now a comma-separated string to match schema-minimal
     */
    MetaCognitiveEventBuilder.prototype.withRelatedEvents = function (relatedEvents) {
        if (Array.isArray(relatedEvents)) {
            // Convert array to comma-separated string
            this.event.relatedEvents = relatedEvents.join(',');
        }
        else {
            this.event.relatedEvents = relatedEvents;
        }
        return this;
    };
    /**
     * Set the source context
     * Note: sourceContext is now a JSON string to match schema-minimal
     */
    MetaCognitiveEventBuilder.prototype.withSourceContext = function (sourceContext) {
        if (typeof sourceContext === 'string') {
            this.event.sourceContext = sourceContext;
        }
        else {
            // Convert object to JSON string
            this.event.sourceContext = JSON.stringify(sourceContext);
        }
        return this;
    };
    /**
     * Set the event details
     */
    MetaCognitiveEventBuilder.prototype.withDetails = function (details) {
        this.event.details = details;
        return this;
    };
    /**
     * Set the event metadata
     */
    MetaCognitiveEventBuilder.prototype.withMetadata = function (metadata) {
        this.event.metadata = metadata;
        return this;
    };
    /**
     * Set the source agent for the event
     */
    MetaCognitiveEventBuilder.prototype.withSourceAgent = function (agentName) {
        // Store the agent in metadata if it doesn't exist
        if (!this.event.metadata) {
            this.event.metadata = {};
        }
        this.event.metadata.sourceAgent = agentName;
        return this;
    };
    /**
     * Set the target agent for the event
     */
    MetaCognitiveEventBuilder.prototype.withTargetAgent = function (agentName) {
        // Store the agent in metadata if it doesn't exist
        if (!this.event.metadata) {
            this.event.metadata = {};
        }
        this.event.metadata.targetAgent = agentName;
        return this;
    };
    /**
     * Set the objective/purpose of the event
     */
    MetaCognitiveEventBuilder.prototype.withObjective = function (objective) {
        // Use description field for the objective
        this.event.description = objective;
        return this;
    };
    /**
     * Set the content/message of the event
     */
    MetaCognitiveEventBuilder.prototype.withContent = function (content) {
        // Store content in details if it doesn't exist
        if (!this.event.details) {
            this.event.details = {};
        }
        this.event.details.content = content;
        return this;
    };
    /**
     * Build the final MetaCognitiveEvent
     */
    MetaCognitiveEventBuilder.prototype.build = function () {
        // Ensure required properties are present
        if (!this.event.type) {
            throw new Error('MetaCognitiveEvent must have a type');
        }
        // Ensure description is present (required by schema)
        if (!this.event.description) {
            this.event.description = "Event of type ".concat(this.event.type);
        }
        // Make sure createdAt is a Date object (required by schema-minimal)
        if (typeof this.event.createdAt === 'string') {
            this.event.createdAt = new Date(this.event.createdAt);
        }
        else if (!(this.event.createdAt instanceof Date)) {
            this.event.createdAt = DateTransformer.createDate();
        }
        // Ensure createdAt is exactly a Date object, not a string
        // This is critical for schema compliance
        if (!(this.event.createdAt instanceof Date)) {
            this.event.createdAt = new Date();
        }
        return this.event;
    };
    /**
     * Create and normalize an event from legacy format
     * Handles both eventType → type and timestamp → createdAt conversions
     */
    MetaCognitiveEventBuilder.fromLegacyEvent = function (legacyEvent) {
        var builder = new MetaCognitiveEventBuilder();
        // Handle renamed properties
        if (legacyEvent.eventType && !legacyEvent.type) {
            builder.withType(legacyEvent.eventType);
        }
        else if (legacyEvent.type) {
            builder.withType(legacyEvent.type);
        }
        if (legacyEvent.timestamp && !legacyEvent.createdAt) {
            builder.withCreatedAt(new Date(legacyEvent.timestamp));
        }
        else if (legacyEvent.createdAt) {
            builder.withCreatedAt(new Date(legacyEvent.createdAt));
        }
        if (legacyEvent.confidenceLevel !== undefined && legacyEvent.confidence === undefined) {
            builder.withConfidence(legacyEvent.confidenceLevel);
        }
        else if (legacyEvent.confidence !== undefined) {
            builder.withConfidence(legacyEvent.confidence);
        }
        // Copy other standard properties
        if (legacyEvent.id)
            builder.withId(legacyEvent.id);
        if (legacyEvent.nodeId)
            builder.withNodeId(legacyEvent.nodeId);
        if (legacyEvent.description)
            builder.withDescription(legacyEvent.description);
        if (legacyEvent.importance !== undefined)
            builder.withImportance(legacyEvent.importance);
        if (legacyEvent.relatedEvents)
            builder.withRelatedEvents(legacyEvent.relatedEvents);
        if (legacyEvent.sourceContext)
            builder.withSourceContext(legacyEvent.sourceContext);
        if (legacyEvent.details)
            builder.withDetails(legacyEvent.details);
        if (legacyEvent.metadata)
            builder.withMetadata(legacyEvent.metadata);
        if (legacyEvent.outcome)
            builder.withOutcome(legacyEvent.outcome);
        return builder.build();
    };
    /**
     * Convert between property naming conventions
     */
    MetaCognitiveEventBuilder.standardizeEventProperties = function (event) {
        var standardized = __assign({}, event);
        // eventType → type
        if (standardized.eventType && !standardized.type) {
            standardized.type = standardized.eventType;
            delete standardized.eventType;
        }
        // timestamp → createdAt
        if (standardized.timestamp && !standardized.createdAt) {
            standardized.createdAt = standardized.timestamp;
            delete standardized.timestamp;
        }
        // confidenceLevel → confidence
        if (standardized.confidenceLevel !== undefined && standardized.confidence === undefined) {
            standardized.confidence = standardized.confidenceLevel;
            delete standardized.confidenceLevel;
        }
        return standardized;
    };
    return MetaCognitiveEventBuilder;
}());
export { MetaCognitiveEventBuilder };
