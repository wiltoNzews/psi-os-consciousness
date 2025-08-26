/**
 * Quantum Coherence Threshold Formula (QCTF) Calculator V4.0
 * [QUANTUM_STATE: FOUNDATIONAL_FLOW]
 * 
 * Implements the enhanced QCTF formula with the Three-Stage calculation approach:
 * 
 * Stage 1: Raw Synergy Score
 * QCTF_raw(t) = ((GEF(t) * QEAI(t) * CI(t) * 𝓓(t))^Ω * 𝓣_toggles(t) * 𝓕(t)) / √(entropyScale * Ψ_entropy(t) + ε)
 * 
 * Stage 2: Temporal Smoothing
 * QCTF_smoothed(t) = λ * QCTF_raw(t-1) + (1-λ) * QCTF_raw(t)
 * 
 * Stage 3: Normalized Output
 * QCTF_final(t) = tanh(k * QCTF_smoothed(t)) ∈ [0,1]
 */

import { QCTFData, ScalingMetrics, Toggles, ModuleCoherence, QCTFHistoryEntry } from './qctf.js';

/**
 * Calculate the enhanced Dimension Scaling Factor (𝓓) - v4.0
 * 𝓓 = 1 + 𝛿_scale * (1 - εₗₐₜ * latency)
 * where 𝛿_scale = κ * ln(modules + 1) * ln(parallelTasks + 1) * (1 + η * depth)
 */
export function calculateDimensionScalingFactor(qctfData: QCTFData): number {
  const { 
    scalingMetrics, 
    kappa, 
    epsilonD: epsilonLat, 
    eta, 
    maxError 
  } = qctfData;
  
  const { 
    modules = 1, 
    parallelTasks = 1, 
    depth = 0, 
    latency = 0,
    errorRate = 0
  } = scalingMetrics;
  
  // Apply dynamic κ adjustment based on error rate
  const dynamicKappa = kappa * (1 - errorRate / maxError);
  
  // Calculate delta_scale based on modules, parallelTasks, and fractal depth
  const deltaScale = dynamicKappa * 
    Math.log(modules + 1) * 
    Math.log(parallelTasks + 1) * 
    (1 + eta * depth);
  
  // Apply latency penalty
  const dimensionFactor = 1 + deltaScale * (1 - epsilonLat * latency);
  
  // Ensure result is in reasonable bounds [1, 2]
  return Math.max(1, Math.min(2, dimensionFactor));
}

/**
 * Calculate the enhanced Toggle Function (𝓣_toggles) - v4.0
 * 𝓣_toggles = ∏ T_i(t)^w_i, with exponential decay of toggle effects
 * where T_i(t) = 1 + (T_i(0) - 1) * e^(-μt)
 */
export function calculateToggleFunction(qctfData: QCTFData): number {
  const { toggles, toggleWeights, gamma, mu } = qctfData;
  
  // Active toggles with their values
  const activeToggles = Object.entries(toggles)
    .filter(([_, toggle]) => toggle.active)
    .map(([type, toggle]) => ({
      type,
      value: toggle.value,
      // Calculate time since activation if lastActivated exists
      timeSinceActivation: toggle.lastActivated
        ? (Date.now() - new Date(toggle.lastActivated).getTime()) / 1000 // in seconds
        : 0
    }));
  
  // If no toggles are active, return neutral value 1.0
  if (activeToggles.length === 0) {
    return 1.0;
  }
  
  // If only one toggle is active, apply it directly with decay
  if (activeToggles.length === 1) {
    const toggle = activeToggles[0];
    const weight = toggleWeights[toggle.type as keyof typeof toggleWeights];
    const decayedValue = 1 + (toggle.value - 1) * Math.exp(-mu * toggle.timeSinceActivation);
    return Math.pow(decayedValue, weight);
  }
  
  // If multiple toggles, handle potential conflicts
  // For conflicts, use: T_effective = max(T_i, T_j) * (1 - γ * |T_i - T_j|)
  
  // Get the min and max toggle values
  let minToggle = activeToggles.reduce(
    (min, t) => t.value < min.value ? t : min, 
    activeToggles[0]
  );
  
  let maxToggle = activeToggles.reduce(
    (max, t) => t.value > max.value ? t : max, 
    activeToggles[0]
  );
  
  // Calculate effective toggle value with conflict resolution
  const valueDifference = Math.abs(maxToggle.value - minToggle.value);
  const effectiveValue = maxToggle.value * (1 - gamma * valueDifference);
  
  // Calculate combined weighted product with decay for each toggle
  let toggleFunction = 1.0;
  for (const toggle of activeToggles) {
    const weight = toggleWeights[toggle.type as keyof typeof toggleWeights];
    
    // Apply weighted product with decay
    const decayedValue = 1 + (effectiveValue - 1) * Math.exp(-mu * toggle.timeSinceActivation);
    toggleFunction *= Math.pow(decayedValue, weight);
  }
  
  // Ensure result is in reasonable bounds [0.5, 1.5]
  return Math.max(0.5, Math.min(1.5, toggleFunction));
}

