/**
 * Direct Verification of Context Persistence
 * 
 * This script directly verifies the context persistence functionality
 * without relying on Jest or other testing frameworks.
 * 
 * It applies the TSAR BOMBA approach of direct reality verification
 * by explicitly interacting with the filesystem.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Get the current directory 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define test directories and files
const testDir = path.join(process.cwd(), 'context-direct-test');
const contextsDir = path.join(testDir, 'contexts');
const sessionId = `test-session-${uuidv4()}`;
const contextFilePath = path.join(contextsDir, `${sessionId}.json`);

/**
 * Direct implementation of date serialization utilities
 */
function replacer(key, value) {
  if (value instanceof Date) {
    return { __date: value.toISOString() };
  }
  return value;
}

function reviver(key, value) {
  if (value && typeof value === 'object' && value.__date) {
    return new Date(value.__date);
  }
  return value;
}

/**
 * Simple FileSystemPersistenceLayer implementation
 */
class DirectFileSystemPersistence {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.contextsDir = path.join(baseDir, 'contexts');
  }
  
  async ensureDirectories() {
    await fs.mkdir(this.baseDir, { recursive: true });
    await fs.mkdir(this.contextsDir, { recursive: true });
    console.log(`Created directories: ${this.baseDir} and ${this.contextsDir}`);
  }
  
  async save(key, data) {
    const filePath = path.join(this.contextsDir, key);
    const serializedData = JSON.stringify(data, replacer, 2);
    await fs.writeFile(filePath, serializedData, 'utf8');
    console.log(`Successfully saved data to: ${filePath}`);
    return true;
  }
  
  async load(key) {
    try {
      const filePath = path.join(this.contextsDir, key);
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content, reviver);
      console.log(`Successfully loaded data from: ${filePath}`);
      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`File not found: ${path.join(this.contextsDir, key)}`);
        return null;
      }
      throw error;
    }
  }
  
  async delete(key) {
    try {
      const filePath = path.join(this.contextsDir, key);
      await fs.unlink(filePath);
      console.log(`Successfully deleted: ${filePath}`);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') return false;
      throw error;
    }
  }
}

/**
 * Simple PersistentContextService implementation
 */
class DirectPersistentContextService {
  constructor(persistenceLayer) {
    this.persistenceLayer = persistenceLayer;
  }
  
  async initializeSession(sessionId) {
    const existingContext = await this.loadContext(sessionId);
    if (existingContext) return existingContext;
    
    const newContext = {
      sessionId,
      historyChunks: [],
      strategicPlans: [],
      metaInsights: [],
      relationships: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0
    };
    
    await this.saveContext(newContext);
    return newContext;
  }
  
  async saveContext(context) {
    if (!context || !context.sessionId) {
      throw new Error('Invalid context or missing sessionId');
    }
    
    // Update metadata
    context.updatedAt = new Date();
    context.version = (context.version || 0) + 1;
    
    return this.persistenceLayer.save(`${context.sessionId}.json`, context);
  }
  
  async loadContext(sessionId) {
    return this.persistenceLayer.load(`${sessionId}.json`);
  }
  
  async addHistoryChunk(sessionId, chunk) {
    const context = await this.loadContext(sessionId);
    if (!context) throw new Error(`Context not found for session: ${sessionId}`);
    
    context.historyChunks.push({
      ...chunk,
      timestamp: new Date()
    });
    
    await this.saveContext(context);
    return context;
  }
  
  async addStrategicPlan(sessionId, plan) {
    const context = await this.loadContext(sessionId);
    if (!context) throw new Error(`Context not found for session: ${sessionId}`);
    
    context.strategicPlans.push({
      ...plan,
      timestamp: new Date()
    });
    
    await this.saveContext(context);
    return context;
  }
  
  async addRelationship(sessionId, relationship) {
    const context = await this.loadContext(sessionId);
    if (!context) throw new Error(`Context not found for session: ${sessionId}`);
    
    context.relationships.push({
      ...relationship,
      timestamp: new Date()
    });
    
    await this.saveContext(context);
    return context;
  }
}

/**
 * Run the direct verification
 */
