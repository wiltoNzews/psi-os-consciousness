/**
 * Test script for FileSystemStorage chunk dependency methods
 * 
 * This script tests the basic CRUD operations for chunk dependencies in the FileSystemStorage class.
 * It applies the TSAR BOMBA verification approach with explicit testing after each operation.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  ChunkDependency,
  InsertChunkDependency,
  InsertChunk,
  chunkStatesEnum
} from './shared/schema-minimal';
import path from 'path';
import fs from 'fs/promises';

// Create a temporary test directory
const TEST_DIR = './test-dependency-data';

/**
 * Clean up the test directory to ensure a clean test environment
 */
async function cleanupTestDirectory() {
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
    console.log(`Test directory ${TEST_DIR} cleaned up`);
  } catch (err) {
    console.log(`Test directory ${TEST_DIR} does not exist or couldn't be removed`);
  }
}

/**
 * Run verification of chunk dependency methods
 */
async function runVerification() {
  // Import the FileSystemStorage class dynamically to avoid TypeScript import issues
  const { FileSystemStorage } = await import('./server/services/file-system-storage.js');
  
  console.log('Beginning TSAR BOMBA verification of chunk dependency operations...');
  
  // Initialize storage with test directory
  const storage = new FileSystemStorage(TEST_DIR);
  console.log('FileSystemStorage initialized with test directory:', TEST_DIR);
  
  // First, create two chunks to use in our dependency operations
  const sourceChunkId = uuidv4();
  const targetChunkId = uuidv4();
  
  const sourceChunk: InsertChunk = {
    originalContent: 'Source chunk content',
    chunkIndex: 0,
    totalChunks: 1,
    chunkSize: 18,
    chunkState: chunkStatesEnum.enumValues[0]
  };
  
  const targetChunk: InsertChunk = {
    originalContent: 'Target chunk content',
    chunkIndex: 0,
    totalChunks: 1,
    chunkSize: 18,
    chunkState: chunkStatesEnum.enumValues[0]
  };
  
  // Create source and target chunks
  console.log('Creating source chunk...');
  const createdSourceChunk = await storage.createChunk({ ...sourceChunk, id: sourceChunkId });
  console.log('Source chunk created:', createdSourceChunk.id);
  
  console.log('Creating target chunk...');
  const createdTargetChunk = await storage.createChunk({ ...targetChunk, id: targetChunkId });
  console.log('Target chunk created:', createdTargetChunk.id);
  
  // 1. Test createChunkDependency
  console.log('\n1. Testing createChunkDependency...');
  const dependencyToCreate: InsertChunkDependency = {
    sourceChunkId: sourceChunkId,
    targetChunkId: targetChunkId,
    type: 'semantic',
    strength: 0.85,
    metadata: { notes: 'Test dependency' }
  };
  
  const createdDependency = await storage.createChunkDependency(dependencyToCreate);
  console.log('Created chunk dependency:', createdDependency);
  
  // Verify dependency exists on disk
  const dependencyPath = path.join(TEST_DIR, 'chunk_dependencies', `dependency_${createdDependency.id}.json`);
  try {
    await fs.access(dependencyPath);
    console.log('VERIFIED: Chunk dependency file exists on disk');
  } catch (err) {
    console.error('FAILED: Chunk dependency file does not exist on disk');
    process.exit(1);
  }
  
  // 2. Test getChunkDependency
  console.log('\n2. Testing getChunkDependency...');
  const retrievedDependency = await storage.getChunkDependency(createdDependency.id);
  console.log('Retrieved chunk dependency:', retrievedDependency);
  
  if (!retrievedDependency) {
    console.error('FAILED: Chunk dependency retrieval returned undefined');
    process.exit(1);
  }
  
  if (retrievedDependency.sourceChunkId !== sourceChunkId || 
      retrievedDependency.targetChunkId !== targetChunkId ||
      retrievedDependency.type !== 'semantic' ||
      retrievedDependency.strength !== 0.85) {
    console.error('FAILED: Retrieved chunk dependency does not match created dependency');
    process.exit(1);
  }
  
  console.log('VERIFIED: Retrieved chunk dependency matches created dependency');
  
  // 3. Test getAllChunkDependencies
  console.log('\n3. Testing getAllChunkDependencies...');
  
  // Add another dependency
  const anotherDependency: InsertChunkDependency = {
    sourceChunkId: targetChunkId, // reversed direction
    targetChunkId: sourceChunkId,
    type: 'sequential',
    strength: 0.5,
    metadata: { notes: 'Another test dependency' }
  };
  
  const createdDependency2 = await storage.createChunkDependency(anotherDependency);
  console.log('Created second chunk dependency:', createdDependency2);
  
  // Get all dependencies
  const allDependencies = await storage.getAllChunkDependencies();
  console.log('All chunk dependencies:', allDependencies);
  
  if (allDependencies.length !== 2) {
    console.error(`FAILED: Expected 2 dependencies, got ${allDependencies.length}`);
    process.exit(1);
  }
  
  console.log('VERIFIED: getAllChunkDependencies returns correct number of dependencies');
  
  // 4. Test getAllChunkDependencies with filters
  console.log('\n4. Testing getAllChunkDependencies with filters...');
  
  // Filter by source ID
  const dependenciesFromSource = await storage.getAllChunkDependencies({ sourceId: sourceChunkId });
  console.log('Dependencies with source ID filter:', dependenciesFromSource);
  
  if (dependenciesFromSource.length !== 1 || dependenciesFromSource[0].id !== createdDependency.id) {
    console.error(`FAILED: Expected 1 dependency with source ID ${sourceChunkId}, got incorrect result`);
    process.exit(1);
  }
  
  // Filter by target ID
  const dependenciesToTarget = await storage.getAllChunkDependencies({ targetId: sourceChunkId });
  console.log('Dependencies with target ID filter:', dependenciesToTarget);
  
  if (dependenciesToTarget.length !== 1 || dependenciesToTarget[0].id !== createdDependency2.id) {
    console.error(`FAILED: Expected 1 dependency with target ID ${sourceChunkId}, got incorrect result`);
    process.exit(1);
  }
  
  console.log('VERIFIED: getAllChunkDependencies with filters works correctly');
  
  // 5. Test updateChunkDependency
  console.log('\n5. Testing updateChunkDependency...');
  
  const dependencyUpdate = {
    strength: 0.95,
    metadata: { notes: 'Updated test dependency', updated: true }
  };
  
  const updatedDependency = await storage.updateChunkDependency(createdDependency.id, dependencyUpdate);
  console.log('Updated chunk dependency:', updatedDependency);
  
  if (!updatedDependency) {
    console.error('FAILED: Chunk dependency update returned undefined');
    process.exit(1);
  }
  
  if (updatedDependency.strength !== 0.95 || 
      !updatedDependency.metadata.updated ||
      updatedDependency.metadata.notes !== 'Updated test dependency') {
    console.error('FAILED: Updated chunk dependency does not contain updated values');
    process.exit(1);
  }
  
  console.log('VERIFIED: updateChunkDependency works correctly');
  
  // 6. Test deleteChunkDependency
  console.log('\n6. Testing deleteChunkDependency...');
  
  const deleteResult = await storage.deleteChunkDependency(createdDependency.id);
  console.log('Delete result:', deleteResult);
  
  if (!deleteResult) {
    console.error('FAILED: Dependency deletion failed');
    process.exit(1);
  }
  
  // Verify dependency doesn't exist on disk
  try {
    await fs.access(dependencyPath);
    console.error('FAILED: Chunk dependency file still exists on disk after deletion');
    process.exit(1);
  } catch (err) {
    console.log('VERIFIED: Chunk dependency file was successfully deleted from disk');
  }
  
  // Verify dependency can't be retrieved
  const shouldBeUndefined = await storage.getChunkDependency(createdDependency.id);
  if (shouldBeUndefined !== undefined) {
    console.error('FAILED: Deleted chunk dependency is still retrievable');
    process.exit(1);
  }
  
  console.log('VERIFIED: deleteChunkDependency works correctly');
  
  // 7. Test non-existent dependency retrieval and updates
  console.log('\n7. Testing non-existent dependency operations...');
  
  const nonExistentId = 'non-existent-id';
  
  const nonExistentDependency = await storage.getChunkDependency(nonExistentId);
  console.log('Non-existent dependency retrieval result:', nonExistentDependency);
  
  if (nonExistentDependency !== undefined) {
    console.error('FAILED: Non-existent dependency retrieval did not return undefined');
    process.exit(1);
  }
  
  const nonExistentUpdate = await storage.updateChunkDependency(nonExistentId, { strength: 1.0 });
  console.log('Non-existent dependency update result:', nonExistentUpdate);
  
  if (nonExistentUpdate !== undefined) {
    console.error('FAILED: Non-existent dependency update did not return undefined');
    process.exit(1);
  }
  
  const nonExistentDelete = await storage.deleteChunkDependency(nonExistentId);
  console.log('Non-existent dependency delete result:', nonExistentDelete);
  
  if (nonExistentDelete !== false) {
    console.error('FAILED: Non-existent dependency deletion did not return false');
    process.exit(1);
  }
  
  console.log('VERIFIED: Non-existent dependency operations work correctly');
  
  console.log('\nAll chunk dependency operations verified successfully!');
}

// Run the verification
(async () => {
  try {
    await cleanupTestDirectory();
    await runVerification();
  } catch (error) {
    console.error('Verification failed with error:', error);
    process.exit(1);
  } finally {
    // Clean up after tests
    await cleanupTestDirectory();
  }
})();