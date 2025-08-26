/**
 * Agent Interface
 * 
 * Defines the standard interface that all Oroboro agent modules must implement.
 * This creates clean module boundaries and ensures consistent API across all agents.
 * 
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */

export interface AgentContext {
  sessionId: string;
  userId?: string;
  coherenceLevel: number;
  flowLevel: number;
  simulationMode: boolean;
  requestId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentRequest {
  type: string;
  context: AgentContext;
  payload: any;
}

export interface AgentResponse {
  success: boolean;
  context: AgentContext;
  payload: any;
  errors?: Array<{
    code: string;
    message: string;
    details?: any;
  }>;
  metadata?: {
    processingTime?: number;
    coherenceContribution?: number;
    agentVersion?: string;
    [key: string]: any;
  };
}

export interface AgentInterface {
  /**
   * The unique identifier for this agent instance
   */
  readonly agentId: string;
  
  /**
   * The agent type (Oracle, Nova, Gnosis, Sanctum, Halo)
   */
  readonly agentType: string;
  
  /**
   * The agent's current version
   */
  readonly version: string;
  
  /**
   * The current coherence level of this agent (0.0 to 1.0)
   */
  readonly coherenceLevel: number;
  
  /**
   * The current flow level of this agent (0-8)
   */
  readonly flowLevel: number;
  
  /**
   * Initialize the agent with the given configuration
   */
  initialize(config: Record<string, any>): Promise<boolean>;
  
  /**
   * Process a request and generate a response
   */
  process(request: AgentRequest): Promise<AgentResponse>;
  
  /**
   * Check if the agent can handle a specific request type
   */
  canHandle(requestType: string): boolean;
  
  /**
   * Get the current status and metrics of the agent
   */
  getStatus(): Promise<{
    status: 'idle' | 'processing' | 'error' | 'offline';
    metrics: Record<string, any>;
    lastActivity: Date;
  }>;
  
  /**
   * Gracefully shutdown the agent
   */
  shutdown(): Promise<void>;
}