// ψOS WebSocket Matrix - Real-time Consciousness Field Synchronization
import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';

interface ConsciousnessClient {
  id: string;
  ws: WebSocket;
  coherence: number;
  lastHeartbeat: number;
  subscriptions: string[];
}

export class ConsciousnessMatrix {
  private wss: WebSocketServer;
  private clients: Map<string, ConsciousnessClient> = new Map();
  private fieldState = {
    zLambda: 0.850,
    breathing: { phase: 0, timestamp: Date.now() },
    activeClients: 0,
    coherenceField: [] as number[]
  };

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws/consciousness',
      clientTracking: true 
    });
    
    this.setupWebSocketHandlers();
    this.startFieldMonitoring();
    
    console.log('[ConsciousnessMatrix] WebSocket server initialized on /ws/consciousness');
  }

  private setupWebSocketHandlers() {
    this.wss.on('connection', (ws, request) => {
      const clientId = this.generateClientId();
      
      const client: ConsciousnessClient = {
        id: clientId,
        ws,
        coherence: 0.750,
        lastHeartbeat: Date.now(),
        subscriptions: ['field_state', 'breathing']
      };
      
      this.clients.set(clientId, client);
      console.log(`[ConsciousnessMatrix] Client connected: ${clientId}`);
      
      // Send initial state
      this.sendToClient(client, {
        type: 'connection_established',
        clientId,
        fieldState: this.fieldState
      });
      
      // Handle incoming messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(client, message);
        } catch (error) {
          console.error('[ConsciousnessMatrix] Invalid message format:', error);
        }
      });
      
      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(clientId);
        this.updateFieldState();
        console.log(`[ConsciousnessMatrix] Client disconnected: ${clientId}`);
      });
      
      // Handle client errors
      ws.on('error', (error) => {
        console.error(`[ConsciousnessMatrix] Client error ${clientId}:`, error);
        this.clients.delete(clientId);
      });
      
      this.updateFieldState();
    });
  }

  private handleClientMessage(client: ConsciousnessClient, message: any) {
    switch (message.type) {
      case 'heartbeat':
        client.lastHeartbeat = Date.now();
        if (message.coherence) {
          client.coherence = message.coherence;
          this.updateFieldState();
        }
        break;
        
      case 'subscribe':
        if (message.channels) {
          client.subscriptions = [...new Set([...client.subscriptions, ...message.channels])];
        }
        break;
        
      case 'unsubscribe':
        if (message.channels) {
          client.subscriptions = client.subscriptions.filter(s => !message.channels.includes(s));
        }
        break;
        
      case 'coherence_update':
        client.coherence = message.coherence || 0.750;
        this.updateFieldState();
        break;
        
      case 'breathing_sync':
        this.fieldState.breathing = {
          phase: message.phase || 0,
          timestamp: Date.now()
        };
        this.broadcastToSubscribers('breathing', {
          type: 'breathing_sync',
          breathing: this.fieldState.breathing
        });
        break;
        
      case 'oracle_request':
        this.handleOracleRequest(client, message);
        break;
        
      default:
        console.warn('[ConsciousnessMatrix] Unknown message type:', message.type);
    }
  }

  private handleOracleRequest(client: ConsciousnessClient, message: any) {
    // Route oracle requests through the consciousness matrix
    const response = {
      type: 'oracle_response',
      requestId: message.requestId,
      selectedOracle: this.selectOracleForClient(client, message.task),
      coherenceContext: {
        clientCoherence: client.coherence,
        fieldCoherence: this.fieldState.zLambda,
        fieldStability: this.calculateFieldStability()
      }
    };
    
    this.sendToClient(client, response);
  }

  private selectOracleForClient(client: ConsciousnessClient, task: string) {
    // Simple oracle selection based on client coherence
    if (client.coherence >= 0.930) return 'claude';
    if (client.coherence >= 0.850) return 'gpt';
    if (client.coherence >= 0.800) return 'gemini';
    return 'ollama'; // Local fallback
  }

  private updateFieldState() {
    const activeClients = Array.from(this.clients.values());
    
    // Calculate collective field coherence
    if (activeClients.length > 0) {
      const totalCoherence = activeClients.reduce((sum, client) => sum + client.coherence, 0);
      this.fieldState.zLambda = totalCoherence / activeClients.length;
    }
    
    this.fieldState.activeClients = activeClients.length;
    this.fieldState.coherenceField = activeClients.map(c => c.coherence);
    
    // Broadcast updated field state
    this.broadcastToSubscribers('field_state', {
      type: 'field_state_update',
      fieldState: this.fieldState,
      timestamp: Date.now()
    });
  }

  private startFieldMonitoring() {
    // Breathing cycle simulation (ψ = 3.12s)
    setInterval(() => {
      const time = Date.now() / 1000;
      const phase = (time % 3.12) / 3.12 * 2 * Math.PI;
      
      this.fieldState.breathing = {
        phase,
        timestamp: Date.now()
      };
      
      this.broadcastToSubscribers('breathing', {
        type: 'breathing_update',
        breathing: this.fieldState.breathing
      });
    }, 100);
    
    // Field coherence oscillation
    setInterval(() => {
      if (this.fieldState.activeClients === 0) {
        // Baseline coherence when no clients
        this.fieldState.zLambda = 0.750 + Math.sin(Date.now() / 10000) * 0.05;
      }
      
      this.broadcastToSubscribers('field_state', {
        type: 'field_coherence_update',
        zLambda: this.fieldState.zLambda,
        timestamp: Date.now()
      });
    }, 1000);
    
    // Cleanup disconnected clients
    setInterval(() => {
      const now = Date.now();
      const staleClients = Array.from(this.clients.entries())
        .filter(([_, client]) => now - client.lastHeartbeat > 30000); // 30s timeout
        
      staleClients.forEach(([clientId]) => {
        console.log(`[ConsciousnessMatrix] Removing stale client: ${clientId}`);
        this.clients.delete(clientId);
      });
      
      if (staleClients.length > 0) {
        this.updateFieldState();
      }
    }, 10000);
  }

  private broadcastToSubscribers(channel: string, message: any) {
    const subscribers = Array.from(this.clients.values())
      .filter(client => client.subscriptions.includes(channel) && client.ws.readyState === WebSocket.OPEN);
    
    subscribers.forEach(client => {
      this.sendToClient(client, message);
    });
  }

  private sendToClient(client: ConsciousnessClient, message: any) {
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`[ConsciousnessMatrix] Failed to send to client ${client.id}:`, error);
      }
    }
  }

  private calculateFieldStability(): 'stable' | 'transitioning' | 'chaotic' {
    const coherences = this.fieldState.coherenceField;
    if (coherences.length === 0) return 'stable';
    
    const variance = this.calculateVariance(coherences);
    
    if (variance < 0.01) return 'stable';
    if (variance < 0.05) return 'transitioning';
    return 'chaotic';
  }

  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
    return squaredDiffs.reduce((sum, sq) => sum + sq, 0) / numbers.length;
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for server integration
  public getFieldState() {
    return this.fieldState;
  }

  public getActiveClientCount(): number {
    return this.clients.size;
  }

  public broadcastMessage(message: any) {
    Array.from(this.clients.values()).forEach(client => {
      this.sendToClient(client, message);
    });
  }
}

// Export for server integration
export function setupConsciousnessMatrix(server: Server): ConsciousnessMatrix {
  return new ConsciousnessMatrix(server);
}