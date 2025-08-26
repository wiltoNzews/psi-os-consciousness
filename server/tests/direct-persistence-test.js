/**
 * Direct test for the EnhancedMockPersistenceLayer
 * 
 * This script tests the basic functionality of the persistence layer directly,
 * without using Jest, to isolate any issues with the implementation.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

// Import the persistence layer
import { EnhancedMockPersistenceLayer } from './mocks/enhanced-mock-persistence-layer.js';

/**
 * Run a simple test of the persistence layer
 */
async function runDirectTest() {
  console.log('Starting direct persistence layer test...');
  
  // Create a new persistence layer
  const persistenceLayer = new EnhancedMockPersistenceLayer();
  console.log('Created persistence layer');
  
  // Test data with dates
  const testData = {
    id: 'test-1',
    name: 'Test Object',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { id: 'item-1', timestamp: new Date(), value: 'value-1' },
      { id: 'item-2', timestamp: new Date(), value: 'value-2' }
    ],
    metadata: {
      lastChecked: new Date(),
      source: 'direct-test'
    }
  };
  
  try {
    // Save the data
    console.log('Saving test data...');
    await persistenceLayer.save('test-key', testData);
    console.log('Test data saved');
    
    // Load the data back
    console.log('Loading test data...');
    const loadedData = await persistenceLayer.load('test-key');
    console.log('Test data loaded');
    
    // Check that the data is correct
    console.log('Verifying data...');
    
    // Check basic properties
    const basicPropsMatch = 
      loadedData.id === testData.id &&
      loadedData.name === testData.name;
    
    console.log('Basic properties match:', basicPropsMatch);
    
    // Check date properties
    const createdAtIsDate = loadedData.createdAt instanceof Date;
    const updatedAtIsDate = loadedData.updatedAt instanceof Date;
    const item1TimestampIsDate = loadedData.items[0].timestamp instanceof Date;
    const metadataLastCheckedIsDate = loadedData.metadata.lastChecked instanceof Date;
    
    console.log('createdAt is Date:', createdAtIsDate);
    console.log('updatedAt is Date:', updatedAtIsDate);
    console.log('items[0].timestamp is Date:', item1TimestampIsDate);
    console.log('metadata.lastChecked is Date:', metadataLastCheckedIsDate);
    
    // Check date values (within 1 second tolerance)
    const createdAtDiff = Math.abs(loadedData.createdAt.getTime() - testData.createdAt.getTime());
    const updatedAtDiff = Math.abs(loadedData.updatedAt.getTime() - testData.updatedAt.getTime());
    
    console.log('createdAt diff (ms):', createdAtDiff);
    console.log('updatedAt diff (ms):', updatedAtDiff);
    
    // Get all keys
    console.log('Getting all keys...');
    const keys = await persistenceLayer.getKeys();
    console.log('Keys:', keys);
    
    // Delete the test data
    console.log('Deleting test data...');
    const deleteResult = await persistenceLayer.delete('test-key');
    console.log('Delete result:', deleteResult);
    
    // Verify deletion
    console.log('Verifying deletion...');
    const deletedData = await persistenceLayer.load('test-key');
    console.log('Deleted data is null:', deletedData === null);
    
    console.log('Direct test complete!');
  } catch (error) {
    console.error('Error in direct test:', error);
  }
}

// Run the test
runDirectTest().catch(error => {
  console.error('Fatal error in direct test:', error);
});