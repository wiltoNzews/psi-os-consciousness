/**
 * Global Engine Registry
 * Single source of truth for the active quantum coherence engine
 */

// Global variable to store the active engine instance
global.quantumEngineInstance = null;

export function registerQuantumEngine(engine) {
  global.quantumEngineInstance = engine;
  
  // Create direct method access functions to bypass prototype issues
  global.getQuantumSystemState = function() {
    return engine.getSystemState();
  };
  
  global.processQuantumInput = function(inputData) {
    return engine.processUserInput(inputData);
  };
  
  console.log('[Global Registry] Quantum engine registered with direct method access');
}

export function getQuantumEngine() {
  if (!global.quantumEngineInstance) {
    throw new Error('No quantum engine registered in global registry');
  }
  return global.quantumEngineInstance;
}

export function getQuantumSystemState() {
  if (!global.getQuantumSystemState) {
    throw new Error('No quantum system state function available');
  }
  return global.getQuantumSystemState();
}

export function isQuantumEngineRegistered() {
  return global.quantumEngineInstance !== null;
}