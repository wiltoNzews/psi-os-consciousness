/**
 * Variant Controller for 0.7500 Coherence Testing
 * [QUANTUM_STATE: CONTROLLER_FLOW]
 * 
 * This controller integrates the specialized Loki Variants with
 * the meta-orchestrator and provides experiment controls to test
 * the 0.7500 coherence attractor state.
 */

import { MetaOrchestrator } from '../../shared/meta-orchestrator.js';
import { AdaptiveLogicVariant, QuantumResonantVariant } from '../../shared/loki-variants.js';
import { LokiVariant, Variant } from '../../shared/types.js';
import { variantBroadcastExperimentUpdate, variantBroadcastStateUpdate, variantBroadcastExperimentResult } from '../routes.js';

/**
 * Experiment configuration for coherence testing
 */
export interface CoherenceExperimentConfig {
  // Basic experiment parameters
  experimentName: string;
  duration: number; // Duration in cycles
  targetCoherenceValues: number[]; // Values to test
  
  // Variant configuration
  useAdaptiveVariant: boolean;
  useQuantumResonantVariant: boolean;
  adaptiveMode?: 'stabilizing' | 'perturbing' | 'balanced';
  resonanceMode?: 'attractor' | 'disruptor' | 'observer';
  
  // Advanced parameters
  cycleDelayMs?: number; // Delay between cycles
  collectDetailedMetrics?: boolean;
  maxVariantCount?: number;
}

/**
 * Variant Controller manages specialized variants for coherence experiments
 */
export class VariantController {
  private metaOrchestrator: MetaOrchestrator;
  private adaptiveVariant: AdaptiveLogicVariant | null = null;
  private quantumResonantVariant: QuantumResonantVariant | null = null;
  private experimentRunning: boolean = false;
  private experimentConfig: CoherenceExperimentConfig | null = null;
  private currentExperimentCycle: number = 0;
  private experimentResults: any[] = [];
  private variantIds: string[] = [];
  
  constructor(metaOrchestrator: MetaOrchestrator) {
    this.metaOrchestrator = metaOrchestrator;
    console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Variant Controller initialized');
  }
  
  /**
   * Create and register Adaptive Logic and Quantum Resonant variants
   * 
   * @returns IDs of the created variants
   */
  createSpecializedVariants(): string[] {
    // Create Adaptive Logic Variant
    this.adaptiveVariant = new AdaptiveLogicVariant({
      name: 'AdaptiveLogic-' + Math.floor(Math.random() * 10000)
    });
    
    // Create Quantum Resonant Variant
    this.quantumResonantVariant = new QuantumResonantVariant({
      name: 'QuantumResonant-' + Math.floor(Math.random() * 10000)
    });
    
    // Register variants with meta-orchestrator
    this.metaOrchestrator.addVariant(this.adaptiveVariant);
    this.metaOrchestrator.addVariant(this.quantumResonantVariant);
    
    // Store IDs for future reference
    this.variantIds = [
      this.adaptiveVariant.id,
      this.quantumResonantVariant.id
    ];
    
    console.log(`[QUANTUM_STATE: CREATION_FLOW] Created specialized variants: ${this.adaptiveVariant.name}, ${this.quantumResonantVariant.name}`);
    
    return this.variantIds;
  }
  
  /**
   * Start a coherence experiment with the specialized variants
   * 
   * @param config Experiment configuration
   * @returns Success status and experiment ID
   */
  startCoherenceExperiment(config: CoherenceExperimentConfig): { success: boolean, experimentId: string } {
    // Validate configuration
    if (!config.experimentName || !config.targetCoherenceValues || config.targetCoherenceValues.length === 0) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Invalid experiment configuration');
      return { success: false, experimentId: '' };
    }
    
    // Ensure we have specialized variants
    if (!this.adaptiveVariant || !this.quantumResonantVariant) {
      this.createSpecializedVariants();
    }
    
    // Initialize experiment
    this.experimentConfig = {
      ...config,
      cycleDelayMs: config.cycleDelayMs || 500,
      collectDetailedMetrics: config.collectDetailedMetrics !== false,
      maxVariantCount: config.maxVariantCount || 6
    };
    
    // Set variant modes based on configuration
    if (config.adaptiveMode && this.adaptiveVariant) {
      this.adaptiveVariant.setAdaptiveMode(config.adaptiveMode);
    }
    
    if (config.resonanceMode && this.quantumResonantVariant) {
      this.quantumResonantVariant.setResonanceMode(config.resonanceMode);
    }
    
    // Reset experiment state
    this.experimentRunning = true;
    this.currentExperimentCycle = 0;
    this.experimentResults = [];
    
