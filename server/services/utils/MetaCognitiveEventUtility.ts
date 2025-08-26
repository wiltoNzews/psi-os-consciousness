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

import { DateTransformer } from './DateTransformer.js';
import { MetaCognitiveEvent, MetaEventType } from './MetaCognitiveEventBuilder.js';

/**
 * Validates a MetaCognitiveEvent to ensure it has all required properties
 * and proper formatting according to system standards.
 * 
 * @param event The event to validate
 * @returns The validated event (possibly with fixes applied)
 * @throws Error if the event cannot be validated
 */
export function ensureValidMetaCognitiveEvent(event: any): MetaCognitiveEvent {
  // Create a copy to avoid modifying the original
  const validatedEvent = { ...event };
  
  // Check required fields
  if (!validatedEvent.id) {
    throw new Error('MetaCognitiveEvent must have an id');
  }
  
  if (!validatedEvent.type) {
    // If only eventType exists (legacy format), convert it
    if (validatedEvent.eventType) {
      validatedEvent.type = validatedEvent.eventType;
      delete validatedEvent.eventType;
    } else {
      throw new Error('MetaCognitiveEvent must have a type');
    }
  }
  
  // Check and normalize createdAt
  if (!validatedEvent.createdAt) {
    // If only timestamp exists (legacy format), convert it
    if (validatedEvent.timestamp) {
      validatedEvent.createdAt = validatedEvent.timestamp;
      delete validatedEvent.timestamp;
    } else {
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
    } catch {
      validatedEvent.sourceContext = { source: String(validatedEvent.sourceContext) };
    }
  }
  
  if (validatedEvent.details && typeof validatedEvent.details !== 'object') {
    try {
      validatedEvent.details = JSON.parse(validatedEvent.details);
    } catch {
      validatedEvent.details = { value: validatedEvent.details };
    }
  }
  
  if (validatedEvent.metadata && typeof validatedEvent.metadata !== 'object') {
    try {
      validatedEvent.metadata = JSON.parse(validatedEvent.metadata);
    } catch {
      validatedEvent.metadata = { value: validatedEvent.metadata };
    }
  }
  
  return validatedEvent as MetaCognitiveEvent;
}

/**
 * Options for filtering meta-cognitive events
 */
export interface EventFilterOptions {
  // Event types to include
  includeTypes?: string[];
  
  // Event types to exclude
  excludeTypes?: string[];
  
  // Minimum importance threshold (0.0 to 1.0)
  minImportance?: number;
  
  // Maximum importance threshold (0.0 to 1.0)
  maxImportance?: number;
  
  // Minimum confidence threshold (0.0 to 1.0)
  minConfidence?: number;
  
  // Maximum confidence threshold (0.0 to 1.0)
  maxConfidence?: number;
  
  // Start date for time range filtering
  startDate?: Date;
  
  // End date for time range filtering
  endDate?: Date;
  
  // Associated node IDs
  nodeIds?: string[];
  
  // Maximum number of events to return
  limit?: number;
}

/**
 * Options for normalizing meta-cognitive events
 */
export interface EventNormalizationOptions {
  // Whether to normalize property names (e.g., timestamp -> createdAt)
  normalizePropertyNames?: boolean;
  
  // Whether to ensure all dates are properly formatted
  normalizeDates?: boolean;
  
  // Whether to ensure relatedEvents is always an array
  normalizeRelatedEvents?: boolean;
  
  // Whether to ensure sourceContext is always a record
  normalizeSourceContext?: boolean;
  
  // Additional event properties to normalize
  additionalProperties?: Record<string, (value: any) => any>;
}

/**
 * Options for aggregating meta-cognitive events
 */
export interface EventAggregationOptions {
  // Field to group by
  groupBy: string;
  
  // Aggregation function ('count', 'avg', 'sum', 'min', 'max')
  aggregation: 'count' | 'avg' | 'sum' | 'min' | 'max';
  
  // Field to aggregate (required for avg, sum, min, max)
  aggregateField?: string;
}

/**
 * MetaCognitiveEventUtility provides utility methods for processing
 * meta-cognitive events consistently across the system
 */
