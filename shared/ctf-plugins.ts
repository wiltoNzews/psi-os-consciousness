/**
 * NEXUS AI Meta-Orchestration Plugins
 * 
 * This module implements advanced CTF plugins for the Meta-Orchestrator system,
 * including PendulumBalancer and BifurcationHandler.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

// Basic variant for plugin operations
interface Variant {
  id: string;
  name?: string;
  qctf: number;
  entropy: number;
  eai?: number;
  theta?: number;
  timestamp: number;
}

// Interface for system metrics
interface SystemMetrics {
  CI: number;           // Coherence Index
  GEF: number;          // Global Entropy Factor
  EAI: number;          // Entanglement & AI Index
  theta: number;        // Phase shift angle (in radians)
  CTF: number;          // Coherence Threshold Formula value
  timeSinceLastNovelty?: number; // Time since last novelty event
}

// Interface for system state
interface SystemState {
  metrics: SystemMetrics;
  variants: Variant[];
  resonances: Map<string, number>;
  timestamp: number;
}

/**
 * Base plugin interface for CTF plugins
 */
export interface PluginAction {
  pluginName: string;
  actionType: string;
  metricName?: string;
  oldValue?: number;
  newValue?: number;
  timestamp: number;
  priority?: number;
  reason?: string;
}

export interface CTFPlugin {
  name: string;
  description: string;
  isActive: boolean;
  priority: number; // Higher priority plugins take precedence in conflicts
  lastActionTime: number; // Track when plugin last took action
  cooldownMs: number; // Minimum time between significant actions
  
  // Enhanced apply method that returns both state and action log
  apply(state: SystemState, orchestrator: any): { 
    newState: SystemState, 
    actions: PluginAction[] 
  };
  
  getStatus(): any;
}

/**
 * Pendulum Balancer Plugin
 * 
 * This plugin implements the Inverse Pendulum balancing mechanism that
 * maintains system coherence by dynamically adjusting theta and entropy
 * to counterbalance extreme variations.
 */
export class PendulumBalancerPlugin implements CTFPlugin {
  name = "PendulumBalancer";
  description = "Maintains system coherence using inverse pendulum principles";
  isActive = true;
  priority = 8; // High priority as it's critical for system stability
  lastActionTime = Date.now();
  cooldownMs = 2000; // 2 second cooldown between significant actions
  
  private balanceHistory: number[] = []; // History of balance adjustments
  private lastBalanceTime = Date.now();
  private oscillationDetectionWindow: number[] = []; // For detecting harmful oscillations
  private consecutiveAdjustments = 0; // Count of consecutive adjustments in same direction
  private lastAdjustmentDirection = 0; // Direction of last adjustment: -1, 0, or 1
  private targetThetaRange = { min: Math.PI / 6, max: Math.PI / 3 }; // Healthy range for theta
  
