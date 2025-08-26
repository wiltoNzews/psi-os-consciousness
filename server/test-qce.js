// Quick test to verify Quantum Coherence Engine functionality
import { quantumCoherenceEngine } from './quantum-coherence-engine.js';

console.log('=== QCE Direct Test ===');
console.log('Engine available:', !!quantumCoherenceEngine);
console.log('Engine type:', typeof quantumCoherenceEngine);
console.log('getSystemState available:', typeof quantumCoherenceEngine?.getSystemState);
console.log('on method available:', typeof quantumCoherenceEngine?.on);

if (quantumCoherenceEngine && typeof quantumCoherenceEngine.getSystemState === 'function') {
  try {
    const state = quantumCoherenceEngine.getSystemState();
    console.log('System state retrieved successfully');
    console.log('Zλ:', state.consciousness?.zLambda);
    console.log('QCTF:', state.qctf);
  } catch (error) {
    console.error('Error getting system state:', error.message);
  }
} else {
  console.error('Engine not properly initialized');
}