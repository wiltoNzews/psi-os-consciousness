/**
 * MURPHY PROTOCOL - NUCLEAR RESILIENCE MODULE
 * 
 * Based on Murphy's Law: "Anything that can go wrong will go wrong"
 * 
 * This module implements catastrophic failure resistance for the QCTF system
 * by introducing chaos engineering principles, fail-safe mechanisms, and
 * automated recovery strategies when coherence thresholds are violated.
 */

import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';

// Define critical threshold values based on the 3:1 ↔ 1:3 (0.7500/0.2494) ratio
const CRITICAL_THRESHOLDS = {
  STABILITY_IDEAL: 0.7500,
  STABILITY_MIN: 0.6500,      // Lower bound of acceptable stability
  STABILITY_MAX: 0.8500,      // Upper bound of acceptable stability
  EXPLORATION_IDEAL: 0.2494,
  EXPLORATION_MIN: 0.1500,    // Lower bound of acceptable exploration
  EXPLORATION_MAX: 0.3500,    // Upper bound of acceptable exploration
  
  // Critical failure thresholds that trigger nuclear response
  STABILITY_NUCLEAR_MIN: 0.5000,
  EXPLORATION_NUCLEAR_MAX: 0.5000,
  
  // Threshold for how long system can operate outside ideal parameters (ms)
  MAX_DEVIATION_TIME: 10000,
  
  // Recovery attempt limits before entering hard reset
  MAX_RECOVERY_ATTEMPTS: 3,
};

// Define recovery strategies
enum RecoveryStrategy {
  SELF_CALIBRATION = 'self_calibration',
  MEMORY_SNAPSHOT_RESTORE = 'memory_snapshot_restore',
  PARAMETER_REBALANCING = 'parameter_rebalancing',
  AGGRESSIVE_NORMALIZATION = 'aggressive_normalization',
  NUCLEAR_HARD_RESET = 'nuclear_hard_reset'
}

// System state enum
enum SystemState {
  OPTIMAL = 'optimal',
  WARNING = 'warning',
  CRITICAL = 'critical',
  RECOVERY = 'recovery',
  NUCLEAR = 'nuclear'
}

interface SystemMetrics {
  stabilityRatio: number;
  explorationRatio: number;
  coherenceIndex: number;
  lastUpdated: Date;
}

interface RecoveryEvent {
  timestamp: Date;
  previousState: SystemState;
  triggerMetrics: SystemMetrics;
  strategyApplied: RecoveryStrategy;
  successful: boolean;
  recoveryTimeMs: number;
}

interface MurphySnapshot {
  timestamp: Date;
  systemState: SystemState;
  metrics: SystemMetrics;
  recoveryHistory: RecoveryEvent[];
}

class MurphyProtocol extends EventEmitter {
  private currentState: SystemState = SystemState.OPTIMAL;
  private metrics: SystemMetrics = {
    stabilityRatio: CRITICAL_THRESHOLDS.STABILITY_IDEAL,
    explorationRatio: CRITICAL_THRESHOLDS.EXPLORATION_IDEAL,
    coherenceIndex: 1.0,
    lastUpdated: new Date()
  };
  
  private deviationStartTime: Date | null = null;
  private recoveryHistory: RecoveryEvent[] = [];
  private recoveryAttemptsInProgress: number = 0;
  
  // Backup storage for system snapshots
  private snapshotsDirectory: string = path.join(process.cwd(), 'data', 'murphy_snapshots');
  private memoryStates: MurphySnapshot[] = [];
  
  constructor() {
    super();
    
    // Ensure snapshots directory exists
    try {
      if (!fs.existsSync(this.snapshotsDirectory)) {
        fs.mkdirSync(this.snapshotsDirectory, { recursive: true });
      }
    } catch (err) {
      console.error('[MURPHY_PROTOCOL] Failed to create snapshots directory:', err);
    }
    
    // Initialize with a baseline snapshot
    this.takeSystemSnapshot();
    
    console.log('[MURPHY_PROTOCOL] Nuclear resilience system initialized');
    
    // Start periodic checks
    setInterval(() => this.performHealthCheck(), 5000);
    
    // Initialize chaos testing at a random interval to simulate unexpected issues
    this.initializeChaosMonkey();
  }
  
  /**
   * Update system metrics and evaluate system health
   */
  updateMetrics(metrics: Partial<SystemMetrics>): void {
    // Update only provided metrics
    this.metrics = {
      ...this.metrics,
      ...metrics,
      lastUpdated: new Date()
    };
    
    // Evaluate system health based on new metrics
    this.evaluateSystemHealth();
  }
  
