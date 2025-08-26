/**
 * Implicit Drift Detection & Recalibration (IDDR) System
 * 
 * A utility for detecting and correcting deviations from the optimal 3:1 coherence ratio.
 * This system monitors quantum balance across components and applies automatic recalibration.
 */

import quantumCoherenceLogger from './quantum-coherence-logger';

export enum DriftType {
  NONE = 'NONE',
  COHERENCE = 'COHERENCE_EXCESS', // Too much coherence, not enough exploration
  EXPLORATION = 'EXPLORATION_EXCESS', // Too much exploration, not enough coherence
  OSCILLATION = 'OSCILLATION', // Unstable oscillation between states
  FRACTURE = 'FRACTURE', // Structural breakdown of quantum coherence
  RAPID_CHANGE = 'RAPID_CHANGE' // Too-fast changes in coherence ratio
}

export interface DriftDetectionResult {
  detected: boolean;
  type: DriftType;
  magnitude: number; // 0-1 scale of severity
  affectedComponents: string[];
  recalibrationSuggestions: string[];
}

export interface RecalibrationResult {
  recalibrated: boolean;
  newStabilityRatio?: number;
  newExplorationRatio?: number;
  appliedActions: string[];
}

// Constants defining the optimal coherence parameters
const OPTIMAL_STABILITY_RATIO = 0.75; // 75% stability/coherence
const OPTIMAL_EXPLORATION_RATIO = 0.25; // 25% exploration/chaos
const OPTIMAL_COHERENCE_RATIO = OPTIMAL_STABILITY_RATIO / OPTIMAL_EXPLORATION_RATIO; // 3:1 ratio
const DRIFT_DETECTION_THRESHOLD = 0.1; // Acceptable deviation from optimal ratio
const FRACTURE_THRESHOLD = 0.3; // Severe deviation indicating structural fracture
const RAPID_CHANGE_THRESHOLD = 0.2; // Max acceptable change between consecutive measurements

/**
 * Detect drift from the optimal 3:1 coherence ratio
 */
