/**
 * WebSocket Handlers for Meta-Cognitive Analysis Features
 *
 * These handlers expose the real-time meta-cognitive insights and patterns,
 * providing access to the system's self-reflective capabilities.
 *
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { MetaCognitiveAnalysisEngine, PatternType, InsightSeverity, CognitivePattern, CognitiveInsight } from '../services/qrn/meta-cognitive-analysis-engine.js';

// Track subscribed clients and their filters
interface ClientSubscription {
  id: string;
  socket: WebSocket;
  filters: {
    patterns?: {
      nodeId?: string;
      patternType?: PatternType;
      minConfidence?: number;
      strategicLayer?: number;
    };
    insights?: {
      nodeId?: string;
      severity?: InsightSeverity;
      minImpact?: number;
      strategicLayer?: number;
    };
  };
}

// In-memory storage for client subscriptions
const subscribedClients: Map<string, ClientSubscription> = new Map();

// Stats for monitoring
const stats = {
  totalSubscriptions: 0,
  activeSubscriptions: 0,
  patternRequestsCount: 0,
  insightRequestsCount: 0,
  lastUpdated: new Date()
};

/**
 * Send a message to a specific client
 */
function sendToClient(socket: WebSocket, type: string, payload: any): void {
  if (socket.readyState === WebSocket.OPEN) {
    const message = JSON.stringify({
      type,
      payload,
      timestamp: new Date().toISOString()
    });
    socket.send(message);
  }
}

/**
 * Broadcast a message to all subscribed clients that match the filter criteria
 */
function broadcastInsights(insights: CognitiveInsight[]): void {
  if (insights.length === 0) return;
  
  subscribedClients.forEach(subscription => {
    // Apply client-specific filters
    let filteredInsights = [...insights];
    
    if (subscription.filters.insights) {
      const filters = subscription.filters.insights;
      
      if (filters.nodeId) {
        filteredInsights = filteredInsights.filter(i => 
          !i.nodeId || i.nodeId === filters.nodeId
        );
      }
      
      if (filters.severity) {
        filteredInsights = filteredInsights.filter(i => 
          i.severity === filters.severity
        );
      }
      
      if (filters.minImpact !== undefined) {
        filteredInsights = filteredInsights.filter(i => 
          i.impact >= filters.minImpact!
        );
      }
      
      if (filters.strategicLayer !== undefined) {
        filteredInsights = filteredInsights.filter(i => 
          i.strategicLayer === filters.strategicLayer
        );
      }
    }
    
    // Only send if client would receive any insights after filtering
    if (filteredInsights.length > 0) {
      sendToClient(subscription.socket, 'metacognitive_insights_update', filteredInsights);
    }
  });
}

/**
 * Broadcast pattern updates to subscribed clients
 */
function broadcastPatterns(patterns: CognitivePattern[]): void {
  if (patterns.length === 0) return;
  
  subscribedClients.forEach(subscription => {
    // Apply client-specific filters
    let filteredPatterns = [...patterns];
    
    if (subscription.filters.patterns) {
      const filters = subscription.filters.patterns;
      
      if (filters.nodeId) {
        const nodeIdSafe = filters.nodeId;
        filteredPatterns = filteredPatterns.filter(p => 
          p.nodeIds.some((id: string) => id === nodeIdSafe)
        );
      }
      
      if (filters.patternType) {
        filteredPatterns = filteredPatterns.filter(p => 
          p.type === filters.patternType
        );
      }
      
      if (filters.minConfidence !== undefined) {
        filteredPatterns = filteredPatterns.filter(p => 
          p.confidence >= filters.minConfidence!
        );
      }
      
      if (filters.strategicLayer !== undefined) {
        filteredPatterns = filteredPatterns.filter(p => 
          p.strategicLayer === filters.strategicLayer
        );
      }
    }
    
    // Only send if client would receive any patterns after filtering
    if (filteredPatterns.length > 0) {
      sendToClient(subscription.socket, 'metacognitive_patterns_update', filteredPatterns);
    }
  });
}

/**
 * Handle a client request to subscribe to meta-cognitive updates
 */