/**
 * Calculate system entropy based on core metrics and module variance - v4.0
 * Ψ_entropy = (1/3) * Σ(term_i - term_avg)² + σ_modules
 */
export function calculateSystemEntropy(qctfData: QCTFData): number {
  // Extract basic core terms
  const { gef, qeai, ci, moduleCoherence } = qctfData;
  const terms = [gef, qeai, ci];
  
  // Calculate term variance
  const meanTerm = terms.reduce((sum, val) => sum + val, 0) / terms.length;
  const termVariance = terms.reduce(
    (sum, val) => sum + Math.pow(val - meanTerm, 2), 
    0
  ) / terms.length;
  
  // Calculate module variance
  const moduleValues = Object.values(moduleCoherence);
  const meanModule = moduleValues.reduce((sum, val) => sum + val, 0) / moduleValues.length;
  const moduleVariance = moduleValues.reduce(
    (sum, val) => sum + Math.pow(val - meanModule, 2), 
    0
  ) / moduleValues.length;
  
  // Combined entropy calculation
  const entropy = (1/3) * termVariance + moduleVariance;
  
  // Ensure result is in reasonable bounds [0, 1]
  return Math.max(0, Math.min(1, entropy));
}

/**
 * Calculate the stabilizing feedback function (𝓕) - v4.0
 * 𝓕(t) = 1 - α * |ΔQCTF/Δt| - β * |predicted ΔQCTF(t+1)|
 */
export function calculateFeedbackFunction(qctfData: QCTFData, currentRawQCTF: number): number {
  const { 
    previousRawQCTF, 
    previousDeltaQCTF, 
    alpha, 
    beta 
  } = qctfData;
  
  // If no previous values, return neutral feedback
  if (previousRawQCTF === null) {
    return 1.0;
  }
  
  // Calculate current rate of change
  const deltaQCTF = currentRawQCTF - previousRawQCTF;
  const rateFactor = Math.abs(deltaQCTF);
  
  // Simple extrapolation for predicted change
  const predictedChange = previousDeltaQCTF !== null
    ? 2 * deltaQCTF - previousDeltaQCTF  // Use previous delta to predict acceleration
    : deltaQCTF;  // Fall back to current delta
  
  const predictionFactor = Math.abs(predictedChange);
  
  // Calculate feedback function
  const feedbackFunction = 1 - alpha * rateFactor - beta * predictionFactor;
  
  // Ensure result is in reasonable bounds [0.5, 1]
  return Math.max(0.5, Math.min(1, feedbackFunction));
}

/**
 * Calculate the raw QCTF value (Stage 1: Raw Synergy Score) - v4.0
 */
export function calculateRawQCTF(qctfData: QCTFData): number {
  // Calculate dimension scaling factor
  const dimensionFactor = calculateDimensionScalingFactor(qctfData);
  qctfData.dimensionScalingFactor = dimensionFactor;
  
  // Calculate toggle function
  const toggleFunction = calculateToggleFunction(qctfData);
  
  // Calculate entropy
  const entropy = calculateSystemEntropy(qctfData);
  
  // Calculate initial raw QCTF (without feedback)
  const initialRawQCTF = (
    Math.pow(
      qctfData.gef * qctfData.qeai * qctfData.ci * dimensionFactor,
      qctfData.oroboroConstant
    ) * toggleFunction
  ) / Math.sqrt(qctfData.entropyScale * entropy + qctfData.epsilon);
  
  // Calculate feedback function using initial raw QCTF
  const feedbackFunction = calculateFeedbackFunction(qctfData, initialRawQCTF);
  qctfData.feedbackFunction = feedbackFunction;
  
  // Apply feedback to get final raw QCTF
  const rawQCTF = initialRawQCTF * feedbackFunction;
  
  return rawQCTF;
}

/**
 * Calculate the smoothed QCTF value (Stage 2: Temporal Smoothing) - v4.0
 */
export function calculateSmoothedQCTF(currentRaw: number, previousRaw: number | null, lambda: number): number {
  if (previousRaw === null) {
    return currentRaw;
  }
  
  // Apply exponential smoothing: QCTF_smoothed(t) = λ * QCTF_raw(t-1) + (1-λ) * QCTF_raw(t)
  return lambda * previousRaw + (1 - lambda) * currentRaw;
}

/**
 * Optional: Apply cyclic flow patterns to QCTF_smoothed - v4.0
 */
export function applyCyclicFlow(
  smoothedQCTF: number, 
  config: { 
    enabled: boolean, 
    period: number, 
    phase: number, 
    amplitude: number 
  } | undefined,
  time: number = Date.now() / 1000 // Current time in seconds
): number {
  // If cycle detection is not enabled or not configured, return original value
  if (!config || !config.enabled) {
    return smoothedQCTF;
  }
  
  // Calculate cyclic component
  const { period, phase, amplitude } = config;
  const cyclicComponent = amplitude * Math.exp(-0.05 * time) * Math.cos(2 * Math.PI * time / period + phase);
  
  // Apply cyclic component
  return smoothedQCTF * (1 + cyclicComponent);
}

