/**
 * Process Meta-Cognitive Event Utility
 * 
 * This is a centralized utility for standardizing MetaCognitive event creation
 * using the MetaCognitiveEventBuilder to ensure consistency and type safety.
 * 
 * BOUNDARY AWARENESS: This utility enforces a clear boundary between
 * application logic and event creation/processing, serving as the linchpin
 * in the fractal pattern 32×16×8×4×2×1×2×4×8×16×32.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';
import { MetaCognitiveEventBuilder } from './MetaCognitiveEventBuilder.js';
import { metaCognitiveEngine } from '../qrn/meta-cognitive-analysis-engine.js';
import { ensureValidMetaCognitiveEvent } from './MetaCognitiveEventUtility.js';
import { ensureObject, ensureString, ensureStringArray } from './typeConverters.js';

// Source context interface from MetaCognitiveEventBuilder
interface SourceContext {
  source: string;
  operation: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Process a meta cognitive event with standardized builder pattern
 * 
 * BOUNDARY AWARENESS: This is a critical boundary point for event creation
 * across the entire system. All meta-cognitive events should flow through
 * this utility to ensure consistent property naming and validation.
 * 
 * @param type - Event type
 * @param description - Event description
 * @param details - Event details object
 * @param options - Additional options (confidence, impact, etc.)
 * @returns Promise that resolves when the event is processed
 */
export async function processMetaCognitiveEvent(
  type: string,
  description: string,
  details: Record<string, any>,
  options: {
    nodeId?: string;
    confidence?: number;
    impact?: number;
    outcome?: string;
    relatedEvents?: string[];
    sourceContext?: SourceContext | Record<string, any>;
  } = {}
): Promise<void> {
  // Generate IDs
  const id = uuidv4();
  const nodeId = options.nodeId || id;
  
  // Ensure sourceContext has required properties
  let sourceContext: SourceContext;
  
  if (options.sourceContext) {
    const ctx = ensureObject(options.sourceContext);
    sourceContext = {
      source: ctx.source || 'system',
      operation: ctx.operation || ensureString(type, 'unknown'),
      ...ctx
    };
  } else {
    sourceContext = { 
      source: 'system', 
      operation: ensureString(type, 'unknown') 
    };
  }
  
  // Create the event with the builder pattern
  const builder = new MetaCognitiveEventBuilder()
    .withId(id)
    .withNodeId(nodeId)
    .withType(ensureString(type, 'unknown'))
    .withCreatedAt(new Date())
    .withDescription(ensureString(description, 'Event'))
    .withDetails(ensureObject(details, {}))
    .withConfidence(options.confidence ?? 1.0) 
    .withImpact(options.impact ?? 5)
    .withRelatedEvents(options.relatedEvents || []) // Builder will format this as string
    .withOutcome(ensureString(options.outcome || '', ''))
    .withSourceContext(sourceContext); // Builder will stringify this
  
  // Build and process the event
  const event = builder.build();
  
  // Verify the event is properly structured before sending
  const validatedEvent = ensureValidMetaCognitiveEvent(event);
  
  try {
    await metaCognitiveEngine.processEvent(validatedEvent);
  } catch (error) {
    console.error('Error processing meta-cognitive event:', error);
    // Don't rethrow - we don't want event processing failures to break application flow
  }
}

/**
 * Create an error meta cognitive event
 * 
 * BOUNDARY AWARENESS: This is a specialized boundary point for error events
 * that handles the translation from error objects to meta-cognitive events.
 * 
 * @param error - The error that occurred
 * @param context - Additional context about where the error occurred
 * @param options - Additional options (confidence, impact, etc.)
 * @returns Promise that resolves when the event is processed
 */
export async function processErrorEvent(
  error: Error | string,
  context: {
    component: string;
    operation: string;
    data?: any;
  },
  options: {
    nodeId?: string;
    confidence?: number;
    impact?: number;
    relatedEvents?: string[];
  } = {}
): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Process data safely - limiting string length to prevent excessive data in events
  const safeData = context.data ? 
    (typeof context.data === 'string' ? 
      context.data.substring(0, 100) + (context.data.length > 100 ? '...' : '') : 
      context.data) : 
    undefined;
  
  // Create error sourceContext with explicit properties
  const sourceContext: SourceContext = {
    source: ensureString(context.component, 'unknown-component'),
    operation: 'error-handling',
    errorComponent: context.component,
    errorOperation: context.operation
  };
  
  return processMetaCognitiveEvent(
    'error',
    `Error in ${context.component}: ${errorMessage}`,
    {
      component: context.component,
      operation: context.operation,
      error: errorMessage,
      stack: errorStack,
      data: safeData
    },
    {
      nodeId: options.nodeId,
      confidence: options.confidence ?? 1.0,
      impact: options.impact ?? 8,
      relatedEvents: options.relatedEvents ?? [],
      sourceContext
    }
  );
}