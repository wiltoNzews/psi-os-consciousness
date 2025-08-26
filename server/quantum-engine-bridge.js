/**
 * Quantum Coherence Engine Bridge
 * Direct access to the running engine instance without import issues
 */

// Global reference to the running engine
let activeEngineInstance = null;

export function setActiveEngine(engine) {
  activeEngineInstance = engine;
  console.log('[QCE Bridge] Active engine instance registered');
}

export function getActiveEngine() {
  if (!activeEngineInstance) {
    throw new Error('No active engine instance available');
  }
  return activeEngineInstance;
}

export function isEngineActive() {
  return activeEngineInstance !== null;
}