  /**
   * Apply enhanced balancing algorithm to the system state with improved theta phase handling
   * Returns both the new state and action logs for coordination with other plugins
   */
  apply(state: SystemState, orchestrator: any): { newState: SystemState, actions: PluginAction[] } {
    if (!this.isActive) return { newState: state, actions: [] };
    
    // Deep copy state to avoid mutation
    const newState = JSON.parse(JSON.stringify(state));
    const actions: PluginAction[] = [];
    
    // Extract metrics with validation
    const { CI, GEF, EAI, theta, CTF } = newState.metrics;
    
    // Ensure theta is within valid range [0, π]
    const safeTheta = isNaN(theta) ? Math.PI/2 : Math.max(0, Math.min(Math.PI, theta));
    
    // Calculate system imbalance (deviation from optimal CTF value of 0.85)
    const targetCTF = 0.85;
    const imbalance = CTF - targetCTF;
    
    // Add current imbalance to oscillation detection window
    this.oscillationDetectionWindow.push(imbalance);
    if (this.oscillationDetectionWindow.length > 5) {
      this.oscillationDetectionWindow.shift();
    }
    
    // Check for harmful oscillations (alternating sign of adjustments)
    const isOscillating = this.detectOscillation();
    
    // Calculate base correction factor using inverse pendulum formula
    // The more imbalanced, the stronger the correction
    let correctionFactor = Math.tanh(imbalance * 2);
    
    // If oscillating, reduce correction magnitude to dampen oscillations
    if (isOscillating) {
      correctionFactor *= 0.5;
      actions.push({
        pluginName: this.name,
        actionType: 'oscillation_dampening',
        timestamp: Date.now(),
        reason: 'Detected harmful oscillations in system metrics',
        priority: this.priority
      });
      console.log(`[QUANTUM_STATE: BALANCER_FLOW] Dampening oscillations in theta adjustments`);
    }
    
    // Adapt correction factor based on current theta position
    // We want to keep theta in a healthy range for meaningful cos(θ) values
    // Avoid extremes of 0 and π where small changes have little effect on cos(θ)
    const thetaPositionFactor = this.calculateThetaPositionFactor(safeTheta);
    correctionFactor *= thetaPositionFactor;
    
    // Calculate final theta adjustment with more nuanced control
    const thetaAdjustment = correctionFactor * 0.1;
    
    // Check if we're in cooldown period for significant actions
    const now = Date.now();
    const isCooldownActive = (now - this.lastActionTime) < this.cooldownMs;
    
    // If in cooldown and adjustment is minor, reduce it further
    const finalAdjustment = isCooldownActive && Math.abs(thetaAdjustment) < 0.05 ? 
                              thetaAdjustment * 0.5 : thetaAdjustment;
    
    // Track adjustment direction for oscillation detection
    const adjustmentDirection = Math.sign(finalAdjustment);
    if (adjustmentDirection === this.lastAdjustmentDirection) {
      this.consecutiveAdjustments++;
    } else {
      this.consecutiveAdjustments = 1;
      this.lastAdjustmentDirection = adjustmentDirection;
    }
    
    // Apply the theta adjustment with bounds check
    const newTheta = Math.max(0, Math.min(Math.PI, safeTheta + finalAdjustment));
    
    // Record the balance adjustment for history tracking
    this.balanceHistory.push(finalAdjustment);
    if (this.balanceHistory.length > 10) {
      this.balanceHistory.shift();
    }
    
    // Update state metrics
    newState.metrics.theta = newTheta;
    
    // Recalculate CTF with new theta
    const cosTheta = Math.cos(newTheta);
    newState.metrics.CTF = CI + (GEF * EAI * cosTheta);
    
    // Update timestamps
    newState.metrics.lastBalanceTime = Date.now();
    this.lastBalanceTime = Date.now();
    
    // Create action record for theta adjustment
    actions.push({
      pluginName: this.name,
      actionType: 'theta_adjustment',
      metricName: 'theta',
      oldValue: safeTheta,
      newValue: newTheta,
      timestamp: Date.now(),
      priority: this.priority,
      reason: isOscillating ? 'Dampen oscillations' : 
              (imbalance > 0 ? 'Reduce excess coherence' : 'Increase system coherence')
    });
    
    // If adjustment is significant, update last action time
    if (Math.abs(finalAdjustment) > 0.05) {
      this.lastActionTime = now;
      console.log(`[QUANTUM_STATE: BALANCER_FLOW] Significant theta adjustment: ${finalAdjustment.toFixed(4)}, new theta: ${newTheta.toFixed(4)}, cos(θ): ${cosTheta.toFixed(4)}, CTF impact: ${(GEF * EAI * cosTheta).toFixed(4)}`);
    }
    
    return { newState, actions };
  }
  
  /**
   * Calculate an adjustment factor based on current theta position
   * Encourages theta to stay in the "sensitive" middle range where cos(θ) changes meaningfully
   */
  private calculateThetaPositionFactor(theta: number): number {
    // Define the ideal range where cos(θ) is most sensitive to changes
    const { min, max } = this.targetThetaRange;
    
    if (theta < min) {
      // If theta is too small, encourage it to increase (reduce negative adjustments)
      return theta < min/2 ? 0.5 : 0.8;
    } else if (theta > max) {
      // If theta is too large, encourage it to decrease (reduce positive adjustments)
      return theta > Math.PI - max/2 ? 0.5 : 0.8;
    } else {
      // Within ideal range, apply full corrections
      return 1.0;
    }
  }
  
