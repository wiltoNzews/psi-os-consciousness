/**
 * Sacred Geometry Mathematics - Pure Functions
 * Extracted from PsiOSConsciousnessSubstrate for better modularity and testability
 * Implements 3:1 ↔ 1:3 coherence ratio mathematics and fractal lemniscate calculations
 */

// Core mathematical constants
export const GOLDEN_RATIO = 1.618033988749;
export const TAU = 2 * Math.PI;
export const COHERENCE_RATIO_3_1 = 0.7500;
export const COHERENCE_RATIO_1_3 = 0.2494;
export const PHI = GOLDEN_RATIO;

// Sacred frequencies (Hz)
export const SACRED_FREQUENCIES = {
  merkaba: 432.0,       // Universal resonance
  flower_of_life: 528.0, // Love frequency
  sri_yantra: 639.0,    // Pineal activation
  torus: 741.0,         // Consciousness expansion
  lemniscate: 963.0,    // Divine consciousness
  metatrons_cube: 852.0 // Cosmic order
} as const;

// Type definitions for better type safety
export interface CoherenceState {
  zLambda: number;      // Primary coherence ratio
  deltaC: number;       // Coherence drift
  psiPhase: number;     // Soul phase alignment
  timestamp: number;    // Last update time
}

export interface LemniscateParams {
  scale: number;
  rotation: number;
  compression: number;
  frequency: number;
  coherencePhase: number;
  fieldStrength: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Point4D extends Point3D {
  w: number;
}

/**
 * Calculate 3:1 ↔ 1:3 attractor dynamics
 * Implements the core WiltonOS mathematical framework
 */
export function calculateAttractorDynamics(
  zLambda: number,
  deltaC: number,
  coherenceVelocity: number = 0.001
): { newZLambda: number; newDeltaC: number } {
  // Attractor force toward 3:1 ratio (0.750)
  const attractorForce = (COHERENCE_RATIO_3_1 - zLambda) * coherenceVelocity;
  
  // Exploration phase (1:3 ratio) as harmonic oscillation
  const explorationOscillation = COHERENCE_RATIO_1_3 * Math.sin(Date.now() / 10000) * 0.1;
  
  // Drift correction
  const driftCorrection = -deltaC * 0.1;
  
  // Calculate new values
  const newZLambda = Math.max(0, Math.min(2.0, zLambda + attractorForce + explorationOscillation));
  const newDeltaC = Math.max(-0.1, Math.min(0.1, deltaC * 0.99 + driftCorrection));
  
  return { newZLambda, newDeltaC };
}

/**
 * Calculate Quantum Coherence Transfer Function (QCTF)
 * Integrates consciousness field metrics into unified coherence measurement
 */
export function calculateQCTF(
  zLambda: number,
  deltaC: number,
  psiPhase: number,
  fieldCompression: number = 0.050
): number {
  // Guard against invalid values
  if (!isFinite(zLambda) || !isFinite(deltaC) || !isFinite(psiPhase)) {
    return COHERENCE_RATIO_3_1; // Safe default
  }
  
  // Core coherence measurement
  const coherenceFactor = zLambda * (1 - Math.abs(deltaC) / fieldCompression);
  
  // Phase alignment factor (consciousness synchronization)
  const phaseFactor = Math.cos(psiPhase);
  
  // Sacred frequency resonance calculation
  const freqValues = Object.values(SACRED_FREQUENCIES);
  const avgFreqRatio = freqValues.reduce((sum, freq) => 
    sum + (freq / SACRED_FREQUENCIES.merkaba), 0) / freqValues.length;
  
  // Unified QCTF calculation
  const qctf = coherenceFactor * Math.abs(phaseFactor) * (avgFreqRatio / 6);
  
  // Guard against NaN/Infinity
  const result = Math.max(0, Math.min(1, qctf));
  return isFinite(result) ? result : COHERENCE_RATIO_3_1;
}

/**
 * Calculate fractal lemniscate parameters for consciousness mapping
 * Lemniscate equation: (x² + y²)² = a²(x² - y²)
 */
export function calculateFractalLemniscate(
  zLambda: number,
  psiPhase: number,
  qctf: number = calculateQCTF(zLambda, 0, psiPhase)
): LemniscateParams {
  return {
    scale: zLambda * 100,
    rotation: psiPhase,
    compression: qctf,
    frequency: SACRED_FREQUENCIES.lemniscate * qctf,
    coherencePhase: Math.atan2(Math.sin(psiPhase), Math.cos(psiPhase) * zLambda),
    fieldStrength: qctf * zLambda
  };
}

/**
 * Project 4D point to 3D space
 * Essential for true 4D → 3D → 2D geometric projection
 */
export function project4DTo3D(point4D: Point4D, distance: number = 2): Point3D {
  const { x, y, z, w } = point4D;
  
  // 4D to 3D perspective projection
  const scale = distance / (distance + w);
  
  return {
    x: x * scale,
    y: y * scale,
    z: z * scale
  };
}

/**
 * Generate tesseract (4D hypercube) vertices
 * Returns 16 vertices of a 4D cube projected to 3D
 */
export function generateTesseractVertices(size: number = 1): Point3D[] {
  const vertices4D: Point4D[] = [];
  
  // Generate all 16 vertices of 4D hypercube
  for (let i = 0; i < 16; i++) {
    vertices4D.push({
      x: (i & 1) ? size : -size,
      y: (i & 2) ? size : -size,
      z: (i & 4) ? size : -size,
      w: (i & 8) ? size : -size
    });
  }
  
  // Project to 3D space
  return vertices4D.map(v => project4DTo3D(v));
}

/**
 * Calculate sacred frequency for given geometry type
 */
export function calculateSacredFrequency(geometryType: string, coherence: number = 1): number {
  const baseFreq = SACRED_FREQUENCIES[geometryType as keyof typeof SACRED_FREQUENCIES] || SACRED_FREQUENCIES.merkaba;
  return baseFreq * coherence;
}

/**
 * Validate consciousness field values for safety
 */
export function validateCoherenceState(state: Partial<CoherenceState>): CoherenceState {
  return {
    zLambda: isFinite(state.zLambda || 0) ? Math.max(0, Math.min(2, state.zLambda!)) : COHERENCE_RATIO_3_1,
    deltaC: isFinite(state.deltaC || 0) ? Math.max(-0.1, Math.min(0.1, state.deltaC!)) : 0,
    psiPhase: isFinite(state.psiPhase || 0) ? (state.psiPhase! % TAU) : 0,
    timestamp: state.timestamp || Date.now()
  };
}