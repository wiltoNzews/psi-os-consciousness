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

import { v4 as uuidv4 } from 'uuid';
import { DateTransformer } from './DateTransformer.js';

/**
 * Standard meta-cognitive event types
 */
export enum MetaEventType {
  // System-level events
  SYSTEM_STARTUP = 'system:startup',
  SYSTEM_SHUTDOWN = 'system:shutdown',
  SYSTEM_ERROR = 'system:error',
  SYSTEM_WARNING = 'system:warning',
  SYSTEM_INFO = 'system:info',
  SYSTEM_ADAPTATION = 'system:adaptation',
  
  // Task-related events
  TASK_CREATED = 'task:created',
  TASK_UPDATED = 'task:updated',
  TASK_COMPLETED = 'task:completed',
  TASK_FAILED = 'task:failed',
  TASK_ALLOCATED = 'task:allocated',
  
  // Chunk-related events
  CHUNK_CREATED = 'chunk:created',
  CHUNK_PROCESSED = 'chunk:processed',
  CHUNK_MERGED = 'chunk:merged',
  
  // Neural events
  NEURAL_PATHWAY_CREATED = 'neural:pathway_created',
  NEURAL_PATHWAY_STRENGTHENED = 'neural:pathway_strengthened',
  NEURAL_PATHWAY_WEAKENED = 'neural:pathway_weakened',
  
  // Quantum-related events
  QUANTUM_DECOHERENCE = 'quantum:decoherence',
  QUANTUM_ENTANGLEMENT = 'quantum:entanglement',
  QUANTUM_SUPERPOSITION = 'quantum:superposition',
  
  // Feedback events
  FEEDBACK_RECEIVED = 'feedback:received',
  FEEDBACK_PROCESSED = 'feedback:processed',
  
  // Insight events
  INSIGHT_DISCOVERED = 'insight:discovered',
  INSIGHT_APPLIED = 'insight:applied',
  
  // Meta-cognitive events
  META_REFLECTION = 'meta:reflection',
  META_ADAPTATION = 'meta:adaptation',
  META_LEARNING = 'meta:learning'
}

/**
 * MetaCognitiveEvent interface defining the standardized structure
 */
export interface MetaCognitiveEvent {
  // Core properties (always required)
  id: string;
  type: string;
  createdAt: Date; // Using Date type to match schema-minimal
  description: string; // Required to match schema-minimal definition
  
  // Extended properties (optional but standardized)
  nodeId?: string;
  confidence?: number;
  importance?: number;
  relatedEvents?: string; // String instead of string[] to match schema-minimal
  sourceContext?: string; // JSON string instead of Record<string, any> to match schema-minimal
  outcome?: string;
  
  // Custom properties (domain-specific)
  details?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Builder class for creating MetaCognitiveEvent objects
 */
export class MetaCognitiveEventBuilder {
  private event: Partial<MetaCognitiveEvent>;
  
