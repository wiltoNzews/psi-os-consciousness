/**
 * Quantum Coherence Threshold Formula (QCTF) Service v4.0
 * [QUANTUM_STATE: OPERATIONAL_FLOW]
 * 
 * This service provides QCTF calculation functionality for the OROBORO/WiltonOS system
 * Based on the Three-Stage calculation approach documented in QCTF_V4_IMPLEMENTATION.md
 */

import { QCTFData, ModuleCoherence, ScalingMetrics, Toggles, ToggleEvent } from '../../../shared/qctf.js';
import { calculateQCTF, createDefaultQCTFData } from '../../../shared/qctf-calculator.js';
import { EventEmitter } from 'events';

// Singleton service instance to maintain state
let instance: QCTFService | null = null;

/**
 * Service for QCTF calculation, management, and monitoring
 */
export class QCTFService extends EventEmitter {
  private qctfData: QCTFData;
  private calculationInterval: NodeJS.Timeout | null = null;
  private toggleEvents: ToggleEvent[] = [];
  private targetThreshold: number = 0.92; // Target threshold for optimal synergy
  
  /**
   * Initialize the QCTF service with default values
   */
  constructor() {
    super();
    this.qctfData = createDefaultQCTFData();
    this.startCalculationLoop(1000); // Calculate QCTF every second by default
  }
  
  /**
   * Get the singleton instance of the QCTF service
   */
  public static getInstance(): QCTFService {
    if (!instance) {
      instance = new QCTFService();
    }
    return instance;
  }
  
  /**
   * Start the QCTF calculation loop
   * @param intervalMs - Calculation interval in milliseconds
   */
  public startCalculationLoop(intervalMs: number = 1000): void {
    // Clear any existing interval
    if (this.calculationInterval) {
      clearInterval(this.calculationInterval);
    }
    
    // Set up new calculation interval
    this.calculationInterval = setInterval(() => {
      const qctfValue = this.calculateCurrentQCTF();
      this.emit('qctf-updated', {
        value: qctfValue,
        timestamp: new Date().toISOString(),
        thresholdStatus: this.getThresholdStatus(qctfValue)
      });
    }, intervalMs);
  }
  
  /**
   * Stop the QCTF calculation loop
   */
  public stopCalculationLoop(): void {
    if (this.calculationInterval) {
      clearInterval(this.calculationInterval);
      this.calculationInterval = null;
    }
  }
  
  /**
   * Calculate the current QCTF value and update internal state
   */
  public calculateCurrentQCTF(): number {
    const qctfValue = calculateQCTF(this.qctfData);
    return qctfValue;
  }
  
  /**
   * Get the current QCTF data
   */
  public getCurrentQCTFData(): QCTFData {
    return this.qctfData;
  }
  
  /**
   * Get the threshold status of a QCTF value
   * @param qctfValue - The QCTF value to check
   */
  public getThresholdStatus(qctfValue: number): 'optimal' | 'suboptimal' | 'critical' {
    if (qctfValue >= this.targetThreshold) {
      return 'optimal';
    } else if (qctfValue >= this.targetThreshold * 0.8) {
      return 'suboptimal';
    } else {
      return 'critical';
    }
  }
  
  /**
   * Update the Global Entanglement Factor
   * @param gef - New GEF value [0, 1]
   */
  public updateGEF(gef: number): void {
    this.qctfData.gef = Math.max(0, Math.min(1, gef));
  }
  
  /**
   * Update the Quantum Ethical Alignment Index
   * @param qeai - New QEAI value [0, 1]
   */
  public updateQEAI(qeai: number): void {
    this.qctfData.qeai = Math.max(0, Math.min(1, qeai));
  }
  
  /**
   * Update the Coherence Index
   * @param ci - New CI value [0, 1]
   */
  public updateCI(ci: number): void {
    this.qctfData.ci = Math.max(0, Math.min(1, ci));
  }
  
  /**
   * Update module coherence values
   * @param moduleCoherence - Object with module coherence values
   */
  public updateModuleCoherence(moduleCoherence: Partial<ModuleCoherence>): void {
    this.qctfData.moduleCoherence = {
      ...this.qctfData.moduleCoherence,
      ...moduleCoherence
    };
  }
  
