/**
 * Murphy Protocol WebSocket integration
 * 
 * Integrates the Murphy Protocol resilience system with the WebSocket handlers
 * to enable real-time monitoring and control of system resilience
 */

import { WebSocketServer } from 'ws';
import { initializeMurphyProtocolHandlers, handleMurphyProtocolMessage } from '../services/murphy/murphy-handler.js';

/**
 * Register Murphy Protocol WebSocket handlers with the main WebSocket system
 * 
 * @param wss - WebSocket server instance
 * @param wsHandlers - Map of WebSocket message handlers
 */
export function registerMurphyProtocolHandlers(
  wss,
  wsHandlers
) {
  // Register message handlers
  const murphyMessageTypes = [
    'murphyGetStatus',
    'murphyRunChaosTest',
    'murphyForceRecover'
  ];
  
  // Add message handlers to the wsHandlers map
  murphyMessageTypes.forEach(type => {
    wsHandlers.set(type, (payload, clientId, ws) => {
      return handleMurphyProtocolMessage(wss, ws, { type, payload });
    });
  });
  
  // Register event listeners
  initializeMurphyProtocolHandlers(wss);
  
  console.log('[MURPHY_PROTOCOL] WebSocket integration complete');
}