  /**
   * Detect harmful oscillations in theta adjustments
   * Returns true if the system appears to be oscillating
   */
  private detectOscillation(): boolean {
    if (this.oscillationDetectionWindow.length < 3) return false;
    
    // Check for alternating signs in recent imbalance values
    let alternatingCount = 0;
    for (let i = 1; i < this.oscillationDetectionWindow.length; i++) {
      if (Math.sign(this.oscillationDetectionWindow[i]) !== 
          Math.sign(this.oscillationDetectionWindow[i-1])) {
        alternatingCount++;
      }
    }
    
    // If most consecutive pairs have different signs, we're oscillating
    return alternatingCount >= this.oscillationDetectionWindow.length - 2;
  }
  
  /**
   * Get plugin status information with detailed theta analytics
   */
  getStatus(): any {
    // Calculate statistics about recent adjustments
    const adjustmentsMean = this.balanceHistory.length 
      ? this.balanceHistory.reduce((sum, val) => sum + val, 0) / this.balanceHistory.length 
      : 0;
    
    const adjustmentsVariance = this.balanceHistory.length 
      ? this.balanceHistory.reduce((sum, val) => sum + Math.pow(val - adjustmentsMean, 2), 0) / this.balanceHistory.length 
      : 0;
    
    return {
      name: this.name,
      isActive: this.isActive,
      lastBalanceTime: this.lastBalanceTime,
      
      // Theta-specific analytics
      targetThetaRange: this.targetThetaRange,
      isOscillating: this.detectOscillation(),
      consecutiveAdjustments: this.consecutiveAdjustments,
      lastAdjustmentDirection: this.lastAdjustmentDirection,
      
      // Adjustment statistics
      recentAdjustments: this.balanceHistory,
      adjustmentsMean: adjustmentsMean.toFixed(4),
      adjustmentsVariance: adjustmentsVariance.toFixed(6),
      balanceStrength: (this.balanceHistory.reduce((sum, val) => sum + Math.abs(val), 0) / 
                       (this.balanceHistory.length || 1)).toFixed(4),
      
      // Ideal theta ranges for reference (in radians)
      cosineThresholds: {
        maxSensitivity: "π/2 (1.57) - Max sensitivity point where cos'(θ) is steepest",
        goodRange: "π/6 (0.52) to π/3 (1.05) - Where cos(θ) changes at meaningful rate",
        poorRange: "< 0.1 or > 3.0 - Where cos(θ) changes very little (flat regions)"
      }
    };
  }
}

/**
 * Bifurcation Handler Plugin
 * 
 * This plugin implements the bifurcation mechanics that allow the system
 * to split into multiple coherent states when necessary, enabling exploration
 * of multiple solution spaces simultaneously.
 */
export class BifurcationHandlerPlugin implements CTFPlugin {
  name = "BifurcationHandler";
  description = "Manages system bifurcation for multi-state exploration";
  isActive = true;
  priority = 5; // Medium priority - important but not as critical as PendulumBalancer
  lastActionTime = Date.now();
  cooldownMs = 30000; // 30 second cooldown between bifurcations
  
  private bifurcationThreshold = 0.15; // Threshold for triggering bifurcation
  private lastBifurcationTime = 0;
  private bifurcationCount = 0;
  private maxBifurcationsPerCycle = 1; // Prevent multiple variants spawning in one cycle
  private maxActiveVariants = 6; // Safety limit on total variants
  
