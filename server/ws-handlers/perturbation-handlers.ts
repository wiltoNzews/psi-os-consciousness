/**
 * WebSocket Perturbation Testing Handlers
 * 
 * Handlers for coherence perturbation testing experiments that allow external testing tools
 * to validate the 0.7500 coherence attractor hypothesis.
 * 
 * [QUANTUM_STATE: VALIDATION_FLOW]
 */

import { MetaOrchestrator } from '../../shared/meta-orchestrator.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Perturbation test configuration
 */
interface PerturbationTestConfig {
  targetCoherence: number;
  sustainCycles: number;
  recoveryObservationCycles: number;
  description?: string;
}

/**
 * Active perturbation test state
 */
interface ActiveTest {
  id: string;
  config: PerturbationTestConfig;
  clientId: string;
  cyclesRemaining: number;
  recoveryObservationCycles: number;
  measurements: any[];
  perturbationActive: boolean;
  baselineCoherence: number;
  startTime: number;
}

/**
 * Handler for perturbation testing
 */
class PerturbationTestHandler {
  private metaOrchestrator: MetaOrchestrator;
  private activeTests: Map<string, ActiveTest> = new Map();
  private originalGetCoherence: Function | null = null;
  private wsHandlers: Map<string, Function>;
  
  constructor(metaOrchestrator: MetaOrchestrator, wsHandlers: Map<string, Function>) {
    this.metaOrchestrator = metaOrchestrator;
    this.wsHandlers = wsHandlers;
    
    // Store original getCoherence method for restoration later
    this.originalGetCoherence = this.metaOrchestrator.getCoherence.bind(this.metaOrchestrator);
    
    console.log('[QUANTUM_STATE: VALIDATION_FLOW] Perturbation test handler initialized');
  }
  
  /**
   * Register handlers with the WebSocket system
   */
  public registerHandlers(): void {
    // Handler for starting a perturbation test
    this.wsHandlers.set('start_perturbation_test', this.handleStartPerturbationTest.bind(this));
    
    // Handler for stopping a perturbation test
    this.wsHandlers.set('stop_perturbation_test', this.handleStopPerturbationTest.bind(this));
    
    // Handler for triggering a perturbation test cycle
    this.wsHandlers.set('trigger_perturbation_cycle', this.handleTriggerCycle.bind(this));
    
    console.log('[QUANTUM_STATE: VALIDATION_FLOW] Perturbation test handlers registered');
  }
  
