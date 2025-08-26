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

// Define a concrete implementation of StubManager that satisfies the QuantumAgentManagerType interface
class StubAgentManager implements QuantumAgentManagerType {
  agents: Record<string, any> = {};
  messageHistory: MessageHistoryEntry[] = [];
  options: Record<string, any> = { maxHistoryEntries: 100, agentInitialization: 'lazy' };
  communicationBus: Map<string, any> = new Map();
  
  constructor(options: Record<string, any> = {}) {
    this.options = { ...this.options, ...options };
    console.log('[STUB] Quantum Agent Manager initialized with stub implementation');
  }
  
  getAgents() { return this.agents; }
  getAgentStatus() { return "unknown"; }
  getMessageHistory(agentId?: string, limit?: number) { return []; }
  getAgentInfo(agentId: string) { return {}; }
  initializeStandardAgents() { return []; }
  registerAgent(agent: AgentInterface) { return "stub-agent-id"; }
  sendMessage(agentId: string, message: AgentMessage) { return null; }
  broadcastMessage(message: AgentMessage, targetAgentIds: string[]) { return {}; }
  processChunk(chunk: any, options?: Record<string, any>) { 
    return { processingState: {} as ProcessingState }; 
  }
  deregisterAgent(agentId: string) { return false; }
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
      // First try to use the JS implementation that's already loaded
      const QuantumAgentManagerJS = globalThis.QuantumAgentManager || null;
      
      if (QuantumAgentManagerJS) {
        // Use the global JS implementation if available
        instance = new QuantumAgentManagerJS({}) as QuantumAgentManagerType;
        
        // Initialize standard agents if method exists
        if (typeof instance.initializeStandardAgents === 'function') {
          instance.initializeStandardAgents();
        }
      } else {
        // Try to dynamically import the JS implementation
        import('./quantum-agent-manager.js').then(module => {
          const ManagerImpl = module.QuantumAgentManager;
          if (ManagerImpl) {
            instance = new ManagerImpl({}) as QuantumAgentManagerType;
            
            // Initialize standard agents if method exists
            if (typeof instance.initializeStandardAgents === 'function') {
              instance.initializeStandardAgents();
            }
          }
        }).catch(error => {
          console.error('Failed to import QuantumAgentManager:', error);
          // Use the stub implementation
          instance = new StubAgentManager();
        });
        
        // While the import is resolving, use the stub implementation
        instance = new StubAgentManager();
      }
    } catch (error) {
      console.error('Error creating QuantumAgentManager instance:', error);
      // Return the stub implementation if there's an error
      instance = new StubAgentManager();
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
    // First check if we can import the real implementation
    const QuantumAgentManagerJS = globalThis.QuantumAgentManager || null;
    
    if (QuantumAgentManagerJS) {
      return new QuantumAgentManagerJS(options) as QuantumAgentManagerType;
    } else {
      // Try to dynamically load the implementation
      let managerInstance: QuantumAgentManagerType = new StubAgentManager(options);
      
      import('./quantum-agent-manager.js').then(module => {
        const ManagerImpl = module.QuantumAgentManager;
        if (ManagerImpl) {
          managerInstance = new ManagerImpl(options) as QuantumAgentManagerType;
        }
      }).catch(error => {
        console.error('Failed to import QuantumAgentManager:', error);
      });
      
      return managerInstance;
    }
  } catch (error) {
    console.error('Error creating new QuantumAgentManager instance:', error);
    // Return stub implementation
    return new StubAgentManager(options);
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