export function detectDrift(): DriftDetectionResult {
  const logs = quantumCoherenceLogger.getCoherenceLogs();
  
  // Define default result (no drift detected)
  const defaultResult: DriftDetectionResult = {
    detected: false,
    type: DriftType.NONE,
    magnitude: 0,
    affectedComponents: [],
    recalibrationSuggestions: []
  };
  
  // Need at least 2 logs to detect drift patterns
  if (logs.length < 2) {
    return defaultResult;
  }
  
  // Check for drift in most recent measurement
  const latestLog = logs[0];
  const actualRatio = latestLog.stabilityRatio / latestLog.explorationRatio;
  const ratioDifference = Math.abs(actualRatio - OPTIMAL_COHERENCE_RATIO);
  
  // If within threshold, no drift detected
  if (ratioDifference <= DRIFT_DETECTION_THRESHOLD) {
    return defaultResult;
  }
  
  // Drift detected - identify type and magnitude
  const isTooCoherent = actualRatio > OPTIMAL_COHERENCE_RATIO + DRIFT_DETECTION_THRESHOLD;
  const isTooExplorative = actualRatio < OPTIMAL_COHERENCE_RATIO - DRIFT_DETECTION_THRESHOLD;
  let driftType = DriftType.NONE;
  
  if (isTooCoherent) {
    driftType = DriftType.COHERENCE;
  } else if (isTooExplorative) {
    driftType = DriftType.EXPLORATION;
  }
  
  // Calculate magnitude (0-1 scale)
  const magnitudeDenominator = Math.max(FRACTURE_THRESHOLD, ratioDifference);
  const driftMagnitude = Math.min(1, ratioDifference / magnitudeDenominator);
  
  // Check for rapid change drift
  const previousLog = logs[1];
  const previousRatio = previousLog.stabilityRatio / previousLog.explorationRatio;
  const ratioChangeRate = Math.abs(actualRatio - previousRatio);
  
  if (ratioChangeRate > RAPID_CHANGE_THRESHOLD) {
    driftType = DriftType.RAPID_CHANGE;
  }
  
  // Check for oscillation pattern (alternating between states)
  if (logs.length >= 4) {
    const recentLogs = logs.slice(0, 4);
    let oscillationCount = 0;
    
    recentLogs.forEach((log, i) => {
      if (i > 0) {
        const currentRatio = log.stabilityRatio / log.explorationRatio;
        const prevRatio = recentLogs[i-1].stabilityRatio / recentLogs[i-1].explorationRatio;
        
        // If direction changed
        if ((currentRatio > prevRatio && prevRatio < OPTIMAL_COHERENCE_RATIO) || 
            (currentRatio < prevRatio && prevRatio > OPTIMAL_COHERENCE_RATIO)) {
          oscillationCount++;
        }
      }
    });
    
    if (oscillationCount >= 2) {
      driftType = DriftType.OSCILLATION;
    }
  }
  
  // Check for fracture (severe deviation)
  if (ratioDifference > FRACTURE_THRESHOLD) {
    driftType = DriftType.FRACTURE;
  }
  
  // Identify affected components
  const components = [...new Set(logs.slice(0, 5).map(log => log.component))];
  const affectedComponents = components.filter(component => {
    const componentLogs = logs.filter(log => log.component === component);
    if (componentLogs.length === 0) return false;
    
    const latestComponentRatio = componentLogs[0].stabilityRatio / componentLogs[0].explorationRatio;
    return Math.abs(latestComponentRatio - OPTIMAL_COHERENCE_RATIO) > DRIFT_DETECTION_THRESHOLD;
  });
  
  // Generate recalibration suggestions
  const recalibrationSuggestions: string[] = [];
  
  switch (driftType) {
    case DriftType.COHERENCE:
      recalibrationSuggestions.push(`Increase exploration ratio to ${Math.min(0.3, latestLog.explorationRatio + 0.05).toFixed(2)}`);
      recalibrationSuggestions.push(`Decrease stability ratio to ${Math.max(0.7, latestLog.stabilityRatio - 0.05).toFixed(2)}`);
      recalibrationSuggestions.push('Introduce controlled perturbations to increase system variability');
      break;
      
    case DriftType.EXPLORATION:
      recalibrationSuggestions.push(`Increase stability ratio to ${Math.min(0.8, latestLog.stabilityRatio + 0.05).toFixed(2)}`);
      recalibrationSuggestions.push(`Decrease exploration ratio to ${Math.max(0.2, latestLog.explorationRatio - 0.05).toFixed(2)}`);
      recalibrationSuggestions.push('Strengthen structural coherence through reinforcement patterns');
      break;
      
    case DriftType.OSCILLATION:
      recalibrationSuggestions.push('Implement dampening protocol to stabilize fluctuations');
      recalibrationSuggestions.push('Increase measurement frequency to enable finer adjustments');
      recalibrationSuggestions.push('Integrate momentum factor to smooth transitions between states');
      break;
      
    case DriftType.FRACTURE:
      recalibrationSuggestions.push('Immediate emergency recalibration required');
      recalibrationSuggestions.push('Reset system to optimal 3:1 baseline');
      recalibrationSuggestions.push('Initiate system-wide coherence reinforcement protocol');
      break;
      
    case DriftType.RAPID_CHANGE:
      recalibrationSuggestions.push('Engage change rate limiters to prevent sudden fluctuations');
      recalibrationSuggestions.push('Implement hysteresis band to require more significant thresholds for state changes');
      recalibrationSuggestions.push('Deploy transitional buffer to smooth rapid changes');
      break;
      
    default:
      recalibrationSuggestions.push('Maintain current coherence levels');
  }
  
  return {
    detected: true,
    type: driftType,
    magnitude: driftMagnitude,
    affectedComponents: affectedComponents as string[],
    recalibrationSuggestions
  };
}

