/**
 * WebSocket Helper Functions
 * 
 * This file provides shared helper functions and types for WebSocket handlers.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

import WebSocket from 'ws';

// Define WebSocket readyState constants for clarity
export const WS_CONNECTING = 0;
export const WS_OPEN = 1;
export const WS_CLOSING = 2;
export const WS_CLOSED = 3;

// Type definition for WebSocket message handlers
export type WebSocketMessageHandler = (payload: any, clientId: string) => Promise<any>;

// Global WebSocket server reference (will be set from routes.ts)
let globalWss: WebSocket.Server | null = null;
// Map of active connections with client IDs
const activeConnections = new Map<string, WebSocket>();

/**
 * Set the global WebSocket server reference
 */
export function setGlobalWebSocketServer(wss: WebSocket.Server): void {
  globalWss = wss;
}

/**
 * Register a client connection
 */
export function registerClientConnection(clientId: string, ws: WebSocket): void {
  activeConnections.set(clientId, ws);
}

/**
 * Unregister a client connection
 */
export function unregisterClientConnection(clientId: string): void {
  activeConnections.delete(clientId);
}

/**
 * Get all active client connections
 */
export function getActiveConnections(): Map<string, WebSocket> {
  return activeConnections;
}

/**
 * Broadcast a message to all connected clients
 */
export function broadcastToAllClients(type: string, payload: any): void {
  if (!globalWss) {
    console.warn('Cannot broadcast: WebSocket server not initialized');
    return;
  }
  
  globalWss.clients.forEach((client) => {
    if (client.readyState === WS_OPEN) {
      try {
        client.send(JSON.stringify({ type, payload }));
      } catch (error) {
        console.error('Error broadcasting message:', error);
      }
    }
  });
}

/**
 * Send a message to a specific client
 */
export function sendToClient(clientId: string, type: string, payload: any): boolean {
  const client = activeConnections.get(clientId);
  
  if (client && client.readyState === WS_OPEN) {
    try {
      client.send(JSON.stringify({ type, payload }));
      return true;
    } catch (error) {
      console.error(`Error sending message to client ${clientId}:`, error);
      return false;
    }
  }
  
  return false;
}