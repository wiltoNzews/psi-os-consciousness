/**
 * Test script for FileSystemStorage temporal instance methods
 * 
 * This script tests the CRUD operations for temporal instances in the FileSystemStorage class.
 * It applies the TSAR BOMBA verification approach with explicit testing after each operation.
 */

import { FileSystemStorage } from './server/services/file-system-storage.js';
import { 
  TemporalInstance, 
  InsertTemporalInstance 
} from './shared/schema-minimal.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

// Test directory to avoid affecting production data
const TEST_DIR = './test-data/temporal-instances-test';

/**
 * Clean up the test directory to ensure a clean test environment
 */
async function cleanupTestDirectory() {
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
    console.log('Test directory cleaned up');
  } catch (error) {
    console.error('Error cleaning up test directory:', error);
  }
}

/**
 * Run verification of temporal instance methods
 */
async function runVerification() {
  console.log('Starting temporal instance methods verification...');
  
  // Set up storage with test directory
  const storage = new FileSystemStorage(TEST_DIR);
  
  // Clean up any existing test data
  await cleanupTestDirectory();
  
  try {
    // ========= CREATE OPERATION TEST =========
    console.log('\n--- Testing createTemporalInstance ---');
    
    const temporalInstanceToCreate: InsertTemporalInstance = {
      nodeId: 'qrn-test-node-001',
      state: JSON.stringify({ cognitiveState: 'active', awareness: 0.85 }),
      dimensionType: 'COGNITIVE_STATE',
      stabilityFactor: 0.92,
      metadata: {
        contextualReferences: ['ref1', 'ref2'],
        semanticDepth: 3,
        cognitiveImportance: 'high'
      }
    };
    
    // Create the temporal instance
    const createdInstance = await storage.createTemporalInstance(temporalInstanceToCreate);
    console.log('Created temporal instance:', createdInstance);
    
    // VERIFICATION: Ensure the created instance has all required properties
    console.assert(createdInstance.id, 'Created instance should have an ID');
    console.assert(createdInstance.nodeId === temporalInstanceToCreate.nodeId, 'NodeId should match');
    console.assert(createdInstance.state === temporalInstanceToCreate.state, 'State should match');
    console.assert(createdInstance.dimensionType === temporalInstanceToCreate.dimensionType, 'DimensionType should match');
    console.assert(createdInstance.createdAt instanceof Date, 'Created timestamp should be set');
    console.assert(createdInstance.updatedAt instanceof Date, 'Updated timestamp should be set');
    
    // Save the ID for later use
    const instanceId = createdInstance.id;
    console.log(`Temporal instance created with ID: ${instanceId}`);
    
    // ========= READ OPERATION TEST =========
    console.log('\n--- Testing getTemporalInstance ---');
    
    // Retrieve the temporal instance
    const retrievedInstance = await storage.getTemporalInstance(instanceId);
    console.log('Retrieved temporal instance:', retrievedInstance);
    
    // VERIFICATION: Ensure the instance was retrieved correctly
    console.assert(retrievedInstance, 'Should retrieve the temporal instance');
    console.assert(retrievedInstance?.id === instanceId, 'Instance ID should match');
    console.assert(retrievedInstance?.nodeId === temporalInstanceToCreate.nodeId, 'NodeId should match');
    console.assert(retrievedInstance?.state === temporalInstanceToCreate.state, 'State should match');
    console.assert(retrievedInstance?.dimensionType === temporalInstanceToCreate.dimensionType, 'DimensionType should match');
    console.assert(retrievedInstance?.stabilityFactor === temporalInstanceToCreate.stabilityFactor, 'StabilityFactor should match');
    console.assert(retrievedInstance?.metadata?.contextualReferences?.length === 2, 'Metadata should be preserved');
    console.assert(retrievedInstance?.createdAt instanceof Date, 'CreatedAt should be a Date');
    console.assert(retrievedInstance?.updatedAt instanceof Date, 'UpdatedAt should be a Date');
    
    // ========= LIST OPERATION TEST =========
    console.log('\n--- Testing getAllTemporalInstances ---');
    
    // List all temporal instances
    const allInstances = await storage.getAllTemporalInstances();
    console.log(`Retrieved ${allInstances.length} temporal instances`);
    
    // VERIFICATION: Ensure we can list instances
    console.assert(allInstances.length > 0, 'Should have at least one instance');
    console.assert(allInstances.some(i => i.id === instanceId), 'Created instance should be in the list');
    
    // Create another instance for filtering tests
    const secondInstance: InsertTemporalInstance = {
      nodeId: 'qrn-test-node-002',
      state: JSON.stringify({ cognitiveState: 'reflective', awareness: 0.72 }),
      dimensionType: 'REFLECTIVE_STATE',
      stabilityFactor: 0.81,
      metadata: {
        contextualReferences: ['ref3'],
        semanticDepth: 2,
        cognitiveImportance: 'medium'
      }
    };
    
    const createdSecondInstance = await storage.createTemporalInstance(secondInstance);
    console.log('Created second temporal instance:', createdSecondInstance);
    
    // Test filtering
    const filteredByNode = await storage.getAllTemporalInstances(undefined, { nodeId: 'qrn-test-node-001' });
    console.log(`Retrieved ${filteredByNode.length} instances filtered by nodeId`);
    console.assert(filteredByNode.length === 1, 'Should retrieve only one instance with the specified nodeId');
    console.assert(filteredByNode[0].id === instanceId, 'Should retrieve the correct instance by nodeId');
    
    const filteredByDimension = await storage.getAllTemporalInstances(undefined, { dimensionType: 'REFLECTIVE_STATE' });
    console.log(`Retrieved ${filteredByDimension.length} instances filtered by dimensionType`);
    console.assert(filteredByDimension.length === 1, 'Should retrieve only one instance with the specified dimensionType');
    console.assert(filteredByDimension[0].id === createdSecondInstance.id, 'Should retrieve the correct instance by dimensionType');
    
    // ========= UPDATE OPERATION TEST =========
    console.log('\n--- Testing updateTemporalInstance ---');
    
    const instanceUpdate = {
      state: JSON.stringify({ cognitiveState: 'active', awareness: 0.95 }),
      stabilityFactor: 0.98,
      metadata: {
        ...retrievedInstance?.metadata,
        updateCount: 1,
        lastActionType: 'cognitive_enhancement'
      }
    };
    
    // Update the temporal instance
    const updatedInstance = await storage.updateTemporalInstance(instanceId, instanceUpdate);
    console.log('Updated temporal instance:', updatedInstance);
    
    // VERIFICATION: Ensure the instance was updated correctly
    console.assert(updatedInstance, 'Should return the updated instance');
    console.assert(updatedInstance?.state === instanceUpdate.state, 'State should be updated');
    console.assert(updatedInstance?.stabilityFactor === instanceUpdate.stabilityFactor, 'StabilityFactor should be updated');
    console.assert(updatedInstance?.metadata?.updateCount === 1, 'Metadata should be updated');
    
    // Verify updates didn't change the immutable fields
    console.assert(updatedInstance?.id === instanceId, 'ID should not change');
    console.assert(updatedInstance?.nodeId === temporalInstanceToCreate.nodeId, 'NodeId should not change');
    console.assert(updatedInstance?.dimensionType === temporalInstanceToCreate.dimensionType, 'DimensionType should not change');
    
    // ========= ACCESS OPERATION TEST =========
    console.log('\n--- Testing accessTemporalInstance ---');
    
    // Access the temporal instance
    const accessedInstance = await storage.accessTemporalInstance(instanceId);
    console.log('Accessed temporal instance:', accessedInstance);
    
    // VERIFICATION: Ensure the instance was accessed correctly
    console.assert(accessedInstance, 'Should return the accessed instance');
    console.assert(accessedInstance?.id === instanceId, 'ID should match');
    console.assert(accessedInstance?.updatedAt > updatedInstance?.updatedAt, 'UpdatedAt should be newer after access');
    
    // ========= DELETE OPERATION TEST =========
    console.log('\n--- Testing deleteTemporalInstance ---');
    
    // Delete the second temporal instance
    const deleteResult = await storage.deleteTemporalInstance(createdSecondInstance.id);
    console.log(`Delete result: ${deleteResult}`);
    
    // VERIFICATION: Ensure the instance was deleted
    console.assert(deleteResult === true, 'Delete should return true for successful deletion');
    
    // Try to get the deleted instance
    const deletedInstance = await storage.getTemporalInstance(createdSecondInstance.id);
    console.log('Result of getting deleted instance:', deletedInstance);
    
    // VERIFICATION: Ensure the instance is gone
    console.assert(deletedInstance === undefined, 'Deleted instance should not be retrievable');
    
    // Verify the other instance still exists
    const remainingInstance = await storage.getTemporalInstance(instanceId);
    console.assert(remainingInstance !== undefined, 'Non-deleted instance should still exist');
    
    // Test deletion of non-existent instance
    const nonExistentDeleteResult = await storage.deleteTemporalInstance('non-existent-id');
    console.log(`Delete result for non-existent instance: ${nonExistentDeleteResult}`);
    console.assert(nonExistentDeleteResult === false, 'Delete should return false for non-existent instance');
    
    // Check filtered list after deletion
    const remainingInstances = await storage.getAllTemporalInstances();
    console.log(`After deletion, ${remainingInstances.length} instances remain`);
    console.assert(remainingInstances.length === 1, 'Should have only one instance remaining');
    console.assert(remainingInstances[0].id === instanceId, 'Remaining instance should be the non-deleted one');
    
    console.log('\nAll temporal instance operations verified successfully!');
  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    // Clean up test data
    await cleanupTestDirectory();
  }
}

// Run the verification
runVerification().catch(console.error);