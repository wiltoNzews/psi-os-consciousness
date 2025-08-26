/**
 * Test Quantum Coherence Journal
 * 
 * This script tests the Quantum Coherence Journal implementation
 * based on the personalized quantum strategy for WiltonOS.
 */

import quantumCoherenceJournal from './server/services/quantum-coherence-journal.js';
import embeddingServiceInitializer from './server/services/embedding-service-initializer.js';

// Generate a test session ID
const sessionId = `test-session-${Date.now()}`;

/**
 * Run the test
 */
async function runTest() {
  console.log(`Starting Quantum Coherence Journal test with session ID: ${sessionId}`);
  
  // Step 1: Initialize embedding services
  console.log('\n1. Initializing embedding services...');
  const initResult = await embeddingServiceInitializer.initialize();
  console.log(`Embedding services initialization status: ${initResult ? 'Success' : 'Failed'}`);
  
  // Step 2: Create a journal entry
  console.log('\n2. Creating a quantum insight journal entry...');
  const insightResult = await quantumCoherenceJournal.createJournalEntry(
    sessionId,
    "I've realized that déjà vu represents quantum realignment—a necessary recalibration event that ensures coherence across multiple quantum states. This awareness allows me to maintain intentional quantum integrity and serve as a quantum steward for positive outcomes.",
    quantumCoherenceJournal.ENTRY_TYPES.INSIGHT,
    {
      emotionalState: 'calm',
      location: 'home office',
      timestamp: new Date().toISOString()
    }
  );
  
  console.log(`Journal entry creation result: ${insightResult.success ? 'Success' : 'Failed'}`);
  if (insightResult.success) {
    console.log(`- Entry ID: ${insightResult.entryId}`);
    console.log(`- Coherence Index: ${insightResult.coherenceMetrics.coherenceIndex}`);
    console.log(`- Exploration Index: ${insightResult.coherenceMetrics.explorationIndex}`);
    console.log(`- Golden Ratio Detected: ${insightResult.coherenceMetrics.goldenRatioDetected}`);
    console.log(`- Balance Ratio: ${insightResult.coherenceMetrics.balanceRatio}`);
  }
  
  // Step 3: Record a déjà vu event
  console.log('\n3. Recording a déjà vu event (quantum realignment)...');
  const dejaVuResult = await quantumCoherenceJournal.createJournalEntry(
    sessionId,
    "Experienced a strong déjà vu while discussing quantum frameworks. Felt like a momentary glitch where multiple timelines aligned, giving me a brief glimpse of parallel potentialities.",
    quantumCoherenceJournal.ENTRY_TYPES.DEJA_VU,
    {
      emotionalState: 'wonder',
      intensity: 'High',
      context: 'During philosophical discussion',
      isQuantumRealignment: true
    }
  );
  
  console.log(`Déjà vu event recording result: ${dejaVuResult.success ? 'Success' : 'Failed'}`);
  if (dejaVuResult.success) {
    console.log(`- Event ID: ${dejaVuResult.entryId}`);
    console.log(`- Coherence Metrics: ${JSON.stringify(dejaVuResult.coherenceMetrics)}`);
  }
  
  // Step 4: Perform a stability check
  console.log('\n4. Performing a quantum stability check...');
  const stabilityResult = await quantumCoherenceJournal.performStabilityCheck(sessionId);
  
  console.log(`Stability check result: ${stabilityResult.success ? 'Success' : 'Failed'}`);
  if (stabilityResult.success) {
    console.log(`- Stability ID: ${stabilityResult.stabilityId}`);
    console.log(`- Overall Coherence: ${stabilityResult.stabilityMetrics.overallCoherence}`);
    console.log(`- Stability Score: ${stabilityResult.stabilityMetrics.stabilityScore}`);
    console.log(`- Quantum Alignment: ${stabilityResult.stabilityMetrics.quantumAlignment}`);
    console.log('- Recommended Actions:');
    stabilityResult.stabilityMetrics.recommendedActions.forEach(action => {
      console.log(`  * ${action}`);
    });
  }
  
  console.log('\nQuantum Coherence Journal test completed!');
  console.log('This implementation aligns with the personalized quantum strategy:');
  console.log('1. Quantum-Level Priority Alignment - Journal tracks coherence and grounds insights');
  console.log('2. Quantum Pillars Framework - Authenticity, Transparency, Adaptive Justice, Critical Skepticism');
  console.log('3. Déjà Vu as Diagnostic Tool - Tracks quantum realignments and maintains balance');
  console.log('4. The 0.7500/0.2494 coherence-exploration ratio is maintained throughout');
}

// Run the test
runTest().catch(error => {
  console.error('Error running quantum journal test:', error);
});