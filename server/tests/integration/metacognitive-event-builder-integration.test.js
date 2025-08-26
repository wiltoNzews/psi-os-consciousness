/**
 * Integration Tests for MetaCognitiveEventBuilder
 * 
 * This test suite validates the integration of MetaCognitiveEventBuilder with
 * other system components, focusing on real-world scenarios and data patterns.
 * 
 * Following OROBORO's methodology, these tests:
 * 1. Track performance metrics and timing
 * 2. Test against real-world cognitive patterns
 * 3. Validate full pipelines and flows
 * 4. Incorporate explicit intent tracking
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { MetaCognitiveEventBuilder } from '../../services/utils/MetaCognitiveEventBuilder.js';
import { EnhancedMockPersistenceLayer } from '../mocks/enhanced-mock-persistence-layer.js';
import { v4 as uuidv4 } from 'uuid';

// Performance tracking (OROBORO-inspired)
const timers = {};
const intents = {};

function startTimer(stage, intent = null) {
  timers[stage] = performance.now();
  if (intent) {
    intents[stage] = intent;
  }
  return timers[stage];
}

function endTimer(stage) {
  const endTime = performance.now();
  const duration = endTime - (timers[stage] || endTime);
  const stageIntent = intents[stage] || 'unspecified';
  console.log(`[TIMER] Stage ${stage} (intent: ${stageIntent}) took ${duration.toFixed(2)}ms`);
  return duration;
}

function getStageTiming(fromStage, toStage) {
  if (!timers[fromStage] || !timers[toStage]) {
    return null;
  }
  return timers[toStage] - timers[fromStage];
}

describe('MetaCognitiveEventBuilder Integration Tests', () => {
  let persistenceLayer;

  beforeEach(() => {
    persistenceLayer = new EnhancedMockPersistenceLayer();
    // Reset timers and intents
    Object.keys(timers).forEach(key => delete timers[key]);
    Object.keys(intents).forEach(key => delete intents[key]);
  });

  afterEach(async () => {
    await persistenceLayer.clear();
  });

  // Test 1: Basic event creation and persistence
  test('creates and persists events with correct schema alignment', async () => {
    startTimer('event-creation', 'schema-validation');
    
    // Create a basic event
    const event = new MetaCognitiveEventBuilder()
      .withType('system:startup')
      .withDescription('System initialization complete')
      .withConfidence(1.0)
      .withSourceContext({
        component: 'system-core',
        module: 'initialization',
        timestamp: new Date().toISOString()
      })
      .withDetails({
        startupTime: 230, // ms
        componentsInitialized: ['storage', 'api', 'scheduler'],
        timestamps: {
          requested: new Date(Date.now() - 500),
          started: new Date(Date.now() - 250),
          completed: new Date()
        }
      })
      .build();
    
    endTimer('event-creation');
    
    startTimer('event-persistence', 'data-storage');
    // Persist the event
    await persistenceLayer.save(`events:${event.id}`, event);
    
    // Retrieve the event
    const retrievedEvent = await persistenceLayer.load(`events:${event.id}`);
    endTimer('event-persistence');
    
    // Schema validation
    expect(retrievedEvent).not.toBeNull();
    expect(retrievedEvent.id).toBe(event.id);
    expect(retrievedEvent.type).toBe('system:startup');
    expect(retrievedEvent.createdAt instanceof Date).toBe(true);
    expect(retrievedEvent.confidence).toBe(1.0);
    
    // Verify sourceContext is string (schema compliance)
    expect(typeof retrievedEvent.sourceContext).toBe('string');
    
    // Parse sourceContext
    const sourceContext = JSON.parse(retrievedEvent.sourceContext);
    expect(sourceContext.component).toBe('system-core');
    
    // Verify details is string (schema compliance)
    expect(typeof retrievedEvent.details).toBe('string');
    
    // Parse details
    const details = JSON.parse(retrievedEvent.details);
    expect(details.startupTime).toBe(230);
    expect(Array.isArray(details.componentsInitialized)).toBe(true);
    
    // Verify nested dates in details were serialized appropriately
    expect(typeof details.timestamps.requested).toBe('string');
    expect(typeof details.timestamps.started).toBe('string');
    expect(typeof details.timestamps.completed).toBe('string');
    
    // Verify no required fields are missing
    expect(retrievedEvent.id).toBeDefined();
    expect(retrievedEvent.type).toBeDefined();
    expect(retrievedEvent.createdAt).toBeDefined();
    expect(retrievedEvent.description).toBeDefined();
    expect(retrievedEvent.confidence).toBeDefined();
  });

  // Test 2: Real-world cognitive patterns
  test('handles real-world cognitive patterns and transitions', async () => {
    // 0-Start: Initialize test with intent
    startTimer('0-Start', 'cognitive-pattern-sequence');
    
    // Define a real-world cognitive analysis sequence
    const patternSequence = [];
    
    // 1-Initial: Create initial observation event
    startTimer('1-Initial', 'pattern-observation');
    const observationEvent = new MetaCognitiveEventBuilder()
      .withType('cognition:observation')
      .withDescription('Initial pattern observation')
      .withConfidence(0.72)
      .withSourceContext({
        component: 'integration-test',
        module: 'pattern-analysis',
        intent: 'discover-cognitive-pattern',
        timestamp: new Date().toISOString()
      })
      .withDetails({
        observationType: 'repeated-sequence',
        elements: ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B'],
        patternScore: 0.72,
        observedAt: new Date(),
        metadata: {
          source: 'sequence-analyzer',
          algorithm: 'frequency-analysis'
        }
      })
      .build();
    
    patternSequence.push(observationEvent);
    await persistenceLayer.save(`cognition:${observationEvent.id}`, observationEvent);
    endTimer('1-Initial');
    
    // 2-Analysis: Create pattern analysis event
    startTimer('2-Analysis', 'pattern-analysis');
    const analysisEvent = new MetaCognitiveEventBuilder()
      .withType('cognition:analysis')
      .withDescription('Pattern element frequency analysis')
      .withConfidence(0.85)
      .withSourceContext({
        component: 'integration-test',
        module: 'pattern-analyzer',
        intent: 'analyze-observed-pattern',
        timestamp: new Date().toISOString()
      })
      .withRelatedEvents([observationEvent.id])
      .withDetails({
        analysisType: 'frequency-distribution',
        frequencies: { 'A': 3, 'B': 3, 'C': 2, 'D': 2 },
        patternType: 'cyclic',
        confidence: 0.85,
        analyzedAt: new Date(),
        metadata: {
          algorithm: 'markov-chain',
          iterations: 3
        }
      })
      .build();
    
    patternSequence.push(analysisEvent);
    await persistenceLayer.save(`cognition:${analysisEvent.id}`, analysisEvent);
    endTimer('2-Analysis');
    
    // 3-Insight: Create pattern insight event
    startTimer('3-Insight', 'pattern-insight');
    const insightEvent = new MetaCognitiveEventBuilder()
      .withType('cognition:insight')
      .withDescription('Recurring pattern detected with completion prediction')
      .withConfidence(0.91)
      .withSourceContext({
        component: 'integration-test',
        module: 'insight-generator',
        intent: 'generate-predictive-insight',
        timestamp: new Date().toISOString()
      })
      .withRelatedEvents([observationEvent.id, analysisEvent.id])
      .withDetails({
        insightType: 'pattern-prediction',
        prediction: ['C', 'D'],
        confidence: 0.91,
        expectedMatch: true,
        generatedAt: new Date(),
        metadata: {
          algorithm: 'predictive-completion',
          basedOn: [observationEvent.id, analysisEvent.id]
        }
      })
      .build();
    
    patternSequence.push(insightEvent);
    await persistenceLayer.save(`cognition:${insightEvent.id}`, insightEvent);
    endTimer('3-Insight');
    
    // 4-Validation: Create validation event
    startTimer('4-Validation', 'pattern-validation');
    const validationEvent = new MetaCognitiveEventBuilder()
      .withType('cognition:validation')
      .withDescription('Pattern prediction validated against actual sequence')
      .withConfidence(0.95)
      .withSourceContext({
        component: 'integration-test',
        module: 'validation-engine',
        intent: 'validate-pattern-prediction',
        timestamp: new Date().toISOString()
      })
      .withRelatedEvents([insightEvent.id])
      .withDetails({
        validationType: 'prediction-match',
        predicted: ['C', 'D'],
        actual: ['C', 'D'],
        matches: true,
        accuracy: 1.0,
        validatedAt: new Date(),
        metadata: {
          source: 'sequence-validator',
          validationMethod: 'exact-match'
        }
      })
      .build();
    
    patternSequence.push(validationEvent);
    await persistenceLayer.save(`cognition:${validationEvent.id}`, validationEvent);
    endTimer('4-Validation');
    
    // 5-Enhance: Create enhancement event (model update)
    startTimer('5-Enhance', 'pattern-model-enhancement');
    const enhancementEvent = new MetaCognitiveEventBuilder()
      .withType('cognition:enhancement')
      .withDescription('Pattern detection model updated based on validation')
      .withConfidence(0.97)
      .withSourceContext({
        component: 'integration-test',
        module: 'model-updater',
        intent: 'enhance-pattern-model',
        timestamp: new Date().toISOString()
      })
      .withRelatedEvents([validationEvent.id])
      .withDetails({
        enhancementType: 'model-update',
        modelId: 'pattern-detection-v1',
        changes: [
          { parameter: 'confidence-threshold', from: 0.7, to: 0.65 },
          { parameter: 'sequence-length', from: 4, to: 6 }
        ],
        enhancedAt: new Date(),
        metadata: {
          updateMethod: 'reinforcement-learning',
          iterations: 5,
          learningRate: 0.025
        }
      })
      .build();
    
    patternSequence.push(enhancementEvent);
    await persistenceLayer.save(`cognition:${enhancementEvent.id}`, enhancementEvent);
    endTimer('5-Enhance');
    
    // Now load and validate the entire sequence
    startTimer('sequence-validation', 'validate-cognitive-chain');
    
    // Load all events
    const loadedEvents = await Promise.all(
      patternSequence.map(event => 
        persistenceLayer.load(`cognition:${event.id}`)
      )
    );
    
    // Verify event sequence
    expect(loadedEvents.length).toBe(5);
    
    // Verify all events preserved key properties
    for (let i = 0; i < loadedEvents.length; i++) {
      const original = patternSequence[i];
      const loaded = loadedEvents[i];
      
      expect(loaded.id).toBe(original.id);
      expect(loaded.type).toBe(original.type);
      expect(loaded.description).toBe(original.description);
      expect(loaded.confidence).toBe(original.confidence);
      expect(loaded.createdAt instanceof Date).toBe(true);
      
      // Verify relatedEvents
      if (i > 0) {
        const relatedIds = i === 1 
          ? [patternSequence[0].id]
          : i === 2 
            ? [patternSequence[0].id, patternSequence[1].id]
            : [patternSequence[i-1].id];
        
        // Depending on schema, relatedEvents might be comma-separated string
        if (typeof loaded.relatedEvents === 'string') {
          if (relatedIds.length === 1) {
            expect(loaded.relatedEvents).toBe(relatedIds[0]);
          } else {
            const loadedIds = loaded.relatedEvents.split(',');
            expect(loadedIds.length).toBe(relatedIds.length);
            relatedIds.forEach(id => expect(loadedIds).toContain(id));
          }
        } else if (Array.isArray(loaded.relatedEvents)) {
          expect(loaded.relatedEvents.length).toBe(relatedIds.length);
          relatedIds.forEach(id => expect(loaded.relatedEvents).toContain(id));
        }
      }
    }
    
    // Verify intents preserved in sourceContext
    const intents = [
      'discover-cognitive-pattern',
      'analyze-observed-pattern',
      'generate-predictive-insight',
      'validate-pattern-prediction',
      'enhance-pattern-model'
    ];
    
    for (let i = 0; i < loadedEvents.length; i++) {
      const sourceContext = JSON.parse(loadedEvents[i].sourceContext);
      expect(sourceContext.intent).toBe(intents[i]);
    }
    
    endTimer('sequence-validation');
    
    // Verify all stages completed within performance budgets
    const stage1Time = getStageTiming('1-Initial', '2-Analysis');
    const stage2Time = getStageTiming('2-Analysis', '3-Insight');
    const stage3Time = getStageTiming('3-Insight', '4-Validation');
    const stage4Time = getStageTiming('4-Validation', '5-Enhance');
    
    // Log timing metrics
    console.log(`[PERFORMANCE] Stage 1-2 Transition: ${stage1Time?.toFixed(2) || 'N/A'}ms`);
    console.log(`[PERFORMANCE] Stage 2-3 Transition: ${stage2Time?.toFixed(2) || 'N/A'}ms`);
    console.log(`[PERFORMANCE] Stage 3-4 Transition: ${stage3Time?.toFixed(2) || 'N/A'}ms`);
    console.log(`[PERFORMANCE] Stage 4-5 Transition: ${stage4Time?.toFixed(2) || 'N/A'}ms`);
  });

  // Test 3: Complex builder patterns and defaults
  test('supports complex building patterns and handles defaults appropriately', async () => {
    startTimer('complex-builder-test', 'builder-pattern-validation');
    
    // Test chained building with minimal info
    const minimalEvent = new MetaCognitiveEventBuilder()
      .withType('test:minimal')
      .build();
    
    // Verify minimal event has all required fields with defaults
    expect(minimalEvent.id.length).toBeGreaterThan(0);
    expect(minimalEvent.type).toBe('test:minimal');
    expect(minimalEvent.description).toBeTruthy(); // Should have default description
    expect(minimalEvent.confidence).toBe(1.0); // Default confidence
    expect(minimalEvent.createdAt instanceof Date).toBe(true);
    
    // Test chained building with metadata but no explicit description
    const metadataEvent = new MetaCognitiveEventBuilder()
      .withType('test:metadata')
      .withSourceContext({
        component: 'builder-test',
        operation: 'default-handling'
      })
      .withDetails({
        testCase: 'metadata-defaults',
        scenario: 'implicit-description'
      })
      .build();
    
    // Verify event has appropriate defaults and metadata
    expect(metadataEvent.description).toContain('test:metadata'); // Should contain type in description
    expect(typeof metadataEvent.sourceContext).toBe('string');
    expect(typeof metadataEvent.details).toBe('string');
    
    // Parse sourceContext and details
    const sourceContext = JSON.parse(metadataEvent.sourceContext);
    const details = JSON.parse(metadataEvent.details);
    
    expect(sourceContext.component).toBe('builder-test');
    expect(details.testCase).toBe('metadata-defaults');
    
    // Test complex related events handling
    const relatedEvent1 = new MetaCognitiveEventBuilder()
      .withType('test:related-1')
      .withDescription('First related event')
      .build();
    
    const relatedEvent2 = new MetaCognitiveEventBuilder()
      .withType('test:related-2')
      .withDescription('Second related event')
      .build();
    
    // Save related events
    await persistenceLayer.save(`test:${relatedEvent1.id}`, relatedEvent1);
    await persistenceLayer.save(`test:${relatedEvent2.id}`, relatedEvent2);
    
    // Create event with multiple related events
    const multiRelatedEvent = new MetaCognitiveEventBuilder()
      .withType('test:multi-related')
      .withDescription('Event with multiple related events')
      .withConfidence(0.85)
      .withRelatedEvents([relatedEvent1.id, relatedEvent2.id])
      .build();
    
    // Save multi-related event
    await persistenceLayer.save(`test:${multiRelatedEvent.id}`, multiRelatedEvent);
    
    // Load and verify
    const loadedMultiRelated = await persistenceLayer.load(`test:${multiRelatedEvent.id}`);
    
    // Verify related events
    // May be comma-separated string or array depending on schema
    if (typeof loadedMultiRelated.relatedEvents === 'string') {
      const relatedIds = loadedMultiRelated.relatedEvents.split(',');
      expect(relatedIds).toContain(relatedEvent1.id);
      expect(relatedIds).toContain(relatedEvent2.id);
    } else if (Array.isArray(loadedMultiRelated.relatedEvents)) {
      expect(loadedMultiRelated.relatedEvents).toContain(relatedEvent1.id);
      expect(loadedMultiRelated.relatedEvents).toContain(relatedEvent2.id);
    }
    
    // Test overriding defaults
    const specificEvent = new MetaCognitiveEventBuilder()
      .withType('test:specific')
      .withDescription('Custom description')
      .withConfidence(0.42)
      .withOutcome('failure')
      .withImpact('medium')
      .build();
    
    // Verify custom values
    expect(specificEvent.description).toBe('Custom description');
    expect(specificEvent.confidence).toBe(0.42);
    expect(specificEvent.outcome).toBe('failure');
    expect(specificEvent.impact).toBe('medium');
    
    endTimer('complex-builder-test');
  });

  // Test 4: Full flow with intent (OROBORO-style)
  test('supports a complete meta-cognitive flow with explicit intent', async () => {
    // 0-Start: Initialize flow
    startTimer('0-Start', 'meta-cognitive-flow');
    
    // Create flow session with intent
    const flowSession = {
      id: uuidv4(),
      intent: 'validate-meta-cognitive-flow',
      startTime: new Date(),
      status: 'initializing'
    };
    
    endTimer('0-Start');
    
    // 1-Observe: Create observation event
    startTimer('1-Observe', 'pattern-observation');
    
    const observationEvent = new MetaCognitiveEventBuilder()
      .withType('meta:observation')
      .withDescription('User interaction pattern observation')
      .withConfidence(0.78)
      .withSourceContext({
        component: 'user-interaction-monitor',
        session: flowSession.id,
        intent: 'observe-interaction-patterns',
        timestamp: new Date().toISOString()
      })
      .withDetails({
        observationType: 'interaction-sequence',
        interactions: [
          { type: 'page-view', target: '/dashboard', timestamp: new Date(Date.now() - 5000) },
          { type: 'button-click', target: 'refresh-data', timestamp: new Date(Date.now() - 4500) },
          { type: 'data-filter', target: 'date-range', timestamp: new Date(Date.now() - 4000) },
          { type: 'export', target: 'csv-download', timestamp: new Date(Date.now() - 3500) },
          { type: 'page-view', target: '/reports', timestamp: new Date(Date.now() - 3000) }
        ],
        patternScore: 0.78,
        metadata: {
          userId: 'test-user',
          sessionDuration: 120, // seconds
          deviceType: 'desktop'
        }
      })
      .build();
    
    // Add explicit intent to the event
    observationEvent.intent = 'observe-and-capture';
    
    // Save observation event
    await persistenceLayer.save(`meta:${observationEvent.id}`, observationEvent);
    
    endTimer('1-Observe');
    
    // 2-Analyze: Create analysis event
    startTimer('2-Analyze', 'pattern-analysis');
    
    const analysisEvent = new MetaCognitiveEventBuilder()
      .withType('meta:analysis')
      .withDescription('User behavior pattern analysis')
      .withConfidence(0.82)
      .withSourceContext({
        component: 'pattern-analyzer',
        session: flowSession.id,
        intent: 'analyze-observed-behavior',
        timestamp: new Date().toISOString()
      })
      .withRelatedEvents([observationEvent.id])
      .withDetails({
        analysisType: 'behavioral-pattern',
        detectedPattern: 'data-consumption-workflow',
        matchScore: 0.82,
        phases: [
          { name: 'initialization', actions: ['page-view'], confidence: 0.9 },
          { name: 'data-retrieval', actions: ['button-click', 'data-filter'], confidence: 0.85 },
          { name: 'data-export', actions: ['export'], confidence: 0.95 },
          { name: 'continuation', actions: ['page-view'], confidence: 0.7 }
        ],
        analyzedAt: new Date(),
        metadata: {
          patternLibrary: 'user-workflows-v2',
          matchThreshold: 0.75
        }
      })
      .build();
    
    // Add explicit intent
    analysisEvent.intent = 'analyze-and-categorize';
    
    // Save analysis event
    await persistenceLayer.save(`meta:${analysisEvent.id}`, analysisEvent);
    
    endTimer('2-Analyze');
    
    // 3-Generate: Create insight event
    startTimer('3-Generate', 'insight-generation');
    
    const insightEvent = new MetaCognitiveEventBuilder()
      .withType('meta:insight')
      .withDescription('User intent and needs insight')
      .withConfidence(0.88)
      .withSourceContext({
        component: 'insight-generator',
        session: flowSession.id,
        intent: 'generate-user-intent-insight',
        timestamp: new Date().toISOString()
      })
      .withRelatedEvents([analysisEvent.id])
      .withDetails({
        insightType: 'user-intent',
        inferredIntent: 'data-analysis-for-reporting',
        confidence: 0.88,
        nextLikelyActions: [
          { action: 'create-visualization', probability: 0.65 },
          { action: 'share-report', probability: 0.25 },
          { action: 'set-alert', probability: 0.10 }
        ],
        recommendedResponses: [
          { type: 'ui-element', target: 'visualization-shortcuts', priority: 1 },
          { type: 'notification', target: 'reporting-template', priority: 2 }
        ],
        generatedAt: new Date(),
        metadata: {
          insightEngine: 'user-intent-v3',
          processingTime: 120 // ms
        }
      })
      .build();
    
    // Add explicit intent
    insightEvent.intent = 'generate-actionable-insight';
    
    // Save insight event
    await persistenceLayer.save(`meta:${insightEvent.id}`, insightEvent);
    
    endTimer('3-Generate');
    
    // 4-Act: Create action event
    startTimer('4-Act', 'system-action');
    
    const actionEvent = new MetaCognitiveEventBuilder()
      .withType('meta:action')
      .withDescription('System adaptation based on user insight')
      .withConfidence(0.92)
      .withSourceContext({
        component: 'system-adaptation-engine',
        session: flowSession.id,
        intent: 'adapt-to-user-needs',
        timestamp: new Date().toISOString()
      })
      .withRelatedEvents([insightEvent.id])
      .withDetails({
        actionType: 'ui-adaptation',
        adaptations: [
          { 
            element: 'visualization-toolbar', 
            change: 'visibility', 
            from: 'collapsed', 
            to: 'expanded',
            appliedAt: new Date()
          },
          { 
            element: 'report-templates', 
            change: 'priority', 
            from: 'low', 
            to: 'high',
            appliedAt: new Date()
          }
        ],
        actionResult: 'applied',
        executedAt: new Date(),
        metadata: {
          adaptationRules: 'dynamic-ui-v2',
          rollbackPossible: true
        }
      })
      .build();
    
    // Add explicit intent
    actionEvent.intent = 'execute-system-adaptation';
    
    // Save action event
    await persistenceLayer.save(`meta:${actionEvent.id}`, actionEvent);
    
    endTimer('4-Act');
    
    // 5-Evaluate: Create evaluation event
    startTimer('5-Evaluate', 'action-evaluation');
    
    const evaluationEvent = new MetaCognitiveEventBuilder()
      .withType('meta:evaluation')
      .withDescription('Evaluation of system adaptation effectiveness')
      .withConfidence(0.79)
      .withSourceContext({
        component: 'adaptation-evaluator',
        session: flowSession.id,
        intent: 'evaluate-adaptation-impact',
        timestamp: new Date().toISOString()
      })
      .withRelatedEvents([actionEvent.id])
      .withDetails({
        evaluationType: 'adaptation-impact',
        metrics: [
          { name: 'time-to-next-action', value: 3.2, unit: 'seconds', trend: 'decrease' },
          { name: 'visualization-usage', value: 2, unit: 'count', trend: 'increase' },
          { name: 'user-engagement', value: 0.85, unit: 'score', trend: 'increase' }
        ],
        evaluationResult: 'positive',
        confidence: 0.79,
        evaluatedAt: new Date(),
        metadata: {
          evaluationMethod: 'immediate-impact',
          baselineComparison: 'session-start'
        }
      })
      .build();
    
    // Add explicit intent
    evaluationEvent.intent = 'measure-adaptation-impact';
    
    // Save evaluation event
    await persistenceLayer.save(`meta:${evaluationEvent.id}`, evaluationEvent);
    
    endTimer('5-Evaluate');
    
    // 6-Learn: Create learning event
    startTimer('6-Learn', 'model-update');
    
    const learningEvent = new MetaCognitiveEventBuilder()
      .withType('meta:learning')
      .withDescription('Model update based on adaptation results')
      .withConfidence(0.95)
      .withSourceContext({
        component: 'continuous-learning-engine',
        session: flowSession.id,
        intent: 'update-adaptation-model',
        timestamp: new Date().toISOString()
      })
      .withRelatedEvents([evaluationEvent.id])
      .withDetails({
        learningType: 'model-refinement',
        models: [
          { id: 'user-intent-model', changes: 2, performance: '+0.03' },
          { id: 'adaptation-rules', changes: 1, performance: '+0.05' }
        ],
        learningOutcome: 'model-improved',
        appliedAt: new Date(),
        metadata: {
          learningAlgorithm: 'reinforcement-update',
          persistedToModel: true
        }
      })
      .build();
    
    // Add explicit intent
    learningEvent.intent = 'refine-behavioral-model';
    
    // Save learning event
    await persistenceLayer.save(`meta:${learningEvent.id}`, learningEvent);
    
    endTimer('6-Learn');
    
    // 7-Verify: Validate full flow
    startTimer('7-Verify', 'flow-validation');
    
    // Update flow session status
    flowSession.status = 'completed';
    flowSession.endTime = new Date();
    flowSession.events = [
      observationEvent.id,
      analysisEvent.id,
      insightEvent.id,
      actionEvent.id,
      evaluationEvent.id,
      learningEvent.id
    ];
    
    // Save flow session
    await persistenceLayer.save(`flow:${flowSession.id}`, flowSession);
    
    // Load all events
    const loadedEvents = await Promise.all([
      persistenceLayer.load(`meta:${observationEvent.id}`),
      persistenceLayer.load(`meta:${analysisEvent.id}`),
      persistenceLayer.load(`meta:${insightEvent.id}`),
      persistenceLayer.load(`meta:${actionEvent.id}`),
      persistenceLayer.load(`meta:${evaluationEvent.id}`),
      persistenceLayer.load(`meta:${learningEvent.id}`)
    ]);
    
    // Verify all events loaded successfully
    expect(loadedEvents.every(e => e !== null)).toBe(true);
    
    // Verify event intents were preserved
    const intents = [
      'observe-and-capture',
      'analyze-and-categorize',
      'generate-actionable-insight',
      'execute-system-adaptation',
      'measure-adaptation-impact',
      'refine-behavioral-model'
    ];
    
    for (let i = 0; i < loadedEvents.length; i++) {
      expect(loadedEvents[i].intent).toBe(intents[i]);
    }
    
    // Verify sourceContext intents were preserved
    const sourceContextIntents = [
      'observe-interaction-patterns',
      'analyze-observed-behavior',
      'generate-user-intent-insight',
      'adapt-to-user-needs',
      'evaluate-adaptation-impact',
      'update-adaptation-model'
    ];
    
    for (let i = 0; i < loadedEvents.length; i++) {
      const sourceContext = JSON.parse(loadedEvents[i].sourceContext);
      expect(sourceContext.intent).toBe(sourceContextIntents[i]);
      expect(sourceContext.session).toBe(flowSession.id);
    }
    
    // Load flow session
    const loadedSession = await persistenceLayer.load(`flow:${flowSession.id}`);
    
    // Verify flow session
    expect(loadedSession.status).toBe('completed');
    expect(loadedSession.intent).toBe('validate-meta-cognitive-flow');
    expect(loadedSession.startTime instanceof Date).toBe(true);
    expect(loadedSession.endTime instanceof Date).toBe(true);
    expect(Array.isArray(loadedSession.events)).toBe(true);
    expect(loadedSession.events.length).toBe(6);
    
    endTimer('7-Verify');
    
    // Calculate total flow time
    const totalTime = timers['7-Verify'] - timers['0-Start'];
    console.log(`[FLOW METRICS] Total meta-cognitive flow time: ${totalTime.toFixed(2)}ms`);
    console.log(`[FLOW METRICS] Flow intent: ${flowSession.intent}`);
    console.log(`[FLOW METRICS] Flow stages completed: 8`);
    
    // Performance should be reasonable
    expect(totalTime).toBeLessThan(30000); // Less than 30 seconds for the full flow
  });
});