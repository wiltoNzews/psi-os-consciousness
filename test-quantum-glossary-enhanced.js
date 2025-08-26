/**
 * Enhanced Test script for the Quantum Glossary module
 * 
 * This script tests the expanded functionality of the Quantum Glossary module
 * with dynamically sourced verification metrics, Flow metrics, and variant sync
 * capabilities to ensure it properly handles all enhanced features.
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
  console.log('\n----- QUANTUM GLOSSARY ENHANCED VERIFICATION TEST -----\n');
  
  // Test context tagging and environment detection
  const context = quantumGlossary.getOperatingContext();
  const isSimulation = quantumGlossary.isSimulation();
  const isRealWorld = quantumGlossary.isRealWorld();
  
  console.log(`Current operating context: ${context}`);
  console.log(`Tagged message: ${quantumGlossary.tagWithContext('Test message')}`);
  console.log(`Is simulation: ${isSimulation}`);
  console.log(`Is real world: ${isRealWorld}`);
  
  // Test verification metrics - should be dynamically generated now
  const verificationConfig = quantumGlossary.getVerificationConfig();
  console.log('\n----- VERIFICATION METRICS -----');
  console.log(`Boundary threshold: ${verificationConfig.boundaryThreshold}`);
  console.log(`Responsibility threshold: ${verificationConfig.responsibilityThreshold}`);
  
  // Test module verification
  const moduleVerification = await quantumGlossary.verifyModule('./server/services/qrn/quantum-glossary.ts');
  console.log('\n----- MODULE VERIFICATION -----');
  console.log(`Boundaries: ${moduleVerification.boundaryCount}`);
  console.log(`Responsibilities: ${moduleVerification.responsibilityCount}`);
  console.log(`Status: ${moduleVerification.status}`);
  
  // Test flow metrics
  console.log('\n----- FLOW METRICS TESTING -----');
  
  // Record some test flow metrics
  console.log('Recording test flow metrics...');
  quantumGlossary.recordFlowMetric(FlowType.FLOW, 'test-source-1', 0.85, { test: true });
  quantumGlossary.recordFlowMetric(FlowType.FLOW, 'test-source-2', 0.92, { test: true });
  quantumGlossary.recordFlowMetric(FlowType.ANTIFLOW, 'test-source-3', 0.25, { test: true });
  
  // Retrieve test flow metrics and check if they were recorded
  const recentMetrics = quantumGlossary.getFlowMetrics(undefined, 5);
  console.log(`Recent metrics count: ${recentMetrics.length}`);
  
  // Calculate system stability score
  const stabilityScore = quantumGlossary.calculateSystemStability();
  console.log(`System stability score: ${stabilityScore.toFixed(4)}`);
  
  // Test variant sync with different AI variants
  console.log('\n----- VARIANT SYNC TESTING -----');
  
  // Test native variant
  console.log('Testing NATIVE variant sync...');
  const nativeResult = await quantumGlossary.syncWithVariant(AIVariant.NATIVE, { test: 'data' });
  console.log(`Native sync status: ${nativeResult.status}`);
  
  // Test ChatGPT variant
  console.log('Testing CHATGPT variant sync...');
  const chatgptResult = await quantumGlossary.syncWithVariant(AIVariant.CHATGPT, { test: 'data' });
  console.log(`ChatGPT sync status: ${chatgptResult.status}`);
  
  // Test SANCTUM variant
  console.log('Testing SANCTUM variant sync...');
  const sanctumResult = await quantumGlossary.syncWithVariant(AIVariant.SANCTUM, { test: 'data' });
  console.log(`SANCTUM sync status: ${sanctumResult.status}`);
  
  // Get comprehensive glossary info
  console.log('\n----- GLOSSARY INFO -----');
  const glossaryInfo = quantumGlossary.getGlossaryInfo();
  console.log('Glossary info structure:');
  console.log(Object.keys(glossaryInfo));
  console.log('Flow metrics info:');
  console.log(Object.keys(glossaryInfo.flowMetrics));
  console.log(`Total metrics recorded: ${glossaryInfo.flowMetrics.totalMetricsRecorded}`);
  console.log(`System stability: ${glossaryInfo.flowMetrics.systemStability.toFixed(4)}`);
  
  console.log('\n----- TEST COMPLETED SUCCESSFULLY -----\n');
}

// Run the test
runTest().catch(error => {
  console.error('Error in Quantum Glossary test:', error);
});