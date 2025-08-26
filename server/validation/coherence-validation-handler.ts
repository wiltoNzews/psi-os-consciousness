/**
 * Coherence Validation Handler
 * 
 * This module handles WebSocket requests for coherence validation testing,
 * including perturbation application and monitoring system response.
 * 
 * [QUANTUM_STATE: VALIDATION_FLOW]
 */

import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { MetaOrchestrator } from '../../shared/meta-orchestrator.js';
import { CoherenceMonitor } from '../../shared/coherence-monitor.js';

/**
 * Message to apply a perturbation to the system coherence
 */
interface ApplyPerturbationMessage {
  type: 'apply_perturbation';
  targetCoherence: number;
}

/**
 * Message to release an active perturbation
 */
interface ReleasePerturbationMessage {
  type: 'release_perturbation';
}

/**
 * Message to start a validation test
 */
interface StartValidationTestMessage {
  type: 'start_validation_test';
  testId: string;
  config: {
    targetCoherence: number;
    sustainCycles: number;
    recoveryObservationCycles: number;
    description?: string;
  };
}

/**
 * Message to get the current validation state
 */
interface GetValidationStateMessage {
  type: 'get_validation_state';
}

/**
 * Union type for coherence validation messages
 */
type CoherenceValidationMessage = 
  | ApplyPerturbationMessage 
  | ReleasePerturbationMessage
  | StartValidationTestMessage
  | GetValidationStateMessage;

/**
 * Interface for test measurements
 */
interface TestMeasurement {
  timestamp: number;
  cycle: number;
  naturalCoherence: number;
  forcedCoherence: number | null;
  perturbationActive: boolean;
  qctf: number;
  variantCount: number;
  systemState?: any;
}

/**
 * Interface for active tests
 */
interface ActiveTest {
  id: string;
  targetCoherence: number;
  sustainCycles: number;
  recoveryObservationCycles: number;
  description?: string;
  measurements: TestMeasurement[];
  isRunning: boolean;
  perturbationActive: boolean;
  perturbationStartCycle: number | null;
  returnTime: number | null;
  returnTimeIndex: number | null;
  baselineAttractorTolerance: number;
}

/**
 * Handler for coherence validation WebSocket messages
 */
export class CoherenceValidationHandler {
  private metaOrchestrator: MetaOrchestrator;
  private coherenceMonitor: CoherenceMonitor<any>;
  private activeTests: Map<string, ActiveTest> = new Map();
  private activePerturbation: boolean = false;
  private targetCoherence: number | null = null;
  private originalCoherence: number | null = null;
  private baselineAttractorTolerance: number = 0.0001; // Tolerance for "returned to baseline"
  private baselineCoherence: number = 0.7500; // Expected baseline

  constructor(metaOrchestrator: MetaOrchestrator, coherenceMonitor: CoherenceMonitor<any>) {
    this.metaOrchestrator = metaOrchestrator;
    this.coherenceMonitor = coherenceMonitor;
  }

