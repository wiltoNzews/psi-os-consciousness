/**
 * WebSocket Handlers for Persistent Context
 * 
 * This module provides WebSocket handlers for real-time persistent context updates,
 * enabling applications to subscribe to memory changes and synchronize context across
 * multiple clients and cognitive layers.
 * 
 * BOUNDARY AWARENESS: This module explicitly defines the boundary between
 * WebSocket messages and persistence operations. It handles the transformation
 * across this boundary in both directions.
 * 
 * BOUNDARY DEFINITION: Messages have different representations depending on context:
 * - From client: JSON-serialized WebSocket messages
 * - In handler: Strongly-typed objects with validation
 * - To persistence layer: Validated data objects conforming to persistence interfaces
 * 
 * RESPONSIBILITY: This module has the single responsibility of handling WebSocket
 * messages related to persistent context. It validates incoming data, transforms it
 * into the correct format, and returns appropriate responses.
 */

// NOTE: context-manager.ts and persistence-layer.ts are intentionally located
// in server/services/ for the current implementation. This is the verified
// working structure. Do not move these files without updating ALL import paths
// throughout the project.

import { WebSocket } from 'ws';
import { persistentContextService } from '../services/persistence-layer.js';
import { CognitiveLayer, MetaEventType } from '../services/context-manager.js';
import { v4 as uuidv4 } from 'uuid';
import { activeConnections } from '../routes.js';
import { ChronosDateHandler } from '../services/utils/chronos-date-handler.js';

// Callback functions to update connected clients
let broadcastPersistentContextUpdate: (type: string, data: any) => void;
let registerPersistentContextHandlers: () => void;

/**
 * Setup the WebSocket handlers for persistent context
 * @param wsHandlers - Map of WebSocket message handlers
 * @param broadcast - Function to broadcast updates to clients
 */
export function setupPersistentContextWebSocketHandlers(
  wsHandlers: Map<string, (payload: any, clientId: string) => Promise<any>>,
  broadcast: (type: string, data: any) => void
) {
  broadcastPersistentContextUpdate = broadcast;
  
  // Handler for subscribing to persistent context updates
  wsHandlers.set('subscribe_persistent_context', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} subscribing to persistent context updates`);
    
    // Store the subscription in client metadata
    const client = activeConnections.get(clientId);
    if (client) {
      client.persistentContextSubscribed = true;
      client.subscribedSessionId = payload?.sessionId;
    }
    
    return { success: true, message: 'Subscribed to persistent context updates' };
  });
  
  // Handler for retrieving persistent context
  wsHandlers.set('get_persistent_context', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} requesting persistent context`);
    
    const { sessionId } = payload || {};
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    
    const context = await persistentContextService.loadContext(sessionId);
    if (!context) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    
    return { context };
  });
  
  // Handler for adding a history chunk
  wsHandlers.set('add_history_chunk', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} adding history chunk`);
    
    const { sessionId, chunk } = payload || {};
    if (!sessionId || !chunk) {
      throw new Error('Session ID and chunk data are required');
    }
    
    // Set the chunk ID if not provided
    if (!chunk.chunkId) {
      chunk.chunkId = `chunk-${uuidv4()}`;
    }
    
    // Set the timestamp if not provided
    if (!chunk.timestamp) {
      chunk.timestamp = ChronosDateHandler.createDate();
    }
    
    await persistentContextService.addHistoryChunk(sessionId, chunk);
    
    // Broadcast the update to all subscribed clients
    broadcast('history_chunk_added', { sessionId, chunk });
    
    return { success: true, chunkId: chunk.chunkId };
  });
  
  // Handler for adding a strategic plan
  wsHandlers.set('add_strategic_plan', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} adding strategic plan`);
    
    const { sessionId, plan } = payload || {};
    if (!sessionId || !plan) {
      throw new Error('Session ID and plan data are required');
    }
    
    // Set the task ID if not provided
    if (!plan.taskId) {
      plan.taskId = `task-${uuidv4()}`;
    }
    
    // Set the created timestamp if not provided
    if (!plan.createdAt) {
      plan.createdAt = ChronosDateHandler.createDate();
    }
    
    await persistentContextService.addStrategicPlan(sessionId, plan);
    
    // Broadcast the update to all subscribed clients
    broadcast('strategic_plan_added', { sessionId, plan });
    
    return { success: true, taskId: plan.taskId };
  });
  
  // Handler for adding a meta-cognitive insight
  wsHandlers.set('add_meta_insight', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} adding meta-cognitive insight`);
    
    const { sessionId, insight } = payload || {};
    if (!sessionId || !insight) {
      throw new Error('Session ID and insight data are required');
    }
    
    // Set the timestamp if not provided
    if (!insight.timestamp) {
      insight.timestamp = ChronosDateHandler.createDate();
    }
    
    await persistentContextService.addMetaInsight(sessionId, insight);
    
    // Broadcast the update to all subscribed clients
    broadcast('meta_insight_added', { sessionId, insight });
    
    return { success: true };
  });
  
  // Handler for retrieving recent history chunks
  wsHandlers.set('get_recent_history', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} requesting recent history`);
    
    const { sessionId, layer, limit } = payload || {};
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    
    const cognitiveLayer = layer || CognitiveLayer.STRATEGIC;
    const limitValue = limit || 10;
    
    const history = await persistentContextService.getRecentHistory(
      sessionId,
      cognitiveLayer as CognitiveLayer,
      limitValue
    );
    
    return { history };
  });
  
  // Handler for retrieving active strategic plans
  wsHandlers.set('get_active_plans', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} requesting active strategic plans`);
    
    const { sessionId } = payload || {};
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    
    const plans = await persistentContextService.getActiveStrategicPlans(sessionId);
    
    return { plans };
  });
  
  // Handler for retrieving meta-cognitive insights
  wsHandlers.set('get_meta_insights', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} requesting meta-cognitive insights`);
    
    const { sessionId, eventType, minImportance } = payload || {};
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    
    const insights = await persistentContextService.getInsightsByType(
      sessionId,
      eventType as MetaEventType,
      minImportance || 0
    );
    
    return { insights };
  });
  
  console.log('Persistent context WebSocket handlers registered');
}

/**
 * Broadcast a persistent context update to all subscribed clients
 * @param type - Update type
 * @param data - Update data
 */
export function broadcastPersistentContextUpdateEvent(type: string, data: any) {
  if (broadcastPersistentContextUpdate) {
    broadcastPersistentContextUpdate(type, data);
  } else {
    console.error('broadcastPersistentContextUpdate not initialized');
  }
}