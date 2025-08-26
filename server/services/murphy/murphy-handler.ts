/**
 * Murphy Protocol WebSocket Handler
 * 
 * Connects the Murphy Protocol resilience system to WebSocket clients
 * Allowing real-time monitoring and control of system resilience
 */

import { WebSocketServer } from 'ws';
import murphyProtocol from './murphy-protocol.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Initialize Murphy Protocol WebSocket handlers
 */
export function initializeMurphyProtocolHandlers(wss: WebSocketServer) {
  console.log('[MURPHY_HANDLER] Initializing Murphy Protocol handlers');
  
  // Set up events from Murphy Protocol to broadcast to clients
  murphyProtocol.on('stateChange', (data: any) => {
    broadcastToAll(wss, 'murphy_state_change', data);
  });
  
  murphyProtocol.on('recoveryStarted', (data: any) => {
    broadcastToAll(wss, 'murphy_recovery_event', {
      timestamp: new Date().toISOString(),
      ...data,
      successful: null,
      recoveryTimeMs: 0
    });
  });
  
  murphyProtocol.on('recoveryCompleted', (data: any) => {
    broadcastToAll(wss, 'murphy_recovery_event', {
      timestamp: new Date().toISOString(),
      ...data
    });
  });
  
  murphyProtocol.on('nuclearRecoveryStarted', (data: any) => {
    broadcastToAll(wss, 'murphy_nuclear_event', {
      timestamp: new Date().toISOString(),
      status: 'started',
      ...data
    });
  });
  
  murphyProtocol.on('nuclearRecoveryCompleted', (data: any) => {
    broadcastToAll(wss, 'murphy_nuclear_event', {
      timestamp: new Date().toISOString(),
      status: 'completed',
      ...data
    });
  });
  
  murphyProtocol.on('chaosTestStarted', (data: any) => {
    broadcastToAll(wss, 'murphy_chaos_test', {
      timestamp: new Date().toISOString(),
      status: 'started',
      ...data
    });
  });
  
  // Set up routine status broadcasts
  setInterval(() => {
    const systemStatus = murphyProtocol.getSystemStatus();
    broadcastToAll(wss, 'murphy_status_update', systemStatus);
  }, 5000);
  
  return {
    /**
     * Handle incoming Murphy Protocol related messages
     */
    handleMurphyMessage: (messageType: string, payload: any, ws: any) => {
      switch (messageType) {
        case 'murphy_status_request':
          // Send system status to requesting client
          const systemStatus = murphyProtocol.getSystemStatus();
          sendToClient(ws, 'murphy_status_update', {
            requestId: payload.requestId,
            ...systemStatus
          });
          break;
          
        case 'murphy_trigger_chaos_test':
          // Manually trigger a chaos test
          console.log(`[MURPHY_HANDLER] Manual chaos test triggered: ${payload.level}`);
          
          const testId = uuidv4();
          sendToClient(ws, 'murphy_chaos_test_response', {
            testId,
            timestamp: new Date().toISOString(),
            status: 'started',
            level: payload.level
          });
          
          // Execute different tests based on requested level
          if (payload.level === 'warning') {
            murphyProtocol.updateMetrics({
              stabilityRatio: 0.69, // Just outside optimal range
              coherenceIndex: 0.9
            });
          } else if (payload.level === 'critical') {
            murphyProtocol.updateMetrics({
              stabilityRatio: 0.64, // Below min threshold
              coherenceIndex: 0.7
            });
          } else if (payload.level === 'nuclear') {
            murphyProtocol.updateMetrics({
              stabilityRatio: 0.45, // Nuclear threshold violation
              explorationRatio: 0.55,
              coherenceIndex: 0.3
            });
          }
          
          break;
          
        default:
          // Unknown murphy message type
          console.log(`[MURPHY_HANDLER] Unknown murphy message type: ${messageType}`);
      }
    }
  };
}

/**
 * Send a message to a specific client
 */
function sendToClient(ws: any, type: string, payload: any) {
  if (ws.readyState === 1) { // OPEN
    try {
      ws.send(JSON.stringify({
        type,
        payload
      }));
    } catch (error) {
      console.error('[MURPHY_HANDLER] Error sending message to client:', error);
    }
  }
}

/**
 * Broadcast a message to all connected clients
 */
function broadcastToAll(wss: WebSocketServer, type: string, payload: any) {
  wss.clients.forEach((client: any) => {
    if (client.readyState === 1) { // OPEN
      try {
        client.send(JSON.stringify({
          type,
          payload
        }));
      } catch (error) {
        console.error('[MURPHY_HANDLER] Error broadcasting message:', error);
      }
    }
  });
}