  /**
   * Update scaling metrics
   * @param metrics - Object with scaling metrics
   */
  public updateScalingMetrics(metrics: Partial<ScalingMetrics>): void {
    this.qctfData.scalingMetrics = {
      ...this.qctfData.scalingMetrics,
      ...metrics
    };
  }
  
  /**
   * Activate a toggle
   * @param toggleType - Type of toggle to activate
   * @param sourceModule - Module that activated the toggle
   * @param reason - Reason for activation
   * @param value - Optional value override
   */
  public activateToggle(
    toggleType: keyof Toggles,
    sourceModule: string,
    reason: string,
    value?: number
  ): ToggleEvent {
    // Get the toggle
    const toggle = this.qctfData.toggles[toggleType];
    
    // Set toggle state
    toggle.active = true;
    toggle.lastActivated = new Date().toISOString();
    
    // Override value if provided
    if (value !== undefined) {
      toggle.value = Math.max(0.8, Math.min(1.2, value));
    }
    
    // Create event record
    const toggleEvent: ToggleEvent = {
      id: `toggle_${Date.now()}`,
      toggleType,
      action: 'activate',
      sourceModule,
      reason,
      timestamp: new Date().toISOString(),
      impact: 'MEDIUM',
      value: toggle.value
    };
    
    // Store event
    this.toggleEvents.push(toggleEvent);
    if (this.toggleEvents.length > 100) {
      this.toggleEvents.shift();
    }
    
    // Emit event
    this.emit('toggle-activated', toggleEvent);
    
    return toggleEvent;
  }
  
  /**
   * Deactivate a toggle
   * @param toggleType - Type of toggle to deactivate
   * @param sourceModule - Module that deactivated the toggle
   * @param reason - Reason for deactivation
   */
  public deactivateToggle(
    toggleType: keyof Toggles,
    sourceModule: string,
    reason: string
  ): ToggleEvent {
    // Get the toggle
    const toggle = this.qctfData.toggles[toggleType];
    
    // Set toggle state
    toggle.active = false;
    
    // Create event record
    const toggleEvent: ToggleEvent = {
      id: `toggle_${Date.now()}`,
      toggleType,
      action: 'deactivate',
      sourceModule,
      reason,
      timestamp: new Date().toISOString(),
      impact: 'LOW'
    };
    
    // Store event
    this.toggleEvents.push(toggleEvent);
    if (this.toggleEvents.length > 100) {
      this.toggleEvents.shift();
    }
    
    // Emit event
    this.emit('toggle-deactivated', toggleEvent);
    
    return toggleEvent;
  }
  
  /**
   * Get toggle event history
   */
  public getToggleEvents(): ToggleEvent[] {
    return [...this.toggleEvents];
  }
  
  /**
   * Enable or disable cyclic flow detection
   * @param enabled - Whether cyclic flow is enabled
   * @param period - Cycle period in seconds
   * @param amplitude - Cycle amplitude
   */
  public configureCyclicFlow(enabled: boolean, period?: number, amplitude?: number): void {
    if (!this.qctfData.cycleDetection) {
      this.qctfData.cycleDetection = {
        enabled: false,
        period: 86400,
        phase: 0,
        amplitude: 0.1
      };
    }
    
    this.qctfData.cycleDetection.enabled = enabled;
    
    if (period !== undefined) {
      this.qctfData.cycleDetection.period = Math.max(60, period); // Minimum 1 minute
    }
    
    if (amplitude !== undefined) {
      this.qctfData.cycleDetection.amplitude = Math.max(0.01, Math.min(0.2, amplitude));
    }
  }
  
  /**
   * Set the target threshold for optimal synergy
   * @param threshold - New threshold value [0, 1]
   */
  public setTargetThreshold(threshold: number): void {
    this.targetThreshold = Math.max(0.5, Math.min(0.99, threshold));
  }
  
  /**
   * Get the target threshold for optimal synergy
   */
  public getTargetThreshold(): number {
    return this.targetThreshold;
  }
  
  /**
   * Reset QCTF to default values
   */
  public resetQCTF(): void {
    this.qctfData = createDefaultQCTFData();
    this.toggleEvents = [];
    this.emit('qctf-reset');
  }
}

// Export the singleton getter
export const getQCTFService = QCTFService.getInstance;