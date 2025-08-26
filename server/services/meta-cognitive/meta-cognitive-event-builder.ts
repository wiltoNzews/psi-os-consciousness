/**
 * Meta-Cognitive Event Builder
 * 
 * This service provides utilities for creating, enriching, and processing
 * meta-cognitive events with appropriate context and metadata.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';
import { QuantumGlossary } from '../qrn/quantum-glossary.js';
import { MetaCognitiveEvent, InsertMetaCognitiveEvent, createMetaCognitiveEvent } from '../../../shared/schema-minimal.js';
import { QCTFData } from '../../../shared/qctf.js';

const quantumGlossary = new QuantumGlossary();

// Types for meta-cognitive event building
export interface EventTemplate {
  type: string;
  description: string;
  confidenceBase: number;
  impactBase: number;
  sourceContext: string;
  detailsTemplate: Record<string, any>;
}

export interface EventProcessingStats {
  eventsProcessed: number;
  eventsByType: Record<string, number>;
  averageConfidence: number;
  highImpactCount: number;
  lowConfidenceCount: number;
  processingTime: number;
}

/**
 * Meta-Cognitive Event Builder class
 * Builds and processes meta-cognitive events with context enrichment
 */
export class MetaCognitiveEventBuilder {
  private templates: Map<string, EventTemplate> = new Map();
  private qctfContext: QCTFData | null = null;
  private systemContext: Record<string, any> = {};
  private processingStats: EventProcessingStats = {
    eventsProcessed: 0,
    eventsByType: {},
    averageConfidence: 0,
    highImpactCount: 0,
    lowConfidenceCount: 0,
    processingTime: 0
  };
  
  constructor() {
    // Register default templates
    this.registerDefaultTemplates();
    
    // Log initialization
    quantumGlossary.tagWithContext('[META-COGNITIVE] Event Builder initialized');
  }
  
  /**
   * Update the builder's context with latest system data
   * 
   * @param qctfData - Current QCTF data
   * @param systemContext - Current system context data
   */
  public updateContext(qctfData: QCTFData | null, systemContext: Record<string, any> = {}): void {
    this.qctfContext = qctfData;
    this.systemContext = systemContext;
  }
  
  /**
   * Register a new event template
   * 
   * @param template - Event template to register
   */
  public registerTemplate(template: EventTemplate): void {
    this.templates.set(template.type, template);
    quantumGlossary.tagWithContext(`[META-COGNITIVE] Registered event template: ${template.type}`);
  }
  
