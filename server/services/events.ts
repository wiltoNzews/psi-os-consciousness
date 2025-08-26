/**
 * Centralized event broadcasting service
 * 
 * This module provides functions for broadcasting WebSocket events to all connected clients
 * without creating circular dependencies between modules.
 */

import WebSocket from 'ws';
import { activeConnections } from '../routes.js';
import { neuralOrchestrationEngine } from './neural-orchestrator/neural-orchestration-engine.js';
import { metaCognitiveEngine } from './qrn/meta-cognitive-analysis-engine.js';

/**
 * Broadcast system status update to all connected WebSocket clients
 */
export function broadcastSystemStatus() {
  console.log(`Broadcasting system status update to all clients`);
  
  try {
    // Get the current neural orchestration engine status
    const noeStatus = {
      ...(neuralOrchestrationEngine?.getStatistics?.() || {}),
      modelTypes: neuralOrchestrationEngine?.getAvailableModelTypes?.() || [],
      activeModels: (neuralOrchestrationEngine?.getAvailableModelTypes?.() || []).length,
      isReady: true,
      timestamp: new Date()
    };
    
    // Get the meta-cognitive engine status
    const mceStatus = {
      isReady: true,
      patternCount: metaCognitiveEngine?.getPatterns?.().length || 0,
      insightCount: metaCognitiveEngine?.getInsights?.().length || 0,
      timestamp: new Date()
    };
    
    // Convert Map.entries() to Array to avoid downlevelIteration flag issues
    Array.from(activeConnections.entries()).forEach((entry) => {
      const clientId = entry[0];
      const ws = entry[1];
      if (ws.readyState === WebSocket.OPEN) {
        // Send Neural Orchestration Engine Status
        ws.send(JSON.stringify({
          type: 'engine_status_update',
          payload: { 
            engine: 'neural_orchestration',
            status: noeStatus
          }
        }));
        
        // Send Meta-Cognitive Engine Status
        ws.send(JSON.stringify({
          type: 'engine_status_update',
          payload: { 
            engine: 'meta_cognitive',
            status: mceStatus
          }
        }));
        
        console.log(`System status update sent to client ${clientId}`);
      }
    });
  } catch (error) {
    console.error('Error broadcasting system status:', error);
  }
}