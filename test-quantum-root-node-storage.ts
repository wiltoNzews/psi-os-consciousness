/**
 * Test script for FileSystemStorage quantum root node methods
 * 
 * This script tests the CRUD operations for quantum root nodes in the FileSystemStorage class.
 * It applies the TSAR BOMBA verification approach with explicit testing after each operation.
 */

import { FileSystemStorage } from './server/services/file-system-storage.js';
import { 
  QuantumRootNode, 
  InsertQuantumRootNode 
} from './shared/schema-minimal.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

// Test directory to avoid affecting production data
const TEST_DIR = './test-data/quantum-root-node-test';

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
 * Run verification of quantum root node methods
 */
async function runVerification() {
  console.log('Starting quantum root node methods verification...');
  
  // Set up storage with test directory
  const storage = new FileSystemStorage(TEST_DIR);
  
  // Clean up any existing test data
  await cleanupTestDirectory();
  
  try {
    // ========= CREATE OPERATION TEST =========
    console.log('\n--- Testing createQuantumRootNode ---');
    
    const nodeToCreate: InsertQuantumRootNode = {
      name: 'Primary Reasoning Node',
      description: 'Core cognitive processing unit for reasoning tasks',
      state: {
        activationLevel: 0.87,
        processingMode: 'parallel',
        inputChannels: ['language', 'visual', 'contextual'],
        outputTargets: ['decision-making', 'memory-formation'],
        bufferSize: 128
      },
      capabilities: ['logical-reasoning', 'pattern-recognition', 'causal-inference'],
      connections: {
        upstreamNodes: ['perception-pre-processor'],
        downstreamNodes: ['action-selector', 'memory-indexer'],
        lateralNodes: ['emotional-evaluator', 'uncertainty-estimator']
      },
      coherenceScore: 0.82
    };
    
    // Create the quantum root node
    const createdNode = await storage.createQuantumRootNode(nodeToCreate);
    console.log('Created quantum root node:', createdNode);
    
    // VERIFICATION: Ensure the created node has all required properties
    console.assert(createdNode.id, 'Created node should have an ID');
    console.assert(createdNode.name === nodeToCreate.name, 'Name should match');
    console.assert(createdNode.description === nodeToCreate.description, 'Description should match');
    console.assert(createdNode.state.activationLevel === nodeToCreate.state.activationLevel, 'State should match');
    console.assert(Array.isArray(createdNode.capabilities), 'Capabilities should be an array');
    console.assert(createdNode.capabilities.includes('logical-reasoning'), 'Capabilities should contain expected values');
    console.assert(createdNode.coherenceScore === nodeToCreate.coherenceScore, 'CoherenceScore should match');
    console.assert(createdNode.createdAt instanceof Date, 'Created timestamp should be set');
    console.assert(createdNode.updatedAt instanceof Date, 'Updated timestamp should be set');
    
    // Save the ID for later use
    const nodeId = createdNode.id;
    console.log(`Quantum root node created with ID: ${nodeId}`);
    
    // ========= READ OPERATION TEST =========
    console.log('\n--- Testing getQuantumRootNode ---');
    
    // Retrieve the quantum root node
    const retrievedNode = await storage.getQuantumRootNode(nodeId);
    console.log('Retrieved quantum root node:', retrievedNode);
    
    // VERIFICATION: Ensure the node was retrieved correctly
    console.assert(retrievedNode, 'Should retrieve the quantum root node');
    console.assert(retrievedNode?.id === nodeId, 'Node ID should match');
    console.assert(retrievedNode?.name === nodeToCreate.name, 'Name should match');
    console.assert(retrievedNode?.description === nodeToCreate.description, 'Description should match');
    console.assert(retrievedNode?.state.activationLevel === nodeToCreate.state.activationLevel, 'State should match');
    console.assert(retrievedNode?.connections.upstreamNodes[0] === 'perception-pre-processor', 'Connections should be preserved');
    console.assert(retrievedNode?.createdAt instanceof Date, 'CreatedAt should be a Date');
    console.assert(retrievedNode?.updatedAt instanceof Date, 'UpdatedAt should be a Date');
    
    // ========= UPDATE NODE STATE TEST =========
    console.log('\n--- Testing updateQuantumRootNodeState ---');
    
    const newState = {
      activationLevel: 0.95,
      processingMode: 'sequential',
      inputChannels: ['language', 'visual', 'contextual', 'temporal'],
      outputTargets: ['decision-making', 'memory-formation', 'communication'],
      bufferSize: 256,
      stateTransitionCount: 1,
      lastStateTransition: new Date().toISOString()
    };
    
    // Update the quantum root node state
    const stateUpdatedNode = await storage.updateQuantumRootNodeState(nodeId, newState);
    console.log('State updated quantum root node:', stateUpdatedNode);
    
    // VERIFICATION: Ensure the node state was updated correctly
    console.assert(stateUpdatedNode, 'Should return the updated node');
    console.assert(stateUpdatedNode?.state.activationLevel === newState.activationLevel, 'State activationLevel should be updated');
    console.assert(stateUpdatedNode?.state.processingMode === newState.processingMode, 'State processingMode should be updated');
    console.assert(stateUpdatedNode?.state.bufferSize === newState.bufferSize, 'State bufferSize should be updated');
    console.assert(stateUpdatedNode?.state.stateTransitionCount === 1, 'New state fields should be added');
    
    // Verify updates didn't change the immutable fields
    console.assert(stateUpdatedNode?.id === nodeId, 'ID should not change');
    console.assert(stateUpdatedNode?.name === nodeToCreate.name, 'Name should not change');
    console.assert(stateUpdatedNode?.createdAt.getTime() === retrievedNode?.createdAt.getTime(), 'CreatedAt should not change');
    
    // ========= LIST OPERATION TEST =========
    console.log('\n--- Testing getAllQuantumRootNodes ---');
    
    // List all quantum root nodes
    const allNodes = await storage.getAllQuantumRootNodes();
    console.log(`Retrieved ${allNodes.length} quantum root nodes`);
    
    // VERIFICATION: Ensure we can list nodes
    console.assert(allNodes.length > 0, 'Should have at least one node');
    console.assert(allNodes.some(n => n.id === nodeId), 'Created node should be in the list');
    
    // Create another node for filtering tests
    const secondNode: InsertQuantumRootNode = {
      name: 'Memory Management Node',
      description: 'Handles memory indexing and retrieval operations',
      state: {
        activationLevel: 0.76,
        processingMode: 'distributed',
        memoryTypes: ['episodic', 'semantic', 'procedural'],
        indexingMethod: 'hierarchical',
        retrievalOptimization: 'recency-biased'
      },
      capabilities: ['memory-indexing', 'context-aware-retrieval', 'forgetting-curve-optimization'],
      connections: {
        upstreamNodes: ['perception-processor', 'reasoning-node'],
        downstreamNodes: ['planning-engine'],
        lateralNodes: ['knowledge-integration-module']
      },
      coherenceScore: 0.79
    };
    
    const createdSecondNode = await storage.createQuantumRootNode(secondNode);
    console.log('Created second quantum root node:', createdSecondNode);
    
    // ========= UPDATE OPERATION TEST =========
    console.log('\n--- Testing updateQuantumRootNode ---');
    
    const nodeUpdate = {
      name: 'Primary Reasoning Node V2',
      description: 'Enhanced core cognitive processing unit for reasoning tasks',
      capabilities: [...(retrievedNode?.capabilities || []), 'counterfactual-reasoning', 'analogical-thinking'],
      coherenceScore: 0.88,
      connections: {
        ...(retrievedNode?.connections || {}),
        downstreamNodes: ['action-selector', 'memory-indexer', 'reflection-module'],
        crossModalNodes: ['sensory-integration-unit']
      }
    };
    
    // Update the quantum root node
    const updatedNode = await storage.updateQuantumRootNode(nodeId, nodeUpdate);
    console.log('Updated quantum root node:', updatedNode);
    
    // VERIFICATION: Ensure the node was updated correctly
    console.assert(updatedNode, 'Should return the updated node');
    console.assert(updatedNode?.name === nodeUpdate.name, 'Name should be updated');
    console.assert(updatedNode?.description === nodeUpdate.description, 'Description should be updated');
    console.assert(updatedNode?.coherenceScore === nodeUpdate.coherenceScore, 'CoherenceScore should be updated');
    console.assert(updatedNode?.capabilities.includes('counterfactual-reasoning'), 'Capabilities should be updated');
    console.assert(updatedNode?.connections.crossModalNodes.includes('sensory-integration-unit'), 'New connection types should be added');
    
    // ========= DELETE OPERATION TEST =========
    console.log('\n--- Testing deleteQuantumRootNode ---');
    
    // Delete the second quantum root node
    const deleteResult = await storage.deleteQuantumRootNode(createdSecondNode.id);
    console.log(`Delete result: ${deleteResult}`);
    
    // VERIFICATION: Ensure the node was deleted
    console.assert(deleteResult === true, 'Delete should return true for successful deletion');
    
    // Try to get the deleted node
    const deletedNode = await storage.getQuantumRootNode(createdSecondNode.id);
    console.log('Result of getting deleted node:', deletedNode);
    
    // VERIFICATION: Ensure the node is gone
    console.assert(deletedNode === undefined, 'Deleted node should not be retrievable');
    
    // Verify the other node still exists
    const remainingNode = await storage.getQuantumRootNode(nodeId);
    console.assert(remainingNode !== undefined, 'Non-deleted node should still exist');
    
    // Test deletion of non-existent node
    const nonExistentDeleteResult = await storage.deleteQuantumRootNode('non-existent-id');
    console.log(`Delete result for non-existent node: ${nonExistentDeleteResult}`);
    console.assert(nonExistentDeleteResult === false, 'Delete should return false for non-existent node');
    
    // Check filtered list after deletion
    const remainingNodes = await storage.getAllQuantumRootNodes();
    console.log(`After deletion, ${remainingNodes.length} nodes remain`);
    console.assert(remainingNodes.length === 1, 'Should have only one node remaining');
    console.assert(remainingNodes[0].id === nodeId, 'Remaining node should be the non-deleted one');
    
    console.log('\nAll quantum root node operations verified successfully!');
  } catch (error) {
    console.error('Error during verification:', error);
    throw error; // Re-throw to see the full error stack
  } finally {
    // Clean up test data
    await cleanupTestDirectory();
  }
}

// Run the verification
runVerification().catch(console.error);