/**
 * Apply recalibration to correct drift
 * 
 * @param driftResult - The result of drift detection
 */
export function applyRecalibration(driftResult: DriftDetectionResult): RecalibrationResult {
  // If no drift detected, no recalibration needed
  if (!driftResult.detected || driftResult.type === DriftType.NONE) {
    return {
      recalibrated: false,
      appliedActions: ['No recalibration needed - system within optimal parameters']
    };
  }
  
  const logs = quantumCoherenceLogger.getCoherenceLogs();
  if (logs.length === 0) {
    return {
      recalibrated: false,
      appliedActions: ['No coherence logs available for recalibration']
    };
  }
  
  const latestLog = logs[0];
  let newStabilityRatio = latestLog.stabilityRatio;
  let newExplorationRatio = latestLog.explorationRatio;
  const appliedActions: string[] = [];
  
  // Apply recalibration based on drift type
  switch (driftResult.type) {
    case DriftType.COHERENCE:
      // Too much coherence - increase exploration, decrease stability
      const coherenceAdjustment = 0.05 * driftResult.magnitude;
      newStabilityRatio = Math.max(0.7, latestLog.stabilityRatio - coherenceAdjustment);
      newExplorationRatio = Math.min(0.3, latestLog.explorationRatio + coherenceAdjustment);
      
      appliedActions.push(`Decreased stability ratio from ${latestLog.stabilityRatio.toFixed(2)} to ${newStabilityRatio.toFixed(2)}`);
      appliedActions.push(`Increased exploration ratio from ${latestLog.explorationRatio.toFixed(2)} to ${newExplorationRatio.toFixed(2)}`);
      break;
      
    case DriftType.EXPLORATION:
      // Too much exploration - increase stability, decrease exploration
      const explorationAdjustment = 0.05 * driftResult.magnitude;
      newStabilityRatio = Math.min(0.8, latestLog.stabilityRatio + explorationAdjustment);
      newExplorationRatio = Math.max(0.2, latestLog.explorationRatio - explorationAdjustment);
      
      appliedActions.push(`Increased stability ratio from ${latestLog.stabilityRatio.toFixed(2)} to ${newStabilityRatio.toFixed(2)}`);
      appliedActions.push(`Decreased exploration ratio from ${latestLog.explorationRatio.toFixed(2)} to ${newExplorationRatio.toFixed(2)}`);
      break;
      
    case DriftType.OSCILLATION:
      // Oscillating system - move halfway toward optimal
      newStabilityRatio = (latestLog.stabilityRatio + OPTIMAL_STABILITY_RATIO) / 2;
      newExplorationRatio = (latestLog.explorationRatio + OPTIMAL_EXPLORATION_RATIO) / 2;
      
      appliedActions.push(`Applied dampening protocol to address oscillation`);
      appliedActions.push(`Adjusted stability ratio from ${latestLog.stabilityRatio.toFixed(2)} to ${newStabilityRatio.toFixed(2)}`);
      appliedActions.push(`Adjusted exploration ratio from ${latestLog.explorationRatio.toFixed(2)} to ${newExplorationRatio.toFixed(2)}`);
      break;
      
    case DriftType.FRACTURE:
      // Fracture - reset to optimal values
      newStabilityRatio = OPTIMAL_STABILITY_RATIO;
      newExplorationRatio = OPTIMAL_EXPLORATION_RATIO;
      
      appliedActions.push(`Emergency recalibration applied to address quantum fracture`);
      appliedActions.push(`Reset to optimal stability ratio: ${OPTIMAL_STABILITY_RATIO.toFixed(2)}`);
      appliedActions.push(`Reset to optimal exploration ratio: ${OPTIMAL_EXPLORATION_RATIO.toFixed(2)}`);
      break;
      
    case DriftType.RAPID_CHANGE:
      // Rapid change - apply gentle correction toward optimal
      const changeRateLimiter = 0.03; // Max change allowed per recalibration
      
      // Calculate desired changes
      const desiredStabilityChange = OPTIMAL_STABILITY_RATIO - latestLog.stabilityRatio;
      const desiredExplorationChange = OPTIMAL_EXPLORATION_RATIO - latestLog.explorationRatio;
      
      // Apply rate-limited changes
      const stabilityChange = Math.sign(desiredStabilityChange) * Math.min(Math.abs(desiredStabilityChange), changeRateLimiter);
      const explorationChange = Math.sign(desiredExplorationChange) * Math.min(Math.abs(desiredExplorationChange), changeRateLimiter);
      
      newStabilityRatio = latestLog.stabilityRatio + stabilityChange;
      newExplorationRatio = latestLog.explorationRatio + explorationChange;
      
      appliedActions.push(`Applied rate limiters to address rapid change pattern`);
      appliedActions.push(`Gradually adjusted stability ratio from ${latestLog.stabilityRatio.toFixed(2)} to ${newStabilityRatio.toFixed(2)}`);
      appliedActions.push(`Gradually adjusted exploration ratio from ${latestLog.explorationRatio.toFixed(2)} to ${newExplorationRatio.toFixed(2)}`);
      break;
  }
  
  // Normalize to ensure ratios sum to 1
  const total = newStabilityRatio + newExplorationRatio;
  if (total !== 1) {
    newStabilityRatio = newStabilityRatio / total;
    newExplorationRatio = newExplorationRatio / total;
    appliedActions.push(`Normalized ratios to ensure sum of 1 (100%)`);
  }
  
  // Log the recalibration
  quantumCoherenceLogger.logCoherenceEvent(
    'ImplicitDriftDetectionSystem',
    newStabilityRatio,
    newExplorationRatio,
    'recalibration',
    `Recalibration applied for ${driftResult.type} drift (magnitude: ${driftResult.magnitude.toFixed(2)})`
  );
  
  return {
    recalibrated: true,
    newStabilityRatio,
    newExplorationRatio,
    appliedActions
  };
}

