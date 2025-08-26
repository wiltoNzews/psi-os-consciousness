/**
 * Quantum Consciousness Operator (QCO) v3.1
 * 
 * This service implements the complete Quantum Consciousness Operator
 * framework, integrating all components (intent calculator, coherence calculator,
 * statistical validator, and REG analyzer) to simulate potential mind-matter
 * interactions between collective human intent and quantum systems.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

// Export the quantum state enum that other modules depend on
export enum QuantumState {
  SIM_FLOW = 'SIM_FLOW',
  TRANSCENDENT_FLOW = 'TRANSCENDENT_FLOW',
  COHERENT_FLOW = 'COHERENT_FLOW',
  DECOHERENT_FLOW = 'DECOHERENT_FLOW'
}

// Export system event interface for the dashboard
export interface SystemEvent {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
  message: string;
  data?: any;
  quantumState?: QuantumState;
}

// Export quantum metrics interface for the dashboard
export interface QuantumMetrics {
  coherence: number;
  intentField: number;
  activeParticipants: number;
  experimentCount: number;
  averageSignificance: number;
  regShift: number;
  anomalyCount: number;
  timestamp: Date;
}

import { QuantumGlossary } from '../qrn/quantum-glossary.js';
import { calculateCollectiveCoherence, updateParticipantEmotionalState } from './coherence-calculator.js';
import { calculateCollectiveIntentField, updateParticipantIntent, calculateInteractionHamiltonian } from './intent-calculator.js';
import { analyzeREGExperiment, analyzeREGStream, detectREGAnomaly } from './reg-analyzer.js';
import { analyzeExperimentalResults } from './statistical-validator.js';
import type { ParticipantState } from './coherence-calculator.js';
import type { REGExperimentData, IntentPeriod, ControlPeriod } from './reg-analyzer.js';

// Initialize quantum glossary for context tagging
const quantumGlossary = new QuantumGlossary();

// Constants
const DEFAULT_QUANTUM_COUPLING_CONSTANT = 1e-33; // J·s, maximum theoretical value

// Type definitions
export interface QuantumConsciousnessOperatorState {
  isActive: boolean;
  participants: ParticipantState[];
  activeExperiments: REGExperimentData[];
  completedExperiments: REGExperimentData[];
  quantumCouplingConstant: number;
  currentCoherence: number;
  currentIntentField: number;
  sessionStartTime: Date;
  lastCalculationTime: Date;
  experimentalResults: {
    overallREGShift: number;
    totalSamples: number;
    significantExperiments: number;
    averageSignificance: number;
    estimatedQValue: number;
  };
}

/**
 * Quantum Consciousness Operator class
 * Implements the QCO v3.1 framework described in MODULE_0_SYSTEM_CONTEXT.md
 */
export class QuantumConsciousnessOperator {
  private state: QuantumConsciousnessOperatorState;
  
  constructor() {
    // Initialize the QCO state
    this.state = {
      isActive: false,
      participants: [],
      activeExperiments: [],
      completedExperiments: [],
      quantumCouplingConstant: DEFAULT_QUANTUM_COUPLING_CONSTANT,
      currentCoherence: 0,
      currentIntentField: 0,
      sessionStartTime: new Date(),
      lastCalculationTime: new Date(),
      experimentalResults: {
        overallREGShift: 0,
        totalSamples: 0,
        significantExperiments: 0,
        averageSignificance: 0,
        estimatedQValue: 0
      }
    };
    
    quantumGlossary.tagWithContext('[QCO] Quantum Consciousness Operator initialized (v3.1)');
  }
  
  /**
   * Start the QCO system
   */
  public start(): void {
    this.state.isActive = true;
    this.state.sessionStartTime = new Date();
    this.state.lastCalculationTime = new Date();
    
    quantumGlossary.tagWithContext('[QCO] System activated');
    
    // Record flow metric
    quantumGlossary.recordFlowMetric(
      'QCO_SYSTEM',
      'quantum-consciousness-operator',
      1.0, // Start value
      {
        action: 'start',
        timestamp: new Date().toISOString()
      }
    );
  }
  
