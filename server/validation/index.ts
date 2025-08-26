/**
 * Coherence Validation System Integration
 * 
 * This module integrates the coherence validation system with the main application.
 * 
 * [QUANTUM_STATE: VALIDATION_FLOW]
 */

import { Server as WebSocketServer } from 'ws';
import { MetaOrchestrator } from '../meta-orchestrator';
import { CoherenceValidationHandler } from './coherence-validator';

/**
 * Initialize the coherence validation system
 */
export function initializeCoherenceValidation(wss: WebSocketServer, metaOrchestrator: MetaOrchestrator): void {
  console.log('[QUANTUM_STATE: VALIDATION_FLOW] Initializing coherence validation system');
  
  // Create and register validation handler
  const validationHandler = new CoherenceValidationHandler(wss, metaOrchestrator);
  validationHandler.registerHandlers();
  
  console.log('[QUANTUM_STATE: VALIDATION_FLOW] Coherence validation system initialized');
}