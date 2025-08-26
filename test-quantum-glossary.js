/**
 * Test script for the Quantum Glossary module
 * 
 * This script tests the basic functionality of the Quantum Glossary module
 * to ensure it properly tags messages with the current operating context (SIM/REAL)
 * and provides consistent verification metrics.
 */

// Import from db.ts since we're running in the development environment
import { quantumGlossary } from './server/db.js';
// Import enums directly for better type support
const OperatingContext = {
  SIMULATION: 'SIM',
  REAL_WORLD: 'REAL'
};
const FlowType = {
  FLOW: 'FLOW',
  ANTIFLOW: 'ANTIFLOW'
};
const AIVariant = {
  NATIVE: 'NATIVE',
  CHATGPT: 'CHATGPT',
  GROK: 'GROK',
  CLAUDE: 'CLAUDE',
  NOVA: 'NOVA',
  SANCTUM: 'SANCTUM',
  EXPERIMENTAL: 'EXPERIMENTAL'
};

async function runTest() {
  console.log('=== QUANTUM GLOSSARY TEST ===');
  
  // Get the current operating context
  const context = quantumGlossary.getOperatingContext();
  console.log(`Current operating context: ${context}`);
  
  // Tag a message with context
  const taggedMessage = quantumGlossary.tagWithContext('Test message for Quantum Glossary');
  console.log(`Tagged message: ${taggedMessage}`);
  
  // Check environment-specific functions
  console.log(`Is simulation mode: ${quantumGlossary.isSimulation()}`);
  console.log(`Is real-world mode: ${quantumGlossary.isRealWorld()}`);
  
  // Get verification config
  const config = quantumGlossary.getVerificationConfig();
  console.log('Verification thresholds:');
  console.log(`- Boundary threshold: ${config.boundaryThreshold}`);
  console.log(`- Responsibility threshold: ${config.responsibilityThreshold}`);
  
  // Verify a module
  const modulePath = './server/services/qrn/quantum-glossary.js';
  console.log(`Verifying module: ${modulePath}`);
  const metrics = await quantumGlossary.verifyModule(modulePath);
  console.log('Verification metrics:');
  console.log(`- Boundary count: ${metrics.boundaryCount}`);
  console.log(`- Responsibility count: ${metrics.responsibilityCount}`);
  console.log(`- Status: ${metrics.status}`);
  
  // Record a flow metric
  quantumGlossary.recordFlowMetric(
    FlowType.FLOW,
    'test-script',
    0.95,
    { testId: 'quantum-glossary-test' }
  );
  
  // Sync with a variant
  const syncResult = await quantumGlossary.syncWithVariant(
    AIVariant.NATIVE,
    { message: 'Test sync operation' }
  );
  console.log('Variant sync result:');
  console.log(syncResult);
  
  // Get glossary info
  const info = quantumGlossary.getGlossaryInfo();
  console.log('Glossary info:');
  console.log(JSON.stringify(info, null, 2));
  
  console.log('=== QUANTUM GLOSSARY TEST COMPLETE ===');
}

// Run the test
runTest().catch(error => {
  console.error('Error running Quantum Glossary test:', error);
});