  /**
   * Create a new meta-cognitive event based on a registered template
   * 
   * @param type - Template type to use
   * @param params - Parameters to fill in the template
   * @param overrides - Optional overrides for template values
   * @returns Created meta-cognitive event
   */
  public createEvent(
    type: string,
    params: Record<string, any> = {},
    overrides: Partial<EventTemplate> = {}
  ): MetaCognitiveEvent {
    // Get template
    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Unknown event template type: ${type}`);
    }
    
    // Merge template with overrides
    const effectiveTemplate = {
      ...template,
      ...overrides,
      detailsTemplate: {
        ...template.detailsTemplate,
        ...(overrides.detailsTemplate || {})
      }
    };
    
    // Process template strings to replace parameters
    const description = this.processTemplateString(effectiveTemplate.description, params);
    
    // Process details object
    const details = this.processTemplateObject(effectiveTemplate.detailsTemplate, params);
    
    // Add context information
    if (this.qctfContext) {
      details.contextInfo = {
        qctf: this.qctfContext.history[0]?.qctf || 0,
        coherence: this.qctfContext.ci || 0,
        systemMetrics: {
          gef: this.qctfContext.gef || 0,
          qeai: this.qctfContext.qeai || 0
        }
      };
    }
    
    // Add metadata from system context if available
    if (Object.keys(this.systemContext).length > 0) {
      details.systemContext = {
        timestamp: new Date().toISOString(),
        metrics: {
          ...this.extractRelevantMetrics()
        }
      };
    }
    
    // Create and return the event
    const eventData: InsertMetaCognitiveEvent = {
      type: effectiveTemplate.type,
      description,
      details,
      confidence: effectiveTemplate.confidenceBase,
      impact: effectiveTemplate.impactBase,
      sourceContext: effectiveTemplate.sourceContext
    };
    
    // Update processing stats
    this.updateProcessingStats(eventData);
    
    return createMetaCognitiveEvent(eventData);
  }
  
  /**
   * Enrich an existing event with additional context
   * 
   * @param event - Event to enrich
   * @returns Enriched event
   */
  public enrichEvent(event: MetaCognitiveEvent): MetaCognitiveEvent {
    // Make a copy to avoid mutating the original
    const enriched = { ...event };
    const details = { ...(enriched.details || {}) };
    
    // Add context information if not already present
    if (!details.contextInfo && this.qctfContext) {
      details.contextInfo = {
        qctf: this.qctfContext.history[0]?.qctf || 0,
        coherence: this.qctfContext.ci || 0,
        systemMetrics: {
          gef: this.qctfContext.gef || 0,
          qeai: this.qctfContext.qeai || 0
        }
      };
    }
    
    // Add system context if not already present
    if (!details.systemContext && Object.keys(this.systemContext).length > 0) {
      details.systemContext = {
        timestamp: new Date().toISOString(),
        metrics: {
          ...this.extractRelevantMetrics()
        }
      };
    }
    
    // Add enrichment metadata
    details.enriched = {
      timestamp: new Date().toISOString(),
      originalConfidence: enriched.confidence
    };
    
    // Update the event
    enriched.details = details;
    
    return enriched;
  }
  
  /**
   * Process a batch of events, enriching them and aggregating connections
   * 
   * @param events - Array of events to process
   * @returns Processed events and relation map
   */
  public processBatch(events: MetaCognitiveEvent[]): {
    processedEvents: MetaCognitiveEvent[];
    relationMap: Map<string, string[]>;
    stats: EventProcessingStats;
  } {
    const startTime = Date.now();
    const processedEvents: MetaCognitiveEvent[] = [];
    const relationMap = new Map<string, string[]>();
    
    // Reset processing stats
    this.processingStats = {
      eventsProcessed: 0,
      eventsByType: {},
      averageConfidence: 0,
      highImpactCount: 0,
      lowConfidenceCount: 0,
      processingTime: 0
    };
    
    // Process each event
    for (const event of events) {
      // Enrich the event
      const enriched = this.enrichEvent(event);
      
      // Find potential relations to other events
      const relatedEvents: string[] = this.findPotentialRelations(enriched, events);
      if (relatedEvents.length > 0) {
        relationMap.set(enriched.id, relatedEvents);
      }
      
      // Add the enriched event to results
      processedEvents.push(enriched);
    }
    
    // Calculate processing time
    this.processingStats.processingTime = Date.now() - startTime;
    
    // Calculate average confidence
    if (this.processingStats.eventsProcessed > 0) {
      this.processingStats.averageConfidence /= this.processingStats.eventsProcessed;
    }
    
    return {
      processedEvents,
      relationMap,
      stats: { ...this.processingStats }
    };
  }
  
  /**
   * Get current processing statistics
   * 
   * @returns Processing statistics
   */
  public getProcessingStats(): EventProcessingStats {
    return { ...this.processingStats };
  }
  
  /**
   * Process a template string by replacing parameters
   * 
   * @param template - Template string with placeholders
   * @param params - Parameter values to insert
   * @returns Processed string
   */
  private processTemplateString(template: string, params: Record<string, any>): string {
    let result = template;
    
    // Replace all occurrences of ${paramName} with the parameter value
    for (const [key, value] of Object.entries(params)) {
      const placeholder = new RegExp(`\\$\\{${key}\\}`, 'g');
      result = result.replace(placeholder, String(value));
    }
    
    return result;
  }
  
  /**
   * Process a template object by replacing parameters in all string values
   * 
   * @param template - Template object with placeholders
   * @param params - Parameter values to insert
   * @returns Processed object
   */
  private processTemplateObject(template: Record<string, any>, params: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(template)) {
      if (typeof value === 'string') {
        result[key] = this.processTemplateString(value, params);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.processTemplateObject(value, params);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
  
  /**
   * Extract relevant metrics from system context
   * 
   * @returns Relevant metrics for event context
   */
  private extractRelevantMetrics(): Record<string, any> {
    const metrics: Record<string, any> = {};
    
    // Extract module metrics if available
    if (this.systemContext.modules) {
      metrics.modules = {};
      for (const [moduleName, moduleData] of Object.entries(this.systemContext.modules)) {
        metrics.modules[moduleName] = {
          coherence: (moduleData as any).coherence || 0,
          activity: (moduleData as any).activity || 0
        };
      }
    }
    
    // Extract QRN metrics if available
    if (this.systemContext.qrn) {
      metrics.qrn = {
        nodeCount: (this.systemContext.qrn as any).nodeCount || 0,
        flowMetric: (this.systemContext.qrn as any).flowMetric || 0
      };
    }
    
    // Extract system load metrics if available
    if (this.systemContext.system) {
      metrics.system = {
        cpu: (this.systemContext.system as any).cpu || 0,
        memory: (this.systemContext.system as any).memory || 0,
        activeConnections: (this.systemContext.system as any).connections || 0
      };
    }
    
    return metrics;
  }
  
  /**
   * Find potential relations between events
   * 
   * @param event - Event to find relations for
   * @param allEvents - All events to search through
   * @returns Array of related event IDs
   */
  private findPotentialRelations(
    event: MetaCognitiveEvent,
    allEvents: MetaCognitiveEvent[]
  ): string[] {
    const relatedIds: string[] = [];
    
    // Skip self in search
    const otherEvents = allEvents.filter(e => e.id !== event.id);
    
    for (const otherEvent of otherEvents) {
      // Check for same type
      if (event.type === otherEvent.type) {
        relatedIds.push(otherEvent.id);
        continue;
      }
      
      // Check for time proximity (events within 5 seconds)
      const eventTime = new Date(event.createdAt).getTime();
      const otherTime = new Date(otherEvent.createdAt).getTime();
      if (Math.abs(eventTime - otherTime) < 5000) {
        relatedIds.push(otherEvent.id);
        continue;
      }
      
      // Check for shared source context
      if (event.sourceContext && otherEvent.sourceContext && 
          event.sourceContext === otherEvent.sourceContext) {
        relatedIds.push(otherEvent.id);
        continue;
      }
    }
    
    return relatedIds;
  }
  
  /**
   * Update processing statistics with new event data
   * 
   * @param eventData - Event data to process
   */
  private updateProcessingStats(eventData: InsertMetaCognitiveEvent): void {
    // Increment total count
    this.processingStats.eventsProcessed++;
    
    // Update event type counts
    this.processingStats.eventsByType[eventData.type] = 
      (this.processingStats.eventsByType[eventData.type] || 0) + 1;
    
    // Update confidence total (for averaging later)
    this.processingStats.averageConfidence += eventData.confidence || 0;
    
    // Update impact counts
    if ((eventData.impact || 0) > 0.7) {
      this.processingStats.highImpactCount++;
    }
    
    // Update confidence counts
    if ((eventData.confidence || 0) < 0.5) {
      this.processingStats.lowConfidenceCount++;
    }
  }
  
  /**
   * Register default event templates
   */
  private registerDefaultTemplates(): void {
    // Coherence Threshold Breach Template
    this.registerTemplate({
      type: 'coherence_threshold_breach',
      description: 'System coherence threshold breach detected: ${magnitude}% ${direction} change',
      confidenceBase: 0.85,
      impactBase: 0.7,
      sourceContext: 'meta_cognitive_event_builder',
      detailsTemplate: {
        previousCoherence: '${previousValue}',
        currentCoherence: '${currentValue}',
        changeMagnitude: '${magnitude}',
        direction: '${direction}',
        threshold: '${threshold}',
        recommends: 'System introspection and validation of current operational state'
      }
    });
    
    // Cognitive Breakthrough Template
    this.registerTemplate({
      type: 'cognitive_breakthrough',
      description: 'Cognitive breakthrough detected: ${insightType}',
      confidenceBase: 0.75,
      impactBase: 0.8,
      sourceContext: 'meta_cognitive_event_builder',
      detailsTemplate: {
        insightType: '${insightType}',
        insightOrigin: '${origin}',
        detectionConfidence: '${confidence}',
        supportingEvidenceCount: '${evidenceCount}',
        potentialApplications: '${applications}'
      }
    });
    
    // Resonance Pattern Template
    this.registerTemplate({
      type: 'resonance_pattern',
      description: 'Detected ${patternType} resonance pattern with ${frequency} frequency',
      confidenceBase: 0.7,
      impactBase: 0.6,
      sourceContext: 'meta_cognitive_event_builder',
      detailsTemplate: {
        patternType: '${patternType}',
        frequency: '${frequency}',
        amplitude: '${amplitude}',
        duration: '${duration}',
        correlatedMetrics: '${metrics}'
      }
    });
    
    // Quantum Potential Template
    this.registerTemplate({
      type: 'quantum_potential',
      description: 'Quantum potential field detected: ${fieldStrength} strength, ${stability} stability',
      confidenceBase: 0.65,
      impactBase: 0.75,
      sourceContext: 'meta_cognitive_event_builder',
      detailsTemplate: {
        fieldType: '${fieldType}',
        fieldStrength: '${fieldStrength}',
        stability: '${stability}',
        harmonicProfile: '${harmonics}',
        suggestedApplications: '${applications}'
      }
    });
    
    // Fractal Recursion Template
    this.registerTemplate({
      type: 'fractal_recursion',
      description: 'Fractal recursion pattern detected at depth ${depth}',
      confidenceBase: 0.8,
      impactBase: 0.65,
      sourceContext: 'meta_cognitive_event_builder',
      detailsTemplate: {
        depth: '${depth}',
        complexity: '${complexity}',
        selfSimilarity: '${similarity}',
        dimension: '${dimension}',
        contextualMetrics: '${metrics}'
      }
    });
  }
}

export default MetaCognitiveEventBuilder;