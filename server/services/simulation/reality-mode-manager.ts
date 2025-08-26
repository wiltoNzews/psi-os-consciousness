/**
 * Reality Mode Manager
 * 
 * This service manages the transition between SIMULATION and REALITY modes
 * following the protocol defined in SIMULATION_REALITY_PROTOCOL.md.
 * 
 * It implements multiple safeguards to prevent accidental transitions and
 * ensures proper authorization for all mode changes.
 */

import { REALITY_MODE, SYSTEM_QUANTUM_STATE } from '../../config.js';
import quantumGlossary from '../qrn/quantum-glossary.js';
import { ChronosDateHandler } from '../utils/chronos-date-handler.js';
import { QuantumState } from '../../../shared/schema-minimal.js';
import { 
  isSimulationState, 
  isRealityState, 
  extractContextTag,
  formatWithQuantumState
} from '../../../shared/quantum-state-utils.js';
import { systemLogger, DomainEmoji } from '../../utils/symbolic-logger.js';

// Map reality modes to quantum states for metrics recording
// This ensures consistent metric recording while maintaining clear mode separation
const MODE_TO_QUANTUM_STATE = {
  'REALITY': QuantumState.REAL_FLOW,     // Reality mode maps to REAL_FLOW - system alignment in reality
  'SIMULATION': QuantumState.SIM_FLOW    // Simulation mode maps to SIM_FLOW - system alignment in simulation
};

// For type safety, define the mode types
export type RealityModeType = 'SIMULATION' | 'REALITY';

// Interface for transition requests
export interface TransitionRequest {
  requestedMode: RealityModeType;
  requestedBy: string;
  reason: string;
  timestamp: Date;
}

// Interface for confirmation details
export interface ConfirmationDetails {
  confirmedBy: string;
  confirmationText: string;
  timestamp: Date;
}

// Interface for authorization details
export interface AuthorizationDetails {
  authorizedBy: string;
  twoFactorVerified: boolean;
  timestamp: Date;
}

// Interface for secondary confirmation
export interface SecondaryConfirmation {
  confirmedBy: string;
  confirmationText: string;
  timestamp: Date;
}

// Interface for system readiness check results
export interface ReadinessCheckResults {
  systemReady: boolean;
  criticalComponentsOperational: boolean;
  ongoingSimulationsCount: number;
  agentsReady: boolean;
  failureReasons?: string[];
  timestamp: Date;
}

// Interface for the complete transition log
export interface TransitionLog {
  transitionId: string;
  request: TransitionRequest;
  primaryConfirmation?: ConfirmationDetails;
  authorization?: AuthorizationDetails;
  secondaryConfirmation?: SecondaryConfirmation;
  readinessCheck?: ReadinessCheckResults;
  transitionCompleted: boolean;
  finalMode: RealityModeType;
  completedTimestamp?: Date;
  errors?: string[];
}

/**
 * Singleton service for managing transitions between SIMULATION and REALITY modes
 */
export class RealityModeManager {
  private static instance: RealityModeManager;
  private currentMode: RealityModeType = REALITY_MODE ? 'REALITY' : 'SIMULATION';
  private transitionLogs: TransitionLog[] = [];
  private ongoingTransition: TransitionLog | null = null;
  private modeChangeCallbacks: Array<(mode: RealityModeType) => void> = [];
  private lastModeCheckTime: Date = new Date();

  private constructor() {
    // Private constructor to enforce singleton pattern
    this.logCurrentMode();
  }

  /**
   * Get the singleton instance of the RealityModeManager
   */
  public static getInstance(): RealityModeManager {
    if (!RealityModeManager.instance) {
      RealityModeManager.instance = new RealityModeManager();
    }
    return RealityModeManager.instance;
  }

  /**
   * Get the current reality mode
   */
  public getCurrentMode(): RealityModeType {
    this.lastModeCheckTime = new Date();
    return this.currentMode;
  }
  
  /**
   * Format a message with the current quantum state tag
   * This ensures all outputs follow the unified QuantumState protocol
   * 
   * @param message Message to format with quantum state tag
   * @returns Message with appropriate quantum state tag
   */
  public formatWithContextTag(message: string): string {
    // Convert mode to quantum state
    const quantumState = MODE_TO_QUANTUM_STATE[this.currentMode];
    
    // Use the unified formatWithQuantumState utility
    return formatWithQuantumState(message, quantumState);
  }