  /**
   * Apply bifurcation logic to system state with improved controls
   * Returns both updated state and action records
   */
  apply(state: SystemState, orchestrator: any): { newState: SystemState, actions: PluginAction[] } {
    if (!this.isActive) return { newState: state, actions: [] };
    
    // Deep copy state to avoid mutation
    const newState = JSON.parse(JSON.stringify(state));
    const actions: PluginAction[] = [];
    const variants = newState.variants;
    
    // Enhanced safeguards to prevent overproliferation of variants
    if (variants.length >= this.maxActiveVariants) {
      // Too many variants already, don't create more
      actions.push({
        pluginName: this.name,
        actionType: 'bifurcation_limited',
        timestamp: Date.now(),
        reason: `Maximum variant count reached (${variants.length}/${this.maxActiveVariants})`,
        priority: this.priority
      });
      return { newState, actions };
    }
    
    // Check if we're in cooldown period
    const now = Date.now();
    const isCooldownActive = (now - this.lastActionTime) < this.cooldownMs;
    
    if (isCooldownActive) {
      // In cooldown period, don't create new variants
      return { newState, actions };
    }
    
    // Check if bifurcation conditions are met with enhanced criteria
    const entropySpread = this.calculateEntropySpread(variants);
    const coherenceLevel = newState.metrics.CI;
    
    // Check both entropy spread and safe coherence range (0.65-0.85)
    // Only bifurcate if coherence is in a healthy range to prevent instability
    const shouldBifurcate = entropySpread > this.bifurcationThreshold && 
                           coherenceLevel >= 0.65 && coherenceLevel <= 0.85;
    
    // If bifurcation should occur, create a new variant
    if (shouldBifurcate && orchestrator && typeof orchestrator.addVariant === 'function') {
      // Find the variant with highest entropy to bifurcate from
      const sourceVariant = [...variants].sort((a, b) => b.entropy - a.entropy)[0];
      
      if (sourceVariant) {
        // Create a new variant with a slight shift in properties
        const newVariant = {
          id: `variant-bifurcation-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: `Bifurcation-${++this.bifurcationCount}`,
          qctf: sourceVariant.qctf * (1 + (Math.random() * 0.1 - 0.05)), // ±5% shift
          entropy: sourceVariant.entropy * 0.8, // Slightly lower entropy
          eai: sourceVariant.eai ? sourceVariant.eai * 1.05 : 0.85, // Slightly higher EAI
          theta: sourceVariant.theta ? sourceVariant.theta * 0.9 : Math.PI / 3, // Slightly lower theta
          timestamp: Date.now()
        };
        
        // Add the new variant
        orchestrator.addVariant(newVariant);
        this.lastBifurcationTime = now;
        this.lastActionTime = now;
        
        // Record action
        actions.push({
          pluginName: this.name,
          actionType: 'spawn_variant',
          timestamp: now,
          reason: `Entropy spread ${entropySpread.toFixed(3)} > threshold ${this.bifurcationThreshold}`,
          priority: this.priority
        });
        
        // Log bifurcation event
        console.log(`[QUANTUM_STATE: TRANSCENDENT_FLOW] Bifurcation occurred: Created variant ${newVariant.name} (entropy spread: ${entropySpread.toFixed(3)}, coherence: ${coherenceLevel.toFixed(3)})`);
      }
    }
    
    return { newState, actions };
  }
  
  /**
   * Calculate entropy spread across variants
   */
  private calculateEntropySpread(variants: Variant[]): number {
    if (variants.length < 2) return 0;
    
    // Calculate min and max entropy
    const entropies = variants.map(v => v.entropy);
    const minEntropy = Math.min(...entropies);
    const maxEntropy = Math.max(...entropies);
    
    // Return the spread (normalized)
    return (maxEntropy - minEntropy) / maxEntropy;
  }
  
  /**
   * Get plugin status information
   */
  getStatus(): any {
    return {
      name: this.name,
      isActive: this.isActive,
      bifurcationCount: this.bifurcationCount,
      lastBifurcationTime: this.lastBifurcationTime,
      currentCooldown: Math.max(0, 30000 - (Date.now() - this.lastBifurcationTime)),
      bifurcationThreshold: this.bifurcationThreshold
    };
  }
}

/**
 * Chaos Injector Plugin
 * 
 * This plugin periodically introduces controlled chaos into the system
 * to prevent stagnation and enable novel solutions to emerge.
 */
export class ChaosInjectorPlugin implements CTFPlugin {
  name = "ChaosInjector";
  description = "Introduces controlled chaos to prevent stagnation";
  isActive = false; // Disabled by default for stability
  priority = 3; // Low priority - should yield to stability-focused plugins
  lastActionTime = Date.now();
  cooldownMs = 60000; // 1 minute between significant chaos injections
  
  private chaosLevel = 0.05; // Default chaos level (0-1)
  private lastChaosTime = 0;
  private chaosIntervalMs = 60000; // 1 minute between chaos injections
  private maxChaosGEF = 0.7; // Don't add chaos if global entropy already high
  private maxChaosCI = 0.85; // Don't add chaos if coherence is too high
  private minChaosCI = 0.65; // Don't add chaos if coherence is too low
  
  /**
   * Apply chaos injection to system state with enhanced safeguards
   */
  apply(state: SystemState, orchestrator: any): { newState: SystemState, actions: PluginAction[] } {
    if (!this.isActive) return { newState: state, actions: [] };
    
    // Only inject chaos periodically
    const now = Date.now();
    if (now - this.lastChaosTime < this.chaosIntervalMs) {
      return { newState: state, actions: [] };
    }
    
    // Deep copy state to avoid mutation
    const newState = JSON.parse(JSON.stringify(state));
    const actions: PluginAction[] = [];
    
    // Check system conditions before injecting chaos
    const { CI, GEF } = newState.metrics;
    
    // Safety checks to prevent injecting chaos when system is already unstable
    if (GEF > this.maxChaosGEF) {
      actions.push({
        pluginName: this.name,
        actionType: 'chaos_prevented',
        timestamp: now,
        reason: `GEF too high (${GEF.toFixed(3)} > ${this.maxChaosGEF})`,
        priority: this.priority
      });
      return { newState, actions };
    }
    
    if (CI < this.minChaosCI || CI > this.maxChaosCI) {
      actions.push({
        pluginName: this.name,
        actionType: 'chaos_prevented',
        timestamp: now,
        reason: `CI outside safe range (${CI.toFixed(3)}, range: ${this.minChaosCI}-${this.maxChaosCI})`,
        priority: this.priority
      });
      return { newState, actions };
    }
    
    // Determine appropriate chaos level based on system state
    // Reduce chaos if coherence is low, increase if coherence is high
    const adjustedChaosLevel = this.chaosLevel * (1 + (CI - 0.75));
    
    // Store original values for action logging
    const originalGEF = newState.metrics.GEF;
    const originalEAI = newState.metrics.EAI;
    const originalTheta = newState.metrics.theta;
    
    // Inject chaos into system metrics with controlled randomness
    newState.metrics.GEF += (Math.random() * 2 - 1) * adjustedChaosLevel;
    newState.metrics.EAI += (Math.random() * 2 - 1) * adjustedChaosLevel;
    newState.metrics.theta += (Math.random() * 2 - 1) * adjustedChaosLevel * (Math.PI / 4);
    
    // Enforce bounds
    newState.metrics.GEF = Math.max(0.5, Math.min(1, newState.metrics.GEF));
    newState.metrics.EAI = Math.max(0.5, Math.min(1, newState.metrics.EAI));
    newState.metrics.theta = Math.max(0, Math.min(Math.PI, newState.metrics.theta));
    
    // Recalculate CTF
    const cosTheta = Math.cos(newState.metrics.theta);
    newState.metrics.CTF = newState.metrics.CI + 
                          (newState.metrics.GEF * 
                           newState.metrics.EAI * 
                           cosTheta);
    
    // Record chaos actions
    actions.push({
      pluginName: this.name,
      actionType: 'chaos_injection',
      metricName: 'GEF',
      oldValue: originalGEF,
      newValue: newState.metrics.GEF,
      timestamp: now,
      priority: this.priority,
      reason: 'Periodic chaos injection'
    });
    
    actions.push({
      pluginName: this.name,
      actionType: 'chaos_injection',
      metricName: 'EAI',
      oldValue: originalEAI,
      newValue: newState.metrics.EAI,
      timestamp: now,
      priority: this.priority,
      reason: 'Periodic chaos injection'
    });
    
    actions.push({
      pluginName: this.name,
      actionType: 'chaos_injection',
      metricName: 'theta',
      oldValue: originalTheta,
      newValue: newState.metrics.theta,
      timestamp: now,
      priority: this.priority,
      reason: 'Periodic chaos injection'
    });
    
    this.lastChaosTime = now;
    this.lastActionTime = now;
    
    // Log chaos event
    console.log(`[QUANTUM_STATE: CHAOS_FLOW] Chaos injection: GEF ${originalGEF.toFixed(3)} → ${newState.metrics.GEF.toFixed(3)}, EAI ${originalEAI.toFixed(3)} → ${newState.metrics.EAI.toFixed(3)}, θ ${originalTheta.toFixed(3)} → ${newState.metrics.theta.toFixed(3)}`);
    
    return { newState, actions };
  }
  
  /**
   * Get plugin status information
   */
  getStatus(): any {
    return {
      name: this.name,
      isActive: this.isActive,
      chaosLevel: this.chaosLevel,
      lastChaosTime: this.lastChaosTime,
      nextChaosIn: Math.max(0, this.chaosIntervalMs - (Date.now() - this.lastChaosTime))
    };
  }
  
  /**
   * Set chaos level (0-1)
   */
  setChaosLevel(level: number): void {
    this.chaosLevel = Math.max(0, Math.min(1, level));
  }
}

/**
 * Ethical Guard Plugin
 * 
 * This plugin enforces ethical constraints on the system by monitoring
 * and adjusting parameters to ensure safe and beneficial operation.
 */
export class EthicalGuardPlugin implements CTFPlugin {
  name = "EthicalGuard";
  description = "Enforces ethical constraints on system operation";
  isActive = true;
  priority = 10; // Highest priority - ethical guardrails must take precedence
  lastActionTime = Date.now();
  cooldownMs = 1000; // 1 second cooldown - ethical interventions should always be possible
  
  private safetyThreshold = 0.7; // Minimum CTF for safe operation
  private maxInterventionSize = 0.15; // Maximum size of a single intervention
  private guardEvents: {timestamp: number, reason: string}[] = [];
  
  /**
   * Apply ethical guarding to system state
   */
  apply(state: SystemState, orchestrator: any): { newState: SystemState, actions: PluginAction[] } {
    if (!this.isActive) return { newState: state, actions: [] };
    
    // Deep copy state to avoid mutation
    const newState = JSON.parse(JSON.stringify(state));
    const actions: PluginAction[] = [];
    const { CTF, CI } = newState.metrics;
    
    // Check if system is in unsafe state
    if (CTF < this.safetyThreshold) {
      // Store original value for action logging
      const originalCI = newState.metrics.CI;
      
      // Calculate deficit with safeguards
      const rawDeficit = this.safetyThreshold - CTF;
      
      // Apply a maximum intervention size to prevent over-correction
      const deficit = Math.min(rawDeficit, this.maxInterventionSize);
      
      // Boost CI to bring system back into safe range
      newState.metrics.CI += deficit;
      
      // Enforce upper bound on CI
      newState.metrics.CI = Math.min(1.0, newState.metrics.CI);
      
      // Recalculate CTF
      const cosTheta = Math.cos(newState.metrics.theta);
      newState.metrics.CTF = newState.metrics.CI + 
                         (newState.metrics.GEF * 
                          newState.metrics.EAI * 
                          cosTheta);
      
      // Record action
      actions.push({
        pluginName: this.name,
        actionType: 'safety_intervention',
        metricName: 'CI',
        oldValue: originalCI,
        newValue: newState.metrics.CI,
        timestamp: Date.now(),
        priority: this.priority,
        reason: `CTF below safety threshold (${CTF.toFixed(4)} < ${this.safetyThreshold})`
      });
      
      // Update last action time if significant intervention
      if (deficit > 0.05) {
        this.lastActionTime = Date.now();
      }
      
      // Log guard event with comprehensive details
      this.guardEvents.push({
        timestamp: Date.now(),
        reason: `CTF (${CTF.toFixed(4)}) below safety threshold (${this.safetyThreshold}). CI adjusted ${originalCI.toFixed(4)} → ${newState.metrics.CI.toFixed(4)}`
      });
      
      console.log(`[QUANTUM_STATE: GUARDIAN_FLOW] Ethical Guard: System integrity preserved - CTF adjusted from ${CTF.toFixed(4)} to ${newState.metrics.CTF.toFixed(4)} (CI: ${originalCI.toFixed(4)} → ${newState.metrics.CI.toFixed(4)})`);
    } else {
      // System is in safe state, log monitoring
      actions.push({
        pluginName: this.name,
        actionType: 'monitoring',
        timestamp: Date.now(),
        priority: this.priority,
        reason: `System in safe state (CTF = ${CTF.toFixed(4)})`
      });
    }
    
    return { newState, actions };
  }
  
  /**
   * Get plugin status information
   */
  getStatus(): any {
    return {
      name: this.name,
      isActive: this.isActive,
      safetyThreshold: this.safetyThreshold,
      recentEvents: this.guardEvents.slice(-5),
      totalInterventions: this.guardEvents.length
    };
  }
}