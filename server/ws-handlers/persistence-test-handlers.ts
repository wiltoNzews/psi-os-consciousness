/**
 * WebSocket Handlers for Persistence Testing
 * 
 * This module provides WebSocket handlers specifically for the persistence testing interface.
 * It enables comprehensive testing of the persistent context service through WebSocket messages.
 * 
 * Updated with dependency injection pattern for better testability and flexibility.
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
 * messages related to persistence testing. It validates incoming data, transforms it
 * into the correct format, and returns appropriate responses.
 */

import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { ChronosDateHandler } from '../services/utils/chronos-date-handler.js';
import { 
  CognitiveLayer, 
  MetaEventType, 
  HistoryChunk, 
  MetaInsight, 
  StrategicPlan,
  ContextRelationship,
  IPersistentContextService
} from '../services/context-manager.js';
import { activeConnections } from '../routes.js';

type WebSocketMessageHandler = (ws: WebSocket, data: any) => Promise<void>;

// Use dependency injection for persistence service
let contextService: IPersistentContextService;

/**
 * Setup WebSocket handlers for persistence testing with dependency injection
 * @param wsHandlers Map of WebSocket message handlers
 * @param persistenceService Persistence context service instance to use
 */
export function setupPersistenceTestHandlers(
  wsHandlers: Map<string, WebSocketMessageHandler>,
  persistenceService: IPersistentContextService
): void {
  // Store the injected persistence service
  contextService = persistenceService;
  
  // Session management
  wsHandlers.set('initialize-session', handleInitializeSession);
  
  // Basic operations
  wsHandlers.set('add-history-chunk', handleAddHistoryChunk);
  wsHandlers.set('add-meta-insight', handleAddMetaInsight);
  wsHandlers.set('add-strategic-plan', handleAddStrategicPlan);
  wsHandlers.set('update-strategic-plan', handleUpdateStrategicPlan);
  wsHandlers.set('add-context-relationship', handleAddContextRelationship);
  
  // Retrieval operations
  wsHandlers.set('get-recent-history', handleGetRecentHistory);
  wsHandlers.set('get-insights-by-type', handleGetInsightsByType);
  wsHandlers.set('get-active-plans', handleGetActivePlans);
  wsHandlers.set('search-context', handleSearchContext);
  
  console.log('Persistence test WebSocket handlers registered');
}

/**
 * Handle session initialization
 */
async function handleInitializeSession(ws: WebSocket, data: any): Promise<void> {
  try {
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      sendError(ws, 'Invalid session ID', 'session');
      return;
    }
    
    // Validate session ID format (alphanumeric, underscore, hyphen only)
    if (!/^[\w-]+$/.test(data.sessionId)) {
      sendError(ws, 'Session ID must contain only alphanumeric characters, underscores, and hyphens', 'session');
      return;
    }
    
    // Initialize the session using injected contextService
    const context = await contextService.initializeSession(data.sessionId);
    
    // Calculate item counts
    const itemCounts = {
      historyChunks: context.historyChunks.length,
      metaInsights: context.metaInsights.length,
      strategicPlans: context.strategicPlans.length,
      relationships: context.relationships.length
    };
    
    // Send success response
    ws.send(JSON.stringify({
      type: 'session-initialized',
      sessionId: data.sessionId,
      version: context.version,
      itemCounts
    }));
  } catch (error) {
    console.error('Error initializing session:', error);
    sendError(ws, `Failed to initialize session: ${error instanceof Error ? error.message : String(error)}`, 'session');
  }
}

/**
 * Handle adding a history chunk
 */
