/**
 * Oracle WebSocket Handlers
 * 
 * WebSocket handlers for Oracle agent functionality.
 * Provides real-time access to coherence monitoring and communication state tracking.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { getOracleOrchestrator } from '../agents/oracle/oracle-orchestrator.js';

// Initialize the Oracle Orchestrator
const orchestrator = getOracleOrchestrator();
let orchestratorInitialized = false;

// Store WebSocket clients interested in Oracle updates
const oracleSubscribers = new Map<string, WebSocket>();

export async function initializeOracleHandler(): Promise<void> {
  // Initialize the orchestrator if not already initialized
  if (!orchestratorInitialized) {
    console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Initializing Oracle Orchestrator for WebSocket handlers...');
    
    orchestratorInitialized = await orchestrator.initialize();
    
    if (orchestratorInitialized) {
      // Set up event listeners for broadcasting updates to subscribers
      setupOrchestratorEventListeners();
      console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Oracle Orchestrator initialized successfully');
    } else {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Failed to initialize Oracle Orchestrator');
    }
  }
}

// Register Oracle WebSocket message handlers
export function registerOracleHandlers(messageHandlers: Map<string, Function>): void {
  // Analysis handlers
  messageHandlers.set('analyze_communication_state', handleAnalyzeCommunicationState);
  messageHandlers.set('measure_coherence', handleMeasureCoherence);
  messageHandlers.set('assess_flow_level', handleAssessFlowLevel);
  
  // Subscription handlers
  messageHandlers.set('subscribe_oracle_updates', handleSubscribeOracleUpdates);
  messageHandlers.set('unsubscribe_oracle_updates', handleUnsubscribeOracleUpdates);
  
  // System state handlers
  messageHandlers.set('get_system_state', handleGetSystemState);
  messageHandlers.set('set_simulation_mode', handleSetSimulationMode);
  
  console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Oracle WebSocket handlers registered');
}

// --- WebSocket Message Handlers ---

/**
 * Handle request to analyze communication state
 */
