/**
 * Test script for FileSystemStorage meta-cognitive event methods
 * 
 * This script tests the CRUD operations for meta-cognitive events in the FileSystemStorage class.
 * It applies the TSAR BOMBA verification approach with explicit testing after each operation.
 */

import { FileSystemStorage } from './server/services/file-system-storage.js';
import { 
  MetaCognitiveEvent, 
  InsertMetaCognitiveEvent 
} from './shared/schema-minimal.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

// Test directory to avoid affecting production data
const TEST_DIR = './test-data/meta-cognitive-event-test';

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
 * Run verification of meta-cognitive event methods
 */
async function runVerification() {
  console.log('Starting meta-cognitive event methods verification...');
  
  // Set up storage with test directory
  const storage = new FileSystemStorage(TEST_DIR);
  
  // Clean up any existing test data
  await cleanupTestDirectory();
  
  try {
    // ========= CREATE OPERATION TEST =========
    console.log('\n--- Testing createMetaCognitiveEvent ---');
    
    const eventToCreate: InsertMetaCognitiveEvent = {
      nodeId: 'qrn-test-node-001',
      type: 'INSIGHT_DISCOVERY',
      description: 'System discovered a novel pattern in user preferences',
      details: {
        patternType: 'behavioral',
        confidenceScore: 0.87,
        supportingEvidence: ['log123', 'log456', 'log789'],
        impactAreas: ['user-experience', 'recommendation-engine']
      },
      confidence: 0.87,
      impact: 0.75,
      sourceContext: 'user-interaction-analysis'
    };
    
    // Create the meta-cognitive event
    const createdEvent = await storage.createMetaCognitiveEvent(eventToCreate);
    console.log('Created meta-cognitive event:', createdEvent);
    
    // VERIFICATION: Ensure the created event has all required properties
    console.assert(createdEvent.id, 'Created event should have an ID');
    console.assert(createdEvent.nodeId === eventToCreate.nodeId, 'NodeId should match');
    console.assert(createdEvent.type === eventToCreate.type, 'Type should match');
    console.assert(createdEvent.description === eventToCreate.description, 'Description should match');
    console.assert(createdEvent.confidence === eventToCreate.confidence, 'Confidence should match');
    console.assert(createdEvent.impact === eventToCreate.impact, 'Impact should match');
    console.assert(createdEvent.createdAt instanceof Date, 'Created timestamp should be set');
    
    // Save the ID for later use
    const eventId = createdEvent.id;
    console.log(`Meta-cognitive event created with ID: ${eventId}`);
    
    // ========= READ OPERATION TEST =========
    console.log('\n--- Testing getMetaCognitiveEvent ---');
    
    // Retrieve the meta-cognitive event
    const retrievedEvent = await storage.getMetaCognitiveEvent(eventId);
    console.log('Retrieved meta-cognitive event:', retrievedEvent);
    
    // VERIFICATION: Ensure the event was retrieved correctly
    console.assert(retrievedEvent, 'Should retrieve the meta-cognitive event');
    console.assert(retrievedEvent?.id === eventId, 'Event ID should match');
    console.assert(retrievedEvent?.nodeId === eventToCreate.nodeId, 'NodeId should match');
    console.assert(retrievedEvent?.type === eventToCreate.type, 'Type should match');
    console.assert(retrievedEvent?.description === eventToCreate.description, 'Description should match');
    console.assert(retrievedEvent?.confidence === eventToCreate.confidence, 'Confidence should match');
    console.assert(retrievedEvent?.impact === eventToCreate.impact, 'Impact should match');
    console.assert(retrievedEvent?.details?.patternType === 'behavioral', 'Details should be preserved');
    console.assert(retrievedEvent?.createdAt instanceof Date, 'CreatedAt should be a Date');
    
    // ========= LIST OPERATION TEST =========
    console.log('\n--- Testing getAllMetaCognitiveEvents ---');
    
    // List all meta-cognitive events
    const allEvents = await storage.getAllMetaCognitiveEvents();
    console.log(`Retrieved ${allEvents.length} meta-cognitive events`);
    
    // VERIFICATION: Ensure we can list events
    console.assert(allEvents.length > 0, 'Should have at least one event');
    console.assert(allEvents.some(e => e.id === eventId), 'Created event should be in the list');
    
    // Create another event for filtering tests
    const secondEvent: InsertMetaCognitiveEvent = {
      nodeId: 'qrn-test-node-002',
      type: 'ANOMALY_DETECTION',
      description: 'Detected unexpected spike in system resource usage',
      details: {
        resourceType: 'memory',
        deviationPercent: 32.5,
        timeWindow: '15m',
        affectedComponents: ['database', 'cache-layer']
      },
      confidence: 0.94,
      impact: 0.82,
      sourceContext: 'system-monitoring'
    };
    
    const createdSecondEvent = await storage.createMetaCognitiveEvent(secondEvent);
    console.log('Created second meta-cognitive event:', createdSecondEvent);
    
    // Test filtering by nodeId
    const filteredByNode = await storage.getAllMetaCognitiveEvents({ nodeId: 'qrn-test-node-001' });
    console.log(`Retrieved ${filteredByNode.length} events filtered by nodeId`);
    console.assert(filteredByNode.length === 1, 'Should retrieve only one event with the specified nodeId');
    console.assert(filteredByNode[0].id === eventId, 'Should retrieve the correct event by nodeId');
    
    // Test filtering by type
    const filteredByType = await storage.getAllMetaCognitiveEvents({ type: 'ANOMALY_DETECTION' });
    console.log(`Retrieved ${filteredByType.length} events filtered by type`);
    console.assert(filteredByType.length === 1, 'Should retrieve only one event with the specified type');
    console.assert(filteredByType[0].id === createdSecondEvent.id, 'Should retrieve the correct event by type');
    
    // ========= UPDATE OPERATION TEST =========
    console.log('\n--- Testing updateMetaCognitiveEvent ---');
    
    const eventUpdate = {
      confidence: 0.92,
      impact: 0.85,
      details: {
        ...retrievedEvent?.details,
        updateCount: 1,
        refinementLevel: 'advanced',
        validatedBy: 'meta-cognitive-supervisor'
      }
    };
    
    // Update the meta-cognitive event
    const updatedEvent = await storage.updateMetaCognitiveEvent(eventId, eventUpdate);
    console.log('Updated meta-cognitive event:', updatedEvent);
    
    // VERIFICATION: Ensure the event was updated correctly
    console.assert(updatedEvent, 'Should return the updated event');
    console.assert(updatedEvent?.confidence === eventUpdate.confidence, 'Confidence should be updated');
    console.assert(updatedEvent?.impact === eventUpdate.impact, 'Impact should be updated');
    console.assert(updatedEvent?.details?.updateCount === 1, 'Details should be updated');
    console.assert(updatedEvent?.details?.refinementLevel === 'advanced', 'New detail fields should be added');
    
    // Verify updates didn't change the immutable fields
    console.assert(updatedEvent?.id === eventId, 'ID should not change');
    console.assert(updatedEvent?.nodeId === eventToCreate.nodeId, 'NodeId should not change');
    console.assert(updatedEvent?.type === eventToCreate.type, 'Type should not change');
    console.assert(updatedEvent?.description === eventToCreate.description, 'Description should not change');
    
    // ========= DELETE OPERATION TEST =========
    console.log('\n--- Testing deleteMetaCognitiveEvent ---');
    
    // Delete the second meta-cognitive event
    const deleteResult = await storage.deleteMetaCognitiveEvent(createdSecondEvent.id);
    console.log(`Delete result: ${deleteResult}`);
    
    // VERIFICATION: Ensure the event was deleted
    console.assert(deleteResult === true, 'Delete should return true for successful deletion');
    
    // Try to get the deleted event
    const deletedEvent = await storage.getMetaCognitiveEvent(createdSecondEvent.id);
    console.log('Result of getting deleted event:', deletedEvent);
    
    // VERIFICATION: Ensure the event is gone
    console.assert(deletedEvent === undefined, 'Deleted event should not be retrievable');
    
    // Verify the other event still exists
    const remainingEvent = await storage.getMetaCognitiveEvent(eventId);
    console.assert(remainingEvent !== undefined, 'Non-deleted event should still exist');
    
    // Test deletion of non-existent event
    const nonExistentDeleteResult = await storage.deleteMetaCognitiveEvent('non-existent-id');
    console.log(`Delete result for non-existent event: ${nonExistentDeleteResult}`);
    console.assert(nonExistentDeleteResult === false, 'Delete should return false for non-existent event');
    
    // Check filtered list after deletion
    const remainingEvents = await storage.getAllMetaCognitiveEvents();
    console.log(`After deletion, ${remainingEvents.length} events remain`);
    console.assert(remainingEvents.length === 1, 'Should have only one event remaining');
    console.assert(remainingEvents[0].id === eventId, 'Remaining event should be the non-deleted one');
    
    console.log('\nAll meta-cognitive event operations verified successfully!');
  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    // Clean up test data
    await cleanupTestDirectory();
  }
}

// Run the verification
runVerification().catch(console.error);