  /**
   * Handle incoming WebSocket messages for coherence validation
   */
  public handleMessage(message: any, ws: WebSocket): void {
    try {
      if (!message || !message.type) {
        this.sendError(ws, 'Invalid message format');
        return;
      }

      // Handle different message types
      switch (message.type) {
        case 'apply_perturbation':
          this.handleApplyPerturbation(message as ApplyPerturbationMessage, ws);
          break;
        case 'release_perturbation':
          this.handleReleasePerturbation(ws);
          break;
        case 'start_validation_test':
          this.handleStartValidationTest(message as StartValidationTestMessage, ws);
          break;
        case 'get_validation_state':
          this.sendValidationState(ws);
          break;
        default:
          this.sendError(ws, `Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error in coherence validation handler:', error);
      this.sendError(ws, `Error processing message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle a request to apply a perturbation to the system
   */
  private handleApplyPerturbation(message: ApplyPerturbationMessage, ws: WebSocket): void {
    if (this.activePerturbation) {
      this.sendError(ws, 'A perturbation is already active');
      return;
    }

    const targetCoherence = message.targetCoherence;
    if (typeof targetCoherence !== 'number' || targetCoherence < 0 || targetCoherence > 1) {
      this.sendError(ws, 'Invalid target coherence value, must be between 0 and 1');
      return;
    }

    // Store original coherence and apply perturbation
    this.originalCoherence = this.coherenceMonitor.getCoherence();
    this.targetCoherence = targetCoherence;
    this.activePerturbation = true;

    console.log(`[QUANTUM_STATE: VALIDATION_FLOW] Applied coherence perturbation: ${targetCoherence.toFixed(4)}`);

    // Send success response
    ws.send(JSON.stringify({
      type: 'validation_response',
      success: true,
      message: `Perturbation applied, forcing coherence to ${targetCoherence.toFixed(4)}`,
      perturbationActive: true,
      targetCoherence,
      originalCoherence: this.originalCoherence,
      timestamp: Date.now()
    }));
  }

  /**
   * Handle a request to release an active perturbation
   */
  private handleReleasePerturbation(ws: WebSocket): void {
    if (!this.activePerturbation) {
      this.sendError(ws, 'No active perturbation to release');
      return;
    }

    // Release perturbation
    const originalCoherence = this.originalCoherence;
    this.activePerturbation = false;
    this.targetCoherence = null;
    this.originalCoherence = null;

    console.log('[QUANTUM_STATE: VALIDATION_FLOW] Released coherence perturbation');

    // Send success response
    ws.send(JSON.stringify({
      type: 'validation_response',
      success: true,
      message: 'Perturbation released',
      perturbationActive: false,
      originalCoherence,
      timestamp: Date.now()
    }));
  }

  /**
   * Handle starting a new validation test
   */
  private handleStartValidationTest(message: StartValidationTestMessage, ws: WebSocket): void {
    try {
      const { testId, config } = message;
      
      // Validate test configuration
      if (!config || typeof config.targetCoherence !== 'number' || 
          typeof config.sustainCycles !== 'number' || 
          typeof config.recoveryObservationCycles !== 'number') {
        this.sendError(ws, 'Invalid test configuration');
        return;
      }
      
      // Check for existing test with same ID
      if (this.activeTests.has(testId)) {
        this.sendError(ws, `Test with ID ${testId} already exists`);
        return;
      }
      
      // Create new test
      const newTest: ActiveTest = {
        id: testId,
        targetCoherence: config.targetCoherence,
        sustainCycles: config.sustainCycles,
        recoveryObservationCycles: config.recoveryObservationCycles,
        description: config.description,
        measurements: [],
        isRunning: true,
        perturbationActive: false,
        perturbationStartCycle: null,
        returnTime: null,
        returnTimeIndex: null,
        baselineAttractorTolerance: this.baselineAttractorTolerance
      };
      
      this.activeTests.set(testId, newTest);
      
      console.log(`[QUANTUM_STATE: VALIDATION_FLOW] Started validation test ${testId} with target coherence ${config.targetCoherence.toFixed(4)}`);
      
      // Send success response
      ws.send(JSON.stringify({
        type: 'validation_test_started',
        success: true,
        testId,
        config,
        timestamp: Date.now()
      }));
      
      // Start running test cycles
      this.runTestCycle(testId, ws);
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error starting validation test:', error);
      this.sendError(ws, `Error starting test: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Run a test cycle (recursive)
   */
  private async runTestCycle(testId: string, ws: WebSocket): Promise<void> {
    try {
      const test = this.activeTests.get(testId);
      if (!test || !test.isRunning) return;
      
      const cycleNumber = test.measurements.length;
      const totalCycles = test.sustainCycles + test.recoveryObservationCycles;
      
      console.log(`[QUANTUM_STATE: VALIDATION_FLOW] Running test cycle ${cycleNumber + 1}/${totalCycles} for test ${testId}`);
      
      // Get system state before any perturbation
      const naturalCoherence = this.coherenceMonitor.getCoherence();
      const systemState = this.metaOrchestrator.getSystemState();
      const variants = this.metaOrchestrator.getVariants();
      
      // Apply or release perturbation based on cycle number
      if (cycleNumber < test.sustainCycles) {
        if (!test.perturbationActive) {
          // Apply perturbation
          this.originalCoherence = naturalCoherence;
          this.targetCoherence = test.targetCoherence;
          this.activePerturbation = true;
          test.perturbationActive = true;
          test.perturbationStartCycle = cycleNumber;
          
          console.log(`[QUANTUM_STATE: VALIDATION_FLOW] Applied perturbation to ${test.targetCoherence.toFixed(4)} at cycle ${cycleNumber}`);
        }
      } else if (test.perturbationActive) {
        // Release perturbation
        this.activePerturbation = false;
        this.targetCoherence = null;
        this.originalCoherence = null;
        test.perturbationActive = false;
        
        console.log(`[QUANTUM_STATE: VALIDATION_FLOW] Released perturbation at cycle ${cycleNumber}`);
      }
      
      // Record measurement
      const measurement: TestMeasurement = {
        timestamp: Date.now(),
        cycle: cycleNumber,
        naturalCoherence,
        forcedCoherence: test.perturbationActive ? test.targetCoherence : null,
        perturbationActive: test.perturbationActive,
        qctf: systemState.qctf,
        variantCount: variants.length,
        systemState: {
          coherence: systemState.coherence,
          qctf: systemState.qctf,
          stabilityFactor: systemState.stabilityFactor
        }
      };
      
      test.measurements.push(measurement);
      
      // Check for return to baseline if perturbation was released
      if (!test.perturbationActive && test.perturbationStartCycle !== null && test.returnTime === null) {
        // Calculate if system has returned to baseline
        const isReturnedToBaseline = Math.abs(naturalCoherence - this.baselineCoherence) <= test.baselineAttractorTolerance;
        
        if (isReturnedToBaseline) {
          const returnCycle = cycleNumber - test.sustainCycles;
          test.returnTime = returnCycle;
          test.returnTimeIndex = cycleNumber;
          
          console.log(`[QUANTUM_STATE: VALIDATION_FLOW] System returned to baseline after ${returnCycle} cycles`);
        }
      }
      
      // Send update to client
      ws.send(JSON.stringify({
        type: 'validation_test_update',
        testId,
        measurement,
        cycleNumber,
        totalCycles,
        isComplete: cycleNumber >= totalCycles - 1,
        returnTime: test.returnTime,
        returnTimeIndex: test.returnTimeIndex,
        timestamp: Date.now()
      }));
      
      // Check if test is complete
      if (cycleNumber >= totalCycles - 1) {
        test.isRunning = false;
        
        // Send completion message
        ws.send(JSON.stringify({
          type: 'validation_test_complete',
          testId,
          returnTime: test.returnTime,
          measurements: test.measurements.length,
          timestamp: Date.now()
        }));
        
        console.log(`[QUANTUM_STATE: VALIDATION_FLOW] Completed validation test ${testId}`);
        return;
      }
      
      // Run a cycle in the orchestrator
      await this.metaOrchestrator.runCycle();
      
      // Schedule next cycle
      setTimeout(() => this.runTestCycle(testId, ws), 500);
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Error in test cycle for ${testId}:`, error);
      
      const test = this.activeTests.get(testId);
      if (test) {
        test.isRunning = false;
        
        // Clean up perturbation if active
        if (test.perturbationActive) {
          this.activePerturbation = false;
          this.targetCoherence = null;
          this.originalCoherence = null;
          test.perturbationActive = false;
        }
      }
      
      // Send error to client
      ws.send(JSON.stringify({
        type: 'validation_test_error',
        testId,
        error: `Error in test cycle: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      }));
    }
  }
  
  /**
   * Send the current validation state to a client
   */
  private sendValidationState(ws: WebSocket): void {
    const testSummaries = Array.from(this.activeTests.entries()).map(([id, test]) => ({
      id,
      targetCoherence: test.targetCoherence,
      sustainCycles: test.sustainCycles,
      recoveryObservationCycles: test.recoveryObservationCycles,
      description: test.description,
      isRunning: test.isRunning,
      perturbationActive: test.perturbationActive,
      measurementCount: test.measurements.length,
      returnTime: test.returnTime,
      timestamp: Date.now()
    }));
    
    ws.send(JSON.stringify({
      type: 'validation_state',
      activePerturbation: this.activePerturbation,
      targetCoherence: this.targetCoherence,
      activeTests: testSummaries,
      timestamp: Date.now()
    }));
  }
  
  /**
   * Send an error message to a client
   */
  private sendError(ws: WebSocket, message: string): void {
    ws.send(JSON.stringify({
      type: 'validation_error',
      error: message,
      timestamp: Date.now()
    }));
  }

  /**
   * Apply perturbation effect to a calculated coherence value
   * This is called by the coherence monitor to modify coherence when a perturbation is active
   */
  public interceptCoherence(calculatedCoherence: number): number {
    if (this.activePerturbation && this.targetCoherence !== null) {
      return this.targetCoherence;
    }
    return calculatedCoherence;
  }

  /**
   * Check if a perturbation is currently active
   */
  public isPerturbationActive(): boolean {
    return this.activePerturbation;
  }

  /**
   * Get the current perturbation target (or null if none is active)
   */
  public getPerturbationTarget(): number | null {
    return this.targetCoherence;
  }

  /**
   * Register this handler with the metaOrchestrator
   */
  public registerWithMetaOrchestrator(): void {
    // Register as a coherence interceptor
    this.coherenceMonitor.registerInterceptor(this);
    
    // Register message handler
    this.metaOrchestrator.addMessageHandler((message: any, ws: WebSocket) => {
      try {
        if (message.type && message.type.startsWith('validation_')) {
          this.handleMessage(message, ws);
          return true; // Message was handled
        }
        return false; // Message was not handled
      } catch (error) {
        console.error('[QUANTUM_STATE: ERROR_FLOW] Error in validation handler:', error);
        return false;
      }
    });
    
    console.log('[QUANTUM_STATE: VALIDATION_FLOW] Coherence validation handler registered with meta orchestrator');
  }
}