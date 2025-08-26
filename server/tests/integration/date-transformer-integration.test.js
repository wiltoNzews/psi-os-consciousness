/**
 * Integration Tests for DateTransformer
 * 
 * This test suite validates DateTransformer's integration with other components
 * using real-world data scenarios and boundary conditions.
 * 
 * Following OROBORO's approach, we test:
 * 1. Boundary conditions (invalid dates, edge cases)
 * 2. Circular references
 * 3. Real-world data patterns
 * 4. Performance metrics
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { DateTransformer } from '../../utils/DateTransformer.js';
import { MetaCognitiveEventBuilder } from '../../services/utils/MetaCognitiveEventBuilder.ts';
import { EnhancedMockPersistenceLayer } from '../mocks/enhanced-mock-persistence-layer.ts';

// Performance tracking (OROBORO-inspired)
const timers = {};

function startTimer(stage) {
  timers[stage] = performance.now();
  return timers[stage];
}

function endTimer(stage) {
  const endTime = performance.now();
  const duration = endTime - (timers[stage] || endTime);
  console.log(`[TIMER] Stage ${stage} took ${duration.toFixed(2)}ms`);
  return duration;
}

describe('DateTransformer Integration Tests', () => {
  let persistenceLayer;

  beforeEach(() => {
    persistenceLayer = new EnhancedMockPersistenceLayer();
    // Reset timers
    Object.keys(timers).forEach(key => delete timers[key]);
  });

  afterEach(async () => {
    await persistenceLayer.clear();
  });

  // Test 1: Basic date transformation with persistence
  test('transforms dates correctly when saving and loading objects', async () => {
    startTimer('basic-transform');
    
    // Create test object with dates
    const testObj = {
      id: 'test-1',
      created: new Date('2025-03-26T00:00:00Z'),
      updated: new Date('2025-03-26T12:30:45Z'),
      metadata: {
        processedAt: new Date('2025-03-26T12:45:00Z')
      }
    };
    
    // Save object
    await persistenceLayer.save('date-test-1', testObj);
    
    // Load object
    const loaded = await persistenceLayer.load('date-test-1');
    
    endTimer('basic-transform');
    
    // Verify dates are preserved as Date objects
    expect(loaded.created instanceof Date).toBe(true);
    expect(loaded.updated instanceof Date).toBe(true);
    expect(loaded.metadata.processedAt instanceof Date).toBe(true);
    
    // Verify date values are preserved
    expect(loaded.created.toISOString()).toBe('2025-03-26T00:00:00.000Z');
    expect(loaded.updated.toISOString()).toBe('2025-03-26T12:30:45.000Z');
    expect(loaded.metadata.processedAt.toISOString()).toBe('2025-03-26T12:45:00.000Z');
  });

  // Test 2: Boundary conditions (invalid dates)
  test('handles invalid date inputs gracefully', async () => {
    startTimer('invalid-dates');
    
    // Test with invalid date strings
    const invalidDateStr = 'not-a-date';
    const result1 = DateTransformer.parseWithDates(`{"date":"${invalidDateStr}"}`);
    
    // Test with invalid Date objects
    const invalidDate = new Date('invalid');
    const serialized = DateTransformer.stringifyWithDates({ date: invalidDate });
    const result2 = DateTransformer.parseWithDates(serialized);
    
    endTimer('invalid-dates');
    
    // Valid data should not be lost, invalid dates should be handled gracefully
    expect(result1.date).toBe('not-a-date');
    expect(!isNaN(result2.date) || result2.date === null || typeof result2.date === 'string').toBe(true);
  });

  // Test 3: Circular references
  test('handles objects with circular references', async () => {
    startTimer('circular-refs');
    
    // Create object with circular reference
    const parent = { 
      id: 'parent', 
      name: 'Parent Object',
      created: new Date('2025-03-26T00:00:00Z')
    };
    const child = { 
      id: 'child', 
      name: 'Child Object', 
      parent: parent,
      created: new Date('2025-03-26T01:00:00Z')
    };
    parent.child = child; // Create circular reference
    
    // Save object with circular reference
    await persistenceLayer.save('circular-test', parent);
    
    // Load object
    const loaded = await persistenceLayer.load('circular-test');
    
    endTimer('circular-refs');
    
    // Verify circular reference is handled
    expect(loaded.id).toBe('parent');
    expect(loaded.created instanceof Date).toBe(true);
    expect(loaded.child.created instanceof Date).toBe(true);
    expect(loaded.child.id).toBe('child');
    
    // Circular reference should be preserved with a marker
    expect(loaded.child.parent).toBe('[Circular Reference]');
  });

  // Test 4: Integration with MetaCognitiveEventBuilder
  test('integrates correctly with MetaCognitiveEventBuilder', async () => {
    startTimer('event-builder-integration');
    
    // Create a meta-cognitive event using the builder
    const event = new MetaCognitiveEventBuilder()
      .withType('system:test')
      .withDescription('Integration test event')
      .withConfidence(0.95)
      .withSourceContext({
        source: 'integration-test',
        component: 'DateTransformer',
        timestamp: new Date().toISOString()
      })
      .withDetails({
        testCase: 'integration-4',
        executedAt: new Date()
      })
      .build();
    
    // Save the event
    await persistenceLayer.save(`event:${event.id}`, event);
    
    // Load the event
    const loadedEvent = await persistenceLayer.load(`event:${event.id}`);
    
    endTimer('event-builder-integration');
    
    // Verify event properties
    expect(loadedEvent.id).toBe(event.id);
    expect(loadedEvent.type).toBe('system:test');
    expect(loadedEvent.createdAt instanceof Date).toBe(true);
    expect(loadedEvent.confidence).toBe(0.95);
    
    // Verify sourceContext is a string (as per schema)
    expect(typeof loadedEvent.sourceContext).toBe('string');
    
    // Parse sourceContext
    const sourceContext = JSON.parse(loadedEvent.sourceContext);
    expect(sourceContext.source).toBe('integration-test');
    expect(sourceContext.component).toBe('DateTransformer');
  });

  // Test 5: Stress test with complex data
  test('handles complex nested data with multiple dates', async () => {
    startTimer('complex-data');
    
    // Create a complex object with multiple nested dates
    const complexData = {
      id: 'complex-1',
      createdAt: new Date(),
      sessions: [
        { 
          id: 'session-1', 
          startTime: new Date('2025-03-25T10:00:00Z'),
          endTime: new Date('2025-03-25T11:30:00Z'),
          metrics: {
            responseTime: 245,
            lastUpdated: new Date('2025-03-25T11:25:00Z')
          }
        },
        { 
          id: 'session-2', 
          startTime: new Date('2025-03-26T09:00:00Z'),
          endTime: new Date('2025-03-26T10:45:00Z'),
          metrics: {
            responseTime: 198,
            lastUpdated: new Date('2025-03-26T10:40:00Z')
          }
        }
      ],
      analytics: {
        dailyStats: [
          { date: new Date('2025-03-25'), count: 325, updated: new Date('2025-03-26T00:05:00Z') },
          { date: new Date('2025-03-26'), count: 412, updated: new Date('2025-03-27T00:05:00Z') }
        ],
        processingInfo: {
          lastRun: new Date(),
          nextScheduled: new Date(Date.now() + 86400000), // tomorrow
          configuration: {
            effectiveFrom: new Date('2025-01-01'),
            modifiedAt: new Date()
          }
        }
      }
    };
    
    // Save complex data
    await persistenceLayer.save('complex-data-test', complexData);
    
    // Load complex data
    const loaded = await persistenceLayer.load('complex-data-test');
    
    endTimer('complex-data');
    
    // Verify all dates are preserved
    expect(loaded.createdAt instanceof Date).toBe(true);
    expect(loaded.sessions[0].startTime instanceof Date).toBe(true);
    expect(loaded.sessions[0].endTime instanceof Date).toBe(true);
    expect(loaded.sessions[0].metrics.lastUpdated instanceof Date).toBe(true);
    expect(loaded.sessions[1].startTime instanceof Date).toBe(true);
    expect(loaded.sessions[1].endTime instanceof Date).toBe(true);
    expect(loaded.sessions[1].metrics.lastUpdated instanceof Date).toBe(true);
    expect(loaded.analytics.dailyStats[0].date instanceof Date).toBe(true);
    expect(loaded.analytics.dailyStats[0].updated instanceof Date).toBe(true);
    expect(loaded.analytics.dailyStats[1].date instanceof Date).toBe(true);
    expect(loaded.analytics.dailyStats[1].updated instanceof Date).toBe(true);
    expect(loaded.analytics.processingInfo.lastRun instanceof Date).toBe(true);
    expect(loaded.analytics.processingInfo.nextScheduled instanceof Date).toBe(true);
    expect(loaded.analytics.processingInfo.configuration.effectiveFrom instanceof Date).toBe(true);
    expect(loaded.analytics.processingInfo.configuration.modifiedAt instanceof Date).toBe(true);
    
    // Verify specific date values
    expect(loaded.sessions[0].startTime.toISOString()).toBe('2025-03-25T10:00:00.000Z');
    expect(loaded.analytics.dailyStats[0].date.toISOString()).toBe('2025-03-25T00:00:00.000Z');
    expect(loaded.analytics.processingInfo.configuration.effectiveFrom.toISOString()).toBe('2025-01-01T00:00:00.000Z');
  });

  // Test 6: Full pipeline test (OROBORO-inspired)
  test('flows through the full transformation pipeline', async () => {
    // 0-Start: Initialize the pipeline
    startTimer('0-Start');
    const sourceData = {
      id: 'pipeline-test',
      timestamp: new Date(),
      metadata: { 
        source: 'integration-test',
        flow: 'full-pipeline' 
      }
    };
    endTimer('0-Start');
    
    // 1-Define: Create the test event
    startTimer('1-Define');
    const event = new MetaCognitiveEventBuilder()
      .withType('system:pipeline-test')
      .withDescription('Testing full transformation pipeline')
      .withConfidence(1.0)
      .withSourceContext(sourceData.metadata)
      .withDetails({
        source: sourceData,
        intent: 'full-pipeline-validation',
        timestamps: {
          created: new Date(),
          processed: new Date(Date.now() + 1000) // 1 second later
        }
      })
      .build();
    endTimer('1-Define');
    
    // 2-Store: Serialize and save event
    startTimer('2-Store');
    await persistenceLayer.save(`pipeline:${event.id}`, event);
    endTimer('2-Store');
    
    // 3-Process: Load and process event
    startTimer('3-Process');
    const loadedEvent = await persistenceLayer.load(`pipeline:${event.id}`);
    
    // Verify loaded event
    expect(loadedEvent.id).toBe(event.id);
    expect(loadedEvent.type).toBe('system:pipeline-test');
    expect(loadedEvent.createdAt instanceof Date).toBe(true);
    endTimer('3-Process');
    
    // 4-Enhance: Modify and update event
    startTimer('4-Enhance');
    loadedEvent.details = JSON.stringify({
      ...JSON.parse(loadedEvent.details),
      enhancedAt: new Date(),
      enhancementType: 'integration-test'
    });
    
    // Save enhanced event
    await persistenceLayer.save(`pipeline:${loadedEvent.id}:enhanced`, loadedEvent);
    endTimer('4-Enhance');
    
    // 5-Verify: Retrieve and verify enhanced event
    startTimer('5-Verify');
    const enhancedEvent = await persistenceLayer.load(`pipeline:${loadedEvent.id}:enhanced`);
    
    // Verify enhanced event
    expect(enhancedEvent.id).toBe(event.id);
    expect(enhancedEvent.createdAt instanceof Date).toBe(true);
    
    // Parse details
    const details = JSON.parse(enhancedEvent.details);
    expect(details.enhancementType).toBe('integration-test');
    expect(details.enhancedAt instanceof Date).toBe(true);
    
    // Calculate total pipeline time
    const startTime = timers['0-Start'] || 0;
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    console.log(`[TIMER] Total pipeline execution time: ${totalTime.toFixed(2)}ms`);
    
    // Verify pipeline performance is acceptable
    expect(totalTime).toBeLessThan(30000); // Should complete within 30 seconds
    endTimer('5-Verify');
  });
});