  /**
   * Begin a transition request from current mode to the requested mode
   * This is step 1 of the transition protocol
   */
  public initiateTransitionRequest(request: Omit<TransitionRequest, 'timestamp'>): string {
    if (this.ongoingTransition) {
      throw new Error('A transition is already in progress. Complete or cancel it before initiating a new transition.');
    }

    // Create transition request with timestamp
    const transitionRequest: TransitionRequest = {
      ...request,
      timestamp: new Date()
    };

    // Generate unique transition ID
    const transitionId = `transition-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Initialize transition log
    this.ongoingTransition = {
      transitionId,
      request: transitionRequest,
      transitionCompleted: false,
      finalMode: this.currentMode
    };

    // Log the initiation using symbolic logger
    systemLogger.info(
      `TRANSITION INITIATED: ${transitionId} | From ${this.currentMode} to ${request.requestedMode} | Requested by: ${request.requestedBy} | Reason: ${request.reason}`,
      MODE_TO_QUANTUM_STATE[this.currentMode],
      { domain: DomainEmoji.SYSTEM }
    );

    // Record metric
    quantumGlossary.recordFlowMetric(
      MODE_TO_QUANTUM_STATE[this.currentMode], // Use the appropriate quantum state
      'reality_mode_transition_initiated',
      1,
      {
        transitionId,
        from: this.currentMode,
        to: request.requestedMode,
        requestedBy: request.requestedBy
      }
    );

    return transitionId;
  }

  /**
   * Record primary human confirmation (step 2 of the protocol)
   */
  public recordPrimaryConfirmation(
    transitionId: string, 
    confirmation: Omit<ConfirmationDetails, 'timestamp'>
  ): void {
    this.validateOngoingTransition(transitionId);

    // Validate confirmation text
    if (confirmation.confirmationText !== "I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE") {
      throw new Error('Invalid confirmation text. Must exactly match the required confirmation phrase.');
    }

    // Record confirmation with timestamp
    if (this.ongoingTransition) {
      this.ongoingTransition.primaryConfirmation = {
        ...confirmation,
        timestamp: new Date()
      };
    }

    systemLogger.info(
      `PRIMARY CONFIRMATION RECORDED: ${transitionId} | Confirmed by: ${confirmation.confirmedBy}`,
      MODE_TO_QUANTUM_STATE[this.currentMode],
      { domain: DomainEmoji.REALITY }
    );
  }

  /**
   * Record authorization verification (step 3 of the protocol)
   */
  public recordAuthorization(
    transitionId: string,
    authorization: Omit<AuthorizationDetails, 'timestamp'>
  ): void {
    this.validateOngoingTransition(transitionId);
    
    // Ensure primary confirmation was completed
    if (!this.ongoingTransition?.primaryConfirmation) {
      throw new Error('Cannot record authorization before primary confirmation is completed.');
    }

    // Record authorization with timestamp
    if (this.ongoingTransition) {
      this.ongoingTransition.authorization = {
        ...authorization,
        timestamp: new Date()
      };
    }

    systemLogger.info(
      `AUTHORIZATION RECORDED: ${transitionId} | Authorized by: ${authorization.authorizedBy} | Two-factor verified: ${authorization.twoFactorVerified}`,
      MODE_TO_QUANTUM_STATE[this.currentMode],
      { domain: DomainEmoji.SECURITY }
    );
  }

  /**
   * Record secondary independent confirmation (step 4 of the protocol)
   */
  public recordSecondaryConfirmation(
    transitionId: string,
    confirmation: Omit<SecondaryConfirmation, 'timestamp'>
  ): void {
    this.validateOngoingTransition(transitionId);
    
    // Ensure previous steps were completed
    if (!this.ongoingTransition?.authorization) {
      throw new Error('Cannot record secondary confirmation before authorization is completed.');
    }

    // Ensure secondary confirmation is from a different user
    if (confirmation.confirmedBy === this.ongoingTransition.primaryConfirmation?.confirmedBy) {
      throw new Error('Secondary confirmation must be from a different user than primary confirmation.');
    }

    // Validate confirmation text
    if (confirmation.confirmationText !== "I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE") {
      throw new Error('Invalid confirmation text. Must exactly match the required confirmation phrase.');
    }

    // Record secondary confirmation with timestamp
    if (this.ongoingTransition) {
      this.ongoingTransition.secondaryConfirmation = {
        ...confirmation,
        timestamp: new Date()
      };
    }

    systemLogger.info(
      `SECONDARY CONFIRMATION RECORDED: ${transitionId} | Confirmed by: ${confirmation.confirmedBy}`,
      MODE_TO_QUANTUM_STATE[this.currentMode],
      { domain: DomainEmoji.REALITY }
    );
  }

  /**
   * Perform system readiness check (step 5 of the protocol)
   */
  public async performReadinessCheck(transitionId: string): Promise<ReadinessCheckResults> {
    this.validateOngoingTransition(transitionId);
    
    // Ensure previous steps were completed
    if (!this.ongoingTransition?.secondaryConfirmation) {
      throw new Error('Cannot perform readiness check before secondary confirmation is completed.');
    }

    systemLogger.info(
      `PERFORMING SYSTEM READINESS CHECK: ${transitionId}`,
      MODE_TO_QUANTUM_STATE[this.currentMode],
      { domain: DomainEmoji.SYSTEM }
    );

    // Simulate system readiness check
    // In a real implementation, this would check actual system components
    const checkResults: ReadinessCheckResults = {
      systemReady: true,
      criticalComponentsOperational: true,
      ongoingSimulationsCount: 0,
      agentsReady: true,
      timestamp: new Date()
    };

    // Record the results
    if (this.ongoingTransition) {
      this.ongoingTransition.readinessCheck = checkResults;
    }

    systemLogger.info(
      `READINESS CHECK COMPLETED: ${transitionId} | System ready: ${checkResults.systemReady} | Critical components: ${checkResults.criticalComponentsOperational} | Simulations: ${checkResults.ongoingSimulationsCount} | Agents ready: ${checkResults.agentsReady}`,
      MODE_TO_QUANTUM_STATE[this.currentMode],
      { domain: DomainEmoji.SYSTEM }
    );

    return checkResults;
  }

  /**
   * Complete the transition (step 6 of the protocol)
   */
  public async completeTransition(transitionId: string): Promise<RealityModeType> {
    this.validateOngoingTransition(transitionId);
    
    // Ensure all previous steps were completed
    if (!this.ongoingTransition?.readinessCheck) {
      throw new Error('Cannot complete transition before system readiness check is completed.');
    }

    // Ensure system is ready
    if (!this.ongoingTransition.readinessCheck.systemReady) {
      throw new Error('Cannot complete transition when system is not ready. See readiness check results.');
    }

    // Determine target mode from the request
    const targetMode = this.ongoingTransition.request.requestedMode;
    
    // Update the global reality mode
    // In a real implementation, this would update the actual global variable
    this.currentMode = targetMode;
    
    // Complete the transition log
    if (this.ongoingTransition) {
      this.ongoingTransition.transitionCompleted = true;
      this.ongoingTransition.finalMode = targetMode;
      this.ongoingTransition.completedTimestamp = new Date();
      
      // Add to transition logs
      this.transitionLogs.push(this.ongoingTransition);
      
      // Clear ongoing transition
      const completedTransition = this.ongoingTransition;
      this.ongoingTransition = null;
      
      // Notify all registered callbacks
      this.notifyModeChangeCallbacks(targetMode);
      
      // Use the target mode's quantum state for transition completion
      const targetQuantumState = MODE_TO_QUANTUM_STATE[targetMode];
      systemLogger.info(
        `TRANSITION COMPLETED: ${transitionId} | New mode: ${targetMode} | Completed at: ${completedTransition.completedTimestamp?.toISOString()}`,
        targetQuantumState,
        { domain: DomainEmoji.REALITY }
      );
      
      // Record metric
      quantumGlossary.recordFlowMetric(
        MODE_TO_QUANTUM_STATE[targetMode], // Use the appropriate quantum state based on target mode
        'reality_mode_transition_completed',
        1,
        {
          transitionId,
          finalMode: targetMode,
          durationMs: completedTransition.completedTimestamp 
            ? completedTransition.completedTimestamp.getTime() - completedTransition.request.timestamp.getTime()
            : undefined
        }
      );
    }
    
    return targetMode;
  }

  /**
   * Cancel an in-progress transition
   */
  public cancelTransition(transitionId: string, reason: string): void {
    this.validateOngoingTransition(transitionId);
    
    if (this.ongoingTransition) {
      // Record cancellation
      this.ongoingTransition.transitionCompleted = false;
      this.ongoingTransition.finalMode = this.currentMode; // Unchanged
      this.ongoingTransition.errors = [reason];
      
      // Add to transition logs
      this.transitionLogs.push(this.ongoingTransition);
      
      // Use ANTIFLOW state for cancellation - represents system misalignment
      const antiFlowState = this.currentMode === 'SIMULATION' ? QuantumState.SIM_ANTIFLOW : QuantumState.REAL_ANTIFLOW;
      systemLogger.warning(
        `TRANSITION CANCELLED: ${transitionId} | Reason: ${reason}`,
        antiFlowState,
        { domain: DomainEmoji.REALITY }
      );
      
      // Record metric
      quantumGlossary.recordFlowMetric(
        this.currentMode === 'SIMULATION' ? QuantumState.SIM_ANTIFLOW : QuantumState.REAL_ANTIFLOW, // Cancellation is an anti-flow event
        'reality_mode_transition_cancelled',
        0,
        {
          transitionId,
          reason,
          stage: this.determineTransitionStage(this.ongoingTransition)
        }
      );
      
      // Clear ongoing transition
      this.ongoingTransition = null;
    }
  }

  /**
   * Emergency reversion to SIMULATION mode
   * This is a safety mechanism that can be triggered at any time
   */
  public emergencyRevertToSimulation(triggeredBy: string, reason: string): void {
    // If already in SIMULATION mode, do nothing
    if (this.currentMode === 'SIMULATION') {
      systemLogger.info(
        'EMERGENCY REVERT: Already in SIMULATION mode',
        QuantumState.SIM_FLOW,
        { domain: DomainEmoji.SECURITY }
      );
      return;
    }
    
    // Cancel any ongoing transition
    if (this.ongoingTransition) {
      this.cancelTransition(
        this.ongoingTransition.transitionId, 
        `Emergency reversion to SIMULATION mode. Reason: ${reason}`
      );
    }
    
    // Create emergency transition record
    const transitionId = `emergency-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const transitionLog: TransitionLog = {
      transitionId,
      request: {
        requestedMode: 'SIMULATION',
        requestedBy: triggeredBy,
        reason: `EMERGENCY REVERSION: ${reason}`,
        timestamp: new Date()
      },
      transitionCompleted: true,
      finalMode: 'SIMULATION',
      completedTimestamp: new Date()
    };
    
    // Update mode
    this.currentMode = 'SIMULATION';
    
    // Add to transition logs
    this.transitionLogs.push(transitionLog);
    
    // Notify all registered callbacks
    this.notifyModeChangeCallbacks('SIMULATION');
    
    // Use critical warning for emergency reversion
    systemLogger.critical(
      `EMERGENCY REVERSION TO SIMULATION MODE | Triggered by: ${triggeredBy} | Reason: ${reason}`,
      QuantumState.SIM_FLOW, // Using SIM_FLOW since we're returning to a stable state
      { domain: DomainEmoji.SECURITY }
    );
    
    // Record metric
    quantumGlossary.recordFlowMetric(
      QuantumState.SIM_FLOW, // Use SIM_FLOW for emergency reversion - system is returning to simulation state
      'emergency_reality_mode_reversion',
      1,
      {
        triggeredBy,
        reason,
        timestamp: transitionLog.completedTimestamp?.toISOString()
      }
    );
  }

