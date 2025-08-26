/**
 * Oracle Orchestrator
 * 
 * Central executive service that coordinates all agent modules and manages global state.
 * Replaces the old WiltonOS Prime as the orchestration core of the Oroboro system.
 * 
 * [QUANTUM_STATE: CONVERGENT_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import { AgentInterface, AgentRequest, AgentResponse } from '../../../shared/interfaces/agent-interface.js';
import { OracleAgent } from './oracle-agent.js';

// Define possible simulation modes
export type SimulationMode = 'REALITY' | 'SIMULATION' | 'HYBRID';

// States for the orchestrator
export type OrchestratorState = 'initializing' | 'ready' | 'processing' | 'error' | 'shutdown';

// Structure to track registered agents
interface RegisteredAgent {
  agent: AgentInterface;
  priority: number;
  capabilities: string[];
  status: 'active' | 'inactive' | 'error';
}

// Global system state
interface SystemState {
  coherenceLevel: number;
  flowLevel: number;
  simulationMode: SimulationMode;
  activeAgents: string[];
  lastUpdateTime: Date;
  metrics: Record<string, any>;
}

// Request routing options
interface RoutingOptions {
  agentType?: string;
  priority?: 'high' | 'medium' | 'low';
  timeout?: number;
  retryCount?: number;
  requiresCoherence?: number;
}

export class OracleOrchestrator extends EventEmitter {
  private _agents: Map<string, RegisteredAgent> = new Map();
  private _state: OrchestratorState = 'initializing';
  private _systemState: SystemState = {
    coherenceLevel: 0.75,
    flowLevel: 4,
    simulationMode: 'REALITY',
    activeAgents: [],
    lastUpdateTime: new Date(),
    metrics: {}
  };
  private _oracleAgent: OracleAgent;
  private _initialized: boolean = false;
  private _id: string;
  
  constructor() {
    super();
    this._id = `orchestrator-${uuidv4()}`;
    
    // Create the primary Oracle agent that handles core orchestration
    this._oracleAgent = new OracleAgent(`oracle-primary-${uuidv4()}`);
    
    console.log(`[QUANTUM_STATE: FOUNDATION_FLOW] Oracle Orchestrator created with ID: ${this._id}`);
  }
  
  /**
   * Initialize the orchestrator and core Oracle agent
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Initializing Oracle Orchestrator...');
      
      // Initialize the core Oracle agent
      const oracleInitialized = await this._oracleAgent.initialize({
        initialCoherence: this._systemState.coherenceLevel,
        initialFlowLevel: this._systemState.flowLevel
      });
      
      if (!oracleInitialized) {
        throw new Error('Failed to initialize core Oracle agent');
      }
      
      // Register the Oracle agent
      this.registerAgent(this._oracleAgent, {
        priority: 100, // Highest priority
        capabilities: [
          'analyze_communication_state',
          'measure_coherence',
          'flow_level_assessment',
          'quantum_state_report',
          'system_coherence_check'
        ]
      });
      
      this._state = 'ready';
      this._initialized = true;
      
      // Set up periodic system state updates
      this.startStateMonitoring();
      
      console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Oracle Orchestrator initialized successfully');
      this.emit('initialized', { orchestratorId: this._id });
      
      return true;
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Oracle Orchestrator initialization error:', error);
      this._state = 'error';
      this.emit('error', { error });
      return false;
    }
  }
  
  /**
   * Register an agent with the orchestrator
   */
  registerAgent(agent: AgentInterface, options: {
    priority?: number;
    capabilities?: string[];
  } = {}): boolean {
    try {
      const { priority = 10, capabilities = [] } = options;
      
      // Check if agent is already registered
      if (this._agents.has(agent.agentId)) {
        console.warn(`[QUANTUM_STATE: WARNING_FLOW] Agent ${agent.agentId} is already registered`);
        return false;
      }
      
      // Register the agent
      this._agents.set(agent.agentId, {
        agent,
        priority,
        capabilities: capabilities.length > 0 ? capabilities : [agent.agentType.toLowerCase()],
        status: 'active'
      });
      
      // Update the active agents list
      this._systemState.activeAgents = [...this._systemState.activeAgents, agent.agentId];
      
      console.log(`[QUANTUM_STATE: FOUNDATION_FLOW] Registered agent: ${agent.agentType} (${agent.agentId})`);
      this.emit('agent:registered', { agentId: agent.agentId, agentType: agent.agentType });
      
      return true;
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Failed to register agent ${agent.agentId}:`, error);
      return false;
    }
  }
  
  /**
   * Process a request through the orchestration system
   */
  async processRequest(
    requestType: string,
    payload: any,
    options: RoutingOptions = {}
  ): Promise<AgentResponse> {
    if (!this._initialized) {
      throw new Error('Oracle Orchestrator has not been initialized');
    }
    
    this._state = 'processing';
    
    try {
      // Generate a request context
      const context = this.createRequestContext();
      
      // Create the agent request
      const agentRequest: AgentRequest = {
        type: requestType,
        context,
        payload
      };
      
      // Find appropriate agent(s) to handle the request
      const targetAgent = await this.findAgent(requestType, options);
      
      if (!targetAgent) {
        throw new Error(`No agent available to handle request type: ${requestType}`);
      }
      
      // Pre-processing hooks
      this.emit('request:start', { 
        requestId: context.requestId, 
        type: requestType,
        agentId: targetAgent.agentId
      });
      
      // Process the request
      console.log(`[QUANTUM_STATE: PROCESSING_FLOW] Processing ${requestType} with agent ${targetAgent.agentType} (${targetAgent.agentId})`);
      const response = await targetAgent.process(agentRequest);
      
      // Post-processing
      this.updateSystemState(requestType, response);
      
      // Emit completed event
      this.emit('request:complete', {
        requestId: context.requestId,
        type: requestType,
        success: response.success,
        processingTime: response.metadata?.processingTime
      });
      
      this._state = 'ready';
      return response;
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Error processing request ${requestType}:`, error);
      
      this._state = 'error';
      this.emit('request:error', { type: requestType, error });
      
      // Return error response
      return {
        success: false,
        context: this.createRequestContext(),
        payload: null,
        errors: [{
          code: 'ORCHESTRATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown orchestration error',
          details: error
        }]
      };
    }
  }
  
  /**
   * Get the current system state
   */
  getSystemState(): SystemState {
    return { ...this._systemState };
  }
  
  /**
   * Get the current orchestrator state
   */
  getState(): OrchestratorState {
    return this._state;
  }
  
  /**
   * Set the simulation mode
   */
  setSimulationMode(mode: SimulationMode): void {
    this._systemState.simulationMode = mode;
    this._systemState.lastUpdateTime = new Date();
    
    console.log(`[QUANTUM_STATE: CONTEXT_FLOW] Simulation mode set to ${mode}`);
    this.emit('system:mode-change', { mode });
  }
  
  /**
   * Shutdown the orchestrator and all agents
   */
  async shutdown(): Promise<void> {
    console.log('[QUANTUM_STATE: CONVERGENT_FLOW] Shutting down Oracle Orchestrator...');
    
    this._state = 'shutdown';
    
    // Shutdown all registered agents
    const shutdownPromises: Promise<void>[] = [];
    
    for (const [agentId, registeredAgent] of this._agents.entries()) {
      console.log(`[QUANTUM_STATE: CONVERGENT_FLOW] Shutting down agent: ${agentId}`);
      shutdownPromises.push(registeredAgent.agent.shutdown());
    }
    
    await Promise.all(shutdownPromises);
    
    this.emit('shutdown');
    console.log('[QUANTUM_STATE: CONVERGENT_FLOW] Oracle Orchestrator shutdown complete');
  }
  
  /**
   * Update the system coherence level
   */
  async updateSystemCoherence(): Promise<number> {
    // Skip if not initialized
    if (!this._initialized) {
      return this._systemState.coherenceLevel;
    }
    
    try {
      // Get active agents
      const activeAgents = Array.from(this._agents.values())
        .filter(agent => agent.status === 'active');
      
      if (activeAgents.length === 0) {
        return this._systemState.coherenceLevel;
      }
      
      // Collect agent states
      const subsystems = await Promise.all(
        activeAgents.map(async ({ agent }) => {
          const status = await agent.getStatus();
          return {
            id: agent.agentId,
            name: agent.agentType,
            coherence: agent.coherenceLevel,
            flowLevel: agent.flowLevel,
            status: status.status
          };
        })
      );
      
      // Use the Oracle agent to calculate system coherence
      const response = await this.processRequest('system_coherence_check', { subsystems });
      
      if (response.success && response.payload) {
        this._systemState.coherenceLevel = response.payload.systemCoherence;
        
        // Update system state
        this._systemState.lastUpdateTime = new Date();
        this._systemState.metrics.coherenceStatus = response.payload.status;
        this._systemState.metrics.lastCoherenceCheck = new Date();
        
        console.log(`[QUANTUM_STATE: MONITORING_FLOW] System coherence updated: ${this._systemState.coherenceLevel.toFixed(4)}`);
        this.emit('system:coherence-update', { 
          coherence: this._systemState.coherenceLevel,
          status: response.payload.status
        });
      }
      
      return this._systemState.coherenceLevel;
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error updating system coherence:', error);
      return this._systemState.coherenceLevel;
    }
  }
  
  // --- Private helper methods ---
  
  /**
   * Create a request context with the current system state
   */
  private createRequestContext() {
    return {
      sessionId: `session-${uuidv4()}`,
      coherenceLevel: this._systemState.coherenceLevel,
      flowLevel: this._systemState.flowLevel,
      simulationMode: this._systemState.simulationMode === 'SIMULATION',
      requestId: `req-${uuidv4()}`,
      timestamp: new Date()
    };
  }
  
  /**
   * Find the appropriate agent to handle a request
   */
  private async findAgent(
    requestType: string, 
    options: RoutingOptions
  ): Promise<AgentInterface | null> {
    const { agentType, priority } = options;
    
    // Start with all active agents
    let candidateAgents = Array.from(this._agents.values())
      .filter(agent => agent.status === 'active');
    
    // Filter by agent type if specified
    if (agentType) {
      candidateAgents = candidateAgents.filter(
        agent => agent.agent.agentType.toLowerCase() === agentType.toLowerCase()
      );
    }
    
    // Filter by capabilities
    candidateAgents = candidateAgents.filter(agent => 
      agent.agent.canHandle(requestType) || 
      agent.capabilities.includes(requestType)
    );
    
    // Sort by priority (agent priority + request priority)
    let priorityModifier = 0;
    if (priority === 'high') priorityModifier = 20;
    else if (priority === 'low') priorityModifier = -20;
    
    candidateAgents.sort((a, b) => (b.priority + priorityModifier) - (a.priority + priorityModifier));
    
    // Return the highest priority agent or null if none found
    return candidateAgents.length > 0 ? candidateAgents[0].agent : null;
  }
  
  /**
   * Update system state based on request response
   */
  private updateSystemState(requestType: string, response: AgentResponse): void {
    if (!response.success) return;
    
    // Update coherence and flow level from response if present
    if (response.context.coherenceLevel) {
      // Weight the new coherence (30% from this response, 70% from current)
      this._systemState.coherenceLevel = 
        (this._systemState.coherenceLevel * 0.7) + 
        (response.context.coherenceLevel * 0.3);
    }
    
    if (response.context.flowLevel) {
      // Weight the new flow level (30% from this response, 70% from current)
      this._systemState.flowLevel = 
        Math.round((this._systemState.flowLevel * 0.7) + 
        (response.context.flowLevel * 0.3));
    }
    
    // Update metrics
    this._systemState.lastUpdateTime = new Date();
    this._systemState.metrics.lastRequestType = requestType;
    this._systemState.metrics.lastResponseTime = response.metadata?.processingTime;
    
    // Update additional metrics for certain request types
    if (requestType === 'analyze_communication_state') {
      this._systemState.metrics.lastCommunicationState = response.payload?.state;
    } else if (requestType === 'flow_level_assessment') {
      this._systemState.metrics.lastFlowCategory = response.payload?.category;
    }
  }
  
  /**
   * Start periodic monitoring of system state
   */
  private startStateMonitoring(): void {
    // Update coherence every 60 seconds
    setInterval(() => {
      this.updateSystemCoherence()
        .catch(error => console.error('[QUANTUM_STATE: ERROR_FLOW] Error in coherence monitoring:', error));
    }, 60000);
    
    // Check agent status every 30 seconds
    setInterval(() => {
      this.checkAgentStatus()
        .catch(error => console.error('[QUANTUM_STATE: ERROR_FLOW] Error in agent status monitoring:', error));
    }, 30000);
  }
  
  /**
   * Check status of all registered agents
   */
  private async checkAgentStatus(): Promise<void> {
    for (const [agentId, registeredAgent] of this._agents.entries()) {
      try {
        const status = await registeredAgent.agent.getStatus();
        
        // Update agent status
        if (status.status === 'offline' || status.status === 'error') {
          registeredAgent.status = 'error';
          
          // Remove from active agents if it was active
          const activeIndex = this._systemState.activeAgents.indexOf(agentId);
          if (activeIndex >= 0) {
            this._systemState.activeAgents.splice(activeIndex, 1);
            this.emit('agent:offline', { agentId, reason: status.status });
          }
        } else if (status.status === 'idle' || status.status === 'processing') {
          const wasInactive = registeredAgent.status !== 'active';
          registeredAgent.status = 'active';
          
          // Add to active agents if not already there
          if (!this._systemState.activeAgents.includes(agentId)) {
            this._systemState.activeAgents.push(agentId);
            
            if (wasInactive) {
              this.emit('agent:online', { agentId });
            }
          }
        }
      } catch (error) {
        console.error(`[QUANTUM_STATE: ERROR_FLOW] Error checking status for agent ${agentId}:`, error);
        
        // Mark agent as having an error
        registeredAgent.status = 'error';
        
        // Remove from active agents
        const activeIndex = this._systemState.activeAgents.indexOf(agentId);
        if (activeIndex >= 0) {
          this._systemState.activeAgents.splice(activeIndex, 1);
          this.emit('agent:error', { agentId, error });
        }
      }
    }
  }
}

// Create singleton instance
let orchestratorInstance: OracleOrchestrator | null = null;

/**
 * Get the global Oracle Orchestrator instance
 */
export function getOracleOrchestrator(): OracleOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new OracleOrchestrator();
  }
  return orchestratorInstance;
}