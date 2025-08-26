/**
 * TypeScript type definitions for Quantum Agent Manager
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

export interface AgentMessage {
  type: string;
  data: Record<string, unknown>;
  metadata?: {
    timestamp?: Date;
    source?: string;
    priority?: number;
    correlationId?: string;
    [key: string]: unknown;
  };
}

export interface AgentInterface {
  id: string;
  name: string;
  symbol?: string;
  purpose?: string;
  processMessage: (message: AgentMessage) => any;
  getStatus: () => string;
}

export interface AgentMetrics {
  messagesProcessed: number;
  successRate: number;
  averageProcessingTime: number;
  totalProcessingTime: number;
  [key: string]: unknown;
}

export interface AgentRegistry {
  [id: string]: {
    id: string;
    name: string;
    symbol: string;
    purpose: string;
    processMessage: (message: AgentMessage) => any;
    getStatus: () => string;
    registeredAt: Date;
    metrics: AgentMetrics;
  };
}

export interface MessageHistoryEntry {
  id: string;
  timestamp: Date;
  agentId: string;
  messageType: string;
  status: 'pending' | 'success' | 'error';
  processingTime: number;
  message: AgentMessage;
  response?: any;
  error?: string;
}

export interface ProcessingState {
  id: string;
  chunkId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  strategy: string;
  steps: Array<any>;
  result: any;
  status: 'in_progress' | 'completed' | 'error';
  options: Record<string, any>;
  error?: string;
}

export interface QuantumAgentManager {
  agents: AgentRegistry;
  messageHistory: MessageHistoryEntry[];
  options: {
    maxHistoryEntries: number;
    agentInitialization: 'lazy' | 'eager';
    [key: string]: any;
  };
  communicationBus: Map<string, any>;
  
  // Methods
  initializeStandardAgents: () => string[];
  registerAgent: (agent: AgentInterface) => string;
  sendMessage: (agentId: string, message: AgentMessage) => any;
  getMessageHistory: (agentId?: string, limit?: number) => MessageHistoryEntry[];
  getAgents: () => Record<string, any>;
  getAgentInfo: (agentId: string) => Record<string, any>;
  broadcastMessage: (message: AgentMessage, targetAgentIds: string[]) => Record<string, any>;
  processChunk: (chunk: any, options?: Record<string, any>) => { processingState: ProcessingState; chunk?: any; error?: string };
  deregisterAgent: (agentId: string) => boolean;
  [key: string]: any;
}