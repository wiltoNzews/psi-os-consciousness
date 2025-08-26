/**
 * Test Script for Nuggies Logger
 * 
 * This script demonstrates the Nuggies Logger in action with example text
 * and runs a quick test to verify functionality.
 * 
 * [CONTEXT: SIMULATION]
 */

import fs from 'fs/promises';
import { captureNuggies } from './nuggies-logger.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current file name (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create test files with sample insights to demonstrate the logger
 */
async function createTestFiles() {
  const testDir = './test-nuggie-data';
  
  try {
    // Create test directory
    try {
      await fs.mkdir(testDir);
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    // Test file 1: Documentation with emphasis patterns
    const testFile1 = `# Test Documentation 
    
[CONTEXT: SIMULATION]
    
When implementing the system, you MUST ALWAYS include proper context tagging on all outputs.
This is a CRITICAL REQUIREMENT for maintaining the proper simulation-reality boundary.

The document-first approach reduces development resets by approximately 50% and ensures alignment
between conceptual understanding and implementation details. WRITE THIS DOWN!

🔥 KEY INSIGHT: The Explicit-Implicit Quantum Balance prevents infinite loops by creating
a clear boundary between strategic framework (implicit) and tactical implementation (explicit).
`;

    // Test file 2: Technical notes with directive patterns
    const testFile2 = `// Technical implementation notes
// [CONTEXT: SIMULATION]

/* 
 * Important note: When implementing the FlowType enum in code, always ensure
 * that the [CONTEXT: SIMULATION] tag is included in nearby comments or string literals
 * to maintain proper context tagging across the codebase.
 */

function implementQuantumBalance() {
  // Crucial point: Void-Centered Design always starts with explicit boundary definition
  // before implementing any functionality within those boundaries.
  
  // Remember this: A well-defined "void" at the center of your design prevents
  // tight coupling and enables adaptive evolution of the system.
}
`;

    // Test file 3: Mixed content with emotional signals
    const testFile3 = `## Development Strategy
    
[CONTEXT: SIMULATION]

⚠️ All stress testing MUST be conducted in [CONTEXT: SIMULATION] mode only, with proper context tagging,
to ensure no real-world consequences result from testing at scale or with edge cases.

For optimal link maintenance, remove specific anchor references and use simplified document links.
This approach is AMAZING because it reduces the risk of broken links by eliminating dependency
on specific section identifiers that might change during document evolution.

💡 The 70/30 Structured Chaos Ratio should be DYNAMICALLY ADJUSTED based on system performance metrics,
increasing chaos (up to 40%) during periods of stagnation and reducing it (down to 20%) during 
periods of instability.
`;

    // Write test files
    await fs.writeFile(`${testDir}/test-documentation.md`, testFile1);
    await fs.writeFile(`${testDir}/technical-notes.js`, testFile2);
    await fs.writeFile(`${testDir}/development-strategy.md`, testFile3);
    
    console.log('[CONTEXT: SIMULATION] Created test files in ./test-nuggie-data/');
  } catch (error) {
    console.error('[CONTEXT: SIMULATION] Error creating test files:', error);
  }
}

/**
 * Main test function
 */
async function runNuggiesTest() {
  console.log('[CONTEXT: SIMULATION] Starting Nuggies Logger Test...');
  
  try {
    // Create test files
    await createTestFiles();
    
    // Run Nuggies Logger on test directory
    await captureNuggies('./test-nuggie-data');
    
    console.log('[CONTEXT: SIMULATION] Test complete! Check WILTON_NUGGIES.md for results.');
    console.log('[CONTEXT: SIMULATION] This demonstrates how the logger automatically captures high-value insights.');
  } catch (error) {
    console.error('[CONTEXT: SIMULATION] Test failed:', error);
  }
}

// Run the test if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runNuggiesTest();
}

// Export for use in other modules
export { runNuggiesTest };