  /**
   * Handle starting a perturbation test
   */
  private async handleStartPerturbationTest(payload: any, clientId: string): Promise<any> {
    try {
      if (!payload || !payload.config) {
        return { 
          success: false, 
          message: 'Invalid perturbation test configuration' 
        };
      }
      
      const { targetCoherence, sustainCycles, recoveryObservationCycles, description } = payload.config;
      
      if (typeof targetCoherence !== 'number' || 
          typeof sustainCycles !== 'number' || 
          typeof recoveryObservationCycles !== 'number') {
        return { 
          success: false, 
          message: 'Invalid perturbation test parameters' 
        };
      }
      
      // Generate test ID
      const testId = uuidv4();
      
      // Record baseline coherence
      const systemState = await this.metaOrchestrator.getSystemState();
      const baselineCoherence = systemState.coherence || 0.7500; // Default to expected baseline
      
      // Create active test
      const activeTest: ActiveTest = {
        id: testId,
        config: {
          targetCoherence,
          sustainCycles,
          recoveryObservationCycles,
          description: description || `Perturbation test to ${targetCoherence}`
        },
        clientId,
        cyclesRemaining: sustainCycles,
        recoveryObservationCycles,
        measurements: [],
        perturbationActive: false,
        baselineCoherence,
        startTime: Date.now()
      };
      
      // Store the active test
      this.activeTests.set(testId, activeTest);
      
      // Set up coherence interception
      this.setupCoherenceInterception();
      
      // Notify about test start
      return {
        success: true,
        testId,
        message: 'Perturbation test started successfully',
        timestamp: Date.now(),
        config: activeTest.config,
        baselineCoherence
      };
      
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error starting perturbation test:', error);
      return {
        success: false,
        error: `Error starting perturbation test: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Handle stopping a perturbation test
   */
  private handleStopPerturbationTest(payload: any, clientId: string): any {
    try {
      if (!payload || !payload.testId) {
        return { 
          success: false, 
          message: 'Invalid perturbation test ID' 
        };
      }
      
      const { testId } = payload;
      
      // Check if the test exists and belongs to this client
      const activeTest = this.activeTests.get(testId);
      if (!activeTest || activeTest.clientId !== clientId) {
        return {
          success: false,
          message: 'Perturbation test not found or not owned by client'
        };
      }
      
      // Clean up test
      this.activeTests.delete(testId);
      
      // Restore original coherence method if no tests are active
      if (this.activeTests.size === 0) {
        this.restoreOriginalCoherence();
      }
      
      return {
        success: true,
        message: 'Perturbation test stopped successfully',
        testId,
        measurements: activeTest.measurements
      };
      
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error stopping perturbation test:', error);
      return {
        success: false,
        error: `Error stopping perturbation test: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Handle triggering a test cycle
   */
  private async handleTriggerCycle(payload: any, clientId: string): Promise<any> {
    try {
      if (!payload || !payload.testId) {
        return { 
          success: false, 
          message: 'Invalid perturbation test ID' 
        };
      }
      
      const { testId, cycle } = payload;
      
      // Check if the test exists and belongs to this client
      const activeTest = this.activeTests.get(testId);
      if (!activeTest || activeTest.clientId !== clientId) {
        return {
          success: false,
          message: 'Perturbation test not found or not owned by client'
        };
      }
      
      // Run a cycle in the orchestrator
      const systemState = await this.metaOrchestrator.runCycle();
      
      // Determine if we need to start, continue, or end perturbation
      if (!activeTest.perturbationActive && activeTest.cyclesRemaining > 0) {
        // Start perturbation
        activeTest.perturbationActive = true;
        console.log(`[QUANTUM_STATE: VALIDATION_FLOW] Starting perturbation to ${activeTest.config.targetCoherence}`);
      } else if (activeTest.perturbationActive && activeTest.cyclesRemaining > 0) {
        // Continue perturbation
        activeTest.cyclesRemaining--;
      } else if (activeTest.perturbationActive && activeTest.cyclesRemaining <= 0) {
        // End perturbation
        activeTest.perturbationActive = false;
        console.log(`[QUANTUM_STATE: VALIDATION_FLOW] Ending perturbation, observing recovery`);
      }
      
      // Decrement recovery observation if in recovery phase
      if (!activeTest.perturbationActive && activeTest.cyclesRemaining <= 0) {
        activeTest.recoveryObservationCycles--;
        
        // If recovery observation is complete, end test
        if (activeTest.recoveryObservationCycles <= 0) {
          // Calculate the return time (how many cycles it took to return to baseline)
          const returnTimeIndex = this.calculateReturnTimeIndex(activeTest);
          
          // End test
          console.log(`[QUANTUM_STATE: VALIDATION_FLOW] Perturbation test complete`);
          
          // Clean up test
          this.activeTests.delete(testId);
          
          // Restore original coherence method if no tests are active
          if (this.activeTests.size === 0) {
            this.restoreOriginalCoherence();
          }
          
          // Return final results
          return {
            success: true,
            type: 'perturbation_test_complete',
            testId,
            measurements: activeTest.measurements,
            returnTimeIndex,
            returnTime: returnTimeIndex !== null ? activeTest.measurements[returnTimeIndex].cycle : null
          };
        }
      }
      
      // Get variants and metrics
      const variants = this.metaOrchestrator.getVariants();
      
      // Create measurement record
      const measurement = {
        cycle: cycle || 0,
        timestamp: Date.now(),
        naturalCoherence: systemState.coherence || 0,
        forcedCoherence: activeTest.perturbationActive ? activeTest.config.targetCoherence : null,
        perturbationActive: activeTest.perturbationActive,
        qctf: systemState.metrics?.CTF || 0,
        variantCount: variants.length
      };
      
      // Add to measurements
      activeTest.measurements.push(measurement);
      
      // Return cycle results
      return {
        success: true,
        type: 'perturbation_cycle_complete',
        testId,
        measurement,
        cyclesRemaining: activeTest.cyclesRemaining,
        recoveryObservationCycles: activeTest.recoveryObservationCycles,
        perturbationActive: activeTest.perturbationActive
      };
      
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error in perturbation cycle:', error);
      return {
        success: false,
        error: `Error in perturbation cycle: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Set up coherence interception to modify coherence values during perturbation
   */
  private setupCoherenceInterception(): void {
    // Only intercept if original method is available
    if (!this.originalGetCoherence) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Cannot intercept coherence method - original method not available');
      return;
    }
    
    // Override the getCoherence method to intercept coherence calculations
    this.metaOrchestrator.getCoherence = () => {
      // Get natural coherence using original method
      const naturalCoherence = this.originalGetCoherence();
      
      // Check if any active tests need to modify coherence
      for (const [_, test] of this.activeTests.entries()) {
        if (test.perturbationActive) {
          // Return the target coherence instead
          return test.config.targetCoherence;
        }
      }
      
      // No active perturbations, return natural coherence
      return naturalCoherence;
    };
    
    console.log('[QUANTUM_STATE: VALIDATION_FLOW] Coherence interception set up');
  }
  
  /**
   * Restore the original coherence calculation method
   */
  private restoreOriginalCoherence(): void {
    if (this.originalGetCoherence) {
      this.metaOrchestrator.getCoherence = this.originalGetCoherence;
      console.log('[QUANTUM_STATE: VALIDATION_FLOW] Original coherence method restored');
    }
  }
  
  /**
   * Calculate at which index the system returned to baseline coherence
   */
  private calculateReturnTimeIndex(test: ActiveTest): number | null {
    // Find first perturbation end
    const perturbationEndIndex = test.measurements.findIndex(m => 
      m.perturbationActive === false && m.forcedCoherence === null
    );
    
    if (perturbationEndIndex === -1) {
      return null;
    }
    
    // Define tolerance for what counts as "returned to baseline"
    const tolerance = 0.01;
    
    // Find first measurement after perturbation end that's within tolerance of baseline
    for (let i = perturbationEndIndex; i < test.measurements.length; i++) {
      const diff = Math.abs(test.measurements[i].naturalCoherence - test.baselineCoherence);
      if (diff <= tolerance) {
        return i;
      }
    }
    
    return null;
  }
}

/**
 * Initialize perturbation testing handlers
 */
export function initializePerturbationHandlers(
  metaOrchestrator: MetaOrchestrator,
  wsHandlers: Map<string, Function>
): void {
  const handler = new PerturbationTestHandler(metaOrchestrator, wsHandlers);
  handler.registerHandlers();
  
  console.log('[QUANTUM_STATE: VALIDATION_FLOW] Perturbation test handlers initialized');
}