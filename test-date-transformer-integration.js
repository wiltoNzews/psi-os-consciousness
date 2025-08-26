/**
 * Test DateTransformer Integration
 * 
 * This script tests the integration of DateTransformer with various persistence
 * layer implementations to ensure consistent date handling.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

// Import DateTransformer
import { DateTransformer } from './server/utils/DateTransformer.js';

// Import EnhancedMockPersistenceLayer (JavaScript version for testing)
import { EnhancedMockPersistenceLayer } from './server/tests/mocks/enhanced-mock-persistence-layer.js';

/**
 * Run comprehensive date handling tests for a persistence layer
 */
async function testDateHandling(persistenceLayer) {
  console.log('----------------------------------------------------');
  console.log(`Testing date handling for: ${persistenceLayer.constructor.name}`);
  console.log('----------------------------------------------------');
  
  // Clear any existing data
  await persistenceLayer.clear();
  console.log('Cleared existing data');
  
  // Test 1: Simple date object save/load
  console.log('\nTest 1: Simple date object');
  const simpleKey = `simple-date-${Date.now()}`;
  const now = new Date();
  const simpleObj = { timestamp: now, label: 'Current time' };
  
  await persistenceLayer.save(simpleKey, simpleObj);
  console.log('✓ Saved simple date object');
  
  const loadedSimpleObj = await persistenceLayer.load(simpleKey);
  const isSimpleDatePreserved = loadedSimpleObj && loadedSimpleObj.timestamp instanceof Date;
  console.log(`✓ Loaded simple date object: Date preserved? ${isSimpleDatePreserved}`);
  
  if (isSimpleDatePreserved) {
    console.log(`  Original: ${now.toISOString()}`);
    console.log(`  Loaded  : ${loadedSimpleObj.timestamp.toISOString()}`);
    console.log(`  Match   : ${now.toISOString() === loadedSimpleObj.timestamp.toISOString()}`);
  }
  
  // Test 2: Complex nested object with dates
  console.log('\nTest 2: Complex nested object with dates');
  const complexKey = `complex-date-${Date.now()}`;
  const complexObj = {
    createdAt: new Date(),
    metadata: {
      lastUpdated: new Date(Date.now() - 3600000), // 1 hour ago
      timestamps: [
        new Date(Date.now() - 86400000),  // 1 day ago
        new Date(Date.now() - 172800000)  // 2 days ago
      ]
    },
    items: [
      { id: 1, timestamp: new Date(Date.now() - 300000) },  // 5 min ago
      { id: 2, timestamp: new Date(Date.now() - 600000) }   // 10 min ago
    ]
  };
  
  await persistenceLayer.save(complexKey, complexObj);
  console.log('✓ Saved complex object with nested dates');
  
  const loadedComplexObj = await persistenceLayer.load(complexKey);
  console.log('✓ Loaded complex object');
  
  const topLevelDatePreserved = loadedComplexObj.createdAt instanceof Date;
  const nestedDatePreserved = loadedComplexObj.metadata.lastUpdated instanceof Date;
  const arrayDatesPreserved = 
    Array.isArray(loadedComplexObj.metadata.timestamps) &&
    loadedComplexObj.metadata.timestamps.every(d => d instanceof Date);
  const itemDatesPreserved = 
    Array.isArray(loadedComplexObj.items) &&
    loadedComplexObj.items.every(item => item.timestamp instanceof Date);
  
  console.log(`  Top-level date preserved: ${topLevelDatePreserved}`);
  console.log(`  Nested date preserved: ${nestedDatePreserved}`);
  console.log(`  Array dates preserved: ${arrayDatesPreserved}`);
  console.log(`  Item dates preserved: ${itemDatesPreserved}`);
  
  // Test 3: Object with circular references
  console.log('\nTest 3: Object with circular references');
  const circularKey = `circular-date-${Date.now()}`;
  const circularObj = {
    id: 'circular-test',
    timestamp: new Date(),
    metadata: {}
  };
  // Create circular reference
  circularObj.metadata.parent = circularObj;
  
  try {
    await persistenceLayer.save(circularKey, circularObj);
    console.log('✓ Successfully saved object with circular reference');
    
    const loadedCircularObj = await persistenceLayer.load(circularKey);
    console.log('✓ Successfully loaded object with circular reference');
    
    const circularDatePreserved = loadedCircularObj.timestamp instanceof Date;
    const circularRefHandled = loadedCircularObj.metadata.parent === '[Circular Reference]';
    
    console.log(`  Date preserved: ${circularDatePreserved}`);
    console.log(`  Circular reference handled: ${circularRefHandled}`);
  } catch (error) {
    console.error('✗ Failed to handle circular reference:', error);
  }
  
  // Test 4: Direct DateTransformer API
  console.log('\nTest 4: Direct DateTransformer API');
  
  const directObj = {
    id: 'direct-test',
    timestamp: new Date(),
    nested: {
      created: new Date(Date.now() - 3600000) // 1 hour ago
    }
  };
  
  // Test stringify/parse
  const serialized = DateTransformer.stringify(directObj);
  console.log('✓ Serialized object with DateTransformer.stringify');
  
  const deserialized = DateTransformer.parse(serialized);
  console.log('✓ Deserialized object with DateTransformer.parse');
  
  const directDatePreserved = deserialized.timestamp instanceof Date;
  const directNestedDatePreserved = deserialized.nested.created instanceof Date;
  
  console.log(`  Top-level date preserved: ${directDatePreserved}`);
  console.log(`  Nested date preserved: ${directNestedDatePreserved}`);
  
  // Test transformDates
  const transformedToString = DateTransformer.transformDates(directObj, 'serialize');
  console.log('✓ Transformed dates to strings');
  console.log(`  Result type: ${typeof transformedToString.timestamp}`);
  
  const transformedToDate = DateTransformer.transformDates(transformedToString, 'deserialize');
  console.log('✓ Transformed strings back to dates');
  console.log(`  Result is Date: ${transformedToDate.timestamp instanceof Date}`);
  
  // Final summary
  console.log('\nTest Results Summary:');
  console.log(`  Simple date test: ${isSimpleDatePreserved ? 'PASSED' : 'FAILED'}`);
  
  const complexTestPassed = topLevelDatePreserved && nestedDatePreserved && 
                           arrayDatesPreserved && itemDatesPreserved;
  console.log(`  Complex nested date test: ${complexTestPassed ? 'PASSED' : 'FAILED'}`);
  
  const circularTestPassed = circularDatePreserved && circularRefHandled;
  console.log(`  Circular reference test: ${circularTestPassed ? 'PASSED' : 'FAILED'}`);
  
  const directApiTestPassed = directDatePreserved && directNestedDatePreserved && 
                              (transformedToDate.timestamp instanceof Date);
  console.log(`  Direct API test: ${directApiTestPassed ? 'PASSED' : 'FAILED'}`);
  
  const allTestsPassed = isSimpleDatePreserved && complexTestPassed && 
                        circularTestPassed && directApiTestPassed;
  console.log(`\nOverall result: ${allTestsPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  
  return allTestsPassed;
}

/**
 * Main test function
 */
async function runTests() {
  try {
    console.log('=======================================================');
    console.log('DateTransformer Integration Test Suite');
    console.log('=======================================================');
    
    // Test with EnhancedMockPersistenceLayer
    const mockPersistence = new EnhancedMockPersistenceLayer();
    const mockResult = await testDateHandling(mockPersistence);
    
    console.log('\n=======================================================');
    console.log(`Final Result: ${mockResult ? 'SUCCESS' : 'FAILURE'}`);
    console.log('=======================================================');
    
    // Exit with appropriate code
    process.exit(mockResult ? 0 : 1);
  } catch (error) {
    console.error('Test suite failed with error:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();