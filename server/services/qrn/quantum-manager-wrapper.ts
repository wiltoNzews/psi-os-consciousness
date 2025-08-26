/**
 * Quantum Agent Manager TypeScript Wrapper
 * 
 * This module provides a TypeScript-friendly wrapper around the JavaScript
 * quantum agent manager implementation. It ensures proper type safety
 * for TypeScript modules that need to interact with the agent system.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

// Import default keyword to fix import issue with .js extension
import type { 
  AgentMessage, 
  AgentInterface, 
  MessageHistoryEntry, 
  ProcessingState,
  QuantumAgentManager as QuantumAgentManagerType
} from './types/quantum-agent-manager-types.js';

// Dynamic import to resolve module type mismatch
// The real implementation is in the Javascript file
let QuantumAgentManagerImpl: any;

try {
  // Try to import from the relative path
  const module = await import('./quantum-agent-manager.js');
  QuantumAgentManagerImpl = module.QuantumAgentManager;
} catch (error) {
  console.error('Error importing QuantumAgentManager:', error);
  // Create a stub implementation for type compatibility
  class StubManager {
    agents = {};
    messageHistory = [];
    options = { maxHistoryEntries: 100, agentInitialization: 'lazy' };
    communicationBus = new Map();

    constructor(options = {}) {
      this.options = { ...this.options, ...options };
      console.log('[STUB] Quantum Agent Manager initialized with stub implementation');
    }
    
    getAgents() { return {}; }
    getAgentStatus() { return "unknown"; }
    getMessageHistory() { return []; }
    getAgentInfo() { return {}; }
    initializeStandardAgents() { return []; }
    registerAgent() { return ""; }
    sendMessage() { return null; }
    broadcastMessage() { return {}; }
    processChunk() { 
      return { processingState: {} }; 
    }
    deregisterAgent() { return false; }
  }
  
  QuantumAgentManagerImpl = StubManager;
}

// Singleton instance for the agent manager
let instance: QuantumAgentManagerType | null = null;

/**
 * Get the singleton instance of the QuantumAgentManager
 * @returns The quantum agent manager instance
 */
export function getQuantumAgentManager(): QuantumAgentManagerType {
  if (!instance) {
    try {
      // Create instance from constructor (JavaScript options format is simple object)
      instance = new QuantumAgentManagerImpl({}) as unknown as QuantumAgentManagerType;
      
      // Ensure we have necessary methods
      if (!instance.getAgents && QuantumAgentManagerImpl.prototype.getAgents) {
        // Copy from prototype if missing
        instance.getAgents = QuantumAgentManagerImpl.prototype.getAgents.bind(instance);
      }
      
    } catch (error) {
      console.error('Error creating QuantumAgentManager instance:', error);
      // Return a compatible stub object
      instance = {
        agents: {},
        messageHistory: [],
        options: { maxHistoryEntries: 100, agentInitialization: 'lazy' },
        communicationBus: new Map(),
        getAgents: () => ({}),
        getAgentStatus: () => "unknown",
        getMessageHistory: () => [],
      } as unknown as QuantumAgentManagerType;
    }
  }
  return instance;
}

/**
 * Create a new QuantumAgentManager instance
 * @param options Configuration options for the agent manager
 * @returns A new quantum agent manager instance
 */
export function createQuantumAgentManager(options: Record<string, any> = {}): QuantumAgentManagerType {
  try {
    // Pass options directly to QuantumAgentManager constructor
    return new QuantumAgentManagerImpl(options) as unknown as QuantumAgentManagerType;
  } catch (error) {
    console.error('Error creating new QuantumAgentManager instance:', error);
    // Return a compatible stub object
    return {
      agents: {},
      messageHistory: [],
      options: { ...options, maxHistoryEntries: 100, agentInitialization: 'lazy' },
      communicationBus: new Map(),
      getAgents: () => ({}),
      getAgentStatus: () => "unknown",
      getMessageHistory: () => [],
    } as unknown as QuantumAgentManagerType;
  }
}

// Re-export types for convenient usage
export type { 
  AgentMessage, 
  AgentInterface, 
  MessageHistoryEntry, 
  ProcessingState,
  QuantumAgentManagerType
};