/**
 * Generate a recalibration plan without applying it
 * 
 * @param driftResult - The result of drift detection
 */
export function generateRecalibrationPlan(driftResult: DriftDetectionResult): {
  plan: string[];
  estimatedNewRatio: number;
} {
  if (!driftResult.detected || driftResult.type === DriftType.NONE) {
    return {
      plan: ['No recalibration needed - system within optimal parameters'],
      estimatedNewRatio: OPTIMAL_COHERENCE_RATIO
    };
  }
  
  const logs = quantumCoherenceLogger.getCoherenceLogs();
  if (logs.length === 0) {
    return {
      plan: ['No coherence logs available for planning recalibration'],
      estimatedNewRatio: OPTIMAL_COHERENCE_RATIO
    };
  }
  
  // Create a detailed plan
  const plan = [
    `Detected ${driftResult.type} drift with magnitude ${(driftResult.magnitude * 100).toFixed(0)}%`,
    `Affected components: ${driftResult.affectedComponents.join(', ') || 'None specifically identified'}`
  ];
  
  // Add recalibration suggestions
  plan.push('Recommended actions:');
  driftResult.recalibrationSuggestions.forEach(suggestion => {
    plan.push(`- ${suggestion}`);
  });
  
  // Estimate new ratio after recalibration
  let estimatedNewRatio = OPTIMAL_COHERENCE_RATIO;
  
  if (logs.length > 0) {
    const latestLog = logs[0];
    const currentRatio = latestLog.stabilityRatio / latestLog.explorationRatio;
    
    // Estimate how much the recalibration will move toward optimal
    const correctionFactor = 0.6; // How much of the difference will be corrected
    estimatedNewRatio = currentRatio + (OPTIMAL_COHERENCE_RATIO - currentRatio) * correctionFactor;
  }
  
  plan.push(`Estimated new ratio after recalibration: ${estimatedNewRatio.toFixed(2)}:1`);
  
  return {
    plan,
    estimatedNewRatio
  };
}