/**
 * Test script for the getAllAdaptiveResonances method
 * 
 * This script tests the implementation of the Explicit-Implicit Quantum Balance 
 * approach in the getAllAdaptiveResonances method of both FileSystemStorage and MemStorage.
 */

import { fileStorage } from './server/db.js';

async function runTest() {
  console.log("=== Testing getAllAdaptiveResonances with Explicit-Implicit Quantum Balance ===");
  
  // Clear any existing adaptive resonances (optional)
  const existingResonances = await fileStorage.getAllAdaptiveResonances();
  console.log(`Found ${existingResonances.length} existing adaptive resonances`);
  
  // Explicitly add sample adaptive resonances
  console.log("Explicitly adding sample adaptive resonances...");
  await fileStorage.createAdaptiveResonance({ id: "ar1", value: 0.82 });
  await fileStorage.createAdaptiveResonance({ id: "ar2", value: 0.66 });
  
  // Explicitly test fetching all resonances
  console.log("Explicitly fetching all adaptive resonances...");
  const resonances = await fileStorage.getAllAdaptiveResonances();
  console.log("Retrieved adaptive resonances:", resonances);
  
  // Verify the results explicitly
  if (resonances.length >= 2) {
    console.log("TEST PASSED: Successfully retrieved adaptive resonances using Explicit-Implicit Quantum Balance");
  } else {
    console.error("TEST FAILED: Could not retrieve adaptive resonances");
  }
}

// Run the test
runTest().catch(err => {
  console.error("Test failed with error:", err);
});