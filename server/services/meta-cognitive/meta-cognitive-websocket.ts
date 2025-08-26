/**
 * Meta-Cognitive WebSocket Service
 * 
 * This service manages WebSocket connections for real-time meta-cognitive
 * event streaming and interactive analysis.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';
import { MetaCognitiveEngine } from './meta-cognitive-engine.js';
import { MetaCognitiveEventBuilder } from './meta-cognitive-event-builder.js';
import { MetaCognitiveEvent } from '../../../shared/schema-minimal.js';
import { QuantumGlossary } from '../qrn/quantum-glossary.js';

const quantumGlossary = new QuantumGlossary();

// Client connection types
interface Client {
  ws: WebSocket;
  id: string;
  subscriptions: Set<string>;
  isAlive: boolean;
  lastActivity: Date;
}

// Message types
interface WSMessage {
  type: string;
  payload: any;
}

/**
 * Meta-Cognitive WebSocket Service class
 * Manages real-time connections for meta-cognitive functionality
 */
export class MetaCognitiveWebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, Client> = new Map();
  private engine: MetaCognitiveEngine;
  private eventBuilder: MetaCognitiveEventBuilder;
  private storage: any; // Proper type would be IStorage
  private pingInterval: NodeJS.Timeout | null = null;
  
  constructor(storage: any) {
    this.storage = storage;
    this.engine = new MetaCognitiveEngine(storage);
    this.eventBuilder = new MetaCognitiveEventBuilder();
    
    quantumGlossary.tagWithContext('[META-COGNITIVE] WebSocket service initialized');
  }
  
  /**
   * Initialize the WebSocket server
   * 
   * @param server - HTTP server to attach to
   * @param path - WebSocket endpoint path
   */
  public initialize(server: Server, path: string = '/ws/meta-cognitive'): void {
    // Create WebSocket server
    this.wss = new WebSocketServer({ 
      server, 
      path,
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
      }
    });
    
    // Set up connection handler
    this.wss.on('connection', (ws: WebSocket) => this.handleConnection(ws));
    
    // Set up interval for client ping/pong
    this.pingInterval = setInterval(() => this.pingClients(), 30000);
    
    quantumGlossary.tagWithContext(`[META-COGNITIVE] WebSocket server started on ${path}`);
  }
  
  /**
   * Handle new WebSocket connection
   * 
   * @param ws - WebSocket connection
   */
  private handleConnection(ws: WebSocket): void {
    // Generate unique client ID
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Store client information
    const client: Client = {
      ws,
      id: clientId,
      subscriptions: new Set<string>(),
      isAlive: true,
      lastActivity: new Date()
    };
    
    this.clients.set(clientId, client);
    
    // Set up message handler
    ws.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString()) as WSMessage;
        this.handleMessage(clientId, message);
      } catch (error) {
        quantumGlossary.logError(`Error parsing WebSocket message from client ${clientId}`, error as Error);
        
        ws.send(JSON.stringify({
          type: 'error',
          payload: {
            message: 'Invalid message format. Expected JSON with type and payload.'
          }
        }));
      }
    });
    
    // Set up close handler
    ws.on('close', () => {
      this.clients.delete(clientId);
      quantumGlossary.tagWithContext(`[META-COGNITIVE] Client disconnected: ${clientId}`);
    });
    
    // Set up error handler
    ws.on('error', (error) => {
      quantumGlossary.logError(`WebSocket error for client ${clientId}`, error);
      this.clients.delete(clientId);
    });
    
    // Set up pong handler
    ws.on('pong', () => {
      if (this.clients.has(clientId)) {
        this.clients.get(clientId)!.isAlive = true;
        this.clients.get(clientId)!.lastActivity = new Date();
      }
    });
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      payload: {
        clientId,
        message: 'Connected to Meta-Cognitive Engine WebSocket',
        timestamp: new Date().toISOString()
      }
    }));
    
    quantumGlossary.tagWithContext(`[META-COGNITIVE] New client connected: ${clientId}`);
  }
  
  /**
   * Handle incoming message from client
   * 
   * @param clientId - ID of client sending the message
   * @param message - Parsed message object
   */
  private async handleMessage(clientId: Client['id'], message: WSMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    // Update last activity timestamp
    client.lastActivity = new Date();
    
    try {
      switch (message.type) {
        case 'ping':
          this.sendToClient(clientId, {
            type: 'pong',
            payload: {
              timestamp: new Date().toISOString()
            }
          });
          break;
          
        case 'subscribe':
          this.handleSubscribe(clientId, message.payload);
          break;
          
        case 'unsubscribe':
          this.handleUnsubscribe(clientId, message.payload);
          break;
          
        case 'analyze_state':
          await this.handleAnalyzeState(clientId, message.payload);
          break;
          
        case 'get_events':
          await this.handleGetEvents(clientId, message.payload);
          break;
          
        case 'find_correlations':
          await this.handleFindCorrelations(clientId, message.payload);
          break;
          
        case 'identify_breakthroughs':
          await this.handleIdentifyBreakthroughs(clientId, message.payload);
          break;
          
        default:
          // Unknown message type
          this.sendToClient(clientId, {
            type: 'error',
            payload: {
              message: `Unknown message type: ${message.type}`,
              originalType: message.type
            }
          });
      }
    } catch (error) {
      quantumGlossary.logError(
        `Error handling WebSocket message of type ${message.type} from client ${clientId}`, 
        error as Error
      );
      
      this.sendToClient(clientId, {
        type: 'error',
        payload: {
          message: `Error processing ${message.type} message: ${(error as Error).message}`,
          originalType: message.type
        }
      });
    }
  }
  
  /**
   * Handle client subscription request
   * 
   * @param clientId - Client ID
   * @param payload - Subscription payload
   */
  private handleSubscribe(clientId: Client['id'], payload: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    // Get event types to subscribe to
    const eventTypes = Array.isArray(payload.eventTypes) 
      ? payload.eventTypes 
      : payload.eventType 
        ? [payload.eventType] 
        : ['all'];
    
    // Add subscriptions
    for (const type of eventTypes) {
      client.subscriptions.add(type);
    }
    
    // Send confirmation
    this.sendToClient(clientId, {
      type: 'subscription_confirmed',
      payload: {
        subscribed: Array.from(client.subscriptions),
        message: `Subscribed to events: ${Array.from(client.subscriptions).join(', ')}`
      }
    });
    
    quantumGlossary.tagWithContext(
      `[META-COGNITIVE] Client ${clientId} subscribed to events: ${eventTypes.join(', ')}`
    );
  }
  
  /**
   * Handle client unsubscribe request
   * 
   * @param clientId - Client ID
   * @param payload - Unsubscribe payload
   */
  private handleUnsubscribe(clientId: Client['id'], payload: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    // Get event types to unsubscribe from
    const eventTypes = Array.isArray(payload.eventTypes) 
      ? payload.eventTypes 
      : payload.eventType 
        ? [payload.eventType] 
        : ['all'];
    
    // Handle special case to unsubscribe from all
    if (eventTypes.includes('all')) {
      client.subscriptions.clear();
    } else {
      // Remove specific subscriptions
      for (const type of eventTypes) {
        client.subscriptions.delete(type);
      }
    }
    
    // Send confirmation
    this.sendToClient(clientId, {
      type: 'unsubscribe_confirmed',
      payload: {
        currentSubscriptions: Array.from(client.subscriptions),
        message: `Unsubscribed from events: ${eventTypes.join(', ')}`
      }
    });
    
    quantumGlossary.tagWithContext(
      `[META-COGNITIVE] Client ${clientId} unsubscribed from events: ${eventTypes.join(', ')}`
    );
  }
  
  /**
   * Handle state analysis request
   * 
   * @param clientId - Client ID
   * @param payload - Analysis payload
   */
  private async handleAnalyzeState(clientId: Client['id'], payload: any): Promise<void> {
    // Extract data from payload
    const qctfData = payload.qctfData || null;
    const systemState = payload.systemState || {};
    const cycle = payload.cycle || 0;
    
    // Update event builder context
    this.eventBuilder.updateContext(qctfData, systemState);
    
    // Run engine analysis
    const generatedEvents = await this.engine.update(qctfData, systemState, cycle);
    
    // Process events with the event builder
    const { processedEvents, relationMap, stats } = this.eventBuilder.processBatch(generatedEvents);
    
    // Map relation data for response
    const relations: Record<string, string[]> = {};
    for (const [id, relatedIds] of relationMap.entries()) {
      relations[id] = relatedIds;
    }
    
    // Send response to requesting client
    this.sendToClient(clientId, {
      type: 'analysis_result',
      payload: {
        eventCount: processedEvents.length,
        events: processedEvents,
        relations,
        stats,
        cycle
      }
    });
    
    // Broadcast events to subscribed clients
    this.broadcastEvents(processedEvents, clientId);
    
    quantumGlossary.tagWithContext(
      `[META-COGNITIVE] Analyzed state for client ${clientId}, generated ${processedEvents.length} events`
    );
  }
  
  /**
   * Handle get events request
   * 
   * @param clientId - Client ID
   * @param payload - Request payload
   */
  private async handleGetEvents(clientId: Client['id'], payload: any): Promise<void> {
    // Parse limit and type filters
    const limit = payload.limit ? parseInt(payload.limit, 10) : undefined;
    const type = payload.type as string | undefined;
    
    // Retrieve events from storage
    let events = await this.storage.getAllMetaCognitiveEvents();
    
    // Filter by type if specified
    if (type) {
      events = events.filter(event => event.type === type);
    }
    
    // Apply limit if specified
    if (limit !== undefined && limit > 0) {
      events = events.slice(0, limit);
    }
    
    // Send response
    this.sendToClient(clientId, {
      type: 'events_list',
      payload: {
        count: events.length,
        events,
        filters: {
          type,
          limit
        }
      }
    });
  }
  
  /**
   * Handle find correlations request
   * 
   * @param clientId - Client ID
   * @param payload - Request payload
   */
  private async handleFindCorrelations(clientId: Client['id'], payload: any): Promise<void> {
    const eventId = payload.eventId;
    const depth = payload.depth ? parseInt(payload.depth, 10) : 1;
    
    if (!eventId) {
      this.sendToClient(clientId, {
        type: 'error',
        payload: {
          message: 'Event ID is required for correlation analysis'
        }
      });
      return;
    }
    
    // Retrieve target event
    const targetEvent = await this.storage.getMetaCognitiveEvent(eventId);
    
    if (!targetEvent) {
      this.sendToClient(clientId, {
        type: 'error',
        payload: {
          message: `Event not found with ID: ${eventId}`
        }
      });
      return;
    }
    
    // Load recent events
    const recentEvents = await this.storage.getAllMetaCognitiveEvents();
    
    // Update engine context with recent events
    this.engine['context'].recentEvents = recentEvents;
    
    // Find correlated events
    const correlatedEvents = this.engine.findCorrelatedEvents(targetEvent, depth);
    
    // Send response
    this.sendToClient(clientId, {
      type: 'correlation_result',
      payload: {
        targetEvent,
        correlatedEvents,
        relationDepth: depth,
        correlationCount: correlatedEvents.length
      }
    });
  }
  
  /**
   * Handle identify breakthroughs request
   * 
   * @param clientId - Client ID
   * @param payload - Request payload
   */
  private async handleIdentifyBreakthroughs(clientId: Client['id'], payload: any): Promise<void> {
    // Parse window size
    const windowSize = payload.windowSize || payload.window || 20;
    
    // Load recent events
    const recentEvents = await this.storage.getAllMetaCognitiveEvents();
    
    // Update engine context with recent events
    this.engine['context'].recentEvents = recentEvents;
    
    // Identify breakthroughs
    const breakthroughs = this.engine.identifyBreakthroughs(recentEvents, windowSize);
    
    // Send response
    this.sendToClient(clientId, {
      type: 'breakthrough_result',
      payload: {
        breakthroughs,
        totalEventsAnalyzed: recentEvents.length,
        windowSize
      }
    });
  }
  
  /**
   * Broadcast events to subscribed clients
   * 
   * @param events - Events to broadcast
   * @param excludeClientId - Optional client ID to exclude
   */
  public broadcastEvents(events: MetaCognitiveEvent[], excludeClientId?: string): void {
    if (events.length === 0) return;
    
    // Group events by type for efficient filtering
    const eventsByType = new Map<string, MetaCognitiveEvent[]>();
    for (const event of events) {
      const eventsOfType = eventsByType.get(event.type) || [];
      eventsOfType.push(event);
      eventsByType.set(event.type, eventsOfType);
    }
    
    // Send to each client based on their subscriptions
    for (const [clientId, client] of this.clients.entries()) {
      // Skip excluded client
      if (excludeClientId === clientId) continue;
      
      // Skip clients with closed connections
      if (client.ws.readyState !== WebSocket.OPEN) continue;
      
      const relevantEvents: MetaCognitiveEvent[] = [];
      
      // Check if client is subscribed to any of these event types
      if (client.subscriptions.has('all')) {
        // If subscribed to all, send all events
        relevantEvents.push(...events);
      } else {
        // Otherwise, filter by subscribed types
        for (const type of client.subscriptions) {
          const eventsOfType = eventsByType.get(type) || [];
          relevantEvents.push(...eventsOfType);
        }
      }
      
      // Send events if there are any relevant ones
      if (relevantEvents.length > 0) {
        this.sendToClient(clientId, {
          type: 'events',
          payload: {
            events: relevantEvents,
            count: relevantEvents.length,
            timestamp: new Date().toISOString()
          }
        });
      }
    }
  }
  
  /**
   * Send a message to a specific client
   * 
   * @param clientId - Target client ID
   * @param message - Message to send
   */
  private sendToClient(clientId: Client['id'], message: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        quantumGlossary.logError(`Error sending message to client ${clientId}`, error as Error);
      }
    }
  }
  
  /**
   * Ping all clients to check connection status
   */
  private pingClients(): void {
    const now = new Date();
    
    for (const [clientId, client] of this.clients.entries()) {
      // Skip already known dead clients
      if (!client.isAlive) {
        // Client didn't respond to previous ping, terminate connection
        quantumGlossary.tagWithContext(
          `[META-COGNITIVE] Terminating inactive client: ${clientId}`
        );
        client.ws.terminate();
        this.clients.delete(clientId);
        continue;
      }
      
      // Reset isAlive flag
      client.isAlive = false;
      
      // Send ping
      try {
        client.ws.ping();
      } catch (error) {
        // Error sending ping, client is probably disconnected
        quantumGlossary.logError(`Error pinging client ${clientId}`, error as Error);
        client.ws.terminate();
        this.clients.delete(clientId);
      }
      
      // Check for inactive clients (no activity for 10 minutes)
      const inactiveThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
      const inactiveTime = now.getTime() - client.lastActivity.getTime();
      
      if (inactiveTime > inactiveThreshold) {
        quantumGlossary.tagWithContext(
          `[META-COGNITIVE] Closing inactive client connection: ${clientId} (inactive for ${Math.round(inactiveTime / 1000)}s)`
        );
        client.ws.terminate();
        this.clients.delete(clientId);
      }
    }
  }
  
  /**
   * Clean up resources on shutdown
   */
  public shutdown(): void {
    // Clear ping interval
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    // Close all connections
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    
    // Clear clients
    this.clients.clear();
    
    quantumGlossary.tagWithContext('[META-COGNITIVE] WebSocket service shut down');
  }
  
  /**
   * Get current connection stats
   * 
   * @returns Connection statistics
   */
  public getStats(): any {
    const subscriptionCounts: Record<string, number> = {};
    
    // Count subscriptions by type
    for (const client of this.clients.values()) {
      for (const subscription of client.subscriptions) {
        subscriptionCounts[subscription] = (subscriptionCounts[subscription] || 0) + 1;
      }
    }
    
    return {
      clients: this.clients.size,
      subscriptions: subscriptionCounts,
      timestamp: new Date().toISOString()
    };
  }
}

export default MetaCognitiveWebSocketService;