/**
 * Direct Verification of ChronosTemporalInstanceService
 * 
 * This script directly verifies that the ChronosTemporalInstanceService properly
 * integrates the ChronosHandler and FeatureToggleService to provide consistent
 * time handling for temporal instances.
 * 
 * It applies the TSAR BOMBA verification approach with explicit testing
 * for each function and edge case.
 */

import { ChronosHandler } from '../services/utils/chronos-handler.js';
import { FeatureToggleService, Feature } from '../services/feature-toggle-service.js';
import { ChronosTemporalInstanceService } from '../services/temporal/chronos-temporal-instance.js';
import { FileSystemStorage } from '../services/file-system-storage.js';
import { InsertTemporalInstance, TemporalInstance } from '../../shared/schema-minimal.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

/**
 * Clean up any existing test temporal instances
 */
async function cleanupTestData() {
  const tempDir = path.join('./data', 'temporal_instances');
  
  try {
    // Create directory if it doesn't exist
    await fs.mkdir(tempDir, { recursive: true });
    
    // Read all files in the directory
    const files = await fs.readdir(tempDir);
    
    // Delete files that match our test pattern
    for (const file of files) {
      if (file.includes('chronos-test')) {
        await fs.unlink(path.join(tempDir, file));
      }
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

/**
 * Run the direct verification
 */
async function runVerification() {
  console.log("⏱️ CHRONOS TEMPORAL INSTANCE SERVICE - DIRECT VERIFICATION");
  console.log("==========================================================");
  
  // Clean up before testing
  await cleanupTestData();
  
  // Initialize components
  const storage = new FileSystemStorage('./data');
  const chronosService = new ChronosTemporalInstanceService(storage);
  const toggleService = FeatureToggleService.getInstance();
  
  // Enable the Chronos feature to test with it enabled
  toggleService.enable(Feature.CHRONOS_HANDLER);
  
  // Create a test temporal instance
  const testInstance: InsertTemporalInstance = {
    nodeId: 'chronos-test-node-001',
    state: JSON.stringify({ state: 'active', coherence: 0.85 }),
    dimensionType: 'PRIMARY',
    stabilityFactor: 0.92,
    metadata: {
      testType: 'chronos-verification',
      priority: 'high'
    }
  };
  
  // Test with Chronos enabled
  console.log("\n--- Testing with CHRONOS_HANDLER enabled ---");
  const createdInstance = await chronosService.createTemporalInstance(testInstance);
  console.log("Created instance:", {
    id: createdInstance.id,
    nodeId: createdInstance.nodeId,
    createdAt: createdInstance.createdAt,
    updatedAt: createdInstance.updatedAt
  });
  
  // Verify created instance
  console.assert(createdInstance.nodeId === testInstance.nodeId, 'NodeId should match');
  console.assert(createdInstance.state === testInstance.state, 'State should match');
  console.assert(createdInstance.dimensionType === testInstance.dimensionType, 'DimensionType should match');
  console.assert(createdInstance.createdAt instanceof Date, 'CreatedAt should be a Date');
  console.assert(createdInstance.updatedAt instanceof Date, 'UpdatedAt should be a Date');
  
  // Wait a moment to ensure timestamps are different
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Test updating with Chronos enabled
  const updateData = {
    state: JSON.stringify({ state: 'updated', coherence: 0.92 }),
    metadata: {
      ...createdInstance.metadata,
      updateReason: 'chronos-test'
    }
  };
  
  const updatedInstance = await chronosService.updateTemporalInstance(createdInstance.id, updateData);
  console.log("\nUpdated instance:", {
    id: updatedInstance?.id,
    nodeId: updatedInstance?.nodeId,
    state: updatedInstance?.state,
    updatedAt: updatedInstance?.updatedAt
  });
  
  // Verify updated instance
  console.assert(updatedInstance, 'Updated instance should exist');
  console.assert(updatedInstance?.state === updateData.state, 'State should be updated');
  console.assert(updatedInstance?.metadata?.updateReason === 'chronos-test', 'Metadata should be updated');
  console.assert(
    updatedInstance?.updatedAt.getTime() > createdInstance.updatedAt.getTime(),
    'UpdatedAt should be newer'
  );
  
  // Disable Chronos feature
  toggleService.disable(Feature.CHRONOS_HANDLER);
  
  // Test with Chronos disabled
  console.log("\n--- Testing with CHRONOS_HANDLER disabled ---");
  const testInstance2: InsertTemporalInstance = {
    nodeId: 'chronos-test-node-002',
    state: JSON.stringify({ state: 'inactive', coherence: 0.75 }),
    dimensionType: 'SECONDARY',
    stabilityFactor: 0.85,
    metadata: {
      testType: 'standard-verification',
      priority: 'medium'
    }
  };
  
  const createdInstance2 = await chronosService.createTemporalInstance(testInstance2);
  console.log("Created instance without Chronos:", {
    id: createdInstance2.id,
    nodeId: createdInstance2.nodeId,
    createdAt: createdInstance2.createdAt
  });
  
  // Get all temporal instances
  const allInstances = await chronosService.getAllTemporalInstances();
  console.log("\nFound all instances:", allInstances.length);
  
  // Get filtered instances
  const filteredInstances = await chronosService.getAllTemporalInstances(undefined, {
    nodeId: 'chronos-test-node-001'
  });
  console.log("Found filtered instances:", filteredInstances.length);
  console.assert(filteredInstances.length > 0, 'Should find filtered instances');
  
  // Get by time range
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const rangeInstances = await chronosService.getTemporalInstancesByTimeRange(hourAgo, now);
  console.log("\nInstances in time range:", rangeInstances.length);
  console.assert(rangeInstances.length >= 2, 'Should find instances in time range');
  
  // Test deletion
  const deleteResult = await chronosService.deleteTemporalInstance(createdInstance.id);
  console.log("\nDeletion result:", deleteResult);
  console.assert(deleteResult === true, 'Deletion should succeed');
  
  // Verify deletion
  const deletedInstance = await chronosService.getTemporalInstance(createdInstance.id);
  console.assert(!deletedInstance, 'Deleted instance should not exist');
  
  // Clean up after testing
  await chronosService.deleteTemporalInstance(createdInstance2.id);
  
  console.log("\n✅ CHRONOS TEMPORAL INSTANCE SERVICE VERIFICATION COMPLETE");
}

// Run the verification
runVerification()
  .then(() => {
    console.log("ChronosTemporalInstanceService verification succeeded");
    FeatureToggleService.getInstance().resetToDefaults(); // Reset toggles to defaults
  })
  .catch(error => {
    console.error("ChronosTemporalInstanceService verification failed:", error);
    FeatureToggleService.getInstance().resetToDefaults(); // Reset toggles to defaults
    process.exit(1);
  });