export class MetaCognitiveEventUtility {
  /**
   * Normalize a meta-cognitive event's properties to ensure consistency
   * @param event Meta-cognitive event to normalize
   * @param options Normalization options
   * @returns Normalized meta-cognitive event
   */
  static normalizeEvent(
    event: Record<string, any>,
    options: EventNormalizationOptions = {}
  ): MetaCognitiveEvent {
    const normalizedEvent: Record<string, any> = { ...event };
    
    // Set default options
    const normalizePropertyNames = options.normalizePropertyNames !== false;
    const normalizeDates = options.normalizeDates !== false;
    const normalizeRelatedEvents = options.normalizeRelatedEvents !== false;
    const normalizeSourceContext = options.normalizeSourceContext !== false;
    
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
        } else if (!(normalizedEvent.createdAt instanceof Date)) {
          normalizedEvent.createdAt = DateTransformer.createDate();
        }
      } else {
        normalizedEvent.createdAt = DateTransformer.createDate();
      }
    }
    
    // Normalize relatedEvents
    if (normalizeRelatedEvents) {
      // Ensure relatedEvents is an array
      if (!normalizedEvent.relatedEvents) {
        normalizedEvent.relatedEvents = [];
      } else if (typeof normalizedEvent.relatedEvents === 'string') {
        // If it's a comma-separated string, split it
        normalizedEvent.relatedEvents = normalizedEvent.relatedEvents.split(',').map((id: string) => id.trim());
      } else if (!Array.isArray(normalizedEvent.relatedEvents)) {
        // If it's not an array, convert it
        normalizedEvent.relatedEvents = [normalizedEvent.relatedEvents];
      }
    }
    
    // Normalize sourceContext
    if (normalizeSourceContext) {
      // Ensure sourceContext is a record
      if (!normalizedEvent.sourceContext) {
        normalizedEvent.sourceContext = {};
      } else if (typeof normalizedEvent.sourceContext === 'string') {
        try {
          // If it's a JSON string, parse it
          normalizedEvent.sourceContext = JSON.parse(normalizedEvent.sourceContext);
        } catch {
          // If parsing fails, create a simple object
          normalizedEvent.sourceContext = { source: normalizedEvent.sourceContext };
        }
      }
    }
    
    // Apply additional property normalizations
    if (options.additionalProperties) {
      for (const [property, transformFn] of Object.entries(options.additionalProperties)) {
        if (property in normalizedEvent) {
          normalizedEvent[property] = transformFn(normalizedEvent[property]);
        }
      }
    }
    
    return normalizedEvent as MetaCognitiveEvent;
  }
  
  /**
   * Filter an array of meta-cognitive events based on the provided options
   * @param events Array of meta-cognitive events
   * @param options Filter options
   * @returns Filtered array of meta-cognitive events
   */
  static filterEvents(
    events: MetaCognitiveEvent[],
    options: EventFilterOptions = {}
  ): MetaCognitiveEvent[] {
    let filteredEvents = [...events];
    
    // Filter by event type
    if (options.includeTypes && options.includeTypes.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        options.includeTypes?.includes(event.type)
      );
    }
    
    if (options.excludeTypes && options.excludeTypes.length > 0) {
      filteredEvents = filteredEvents.filter(event =>
        !options.excludeTypes?.includes(event.type)
      );
    }
    
    // Filter by importance
    if (options.minImportance !== undefined) {
      filteredEvents = filteredEvents.filter(event =>
        event.importance !== undefined && event.importance >= options.minImportance!
      );
    }
    
    if (options.maxImportance !== undefined) {
      filteredEvents = filteredEvents.filter(event =>
        event.importance !== undefined && event.importance <= options.maxImportance!
      );
    }
    
    // Filter by confidence
    if (options.minConfidence !== undefined) {
      filteredEvents = filteredEvents.filter(event =>
        event.confidence !== undefined && event.confidence >= options.minConfidence!
      );
    }
    
    if (options.maxConfidence !== undefined) {
      filteredEvents = filteredEvents.filter(event =>
        event.confidence !== undefined && event.confidence <= options.maxConfidence!
      );
    }
    
    // Filter by date range
    if (options.startDate) {
      filteredEvents = filteredEvents.filter(event =>
        event.createdAt !== undefined && event.createdAt >= options.startDate!
      );
    }
    
    if (options.endDate) {
      filteredEvents = filteredEvents.filter(event =>
        event.createdAt !== undefined && event.createdAt <= options.endDate!
      );
    }
    
    // Filter by node IDs
    if (options.nodeIds && options.nodeIds.length > 0) {
      filteredEvents = filteredEvents.filter(event =>
        event.nodeId !== undefined && options.nodeIds?.includes(event.nodeId)
      );
    }
    
    // Apply limit
    if (options.limit !== undefined && options.limit > 0) {
      filteredEvents = filteredEvents.slice(0, options.limit);
    }
    
    return filteredEvents;
  }
  
  /**
   * Enrich a meta-cognitive event with additional information
   * @param event Meta-cognitive event to enrich
   * @param additionalData Additional data to add to the event
   * @returns Enriched meta-cognitive event
   */
  static enrichEvent(
    event: MetaCognitiveEvent,
    additionalData: Record<string, any>
  ): MetaCognitiveEvent {
    // Create a copy of the event
    const enrichedEvent = { ...event };
    
    // Add additional data to the event details
    if (!enrichedEvent.details) {
      enrichedEvent.details = {};
    }
    
    enrichedEvent.details = {
      ...enrichedEvent.details,
      ...additionalData,
    };
    
    return enrichedEvent;
  }
  
  /**
   * Merge multiple meta-cognitive events into a single event
   * @param events Array of meta-cognitive events to merge
   * @param mergeStrategy Strategy for merging conflicting values ('first', 'last', 'average')
   * @returns Merged meta-cognitive event
   */
  static mergeEvents(
    events: MetaCognitiveEvent[],
    mergeStrategy: 'first' | 'last' | 'average' = 'last'
  ): MetaCognitiveEvent {
    if (events.length === 0) {
      throw new Error('Cannot merge empty array of events');
    }
    
    if (events.length === 1) {
      return events[0];
    }
    
    // Initialize the merged event with the first event's properties
    const mergedEvent: Record<string, any> = { ...events[0] };
    
    // Set of properties to merge specially
    const specialProperties = ['details', 'relatedEvents', 'sourceContext', 'metadata'];
    
    // Set of numeric properties for averaging
    const numericProperties = ['importance', 'confidence'];
    
    // Merge the remaining events
    for (let i = 1; i < events.length; i++) {
      const event = events[i];
      
      // Merge special properties
      for (const prop of specialProperties) {
        if (event[prop]) {
          if (!mergedEvent[prop]) {
            mergedEvent[prop] = {};
          }
          
          if (Array.isArray(event[prop])) {
            // If it's an array, concatenate and remove duplicates
            if (Array.isArray(mergedEvent[prop])) {
              mergedEvent[prop] = [...new Set([...mergedEvent[prop], ...event[prop]])];
            } else {
              mergedEvent[prop] = event[prop];
            }
          } else if (typeof event[prop] === 'object') {
            // If it's an object, merge recursively
            mergedEvent[prop] = { ...mergedEvent[prop], ...event[prop] };
          }
        }
      }
      
      // For numeric properties, apply the merge strategy
      for (const prop of numericProperties) {
        if (event[prop] !== undefined) {
          if (mergeStrategy === 'first') {
            // Keep the first value, do nothing
          } else if (mergeStrategy === 'last') {
            // Use the last value
            mergedEvent[prop] = event[prop];
          } else if (mergeStrategy === 'average' && typeof event[prop] === 'number') {
            // Calculate the running average
            if (typeof mergedEvent[prop] !== 'number') {
              mergedEvent[prop] = event[prop];
            } else {
              mergedEvent[prop] = ((mergedEvent[prop] * i) + event[prop]) / (i + 1);
            }
          }
        }
      }
      
      // For createdAt, use the earliest or latest date based on merge strategy
      if (event.createdAt) {
        if (mergeStrategy === 'first') {
          // Keep the first date, do nothing
        } else if (mergeStrategy === 'last' || mergeStrategy === 'average') {
          // Use the latest date (for 'average' still use latest for dates)
          const eventDate = event.createdAt instanceof Date ? event.createdAt : new Date(event.createdAt);
          const mergedDate = mergedEvent.createdAt instanceof Date ? mergedEvent.createdAt : new Date(mergedEvent.createdAt);
          
          if (eventDate > mergedDate) {
            mergedEvent.createdAt = eventDate;
          }
        }
      }
      
      // Handle description: concatenate with delimiters
      if (event.description) {
        if (!mergedEvent.description) {
          mergedEvent.description = event.description;
        } else {
          mergedEvent.description = `${mergedEvent.description}; ${event.description}`;
        }
      }
    }
    
    return mergedEvent as MetaCognitiveEvent;
  }
  
  /**
   * Aggregate meta-cognitive events based on the provided options
   * @param events Array of meta-cognitive events
   * @param options Aggregation options
   * @returns Aggregated data
   */
  static aggregateEvents(
    events: MetaCognitiveEvent[],
    options: EventAggregationOptions
  ): Record<string, any> {
    const { groupBy, aggregation, aggregateField } = options;
    
    // Check if aggregateField is provided for non-count aggregations
    if (aggregation !== 'count' && !aggregateField) {
      throw new Error(`aggregateField is required for ${aggregation} aggregation`);
    }
    
    // Group events by the specified field
    const groupedEvents: Record<string, MetaCognitiveEvent[]> = {};
    for (const event of events) {
      const groupValue = String(event[groupBy] || 'undefined');
      if (!groupedEvents[groupValue]) {
        groupedEvents[groupValue] = [];
      }
      groupedEvents[groupValue].push(event);
    }
    
    // Aggregate the grouped events
    const result: Record<string, any> = {};
    for (const [groupValue, groupEvents] of Object.entries(groupedEvents)) {
      if (aggregation === 'count') {
        result[groupValue] = groupEvents.length;
      } else {
        // Extract values from the specified field
        const values = groupEvents
          .map(event => event[aggregateField!])
          .filter(value => value !== undefined && typeof value === 'number');
        
        if (values.length === 0) {
          result[groupValue] = null;
          continue;
        }
        
        // Calculate the aggregation
        switch (aggregation) {
          case 'avg':
            result[groupValue] = values.reduce((sum, value) => sum + value, 0) / values.length;
            break;
          case 'sum':
            result[groupValue] = values.reduce((sum, value) => sum + value, 0);
            break;
          case 'min':
            result[groupValue] = Math.min(...values);
            break;
          case 'max':
            result[groupValue] = Math.max(...values);
            break;
        }
      }
    }
    
    return result;
  }
  
  /**
   * Convert a legacy event object to a standardized meta-cognitive event
   * @param legacyEvent Legacy event object
   * @returns Standardized meta-cognitive event
   */
  static convertLegacyEvent(legacyEvent: Record<string, any>): MetaCognitiveEvent {
    // Normalize the event properties first
    const normalizedEvent = this.normalizeEvent(legacyEvent);
    
    // If the event already has a type property, use it
    // Otherwise, try to derive it from other properties
    let eventType = normalizedEvent.type;
    if (!eventType) {
      if (legacyEvent.eventType) {
        eventType = legacyEvent.eventType;
      } else if (legacyEvent.type) {
        eventType = legacyEvent.type;
      } else if (legacyEvent.category) {
        eventType = `${legacyEvent.category}:${legacyEvent.action || 'EVENT'}`;
      } else {
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
  }
  
  /**
   * Batch convert multiple legacy events to standardized meta-cognitive events
   * @param legacyEvents Array of legacy event objects
   * @returns Array of standardized meta-cognitive events
   */
  static batchConvertLegacyEvents(legacyEvents: Record<string, any>[]): MetaCognitiveEvent[] {
    return legacyEvents.map(event => this.convertLegacyEvent(event));
  }
  
  /**
   * Serialize a meta-cognitive event for storage or transmission
   * @param event Meta-cognitive event to serialize
   * @returns Serialized meta-cognitive event
   */
  static serializeEvent(event: MetaCognitiveEvent): Record<string, any> {
    return DateTransformer.toPersistence(event);
  }
  
  /**
   * Deserialize a meta-cognitive event from storage or transmission
   * @param serializedEvent Serialized meta-cognitive event
   * @returns Deserialized meta-cognitive event
   */
  static deserializeEvent(serializedEvent: Record<string, any>): MetaCognitiveEvent {
    return DateTransformer.fromPersistence(serializedEvent);
  }
  
  /**
   * Format a meta-cognitive event for display or logging
   * @param event Meta-cognitive event to format
   * @param format Output format ('simple' or 'detailed')
   * @returns Formatted event string
   */
  static formatEventForDisplay(
    event: MetaCognitiveEvent,
    format: 'simple' | 'detailed' = 'simple'
  ): string {
    if (format === 'simple') {
      const timestamp = event.createdAt instanceof Date 
        ? event.createdAt.toISOString() 
        : new Date(event.createdAt).toISOString();
      
      return `[${timestamp}] ${event.type}: ${event.description || 'No description'}`;
    } else {
      return JSON.stringify(event, (key, value) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      }, 2);
    }
  }
}