/**
 * Test script for FileSystemStorage neural pathway methods
 * 
 * This script tests the CRUD operations for neural pathways in the FileSystemStorage class.
 * It applies the TSAR BOMBA verification approach with explicit testing after each operation.
 */

import { FileSystemStorage } from './server/services/file-system-storage.js';
import { 
  NeuralPathway, 
  InsertNeuralPathway,
  QuantumRootNode,
  InsertQuantumRootNode
} from './shared/schema-minimal.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

// Test directory to avoid affecting production data
const TEST_DIR = './test-data/neural-pathway-test';

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
 * Run verification of neural pathway methods
 */
async function runVerification() {
  console.log('Starting neural pathway methods verification...');
  
  // Set up storage with test directory
  const storage = new FileSystemStorage(TEST_DIR);
  
  // Clean up any existing test data
  await cleanupTestDirectory();
  
  try {
    // First, create two quantum root nodes to connect with a pathway
    const sourceNodeData: InsertQuantumRootNode = {
      name: 'Perception Node',
      description: 'Processes sensory input',
      state: { activationLevel: 0.8 },
      capabilities: ['pattern-detection', 'feature-extraction']
    };
    
    const targetNodeData: InsertQuantumRootNode = {
      name: 'Reasoning Node',
      description: 'Higher-level cognitive processing',
      state: { activationLevel: 0.7 },
      capabilities: ['logical-inference', 'causal-reasoning']
    };
    
    const sourceNode = await storage.createQuantumRootNode(sourceNodeData);
    const targetNode = await storage.createQuantumRootNode(targetNodeData);
    
    console.log(`Created source node: ${sourceNode.id}`);
    console.log(`Created target node: ${targetNode.id}`);
    
    // ========= CREATE OPERATION TEST =========
    console.log('\n--- Testing createNeuralPathway ---');
    
    const pathwayToCreate: InsertNeuralPathway = {
      sourceId: sourceNode.id,
      targetId: targetNode.id,
      weight: 0.85,
      type: 'excitatory',
      metadata: {
        learningRate: 0.05,
        activationThreshold: 0.3,
        decayRate: 0.01,
        connectionStrength: 'strong',
        initializedBy: 'system'
      },
      pathType: 'information-forward'
    };
    
    // Create the neural pathway
    const createdPathway = await storage.createNeuralPathway(pathwayToCreate);
    console.log('Created neural pathway:', createdPathway);
    
    // VERIFICATION: Ensure the created pathway has all required properties
    console.assert(createdPathway.id, 'Created pathway should have an ID');
    console.assert(createdPathway.sourceId === pathwayToCreate.sourceId, 'Source ID should match');
    console.assert(createdPathway.targetId === pathwayToCreate.targetId, 'Target ID should match');
    console.assert(createdPathway.weight === pathwayToCreate.weight, 'Weight should match');
    console.assert(createdPathway.type === pathwayToCreate.type, 'Type should match');
    console.assert(createdPathway.pathType === pathwayToCreate.pathType, 'PathType should match');
    console.assert(createdPathway.metadata.connectionStrength === pathwayToCreate.metadata.connectionStrength, 'Metadata should match');
    console.assert(createdPathway.createdAt instanceof Date, 'Created timestamp should be set');
    console.assert(createdPathway.updatedAt instanceof Date, 'Updated timestamp should be set');
    
    // Save the ID for later use
    const pathwayId = createdPathway.id;
    console.log(`Neural pathway created with ID: ${pathwayId}`);
    
    // ========= READ OPERATION TEST =========
    console.log('\n--- Testing getNeuralPathway ---');
    
    // Retrieve the neural pathway
    const retrievedPathway = await storage.getNeuralPathway(pathwayId);
    console.log('Retrieved neural pathway:', retrievedPathway);
    
    // VERIFICATION: Ensure the pathway was retrieved correctly
    console.assert(retrievedPathway, 'Should retrieve the neural pathway');
    console.assert(retrievedPathway?.id === pathwayId, 'Pathway ID should match');
    console.assert(retrievedPathway?.sourceId === pathwayToCreate.sourceId, 'Source ID should match');
    console.assert(retrievedPathway?.targetId === pathwayToCreate.targetId, 'Target ID should match');
    console.assert(retrievedPathway?.weight === pathwayToCreate.weight, 'Weight should match');
    console.assert(retrievedPathway?.metadata.learningRate === pathwayToCreate.metadata.learningRate, 'Metadata should be preserved');
    console.assert(retrievedPathway?.createdAt instanceof Date, 'CreatedAt should be a Date');
    console.assert(retrievedPathway?.updatedAt instanceof Date, 'UpdatedAt should be a Date');
    
    // ========= LIST OPERATION TEST =========
    console.log('\n--- Testing getAllNeuralPathways ---');
    
    // List all neural pathways
    const allPathways = await storage.getAllNeuralPathways();
    console.log(`Retrieved ${allPathways.length} neural pathways`);
    
    // VERIFICATION: Ensure we can list pathways
    console.assert(allPathways.length > 0, 'Should have at least one pathway');
    console.assert(allPathways.some(p => p.id === pathwayId), 'Created pathway should be in the list');
    
    // Create another pathway for testing filters
    const secondPathway: InsertNeuralPathway = {
      sourceId: targetNode.id,
      targetId: sourceNode.id,
      weight: 0.65,
      type: 'inhibitory',
      metadata: {
        learningRate: 0.03,
        activationThreshold: 0.5,
        decayRate: 0.02,
        connectionStrength: 'moderate',
        initializedBy: 'adaptive-process'
      },
      pathType: 'feedback-loop'
    };
    
    const createdSecondPathway = await storage.createNeuralPathway(secondPathway);
    console.log('Created second neural pathway:', createdSecondPathway);
    
    // Test filtered listing
    const filteredBySource = await storage.getAllNeuralPathways(undefined, { sourceId: sourceNode.id });
    console.log(`Retrieved ${filteredBySource.length} pathways filtered by sourceId`);
    console.assert(filteredBySource.length === 1, 'Should filter pathways by sourceId');
    console.assert(filteredBySource[0].id === pathwayId, 'Filtered pathway should match expected ID');
    
    const filteredByType = await storage.getAllNeuralPathways(undefined, { pathType: 'feedback-loop' });
    console.log(`Retrieved ${filteredByType.length} pathways filtered by pathType`);
    console.assert(filteredByType.length === 1, 'Should filter pathways by pathType');
    console.assert(filteredByType[0].id === createdSecondPathway.id, 'Filtered pathway should match expected ID');
    
    // ========= UPDATE OPERATION TEST =========
    console.log('\n--- Testing updateNeuralPathway ---');
    
    const pathwayUpdate = {
      weight: 0.92,
      metadata: {
        ...retrievedPathway?.metadata,
        learningRate: 0.08,
        adaptiveAdjustment: true,
        lastStrengthened: new Date().toISOString()
      }
    };
    
    // Update the neural pathway
    const updatedPathway = await storage.updateNeuralPathway(pathwayId, pathwayUpdate);
    console.log('Updated neural pathway:', updatedPathway);
    
    // VERIFICATION: Ensure the pathway was updated correctly
    console.assert(updatedPathway, 'Should return the updated pathway');
    console.assert(updatedPathway?.weight === pathwayUpdate.weight, 'Weight should be updated');
    console.assert(updatedPathway?.metadata.learningRate === pathwayUpdate.metadata.learningRate, 'Metadata should be updated');
    console.assert(updatedPathway?.metadata.adaptiveAdjustment === true, 'New metadata fields should be added');
    
    // Verify updates didn't change the immutable fields
    console.assert(updatedPathway?.id === pathwayId, 'ID should not change');
    console.assert(updatedPathway?.sourceId === pathwayToCreate.sourceId, 'Source ID should not change');
    console.assert(updatedPathway?.targetId === pathwayToCreate.targetId, 'Target ID should not change');
    console.assert(updatedPathway?.createdAt.getTime() === retrievedPathway?.createdAt.getTime(), 'CreatedAt should not change');
    console.assert(updatedPathway?.updatedAt.getTime() !== retrievedPathway?.updatedAt.getTime(), 'UpdatedAt should change');
    
    // ========= DELETE OPERATION TEST =========
    console.log('\n--- Testing deleteNeuralPathway ---');
    
    // Delete the second neural pathway
    const deleteResult = await storage.deleteNeuralPathway(createdSecondPathway.id);
    console.log(`Delete result: ${deleteResult}`);
    
    // VERIFICATION: Ensure the pathway was deleted
    console.assert(deleteResult === true, 'Delete should return true for successful deletion');
    
    // Try to get the deleted pathway
    const deletedPathway = await storage.getNeuralPathway(createdSecondPathway.id);
    console.log('Result of getting deleted pathway:', deletedPathway);
    
    // VERIFICATION: Ensure the pathway is gone
    console.assert(deletedPathway === undefined, 'Deleted pathway should not be retrievable');
    
    // Verify the other pathway still exists
    const remainingPathway = await storage.getNeuralPathway(pathwayId);
    console.assert(remainingPathway !== undefined, 'Non-deleted pathway should still exist');
    
    // Test deletion of non-existent pathway
    const nonExistentDeleteResult = await storage.deleteNeuralPathway('non-existent-id');
    console.log(`Delete result for non-existent pathway: ${nonExistentDeleteResult}`);
    console.assert(nonExistentDeleteResult === false, 'Delete should return false for non-existent pathway');
    
    // Check filtered list after deletion
    const remainingPathways = await storage.getAllNeuralPathways();
    console.log(`After deletion, ${remainingPathways.length} pathways remain`);
    console.assert(remainingPathways.length === 1, 'Should have only one pathway remaining');
    console.assert(remainingPathways[0].id === pathwayId, 'Remaining pathway should be the non-deleted one');
    
    console.log('\nAll neural pathway operations verified successfully!');
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