  /**
   * Register a callback to be notified when the reality mode changes
   */
  public registerModeChangeCallback(callback: (mode: RealityModeType) => void): void {
    this.modeChangeCallbacks.push(callback);
  }

  /**
   * Get all transition logs
   */
  public getTransitionLogs(): TransitionLog[] {
    return [...this.transitionLogs];
  }

  /**
   * Get the current transition in progress, if any
   */
  public getOngoingTransition(): TransitionLog | null {
    return this.ongoingTransition;
  }

  /**
   * Validate that the given transition ID matches the ongoing transition
   */
  private validateOngoingTransition(transitionId: string): void {
    if (!this.ongoingTransition) {
      throw new Error('No transition is currently in progress.');
    }
    
    if (this.ongoingTransition.transitionId !== transitionId) {
      throw new Error(`Transition ID mismatch. Expected ${this.ongoingTransition.transitionId}, received ${transitionId}.`);
    }
  }

  /**
   * Determine the current stage of a transition
   */
  private determineTransitionStage(transition: TransitionLog): string {
    if (transition.readinessCheck) return 'readiness_check';
    if (transition.secondaryConfirmation) return 'secondary_confirmation';
    if (transition.authorization) return 'authorization';
    if (transition.primaryConfirmation) return 'primary_confirmation';
    return 'request';
  }

  /**
   * Notify all registered callbacks about a mode change
   */
  private notifyModeChangeCallbacks(newMode: RealityModeType): void {
    for (const callback of this.modeChangeCallbacks) {
      try {
        callback(newMode);
      } catch (error) {
        systemLogger.error(
          `Error in mode change callback: ${error instanceof Error ? error.message : String(error)}`,
          this.currentMode === 'SIMULATION' ? QuantumState.SIM_ANTIFLOW : QuantumState.REAL_ANTIFLOW,
          { domain: DomainEmoji.SYSTEM }
        );
      }
    }
  }

  /**
   * Log the current reality mode
   */
  private logCurrentMode(): void {
    // Use symbolic logger with current quantum state and SYSTEM domain
    systemLogger.info(
      `CURRENT REALITY MODE: ${this.currentMode}`,
      MODE_TO_QUANTUM_STATE[this.currentMode], 
      { domain: DomainEmoji.SYSTEM }
    );
    
    // Record metric
    quantumGlossary.recordFlowMetric(
      MODE_TO_QUANTUM_STATE[this.currentMode], // Use the appropriate quantum state based on current mode
      'reality_mode_status',
      1,
      { currentMode: this.currentMode }
    );
  }
}