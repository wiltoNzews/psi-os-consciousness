/**
 * Test script for FileSystemStorage TemporalInstance operations
 * 
 * This script tests the CRUD operations for temporal instances in the FileSystemStorage class.
 */

import { FileSystemStorage } from './server/storage';
import { TemporalInstance, InsertTemporalInstance } from './shared/schema-minimal';
import * as fs from 'fs/promises';
import * as path from 'path';

// Create a test directory path
const TEST_DIR = './test-temporal-data';

// Clean up the test directory to ensure a clean test environment
async function cleanupTestDirectory() {
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
    console.log(`Test directory ${TEST_DIR} cleaned up`);
  } catch (error) {
    console.error(`Error cleaning up test directory: ${error.message}`);
  }
}

// Run verification of temporal instance methods
async function runVerification() {
  console.log('Starting FileSystemStorage TemporalInstance methods verification...');
  
  // Create a storage instance for testing
  const storage = new FileSystemStorage(TEST_DIR);
  
  try {
    // First create a quantum root node to associate with the temporal instance
    const qrn = await storage.createQuantumRootNode({
      name: 'Test Parent QRN',
      description: 'Parent QRN for temporal instance test',
      state: { status: 'active' }
    });
    
    // Step 1: Create a new temporal instance
    console.log('\nStep 1: Creating a test temporal instance...');
    const instanceToCreate: InsertTemporalInstance = {
      nodeId: qrn.id,
      state: 'initial',
      dimensionType: 'linear',
      timestamp: new Date(),
      stabilityFactor: 0.75,
      metadata: { purpose: 'testing', origin: 'verification script' }
    };
    
    const createdInstance = await storage.createTemporalInstance(instanceToCreate);
    console.log('✓ Temporal instance created successfully:');
    console.log(JSON.stringify(createdInstance, null, 2));
    
    // Step 2: Verify the instance was saved by retrieving it
    console.log('\nStep 2: Retrieving the temporal instance...');
    const retrievedInstance = await storage.getTemporalInstance(createdInstance.id);
    if (!retrievedInstance) {
      throw new Error('Temporal instance was not found after saving');
    }
    console.log('✓ Temporal instance retrieved successfully');
    
    // Step 3: Update the temporal instance
    console.log('\nStep 3: Updating the temporal instance...');
    const updates = {
      state: 'updated',
      stabilityFactor: 0.85,
      metadata: { ...retrievedInstance.metadata, updated: true, updateTime: new Date() }
    };
    
    const updatedInstance = await storage.updateTemporalInstance(createdInstance.id, updates);
    if (!updatedInstance) {
      throw new Error('Temporal instance update failed');
    }
    console.log('✓ Temporal instance updated successfully:');
    console.log(JSON.stringify(updatedInstance, null, 2));
    
    // Step 4: Get all temporal instances
    console.log('\nStep 4: Getting all temporal instances...');
    const allInstances = await storage.getAllTemporalInstances();
    console.log(`✓ Found ${allInstances.length} temporal instances`);
    
    // Step 5: Delete the temporal instance
    console.log('\nStep 5: Deleting the temporal instance...');
    const deleteResult = await storage.deleteTemporalInstance(createdInstance.id);
    if (!deleteResult) {
      throw new Error('Temporal instance deletion failed');
    }
    console.log('✓ Temporal instance deleted successfully');
    
    // Step 6: Verify deletion by trying to retrieve the deleted instance
    console.log('\nStep 6: Verifying temporal instance deletion...');
    const deletedInstance = await storage.getTemporalInstance(createdInstance.id);
    if (deletedInstance) {
      throw new Error('Temporal instance still exists after deletion');
    }
    console.log('✓ Temporal instance confirmed deleted');
    
    // Also clean up the quantum root node
    await storage.deleteQuantumRootNode(qrn.id);
    
    console.log('\nAll temporal instance operations verified successfully ✓');
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    // Clean up the test directory
    await cleanupTestDirectory();
  }
}

// Run the verification
runVerification().catch(error => {
  console.error('Unhandled error during verification:', error);
  cleanupTestDirectory();
});