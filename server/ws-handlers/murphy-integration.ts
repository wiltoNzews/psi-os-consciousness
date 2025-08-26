/**
 * Murphy Protocol WebSocket integration
 * 
 * Integrates the Murphy Protocol resilience system with the WebSocket handlers
 * to enable real-time monitoring and control of system resilience
 */

import { WebSocketServer } from 'ws';
import { initializeMurphyProtocolHandlers } from '../services/murphy/murphy-handler.js';
import { WebSocketMessageHandler } from '../types/websocket-types.js';

/**
 * Register Murphy Protocol WebSocket handlers with the main WebSocket system
 * 
 * @param wss - WebSocket server instance
 * @param wsHandlers - Map of WebSocket message handlers
 */
export function registerMurphyProtocolHandlers(
  wss: WebSocketServer,
  wsHandlers: Map<string, WebSocketMessageHandler>
): void {
  console.log('[MURPHY_PROTOCOL] Registering Murphy Protocol WebSocket handlers');
  
  // Initialize Murphy Protocol handlers and get the handler function
  const { handleMurphyMessage } = initializeMurphyProtocolHandlers(wss);
  
  // Register Murphy status request handler
  wsHandlers.set('murphy_status_request', async (payload: any, clientId: string) => {
    // Forward to dedicated handler
    handleMurphyMessage('murphy_status_request', payload, { clientId });
    return { received: true }; // Immediate acknowledgment, actual response comes via broadcast
  });
  
  // Register handler for manual chaos tests
  wsHandlers.set('murphy_trigger_chaos_test', async (payload: any, clientId: string) => {
    console.log(`[MURPHY_PROTOCOL] Client ${clientId} triggered a chaos test: ${payload.level}`);
    
    // Validate test level
    if (!payload.level || !['warning', 'critical', 'nuclear'].includes(payload.level)) {
      return {
        success: false,
        error: 'Invalid test level. Must be one of: warning, critical, nuclear'
      };
    }
    
    // Forward to dedicated handler
    handleMurphyMessage('murphy_trigger_chaos_test', payload, { clientId });
    
    return {
      success: true,
      message: `Murphy Protocol chaos test initiated at level: ${payload.level}`,
      timestamp: Date.now()
    };
  });
  
  // Add subscription handler for Murphy Protocol events
  wsHandlers.set('subscribe_murphy_protocol', async (payload: any, clientId: string) => {
    console.log(`[MURPHY_PROTOCOL] Client ${clientId} subscribing to Murphy Protocol events`);
    
    // No special handling needed as all WebSocket clients get broadcasts
    return { 
      success: true, 
      message: 'Subscribed to Murphy Protocol events',
      protocol: 'murphy'
    };
  });
  
  console.log('[MURPHY_PROTOCOL] Murphy Protocol WebSocket handlers registered');
}