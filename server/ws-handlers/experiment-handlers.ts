/**
 * WebSocket Handlers for Coherence Attractor Experiment
 * 
 * These handlers support the coherence attractor experiment by allowing
 * controlled perturbation of the system coherence value.
 * 
 * [QUANTUM_STATE: EXPERIMENTAL_FLOW]
 */

import { WebSocket } from 'ws';
import { MetaOrchestrator } from '../../shared/meta-orchestrator.js';
import { IExperimentalVariantManager } from '../types.js';
import * as crypto from 'crypto';

/**
 * State for coherence override
 */
interface CoherenceOverrideState {
  active: boolean;
  value: number | null;
  expiresAt: number | null; // Timestamp when override expires
  experimentName: string;
  phase: string;
  target: number | null;
  repetition: number | null;
}

/**
 * Experimental variant manager implementation
 * 
 * This class provides methods to control the coherence value for experimental purposes.
 */
export class ExperimentalVariantManager implements IExperimentalVariantManager {
  private coherenceOverride: CoherenceOverrideState = {
    active: false,
    value: null,
    expiresAt: null,
    experimentName: '',
    phase: '',
    target: null,
    repetition: null
  };

  /**
   * Override the coherence value for a specified duration
   * 
   * @param value The coherence value to force
   * @param duration Duration in milliseconds for the override to remain active
   */
  public overrideCoherence(value: number, duration: number = 5000): void {
    console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Setting coherence override to ${value.toFixed(6)} for ${duration}ms`);
    
    // Validate input value
    const safeValue = Math.max(0, Math.min(1, value));
    
    // Set the override
    this.coherenceOverride.active = true;
    this.coherenceOverride.value = safeValue;
    this.coherenceOverride.expiresAt = Date.now() + duration;
    
    // Schedule automatic clearing
    setTimeout(() => {
      // Only clear if it's still the same experiment session
      if (this.coherenceOverride.active && this.coherenceOverride.value === safeValue) {
        console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Coherence override expired`);
        this.clearCoherenceOverride();
      }
    }, duration);
  }

  /**
   * Clear any active coherence override
   */
  public clearCoherenceOverride(): void {
    console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Clearing coherence override`);
    this.coherenceOverride.active = false;
    this.coherenceOverride.value = null;
    this.coherenceOverride.expiresAt = null;
  }

  /**
   * Set experiment metadata
   * 
   * @param experimentName Name of the current experiment
   * @param phase Current phase of the experiment
   * @param target Target coherence value (if applicable)
   * @param repetition Current repetition number
   */
  public setExperimentInfo(experimentName: string, phase: string, target: number | null, repetition: number | null): void {
    this.coherenceOverride.experimentName = experimentName;
    this.coherenceOverride.phase = phase;
    this.coherenceOverride.target = target;
    this.coherenceOverride.repetition = repetition;
    
    console.log(`[QUANTUM_STATE: EXPERIMENTAL_FLOW] Experiment info updated: ${experimentName}, phase: ${phase}, target: ${target}, rep: ${repetition}`);
  }

  /**
   * Check if a coherence override is currently active
   * 
   * @returns True if there is an active override
   */
  public isCoherenceOverrideActive(): boolean {
    // Check if override has expired
    if (this.coherenceOverride.active && this.coherenceOverride.expiresAt !== null) {
      if (Date.now() > this.coherenceOverride.expiresAt) {
        // Auto-clear if expired
        this.clearCoherenceOverride();
        return false;
      }
    }
    
    return this.coherenceOverride.active;
  }

  /**
   * Get the current override value (if active)
   * 
   * @returns The override value or null if no override is active
   */
  public getCoherenceOverride(): number | null {
    if (!this.isCoherenceOverrideActive()) {
      return null;
    }
    
    return this.coherenceOverride.value;
  }

  /**
   * Get current experiment information
   * 
   * @returns Object containing experiment metadata
   */
  public getExperimentInfo(): { experimentName: string, phase: string, target: number | null, repetition: number | null } {
    return {
      experimentName: this.coherenceOverride.experimentName,
      phase: this.coherenceOverride.phase,
      target: this.coherenceOverride.target,
      repetition: this.coherenceOverride.repetition
    };
  }
}

/**
 * Register experiment-related message handlers for WebSockets
 * 
 * @param wss WebSocket server
 * @param metaOrchestrator The meta orchestrator instance
 */
export function registerExperimentHandlers(
  wss: any,
  metaOrchestrator: MetaOrchestrator
): ExperimentalVariantManager {
  // Create the experimental variant manager
  const experimentalManager = new ExperimentalVariantManager();
  
  // Set it on the meta orchestrator
  metaOrchestrator.setExperimentalManager(experimentalManager);
  
  // Define the handler for experiment-related messages
  const handleExperimentMessages = (ws: WebSocket, message: any) => {
    try {
      // Check if it's one of our experiment-related messages
      switch (message.type) {
        case 'override_coherence':
          handleOverrideCoherence(ws, message.payload);
          return true;
          
        case 'clear_override':
          handleClearOverride(ws, message.payload);
          return true;
          
        case 'experiment_info':
          handleSetExperimentInfo(ws, message.payload);
          return true;
          
        case 'start_experiment':
          // TODO: Implement full experiment automation
          sendSuccessResponse(ws, 'experiment_started', {
            name: message.payload.name,
            timestamp: Date.now()
          });
          return true;
          
        default:
          return false;
      }
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Error handling experiment message:`, error);
      sendErrorResponse(ws, 'experiment_error', `Failed to process experiment message: ${error}`);
      return true; // We handled it (with an error)
    }
  };
  
  // Add the handler to the meta orchestrator
  metaOrchestrator.addMessageHandler(handleExperimentMessages);
  
  // Handler functions for specific message types
  const handleOverrideCoherence = (ws: WebSocket, payload: any) => {
    try {
      // Validate payload
      if (typeof payload.value !== 'number') {
        throw new Error('Override value must be a number');
      }
      
      // Apply the override
      const duration = typeof payload.duration === 'number' ? payload.duration : 5000;
      experimentalManager.overrideCoherence(payload.value, duration);
      
      // Send success response
      sendSuccessResponse(ws, 'override_set', {
        value: payload.value,
        duration: duration,
        expiresAt: Date.now() + duration
      });
      
      // Broadcast experiment info to all clients
      const experimentInfo = experimentalManager.getExperimentInfo();
      if (wss && typeof wss.broadcast === 'function') {
        wss.broadcast('experiment_info', {
          active: true,
          ...experimentInfo
        });
      }
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Error setting coherence override:`, error);
      sendErrorResponse(ws, 'override_error', `Failed to set coherence override: ${error}`);
    }
  };
  
  const handleClearOverride = (ws: WebSocket, payload: any) => {
    try {
      // Clear the override
      experimentalManager.clearCoherenceOverride();
      
      // Send success response
      sendSuccessResponse(ws, 'override_cleared', {
        timestamp: Date.now()
      });
      
      // Broadcast experiment info to all clients
      const experimentInfo = experimentalManager.getExperimentInfo();
      if (wss && typeof wss.broadcast === 'function') {
        wss.broadcast('experiment_info', {
          active: false,
          ...experimentInfo
        });
      }
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Error clearing coherence override:`, error);
      sendErrorResponse(ws, 'override_error', `Failed to clear coherence override: ${error}`);
    }
  };
  
  const handleSetExperimentInfo = (ws: WebSocket, payload: any) => {
    try {
      // Validate payload
      if (typeof payload.experimentName !== 'string') {
        throw new Error('Experiment name must be a string');
      }
      
      // Set the experiment info
      experimentalManager.setExperimentInfo(
        payload.experimentName,
        payload.phase || '',
        payload.target !== undefined ? payload.target : null,
        payload.repetition !== undefined ? payload.repetition : null
      );
      
      // Send success response
      sendSuccessResponse(ws, 'experiment_info_set', {
        ...experimentalManager.getExperimentInfo(),
        timestamp: Date.now()
      });
      
      // Broadcast experiment info to all clients
      if (wss && typeof wss.broadcast === 'function') {
        wss.broadcast('experiment_info', {
          active: experimentalManager.isCoherenceOverrideActive(),
          ...experimentalManager.getExperimentInfo()
        });
      }
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Error setting experiment info:`, error);
      sendErrorResponse(ws, 'experiment_info_error', `Failed to set experiment info: ${error}`);
    }
  };
  
  return experimentalManager;
}

/**
 * Send a success response to the client
 * 
 * @param ws WebSocket connection
 * @param type Response type
 * @param payload Response payload
 */
function sendSuccessResponse(ws: WebSocket, type: string, payload: any): void {
  ws.send(JSON.stringify({
    type,
    payload,
    status: 'success',
    id: crypto.randomUUID()
  }));
}

/**
 * Send an error response to the client
 * 
 * @param ws WebSocket connection
 * @param type Response type
 * @param error Error message
 */
function sendErrorResponse(ws: WebSocket, type: string, error: string): void {
  ws.send(JSON.stringify({
    type,
    error,
    status: 'error',
    id: crypto.randomUUID()
  }));
}