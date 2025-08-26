/**
 * Test script for FileSystemStorage QuantumRootNode operations
 * 
 * This script tests the CRUD operations for quantum root nodes in the FileSystemStorage class.
 */

import { FileSystemStorage } from './server/storage';
import { QuantumRootNode, InsertQuantumRootNode } from './shared/schema-minimal';
import * as fs from 'fs/promises';
import * as path from 'path';

// Create a test directory path
const TEST_DIR = './test-qrn-data';

// Clean up the test directory to ensure a clean test environment
async function cleanupTestDirectory() {
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
    console.log(`Test directory ${TEST_DIR} cleaned up`);
  } catch (error) {
    console.error(`Error cleaning up test directory: ${error.message}`);
  }
}

// Run verification of quantum root node methods
async function runVerification() {
  console.log('Starting FileSystemStorage QRN methods verification...');
  
  // Create a storage instance for testing
  const storage = new FileSystemStorage(TEST_DIR);
  
  try {
    // Step 1: Create a new quantum root node
    console.log('\nStep 1: Creating a test quantum root node...');
    const nodeToCreate: InsertQuantumRootNode = {
      name: 'Test QRN',
      description: 'This is a test quantum root node created for verification',
      state: { status: 'active', position: [0, 0, 0] },
      capabilities: ['processing', 'storage', 'analysis'],
      coherenceScore: 0.85
    };
    
    const createdNode = await storage.createQuantumRootNode(nodeToCreate);
    console.log('✓ Quantum root node created successfully:');
    console.log(JSON.stringify(createdNode, null, 2));
    
    // Step 2: Verify the node was saved by retrieving it
    console.log('\nStep 2: Retrieving the quantum root node...');
    const retrievedNode = await storage.getQuantumRootNode(createdNode.id);
    if (!retrievedNode) {
      throw new Error('Quantum root node was not found after saving');
    }
    console.log('✓ Quantum root node retrieved successfully');
    
    // Step 3: Update the quantum root node
    console.log('\nStep 3: Updating the quantum root node...');
    const updates = {
      description: 'Updated test quantum root node',
      state: { ...retrievedNode.state, status: 'updated', lastOperation: 'test' },
      coherenceScore: 0.92
    };
    
    const updatedNode = await storage.updateQuantumRootNode(createdNode.id, updates);
    if (!updatedNode) {
      throw new Error('Quantum root node update failed');
    }
    console.log('✓ Quantum root node updated successfully:');
    console.log(JSON.stringify(updatedNode, null, 2));
    
    // Step 4: Get all quantum root nodes
    console.log('\nStep 4: Getting all quantum root nodes...');
    const allNodes = await storage.getAllQuantumRootNodes();
    console.log(`✓ Found ${allNodes.length} quantum root nodes`);
    
    // Step 5: Delete the quantum root node
    console.log('\nStep 5: Deleting the quantum root node...');
    const deleteResult = await storage.deleteQuantumRootNode(createdNode.id);
    if (!deleteResult) {
      throw new Error('Quantum root node deletion failed');
    }
    console.log('✓ Quantum root node deleted successfully');
    
    // Step 6: Verify deletion by trying to retrieve the deleted node
    console.log('\nStep 6: Verifying quantum root node deletion...');
    const deletedNode = await storage.getQuantumRootNode(createdNode.id);
    if (deletedNode) {
      throw new Error('Quantum root node still exists after deletion');
    }
    console.log('✓ Quantum root node confirmed deleted');
    
    console.log('\nAll quantum root node operations verified successfully ✓');
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