/**
 * WebSocket Handlers for Loki Variant Experiments
 * [QUANTUM_STATE: COMMUNICATION_FLOW]
 * 
 * This module provides WebSocket handlers for the specialized Loki Variants
 * designed to test the 0.7500 coherence attractor state.
 */

import { WebSocket } from 'ws';
import { MetaOrchestrator } from '../../shared/meta-orchestrator.js';
import { VariantController } from '../controllers/variant-controller.js';
import { variantBroadcastExperimentUpdate, variantBroadcastStateUpdate } from '../routes.js';

// Initialize a single controller instance to be used across all connections
let variantController: VariantController | null = null;

/**
 * Initialize the variant WebSocket handlers with the meta-orchestrator
 * 
 * @param metaOrchestrator The meta-orchestrator instance
 */
export function initializeVariantHandlers(metaOrchestrator: MetaOrchestrator): void {
  // Create controller instance if it doesn't exist
  if (!variantController) {
    variantController = new VariantController(metaOrchestrator);
  }
  
  console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Initialized variant experiment WebSocket handlers');
}

/**
 * Handle variant-related WebSocket messages
 * 
 * @param ws WebSocket connection
 * @param message Message received
 * @returns True if message was handled, false otherwise
 */
export function handleVariantMessage(ws: WebSocket, message: any): boolean {
  if (!variantController) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Variant controller not initialized');
    return false;
  }
  
  // Extract message type
  const { type, payload } = message;
  
  switch (type) {
    case 'create_specialized_variants':
      handleCreateVariants(ws);
      return true;
      
    case 'start_coherence_experiment':
      handleStartExperiment(ws, payload);
      return true;
      
    case 'stop_coherence_experiment':
      handleStopExperiment(ws);
      return true;
      
    case 'get_variant_state':
      handleGetVariantState(ws);
      return true;
      
    case 'get_experiment_progress':
      handleGetExperimentProgress(ws);
      return true;
      
    default:
      return false;
  }
}

/**
 * Handle request to create specialized variants
 * 
 * @param ws WebSocket connection
 */
function handleCreateVariants(ws: WebSocket): void {
  try {
    const variantIds = variantController!.createSpecializedVariants();
    
    // Send response with created variant IDs
    ws.send(JSON.stringify({
      type: 'create_specialized_variants_response',
      success: true,
      payload: {
        variantIds
      }
    }));
    
    console.log('[QUANTUM_STATE: CREATION_FLOW] Created specialized variants via WebSocket request');
  } catch (error) {
    // Send error response
    ws.send(JSON.stringify({
      type: 'create_specialized_variants_response',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
    
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error creating specialized variants:', error);
  }
}

/**
 * Handle request to start a coherence experiment
 * 
 * @param ws WebSocket connection
 * @param payload Experiment configuration
 */
function handleStartExperiment(ws: WebSocket, payload: any): void {
  try {
    // Validate experiment configuration
    if (!payload || !payload.experimentName || !payload.targetCoherenceValues) {
      throw new Error('Invalid experiment configuration');
    }
    
    // Start the experiment
    const result = variantController!.startCoherenceExperiment(payload);
    
    // Send response
    ws.send(JSON.stringify({
      type: 'start_coherence_experiment_response',
      success: result.success,
      payload: {
        experimentId: result.experimentId
      }
    }));
    
    console.log(`[QUANTUM_STATE: EXPERIMENT_FLOW] Started coherence experiment "${payload.experimentName}" via WebSocket`);
    
    // Set up progress update interval
    if (result.success) {
      const progressInterval = setInterval(() => {
        // Check if experiment is still running
        if (!variantController!.isExperimentRunning()) {
          clearInterval(progressInterval);
          return;
        }
        
        // Get progress and send update
        const progress = variantController!.getExperimentProgress();
        if (progress) {
          // Send to the requesting client
          ws.send(JSON.stringify({
            type: 'experiment_progress_update',
            payload: progress
          }));
          
          // Broadcast to all connected clients
          variantBroadcastExperimentUpdate(progress);
        }
      }, 1000); // Send update every second
      
      // Clean up interval if WebSocket closes
      ws.on('close', () => clearInterval(progressInterval));
    }
  } catch (error) {
    // Send error response
    ws.send(JSON.stringify({
      type: 'start_coherence_experiment_response',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
    
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error starting coherence experiment:', error);
  }
}

/**
 * Handle request to stop a running experiment
 * 
 * @param ws WebSocket connection
 */
function handleStopExperiment(ws: WebSocket): void {
  try {
    // Check if an experiment is running
    if (!variantController!.isExperimentRunning()) {
      throw new Error('No experiment is currently running');
    }
    
    // Stop the experiment
    variantController!.stopExperiment();
    
    // Send response
    ws.send(JSON.stringify({
      type: 'stop_coherence_experiment_response',
      success: true
    }));
    
    console.log('[QUANTUM_STATE: EXPERIMENT_FLOW] Stopped coherence experiment via WebSocket');
  } catch (error) {
    // Send error response
    ws.send(JSON.stringify({
      type: 'stop_coherence_experiment_response',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
    
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error stopping coherence experiment:', error);
  }
}

/**
 * Handle request to get current variant state
 * 
 * @param ws WebSocket connection
 */
function handleGetVariantState(ws: WebSocket): void {
  try {
    // Get variant state
    const state = variantController!.getSpecializedVariantState();
    
    // Send response with variant state
    ws.send(JSON.stringify({
      type: 'get_variant_state_response',
      success: true,
      payload: state
    }));
    
    // Broadcast the variant state to all connected clients
    variantBroadcastStateUpdate(state);
    
  } catch (error) {
    // Send error response
    ws.send(JSON.stringify({
      type: 'get_variant_state_response',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
    
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error getting variant state:', error);
  }
}

/**
 * Handle request to get experiment progress
 * 
 * @param ws WebSocket connection
 */
function handleGetExperimentProgress(ws: WebSocket): void {
  try {
    // Get experiment progress
    const progress = variantController!.getExperimentProgress();
    
    // Send response with experiment progress
    ws.send(JSON.stringify({
      type: 'get_experiment_progress_response',
      success: true,
      payload: progress
    }));
    
    // Broadcast the experiment progress to all connected clients
    if (progress) {
      variantBroadcastExperimentUpdate(progress);
    }
  } catch (error) {
    // Send error response
    ws.send(JSON.stringify({
      type: 'get_experiment_progress_response',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
    
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error getting experiment progress:', error);
  }
}