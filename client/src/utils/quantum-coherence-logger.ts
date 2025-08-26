/**
 * Quantum Coherence Logger
 * 
 * A utility for logging and analyzing coherence events within the quantum system.
 * This tracks the coherence-to-exploration ratio (3:1) across components and
 * provides real-time debugging capabilities.
 */

// Log entry interface for coherence events
export interface CoherenceLogEntry {
  timestamp: number;
  component: string;
  stabilityRatio: number; // Typically 0.75 (75%)
  explorationRatio: number; // Typically 0.25 (25%)
  event: string;
  description: string;
  actualRatio: number; // Calculated stability/exploration ratio (optimal = 3)
  deviationFromOptimal: number; // How far from the ideal 3:1 ratio
}

// Constants
const MAX_LOG_ENTRIES = 100;
const OPTIMAL_RATIO = 3; // The ideal 3:1 ratio
const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2, 
  ERROR: 3
};

/**
 * Quantum Coherence Logger class
 */
class QuantumCoherenceLogger {
  private logs: CoherenceLogEntry[] = [];
  private currentLogLevel = LOG_LEVEL.DEBUG;
  private systemCoherenceScore = 75; // Default to optimal ratio (75% coherence)
  
  /**
   * Log a coherence event
   * 
   * @param component - The component generating the event
   * @param stabilityRatio - The stability/coherence ratio (0-1)
   * @param explorationRatio - The exploration/chaos ratio (0-1)
   * @param event - The type of event
   * @param description - Description of the event
   */
  public logCoherenceEvent(
    component: string,
    stabilityRatio: number,
    explorationRatio: number,
    event: string,
    description: string
  ): void {
    // Ensure ratios are valid
    stabilityRatio = Math.max(0, Math.min(1, stabilityRatio));
    explorationRatio = Math.max(0, Math.min(1, explorationRatio));
    
    // Calculate the actual ratio and deviation
    const actualRatio = explorationRatio === 0 
      ? Infinity 
      : stabilityRatio / explorationRatio;
    const deviationFromOptimal = Math.abs(actualRatio - OPTIMAL_RATIO);
    
    // Create log entry
    const logEntry: CoherenceLogEntry = {
      timestamp: Date.now(),
      component,
      stabilityRatio,
      explorationRatio,
      event,
      description,
      actualRatio,
      deviationFromOptimal
    };
    
    // Add to logs (maintaining max size)
    this.logs.unshift(logEntry);
    if (this.logs.length > MAX_LOG_ENTRIES) {
      this.logs.pop();
    }
    
    // Determine log level based on deviation
    let logLevel = LOG_LEVEL.INFO;
    if (deviationFromOptimal > 0.5) {
      logLevel = LOG_LEVEL.ERROR;
    } else if (deviationFromOptimal > 0.2) {
      logLevel = LOG_LEVEL.WARNING;
    }
    
    // Log to console with appropriate level
    if (logLevel >= this.currentLogLevel) {
      const ratio = actualRatio === Infinity ? "∞" : actualRatio.toFixed(2);
      
      if (logLevel === LOG_LEVEL.ERROR) {
        console.error(
          `[QUANTUM_COHERENCE_ERROR] ${component}: ${ratio}:1 ratio (${(stabilityRatio * 100).toFixed(0)}%:${(explorationRatio * 100).toFixed(0)}%) - ${description}`
        );
      } else if (logLevel === LOG_LEVEL.WARNING) {
        console.warn(
          `[QUANTUM_COHERENCE_WARNING] ${component}: ${ratio}:1 ratio (${(stabilityRatio * 100).toFixed(0)}%:${(explorationRatio * 100).toFixed(0)}%) - ${description}`
        );
      } else {
        console.log(
          `[QUANTUM_COHERENCE] ${component}: ${ratio}:1 ratio (${(stabilityRatio * 100).toFixed(0)}%:${(explorationRatio * 100).toFixed(0)}%) - ${description}`
        );
      }
    }
    
    // Update overall system coherence
    this.updateSystemCoherence();
  }
  
  /**
   * Get all coherence logs
   */
  public getCoherenceLogs(): CoherenceLogEntry[] {
    return [...this.logs];
  }
  
  /**
   * Get logs for a specific component
   * 
   * @param component - The component to filter logs for
   */
  public getComponentLogs(component: string): CoherenceLogEntry[] {
    return this.logs.filter(log => log.component === component);
  }
  
  /**
   * Calculate the current system coherence score (0-100)
   * Higher score = closer to optimal ratio across all components
   */
  public calculateSystemCoherence(): number {
    if (this.logs.length === 0) {
      return 75; // Default to optimal if no logs
    }
    
    // Weight recent logs more heavily
    const recentLogs = this.logs.slice(0, 20);
    
    // Calculate weighted average deviation
    let totalWeight = 0;
    let weightedDeviation = 0;
    
    recentLogs.forEach((log, index) => {
      // More recent logs have higher weight
      const weight = (recentLogs.length - index) / recentLogs.length;
      weightedDeviation += log.deviationFromOptimal * weight;
      totalWeight += weight;
    });
    
    const avgDeviation = weightedDeviation / totalWeight;
    
    // Convert to score (0-100)
    // Deviation of 0 = 100% score
    // Deviation of 1+ = 0% score
    const score = Math.max(0, Math.min(100, 100 - (avgDeviation * 100)));
    
    // Update and return
    this.systemCoherenceScore = score;
    return score;
  }
  
  /**
   * Update the overall system coherence score
   */
  private updateSystemCoherence(): void {
    this.systemCoherenceScore = this.calculateSystemCoherence();
  }
  
  /**
   * Get the current system coherence score
   */
  public getSystemCoherence(): number {
    return this.systemCoherenceScore;
  }
  
  /**
   * Set the log level
   * 
   * @param level - The log level to set
   */
  public setLogLevel(level: number): void {
    if (level >= LOG_LEVEL.DEBUG && level <= LOG_LEVEL.ERROR) {
      this.currentLogLevel = level;
    }
  }
  
  /**
   * Get coherence data for visualization
   */
  public getCoherenceVisualizationData(): {
    labels: string[];
    ratios: number[];
    deviations: number[];
  } {
    const displayLogs = this.logs.slice(0, 10).reverse();
    
    return {
      labels: displayLogs.map(log => log.component),
      ratios: displayLogs.map(log => log.actualRatio),
      deviations: displayLogs.map(log => log.deviationFromOptimal)
    };
  }
  
  /**
   * Get component performance ranking based on coherence
   */
  public getComponentRanking(): {
    component: string;
    score: number;
    status: 'optimal' | 'suboptimal' | 'critical';
  }[] {
    // Get unique components
    const components = [...new Set(this.logs.map(log => log.component))];
    
    // Calculate score for each component
    return components.map(component => {
      const componentLogs = this.getComponentLogs(component);
      if (componentLogs.length === 0) {
        return {
          component,
          score: 75,
          status: 'optimal' as const
        };
      }
      
      // Use most recent log to calculate current score
      const latestLog = componentLogs[0];
      const score = Math.max(0, 100 - (latestLog.deviationFromOptimal * 100));
      
      // Determine status
      let status: 'optimal' | 'suboptimal' | 'critical';
      if (score >= 90) {
        status = 'optimal';
      } else if (score >= 70) {
        status = 'suboptimal';
      } else {
        status = 'critical';
      }
      
      return {
        component,
        score,
        status
      };
    }).sort((a, b) => b.score - a.score);
  }
}

// Export singleton instance
const quantumCoherenceLogger = new QuantumCoherenceLogger();
export default quantumCoherenceLogger;