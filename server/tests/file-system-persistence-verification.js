/**
 * Direct Verification of FileSystemPersistentContextService
 * 
 * This script directly verifies that context data persists across restarts.
 * It creates a new context, adds data to it, and then verifies the data 
 * can be retrieved after simulating a restart.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Set up dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import helpers for date handling
function replacer(key, value) {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() };
  }
  return value;
}

function reviver(key, value) {
  if (value && typeof value === 'object' && value.__type === 'Date') {
    return new Date(value.value);
  }
  return value;
}

class FileSystemPersistenceLayer {
  constructor(baseDir) {
    this.baseDir = baseDir;
    console.log(`FileSystemPersistenceLayer initialized with baseDir: ${baseDir}`);
  }
  
  async ensureDirectories() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
      console.log(`Ensured directory exists: ${this.baseDir}`);
    } catch (error) {
      console.error(`Error ensuring directories: ${error.message}`);
      throw error;
    }
  }
  
  async save(key, data) {
    try {
      await this.ensureDirectories();
      const filePath = path.join(this.baseDir, `${key}.json`);
      console.log(`Saving data to: ${filePath}`);
      
      // Serialize with custom replacer to handle Dates
      const serializedData = JSON.stringify(data, replacer, 2);
      
      await fs.writeFile(filePath, serializedData, 'utf8');
      console.log(`Successfully saved data to: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`Error saving data: ${error.message}`);
      throw error;
    }
  }
  
  async load(key) {
    try {
      const filePath = path.join(this.baseDir, `${key}.json`);
      console.log(`Loading data from: ${filePath}`);
      
      // Check if file exists
      try {
        await fs.access(filePath, fs.constants.R_OK);
      } catch {
        console.log(`File not found: ${filePath}`);
        return null;
      }
      
      // Read and parse data
      const content = await fs.readFile(filePath, 'utf8');
      
      // Parse with custom reviver to handle Dates
      const data = JSON.parse(content, reviver);
      
      console.log(`Successfully loaded data from: ${filePath}`);
      return data;
    } catch (error) {
      console.error(`Error loading data: ${error.message}`);
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }
  
  async delete(key) {
    try {
      const filePath = path.join(this.baseDir, `${key}.json`);
      await fs.unlink(filePath);
      console.log(`Successfully deleted: ${filePath}`);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') return false;
      console.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }
  
  async getKeys(prefix) {
    try {
      await this.ensureDirectories();
      const files = await fs.readdir(this.baseDir);
      const keys = files
        .filter(file => file.endsWith('.json'))
        .map(file => file.slice(0, -5)) // Remove .json extension
        .filter(key => !prefix || key.startsWith(prefix));
      
      console.log(`Retrieved ${keys.length} keys with prefix "${prefix || ''}"`);
      return keys;
    } catch (error) {
      console.error(`Error getting keys: ${error.message}`);
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }
}

class FileSystemPersistentContextService {
  constructor(persistenceLayer) {
    this.persistenceLayer = persistenceLayer;
    console.log('FileSystemPersistentContextService initialized');
  }
  
  async initializeSession(sessionId) {
    console.log(`Initializing session: ${sessionId}`);
    
    // Try to load existing context
    const existingContext = await this.loadContext(sessionId);
    
    if (existingContext) {
      console.log(`Loaded existing context for session: ${sessionId}`);
      return existingContext;
    }
    
    // Create a new context
    console.log(`Creating new context for session: ${sessionId}`);
    const timestamp = new Date();
    
    const newContext = {
      sessionId,
      historyChunks: [],
      strategicPlans: [],
      metaInsights: [],
      relationships: [],
      createdAt: timestamp,
      updatedAt: timestamp,
      version: 1
    };
    
    // Save the new context
    await this.saveContext(newContext);
    return newContext;
  }
  
  async saveContext(context) {
    console.log(`Saving context for session: ${context.sessionId}`);
    
    // Update metadata
    context.updatedAt = new Date();
    context.version += 1;
    
    // Save to persistence layer
    await this.persistenceLayer.save(context.sessionId, context);
    console.log(`Context saved with version: ${context.version}`);
  }
  
  async loadContext(sessionId) {
    console.log(`Loading context for session: ${sessionId}`);
    
    const context = await this.persistenceLayer.load(sessionId);
    
    if (!context) {
      console.log(`No context found for session: ${sessionId}`);
      return null;
    }
    
    // Ensure dates are properly converted
    this.ensureDatesInContext(context);
    
    console.log(`Context loaded with version: ${context.version}`);
    return context;
  }
  
  async addHistoryChunk(sessionId, chunk) {
    console.log(`Adding history chunk to session: ${sessionId}`);
    
    const context = await this.loadContext(sessionId);
    
    if (!context) {
      throw new Error(`No context found for session: ${sessionId}`);
    }
    
    // Ensure chunk has ID and timestamp
    if (!chunk.chunkId) {
      chunk.chunkId = uuidv4();
    }
    
    if (!chunk.timestamp) {
      chunk.timestamp = new Date();
    } else if (!(chunk.timestamp instanceof Date)) {
      chunk.timestamp = new Date(chunk.timestamp);
    }
    
    // Add to context
    context.historyChunks.push(chunk);
    
    // Save context
    await this.saveContext(context);
    console.log(`Added history chunk with ID: ${chunk.chunkId}`);
  }
  
  ensureDatesInContext(context) {
    // Convert string dates to Date objects
    const ensureDate = value => {
      if (!value) return value;
      return value instanceof Date ? value : new Date(value);
    };
    
    // Process top-level dates
    context.createdAt = ensureDate(context.createdAt);
    context.updatedAt = ensureDate(context.updatedAt);
    
    // Process history chunks
    context.historyChunks.forEach(chunk => {
      chunk.timestamp = ensureDate(chunk.timestamp);
    });
    
    // Process strategic plans
    context.strategicPlans.forEach(plan => {
      plan.createdAt = ensureDate(plan.createdAt);
      plan.updatedAt = ensureDate(plan.updatedAt);
      if (plan.completedAt) {
        plan.completedAt = ensureDate(plan.completedAt);
      }
    });
    
    // Process meta-insights
    context.metaInsights.forEach(insight => {
      insight.timestamp = ensureDate(insight.timestamp);
    });
    
    // Process relationships
    context.relationships.forEach(relationship => {
      relationship.timestamp = ensureDate(relationship.timestamp);
    });
  }
}

/**
 * Run direct verification of persistence across restarts
 */