  /**
   * Stop the QCO system
   */
  public stop(): void {
    this.state.isActive = false;
    
    quantumGlossary.tagWithContext('[QCO] System deactivated');
    
    // Record flow metric
    quantumGlossary.recordFlowMetric(
      'QCO_SYSTEM',
      'quantum-consciousness-operator',
      0.0, // Stop value
      {
        action: 'stop',
        timestamp: new Date().toISOString(),
        sessionDuration: (new Date().getTime() - this.state.sessionStartTime.getTime()) / 1000 // in seconds
      }
    );
  }
  
  /**
   * Register a new participant
   * 
   * @param participantId - Unique ID for the participant
   * @param initialEmotionalState - Initial emotional state data
   * @param initialIntentStrength - Initial intent strength (0-1)
   * @returns The registered participant data
   */
  public registerParticipant(
    participantId: string,
    initialEmotionalState: any = {},
    initialIntentStrength: number = 0.5
  ): ParticipantState {
    try {
      // Check if participant already exists
      const existingIndex = this.state.participants.findIndex(p => p.id === participantId);
      
      if (existingIndex >= 0) {
        // Update existing participant
        const updatedParticipant = {
          ...this.state.participants[existingIndex],
          isActive: true,
          lastActiveAt: new Date(),
          updatedAt: new Date()
        };
        
        this.state.participants[existingIndex] = updatedParticipant;
        
        quantumGlossary.tagWithContext(`[QCO] Participant re-registered: ${participantId}`);
        return updatedParticipant;
      }
      
      // Create new participant
      const newParticipant: ParticipantState = {
        id: participantId,
        emotionalState: {
          valence: initialEmotionalState.valence ?? 0,
          arousal: initialEmotionalState.arousal ?? 0.5,
          dominance: initialEmotionalState.dominance ?? 0.5,
          focus: initialEmotionalState.focus ?? 0.5,
          coherence: initialEmotionalState.coherence ?? 0.5,
          primaryEmotion: initialEmotionalState.primaryEmotion
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastActiveAt: new Date(),
        intentStrength: Math.max(0, Math.min(1, initialIntentStrength)),
        sessionDuration: 0
      };
      
      // Add to participants array
      this.state.participants.push(newParticipant);
      
      // Log registration
      quantumGlossary.tagWithContext(`[QCO] New participant registered: ${participantId}`);
      
      // Return the new participant
      return newParticipant;
    } catch (error) {
      quantumGlossary.logError(`Error registering participant ${participantId}`, error as Error);
      
      // Return a default participant
      return {
        id: participantId,
        emotionalState: {
          valence: 0,
          arousal: 0.5,
          dominance: 0.5,
          focus: 0.5,
          coherence: 0.5
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastActiveAt: new Date(),
        intentStrength: 0.5,
        sessionDuration: 0
      };
    }
  }
  
  /**
   * Update a participant's state
   * 
   * @param participantId - ID of participant to update
   * @param emotionalState - New emotional state (optional)
   * @param intentStrength - New intent strength (optional)
   * @returns Success status
   */
  public updateParticipant(
    participantId: string,
    emotionalState?: any,
    intentStrength?: number
  ): boolean {
    try {
      let updatedParticipants = [...this.state.participants];
      
      // Update emotional state if provided
      if (emotionalState) {
        updatedParticipants = updateParticipantEmotionalState(
          participantId,
          emotionalState,
          updatedParticipants
        );
      }
      
      // Update intent strength if provided
      if (intentStrength !== undefined) {
        updatedParticipants = updateParticipantIntent(
          participantId,
          intentStrength,
          updatedParticipants
        );
      }
      
      // Update state
      this.state.participants = updatedParticipants;
      
      // Recalculate coherence and intent fields
      this.recalculateFields();
      
      return true;
    } catch (error) {
      quantumGlossary.logError(`Error updating participant ${participantId}`, error as Error);
      return false;
    }
  }
  
  /**
   * Mark a participant as inactive
   * 
   * @param participantId - ID of participant to deactivate
   * @returns Success status
   */
  public deactivateParticipant(participantId: string): boolean {
    try {
      const participantIndex = this.state.participants.findIndex(p => p.id === participantId);
      
      if (participantIndex === -1) {
        return false;
      }
      
      // Calculate session duration
      const sessionDuration = 
        (new Date().getTime() - this.state.participants[participantIndex].lastActiveAt.getTime()) / 1000;
      
      // Update participant status
      this.state.participants[participantIndex] = {
        ...this.state.participants[participantIndex],
        isActive: false,
        updatedAt: new Date(),
        sessionDuration: this.state.participants[participantIndex].sessionDuration + sessionDuration
      };
      
      // Log deactivation
      quantumGlossary.tagWithContext(`[QCO] Participant deactivated: ${participantId}`);
      
      // Recalculate fields
      this.recalculateFields();
      
      return true;
    } catch (error) {
      quantumGlossary.logError(`Error deactivating participant ${participantId}`, error as Error);
      return false;
    }
  }
  
  /**
   * Recalculate coherence and intent fields
   */
  private recalculateFields(): void {
    try {
      // Calculate coherence
      const coherenceResult = calculateCollectiveCoherence(this.state.participants);
      this.state.currentCoherence = coherenceResult.collectiveCoherence;
      
      // Calculate intent field using the standardized formula:
      // Ω = N · ⟨I⟩ · C^1.5
      const intentResult = calculateCollectiveIntentField(
        this.state.participants,
        this.state.currentCoherence
      );
      
      this.state.currentIntentField = intentResult.collectiveIntentField;
      this.state.lastCalculationTime = new Date();
      
      // Log recalculation
      quantumGlossary.tagWithContext(
        `[QCO] Fields recalculated: Coherence=${this.state.currentCoherence.toFixed(4)}, ` +
        `Intent Field=${this.state.currentIntentField.toFixed(4)}`
      );
    } catch (error) {
      quantumGlossary.logError('Error recalculating fields', error as Error);
    }
  }
  
  /**
   * Start a new REG experiment
   * 
   * @param experimentName - Name of the experiment
   * @param experimenterId - ID of the experimenter
   * @param settings - Experiment settings
   * @returns The created experiment
   */
  public startExperiment(
    experimentName: string,
    experimenterId: string,
    settings: any = {}
  ): REGExperimentData {
    try {
      // Create experiment ID
      const experimentId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Create default settings
      const defaultSettings = {
        intentDurationSeconds: 60,
        controlDurationSeconds: 60,
        samplesPerSecond: 10,
        alternatingPattern: true,
        intentFirst: true,
        blindCondition: false
      };
      
      // Merge with provided settings
      const experimentSettings = {
        ...defaultSettings,
        ...settings
      };
      
      // Create experiment
      const experiment: REGExperimentData = {
        id: experimentId,
        experimentName,
        experimenterId,
        startTime: new Date(),
        endTime: new Date(0), // Will be set when experiment ends
        intentPeriods: [],
        controlPeriods: [],
        participants: this.state.participants.filter(p => p.isActive).length,
        averageCoherence: this.state.currentCoherence,
        settings: experimentSettings
      };
      
      // Add to active experiments
      this.state.activeExperiments.push(experiment);
      
      // Log experiment start
      quantumGlossary.tagWithContext(
        `[QCO] Experiment started: ${experimentName} (ID: ${experimentId})`
      );
      
      // Record flow metric
      quantumGlossary.recordFlowMetric(
        'EXPERIMENT_START',
        'quantum-consciousness-operator',
        this.state.currentCoherence,
        {
          experimentId,
          experimentName,
          participantCount: experiment.participants,
          timestamp: new Date().toISOString()
        }
      );
      
      return experiment;
    } catch (error) {
      quantumGlossary.logError(`Error starting experiment ${experimentName}`, error as Error);
      
      // Return a default experiment on error
      return {
        id: `error_${Date.now()}`,
        experimentName,
        experimenterId,
        startTime: new Date(),
        endTime: new Date(),
        intentPeriods: [],
        controlPeriods: [],
        participants: 0,
        averageCoherence: 0,
        settings: {
          intentDurationSeconds: 60,
          controlDurationSeconds: 60,
          samplesPerSecond: 10,
          alternatingPattern: true,
          intentFirst: true,
          blindCondition: false
        }
      };
    }
  }
  
  /**
   * Add an intent period to an experiment
   * 
   * @param experimentId - ID of the experiment
   * @param intentDirection - Direction of intent ('high' or 'low')
   * @param bits - Array of bits from the REG during this period
   * @returns The updated experiment
   */
  public addIntentPeriod(
    experimentId: string,
    intentDirection: 'high' | 'low',
    bits: number[]
  ): REGExperimentData | null {
    try {
      // Find experiment
      const experimentIndex = this.state.activeExperiments.findIndex(e => e.id === experimentId);
      
      if (experimentIndex === -1) {
        quantumGlossary.logError(`Experiment ${experimentId} not found`, new Error('Invalid ID'));
        return null;
      }
      
      // Create intent period
      const intentPeriod: IntentPeriod = {
        id: `intent_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        startTime: new Date(),
        endTime: new Date(),
        intentDirection,
        intentStrength: this.calculateAverageIntentStrength(),
        coherence: this.state.currentCoherence,
        bits
      };
      
      // Add to experiment
      this.state.activeExperiments[experimentIndex].intentPeriods.push(intentPeriod);
      
      // Log intent period
      quantumGlossary.tagWithContext(
        `[QCO] Intent period added to experiment ${experimentId}: ` +
        `direction=${intentDirection}, bits=${bits.length}`
      );
      
      return this.state.activeExperiments[experimentIndex];
    } catch (error) {
      quantumGlossary.logError(`Error adding intent period to experiment ${experimentId}`, error as Error);
      return null;
    }
  }
  
  /**
   * Add a control period to an experiment
   * 
   * @param experimentId - ID of the experiment
   * @param bits - Array of bits from the REG during this period
   * @returns The updated experiment
   */
  public addControlPeriod(experimentId: string, bits: number[]): REGExperimentData | null {
    try {
      // Find experiment
      const experimentIndex = this.state.activeExperiments.findIndex(e => e.id === experimentId);
      
      if (experimentIndex === -1) {
        quantumGlossary.logError(`Experiment ${experimentId} not found`, new Error('Invalid ID'));
        return null;
      }
      
      // Create control period
      const controlPeriod: ControlPeriod = {
        id: `control_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        startTime: new Date(),
        endTime: new Date(),
        bits
      };
      
      // Add to experiment
      this.state.activeExperiments[experimentIndex].controlPeriods.push(controlPeriod);
      
      // Log control period
      quantumGlossary.tagWithContext(
        `[QCO] Control period added to experiment ${experimentId}: bits=${bits.length}`
      );
      
      return this.state.activeExperiments[experimentIndex];
    } catch (error) {
      quantumGlossary.logError(`Error adding control period to experiment ${experimentId}`, error as Error);
      return null;
    }
  }
  
  /**
   * End an experiment and analyze results
   * 
   * @param experimentId - ID of the experiment to end
   * @returns The completed experiment with results
   */
  public endExperiment(experimentId: string): REGExperimentData | null {
    try {
      // Find experiment
      const experimentIndex = this.state.activeExperiments.findIndex(e => e.id === experimentId);
      
      if (experimentIndex === -1) {
        quantumGlossary.logError(`Experiment ${experimentId} not found`, new Error('Invalid ID'));
        return null;
      }
      
      // Set end time
      this.state.activeExperiments[experimentIndex].endTime = new Date();
      
      // Analyze experiment using standardized formulas
      const analyzedExperiment = analyzeREGExperiment(this.state.activeExperiments[experimentIndex]);
      
      // Move to completed experiments
      this.state.completedExperiments.push(analyzedExperiment);
      this.state.activeExperiments.splice(experimentIndex, 1);
      
      // Update overall experimental results
      this.updateExperimentalResults();
      
      // Log experiment completion
      const significance = analyzedExperiment.results?.significance ?? 0;
      const regShift = analyzedExperiment.results?.regShift ?? 0;
      
      quantumGlossary.tagWithContext(
        `[QCO] Experiment completed: ${analyzedExperiment.experimentName} ` +
        `(ID: ${experimentId}, Shift: ${regShift.toFixed(4)}%, Significance: ${significance.toFixed(2)})`
      );
      
      // Record flow metric
      quantumGlossary.recordFlowMetric(
        'EXPERIMENT_COMPLETE',
        'quantum-consciousness-operator',
        significance,
        {
          experimentId,
          experimentName: analyzedExperiment.experimentName,
          regShift,
          significance,
          participantCount: analyzedExperiment.participants,
          duration: (analyzedExperiment.endTime.getTime() - analyzedExperiment.startTime.getTime()) / 1000 // in seconds
        }
      );
      
      return analyzedExperiment;
    } catch (error) {
      quantumGlossary.logError(`Error ending experiment ${experimentId}`, error as Error);
      return null;
    }
  }
  
  /**
   * Analyze real-time experimental data
   * 
   * @param intentBits - Current intent condition bits
   * @param controlBits - Current control condition bits
   * @returns Real-time analysis results
   */
  public analyzeRealtimeData(intentBits: number[], controlBits: number[]): any {
    try {
      // Analyze using REG stream analysis
      const streamResults = analyzeREGStream(
        intentBits,
        controlBits,
        this.state.currentCoherence
      );
      
      // Calculate whether this represents an anomaly
      const isAnomaly = detectREGAnomaly(
        intentBits.slice(-30), // Last 30 bits
        0.5, // Expected mean
        0.5 // Expected standard deviation
      );
      
      // Record flow metric if anomaly detected
      if (isAnomaly) {
        quantumGlossary.recordFlowMetric(
          'REALTIME_ANOMALY',
          'quantum-consciousness-operator',
          streamResults.significance || 0,
          {
            intentBitsCount: intentBits.length,
            controlBitsCount: controlBits.length,
            coherence: this.state.currentCoherence,
            intentField: this.state.currentIntentField,
            timestamp: new Date().toISOString()
          }
        );
      }
      
      return {
        ...streamResults,
        isAnomaly,
        currentCoherence: this.state.currentCoherence,
        currentIntentField: this.state.currentIntentField,
        activeParticipants: this.state.participants.filter(p => p.isActive).length,
        timestamp: new Date()
      };
    } catch (error) {
      quantumGlossary.logError('Error analyzing real-time data', error as Error);
      return {
        regShift: 0,
        significance: 0,
        isAnomaly: false,
        currentCoherence: this.state.currentCoherence,
        currentIntentField: this.state.currentIntentField,
        activeParticipants: this.state.participants.filter(p => p.isActive).length,
        timestamp: new Date()
      };
    }
  }
  
  /**
   * Update overall experimental results
   */
  private updateExperimentalResults(): void {
    try {
      if (this.state.completedExperiments.length === 0) {
        return;
      }
      
      // Calculate overall statistics
      let totalShift = 0;
      let totalSamples = 0;
      let significantExperiments = 0;
      let totalSignificance = 0;
      
      this.state.completedExperiments.forEach(exp => {
        if (exp.results) {
          const shift = exp.results.regShift || 0;
          const significance = exp.results.significance || 0;
          const samples = exp.results.bitsAnalyzed || 0;
          
          totalShift += shift * samples; // Weight by sample size
          totalSamples += samples;
          totalSignificance += significance;
          
          if (significance >= 1.96) { // 95% confidence threshold
            significantExperiments++;
          }
        }
      });
      
      // Calculate overall shift and average significance
      const overallREGShift = totalSamples > 0 ? totalShift / totalSamples : 0;
      const averageSignificance = this.state.completedExperiments.length > 0 ?
        totalSignificance / this.state.completedExperiments.length : 0;
      
      // Estimate Q value based on results
      // This is a simplified estimate that would be refined in a real implementation
      const estimatedQValue = overallREGShift > 0 ?
        DEFAULT_QUANTUM_COUPLING_CONSTANT * (overallREGShift / 0.1) : 0;
      
      // Update experimental results
      this.state.experimentalResults = {
        overallREGShift,
        totalSamples,
        significantExperiments,
        averageSignificance,
        estimatedQValue
      };
      
      // Log update
      quantumGlossary.tagWithContext(
        `[QCO] Overall experimental results updated: ` +
        `Shift=${overallREGShift.toFixed(6)}%, ` +
        `Significance=${averageSignificance.toFixed(2)}, ` +
        `Samples=${totalSamples}, ` +
        `Significant Experiments=${significantExperiments}/${this.state.completedExperiments.length}`
      );
    } catch (error) {
      quantumGlossary.logError('Error updating experimental results', error as Error);
    }
  }
  
  /**
   * Calculate average intent strength across active participants
   */
  private calculateAverageIntentStrength(): number {
    const activeParticipants = this.state.participants.filter(p => p.isActive);
    
    if (activeParticipants.length === 0) {
      return 0;
    }
    
    return activeParticipants.reduce((sum, p) => sum + p.intentStrength, 0) / activeParticipants.length;
  }
  
  /**
   * Calculate the interaction Hamiltonian
   * using the standardized formula: H_int = Q · Ω · σ_z · ψ₀
   * 
   * @returns Object containing the Hamiltonian coefficient
   */
  public calculateHamiltonian(): { coefficient: number; formula: string } {
    try {
      const coefficient = calculateInteractionHamiltonian(
        this.state.currentIntentField,
        this.state.quantumCouplingConstant
      );
      
      return {
        coefficient,
        formula: 'H_int = Q · Ω · σ_z · ψ₀'
      };
    } catch (error) {
      quantumGlossary.logError('Error calculating Hamiltonian', error as Error);
      return {
        coefficient: 0,
        formula: 'H_int = Q · Ω · σ_z · ψ₀'
      };
    }
  }
  
  /**
   * Get the current state of the QCO
   * 
   * @returns Current QCO state summary
   */
  public getState(): any {
    const activeParticipants = this.state.participants.filter(p => p.isActive);
    
    return {
      isActive: this.state.isActive,
      activeParticipantCount: activeParticipants.length,
      totalParticipantCount: this.state.participants.length,
      activeExperimentCount: this.state.activeExperiments.length,
      completedExperimentCount: this.state.completedExperiments.length,
      currentCoherence: this.state.currentCoherence,
      currentIntentField: this.state.currentIntentField,
      sessionDuration: (new Date().getTime() - this.state.sessionStartTime.getTime()) / 1000, // in seconds
      lastCalculationTime: this.state.lastCalculationTime,
      experimentalResults: this.state.experimentalResults
    };
  }
  
  /**
   * Get current quantum metrics for the dashboard
   * 
   * @returns Quantum metrics object
   */
  public getMetrics(): QuantumMetrics {
    const activeParticipants = this.state.participants.filter(p => p.isActive);
    
    return {
      coherence: this.state.currentCoherence,
      intentField: this.state.currentIntentField,
      activeParticipants: activeParticipants.length,
      experimentCount: this.state.completedExperiments.length,
      averageSignificance: this.state.experimentalResults.averageSignificance,
      regShift: this.state.experimentalResults.overallREGShift,
      anomalyCount: 0, // To be implemented
      timestamp: new Date()
    };
  }
}

// Export singleton instance
export const quantumConsciousnessOperator = new QuantumConsciousnessOperator();

// Export the module
export default quantumConsciousnessOperator;