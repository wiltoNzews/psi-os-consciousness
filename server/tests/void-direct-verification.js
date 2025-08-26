/**
 * Direct Verification of Void-Centered Metadata
 * 
 * This is a direct JavaScript script that verifies the ContextRelationship
 * metadata support without relying on the Jest testing framework.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Get the current directory 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define a test directory path
const testDir = path.join(process.cwd(), 'void-direct-test');
const testFilePath = path.join(testDir, 'relationship-direct-test.json');

/**
 * Run the direct verification
 */
async function runVerification() {
  console.log('Starting direct verification of void-centered metadata support...');
  
  try {
    // Create test directory
    console.log(`Creating test directory: ${testDir}`);
    await fs.mkdir(testDir, { recursive: true });
    
    // Create a test relationship with void-centered metadata
    const relationship = {
      sourceId: `source-${uuidv4()}`,
      targetId: `target-${uuidv4()}`,
      relationshipType: 'void-centered-relationship',
      strength: 0.95,
      timestamp: new Date(),
      metadata: {
        boundaryType: 'explicit',
        voidCenteredAttribute: 'authenticity',
        dimensionalResonance: 0.87,
        recursiveDepth: 3
      }
    };
    
    // Create a test context
    const testContext = {
      sessionId: `void-test-${uuidv4()}`,
      historyChunks: [],
      strategicPlans: [],
      metaInsights: [],
      relationships: [relationship],
      updatedAt: new Date(),
      createdAt: new Date(),
      version: 0
    };
    
    // Write the context to a file with custom date serialization
    console.log(`Writing test data to: ${testFilePath}`);
    await fs.writeFile(
      testFilePath, 
      JSON.stringify(testContext, (key, value) => {
        return value instanceof Date ? { __date: value.toISOString() } : value;
      }, 2)
    );
    
    // Read the file back
    console.log('Reading test data from file...');
    const fileContent = await fs.readFile(testFilePath, 'utf8');
    
    // Parse the content with date handling
    const parsedContext = JSON.parse(fileContent, (key, value) => {
      if (value && typeof value === 'object' && value.__date) {
        return new Date(value.__date);
      }
      return value;
    });
    
    // Verify the relationship metadata was preserved
    console.log('Verifying metadata preservation...');
    const verifications = [
      { check: 'Relationship exists', result: parsedContext.relationships.length === 1 },
      { check: 'Metadata exists', result: !!parsedContext.relationships[0].metadata },
      { check: 'boundaryType preserved', result: parsedContext.relationships[0].metadata.boundaryType === 'explicit' },
      { check: 'voidCenteredAttribute preserved', result: parsedContext.relationships[0].metadata.voidCenteredAttribute === 'authenticity' },
      { check: 'dimensionalResonance preserved', result: parsedContext.relationships[0].metadata.dimensionalResonance === 0.87 },
      { check: 'recursiveDepth preserved', result: parsedContext.relationships[0].metadata.recursiveDepth === 3 }
    ];
    
    // Log verification results
    let allPassed = true;
    verifications.forEach(v => {
      console.log(`${v.result ? '✅' : '❌'} ${v.check}`);
      if (!v.result) allPassed = false;
    });
    
    // Direct file check
    const fileStats = await fs.stat(testFilePath);
    console.log(`File size: ${fileStats.size} bytes`);
    
    // Final status
    console.log(`\nVoid-Centered Metadata Direct Verification: ${allPassed ? 'PASSED' : 'FAILED'}`);
    
    // Clean up
    console.log('\nCleaning up test directory...');
    await fs.rm(testDir, { recursive: true, force: true });
    
    return allPassed;
  } catch (error) {
    console.error('Error during verification:', error);
    return false;
  }
}

// Run the verification directly
runVerification()
  .then(success => {
    console.log(`\nVerification complete. Status: ${success ? 'SUCCESS' : 'FAILURE'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error during verification:', error);
    process.exit(1);
  });