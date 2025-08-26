/**
 * Test script for FileSystemStorage chunk methods
 * 
 * This script tests the CRUD operations for chunks in the FileSystemStorage class.
 * It applies the TSAR BOMBA verification approach with explicit testing after each operation.
 */

import { FileSystemStorage } from './server/services/file-system-storage.js';
import { InsertChunk, Chunk } from './shared/schema-minimal.js';
import fs from 'fs/promises';
import path from 'path';

// Create a temporary storage directory for testing
const TEST_STORAGE_DIR = './test-data';
const storage = new FileSystemStorage(TEST_STORAGE_DIR);

/**
 * Clean up the test directory to ensure a clean test environment
 */
async function cleanupTestDirectory() {
  console.log('Cleaning up test directory...');
  
  try {
    // Create chunks directory path
    const chunksDir = path.join(TEST_STORAGE_DIR, 'chunks');
    
    // Check if chunks directory exists
    try {
      await fs.access(chunksDir);
      
      // Read all files in the chunks directory
      const files = await fs.readdir(chunksDir);
      
      // Delete each chunk file
      for (const file of files) {
        if (file.startsWith('chunk_') && file.endsWith('.json')) {
          await fs.unlink(path.join(chunksDir, file));
          console.log(`Deleted test file: ${file}`);
        }
      }
      
      console.log('Test directory cleaned successfully');
    } catch (error) {
      // Directory doesn't exist yet, that's fine
      console.log('Chunks directory does not exist yet, nothing to clean');
    }
  } catch (error) {
    console.error('Error cleaning test directory:', error);
  }
}

/**
 * Run verification of chunk methods
 */
async function runVerification() {
  console.log('Starting FileSystemStorage chunk methods verification');
  console.log('-------------------------------------------------');

  try {
    // Test 1: Create a chunk
    console.log('\nTest 1: Create a chunk');
    const chunkToCreate: InsertChunk = {
      originalContent: 'This is a test chunk with original content.',
      processedContent: 'This is processed content for the test chunk.',
      chunkIndex: 1,
      totalChunks: 3,
      chunkSize: 50,
      chunkState: 'created',
      qrnId: 'test-qrn-id'
    };

    const createdChunk = await storage.createChunk(chunkToCreate);
    console.log('Created chunk:', createdChunk);

    // Verify the chunk was created correctly
    if (!createdChunk.id) {
      throw new Error('Created chunk missing ID');
    }
    
    if (createdChunk.originalContent !== chunkToCreate.originalContent) {
      throw new Error('Original content does not match');
    }

    // Test 2: Get the chunk
    console.log('\nTest 2: Get the chunk');
    const retrievedChunk = await storage.getChunk(createdChunk.id);
    console.log('Retrieved chunk:', retrievedChunk);

    // Verify the chunk was retrieved correctly
    if (!retrievedChunk) {
      throw new Error('Failed to retrieve chunk');
    }
    
    if (retrievedChunk.id !== createdChunk.id) {
      throw new Error('Retrieved chunk ID does not match created chunk ID');
    }

    // Test 3: Update the chunk
    console.log('\nTest 3: Update the chunk');
    const updatedChunk = await storage.updateChunk(createdChunk.id, {
      processedContent: 'This is updated processed content.',
      chunkState: 'processed'
    });
    console.log('Updated chunk:', updatedChunk);

    // Verify the chunk was updated correctly
    if (!updatedChunk) {
      throw new Error('Failed to update chunk');
    }
    
    if (updatedChunk.processedContent !== 'This is updated processed content.') {
      throw new Error('Updated content does not match');
    }

    // Test 4: Create additional chunks for filtering tests
    console.log('\nTest 4: Create additional chunks for filtering tests');
    
    const chunk2 = await storage.createChunk({
      originalContent: 'This is the second test chunk.',
      chunkIndex: 2,
      totalChunks: 3,
      chunkSize: 30,
      chunkState: 'created',
      qrnId: 'test-qrn-id'
    });
    
    const chunk3 = await storage.createChunk({
      originalContent: 'This is the third test chunk.',
      chunkIndex: 3,
      totalChunks: 3,
      chunkSize: 28,
      chunkState: 'created',
      qrnId: 'test-qrn-id'
    });
    
    console.log('Created additional chunks with IDs:', chunk2.id, chunk3.id);

    // Test 5: Filter chunks
    console.log('\nTest 5: Filter chunks');
    const filteredChunks = await storage.getChunks({ chunkState: 'created' });
    console.log('Filtered chunks (chunkState=created):', 
      filteredChunks.map(c => ({ id: c.id, index: c.chunkIndex })));
    
    // Verify the filtering works correctly
    if (filteredChunks.length !== 2) {
      throw new Error(`Expected 2 chunks with state 'created', found ${filteredChunks.length}`);
    }

    // Test 6: Filter by QRN ID
    console.log('\nTest 6: Filter by QRN ID');
    const qrnChunks = await storage.getChunks({ qrnId: 'test-qrn-id' });
    console.log('Filtered chunks (qrnId=test-qrn-id):', 
      qrnChunks.map(c => ({ id: c.id, index: c.chunkIndex })));
    
    // Verify QRN filtering works correctly
    if (qrnChunks.length < 1) {
      throw new Error(`Expected at least 1 chunk with qrnId 'test-qrn-id', found ${qrnChunks.length}`);
    }
    
    // Make sure all returned chunks actually have the qrnId we filtered for
    const wrongQrnIdChunks = qrnChunks.filter(c => c.qrnId !== 'test-qrn-id');
    if (wrongQrnIdChunks.length > 0) {
      throw new Error(`Found ${wrongQrnIdChunks.length} chunks without the expected qrnId 'test-qrn-id'`);
    }

    // Test 7: Get all chunks with limit
    console.log('\nTest 7: Get all chunks with limit');
    const limitedChunks = await storage.getChunks(undefined, 2);
    console.log('Limited chunks (limit=2):', 
      limitedChunks.map(c => ({ id: c.id, index: c.chunkIndex })));
    
    // Verify limiting works correctly
    if (limitedChunks.length !== 2) {
      throw new Error(`Expected 2 chunks with limit, found ${limitedChunks.length}`);
    }

    // Test 8: Delete a chunk
    console.log('\nTest 8: Delete a chunk');
    const deleteResult = await storage.deleteChunk(createdChunk.id);
    console.log('Delete result:', deleteResult);

    // Verify deletion worked correctly
    if (!deleteResult) {
      throw new Error('Chunk deletion reported failure');
    }

    // Test 9: Verify chunk was deleted
    console.log('\nTest 9: Verify chunk was deleted');
    const deletedChunk = await storage.getChunk(createdChunk.id);
    console.log('Deleted chunk retrieval result:', deletedChunk);
    
    // Verify the chunk is no longer retrievable
    if (deletedChunk !== null) {
      throw new Error('Chunk was not properly deleted');
    }

    // Test 10: Try to delete non-existent chunk
    console.log('\nTest 10: Try to delete non-existent chunk');
    const nonExistentResult = await storage.deleteChunk('non-existent-id');
    console.log('Non-existent chunk deletion result:', nonExistentResult);
    
    // Verify proper handling of non-existent chunk deletion
    if (nonExistentResult !== false) {
      throw new Error('Deleting non-existent chunk should return false');
    }

    console.log('\nAll tests passed successfully!');
    console.log('-------------------------------------------------');
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
}

// Run the cleanup then verification tests
cleanupTestDirectory()
  .then(() => runVerification())
  .then(() => console.log('Verification completed successfully.'))
  .catch(error => {
    console.error('Verification failed:', error);
    process.exit(1);
  });