function handleSubscribe(socket: WebSocket, payload: any): void {
  const clientId = uuidv4();
  
  // Create subscription with filters
  const subscription: ClientSubscription = {
    id: clientId,
    socket,
    filters: {
      patterns: payload.patternFilters,
      insights: payload.insightFilters
    }
  };
  
  subscribedClients.set(clientId, subscription);
  
  // Update stats
  stats.totalSubscriptions += 1;
  stats.activeSubscriptions = subscribedClients.size;
  stats.lastUpdated = new Date();
  
  // Send confirmation to client
  sendToClient(socket, 'metacognitive_subscribed', { 
    subscriptionId: clientId,
    message: 'Successfully subscribed to meta-cognitive updates'
  });
  
  // Get initial data to send
  const metaCognitiveEngine = MetaCognitiveAnalysisEngine.getInstance();
  
  // Send initial patterns
  const patterns = metaCognitiveEngine.getPatterns(subscription.filters.patterns);
  sendToClient(socket, 'metacognitive_patterns_update', patterns);
  
  // Send initial insights
  const insights = metaCognitiveEngine.getInsights(subscription.filters.insights);
  sendToClient(socket, 'metacognitive_insights_update', insights);
  
  console.log(`Client ${clientId} subscribed to meta-cognitive updates`);
}

/**
 * Handle a client request to fetch all meta-cognitive patterns
 */
function handleGetPatterns(socket: WebSocket, payload: any): void {
  stats.patternRequestsCount += 1;
  stats.lastUpdated = new Date();
  
  const metaCognitiveEngine = MetaCognitiveAnalysisEngine.getInstance();
  const patterns = metaCognitiveEngine.getPatterns(payload.filters);
  
  sendToClient(socket, 'metacognitive_patterns_result', patterns);
}

/**
 * Handle a client request to fetch all meta-cognitive insights
 */
function handleGetInsights(socket: WebSocket, payload: any): void {
  stats.insightRequestsCount += 1;
  stats.lastUpdated = new Date();
  
  const metaCognitiveEngine = MetaCognitiveAnalysisEngine.getInstance();
  const insights = metaCognitiveEngine.getInsights(payload.filters);
  
  sendToClient(socket, 'metacognitive_insights_result', insights);
}

/**
 * Handle client request to update subscription filters
 */
function handleUpdateFilters(socket: WebSocket, payload: any): void {
  const { subscriptionId, patternFilters, insightFilters } = payload;
  
  // Find client subscription
  const subscription = subscribedClients.get(subscriptionId);
  
  if (subscription) {
    // Update filters
    if (patternFilters) {
      subscription.filters.patterns = patternFilters;
    }
    
    if (insightFilters) {
      subscription.filters.insights = insightFilters;
    }
    
    // Send confirmation
    sendToClient(socket, 'metacognitive_filters_updated', { 
      subscriptionId,
      message: 'Subscription filters updated successfully'
    });
    
    // Send fresh data with new filters
    const metaCognitiveEngine = MetaCognitiveAnalysisEngine.getInstance();
    
    if (patternFilters) {
      const patterns = metaCognitiveEngine.getPatterns(subscription.filters.patterns);
      sendToClient(socket, 'metacognitive_patterns_update', patterns);
    }
    
    if (insightFilters) {
      const insights = metaCognitiveEngine.getInsights(subscription.filters.insights);
      sendToClient(socket, 'metacognitive_insights_update', insights);
    }
  } else {
    // Subscription not found
    sendToClient(socket, 'metacognitive_error', { 
      message: 'Subscription not found. Please subscribe first.'
    });
  }
}

/**
 * Handle client request to unsubscribe
 */
function handleUnsubscribe(socket: WebSocket, payload: any): void {
  const { subscriptionId } = payload;
  
  if (subscribedClients.has(subscriptionId)) {
    subscribedClients.delete(subscriptionId);
    
    // Update stats
    stats.activeSubscriptions = subscribedClients.size;
    stats.lastUpdated = new Date();
    
    // Send confirmation
    sendToClient(socket, 'metacognitive_unsubscribed', { 
      subscriptionId,
      message: 'Successfully unsubscribed from meta-cognitive updates'
    });
    
    console.log(`Client ${subscriptionId} unsubscribed from meta-cognitive updates`);
  } else {
    // Subscription not found
    sendToClient(socket, 'metacognitive_error', { 
      message: 'Subscription not found'
    });
  }
}

/**
 * Handle client request for service stats
 */