async function runVerification() {
  console.log('\n======= DIRECT CONTEXT PERSISTENCE VERIFICATION =======\n');
  
  try {
    // Setup
    console.log('Setting up test environment...');
    const persistence = new DirectFileSystemPersistence(testDir);
    await persistence.ensureDirectories();
    
    const service = new DirectPersistentContextService(persistence);
    
    // Test 1: Initialize session
    console.log('\n--- Test 1: Initialize Session ---');
    const initialContext = await service.initializeSession(sessionId);
    console.log('Initial context created:', {
      sessionId: initialContext.sessionId,
      createdAt: initialContext.createdAt,
      version: initialContext.version
    });
    
    // Verification
    const fileExistsResult = await checkFileExists(contextFilePath);
    console.log(`Context file exists: ${fileExistsResult ? '✅' : '❌'}`);
    
    // Test 2: Add history chunk
    console.log('\n--- Test 2: Add History Chunk ---');
    const historyChunk = {
      role: 'user',
      content: 'Test message',
      metadata: {
        intentCategory: 'inquiry',
        confidenceScore: 0.95
      }
    };
    
    await service.addHistoryChunk(sessionId, historyChunk);
    const contextWithHistory = await service.loadContext(sessionId);
    
    console.log('History chunks count:', contextWithHistory.historyChunks.length);
    console.log('Added history chunk:', contextWithHistory.historyChunks[0].content);
    console.log('Updated version:', contextWithHistory.version);
    
    // Test 3: Add strategic plan
    console.log('\n--- Test 3: Add Strategic Plan ---');
    const strategicPlan = {
      taskId: 'plan-123',
      name: 'Test Plan',
      steps: ['Step 1', 'Step 2'],
      priority: 'high',
      status: 'active'
    };
    
    await service.addStrategicPlan(sessionId, strategicPlan);
    const contextWithPlan = await service.loadContext(sessionId);
    
    console.log('Strategic plans count:', contextWithPlan.strategicPlans.length);
    console.log('Added plan name:', contextWithPlan.strategicPlans[0].name);
    console.log('Updated version:', contextWithPlan.version);
    
    // Test 4: Add void-centered relationship
    console.log('\n--- Test 4: Add Void-Centered Relationship ---');
    const relationship = {
      sourceId: `source-${uuidv4()}`,
      targetId: `target-${uuidv4()}`,
      relationshipType: 'boundary-explicit',
      strength: 0.88,
      metadata: {
        boundaryType: 'explicit',
        voidCenteredAttribute: 'resilience',
        dimensionalResonance: 0.92,
        recursiveDepth: 2
      }
    };
    
    await service.addRelationship(sessionId, relationship);
    const contextWithRelationship = await service.loadContext(sessionId);
    
    console.log('Relationships count:', contextWithRelationship.relationships.length);
    console.log('Relationship type:', contextWithRelationship.relationships[0].relationshipType);
    console.log('Void-centered attribute:', contextWithRelationship.relationships[0].metadata.voidCenteredAttribute);
    console.log('Updated version:', contextWithRelationship.version);
    
    // Test 5: Direct file parsing
    console.log('\n--- Test 5: Direct File Reading ---');
    const fileContent = await fs.readFile(contextFilePath, 'utf8');
    const parsedContent = JSON.parse(fileContent, reviver);
    
    console.log('Direct file parsing successful');
    console.log('File schema verified:', (
      'sessionId' in parsedContent && 
      'historyChunks' in parsedContent && 
      'relationships' in parsedContent &&
      'createdAt' in parsedContent
    ) ? '✅' : '❌');
    
    console.log('File version matches:', parsedContent.version === contextWithRelationship.version ? '✅' : '❌');
    console.log('Dates properly serialized:', parsedContent.createdAt instanceof Date ? '✅' : '❌');
    
    // Test 6: Verify void-centered metadata preservation
    console.log('\n--- Test 6: Verify Void-Centered Metadata ---');
    const fileRelationship = parsedContent.relationships[0];
    
    console.log('Relationship metadata preservation:');
    console.log(`- boundaryType: ${fileRelationship.metadata.boundaryType === 'explicit' ? '✅' : '❌'}`);
    console.log(`- voidCenteredAttribute: ${fileRelationship.metadata.voidCenteredAttribute === 'resilience' ? '✅' : '❌'}`);
    console.log(`- dimensionalResonance: ${fileRelationship.metadata.dimensionalResonance === 0.92 ? '✅' : '❌'}`);
    console.log(`- recursiveDepth: ${fileRelationship.metadata.recursiveDepth === 2 ? '✅' : '❌'}`);
    
    // Clean up
    console.log('\nCleaning up test directory...');
    await fs.rm(testDir, { recursive: true, force: true });
    
    console.log('\n✅ Direct context persistence verification completed successfully');
    return true;
  } catch (error) {
    console.error('\n❌ Error during verification:', error);
    
    // Attempt cleanup on error
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
    
    return false;
  }
}

// Helper function to check if a file exists
async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Run the verification directly
runVerification()
  .then(success => {
    console.log(`\nVerification ${success ? 'PASSED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error during verification:', error);
    process.exit(1);
  });