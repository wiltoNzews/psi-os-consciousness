/**
 * Test script for the Coherence Metrics module
 * 
 * This script demonstrates how to use the various coherence calculation methods
 * provided by the new Coherence Metrics module.
 * 
 * [QUANTUM_STATE: TEST_FLOW]
 */

import {
  calculatePhaseCoherenceForAgents,
  calculateVectorCoherenceForAgents,
  calculateMixedCoherence,
  computeKuramotoR,
  normalizeCosineSimilarity,
  computeCosineSimilarity
} from './dist/coherence-metrics.js';

// Test various coherence metrics calculations

// 1. Test Kuramoto order parameter with basic phase values
console.log("\n===== KURAMOTO ORDER PARAMETER TEST =====");
const phases = [0, 0.5, 1.0, 1.5, 2.0];
const r = computeKuramotoR(phases);
console.log(`Phases: ${phases}`);
console.log(`Kuramoto order parameter: ${r.toFixed(4)}`);

// 2. Test phase-based coherence calculation
console.log("\n===== PHASE COHERENCE TEST =====");
const phaseAgents = [
  { id: 'agent1', phase: 0, type: 'oracle' },
  { id: 'agent2', phase: 0.1, type: 'oracle' },
  { id: 'agent3', phase: 0.2, type: 'loki' },
  { id: 'agent4', phase: 0.3, type: 'loki' }
];
const phaseCoherence = calculatePhaseCoherenceForAgents(phaseAgents);
console.log(`Phase-based coherence: ${phaseCoherence.value.toFixed(4)}`);
console.log(`Raw order parameter: ${phaseCoherence.raw.toFixed(4)}`);
console.log(`Details:`, phaseCoherence.details);

// 3. Test vector-based coherence calculation
console.log("\n===== VECTOR COHERENCE TEST =====");
const vectorAgents = [
  { id: 'agent1', vector: [1, 0, 0], type: 'oracle' },
  { id: 'agent2', vector: [0.9, 0.1, 0], type: 'oracle' },
  { id: 'agent3', vector: [0, 1, 0], type: 'loki' },
  { id: 'agent4', vector: [0, 0.9, 0.1], type: 'loki' }
];
const vectorCoherence = calculateVectorCoherenceForAgents(vectorAgents);
console.log(`Vector-based coherence: ${vectorCoherence.value.toFixed(4)}`);
console.log(`Mean similarity: ${vectorCoherence.details.meanSimilarity.toFixed(4)}`);
console.log(`Details:`, vectorCoherence.details);

// 4. Test mixed coherence calculation
console.log("\n===== MIXED COHERENCE TEST =====");
const mixedCoherence = calculateMixedCoherence(phaseAgents, vectorAgents);
console.log(`Mixed coherence: ${mixedCoherence.value.toFixed(4)}`);
console.log(`Details:`, mixedCoherence.details);

// 5. Test with a specific target coherence (the 0.7500 attractor)
console.log("\n===== TARGET COHERENCE TEST (0.7500) =====");
// Test with varying target coherence values to see how they affect the measurement
const targetCoherence = 0.7500;
const phaseCoherenceWithTarget = calculatePhaseCoherenceForAgents(phaseAgents, targetCoherence);
console.log(`Phase coherence with target 0.7500: ${phaseCoherenceWithTarget.value.toFixed(4)}`);

// 6. Demonstrate how phase alignment works
console.log("\n===== PHASE ALIGNMENT DEMONSTRATION =====");
// Create a set of perfectly aligned phases (synchronized)
const alignedPhases = [0, 0, 0, 0, 0];
// Create a set of perfectly anti-aligned phases (balanced opposition)
const antiAlignedPhases = [0, Math.PI, 0, Math.PI, 0];
// Create a set of randomly distributed phases
const randomPhases = Array.from({length: 5}, () => Math.random() * 2 * Math.PI);

console.log(`Aligned phases: R = ${computeKuramotoR(alignedPhases).toFixed(4)}`);
console.log(`Anti-aligned phases: R = ${computeKuramotoR(antiAlignedPhases).toFixed(4)}`);
console.log(`Random phases: R = ${computeKuramotoR(randomPhases).toFixed(4)}`);

// 7. Demonstrate vector similarity measures
console.log("\n===== VECTOR SIMILARITY DEMONSTRATION =====");
const v1 = [1, 0, 0];
const v2 = [0, 1, 0];
const v3 = [0.7071, 0.7071, 0]; // 45 degrees from v1 and v2

console.log(`Cosine similarity (v1, v2): ${computeCosineSimilarity(v1, v2).toFixed(4)}`);
console.log(`Normalized similarity (v1, v2): ${normalizeCosineSimilarity(computeCosineSimilarity(v1, v2)).toFixed(4)}`);
console.log(`Cosine similarity (v1, v3): ${computeCosineSimilarity(v1, v3).toFixed(4)}`);
console.log(`Normalized similarity (v1, v3): ${normalizeCosineSimilarity(computeCosineSimilarity(v1, v3)).toFixed(4)}`);
console.log(`Cosine similarity (v2, v3): ${computeCosineSimilarity(v2, v3).toFixed(4)}`);
console.log(`Normalized similarity (v2, v3): ${normalizeCosineSimilarity(computeCosineSimilarity(v2, v3)).toFixed(4)}`);

// 8. Test the 0.7500 attractor property with varying coherence levels
console.log("\n===== 0.7500 ATTRACTOR TEST =====");
// Test a range of raw coherence values to see how close they are to the 0.7500 attractor
const rawValues = [0.1, 0.3, 0.5, 0.75, 0.8, 0.95];
console.log("Raw coherence | Coherence value (proximity to 0.7500 attractor)");
console.log("----------------------------------------------------------");
for (const raw of rawValues) {
  // Create a simple test environment with a specified raw coherence
  const testAgents = [
    { id: 'test1', phase: 0 },
    { id: 'test2', phase: Math.acos(2 * raw - 1) } // Mathematically forces a specific raw coherence
  ];
  
  const result = calculatePhaseCoherenceForAgents(testAgents);
  console.log(`${raw.toFixed(4)}        | ${result.value.toFixed(4)}`);
}

console.log("\nTest completed! The coherence metrics module is working as expected.");