async function handleAddHistoryChunk(ws: WebSocket, data: any): Promise<void> {
  try {
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      sendError(ws, 'Invalid session ID', 'history-chunk');
      return;
    }
    
    // Validate content
    if (!data.content || typeof data.content !== 'string') {
      sendError(ws, 'Content is required and must be a string', 'history-chunk');
      return;
    }
    
    // Validate cognitive layer
    if (!data.cognitiveLayer) {
      sendError(ws, 'Cognitive layer is required', 'history-chunk');
      return;
    }
    
    // Create history chunk
    const chunk: HistoryChunk = {
      chunkId: uuidv4(),
      content: data.content,
      cognitiveLayer: data.cognitiveLayer as CognitiveLayer,
      timestamp: data.timestamp ? ChronosDateHandler.createDate(data.timestamp) : ChronosDateHandler.createDate(),
      taskId: data.taskId,
      tags: data.tags || []
    };
    
    // Add history chunk to context
    await contextService.addHistoryChunk(data.sessionId, chunk);
    
    // Send success response
    ws.send(JSON.stringify({
      type: 'history-chunk-added',
      sessionId: data.sessionId,
      chunkId: chunk.chunkId
    }));
    
    // Also broadcast version update
    broadcastVersionUpdate(data.sessionId);
  } catch (error) {
    console.error('Error adding history chunk:', error);
    sendError(ws, `Failed to add history chunk: ${error instanceof Error ? error.message : String(error)}`, 'history-chunk');
  }
}

/**
 * Handle adding a meta-insight
 */
async function handleAddMetaInsight(ws: WebSocket, data: any): Promise<void> {
  try {
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      sendError(ws, 'Invalid session ID', 'meta-insight');
      return;
    }
    
    // Validate summary
    if (!data.summary || typeof data.summary !== 'string') {
      sendError(ws, 'Summary is required and must be a string', 'meta-insight');
      return;
    }
    
    // Validate event type
    if (!data.eventType) {
      sendError(ws, 'Event type is required', 'meta-insight');
      return;
    }
    
    // Create meta-insight
    const insight: MetaInsight = {
      eventType: data.eventType as MetaEventType,
      summary: data.summary,
      details: data.details || {},
      timestamp: data.timestamp ? ChronosDateHandler.createDate(data.timestamp) : ChronosDateHandler.createDate(),
      importance: data.importance !== undefined ? data.importance : 0.5,
      confidence: data.confidence !== undefined ? data.confidence : 0.5
    };
    
    // Add meta-insight to context
    await contextService.addMetaInsight(data.sessionId, insight);
    
    // Generate a pseudo ID for the insight (not actually stored in the model)
    const insightId = uuidv4();
    
    // Send success response
    ws.send(JSON.stringify({
      type: 'meta-insight-added',
      sessionId: data.sessionId,
      insightId: insightId
    }));
    
    // Also broadcast version update
    broadcastVersionUpdate(data.sessionId);
  } catch (error) {
    console.error('Error adding meta-insight:', error);
    sendError(ws, `Failed to add meta-insight: ${error instanceof Error ? error.message : String(error)}`, 'meta-insight');
  }
}

/**
 * Handle adding a strategic plan
 */
async function handleAddStrategicPlan(ws: WebSocket, data: any): Promise<void> {
  try {
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      sendError(ws, 'Invalid session ID', 'strategic-plan');
      return;
    }
    
    // Validate task ID
    if (!data.taskId || typeof data.taskId !== 'string') {
      sendError(ws, 'Task ID is required and must be a string', 'strategic-plan');
      return;
    }
    
    // Validate summary
    if (!data.summary || typeof data.summary !== 'string') {
      sendError(ws, 'Summary is required and must be a string', 'strategic-plan');
      return;
    }
    
    // Create strategic plan
    const plan: StrategicPlan = {
      taskId: data.taskId,
      planSummary: data.summary,
      subTasks: data.subTasks || [],
      createdAt: ChronosDateHandler.createDate(),
      updatedAt: ChronosDateHandler.createDate(),
      status: 'pending'
    };
    
    // Add strategic plan to context
    await contextService.addStrategicPlan(data.sessionId, plan);
    
    // Send success response
    ws.send(JSON.stringify({
      type: 'strategic-plan-added',
      sessionId: data.sessionId,
      planId: plan.taskId
    }));
    
    // Also broadcast version update
    broadcastVersionUpdate(data.sessionId);
  } catch (error) {
    console.error('Error adding strategic plan:', error);
    sendError(ws, `Failed to add strategic plan: ${error instanceof Error ? error.message : String(error)}`, 'strategic-plan');
  }
}

/**
 * Handle updating a strategic plan
 */
