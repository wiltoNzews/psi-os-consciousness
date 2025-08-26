/**
 * Quantum Coherence Engine Singleton
 * Ensures single instance across all imports
 */

let engineInstance = null;

export async function getQuantumCoherenceEngine() {
  if (!engineInstance) {
    const { quantumCoherenceEngine } = await import('./quantum-coherence-engine.js');
    engineInstance = quantumCoherenceEngine;
    
    // Verify the instance has required methods
    if (!engineInstance || typeof engineInstance.getSystemState !== 'function') {
      console.error('[QCE Singleton] Invalid engine instance:', {
        hasInstance: !!engineInstance,
        hasGetSystemState: engineInstance && typeof engineInstance.getSystemState === 'function',
        instanceType: typeof engineInstance
      });
      throw new Error('Quantum Coherence Engine not properly initialized');
    }
    
    console.log('[QCE Singleton] Engine instance connected successfully');
  }
  return engineInstance;
}

export function resetEngine() {
  engineInstance = null;
}