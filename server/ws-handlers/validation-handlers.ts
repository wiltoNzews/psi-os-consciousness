/**
 * WebSocket Validation Handlers
 * 
 * Handlers for the validation process that allow external testing tools
 * to trigger cycles and collect metrics for validation purposes.
 * 
 * [QUANTUM_STATE: VALIDATION_FLOW]
 */

import { MetaOrchestrator } from '../../shared/meta-orchestrator.js';
import { CoherenceValidationHandler } from '../validation/coherence-validation-handler.js';
import { CoherenceMonitor } from '../../shared/coherence-monitor.js';

/**
 * Validation request payload
 */
interface ValidationRequest {
  validation: boolean;
  cycle: number;
}

/**
 * Register validation handlers
 */
export function registerValidationHandlers(
  wsHandlers: Map<string, Function>,
  metaOrchestrator: MetaOrchestrator
): void {
  console.log('[QUANTUM_STATE: VALIDATION_FLOW] Registering validation WebSocket handlers');

  // Handler for validation cycle triggers
  wsHandlers.set('trigger_cycle', async (payload: ValidationRequest, clientId: string) => {
    try {
      if (!payload || !payload.validation) {
        return { success: false, message: 'Invalid validation payload' };
      }
      
      console.log(`[QUANTUM_STATE: VALIDATION_FLOW] Received validation cycle trigger: ${payload.cycle}`);
      
      // Run a cycle in the orchestrator
      const systemState = await metaOrchestrator.runCycle();
      
      // Collect and send additional metrics for validation purposes
      const variants = metaOrchestrator.getVariants();
      const metrics = {
        variantCount: variants.length,
        systemMetrics: metaOrchestrator.getSystemMetrics(),
        validationCycle: payload.cycle,
        timestamp: Date.now()
      };
      
      return {
        success: true,
        metrics,
        validationEvent: {
          type: 'cycle_completed',
          cycle: payload.cycle,
          metrics: {
            variantCount: variants.length,
            qctf: systemState.metrics.CTF,
            timestamp: Date.now()
          }
        }
      };
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error in validation cycle trigger:', error);
      return {
        success: false,
        error: `Error in validation cycle: ${error instanceof Error ? error.message : 'Unknown error'}`,
        source: 'validation_handler',
        timestamp: Date.now()
      };
    }
  });

  // Handler for retrieving detailed validation state
  wsHandlers.set('validation_get_state', async (payload: any, clientId: string) => {
    try {
      // Get complete system state for validation purposes
      const systemState = metaOrchestrator.getSystemState();
      // Get variants instead of plugins/actions which don't exist in current API
      
      // Create a comprehensive snapshot for validation
      const validationState = {
        systemState: {
          coherence: systemState.coherence,
          qctf: systemState.qctf,
          stabilityFactor: systemState.stabilityFactor,
          timestamp: systemState.timestamp
        },
        variants: metaOrchestrator.getVariants(),
        plugins: [],
        recentActions: [],
        timestamp: Date.now()
      };
      
      return {
        success: true,
        validationState
      };
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error retrieving validation state:', error);
      return {
        success: false,
        error: `Error retrieving validation state: ${error instanceof Error ? error.message : 'Unknown error'}`,
        source: 'validation_handler',
        timestamp: Date.now()
      };
    }
  });
  
  console.log('[QUANTUM_STATE: VALIDATION_FLOW] Validation WebSocket handlers registered successfully');
}

/**
 * Entry point for validation handler registration
 */
export default function initValidationHandlers(wsHandlers: Map<string, Function>, metaOrchestrator: MetaOrchestrator): void {
  registerValidationHandlers(wsHandlers, metaOrchestrator);
  
  // Initialize coherence validation handler
  const coherenceMonitor = new CoherenceMonitor();
  const coherenceValidationHandler = new CoherenceValidationHandler(metaOrchestrator, coherenceMonitor);
  coherenceValidationHandler.registerWithMetaOrchestrator();
  
  console.log('[QUANTUM_STATE: VALIDATION_FLOW] Coherence validation handler initialized');
}