/**
 * Calculate the final QCTF value (Stage 3: Normalized Output) - v4.0
 */
export function calculateFinalQCTF(smoothed: number, k: number): number {
  // Apply tanh normalization: QCTF_final(t) = tanh(k * QCTF_smoothed(t))
  return Math.tanh(k * smoothed);
}

/**
 * Calculate the complete QCTF value and update the QCTF data - v4.0
 */
export function calculateQCTF(qctfData: QCTFData): number {
  // Stage 1: Calculate raw QCTF
  const rawQCTF = calculateRawQCTF(qctfData);
  
  // Stage 2: Calculate smoothed QCTF
  const smoothedQCTF = calculateSmoothedQCTF(
    rawQCTF,
    qctfData.previousRawQCTF,
    qctfData.lambda
  );
  
  // Optional: Apply cyclic flow if enabled
  const flowAdjustedQCTF = applyCyclicFlow(smoothedQCTF, qctfData.cycleDetection);
  
  // Stage 3: Calculate final QCTF
  const finalQCTF = calculateFinalQCTF(flowAdjustedQCTF, qctfData.k);
  
  // Get active toggle names for history
  const activeToggles = Object.entries(qctfData.toggles)
    .filter(([_, toggle]) => toggle.active)
    .map(([type, _]) => type);
  
  // Update history with current values
  const historyEntry: QCTFHistoryEntry = {
    timestamp: new Date().toISOString(),
    qctf: finalQCTF,
    
    // Core components
    gef: qctfData.gef,
    qeai: qctfData.qeai,
    ci: qctfData.ci,
    
    // Advanced components
    rawQCTF: rawQCTF,
    smoothedQCTF: flowAdjustedQCTF,
    dimensionFactor: qctfData.dimensionScalingFactor,
    toggleFunction: calculateToggleFunction(qctfData),
    feedbackFunction: qctfData.feedbackFunction,
    entropy: calculateSystemEntropy(qctfData),
    
    // Active toggles
    activeToggles: activeToggles
  };
  
  // Add to history and keep a reasonable limit
  qctfData.history.push(historyEntry);
  if (qctfData.history.length > 100) {
    qctfData.history.shift();
  }
  
  // Store current delta for future feedback calculations
  const currentDelta = qctfData.previousRawQCTF !== null 
    ? rawQCTF - qctfData.previousRawQCTF 
    : 0;
  
  // Update the previous values for next calculation
  qctfData.previousDeltaQCTF = currentDelta;
  qctfData.previousRawQCTF = rawQCTF;
  
  return finalQCTF;
}

/**
 * Helper function to create a default QCTF data object with v4.0 values
 */
export function createDefaultQCTFData(): QCTFData {
  return {
    // Basic QCTF components
    gef: 0.85, // Global Entanglement Factor
    qeai: 0.9, // Quantum Ethical Alignment Index
    ci: 0.8, // Coherence Index
    
    // QCTF parameters
    entropyScale: 10,
    entropy: 0.15, // Base entropy (will be dynamically calculated)
    oroboroConstant: 1.618, // Ω (golden ratio)
    
    // Fixed constants - calibrated for QCTF v4.0
    epsilon: 1e-6, // Numerical safeguard
    kappa: 0.05, // Dimension scaling parameter
    epsilonD: 0.1, // Latency impact factor
    gamma: 0.5, // Toggle conflict resolution
    lambda: 0.8, // Temporal smoothing
    k: 1, // Tanh normalization steepness
    mu: 0.1, // Toggle decay rate
    alpha: 0.2, // Feedback current rate weight
    beta: 0.1, // Feedback prediction weight
    eta: 0.03, // Module coherence sensitivity
    maxError: 0.2, // Maximum error rate cap
    
    // Toggle weights
    toggleWeights: {
      stop: 0.6,
      failsafe: 0.25,
      reroute: 0.1,
      wormhole: 0.05
    },
    
    // Core QCTF v4.0 components
    dimensionScalingFactor: 1.0, // 𝓓
    feedbackFunction: 1.0, // ℱ
    toggles: {
      stop: { active: false, value: 0.8, lastActivated: null },
      failsafe: { active: false, value: 0.9, lastActivated: null },
      reroute: { active: false, value: 1.1, lastActivated: null },
      wormhole: { active: false, value: 1.2, lastActivated: null }
    },
    
    // Tracking and history
    scalingMetrics: {
      parallelTasks: 1,
      modules: 1,
      depth: 0,
      latency: 0,
      errorRate: 0,
      hpcScaleFactor: 1.0,
      timelineBranches: 1
    },
    moduleCoherence: {
      oracle: 0.85,
      nova: 0.75,
      gnosis: 0.8,
      sanctum: 0.9,
      halo: 0.82
    },
    history: [],
    
    // Previous state for smoothing and feedback
    previousRawQCTF: 0.5, // Initialize at neutral 0.5
    previousDeltaQCTF: 0,
    
    // Optional cycle detection (disabled by default)
    cycleDetection: {
      enabled: false,
      period: 86400, // Default: 1 day in seconds
      phase: 0,
      amplitude: 0.1
    }
  };
}