  constructor() {
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
  static create(initialData: Partial<MetaCognitiveEvent> = {}): MetaCognitiveEventBuilder {
    const builder = new MetaCognitiveEventBuilder();
    
    // Apply initial data if provided
    Object.entries(initialData).forEach(([key, value]) => {
      // Use type-safe property assignment
      switch(key) {
        case 'id': builder.withId(value as string); break;
        case 'type': builder.withType(value as string); break;
        case 'nodeId': builder.withNodeId(value as string); break;
        case 'description': builder.withDescription(value as string); break;
        case 'createdAt': builder.withCreatedAt(value as Date); break;
        case 'confidence': builder.withConfidence(value as number); break;
        case 'importance': builder.withImportance(value as number); break;
        case 'relatedEvents': builder.withRelatedEvents(value as string); break;
        case 'sourceContext': builder.withSourceContext(value as string); break;
        case 'outcome': builder.withOutcome(value as string); break;
        case 'details': builder.withDetails(value as Record<string, any>); break;
        case 'metadata': builder.withMetadata(value as Record<string, any>); break;
        default:
          // Skip unknown properties
          console.warn(`Ignoring unknown MetaCognitiveEvent property: ${key}`);
      }
    });
    
    return builder;
  }
  
  /**
   * Create event from source and operation
   */
  static fromSourceOperation(
    source: string,
    operation: string,
    metadata: Record<string, any> = {}
  ): MetaCognitiveEventBuilder {
    const builder = new MetaCognitiveEventBuilder();
    builder.withType(`${source}:${operation}`);
    builder.withDescription(`Operation ${operation} from ${source}`);
    
    if (Object.keys(metadata).length > 0) {
      builder.withMetadata(metadata);
    }
    
    return builder;
  }
  
  /**
   * Set the event ID (explicitly added to fix withId errors)
   */
  withId(id: string): MetaCognitiveEventBuilder {
    this.event.id = id;
    return this;
  }
  
  /**
   * Set the event type
   */
  withType(type: string): MetaCognitiveEventBuilder {
    this.event.type = type;
    return this;
  }
  
  /**
   * Set the event node ID
   */
  withNodeId(nodeId: string): MetaCognitiveEventBuilder {
    this.event.nodeId = nodeId;
    return this;
  }
  
  /**
   * Set the event description
   */
  withDescription(description: string): MetaCognitiveEventBuilder {
    this.event.description = description;
    return this;
  }
  
  /**
   * Set the event creation date
   */
  withCreatedAt(date?: Date): MetaCognitiveEventBuilder {
    this.event.createdAt = date || DateTransformer.createDate();
    return this;
  }
  
  /**
   * Set the event confidence level
   */
  withConfidence(confidence: number): MetaCognitiveEventBuilder {
    this.event.confidence = Math.max(0, Math.min(1, confidence));
    return this;
  }
  
  /**
   * Set the event importance level
   */
  withImportance(importance: number): MetaCognitiveEventBuilder {
    this.event.importance = Math.max(0, Math.min(1, importance));
    return this;
  }
  
  /**
   * Set the event impact level (alias for importance for backward compatibility)
   */
  withImpact(impact: number): MetaCognitiveEventBuilder {
    return this.withImportance(impact);
  }
  
  /**
   * Set the event outcome
   */
  withOutcome(outcome: string): MetaCognitiveEventBuilder {
    this.event.outcome = outcome;
    return this;
  }
  
  /**
   * Add related events by ID
   * Note: relatedEvents is now a comma-separated string to match schema-minimal
   */
  withRelatedEvents(relatedEvents: string[] | string): MetaCognitiveEventBuilder {
    if (Array.isArray(relatedEvents)) {
      // Convert array to comma-separated string
      this.event.relatedEvents = relatedEvents.join(',');
    } else {
      this.event.relatedEvents = relatedEvents;
    }
    return this;
  }
  
  /**
   * Set the source context
   * Note: sourceContext is now a JSON string to match schema-minimal
   */
  withSourceContext(sourceContext: Record<string, any> | string): MetaCognitiveEventBuilder {
    if (typeof sourceContext === 'string') {
      this.event.sourceContext = sourceContext;
    } else {
      // Convert object to JSON string
      this.event.sourceContext = JSON.stringify(sourceContext);
    }
    return this;
  }
  
  /**
   * Set the event details
   */
  withDetails(details: Record<string, any>): MetaCognitiveEventBuilder {
    this.event.details = details;
    return this;
  }
  
  /**
   * Set the event metadata
   */
  withMetadata(metadata: Record<string, any>): MetaCognitiveEventBuilder {
    this.event.metadata = metadata;
    return this;
  }
  
  /**
   * Set the source agent for the event
   */
  withSourceAgent(agentName: string): MetaCognitiveEventBuilder {
    // Store the agent in metadata if it doesn't exist
    if (!this.event.metadata) {
      this.event.metadata = {};
    }
    this.event.metadata.sourceAgent = agentName;
    return this;
  }
  
  /**
   * Set the target agent for the event
   */
  withTargetAgent(agentName: string): MetaCognitiveEventBuilder {
    // Store the agent in metadata if it doesn't exist
    if (!this.event.metadata) {
      this.event.metadata = {};
    }
    this.event.metadata.targetAgent = agentName;
    return this;
  }
  
  /**
   * Set the objective/purpose of the event
   */
  withObjective(objective: string): MetaCognitiveEventBuilder {
    // Use description field for the objective
    this.event.description = objective;
    return this;
  }
  
  /**
   * Set the content/message of the event
   */
  withContent(content: string): MetaCognitiveEventBuilder {
    // Store content in details if it doesn't exist
    if (!this.event.details) {
      this.event.details = {};
    }
    this.event.details.content = content;
    return this;
  }
  
  /**
   * Build the final MetaCognitiveEvent
   */
  build(): MetaCognitiveEvent {
    // Ensure required properties are present
    if (!this.event.type) {
      throw new Error('MetaCognitiveEvent must have a type');
    }
    
    // Ensure description is present (required by schema)
    if (!this.event.description) {
      this.event.description = `Event of type ${this.event.type}`;
    }
    
    // Make sure createdAt is a Date object (required by schema-minimal)
    if (typeof this.event.createdAt === 'string') {
      this.event.createdAt = new Date(this.event.createdAt);
    } else if (!(this.event.createdAt instanceof Date)) {
      this.event.createdAt = DateTransformer.createDate();
    }
    
    // Ensure createdAt is exactly a Date object, not a string
    // This is critical for schema compliance
    if (!(this.event.createdAt instanceof Date)) {
      this.event.createdAt = new Date();
    }
    
    return this.event as MetaCognitiveEvent;
  }
  
  /**
   * Create and normalize an event from legacy format
   * Handles both eventType → type and timestamp → createdAt conversions
   */
  static fromLegacyEvent(legacyEvent: Record<string, any>): MetaCognitiveEvent {
    const builder = new MetaCognitiveEventBuilder();
    
    // Handle renamed properties
    if (legacyEvent.eventType && !legacyEvent.type) {
      builder.withType(legacyEvent.eventType);
    } else if (legacyEvent.type) {
      builder.withType(legacyEvent.type);
    }
    
    if (legacyEvent.timestamp && !legacyEvent.createdAt) {
      builder.withCreatedAt(new Date(legacyEvent.timestamp));
    } else if (legacyEvent.createdAt) {
      builder.withCreatedAt(new Date(legacyEvent.createdAt));
    }
    
    if (legacyEvent.confidenceLevel !== undefined && legacyEvent.confidence === undefined) {
      builder.withConfidence(legacyEvent.confidenceLevel);
    } else if (legacyEvent.confidence !== undefined) {
      builder.withConfidence(legacyEvent.confidence);
    }
    
    // Copy other standard properties
    if (legacyEvent.id) builder.withId(legacyEvent.id);
    if (legacyEvent.nodeId) builder.withNodeId(legacyEvent.nodeId);
    if (legacyEvent.description) builder.withDescription(legacyEvent.description);
    if (legacyEvent.importance !== undefined) builder.withImportance(legacyEvent.importance);
    if (legacyEvent.relatedEvents) builder.withRelatedEvents(legacyEvent.relatedEvents);
    if (legacyEvent.sourceContext) builder.withSourceContext(legacyEvent.sourceContext);
    if (legacyEvent.details) builder.withDetails(legacyEvent.details);
    if (legacyEvent.metadata) builder.withMetadata(legacyEvent.metadata);
    if (legacyEvent.outcome) builder.withOutcome(legacyEvent.outcome);
    
    return builder.build();
  }
  
  /**
   * Convert between property naming conventions
   */
  static standardizeEventProperties(event: Record<string, any>): Record<string, any> {
    const standardized = { ...event };
    
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
  }
}