async function handleUpdateStrategicPlan(ws: WebSocket, data: any): Promise<void> {
  try {
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      sendError(ws, 'Invalid session ID', 'strategic-plan');
      return;
    }
    
    // Validate task ID
    if (!data.taskId || typeof data.taskId !== 'string') {
      sendError(ws, 'Task ID is required and must be a string', 'strategic-plan');
      return;
    }
    
    // Validate status
    if (!data.status || !['pending', 'in_progress', 'completed', 'failed'].includes(data.status)) {
      sendError(ws, 'Status is required and must be one of: pending, in_progress, completed, failed', 'strategic-plan');
      return;
    }
    
    // Get the current context to find the plan
    const context = await contextService.loadContext(data.sessionId);
    if (!context) {
      sendError(ws, `Context not found for session: ${data.sessionId}`, 'strategic-plan');
      return;
    }
    
    // Find the plan to update
    const planIndex = context.strategicPlans.findIndex((p: StrategicPlan) => p.taskId === data.taskId);
    if (planIndex === -1) {
      sendError(ws, `Strategic plan with task ID ${data.taskId} not found`, 'strategic-plan');
      return;
    }
    
    // Get the plan
    const plan = { ...context.strategicPlans[planIndex] };
    
    // Update the plan
    plan.status = data.status as 'pending' | 'in_progress' | 'completed' | 'failed';
    plan.updatedAt = ChronosDateHandler.createDate();
    
    // If completing or failing, set the completedAt timestamp
    if (data.status === 'completed' || data.status === 'failed') {
      plan.completedAt = ChronosDateHandler.createDate();
    }
    
    // Update the plan
    await contextService.updateStrategicPlan(data.sessionId, plan);
    
    // Send success response
    ws.send(JSON.stringify({
      type: 'strategic-plan-updated',
      sessionId: data.sessionId,
      planId: plan.taskId,
      status: plan.status
    }));
    
    // Also broadcast version update
    broadcastVersionUpdate(data.sessionId);
  } catch (error) {
    console.error('Error updating strategic plan:', error);
    sendError(ws, `Failed to update strategic plan: ${error instanceof Error ? error.message : String(error)}`, 'strategic-plan');
  }
}

/**
 * Handle adding a context relationship
 */
async function handleAddContextRelationship(ws: WebSocket, data: any): Promise<void> {
  try {
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      sendError(ws, 'Invalid session ID', 'relationship');
      return;
    }
    
    // Validate source ID
    if (!data.sourceId || typeof data.sourceId !== 'string') {
      sendError(ws, 'Source ID is required and must be a string', 'relationship');
      return;
    }
    
    // Validate target ID
    if (!data.targetId || typeof data.targetId !== 'string') {
      sendError(ws, 'Target ID is required and must be a string', 'relationship');
      return;
    }
    
    // Validate relationship type
    if (!data.relationshipType || typeof data.relationshipType !== 'string') {
      sendError(ws, 'Relationship type is required and must be a string', 'relationship');
      return;
    }
    
    // Create relationship
    const relationship: ContextRelationship = {
      sourceId: data.sourceId,
      targetId: data.targetId,
      relationshipType: data.relationshipType,
      strength: data.strength !== undefined ? data.strength : 0.5,
      timestamp: data.timestamp ? ChronosDateHandler.createDate(data.timestamp) : ChronosDateHandler.createDate()
    };
    
    // Add relationship to context
    await contextService.addContextRelationship(data.sessionId, relationship);
    
    // Send success response
    ws.send(JSON.stringify({
      type: 'relationship-added',
      sessionId: data.sessionId,
      sourceId: relationship.sourceId,
      targetId: relationship.targetId
    }));
    
    // Also broadcast version update
    broadcastVersionUpdate(data.sessionId);
  } catch (error) {
    console.error('Error adding context relationship:', error);
    sendError(ws, `Failed to add context relationship: ${error instanceof Error ? error.message : String(error)}`, 'relationship');
  }
}

/**
 * Handle getting recent history chunks
 */