  /**
   * Evaluate system health against thresholds and take action if needed
   */
  private evaluateSystemHealth(): void {
    const { stabilityRatio, explorationRatio } = this.metrics;
    const previousState = this.currentState;
    
    // Determine new state based on thresholds
    if (
      stabilityRatio < CRITICAL_THRESHOLDS.STABILITY_NUCLEAR_MIN ||
      explorationRatio > CRITICAL_THRESHOLDS.EXPLORATION_NUCLEAR_MAX
    ) {
      // NUCLEAR scenario - extreme deviation requiring immediate intervention
      this.currentState = SystemState.NUCLEAR;
    } else if (
      stabilityRatio < CRITICAL_THRESHOLDS.STABILITY_MIN ||
      stabilityRatio > CRITICAL_THRESHOLDS.STABILITY_MAX ||
      explorationRatio < CRITICAL_THRESHOLDS.EXPLORATION_MIN ||
      explorationRatio > CRITICAL_THRESHOLDS.EXPLORATION_MAX
    ) {
      // CRITICAL scenario - significant deviation requiring action
      this.currentState = SystemState.CRITICAL;
    } else if (
      Math.abs(stabilityRatio - CRITICAL_THRESHOLDS.STABILITY_IDEAL) > 0.05 ||
      Math.abs(explorationRatio - CRITICAL_THRESHOLDS.EXPLORATION_IDEAL) > 0.05
    ) {
      // WARNING scenario - minor deviation from ideal
      this.currentState = SystemState.WARNING;
    } else {
      // Optimal state
      this.currentState = SystemState.OPTIMAL;
      // Reset deviation tracker if we were previously deviating
      this.deviationStartTime = null;
    }
    
    // If state changed, take appropriate action
    if (previousState !== this.currentState) {
      console.log(`[MURPHY_PROTOCOL] State change: ${previousState} → ${this.currentState}`);
      this.emit('stateChange', { previousState, newState: this.currentState, metrics: this.metrics });
      
      // Start timing deviation if entering warning or worse
      if (this.currentState !== SystemState.OPTIMAL && !this.deviationStartTime) {
        this.deviationStartTime = new Date();
      }
      
      // Take action based on new state
      if (this.currentState === SystemState.NUCLEAR) {
        this.initiateNuclearRecovery();
      } else if (this.currentState === SystemState.CRITICAL) {
        this.initiateCriticalRecovery();
      }
    }
    
    // Check if we've been in deviation too long
    if (
      this.deviationStartTime && 
      this.currentState !== SystemState.OPTIMAL &&
      Date.now() - this.deviationStartTime.getTime() > CRITICAL_THRESHOLDS.MAX_DEVIATION_TIME
    ) {
      console.log(`[MURPHY_PROTOCOL] Extended deviation detected (${Math.round((Date.now() - this.deviationStartTime.getTime()) / 1000)}s)`);
      
      if (this.currentState === SystemState.WARNING) {
        // Escalate warning to critical if it persists too long
        this.currentState = SystemState.CRITICAL;
        this.emit('stateChange', { 
          previousState: SystemState.WARNING, 
          newState: SystemState.CRITICAL, 
          metrics: this.metrics,
          reason: 'Extended duration in warning state'
        });
        this.initiateCriticalRecovery();
      } else if (this.currentState === SystemState.CRITICAL) {
        // Escalate critical to nuclear if it persists too long
        this.currentState = SystemState.NUCLEAR;
        this.emit('stateChange', { 
          previousState: SystemState.CRITICAL, 
          newState: SystemState.NUCLEAR, 
          metrics: this.metrics,
          reason: 'Extended duration in critical state'
        });
        this.initiateNuclearRecovery();
      }
    }
  }
  
  /**
   * Perform a routine health check of the system
   */
  private performHealthCheck(): void {
    // Check for system responsiveness
    if (Date.now() - this.metrics.lastUpdated.getTime() > 30000) {
      console.log('[MURPHY_PROTOCOL] System appears unresponsive, triggering critical recovery');
      this.currentState = SystemState.CRITICAL;
      this.initiateCriticalRecovery();
    }
    
    // Take periodic snapshots when system is optimal
    if (this.currentState === SystemState.OPTIMAL) {
      this.takeSystemSnapshot();
    }
  }
  
