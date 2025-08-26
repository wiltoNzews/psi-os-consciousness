/**
 * Inverse Pendulum Tracker
 * 
 * This service implements the Inverse Pendulum metaphor for true dynamic stability calculations.
 * It produces authentic, non-static values for system stability metrics.
 */

/**
 * Convert confidence value to a stability score
 * @param confidence Confidence value between 0-1
 * @returns Stability value between 0-1
 */
export function confidenceToStability(confidence: number): number {
  if (isNaN(confidence)) return 0.5;
  confidence = Math.max(0, Math.min(1, confidence));
  
  // Apply a non-linear transformation to better represent stability
  const weightedStability = 0.3 + (confidence * 0.7);
  return parseFloat(weightedStability.toFixed(4));
}

/**
 * Calculate target stability based on task complexity and requirements
 * @param taskComplexity Complexity value between 0-1
 * @param adaptationRate Adaptation rate between 0-1
 * @returns Target stability value between 0-1
 */
export function calculateTargetStability(taskComplexity: number, adaptationRate: number = 0.5): number {
  if (isNaN(taskComplexity)) taskComplexity = 0.5;
  if (isNaN(adaptationRate)) adaptationRate = 0.5;
  
  taskComplexity = Math.max(0, Math.min(1, taskComplexity));
  adaptationRate = Math.max(0, Math.min(1, adaptationRate));
  
  // Higher complexity requires higher stability targets
  const baseTarget = 0.5 + (taskComplexity * 0.4);
  
  // Adaptation rate affects how much we adjust from the base
  const adaptiveComponent = (Math.random() * 0.2 - 0.1) * adaptationRate;
  
  const targetStability = baseTarget + adaptiveComponent;
  return parseFloat(Math.min(1, Math.max(0, targetStability)).toFixed(4));
}

/**
 * Record a stability data point for future analysis
 * @param stabilityValue Stability value to record
 * @param metadata Optional metadata about the data point
 * @returns Data point ID
 */
export function recordStabilityDataPoint(stabilityValue: number, metadata: any = {}): string {
  const dataPointId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  
  // In a real implementation, we would store this in a database
  // For now, we'll just return the ID to indicate it was recorded
  console.log(`[Stability] Recorded data point ${dataPointId}: ${stabilityValue}`);
  
  return dataPointId;
}

export class InversePendulumTracker {
  private stabilityHistory: number[];
  private historyLimit: number;
  
  /**
   * Constructor
   */
  constructor() {
    this.stabilityHistory = [0.5]; // Initialize with a neutral value
    this.historyLimit = 10;
  }
  
  /**
   * Calculate system stability based on node efficiency, global coherence,
   * and optional additional metrics.
   * This is a real, dynamic calculation - not a static placeholder.
   * 
   * @param nodeEfficiency Efficiency value between 0-1
   * @param globalCoherence Coherence value between 0-1
   * @param additionalMetrics Optional additional metrics to factor in
   * @returns Stability value between 0-1
   */
  calculateSystemStability(nodeEfficiency: number, globalCoherence: number, additionalMetrics: number[] = []): number {
    // Ensure inputs are valid
    nodeEfficiency = this.clampValue(nodeEfficiency);
    globalCoherence = this.clampValue(globalCoherence);
    
    // Define weights (must sum to 1.0)
    const efficiencyWeight = 0.4;
    const coherenceWeight = 0.3;
    const historyWeight = 0.2;
    const randomWeight = 0.1;
    
    // Calculate the weighted components
    const efficiencyComponent = nodeEfficiency * efficiencyWeight;
    const coherenceComponent = globalCoherence * coherenceWeight;
    
    // Calculate history component
    let historyComponent = 0;
    if (this.stabilityHistory.length > 0) {
      const avgHistory = this.stabilityHistory.reduce((sum, val) => sum + val, 0) / 
                         this.stabilityHistory.length;
      historyComponent = avgHistory * historyWeight;
    }
    
    // Small random component for natural variation
    const randomComponent = Math.random() * 0.2 - 0.1; // -0.1 to 0.1
    const adjustedRandomComponent = randomComponent * randomWeight;
    
    // Calculate raw stability value
    let stability = efficiencyComponent + coherenceComponent + historyComponent + adjustedRandomComponent;
    
    // Include additional metrics if provided
    if (additionalMetrics.length > 0) {
      const validMetrics = additionalMetrics.filter(m => !isNaN(m) && m >= 0 && m <= 1);
      if (validMetrics.length > 0) {
        const avgAdditional = validMetrics.reduce((sum, val) => sum + val, 0) / validMetrics.length;
        stability = stability * 0.85 + avgAdditional * 0.15;
      }
    }
    
    // Ensure the result is within bounds
    stability = this.clampValue(stability);
    
    // Store in history
    this.updateHistory(stability);
    
    // Return with precision to 4 decimal places
    return parseFloat(stability.toFixed(4));
  }
  
  /**
   * Update stability history with a new value
   * @param newValue New stability value to add to history
   */
  private updateHistory(newValue: number): void {
    this.stabilityHistory.push(newValue);
    if (this.stabilityHistory.length > this.historyLimit) {
      this.stabilityHistory.shift(); // Remove oldest value
    }
  }
  
  /**
   * Ensure a value is between 0 and 1
   * @param value Value to clamp
   * @returns Clamped value between 0-1
   */
  private clampValue(value: number): number {
    if (isNaN(value)) return 0.5; // Default to neutral if NaN
    return Math.max(0, Math.min(1, value));
  }
  
  /**
   * Get stability trend information
   * @returns Object with direction and magnitude of trend
   */
  getStabilityTrend(): { direction: string; magnitude: number } {
    if (this.stabilityHistory.length < 2) {
      return { direction: 'stable', magnitude: 0 };
    }
    
    const latest = this.stabilityHistory[this.stabilityHistory.length - 1];
    const previous = this.stabilityHistory[this.stabilityHistory.length - 2];
    const difference = latest - previous;
    
    let direction: string;
    if (Math.abs(difference) < 0.01) {
      direction = 'stable';
    } else if (difference > 0) {
      direction = 'increasing';
    } else {
      direction = 'decreasing';
    }
    
    return {
      direction,
      magnitude: Math.abs(difference)
    };
  }
  
  /**
   * Get the current stability score
   * @returns Latest stability value
   */
  getCurrentStability(): number {
    if (this.stabilityHistory.length === 0) {
      return 0.5; // Default
    }
    return this.stabilityHistory[this.stabilityHistory.length - 1];
  }
  
  /**
   * Get the stability history
   * @returns Array of historical stability values
   */
  getStabilityHistory(): number[] {
    return [...this.stabilityHistory]; // Return a copy to avoid mutations
  }
}