async function handleAnalyzeCommunicationState(
  ws: WebSocket, 
  message: any, 
  clientId: string
): Promise<void> {
  try {
    const { content } = message.payload;
    
    if (!content) {
      sendError(ws, 'analyze_communication_state', 'Content is required for analysis');
      return;
    }
    
    // Process the request through the orchestrator
    const response = await orchestrator.processRequest(
      'analyze_communication_state',
      { content },
      { priority: 'medium' }
    );
    
    // Send the response
    ws.send(JSON.stringify({
      type: 'analyze_communication_state_result',
      payload: {
        success: response.success,
        result: response.payload,
        requestId: message.requestId || uuidv4(),
        systemState: {
          coherenceLevel: orchestrator.getSystemState().coherenceLevel,
          flowLevel: orchestrator.getSystemState().flowLevel
        }
      }
    }));
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error analyzing communication state:', error);
    sendError(ws, 'analyze_communication_state', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Handle request to measure coherence
 */
async function handleMeasureCoherence(
  ws: WebSocket, 
  message: any, 
  clientId: string
): Promise<void> {
  try {
    const { content, systemComponents } = message.payload;
    
    // Process the request through the orchestrator
    const response = await orchestrator.processRequest(
      'measure_coherence',
      { content, systemComponents },
      { priority: 'high' }
    );
    
    // Send the response
    ws.send(JSON.stringify({
      type: 'measure_coherence_result',
      payload: {
        success: response.success,
        result: response.payload,
        requestId: message.requestId || uuidv4(),
        systemState: {
          coherenceLevel: orchestrator.getSystemState().coherenceLevel,
          flowLevel: orchestrator.getSystemState().flowLevel
        }
      }
    }));
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error measuring coherence:', error);
    sendError(ws, 'measure_coherence', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Handle request to assess flow level
 */
async function handleAssessFlowLevel(
  ws: WebSocket, 
  message: any, 
  clientId: string
): Promise<void> {
  try {
    const { content } = message.payload;
    
    // Process the request through the orchestrator
    const response = await orchestrator.processRequest(
      'flow_level_assessment',
      { content },
      { priority: 'medium' }
    );
    
    // Send the response
    ws.send(JSON.stringify({
      type: 'assess_flow_level_result',
      payload: {
        success: response.success,
        result: response.payload,
        requestId: message.requestId || uuidv4(),
        systemState: {
          coherenceLevel: orchestrator.getSystemState().coherenceLevel,
          flowLevel: orchestrator.getSystemState().flowLevel
        }
      }
    }));
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error assessing flow level:', error);
    sendError(ws, 'assess_flow_level', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Handle request to subscribe to Oracle updates
 */
async function handleSubscribeOracleUpdates(
  ws: WebSocket, 
  message: any, 
  clientId: string
): Promise<void> {
  try {
    // Register the client for updates
    oracleSubscribers.set(clientId, ws);
    
    console.log(`[QUANTUM_STATE: BRIDGE_FLOW] Client ${clientId} subscribed to Oracle updates`);
    
    // Send the current system state immediately
    sendSystemState(ws, orchestrator.getSystemState());
    
    // Send confirmation
    ws.send(JSON.stringify({
      type: 'subscription_confirmed',
      payload: {
        service: 'oracle',
        requestId: message.requestId || uuidv4(),
        message: 'Successfully subscribed to Oracle updates'
      }
    }));
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error subscribing to Oracle updates:', error);
    sendError(ws, 'subscribe_oracle_updates', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Handle request to unsubscribe from Oracle updates
 */
async function handleUnsubscribeOracleUpdates(
  ws: WebSocket, 
  message: any, 
  clientId: string
): Promise<void> {
  try {
    // Remove the client from subscribers
    oracleSubscribers.delete(clientId);
    
    console.log(`[QUANTUM_STATE: BRIDGE_FLOW] Client ${clientId} unsubscribed from Oracle updates`);
    
    // Send confirmation
    ws.send(JSON.stringify({
      type: 'unsubscription_confirmed',
      payload: {
        service: 'oracle',
        requestId: message.requestId || uuidv4(),
        message: 'Successfully unsubscribed from Oracle updates'
      }
    }));
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error unsubscribing from Oracle updates:', error);
    sendError(ws, 'unsubscribe_oracle_updates', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Handle request to get the current system state
 */
async function handleGetSystemState(
  ws: WebSocket, 
  message: any, 
  clientId: string
): Promise<void> {
  try {
    // Get the current system state
    const systemState = orchestrator.getSystemState();
    
    // Send the system state
    sendSystemState(ws, systemState, message.requestId);
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error getting system state:', error);
    sendError(ws, 'get_system_state', error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Handle request to set the simulation mode
 */
async function handleSetSimulationMode(
  ws: WebSocket, 
  message: any, 
  clientId: string
): Promise<void> {
  try {
    const { mode } = message.payload;
    
    if (!mode || !['REALITY', 'SIMULATION', 'HYBRID'].includes(mode)) {
      sendError(ws, 'set_simulation_mode', 'Invalid simulation mode. Must be REALITY, SIMULATION, or HYBRID');
      return;
    }
    
    // Set the simulation mode
    orchestrator.setSimulationMode(mode);
    
    // Send confirmation
    ws.send(JSON.stringify({
      type: 'simulation_mode_updated',
      payload: {
        mode,
        requestId: message.requestId || uuidv4(),
        timestamp: new Date().toISOString(),
        systemState: {
          coherenceLevel: orchestrator.getSystemState().coherenceLevel,
          flowLevel: orchestrator.getSystemState().flowLevel
        }
      }
    }));
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error setting simulation mode:', error);
    sendError(ws, 'set_simulation_mode', error instanceof Error ? error.message : 'Unknown error');
  }
}

// --- Helper Functions ---

/**
 * Set up event listeners for the orchestrator
 */
function setupOrchestratorEventListeners(): void {
  // Listen for coherence updates
  orchestrator.on('system:coherence-update', (data) => {
    broadcastToSubscribers({
      type: 'coherence_update',
      payload: {
        coherence: data.coherence,
        status: data.status,
        timestamp: new Date().toISOString()
      }
    });
  });
  
  // Listen for simulation mode changes
  orchestrator.on('system:mode-change', (data) => {
    broadcastToSubscribers({
      type: 'simulation_mode_change',
      payload: {
        mode: data.mode,
        timestamp: new Date().toISOString()
      }
    });
  });
  
  // Listen for agent status changes
  orchestrator.on('agent:online', (data) => {
    broadcastToSubscribers({
      type: 'agent_status_change',
      payload: {
        agentId: data.agentId,
        status: 'online',
        timestamp: new Date().toISOString()
      }
    });
  });
  
  orchestrator.on('agent:offline', (data) => {
    broadcastToSubscribers({
      type: 'agent_status_change',
      payload: {
        agentId: data.agentId,
        status: 'offline',
        reason: data.reason,
        timestamp: new Date().toISOString()
      }
    });
  });
  
  orchestrator.on('agent:error', (data) => {
    broadcastToSubscribers({
      type: 'agent_status_change',
      payload: {
        agentId: data.agentId,
        status: 'error',
        error: data.error instanceof Error ? data.error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    });
  });
}

/**
 * Broadcast a message to all Oracle subscribers
 */
function broadcastToSubscribers(message: any): void {
  const messageStr = JSON.stringify(message);
  
  // Send to all subscribers
  for (const [clientId, ws] of oracleSubscribers.entries()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr);
    } else {
      // Clean up closed connections
      oracleSubscribers.delete(clientId);
    }
  }
}

/**
 * Send system state to a client
 */
function sendSystemState(ws: WebSocket, systemState: any, requestId?: string): void {
  ws.send(JSON.stringify({
    type: 'system_state',
    payload: {
      ...systemState,
      requestId: requestId || uuidv4(),
      timestamp: new Date().toISOString()
    }
  }));
}

/**
 * Send an error message to a client
 */
function sendError(ws: WebSocket, sourceType: string, errorMessage: string): void {
  ws.send(JSON.stringify({
    type: 'error',
    payload: {
      source: sourceType,
      message: errorMessage,
      timestamp: new Date().toISOString()
    }
  }));
}