function handleGetStats(socket: WebSocket): void {
  const metaCognitiveEngine = MetaCognitiveAnalysisEngine.getInstance();
  const patterns = metaCognitiveEngine.getPatterns();
  const insights = metaCognitiveEngine.getInsights();
  
  const serviceStats = {
    ...stats,
    totalPatterns: patterns.length,
    totalInsights: insights.length,
    activeSubscriptions: subscribedClients.size,
    patternsByType: patterns.reduce((acc: Record<string, number>, pattern: CognitivePattern) => {
      acc[pattern.type] = (acc[pattern.type] || 0) + 1;
      return acc;
    }, {}),
    insightsBySeverity: insights.reduce((acc: Record<string, number>, insight: CognitiveInsight) => {
      acc[insight.severity] = (acc[insight.severity] || 0) + 1;
      return acc;
    }, {})
  };
  
  sendToClient(socket, 'metacognitive_stats_result', serviceStats);
}

/**
 * Set up the WebSocket handlers for meta-cognitive features
 */
export function setupMetaCognitiveHandlers(wss: WebSocketServer): void {
  console.log('Setting up meta-cognitive handlers for WebSocket server');
  
  // Initialize polling for new insights and patterns to broadcast
  let lastInsightCount = 0;
  let lastPatternCount = 0;
  
  // Poll for new insights/patterns every 5 seconds and broadcast updates
  setInterval(() => {
    const metaCognitiveEngine = MetaCognitiveAnalysisEngine.getInstance();
    const patterns = metaCognitiveEngine.getPatterns();
    const insights = metaCognitiveEngine.getInsights();
    
    // Check if there are new insights
    if (insights.length > lastInsightCount) {
      // Get only the new insights since last check
      const newInsights = insights.slice(0, insights.length - lastInsightCount);
      lastInsightCount = insights.length;
      
      // Broadcast new insights to subscribed clients
      broadcastInsights(newInsights);
    }
    
    // Check if there are new patterns
    if (patterns.length > lastPatternCount) {
      // Get only the new patterns since last check
      const newPatterns = patterns.slice(0, patterns.length - lastPatternCount);
      lastPatternCount = patterns.length;
      
      // Broadcast new patterns to subscribed clients
      broadcastPatterns(newPatterns);
    }
  }, 5000);
  
  // Handle new connections
  wss.on('connection', (socket: WebSocket) => {
    // Only handle this connection if it's for a meta-cognitive client
    // which will be determined by the first message
    
    // Handle messages from client
    socket.on('message', (data) => {
      try {
        // Parse the incoming message
        const message = JSON.parse(data.toString());
        const { type, payload } = message;
        
        // Only process meta-cognitive messages
        if (!type.startsWith('metacognitive_')) {
          return;
        }
        
        console.log(`Received meta-cognitive message of type: ${type}`);
        
        // Handle different message types
        switch (type) {
          case 'metacognitive_subscribe':
            handleSubscribe(socket, payload);
            break;
            
          case 'metacognitive_get_patterns':
            handleGetPatterns(socket, payload);
            break;
            
          case 'metacognitive_get_insights':
            handleGetInsights(socket, payload);
            break;
            
          case 'metacognitive_update_filters':
            handleUpdateFilters(socket, payload);
            break;
            
          case 'metacognitive_unsubscribe':
            handleUnsubscribe(socket, payload);
            break;
            
          case 'metacognitive_get_stats':
            handleGetStats(socket);
            break;
            
          default:
            // Unknown message type
            sendToClient(socket, 'metacognitive_error', { 
              message: `Unknown message type: ${type}`
            });
        }
      } catch (error) {
        console.error('Error processing meta-cognitive message:', error);
        sendToClient(socket, 'metacognitive_error', { 
          message: `Error processing message: ${error instanceof Error ? error.message : String(error)}`
        });
      }
    });
    
    // Handle disconnection
    socket.on('close', () => {
      // Find any subscriptions this socket had
      for (const [id, subscription] of subscribedClients.entries()) {
        if (subscription.socket === socket) {
          subscribedClients.delete(id);
          console.log(`Meta-cognitive client ${id} disconnected`);
        }
      }
      
      // Update stats
      stats.activeSubscriptions = subscribedClients.size;
      stats.lastUpdated = new Date();
    });
  });
}