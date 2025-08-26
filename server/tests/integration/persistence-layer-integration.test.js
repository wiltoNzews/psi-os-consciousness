/**
 * Integration Tests for EnhancedMockPersistenceLayer
 * 
 * This test suite validates EnhancedMockPersistenceLayer's integration with other components
 * and real-world usage patterns. Following OROBORO methodology, we incorporate:
 * 
 * 1. Intent tracking throughout the pipeline
 * 2. Performance metrics and timing
 * 3. Real-world data patterns and scenarios
 * 4. Edge case handling
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { EnhancedMockPersistenceLayer } from '../mocks/enhanced-mock-persistence-layer.js';
import { MetaCognitiveEventBuilder } from '../../services/utils/MetaCognitiveEventBuilder.js';
import { v4 as uuidv4 } from 'uuid';

// Performance tracking system (OROBORO-style)
const timers = {};
const metrics = {};

function startTimer(stage, intent = 'default') {
  timers[stage] = performance.now();
  // Track intent for this operation
  metrics[stage] = { 
    intent,
    startTime: timers[stage],
    endTime: null,
    duration: null
  };
  return timers[stage];
}

function endTimer(stage) {
  const endTime = performance.now();
  const duration = endTime - (timers[stage] || endTime);
  
  // Update metrics
  if (metrics[stage]) {
    metrics[stage].endTime = endTime;
    metrics[stage].duration = duration;
  }
  
  console.log(`[TIMER] Stage ${stage} (${metrics[stage]?.intent}) took ${duration.toFixed(2)}ms`);
  return duration;
}

function printTimingReport() {
  console.log('\n📊 Performance Metrics Report:');
  console.log('-----------------------------');
  
  Object.keys(metrics).forEach(stage => {
    const m = metrics[stage];
    if (m && m.duration !== null) {
      console.log(`${stage.padEnd(20)} | Intent: ${m.intent.padEnd(25)} | ${m.duration.toFixed(2).padStart(8)} ms`);
    }
  });
  console.log('-----------------------------\n');
}

describe('EnhancedMockPersistenceLayer Integration Tests', () => {
  let persistenceLayer;

  beforeEach(() => {
    persistenceLayer = new EnhancedMockPersistenceLayer();
    // Reset metrics
    Object.keys(timers).forEach(key => delete timers[key]);
    Object.keys(metrics).forEach(key => delete metrics[key]);
  });

  afterEach(async () => {
    await persistenceLayer.clear();
  });

  afterAll(() => {
    printTimingReport();
  });

  // Test 1: Basic CRUD operations with intent tracking
  test('performs basic CRUD operations with intended semantics', async () => {
    // 1. Create operation
    startTimer('create', 'persist-new-entity');
    const testEntity = {
      id: uuidv4(),
      name: 'Test Entity',
      created: new Date(),
      tags: ['test', 'integration', 'persistence']
    };
    
    await persistenceLayer.save(`entity:${testEntity.id}`, testEntity);
    endTimer('create');
    
    // 2. Read operation
    startTimer('read', 'retrieve-entity-state');
    const retrievedEntity = await persistenceLayer.load(`entity:${testEntity.id}`);
    endTimer('read');
    
    // Verification
    expect(retrievedEntity).not.toBeNull();
    expect(retrievedEntity.id).toBe(testEntity.id);
    expect(retrievedEntity.created instanceof Date).toBe(true);
    
    // 3. Update operation
    startTimer('update', 'modify-entity-state');
    retrievedEntity.lastModified = new Date();
    retrievedEntity.status = 'updated';
    retrievedEntity.tags.push('modified');
    
    await persistenceLayer.save(`entity:${retrievedEntity.id}`, retrievedEntity);
    endTimer('update');
    
    // 4. Read updated
    startTimer('read-updated', 'verify-modification');
    const updatedEntity = await persistenceLayer.load(`entity:${testEntity.id}`);
    endTimer('read-updated');
    
    // Verification
    expect(updatedEntity.status).toBe('updated');
    expect(updatedEntity.tags).toContain('modified');
    expect(updatedEntity.lastModified instanceof Date).toBe(true);
    
    // 5. Delete operation
    startTimer('delete', 'remove-entity');
    const deleted = await persistenceLayer.delete(`entity:${testEntity.id}`);
    endTimer('delete');
    
    // Verification
    expect(deleted).toBe(true);
    
    // 6. Verify deletion
    startTimer('verify-deletion', 'confirm-removal');
    const shouldBeNull = await persistenceLayer.load(`entity:${testEntity.id}`);
    endTimer('verify-deletion');
    
    // Verification
    expect(shouldBeNull).toBeNull();
  });

  // Test 2: Batch operations with performance tracking
  test('efficiently handles batch operations with timing metrics', async () => {
    startTimer('batch-preparation', 'prepare-multiple-entities');
    
    // Create multiple entities
    const entities = [];
    for (let i = 0; i < 50; i++) {
      entities.push({
        id: uuidv4(),
        index: i,
        name: `Entity ${i}`,
        created: new Date(),
        data: {
          value: Math.random() * 100,
          timestamp: new Date(),
          nested: {
            flag: i % 2 === 0,
            label: `Label for ${i}`,
            created: new Date(Date.now() - i * 1000) // Different dates
          }
        }
      });
    }
    endTimer('batch-preparation');
    
    // Save all entities
    startTimer('batch-save', 'persist-multiple-entities');
    await Promise.all(entities.map(entity => 
      persistenceLayer.save(`batch:${entity.id}`, entity)
    ));
    endTimer('batch-save');
    
    // Get all keys with batch prefix
    startTimer('get-batch-keys', 'retrieve-entity-keys');
    const keys = await persistenceLayer.getKeys('batch:');
    endTimer('get-batch-keys');
    
    // Verification
    expect(keys.length).toBe(50);
    
    // Load all entities
    startTimer('batch-load', 'retrieve-multiple-entities');
    const loadedEntities = await Promise.all(
      keys.map(key => persistenceLayer.load(key))
    );
    endTimer('batch-load');
    
    // Verification
    expect(loadedEntities.length).toBe(50);
    
    // Verify all dates were preserved
    let dateFieldsPreserved = true;
    for (const entity of loadedEntities) {
      if (!(entity.created instanceof Date) || 
          !(entity.data.timestamp instanceof Date) ||
          !(entity.data.nested.created instanceof Date)) {
        dateFieldsPreserved = false;
        break;
      }
    }
    expect(dateFieldsPreserved).toBe(true);
    
    // Delete all entities
    startTimer('batch-delete', 'remove-multiple-entities');
    await Promise.all(keys.map(key => persistenceLayer.delete(key)));
    endTimer('batch-delete');
    
    // Verify all were deleted
    const keysAfterDelete = await persistenceLayer.getKeys('batch:');
    expect(keysAfterDelete.length).toBe(0);
    
    // Calculate overall batch performance
    const batchTime = 
      (metrics['batch-save']?.duration || 0) + 
      (metrics['batch-load']?.duration || 0);
    const avgTimePerEntity = batchTime / 100; // 50 saves + 50 loads
    
    console.log(`[PERFORMANCE] Average time per entity operation: ${avgTimePerEntity.toFixed(2)}ms`);
    
    // Performance should be reasonable
    expect(avgTimePerEntity).toBeLessThan(100); // Less than 100ms per operation
  });

  // Test 3: MetaCognitiveEvent integration with intent tracking
  test('seamlessly integrates with MetaCognitiveEvents and preserves intent', async () => {
    // Create an event with explicit intent
    startTimer('create-event', 'cognitive-pattern-recognition');
    
    const eventId = uuidv4();
    const event = new MetaCognitiveEventBuilder()
      .withType('cognition:pattern-detected')
      .withDescription('Integration test with explicit intent tracking')
      .withConfidence(0.87)
      .withSourceContext({
        source: 'integration-test',
        component: 'persistence-layer',
        intent: 'verify-intent-preservation'
      })
      .withDetails({
        patternType: 'recurring-sequence',
        elements: ['A', 'B', 'C', 'A', 'B', 'C'],
        detectedAt: new Date(),
        metadata: {
          confidence: 0.87,
          algorithmUsed: 'sequence-analysis',
          processingTime: 145, // ms
          intent: 'pattern-recognition' // Nested intent
        }
      })
      .build();
    
    // Add explicit intent to the event
    event.intent = 'cognitive-pattern-recognition';
    
    endTimer('create-event');
    
    // Persist the event
    startTimer('save-event', 'persist-cognitive-event');
    await persistenceLayer.save(`metacognitive:${eventId}`, event);
    endTimer('save-event');
    
    // Retrieve the event
    startTimer('load-event', 'retrieve-cognitive-event');
    const loadedEvent = await persistenceLayer.load(`metacognitive:${eventId}`);
    endTimer('load-event');
    
    // Verify event properties
    expect(loadedEvent).not.toBeNull();
    expect(loadedEvent.id).toBe(event.id);
    expect(loadedEvent.type).toBe('cognition:pattern-detected');
    expect(loadedEvent.createdAt instanceof Date).toBe(true);
    expect(loadedEvent.confidence).toBe(0.87);
    
    // Verify intent was preserved
    expect(loadedEvent.intent).toBe('cognitive-pattern-recognition');
    
    // Verify source context (as string)
    expect(typeof loadedEvent.sourceContext).toBe('string');
    const sourceContext = JSON.parse(loadedEvent.sourceContext);
    expect(sourceContext.intent).toBe('verify-intent-preservation');
    
    // Verify details
    const details = JSON.parse(loadedEvent.details);
    expect(details.patternType).toBe('recurring-sequence');
    expect(details.metadata.intent).toBe('pattern-recognition');
    
    // Create related event
    startTimer('create-related-event', 'cognitive-insight-generation');
    
    const relatedEvent = new MetaCognitiveEventBuilder()
      .withType('cognition:insight-generated')
      .withDescription('Insight derived from pattern detection')
      .withConfidence(0.92)
      .withSourceContext({
        source: 'integration-test',
        component: 'persistence-layer',
        intent: 'verify-related-events'
      })
      .withRelatedEvents([event.id])
      .withDetails({
        insightType: 'pattern-prediction',
        predictedNext: ['A', 'B', 'C'],
        generatedAt: new Date(),
        metadata: {
          confidence: 0.92,
          sourceEventId: event.id,
          intent: 'insight-generation'
        }
      })
      .build();
    
    // Add explicit intent
    relatedEvent.intent = 'cognitive-insight-generation';
    
    endTimer('create-related-event');
    
    // Persist related event
    startTimer('save-related-event', 'persist-related-insight');
    await persistenceLayer.save(`metacognitive:${relatedEvent.id}`, relatedEvent);
    endTimer('save-related-event');
    
    // Retrieve related event
    startTimer('load-related-event', 'retrieve-related-insight');
    const loadedRelatedEvent = await persistenceLayer.load(`metacognitive:${relatedEvent.id}`);
    endTimer('load-related-event');
    
    // Verify related event
    expect(loadedRelatedEvent).not.toBeNull();
    expect(loadedRelatedEvent.intent).toBe('cognitive-insight-generation');
    
    // Verify relatedEvents is preserved
    expect(loadedRelatedEvent.relatedEvents).toBe(event.id);
  });

  // Test 4: Complex nested data with full flow
  test('processes complex nested data through a complete integration flow', async () => {
    // 0-Start: Initialize flow with intent
    startTimer('0-Start', 'initialize-complex-flow');
    
    // Complex data structure with nested objects and arrays
    const complexData = {
      id: uuidv4(),
      flowId: 'complex-integration-flow',
      createdAt: new Date(),
      status: 'initializing',
      config: {
        parameters: {
          threshold: 0.75,
          maxIterations: 5,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000 * 7) // 7 days later
        },
        options: {
          enableLogging: true,
          detailedMetrics: true
        }
      },
      nodes: [
        {
          id: 'node-1',
          type: 'input',
          createdAt: new Date(),
          data: { source: 'api', format: 'json' }
        },
        {
          id: 'node-2',
          type: 'processor',
          createdAt: new Date(),
          data: { 
            algorithm: 'transform',
            parameters: { 
              inputFormat: 'json',
              outputFormat: 'graph',
              createdAt: new Date()
            }
          }
        },
        {
          id: 'node-3',
          type: 'output',
          createdAt: new Date(),
          data: { destination: 'database', format: 'document' }
        }
      ],
      edges: [
        { source: 'node-1', target: 'node-2', createdAt: new Date() },
        { source: 'node-2', target: 'node-3', createdAt: new Date() }
      ],
      metadata: {
        owner: 'integration-test',
        version: '1.0.0',
        tags: ['complex', 'nested', 'test'],
        timestamps: {
          created: new Date(),
          updated: new Date(),
          expires: new Date(Date.now() + 86400000 * 30) // 30 days
        }
      }
    };
    
    // Define explicit flow intent
    const flowIntent = 'complex-data-processing-validation';
    
    // Add circular reference for testing
    complexData.metadata.self = complexData;
    
    endTimer('0-Start');
    
    // 1-Persist: Save complex data
    startTimer('1-Persist', flowIntent);
    await persistenceLayer.save(`complex:${complexData.id}`, complexData);
    endTimer('1-Persist');
    
    // 2-Retrieve: Load complex data
    startTimer('2-Retrieve', flowIntent);
    const loadedComplex = await persistenceLayer.load(`complex:${complexData.id}`);
    endTimer('2-Retrieve');
    
    // 3-Process: Update and transform
    startTimer('3-Process', flowIntent);
    
    // Verify core properties
    expect(loadedComplex.id).toBe(complexData.id);
    expect(loadedComplex.flowId).toBe('complex-integration-flow');
    expect(loadedComplex.createdAt instanceof Date).toBe(true);
    
    // Verify nested dates
    expect(loadedComplex.config.parameters.startDate instanceof Date).toBe(true);
    expect(loadedComplex.config.parameters.endDate instanceof Date).toBe(true);
    expect(loadedComplex.nodes[0].createdAt instanceof Date).toBe(true);
    expect(loadedComplex.nodes[1].createdAt instanceof Date).toBe(true);
    expect(loadedComplex.nodes[2].createdAt instanceof Date).toBe(true);
    expect(loadedComplex.nodes[1].data.parameters.createdAt instanceof Date).toBe(true);
    expect(loadedComplex.edges[0].createdAt instanceof Date).toBe(true);
    expect(loadedComplex.edges[1].createdAt instanceof Date).toBe(true);
    expect(loadedComplex.metadata.timestamps.created instanceof Date).toBe(true);
    expect(loadedComplex.metadata.timestamps.updated instanceof Date).toBe(true);
    expect(loadedComplex.metadata.timestamps.expires instanceof Date).toBe(true);
    
    // Verify circular reference handling
    expect(loadedComplex.metadata.self).toBe('[Circular Reference]');
    
    // Transform the data - update flow status
    loadedComplex.status = 'processed';
    loadedComplex.metadata.timestamps.updated = new Date();
    
    // Add a new node
    loadedComplex.nodes.push({
      id: 'node-4',
      type: 'analytics',
      createdAt: new Date(),
      data: { algorithm: 'metrics-collection', format: 'timeseries' }
    });
    
    // Add a new edge
    loadedComplex.edges.push({
      source: 'node-3', 
      target: 'node-4',
      createdAt: new Date()
    });
    
    endTimer('3-Process');
    
    // 4-Update: Persist changes
    startTimer('4-Update', flowIntent);
    await persistenceLayer.save(`complex:${loadedComplex.id}`, loadedComplex);
    endTimer('4-Update');
    
    // 5-Finalize: Load and verify final state
    startTimer('5-Finalize', flowIntent);
    const finalComplex = await persistenceLayer.load(`complex:${complexData.id}`);
    endTimer('5-Finalize');
    
    // Verify updates
    expect(finalComplex.status).toBe('processed');
    expect(finalComplex.nodes.length).toBe(4);
    expect(finalComplex.edges.length).toBe(3);
    expect(finalComplex.nodes[3].id).toBe('node-4');
    expect(finalComplex.nodes[3].createdAt instanceof Date).toBe(true);
    expect(finalComplex.edges[2].source).toBe('node-3');
    expect(finalComplex.edges[2].target).toBe('node-4');
    expect(finalComplex.edges[2].createdAt instanceof Date).toBe(true);
    
    // Calculate total flow time
    const startTime = timers['0-Start'] || 0;
    const endTime = timers['5-Finalize'] || 0;
    const totalTime = endTime - startTime;
    
    // Log flow metrics
    console.log(`[FLOW METRICS] Complete flow execution time: ${totalTime.toFixed(2)}ms`);
    console.log(`[FLOW METRICS] Flow intent: ${flowIntent}`);
    console.log(`[FLOW METRICS] Flow stages completed: 6`);
    
    // Verify overall performance
    expect(totalTime).toBeLessThan(30000); // Should complete within 30 seconds
  });

  // Test 5: Prefixed key operations (collection management)
  test('efficiently manages collections with prefixed keys', async () => {
    startTimer('collection-test', 'collection-management');
    
    // Create multiple entity types
    const users = [];
    const posts = [];
    const comments = [];
    
    // Create users
    for (let i = 0; i < 5; i++) {
      const user = {
        id: `user-${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        createdAt: new Date(Date.now() - i * 86400000) // Different dates
      };
      users.push(user);
      await persistenceLayer.save(`users:${user.id}`, user);
    }
    
    // Create posts (with user references)
    for (let i = 0; i < 10; i++) {
      const userIndex = i % 5;
      const post = {
        id: `post-${i}`,
        title: `Post ${i} Title`,
        content: `Content for post ${i}`,
        authorId: `user-${userIndex}`,
        createdAt: new Date(Date.now() - i * 3600000) // Different dates
      };
      posts.push(post);
      await persistenceLayer.save(`posts:${post.id}`, post);
    }
    
    // Create comments (with post and user references)
    for (let i = 0; i < 25; i++) {
      const userIndex = i % 5;
      const postIndex = i % 10;
      const comment = {
        id: `comment-${i}`,
        content: `Comment ${i} content`,
        authorId: `user-${userIndex}`,
        postId: `post-${postIndex}`,
        createdAt: new Date(Date.now() - i * 60000) // Different dates
      };
      comments.push(comment);
      await persistenceLayer.save(`comments:${comment.id}`, comment);
    }
    
    // Get all keys by collection
    const userKeys = await persistenceLayer.getKeys('users:');
    const postKeys = await persistenceLayer.getKeys('posts:');
    const commentKeys = await persistenceLayer.getKeys('comments:');
    
    // Verify keys
    expect(userKeys.length).toBe(5);
    expect(postKeys.length).toBe(10);
    expect(commentKeys.length).toBe(25);
    
    // Load all collections
    const loadedUsers = await Promise.all(userKeys.map(key => persistenceLayer.load(key)));
    const loadedPosts = await Promise.all(postKeys.map(key => persistenceLayer.load(key)));
    const loadedComments = await Promise.all(commentKeys.map(key => persistenceLayer.load(key)));
    
    // Verify all dates were preserved
    expect(loadedUsers.every(u => u.createdAt instanceof Date)).toBe(true);
    expect(loadedPosts.every(p => p.createdAt instanceof Date)).toBe(true);
    expect(loadedComments.every(c => c.createdAt instanceof Date)).toBe(true);
    
    // Filter users with posts (join-like operation)
    const usersWithPosts = loadedUsers.filter(user => 
      loadedPosts.some(post => post.authorId === user.id)
    );
    
    // Filter posts with comments (join-like operation)
    const postsWithComments = loadedPosts.filter(post =>
      loadedComments.some(comment => comment.postId === post.id)
    );
    
    // Verify joins
    expect(usersWithPosts.length).toBe(5); // All users have posts
    expect(postsWithComments.length).toBe(10); // All posts have comments
    
    endTimer('collection-test');
  });
});