    // Start experiment with first coherence target
    if (config.targetCoherenceValues.length > 0) {
      this.setTargetCoherence(config.targetCoherenceValues[0]);
    }
    
    // Generate experiment ID
    const experimentId = `coherence-exp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    console.log(`[QUANTUM_STATE: EXPERIMENT_FLOW] Started coherence experiment "${config.experimentName}" (${experimentId})`);
    
    // Start experiment cycle
    this.runExperimentCycle();
    
    return { success: true, experimentId };
  }
  
  /**
   * Stop the current experiment
   */
  stopExperiment(): void {
    if (!this.experimentRunning) {
      return;
    }
    
    this.experimentRunning = false;
    
    console.log('[QUANTUM_STATE: EXPERIMENT_FLOW] Stopped coherence experiment');
    
    // Generate final report
    this.generateExperimentReport();
  }
  
  /**
   * Set the target coherence for testing
   * 
   * @param targetCoherence The coherence value to target
   */
  private setTargetCoherence(targetCoherence: number): void {
    // Update adaptive variant's target
    if (this.adaptiveVariant) {
      this.adaptiveVariant.setCoherenceTarget(targetCoherence);
    }
    
    // Adjust resonant variant based on target
    if (this.quantumResonantVariant) {
      // If target is near 0.75, set to attractor mode
      if (Math.abs(targetCoherence - 0.75) < 0.05) {
        this.quantumResonantVariant.setResonanceMode('attractor');
      }
      // If target is far from 0.75, set to disruptor mode
      else {
        this.quantumResonantVariant.setResonanceMode('disruptor');
        
        // Tune resonance frequency based on distance from 0.75
        const frequencyModifier = Math.abs(targetCoherence - 0.75) * 10;
        this.quantumResonantVariant.tuneResonanceFrequency(0.033 + frequencyModifier * 0.01);
      }
    }
    
    console.log(`[QUANTUM_STATE: TARGETING_FLOW] Set target coherence to ${targetCoherence.toFixed(4)}`);
  }
  
  /**
   * Run a single experiment cycle
   */
  private runExperimentCycle(): void {
    if (!this.experimentRunning || !this.experimentConfig) {
      return;
    }
    
    this.currentExperimentCycle++;
    
    // Get current system state
    const systemState = this.metaOrchestrator.getSystemState();
    const systemCoherence = systemState.metrics.CTF;
    const cycleCount = this.currentExperimentCycle;
    
    // Update variants based on current state
    if (this.adaptiveVariant && this.experimentConfig.useAdaptiveVariant) {
      const adaptiveUpdates = this.adaptiveVariant.adapt(systemCoherence, systemState);
      this.updateVariant(this.adaptiveVariant.id, adaptiveUpdates);
    }
    
    if (this.quantumResonantVariant && this.experimentConfig.useQuantumResonantVariant) {
      const resonantUpdates = this.quantumResonantVariant.resonate(
        systemCoherence, 
        systemState,
        cycleCount
      );
      this.updateVariant(this.quantumResonantVariant.id, resonantUpdates);
    }
    
    // Record experiment data
    this.recordExperimentData(systemState);
    
    // Check if we need to switch to a new coherence target
    if (this.experimentConfig.targetCoherenceValues.length > 1) {
      const targetIndex = Math.floor(this.currentExperimentCycle / 
        (this.experimentConfig.duration / this.experimentConfig.targetCoherenceValues.length));
      
      if (targetIndex < this.experimentConfig.targetCoherenceValues.length) {
        this.setTargetCoherence(this.experimentConfig.targetCoherenceValues[targetIndex]);
      }
    }
    
    // Check if experiment is complete
    if (this.currentExperimentCycle >= this.experimentConfig.duration) {
      this.experimentRunning = false;
      this.generateExperimentReport();
      console.log('[QUANTUM_STATE: EXPERIMENT_FLOW] Coherence experiment completed');
      return;
    }
    
    // Schedule next cycle
    setTimeout(() => this.runExperimentCycle(), this.experimentConfig.cycleDelayMs);
  }
  
  /**
   * Update a variant in the meta-orchestrator
   * 
   * @param variantId ID of the variant to update
   * @param updates Updates to apply
   */
  private updateVariant(variantId: string, updates: Partial<LokiVariant>): void {
    // Get all variants
    const variants = this.metaOrchestrator.getVariants();
    
    // Find the variant to update
    const variantIndex = variants.findIndex(v => v.id === variantId);
    if (variantIndex === -1) {
      return;
    }
    
    // Apply updates
    const updatedVariant = {
      ...variants[variantIndex],
      ...updates,
      timestamp: Date.now()
    };
    
    // Update in meta-orchestrator (assuming it has an updateVariant method)
    try {
      // @ts-ignore - Dynamically calling method that might not be in the interface
      this.metaOrchestrator.updateVariant(updatedVariant);
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Could not update variant: ${error}`);
    }
  }
  
  /**
   * Record experiment data for analysis
   * 
   * @param systemState Current system state
   */
  private recordExperimentData(systemState: any): void {
    if (!this.experimentConfig?.collectDetailedMetrics) {
      return;
    }
    
    // Extract key metrics
    const metrics = {
      cycle: this.currentExperimentCycle,
      timestamp: Date.now(),
      systemCoherence: systemState.metrics.CTF,
      variantCount: systemState.variants.length,
      variants: systemState.variants.map((v: Variant) => ({
        id: v.id,
        name: v.name,
        qctf: v.qctf,
        entropy: v.entropy
      })),
      adaptiveVariantState: this.adaptiveVariant ? {
        ...this.adaptiveVariant.state,
        mode: this.adaptiveVariant.state.adaptiveMode,
        target: this.adaptiveVariant.state.coherenceTarget
      } : null,
      resonantVariantState: this.quantumResonantVariant ? {
        ...this.quantumResonantVariant.state,
        mode: this.quantumResonantVariant.state.resonanceMode,
        phaseAlignment: this.quantumResonantVariant.state.phaseAlignment
      } : null
    };
    
    // Add to results
    this.experimentResults.push(metrics);
    
    // Broadcast real-time experiment data to all connected clients
    variantBroadcastExperimentUpdate({
      ...metrics,
      type: 'experiment_cycle_data'
    });
  }
  
  /**
   * Generate a report for the completed experiment
   */
  private generateExperimentReport(): void {
    if (!this.experimentConfig || this.experimentResults.length === 0) {
      return;
    }
    
    // Calculate summary statistics
    const coherenceValues = this.experimentResults.map(r => r.systemCoherence);
    const avgCoherence = coherenceValues.reduce((a, b) => a + b, 0) / coherenceValues.length;
    
    // Calculate standard deviation
    const variance = coherenceValues.reduce(
      (acc, val) => acc + Math.pow(val - avgCoherence, 2), 
      0
    ) / coherenceValues.length;
    const stdDev = Math.sqrt(variance);
    
    // Find min/max/median
    const sortedCoherence = [...coherenceValues].sort((a, b) => a - b);
    const minCoherence = sortedCoherence[0];
    const maxCoherence = sortedCoherence[sortedCoherence.length - 1];
    const medianCoherence = sortedCoherence[Math.floor(sortedCoherence.length / 2)];
    
    // Generate summary report
    const report = {
      experimentName: this.experimentConfig.experimentName,
      startTime: this.experimentResults[0].timestamp,
      endTime: this.experimentResults[this.experimentResults.length - 1].timestamp,
      duration: this.currentExperimentCycle,
      targetValues: this.experimentConfig.targetCoherenceValues,
      statistics: {
        avgCoherence,
        stdDev,
        minCoherence,
        maxCoherence,
        medianCoherence,
        stability: 1 - stdDev / avgCoherence, // Coefficient of variation
        returnToOptimal: this.calculateReturnToOptimal()
      },
      variantPerformance: {
        adaptiveImpact: this.calculateVariantImpact('adaptive'),
        resonantImpact: this.calculateVariantImpact('resonant')
      }
    };
    
    console.log('[QUANTUM_STATE: ANALYSIS_FLOW] Experiment report generated');
    console.log(`[QUANTUM_STATE: ANALYSIS_FLOW] Average coherence: ${avgCoherence.toFixed(4)}, StdDev: ${stdDev.toFixed(4)}`);
    
    // Broadcast the experiment report to all connected clients
    variantBroadcastExperimentUpdate({
      ...report,
      type: 'experiment_report'
    });
    
    // Also send experiment result specifically for the PowerLawDashboard
    variantBroadcastExperimentResult(report);
    
    return report;
  }
  
  /**
   * Calculate how quickly coherence returns to optimal (0.7500)
   * after perturbation
   */
  private calculateReturnToOptimal(): any {
    if (this.experimentResults.length < 3) {
      return null;
    }
    
    const result = {
      perturbationPoints: 0,
      averageReturnCycles: 0,
      returnExamples: []
    };
    
    // Look for sequences where coherence is perturbed then returns to 0.75
    let inPerturbation = false;
    let perturbationStart = 0;
    let maxDeviation = 0;
    
    for (let i = 0; i < this.experimentResults.length; i++) {
      const coherence = this.experimentResults[i].systemCoherence;
      const deviation = Math.abs(coherence - 0.7500);
      
      // Check if we're in a perturbed state
      if (!inPerturbation && deviation > 0.05) {
        inPerturbation = true;
        perturbationStart = i;
        maxDeviation = deviation;
      }
      // Check if we've returned to optimal
      else if (inPerturbation && deviation < 0.01) {
        inPerturbation = false;
        const returnCycles = i - perturbationStart;
        result.perturbationPoints++;
        result.averageReturnCycles += returnCycles;
        
        // Record example
        if (result.returnExamples.length < 5) {
          result.returnExamples.push({
            startCycle: perturbationStart,
            endCycle: i,
            maxDeviation,
            returnCycles
          });
        }
      }
      // Update max deviation if still in perturbation
      else if (inPerturbation && deviation > maxDeviation) {
        maxDeviation = deviation;
      }
    }
    
    // Calculate average
    if (result.perturbationPoints > 0) {
      result.averageReturnCycles /= result.perturbationPoints;
    }
    
    return result;
  }
  
  /**
   * Calculate the impact of a specific variant type on coherence
   */
  private calculateVariantImpact(variantType: 'adaptive' | 'resonant'): any {
    if (this.experimentResults.length < 3) {
      return null;
    }
    
    // Calculate impact based on cycles where variant was active
    const variantActive = this.experimentConfig?.[
      variantType === 'adaptive' ? 'useAdaptiveVariant' : 'useQuantumResonantVariant'
    ];
    
    if (!variantActive) {
      return { impact: 'none', active: false };
    }
    
    // Extract relevant state based on variant type
    const stateKey = variantType === 'adaptive' ? 'adaptiveVariantState' : 'resonantVariantState';
    
    // Look at coherence trend when variant is in different modes
    const modeImpacts: Record<string, { 
      count: number, 
      totalDeviation: number, 
      startCoherence: number, 
      endCoherence: number 
    }> = {};
    
    for (let i = 1; i < this.experimentResults.length; i++) {
      const prevResult = this.experimentResults[i-1];
      const currentResult = this.experimentResults[i];
      
      if (!currentResult[stateKey] || !prevResult[stateKey]) continue;
      
      const mode = currentResult[stateKey].mode;
      if (!mode) continue;
      
      if (!modeImpacts[mode]) {
        modeImpacts[mode] = { 
          count: 0, 
          totalDeviation: 0,
          startCoherence: prevResult.systemCoherence,
          endCoherence: currentResult.systemCoherence
        };
      }
      
      const entry = modeImpacts[mode];
      entry.count++;
      entry.totalDeviation += Math.abs(
        currentResult.systemCoherence - prevResult.systemCoherence
      );
      
      // Always update end coherence to latest
      entry.endCoherence = currentResult.systemCoherence;
    }
    
    // Calculate average impact per mode
    const impacts = Object.entries(modeImpacts).map(([mode, data]) => ({
      mode,
      avgDeviation: data.totalDeviation / Math.max(1, data.count),
      totalCycles: data.count,
      coherenceChange: data.endCoherence - data.startCoherence
    }));
    
    return {
      impact: 'calculated',
      active: true,
      modeImpacts: impacts
    };
  }
  
  /**
   * Get the current state of the specialized variants
   */
  getSpecializedVariantState(): any {
    const state = {
      adaptiveVariant: this.adaptiveVariant ? {
        id: this.adaptiveVariant.id,
        name: this.adaptiveVariant.name,
        state: this.adaptiveVariant.state
      } : null,
      quantumResonantVariant: this.quantumResonantVariant ? {
        id: this.quantumResonantVariant.id,
        name: this.quantumResonantVariant.name,
        state: this.quantumResonantVariant.state  
      } : null
    };
    
    // Broadcast the variant state to all connected clients
    variantBroadcastStateUpdate(state);
    
    return state;
  }
  
  /**
   * Check if an experiment is currently running
   */
  isExperimentRunning(): boolean {
    return this.experimentRunning;
  }
  
  /**
   * Get experiment progress information
   */
  getExperimentProgress(): any {
    if (!this.experimentRunning || !this.experimentConfig) {
      return null;
    }
    
    const progress = {
      experimentName: this.experimentConfig.experimentName,
      currentCycle: this.currentExperimentCycle,
      totalCycles: this.experimentConfig.duration,
      progress: this.currentExperimentCycle / this.experimentConfig.duration,
      currentTarget: this.experimentConfig.targetCoherenceValues[
        Math.min(
          this.experimentConfig.targetCoherenceValues.length - 1,
          Math.floor(this.currentExperimentCycle / 
            (this.experimentConfig.duration / this.experimentConfig.targetCoherenceValues.length)
          )
        )
      ]
    };
    
    // Broadcast the experiment progress to all connected clients
    variantBroadcastExperimentUpdate(progress);
    
    return progress;
  }
}