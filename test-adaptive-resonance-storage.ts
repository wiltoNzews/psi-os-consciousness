/**
 * Test script for FileSystemStorage adaptive resonance methods
 * 
 * This script tests the CRUD operations for adaptive resonances in the FileSystemStorage class.
 * It applies the TSAR BOMBA verification approach with explicit testing after each operation.
 */

import { FileSystemStorage } from './server/services/file-system-storage.js';
import { 
  AdaptiveResonance, 
  InsertAdaptiveResonance 
} from './shared/schema-minimal.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

// Test directory to avoid affecting production data
const TEST_DIR = './test-data/adaptive-resonances-test';

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
 * Run verification of adaptive resonance methods
 */
async function runVerification() {
  console.log('Starting adaptive resonance methods verification...');
  
  // Set up storage with test directory
  const storage = new FileSystemStorage(TEST_DIR);
  
  // Clean up any existing test data
  await cleanupTestDirectory();
  
  try {
    // ========= CREATE OPERATION TEST =========
    console.log('\n--- Testing createAdaptiveResonance ---');
    
    const resonanceToCreate: InsertAdaptiveResonance = {
      chunkId: 'chunk-test-001',
      modelType: 'gpt-4',
      strength: 0.89,
      adaptationRate: 0.12,
      metadata: {
        processingDuration: 245,
        tokensConsumed: 128,
        confidenceScore: 0.91,
        optimizationLevel: 'high'
      }
    };
    
    // Create the adaptive resonance
    const createdResonance = await storage.createAdaptiveResonance(resonanceToCreate);
    console.log('Created adaptive resonance:', createdResonance);
    
    // VERIFICATION: Ensure the created resonance has all required properties
    console.assert(createdResonance.id, 'Created resonance should have an ID');
    console.assert(createdResonance.chunkId === resonanceToCreate.chunkId, 'ChunkId should match');
    console.assert(createdResonance.modelType === resonanceToCreate.modelType, 'ModelType should match');
    console.assert(createdResonance.strength === resonanceToCreate.strength, 'Strength should match');
    console.assert(createdResonance.adaptationRate === resonanceToCreate.adaptationRate, 'AdaptationRate should match');
    console.assert(createdResonance.createdAt instanceof Date, 'Created timestamp should be set');
    console.assert(createdResonance.updatedAt instanceof Date, 'Updated timestamp should be set');
    
    // Save the ID for later use
    const resonanceId = createdResonance.id;
    console.log(`Adaptive resonance created with ID: ${resonanceId}`);
    
    // ========= READ OPERATION TEST =========
    console.log('\n--- Testing getAdaptiveResonance ---');
    
    // Retrieve the adaptive resonance
    const retrievedResonance = await storage.getAdaptiveResonance(resonanceId);
    console.log('Retrieved adaptive resonance:', retrievedResonance);
    
    // VERIFICATION: Ensure the resonance was retrieved correctly
    console.assert(retrievedResonance, 'Should retrieve the adaptive resonance');
    console.assert(retrievedResonance?.id === resonanceId, 'Resonance ID should match');
    console.assert(retrievedResonance?.chunkId === resonanceToCreate.chunkId, 'ChunkId should match');
    console.assert(retrievedResonance?.modelType === resonanceToCreate.modelType, 'ModelType should match');
    console.assert(retrievedResonance?.strength === resonanceToCreate.strength, 'Strength should match');
    console.assert(retrievedResonance?.adaptationRate === resonanceToCreate.adaptationRate, 'AdaptationRate should match');
    console.assert(retrievedResonance?.metadata?.processingDuration === 245, 'Metadata should be preserved');
    console.assert(retrievedResonance?.createdAt instanceof Date, 'CreatedAt should be a Date');
    console.assert(retrievedResonance?.updatedAt instanceof Date, 'UpdatedAt should be a Date');
    
    // ========= LIST OPERATION TEST =========
    console.log('\n--- Testing getAllAdaptiveResonances ---');
    
    // List all adaptive resonances
    const allResonances = await storage.getAllAdaptiveResonances();
    console.log(`Retrieved ${allResonances.length} adaptive resonances`);
    
    // VERIFICATION: Ensure we can list resonances
    console.assert(allResonances.length > 0, 'Should have at least one resonance');
    console.assert(allResonances.some(r => r.id === resonanceId), 'Created resonance should be in the list');
    
    // Create another resonance for filtering tests
    const secondResonance: InsertAdaptiveResonance = {
      chunkId: 'chunk-test-002',
      modelType: 'gpt-3.5-turbo',
      strength: 0.76,
      adaptationRate: 0.08,
      metadata: {
        processingDuration: 122,
        tokensConsumed: 89,
        confidenceScore: 0.82,
        optimizationLevel: 'medium'
      }
    };
    
    const createdSecondResonance = await storage.createAdaptiveResonance(secondResonance);
    console.log('Created second adaptive resonance:', createdSecondResonance);
    
    // Test filtering by chunkId
    const filteredByChunk = await storage.getAllAdaptiveResonances(undefined, { chunkId: 'chunk-test-001' });
    console.log(`Retrieved ${filteredByChunk.length} resonances filtered by chunkId`);
    console.assert(filteredByChunk.length === 1, 'Should retrieve only one resonance with the specified chunkId');
    console.assert(filteredByChunk[0].id === resonanceId, 'Should retrieve the correct resonance by chunkId');
    
    // Test filtering by modelType
    const filteredByModel = await storage.getAllAdaptiveResonances(undefined, { modelType: 'gpt-3.5-turbo' });
    console.log(`Retrieved ${filteredByModel.length} resonances filtered by modelType`);
    console.assert(filteredByModel.length === 1, 'Should retrieve only one resonance with the specified modelType');
    console.assert(filteredByModel[0].id === createdSecondResonance.id, 'Should retrieve the correct resonance by modelType');
    
    // ========= UPDATE OPERATION TEST =========
    console.log('\n--- Testing updateAdaptiveResonance ---');
    
    const resonanceUpdate = {
      strength: 0.93,
      adaptationRate: 0.15,
      metadata: {
        ...retrievedResonance?.metadata,
        updateCount: 1,
        confidenceScore: 0.94,
        adaptiveOptimization: true
      }
    };
    
    // Update the adaptive resonance
    const updatedResonance = await storage.updateAdaptiveResonance(resonanceId, resonanceUpdate);
    console.log('Updated adaptive resonance:', updatedResonance);
    
    // VERIFICATION: Ensure the resonance was updated correctly
    console.assert(updatedResonance, 'Should return the updated resonance');
    console.assert(updatedResonance?.strength === resonanceUpdate.strength, 'Strength should be updated');
    console.assert(updatedResonance?.adaptationRate === resonanceUpdate.adaptationRate, 'AdaptationRate should be updated');
    console.assert(updatedResonance?.metadata?.updateCount === 1, 'Metadata should be updated');
    console.assert(updatedResonance?.metadata?.confidenceScore === 0.94, 'Metadata values should be updated');
    console.assert(updatedResonance?.metadata?.adaptiveOptimization === true, 'New metadata fields should be added');
    
    // Verify updates didn't change the immutable fields
    console.assert(updatedResonance?.id === resonanceId, 'ID should not change');
    console.assert(updatedResonance?.chunkId === resonanceToCreate.chunkId, 'ChunkId should not change');
    console.assert(updatedResonance?.modelType === resonanceToCreate.modelType, 'ModelType should not change');
    
    // ========= DELETE OPERATION TEST =========
    console.log('\n--- Testing deleteAdaptiveResonance ---');
    
    // Delete the second adaptive resonance
    const deleteResult = await storage.deleteAdaptiveResonance(createdSecondResonance.id);
    console.log(`Delete result: ${deleteResult}`);
    
    // VERIFICATION: Ensure the resonance was deleted
    console.assert(deleteResult === true, 'Delete should return true for successful deletion');
    
    // Try to get the deleted resonance
    const deletedResonance = await storage.getAdaptiveResonance(createdSecondResonance.id);
    console.log('Result of getting deleted resonance:', deletedResonance);
    
    // VERIFICATION: Ensure the resonance is gone
    console.assert(deletedResonance === undefined, 'Deleted resonance should not be retrievable');
    
    // Verify the other resonance still exists
    const remainingResonance = await storage.getAdaptiveResonance(resonanceId);
    console.assert(remainingResonance !== undefined, 'Non-deleted resonance should still exist');
    
    // Test deletion of non-existent resonance
    const nonExistentDeleteResult = await storage.deleteAdaptiveResonance('non-existent-id');
    console.log(`Delete result for non-existent resonance: ${nonExistentDeleteResult}`);
    console.assert(nonExistentDeleteResult === false, 'Delete should return false for non-existent resonance');
    
    // Check filtered list after deletion
    const remainingResonances = await storage.getAllAdaptiveResonances();
    console.log(`After deletion, ${remainingResonances.length} resonances remain`);
    console.assert(remainingResonances.length === 1, 'Should have only one resonance remaining');
    console.assert(remainingResonances[0].id === resonanceId, 'Remaining resonance should be the non-deleted one');
    
    console.log('\nAll adaptive resonance operations verified successfully!');
  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    // Clean up test data
    await cleanupTestDirectory();
  }
}

// Run the verification
runVerification().catch(console.error);