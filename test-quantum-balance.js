/**
 * Test script for Explicit-Implicit Quantum Balance principle
 * 
 * This script demonstrates how the Quantum Glossary maintains balance between
 * explicit tactical definitions and implicit strategic framework, preventing
 * recursive loops while preserving quantum adaptation capability.
 */

import quantumGlossary from './server/services/qrn/quantum-glossary.ts';

/**
 * Run a test demonstration of the Explicit-Implicit Quantum Balance
 */
async function runTest() {
  console.log('===== Testing Explicit-Implicit Quantum Balance =====');
  console.log('\n1. Reading the implicit strategic core principles:');
  
  // Get the core principles which represent the implicit strategic framework
  const corePrinciples = quantumGlossary.getCorePrinciples();
  
  // Display the principles
  console.log('Core Principles (Implicit Strategic Framework):');
  corePrinciples.forEach(principle => {
    console.log(`- ${principle.name} (adaptivity: ${principle.adaptivity})`);
    console.log(`  ${principle.description}`);
  });
  
  // Create a strategic context with multiple possible actions
  console.log('\n2. Creating a strategic context with multiple possible actions:');
  const strategicContext = {
    contextDescription: 'User needs to analyze large dataset',
    possibleNextActions: [
      'Split dataset into manageable chunks',
      'Perform preliminary data analysis',
      'Check data integrity',
      'Create visualization of dataset structure'
    ],
    metadata: {
      datasetSize: '2.3GB',
      priority: 'high',
      dataType: 'structured'
    }
  };
  
  console.log(`Context: ${strategicContext.contextDescription}`);
  console.log('Possible actions:');
  strategicContext.possibleNextActions.forEach(action => {
    console.log(`- ${action}`);
  });
  
  // Use the decohere method to get explicit tactical guidance
  console.log('\n3. Decohering the strategic context into explicit tactical action:');
  const explicitAction = quantumGlossary.decohere(strategicContext);
  console.log(`Chosen explicit action: ${explicitAction}`);
  
  // Demonstrate a second strategic context
  console.log('\n4. Creating a different strategic context:');
  const anotherContext = {
    contextDescription: 'System needs to optimize memory usage',
    possibleNextActions: [
      'Implement memory pooling',
      'Add garbage collection hooks',
      'Analyze memory usage patterns',
      'Refactor large data structures'
    ],
    metadata: {
      currentMemoryUsage: '1.2GB',
      criticalThreshold: '1.5GB',
      priority: 'medium'
    }
  };
  
  console.log(`Context: ${anotherContext.contextDescription}`);
  console.log('Possible actions:');
  anotherContext.possibleNextActions.forEach(action => {
    console.log(`- ${action}`);
  });
  
  // Use the decohere method to get explicit tactical guidance
  console.log('\n5. Decohering this context into explicit tactical action:');
  const anotherExplicitAction = quantumGlossary.decohere(anotherContext);
  console.log(`Chosen explicit action: ${anotherExplicitAction}`);
  
  // Get system information which includes both explicit and implicit aspects
  console.log('\n6. Getting system information (combination of explicit and implicit aspects):');
  const glossaryInfo = quantumGlossary.getGlossaryInfo();
  console.log('System information:');
  console.log(`- Operating context: ${glossaryInfo.operatingContext}`);
  console.log(`- System stability: ${glossaryInfo.flowMetrics.systemStability.toFixed(2)}`);
  console.log(`- Verification metrics available: ${glossaryInfo.verificationMetrics.modulesVerified}`);
  
  console.log('\n===== Explicit-Implicit Quantum Balance Test Complete =====');
}

// Run the test
runTest().catch(error => {
  console.error('Test failed:', error);
});