async function handleGetRecentHistory(ws: WebSocket, data: any): Promise<void> {
  try {
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      sendError(ws, 'Invalid session ID', 'history-retrieval');
      return;
    }
    
    // Validate layer
    if (!data.layer) {
      sendError(ws, 'Cognitive layer is required', 'history-retrieval');
      return;
    }
    
    // Get recent history chunks
    const chunks = await contextService.getRecentHistory(
      data.sessionId,
      data.layer as CognitiveLayer,
      data.limit || 10
    );
    
    // Send response
    ws.send(JSON.stringify({
      type: 'history-chunks-retrieved',
      sessionId: data.sessionId,
      chunks
    }));
  } catch (error) {
    console.error('Error getting recent history:', error);
    sendError(ws, `Failed to get recent history: ${error instanceof Error ? error.message : String(error)}`, 'history-retrieval');
  }
}

/**
 * Handle getting insights by type
 */
async function handleGetInsightsByType(ws: WebSocket, data: any): Promise<void> {
  try {
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      sendError(ws, 'Invalid session ID', 'insight-retrieval');
      return;
    }
    
    // Validate event type
    if (!data.eventType) {
      sendError(ws, 'Event type is required', 'insight-retrieval');
      return;
    }
    
    // Get insights by type
    const insights = await contextService.getInsightsByType(
      data.sessionId,
      data.eventType as MetaEventType,
      data.minImportance !== undefined ? data.minImportance : 0
    );
    
    // Send response
    ws.send(JSON.stringify({
      type: 'meta-insights-retrieved',
      sessionId: data.sessionId,
      insights
    }));
  } catch (error) {
    console.error('Error getting insights by type:', error);
    sendError(ws, `Failed to get insights by type: ${error instanceof Error ? error.message : String(error)}`, 'insight-retrieval');
  }
}

/**
 * Handle getting active strategic plans
 */
async function handleGetActivePlans(ws: WebSocket, data: any): Promise<void> {
  try {
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      sendError(ws, 'Invalid session ID', 'plan-retrieval');
      return;
    }
    
    // Get active strategic plans
    const plans = await contextService.getActiveStrategicPlans(data.sessionId);
    
    // Send response
    ws.send(JSON.stringify({
      type: 'strategic-plans-retrieved',
      sessionId: data.sessionId,
      plans
    }));
  } catch (error) {
    console.error('Error getting active strategic plans:', error);
    sendError(ws, `Failed to get active strategic plans: ${error instanceof Error ? error.message : String(error)}`, 'plan-retrieval');
  }
}

/**
 * Handle searching context
 */
async function handleSearchContext(ws: WebSocket, data: any): Promise<void> {
  try {
    // Validate session ID
    if (!data.sessionId || typeof data.sessionId !== 'string') {
      sendError(ws, 'Invalid session ID', 'context-search');
      return;
    }
    
    // Validate query
    if (!data.query || typeof data.query !== 'string') {
      sendError(ws, 'Query is required and must be a string', 'context-search');
      return;
    }
    
    // Search context
    const results = await contextService.searchContext(
      data.sessionId,
      data.query
    );
    
    // Send response
    ws.send(JSON.stringify({
      type: 'context-search-results',
      sessionId: data.sessionId,
      query: data.query,
      results
    }));
  } catch (error) {
    console.error('Error searching context:', error);
    sendError(ws, `Failed to search context: ${error instanceof Error ? error.message : String(error)}`, 'context-search');
  }
}

/**
 * Send error response to client with safe error handling for
 * potentially closed WebSocket connections
 */
function sendError(ws: WebSocket, message: string, source: string = 'general'): void {
  try {
    // Only send if WebSocket is open
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'error',
        message,
        source
      }));
    } else {
      console.warn(`Attempted to send error to closed WebSocket: ${message}`);
    }
  } catch (err) {
    console.error(`Failed to send error message: ${err}`);
  }
}

/**
 * Broadcast version update to all connected clients
 */
async function broadcastVersionUpdate(sessionId: string): Promise<void> {
  try {
    // Get the current context to find the current version
    const context = await contextService.loadContext(sessionId);
    if (!context) return;
    
    // Create the version update message
    const message = JSON.stringify({
      type: 'version-updated',
      sessionId,
      version: context.version
    });
    
    // Broadcast to all connected clients
    // Convert the map values to an array first to avoid iteration issues with TypeScript target
    const clients = Array.from(activeConnections.values());
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  } catch (error) {
    console.error('Error broadcasting version update:', error);
  }
}