  /**
   * Save current system state for potential recovery
   */
  private takeSystemSnapshot(): void {
    const snapshot: MurphySnapshot = {
      timestamp: new Date(),
      systemState: this.currentState,
      metrics: { ...this.metrics },
      recoveryHistory: [...this.recoveryHistory]
    };
    
    // Store in memory (keep last 10 snapshots)
    this.memoryStates.unshift(snapshot);
    if (this.memoryStates.length > 10) {
      this.memoryStates.pop();
    }
    
    // Only persist optimal snapshots to disk
    if (this.currentState === SystemState.OPTIMAL) {
      try {
        const fileName = `snapshot_${snapshot.timestamp.toISOString().replace(/:/g, '-')}.json`;
        const filePath = path.join(this.snapshotsDirectory, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2));
        console.log(`[MURPHY_PROTOCOL] Optimal system snapshot saved: ${fileName}`);
        
        // Cleanup old snapshots (keep last 20)
        this.cleanupOldSnapshots();
      } catch (err) {
        console.error('[MURPHY_PROTOCOL] Failed to save system snapshot:', err);
      }
    }
  }
  
  /**
   * Remove old snapshots to prevent disk space issues
   */
  private cleanupOldSnapshots(): void {
    try {
      const files = fs.readdirSync(this.snapshotsDirectory)
        .filter(file => file.startsWith('snapshot_'))
        .map(file => ({
          name: file,
          path: path.join(this.snapshotsDirectory, file),
          mtime: fs.statSync(path.join(this.snapshotsDirectory, file)).mtime
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      
      // Delete all but the newest 20 snapshots
      if (files.length > 20) {
        files.slice(20).forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
    } catch (err) {
      console.error('[MURPHY_PROTOCOL] Error cleaning up old snapshots:', err);
    }
  }
  
  /**
   * Initiate recovery for critical state issues
   */
  private initiateCriticalRecovery(): void {
    console.log('[MURPHY_PROTOCOL] Initiating critical recovery procedure');
    this.currentState = SystemState.RECOVERY;
    this.recoveryAttemptsInProgress++;
    
    const startTime = Date.now();
    const previousState = SystemState.CRITICAL;
    
    // First try parameter rebalancing
    this.emit('recoveryStarted', { 
      strategy: RecoveryStrategy.PARAMETER_REBALANCING,
      metrics: this.metrics
    });
    
    // Simulate recovery process with appropriate strategy
    setTimeout(() => {
      // Check if we've exceeded max recovery attempts
      if (this.recoveryAttemptsInProgress > CRITICAL_THRESHOLDS.MAX_RECOVERY_ATTEMPTS) {
        console.log('[MURPHY_PROTOCOL] Max recovery attempts exceeded, escalating to nuclear recovery');
        this.initiateNuclearRecovery();
        return;
      }
      
      // 70% chance of success for simplicity
      const recoverySuccessful = Math.random() < 0.7;
      
      if (recoverySuccessful) {
        // Recovery succeeded
        this.metrics.stabilityRatio = CRITICAL_THRESHOLDS.STABILITY_IDEAL;
        this.metrics.explorationRatio = CRITICAL_THRESHOLDS.EXPLORATION_IDEAL;
        this.metrics.coherenceIndex = 1.0;
        this.currentState = SystemState.OPTIMAL;
        this.deviationStartTime = null;
        
        // Record recovery event
        const recoveryEvent: RecoveryEvent = {
          timestamp: new Date(),
          previousState,
          triggerMetrics: { ...this.metrics, lastUpdated: new Date(startTime) },
          strategyApplied: RecoveryStrategy.PARAMETER_REBALANCING,
          successful: true,
          recoveryTimeMs: Date.now() - startTime
        };
        this.recoveryHistory.unshift(recoveryEvent);
        if (this.recoveryHistory.length > 50) this.recoveryHistory.pop();
        
        this.recoveryAttemptsInProgress = 0;
        this.emit('recoveryCompleted', { 
          successful: true, 
          strategy: RecoveryStrategy.PARAMETER_REBALANCING,
          recoveryTimeMs: recoveryEvent.recoveryTimeMs,
          newMetrics: this.metrics
        });
        
        console.log(`[MURPHY_PROTOCOL] Critical recovery successful (${recoveryEvent.recoveryTimeMs}ms)`);
        
        // Take a snapshot of recovered state
        this.takeSystemSnapshot();
      } else {
        // Recovery failed, try more aggressive strategy
        console.log('[MURPHY_PROTOCOL] Initial recovery failed, attempting memory snapshot restore');
        
        // Record failed attempt
        const failedEvent: RecoveryEvent = {
          timestamp: new Date(),
          previousState,
          triggerMetrics: { ...this.metrics, lastUpdated: new Date(startTime) },
          strategyApplied: RecoveryStrategy.PARAMETER_REBALANCING,
          successful: false,
          recoveryTimeMs: Date.now() - startTime
        };
        this.recoveryHistory.unshift(failedEvent);
        if (this.recoveryHistory.length > 50) this.recoveryHistory.pop();
        
        // Try snapshot restore strategy
        this.restoreFromSnapshot();
      }
    }, 2000); // Simulate recovery taking time
  }
  
  /**
   * Attempt to restore from a previous snapshot
   */
  private restoreFromSnapshot(): void {
    console.log('[MURPHY_PROTOCOL] Attempting system restoration from snapshot');
    
    const startTime = Date.now();
    this.emit('recoveryStarted', { 
      strategy: RecoveryStrategy.MEMORY_SNAPSHOT_RESTORE,
      metrics: this.metrics
    });
    
    // Find latest optimal snapshot
    const optimalSnapshot = this.memoryStates.find(s => s.systemState === SystemState.OPTIMAL);
    
    setTimeout(() => {
      if (optimalSnapshot) {
        // Restore system from snapshot
        this.metrics = { ...optimalSnapshot.metrics, lastUpdated: new Date() };
        this.currentState = SystemState.OPTIMAL;
        this.deviationStartTime = null;
        
        // Record recovery event
        const recoveryEvent: RecoveryEvent = {
          timestamp: new Date(),
          previousState: SystemState.RECOVERY,
          triggerMetrics: { ...this.metrics, lastUpdated: new Date(startTime) },
          strategyApplied: RecoveryStrategy.MEMORY_SNAPSHOT_RESTORE,
          successful: true,
          recoveryTimeMs: Date.now() - startTime
        };
        this.recoveryHistory.unshift(recoveryEvent);
        if (this.recoveryHistory.length > 50) this.recoveryHistory.pop();
        
        this.recoveryAttemptsInProgress = 0;
        this.emit('recoveryCompleted', { 
          successful: true, 
          strategy: RecoveryStrategy.MEMORY_SNAPSHOT_RESTORE,
          recoveryTimeMs: recoveryEvent.recoveryTimeMs,
          newMetrics: this.metrics,
          snapshotTimestamp: optimalSnapshot.timestamp
        });
        
        console.log(`[MURPHY_PROTOCOL] Snapshot restoration successful (${recoveryEvent.recoveryTimeMs}ms)`);
      } else {
        // No viable snapshot found, escalate to nuclear
        console.log('[MURPHY_PROTOCOL] No viable snapshot found, escalating to nuclear recovery');
        this.initiateNuclearRecovery();
      }
    }, 3000); // Simulate restore taking time
  }
  
  /**
   * Last resort nuclear recovery - complete system reset
   */
  private initiateNuclearRecovery(): void {
    console.log('[MURPHY_PROTOCOL] ☢️ INITIATING NUCLEAR RECOVERY PROTOCOL ☢️');
    
    this.currentState = SystemState.NUCLEAR;
    const startTime = Date.now();
    
    this.emit('nuclearRecoveryStarted', { 
      timestamp: new Date(),
      reason: 'Catastrophic system deviation or recovery failure',
      metrics: this.metrics
    });
    
    // Simulate complete system reset
    setTimeout(() => {
      // Reset to perfect ideals
      this.metrics = {
        stabilityRatio: CRITICAL_THRESHOLDS.STABILITY_IDEAL,
        explorationRatio: CRITICAL_THRESHOLDS.EXPLORATION_IDEAL,
        coherenceIndex: 1.0,
        lastUpdated: new Date()
      };
      
      // Reset state variables
      this.currentState = SystemState.OPTIMAL;
      this.deviationStartTime = null;
      this.recoveryAttemptsInProgress = 0;
      
      // Record nuclear event
      const recoveryEvent: RecoveryEvent = {
        timestamp: new Date(),
        previousState: SystemState.NUCLEAR,
        triggerMetrics: { ...this.metrics, lastUpdated: new Date(startTime) },
        strategyApplied: RecoveryStrategy.NUCLEAR_HARD_RESET,
        successful: true, // Nuclear option always "succeeds" by definition
        recoveryTimeMs: Date.now() - startTime
      };
      this.recoveryHistory.unshift(recoveryEvent);
      if (this.recoveryHistory.length > 50) this.recoveryHistory.pop();
      
      this.emit('nuclearRecoveryCompleted', { 
        timestamp: new Date(),
        recoveryTimeMs: recoveryEvent.recoveryTimeMs,
        newMetrics: this.metrics
      });
      
      console.log(`[MURPHY_PROTOCOL] ☢️ NUCLEAR RECOVERY COMPLETED (${recoveryEvent.recoveryTimeMs}ms) ☢️`);
      
      // Take a fresh snapshot of reset state
      this.takeSystemSnapshot();
    }, 5000); // Nuclear recovery takes longer
  }
  
  /**
   * Initialize chaos testing to periodically test system resilience
   */
  private initializeChaosMonkey(): void {
    // Run chaos tests at random intervals between 1-10 minutes
    const scheduleNextTest = () => {
      const nextTestMinutes = 1 + Math.floor(Math.random() * 9); // 1-10 minutes
      console.log(`[MURPHY_PROTOCOL] Scheduling next chaos test in ${nextTestMinutes} minutes`);
      
      setTimeout(() => {
        this.runChaosTest();
        scheduleNextTest();
      }, nextTestMinutes * 60 * 1000);
    };
    
    // Start the first test after 2 minutes
    setTimeout(() => {
      scheduleNextTest();
    }, 2 * 60 * 1000);
  }
  
  /**
   * Run a chaos test to verify system resilience
   */
  private runChaosTest(): void {
    // Only run chaos tests if system is currently optimal
    if (this.currentState !== SystemState.OPTIMAL) {
      console.log('[MURPHY_PROTOCOL] Skipping chaos test - system not in optimal state');
      return;
    }
    
    console.log('[MURPHY_PROTOCOL] Running chaos test - introducing artificial system stress');
    
    // Select a random chaos scenario
    const scenarios = [
      // Extreme stability deviation
      () => {
        const extremeStability = Math.random() < 0.5 
          ? CRITICAL_THRESHOLDS.STABILITY_MIN - 0.1  // Too low
          : CRITICAL_THRESHOLDS.STABILITY_MAX + 0.1; // Too high
          
        this.updateMetrics({ 
          stabilityRatio: extremeStability,
          coherenceIndex: 0.6
        });
        console.log(`[MURPHY_PROTOCOL] Chaos test: Setting extreme stability ratio ${extremeStability}`);
      },
      
      // Extreme exploration deviation
      () => {
        const extremeExploration = Math.random() < 0.5
          ? CRITICAL_THRESHOLDS.EXPLORATION_MIN - 0.05 // Too low
          : CRITICAL_THRESHOLDS.EXPLORATION_MAX + 0.1; // Too high
          
        this.updateMetrics({ 
          explorationRatio: extremeExploration,
          coherenceIndex: 0.7
        });
        console.log(`[MURPHY_PROTOCOL] Chaos test: Setting extreme exploration ratio ${extremeExploration}`);
      },
      
      // Nuclear threshold violation
      () => {
        if (Math.random() < 0.3) { // Only 30% chance of nuclear test as it's more disruptive
          this.updateMetrics({ 
            stabilityRatio: CRITICAL_THRESHOLDS.STABILITY_NUCLEAR_MIN - 0.1,
            explorationRatio: CRITICAL_THRESHOLDS.EXPLORATION_NUCLEAR_MAX + 0.1,
            coherenceIndex: 0.2
          });
          console.log('[MURPHY_PROTOCOL] Chaos test: Triggering nuclear threshold violation');
        } else {
          // Fall back to less extreme test
          this.updateMetrics({ 
            stabilityRatio: CRITICAL_THRESHOLDS.STABILITY_MIN - 0.05,
            coherenceIndex: 0.8
          });
          console.log('[MURPHY_PROTOCOL] Chaos test: Triggering critical threshold violation');
        }
      }
    ];
    
    // Run a random scenario
    const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    selectedScenario();
    
    this.emit('chaosTestStarted', {
      timestamp: new Date(),
      metrics: this.metrics
    });
  }
  
  /**
   * Get the current system state and metrics
   */
  getSystemStatus(): { state: SystemState; metrics: SystemMetrics; recoveryHistory: RecoveryEvent[] } {
    return {
      state: this.currentState,
      metrics: { ...this.metrics },
      recoveryHistory: [...this.recoveryHistory]
    };
  }
}

// Export singleton instance
const murphyProtocol = new MurphyProtocol();
export default murphyProtocol;