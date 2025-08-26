/**
 * WebSocketServer for OROBORO NEXUS
 * 
 * Provides real-time updates on processing status, system metrics,
 * and other events to connected clients.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import WebSocket from 'ws';
import http from 'http';
import { CostMonitoringDashboard } from './CostMonitoringDashboard.js';
import { AdaptiveBudgetForecaster } from './AdaptiveBudgetForecaster.js';
import { BatchProcessor } from './BatchProcessor.js';
import { ChronosDateHandler } from './utils/chronos-date-handler.js';

export class WebSocketServer {
  private wss: WebSocket.Server;
  private clients: Map<WebSocket, { subscriptions: Set<string>, jobId?: string }>;
  private metricsInterval: NodeJS.Timeout | null = null;
  private costDashboard: CostMonitoringDashboard;
  private budgetForecaster: AdaptiveBudgetForecaster;
  
  constructor(server: http.Server) {
    this.wss = new WebSocket.Server({ server, path: '/ws' });
    this.clients = new Map();
    this.costDashboard = new CostMonitoringDashboard();
    this.budgetForecaster = new AdaptiveBudgetForecaster();
    
    this.initialize();
  }
  
  /**
   * Initialize the WebSocket server
   */
  private initialize(): void {
    // Handle new connections
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection established');
      
      // Initialize client record
      this.clients.set(ws, { subscriptions: new Set(['system_metrics']) });
      
      // Send initial system metrics
      this.sendSystemMetrics(ws);
      
      // Handle messages from clients
      ws.on('message', (message: WebSocket.Data) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleClientMessage(ws, data);
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      });
      
      // Handle client disconnection
      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(ws);
      });
    });
    
    // Start sending periodic system metrics
    this.startMetricsUpdates();
  }
  
  /**
   * Handle messages from clients
   */
  private handleClientMessage(ws: WebSocket, data: any): void {
    console.log('Processing WebSocket message of type:', data.type, 'from client', data.payload?.clientId || 'unknown');
    
    // Handle connected messages from new clients
    if (data.type === 'connected') {
      console.log('Client connected:', data.payload?.clientId || 'unknown');
      // Send a welcome message back
      this.sendToClient(ws, {
        type: 'connected',
        success: true,
        payload: {
          clientId: data.payload?.clientId || `client-${Date.now()}`,
          timestamp: Date.now()
        }
      });
    }
    // Handle subscription requests
    else if (data.type === 'subscribe') {
      const clientData = this.clients.get(ws);
      if (clientData) {
        // Add subscriptions
        data.topics.forEach((topic: string) => {
          clientData.subscriptions.add(topic);
        });
        
        // Store job ID if provided
        if (data.jobId) {
          clientData.jobId = data.jobId;
        }
        
        // Acknowledge subscription
        this.sendToClient(ws, {
          type: 'subscribe_response',
          success: true,
          payload: {
            success: true,
            message: 'Subscription updated',
            subscribed: Array.from(clientData.subscriptions)
          }
        });
      }
    }
    // Handle ping messages (respond with pong)
    else if (data.type === 'ping') {
      this.sendToClient(ws, {
        type: 'ping_response',
        success: true,
        payload: {
          timestamp: Date.now(),
          message: 'pong'
        }
      });
    }
    // Handle get_system_metrics request
    else if (data.type === 'get_system_metrics') {
      this.sendSystemMetrics(ws);
    }
    // Handle get_job_status request
    else if (data.type === 'get_job_status') {
      this.sendToClient(ws, {
        type: 'job_status',
        timestamp: ChronosDateHandler.createDate().toISOString(),
        payload: {
          activeJobs: this.countActiveJobs(),
          recentJobs: [], // This would be populated with actual job data
          status: 'operational',
          timestamp: ChronosDateHandler.createDate().toISOString()
        }
      });
    }
    // Handle test messages (echo back with additional info)
    else if (data.type === 'test') {
      this.sendToClient(ws, {
        type: 'test_response',
        timestamp: ChronosDateHandler.createDate().toISOString(),
        payload: {
          received: data.payload,
          serverInfo: {
            time: ChronosDateHandler.createDate().toISOString(),
            connections: this.clients.size,
            status: 'healthy'
          }
        }
      });
    }
  }
  
  /**
   * Start sending periodic system metrics
   */
  private startMetricsUpdates(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    
    this.metricsInterval = setInterval(() => {
      this.broadcastSystemMetrics();
    }, 5000);
  }
  
  /**
   * Send system metrics to all subscribed clients
   */
  private broadcastSystemMetrics(): void {
    // Generate system metrics
    const metrics = this.generateSystemMetrics();
    
    // Send to all clients subscribed to system_metrics
    for (const [client, data] of this.clients.entries()) {
      if (data.subscriptions.has('system_metrics')) {
        this.sendToClient(client, metrics);
      }
    }
  }
  
  /**
   * Generate system metrics message
   */
  private generateSystemMetrics(): any {
    // Get current metrics from various components
    const systemStability = Math.random() * 0.2 + 0.8; // Placeholder until real implementation
    const nodeSynergy = Math.random() * 0.3 + 0.7; // Placeholder
    const globalCoherence = Math.random() * 0.3 + 0.7; // Placeholder
    const activeJobs = this.countActiveJobs();
    const batchSize = BatchProcessor.getCurrentBatchSize() || 0;
    
    return {
      type: 'system_metrics',
      timestamp: ChronosDateHandler.createDate().toISOString(),
      metrics: {
        systemStability,
        nodeSynergy,
        globalCoherence,
        activeJobs,
        batchSize,
        costStats: {
          today: this.costDashboard.getTodayCost() || 0,
          total: this.costDashboard.getTotalCost() || 0,
          savings: this.costDashboard.getTotalSavings() || 0
        },
        budget: {
          current: this.budgetForecaster.getCurrentBudget() || 500,
          projected: this.budgetForecaster.getProjectedCost() || 0,
          status: this.budgetForecaster.getBudgetStatus() || 'healthy'
        }
      }
    };
  }
  
  /**
   * Send system metrics to a specific client
   */
  private sendSystemMetrics(ws: WebSocket): void {
    const metrics = this.generateSystemMetrics();
    this.sendToClient(ws, metrics);
  }
  
  /**
   * Get count of active jobs
   */
  private countActiveJobs(): number {
    // This would be replaced with actual job tracking
    return 0;
  }
  
  /**
   * Publish a job update to interested clients
   */
  public publishJobUpdate(jobId: string, status: string, stage: string, progress: number, metrics?: any): void {
    // Create the job update message
    const message = {
      type: 'job_update',
      jobId,
      stage,
      status,
      progress,
      timestamp: ChronosDateHandler.createDate().toISOString(),
      metrics: metrics || {}
    };
    
    // Send to all clients subscribed to job_updates for this specific job
    for (const [client, data] of this.clients.entries()) {
      if (
        data.subscriptions.has('job_updates') && 
        (!data.jobId || data.jobId === jobId)
      ) {
        this.sendToClient(client, message);
      }
    }
  }
  
  /**
   * Send a message to a specific client
   */
  private sendToClient(client: WebSocket, message: any): void {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
  
  /**
   * Broadcast a message to all connected clients
   */
  public broadcast(message: any): void {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  /**
   * Stop the WebSocket server
   */
  public stop(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    
    this.wss.close();
  }
}

// Export singleton instance creator
export function createWebSocketServer(server: http.Server): WebSocketServer {
  return new WebSocketServer(server);
}