async function verifyPersistenceAcrossRestarts() {
  console.log('=== STARTING DIRECT VERIFICATION OF PERSISTENCE ACROSS RESTARTS ===');
  
  // Create a test directory and unique session ID
  const testDir = path.join(__dirname, 'persistence-verification');
  const sessionId = `test-session-${Date.now()}`;
  
  console.log(`Test directory: ${testDir}`);
  console.log(`Test session ID: ${sessionId}`);
  
  try {
    // STEP 1: Initialize service and create context
    console.log('\n=== STEP 1: Initialize Service and Create Context ===');
    const persistenceLayer = new FileSystemPersistenceLayer(testDir);
    const service = new FileSystemPersistentContextService(persistenceLayer);
    
    const context = await service.initializeSession(sessionId);
    console.log('Context initialized:', {
      sessionId: context.sessionId,
      version: context.version,
      createdAt: context.createdAt,
      chunksCount: context.historyChunks.length
    });
    
    // STEP 2: Add test data
    console.log('\n=== STEP 2: Add Test Data ===');
    const testChunk = {
      chunkId: uuidv4(),
      content: 'Test content for persistence verification',
      timestamp: new Date(),
      cognitiveLayer: 'META_COGNITIVE',
      tags: ['test', 'persistence', 'verification']
    };
    
    await service.addHistoryChunk(sessionId, testChunk);
    console.log('Added test chunk:', {
      chunkId: testChunk.chunkId,
      content: testChunk.content,
      timestamp: testChunk.timestamp
    });
    
    // Verify data was added
    const contextWithData = await service.loadContext(sessionId);
    console.log('Context after adding data:', {
      sessionId: contextWithData.sessionId,
      version: contextWithData.version,
      chunksCount: contextWithData.historyChunks.length,
      latestChunkId: contextWithData.historyChunks[0]?.chunkId
    });
    
    // STEP 3: Simulate restart by creating new service instance
    console.log('\n=== STEP 3: Simulate Restart ===');
    console.log('Creating new service instance to simulate restart...');
    
    const newPersistenceLayer = new FileSystemPersistenceLayer(testDir);
    const newService = new FileSystemPersistentContextService(newPersistenceLayer);
    
    // STEP 4: Verify data persisted
    console.log('\n=== STEP 4: Verify Data Persisted ===');
    const restoredContext = await newService.loadContext(sessionId);
    
    if (!restoredContext) {
      console.error('❌ VERIFICATION FAILED: Context not found after restart');
      return;
    }
    
    console.log('Context after restart:', {
      sessionId: restoredContext.sessionId,
      version: restoredContext.version,
      chunksCount: restoredContext.historyChunks.length
    });
    
    // Verify chunk data
    const restoredChunk = restoredContext.historyChunks[0];
    console.log('Restored chunk:', {
      chunkId: restoredChunk.chunkId,
      content: restoredChunk.content,
      timestamp: restoredChunk.timestamp
    });
    
    // Verify data integrity
    const dataVerified = 
      restoredContext.historyChunks.length === 1 &&
      restoredChunk.chunkId === testChunk.chunkId &&
      restoredChunk.content === testChunk.content;
    
    if (dataVerified) {
      console.log('\n✅ VERIFICATION SUCCESSFUL: Data persisted correctly across restart');
      console.log(`- Found ${restoredContext.historyChunks.length} history chunks after restart`);
      console.log(`- Chunk ID matched: ${restoredChunk.chunkId === testChunk.chunkId}`);
      console.log(`- Content matched: ${restoredChunk.content === testChunk.content}`);
      console.log(`- Creation timestamp preserved as Date object: ${restoredChunk.timestamp instanceof Date}`);
    } else {
      console.error('\n❌ VERIFICATION FAILED: Data integrity issues after restart');
      console.log(`- Expected 1 chunk, found ${restoredContext.historyChunks.length}`);
      console.log(`- Chunk ID matched: ${restoredChunk?.chunkId === testChunk.chunkId}`);
      console.log(`- Content matched: ${restoredChunk?.content === testChunk.content}`);
    }
    
  } catch (error) {
    console.error('❌ VERIFICATION FAILED with error:', error);
  } finally {
    // Clean up test files
    try {
      console.log('\n=== CLEANING UP ===');
      const filePath = path.join(testDir, `${sessionId}.json`);
      await fs.unlink(filePath).catch(() => console.log(`No file to delete at ${filePath}`));
      await fs.rmdir(testDir).catch(() => console.log(`Could not remove directory ${testDir}`));
      console.log('Test cleanup completed');
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
  
  console.log('\n=== DIRECT VERIFICATION COMPLETE ===');
}

// Run the verification
verifyPersistenceAcrossRestarts();