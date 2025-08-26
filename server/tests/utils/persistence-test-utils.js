/**
 * Persistence Test Utilities
 * 
 * Provides helper functions for testing persistence layer implementations
 * with standardized test cases and verification methods.
 * 
 * BOUNDARY AWARENESS: This utility explicitly defines testing boundaries
 * between general persistence concepts and specific implementations.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

/**
 * Create a test MetaCognitiveEvent with the specified options
 */
function createTestEvent(options = {}) {
  return {
    id: options.id || `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type: options.type || 'insight',
    eventType: options.eventType || 'discovery',
    description: options.description || 'Test event description',
    createdAt: options.createdAt || new Date(),
    confidence: options.confidence !== undefined ? options.confidence : 0.85,
    impact: options.impact || 'medium',
    outcome: options.outcome || 'positive',
    sourceContext: options.sourceContext || { origin: 'test', phase: 'verification' },
    relatedEvents: options.relatedEvents || [],
    metadata: options.metadata || { automated: true, testGenerated: true }
  };
}

/**
 * Create a test object with complex nested date structure
 */
function createComplexTestObject() {
  const now = new Date();
  return {
    id: `complex-${Date.now()}`,
    createdAt: now,
    nested: {
      timestamp: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour ago
      deepNested: {
        updatedAt: new Date(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
      }
    },
    items: [
      { id: 1, timestamp: new Date(now.getTime() - 1000 * 60 * 10) }, // 10 min ago
      { id: 2, timestamp: new Date(now.getTime() - 1000 * 60 * 5) }   // 5 min ago
    ],
    metadata: {
      timestamps: [
        new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
        new Date(now.getTime() - 1000 * 60 * 60 * 12)  // 12 hours ago
      ]
    }
  };
}

/**
 * Create a test object with a circular reference
 */
function createCircularTestObject() {
  const obj = {
    id: `circular-${Date.now()}`,
    createdAt: new Date(),
    metadata: {}
  };
  
  // Create circular reference
  obj.metadata.parent = obj;
  
  return obj;
}

/**
 * Run basic verification tests on a persistence layer implementation
 */
async function verifyPersistenceImplementation(
  persistenceLayer,
  label = 'Unnamed Persistence Layer'
) {
  console.log(`[TEST] Starting verification of ${label}`);
  
  // Clear any existing data
  await persistenceLayer.clear();
  console.log(`[TEST] Cleared existing data in ${label}`);
  
  // Test simple save and load
  const testKey = `test-key-${Date.now()}`;
  const testValue = { message: 'Test value', timestamp: new Date() };
  
  await persistenceLayer.save(testKey, testValue);
  console.log(`[TEST] Saved simple test value to ${label}`);
  
  const loadedValue = await persistenceLayer.load(testKey);
  console.log(`[TEST] Loaded simple test value from ${label}`);
  
  if (!loadedValue || loadedValue.message !== testValue.message) {
    throw new Error(`${label} failed basic save/load test`);
  }
  
  if (!(loadedValue.timestamp instanceof Date)) {
    throw new Error(`${label} failed to properly restore Date objects`);
  }
  
  // Test getKeys with prefix filtering
  const prefix = `prefix-test-${Date.now()}`;
  await persistenceLayer.save(`${prefix}-1`, { value: 1 });
  await persistenceLayer.save(`${prefix}-2`, { value: 2 });
  await persistenceLayer.save(`other-key`, { value: 3 });
  
  const filteredKeys = await persistenceLayer.getKeys(prefix);
  console.log(`[TEST] Retrieved keys with prefix from ${label}`);
  
  if (filteredKeys.length !== 2 || !filteredKeys.includes(`${prefix}-1`) || !filteredKeys.includes(`${prefix}-2`)) {
    throw new Error(`${label} failed prefix filtering test`);
  }
  
  // Test delete
  const deleteResult = await persistenceLayer.delete(testKey);
  if (!deleteResult) {
    throw new Error(`${label} failed delete test - returned false when deleting existing key`);
  }
  
  const deletedValue = await persistenceLayer.load(testKey);
  if (deletedValue !== null) {
    throw new Error(`${label} failed delete test - value still exists after deletion`);
  }
  
  // Test complex nested objects with dates
  const complexKey = `complex-key-${Date.now()}`;
  const complexObject = createComplexTestObject();
  
  await persistenceLayer.save(complexKey, complexObject);
  console.log(`[TEST] Saved complex object to ${label}`);
  
  const loadedComplex = await persistenceLayer.load(complexKey);
  console.log(`[TEST] Loaded complex object from ${label}`);
  
  if (!loadedComplex || !(loadedComplex.createdAt instanceof Date)) {
    throw new Error(`${label} failed complex object test - top level dates not preserved`);
  }
  
  if (!(loadedComplex.nested.timestamp instanceof Date)) {
    throw new Error(`${label} failed complex object test - nested dates not preserved`);
  }
  
  if (!(loadedComplex.nested.deepNested.updatedAt instanceof Date)) {
    throw new Error(`${label} failed complex object test - deeply nested dates not preserved`);
  }
  
  if (!(loadedComplex.items[0].timestamp instanceof Date)) {
    throw new Error(`${label} failed complex object test - array item dates not preserved`);
  }
  
  if (!(loadedComplex.metadata.timestamps[0] instanceof Date)) {
    throw new Error(`${label} failed complex object test - nested array dates not preserved`);
  }
  
  // Test meta cognitive events
  const eventKey = `meta-event-${Date.now()}`;
  const testEvent = createTestEvent();
  
  await persistenceLayer.save(eventKey, testEvent);
  console.log(`[TEST] Saved MetaCognitiveEvent to ${label}`);
  
  const loadedEvent = await persistenceLayer.load(eventKey);
  console.log(`[TEST] Loaded MetaCognitiveEvent from ${label}`);
  
  if (!loadedEvent || loadedEvent.id !== testEvent.id) {
    throw new Error(`${label} failed MetaCognitiveEvent test - event not properly saved/loaded`);
  }
  
  if (!(loadedEvent.createdAt instanceof Date)) {
    throw new Error(`${label} failed MetaCognitiveEvent test - createdAt date not preserved`);
  }
  
  // Test circular references (should handle gracefully)
  try {
    const circularKey = `circular-key-${Date.now()}`;
    const circularObject = createCircularTestObject();
    
    await persistenceLayer.save(circularKey, circularObject);
    console.log(`[TEST] Saved circular reference object to ${label} (handled gracefully)`);
    
    const loadedCircular = await persistenceLayer.load(circularKey);
    console.log(`[TEST] Loaded circular reference object from ${label} (handled gracefully)`);
    
    // Verify the circular reference was replaced with a marker
    if (loadedCircular.metadata.parent !== '[Circular Reference]') {
      console.warn(`${label} did not handle circular reference as expected - got:`, loadedCircular.metadata.parent);
    }
  } catch (error) {
    console.warn(`${label} could not handle circular references - error:`, error);
  }
  
  console.log(`[TEST] ${label} passed all verification tests successfully`);
}

export {
  createTestEvent,
  createComplexTestObject,
  createCircularTestObject,
  verifyPersistenceImplementation
};