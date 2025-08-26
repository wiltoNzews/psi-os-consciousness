/**
 * Murphy Protocol WebSocket Handler
 * 
 * Connects the Murphy Protocol resilience system to WebSocket clients
 * Allowing real-time monitoring and control of system resilience
 */

import { WebSocketServer } from 'ws';
import murphyProtocol from './murphy-protocol.js';

/**
 * Initialize Murphy Protocol WebSocket handlers
 */
export function initializeMurphyProtocolHandlers(wss) {
  // Add event listeners for Murphy Protocol events
  murphyProtocol.on('stateChange', (data) => {
    broadcastToAll(wss, 'murphyStateChange', data);
  });
  
  murphyProtocol.on('recoveryStarted', (data) => {
    broadcastToAll(wss, 'murphyRecoveryStarted', data);
  });
  
  murphyProtocol.on('recoveryCompleted', (data) => {
    broadcastToAll(wss, 'murphyRecoveryCompleted', data);
  });
  
  murphyProtocol.on('nuclearRecoveryStarted', (data) => {
    broadcastToAll(wss, 'murphyNuclearRecoveryStarted', data);
  });
  
  murphyProtocol.on('nuclearRecoveryCompleted', (data) => {
    broadcastToAll(wss, 'murphyNuclearRecoveryCompleted', data);
  });
  
  murphyProtocol.on('chaosTestStarted', (data) => {
    broadcastToAll(wss, 'murphyChaosTestStarted', data);
  });
  
  console.log('[MURPHY_PROTOCOL] WebSocket handlers initialized');
}

/**
 * Handle incoming Murphy Protocol related messages
 */
export function handleMurphyProtocolMessage(wss, ws, message) {
  const { type, payload } = message;
  
  switch (type) {
    case 'murphyGetStatus':
      // Return current status
      sendToClient(ws, 'murphyStatus', murphyProtocol.getSystemStatus());
      break;
      
    case 'murphyRunChaosTest':
      // Run a chaos test with specified severity
      console.log(`[MURPHY_PROTOCOL] Manual chaos test requested: ${payload.severity}`);
      let statusResponse = { success: true, message: `Chaos test initiated with ${payload.severity} severity` };
      
      try {
        // Different behavior based on severity
        switch (payload.severity) {
          case 'warning':
            murphyProtocol.updateMetrics({
              stabilityRatio: 0.64, // Just below warning threshold
              coherenceIndex: 0.9
            });
            break;
            
          case 'critical':
            murphyProtocol.updateMetrics({
              stabilityRatio: 0.60, // Critical level
              coherenceIndex: 0.7
            });
            break;
            
          case 'nuclear':
            murphyProtocol.updateMetrics({
              stabilityRatio: 0.45, // Nuclear level
              explorationRatio: 0.55,
              coherenceIndex: 0.3
            });
            break;
            
          default:
            statusResponse = { success: false, message: 'Invalid severity level' };
        }
        
        // Broadcast updated status to all clients
        broadcastToAll(wss, 'murphyStatus', murphyProtocol.getSystemStatus());
      } catch (err) {
        statusResponse = { success: false, message: err.message };
      }
      
      // Send response to the client
      sendToClient(ws, 'murphyChaosTestResponse', statusResponse);
      break;
      
    case 'murphyForceRecover':
      // Manually trigger recovery process
      console.log('[MURPHY_PROTOCOL] Manual recovery process initiated');
      
      let recoveryResponse = { success: true, message: 'Recovery process initiated' };
      
      try {
        if (payload.nuclear) {
          murphyProtocol.initiateNuclearRecovery();
        } else {
          murphyProtocol.initiateCriticalRecovery();
        }
      } catch (err) {
        recoveryResponse = { success: false, message: err.message };
      }
      
      // Send response to the client
      sendToClient(ws, 'murphyRecoveryResponse', recoveryResponse);
      break;
      
    default:
      console.log(`[MURPHY_PROTOCOL] Unknown message type: ${type}`);
  }
}

/**
 * Send a message to a specific client
 */
function sendToClient(ws, type, payload) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  }
}

/**
 * Broadcast a message to all connected clients
 */
function broadcastToAll(wss, type, payload) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type, payload }));
    }
  });
}