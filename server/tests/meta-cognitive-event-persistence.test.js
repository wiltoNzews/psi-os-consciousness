/**
 * MetaCognitiveEvent Persistence Test
 * 
 * This test specifically focuses on verifying that MetaCognitiveEvents
 * can be properly serialized and deserialized with the EnhancedMockPersistenceLayer.
 * 
 * BOUNDARY AWARENESS: This test explicitly defines the boundary between
 * the MetaCognitiveEvent domain objects and their persistence representation.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { EnhancedMockPersistenceLayer } from './mocks/enhanced-mock-persistence-layer.js';

// Define a simple mock for MetaCognitiveEvent
class MetaCognitiveEvent {
  constructor(options = {}) {
    this.id = options.id || 'event-' + Date.now();
    this.type = options.type || 'insight';
    this.eventType = options.eventType || 'discovery';
    this.description = options.description || 'Test event description';
    this.createdAt = options.createdAt || new Date();
    this.confidence = options.confidence || 0.85;
    this.impact = options.impact || 'medium';
    this.outcome = options.outcome || 'positive';
    this.sourceContext = options.sourceContext || { origin: 'test', phase: 'verification' };
    this.relatedEvents = options.relatedEvents || [];
    this.metadata = options.metadata || { automated: true, testGenerated: true };
  }
}

describe('MetaCognitiveEvent Persistence', () => {
  let persistenceLayer;
  
  beforeEach(() => {
    persistenceLayer = new EnhancedMockPersistenceLayer();
    console.log('[TEST] Created fresh EnhancedMockPersistenceLayer instance');
  });
  
  test('should save and load a simple MetaCognitiveEvent', async () => {
    // Create a test event
    const testEvent = new MetaCognitiveEvent({
      type: 'insight',
      eventType: 'discovery',
      description: 'Important test discovery',
      impact: 'high',
      outcome: 'positive'
    });
    
    const testKey = 'meta-cognitive-event-' + Date.now();
    console.log('[TEST] Starting MetaCognitiveEvent test with key:', testKey);
    
    // Save the event
    await persistenceLayer.save(testKey, testEvent);
    console.log('[TEST] MetaCognitiveEvent saved successfully');
    
    // Load the event
    const loadedEvent = await persistenceLayer.load(testKey);
    console.log('[TEST] MetaCognitiveEvent loaded successfully');
    
    // Verify the event was properly serialized/deserialized
    expect(loadedEvent).not.toBeNull();
    expect(loadedEvent.id).toBe(testEvent.id);
    expect(loadedEvent.type).toBe('insight');
    expect(loadedEvent.eventType).toBe('discovery');
    expect(loadedEvent.description).toBe('Important test discovery');
    expect(loadedEvent.impact).toBe('high');
    expect(loadedEvent.outcome).toBe('positive');
    expect(loadedEvent.createdAt instanceof Date).toBe(true);
    expect(loadedEvent.createdAt.toISOString()).toBe(testEvent.createdAt.toISOString());
    
    console.log('[TEST] All MetaCognitiveEvent assertions passed');
  });
  
  test('should save and load a MetaCognitiveEvent with related events', async () => {
    // Create related events with explicit IDs to avoid timing issues
    const uniqueId1 = 'pattern-event-' + Date.now() + '-1';
    const uniqueId2 = 'insight-event-' + Date.now() + '-2';
    
    const relatedEvent1 = new MetaCognitiveEvent({
      id: uniqueId1,
      type: 'pattern',
      eventType: 'repetition',
      description: 'Related pattern 1'
    });
    
    const relatedEvent2 = new MetaCognitiveEvent({
      id: uniqueId2,
      type: 'insight',
      eventType: 'anomaly',
      description: 'Related anomaly'
    });
    
    // Create a test event with related events
    const testEvent = new MetaCognitiveEvent({
      type: 'synthesis',
      eventType: 'integration',
      description: 'Integrated insights',
      relatedEvents: [uniqueId1, uniqueId2],
      sourceContext: {
        related: [
          { id: uniqueId1, type: 'source' },
          { id: uniqueId2, type: 'reference' }
        ],
        origin: 'integration-test'
      }
    });
    
    const testKey = 'meta-cognitive-event-related-' + Date.now();
    console.log('[TEST] Starting related MetaCognitiveEvent test with key:', testKey);
    
    // Save all events
    await persistenceLayer.save(uniqueId1, relatedEvent1);
    await persistenceLayer.save(uniqueId2, relatedEvent2);
    await persistenceLayer.save(testKey, testEvent);
    console.log('[TEST] All events saved successfully');
    
    // Load the main event
    const loadedEvent = await persistenceLayer.load(testKey);
    console.log('[TEST] Main event loaded successfully');
    
    // Verify the event was properly serialized/deserialized
    expect(loadedEvent).not.toBeNull();
    expect(loadedEvent.type).toBe('synthesis');
    expect(loadedEvent.eventType).toBe('integration');
    expect(loadedEvent.relatedEvents).toEqual([uniqueId1, uniqueId2]);
    expect(loadedEvent.sourceContext.related[0].id).toBe(uniqueId1);
    expect(loadedEvent.sourceContext.related[1].id).toBe(uniqueId2);
    
    // Load the related events individually with their unique IDs
    console.log('[TEST] Loading related event 1 with ID:', uniqueId1);
    const loadedRelated1 = await persistenceLayer.load(uniqueId1);
    console.log('[TEST] Loading related event 2 with ID:', uniqueId2);
    const loadedRelated2 = await persistenceLayer.load(uniqueId2);
    
    // Verify event 1
    expect(loadedRelated1).not.toBeNull();
    expect(loadedRelated1.id).toBe(uniqueId1);
    expect(loadedRelated1.type).toBe('pattern');
    expect(loadedRelated1.eventType).toBe('repetition');
    
    // Verify event 2
    expect(loadedRelated2).not.toBeNull();
    expect(loadedRelated2.id).toBe(uniqueId2);
    expect(loadedRelated2.type).toBe('insight');
    expect(loadedRelated2.eventType).toBe('anomaly');
    
    console.log('[TEST] All related event assertions passed');
  });
  
  test('should handle collection of MetaCognitiveEvents', async () => {
    // Create a collection of events
    const events = [
      new MetaCognitiveEvent({ type: 'insight', eventType: 'discovery', description: 'First insight' }),
      new MetaCognitiveEvent({ type: 'pattern', eventType: 'repetition', description: 'Pattern detected' }),
      new MetaCognitiveEvent({ type: 'anomaly', eventType: 'exception', description: 'Anomaly found' })
    ];
    
    const collectionKey = 'event-collection-' + Date.now();
    console.log('[TEST] Starting collection test with key:', collectionKey);
    
    // Save the collection
    await persistenceLayer.save(collectionKey, events);
    console.log('[TEST] Event collection saved successfully');
    
    // Load the collection
    const loadedCollection = await persistenceLayer.load(collectionKey);
    console.log('[TEST] Event collection loaded successfully');
    
    // Verify the collection was properly serialized/deserialized
    expect(Array.isArray(loadedCollection)).toBe(true);
    expect(loadedCollection.length).toBe(3);
    
    // Check the events in the collection
    expect(loadedCollection[0].type).toBe('insight');
    expect(loadedCollection[0].eventType).toBe('discovery');
    expect(loadedCollection[0].description).toBe('First insight');
    expect(loadedCollection[0].createdAt instanceof Date).toBe(true);
    
    expect(loadedCollection[1].type).toBe('pattern');
    expect(loadedCollection[1].eventType).toBe('repetition');
    
    expect(loadedCollection[2].type).toBe('anomaly');
    expect(loadedCollection[2].eventType).toBe('exception');
    
    console.log('[TEST] All collection assertions passed');
  });
});