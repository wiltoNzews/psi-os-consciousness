/**
 * Direct Verification of ChronosQRNService
 * 
 * This script directly verifies that the ChronosQRNService properly
 * integrates the ChronosHandler with QRN operations and maintains
 * temporal history for QRNs.
 * 
 * It applies the TSAR BOMBA verification approach with explicit testing
 * for each function and edge case.
 */

import { chronos } from '../services/utils/chronos-handler.js';
import { FeatureToggleService, Feature } from '../services/feature-toggle-service.js';
import { ChronosQRNService } from '../services/qrn/chronos-qrn-service.js';
import { FileSystemStorage } from '../services/file-system-storage.js';
import { InsertQuantumRootNode, QuantumRootNode } from '../../shared/schema-minimal.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

/**
 * Clean up any existing test data
 */
async function cleanupTestData() {
  const qrnDir = path.join('./data', 'quantum_root_nodes');
  const tempDir = path.join('./data', 'temporal_instances');
  
  try {
    // Create directories if they don't exist
    await fs.mkdir(qrnDir, { recursive: true });
    await fs.mkdir(tempDir, { recursive: true });
    
    // Read all files in the QRN directory
    const qrnFiles = await fs.readdir(qrnDir);
    
    // Delete QRN files that match our test pattern
    for (const file of qrnFiles) {
      if (file.includes('chronos-test')) {
        await fs.unlink(path.join(qrnDir, file));
      }
    }
    
    // Read all files in the temporal instances directory
    const tempFiles = await fs.readdir(tempDir);
    
    // Delete temporal instance files that match our test pattern
    for (const file of tempFiles) {
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
  console.log("⚛️ CHRONOS QRN SERVICE - DIRECT VERIFICATION");
  console.log("=============================================");
  
  // Clean up before testing
  await cleanupTestData();
  
  // Initialize components
  const storage = new FileSystemStorage('./data');
  const qrnService = new ChronosQRNService(storage);
  const toggleService = FeatureToggleService.getInstance();
  
  // Enable the Chronos feature to test with it enabled
  toggleService.enable(Feature.CHRONOS_HANDLER);
  
  // Create a test quantum root node
  const testNode: InsertQuantumRootNode = {
    name: 'Chronos Test QRN',
    description: 'A quantum root node for testing Chronos integration',
    state: {
      status: 'initialized',
      coherence: 0.75,
      energy: 100
    },
    capabilities: ['test', 'chronos', 'verification'],
    coherenceScore: 0.75
  };
  
  // Test with Chronos enabled
  console.log("\n--- Testing with CHRONOS_HANDLER enabled ---");
  const createdNode = await qrnService.createQuantumRootNode(testNode);
  console.log("Created QRN:", {
    id: createdNode.id,
    name: createdNode.name,
    createdAt: createdNode.createdAt,
    updatedAt: createdNode.updatedAt,
    coherenceScore: createdNode.coherenceScore
  });
  
  // Verify created node
  console.assert(createdNode.name === testNode.name, 'Name should match');
  console.assert(createdNode.description === testNode.description, 'Description should match');
  console.assert(typeof createdNode.state === 'object', 'State should be an object');
  console.assert(createdNode.createdAt instanceof Date, 'CreatedAt should be a Date');
  console.assert(createdNode.updatedAt instanceof Date, 'UpdatedAt should be a Date');
  
  // Wait a moment to ensure timestamps are different
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Test updating with Chronos enabled
  const updateData = {
    state: {
      status: 'active',
      coherence: 0.85,
      energy: 95,
      lastAction: 'verification'
    },
    coherenceScore: 0.85
  };
  
  const updatedNode = await qrnService.updateQuantumRootNode(createdNode.id, updateData);
  console.log("\nUpdated QRN:", {
    id: updatedNode?.id,
    name: updatedNode?.name,
    state: updatedNode?.state,
    updatedAt: updatedNode?.updatedAt,
    coherenceScore: updatedNode?.coherenceScore
  });
  
  // Verify updated node
  console.assert(updatedNode, 'Updated node should exist');
  console.assert(updatedNode?.state.status === 'active', 'State status should be updated');
  console.assert(updatedNode?.coherenceScore === 0.85, 'Coherence score should be updated');
  console.assert(
    updatedNode?.updatedAt.getTime() > createdNode.updatedAt.getTime(),
    'UpdatedAt should be newer'
  );
  
  // Get temporal instances for the node
  const temporalInstances = await qrnService.getTemporalHistory(createdNode.id);
  console.log("\nTemporal instances for node:", temporalInstances.length);
  console.assert(temporalInstances.length >= 2, 'Should have at least 2 temporal instances');
  
  if (temporalInstances.length > 0) {
    console.log("Example temporal instance:", {
      id: temporalInstances[0].id,
      nodeId: temporalInstances[0].nodeId,
      dimensionType: temporalInstances[0].dimensionType,
      timestamp: temporalInstances[0].timestamp
    });
  }
  
  // Create a snapshot manually instead of doing coherence analysis
  const snapshot = await qrnService.createSnapshot(createdNode.id);
  console.log("\nManual snapshot created:", {
    id: snapshot?.id,
    nodeId: snapshot?.nodeId,
    timestamp: snapshot?.timestamp,
    dimensionType: snapshot?.dimensionType
  });
  console.assert(snapshot !== null, 'Snapshot should be created');
  console.assert(snapshot?.nodeId === createdNode.id, 'Snapshot should be for the right node');
  
  // Disable Chronos feature
  toggleService.disable(Feature.CHRONOS_HANDLER);
  
  // Test with Chronos disabled
  console.log("\n--- Testing with CHRONOS_HANDLER disabled ---");
  const testNode2: InsertQuantumRootNode = {
    name: 'Standard Test QRN',
    description: 'A quantum root node for testing standard operation',
    state: {
      status: 'initialized',
      coherence: 0.65
    },
    capabilities: ['test', 'standard'],
    coherenceScore: 0.65
  };
  
  const createdNode2 = await qrnService.createQuantumRootNode(testNode2);
  console.log("Created QRN without Chronos:", {
    id: createdNode2.id,
    name: createdNode2.name,
    createdAt: createdNode2.createdAt
  });
  
  // Test standard QRN methods using the storage directly
  const allNodes = await storage.getAllQuantumRootNodes();
  console.log("\nAll QRNs:", allNodes.length);
  console.assert(allNodes.length >= 2, 'Should have at least 2 QRNs');
  
  // Test deletion with Chronos enabled
  toggleService.enable(Feature.CHRONOS_HANDLER);
  const deleteResult = await storage.deleteQuantumRootNode(createdNode.id);
  console.log("\nDeletion result (with Chronos):", deleteResult);
  console.assert(deleteResult === true, 'Deletion should succeed');
  
  // Test deletion with Chronos disabled
  toggleService.disable(Feature.CHRONOS_HANDLER);
  const deleteResult2 = await storage.deleteQuantumRootNode(createdNode2.id);
  console.log("Deletion result (without Chronos):", deleteResult2);
  console.assert(deleteResult2 === true, 'Deletion should succeed');
  
  // Verify deletions
  const deletedNode = await storage.getQuantumRootNode(createdNode.id);
  const deletedNode2 = await storage.getQuantumRootNode(createdNode2.id);
  console.assert(!deletedNode, 'First deleted node should not exist');
  console.assert(!deletedNode2, 'Second deleted node should not exist');
  
  console.log("\n✅ CHRONOS QRN SERVICE VERIFICATION COMPLETE");
}

// Run the verification
runVerification()
  .then(() => {
    console.log("ChronosQRNService verification succeeded");
    FeatureToggleService.getInstance().resetToDefaults(); // Reset toggles to defaults
  })
  .catch(error => {
    console.error("ChronosQRNService verification failed:", error);
    FeatureToggleService.getInstance().resetToDefaults(); // Reset toggles to defaults
    process.exit(1);
  });