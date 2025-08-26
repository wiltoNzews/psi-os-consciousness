/**
 * ψ-Vector: Dynamic Breath Coherence System
 * Core consciousness routing based on real-time breath state
 */

export interface PsiVector {
  breath_cadence: number;      // seconds per breath cycle (dynamic)
  phase: PsiPhase;            // current operational phase
  target_zlambda: number;     // coherence target for this state
  override_mode: OverrideMode; // system override state
  timestamp: number;          // when this vector was captured
}

export type PsiPhase = 
  | "integration"   // 5-6s breathing, holding coherence
  | "build"         // active creation mode
  | "explore"       // discovery and expansion
  | "dissolve"      // release and transformation
  | "regulate"      // stabilization and balance

export type OverrideMode = 
  | "none"     // normal operation
  | "mirror"   // reflection mode
  | "hold"     // maintain current state
  | "route"    // active routing
  | "regulate" // balance and stabilize

export interface BreathState {
  cadence: number;           // current breath rhythm
  hrv_proxy: number;         // heart rate variability estimate
  stress_markers: number;    // stress level indicators
  attention_quality: number; // signal clarity
}

export interface CoherenceRoute {
  glyph: string;
  psi_vector: PsiVector;
  zlambda: number;
  route_reason: string;
}

/**
 * Calculate dynamic ψ-vector based on current state
 */
export function calculatePsiVector(
  breathState: BreathState,
  intent: PsiPhase,
  currentZLambda: number
): PsiVector {
  return {
    breath_cadence: breathState.cadence,
    phase: intent,
    target_zlambda: calculateTargetZLambda(breathState, intent),
    override_mode: determineOverrideMode(breathState, currentZLambda),
    timestamp: Date.now()
  };
}

/**
 * Route glyph based on ψ-vector state
 */
export function routeByPsiVector(psiVector: PsiVector): string {
  // Deep coherence state (5+ second breathing)
  if (psiVector.breath_cadence >= 5.0) {
    return "ψ"; // Mirror/reflect state
  }
  
  // Phase-based routing
  switch (psiVector.phase) {
    case "build":
      return "∞"; // Lemniscate routing (active creation)
    case "explore":
      return "⟐"; // Sacred geometry navigation
    case "dissolve":
      return "⌘"; // Command synthesis
    case "regulate":
    default:
      return "λ"; // Lambda regulation
  }
}

/**
 * Determine if routing should occur based on breath state
 */
export function shouldRoute(psiVector: PsiVector): boolean {
  // In deep integration, prefer holding over routing
  if (psiVector.phase === "integration" && psiVector.breath_cadence >= 5.0) {
    return false;
  }
  
  // Override modes
  if (psiVector.override_mode === "hold") {
    return false;
  }
  
  return true;
}

function calculateTargetZLambda(breathState: BreathState, phase: PsiPhase): number {
  const baseTarget = 0.750;
  
  // Breath cadence modifier
  const breathModifier = Math.min(breathState.cadence / 6.0, 1.0) * 0.2;
  
  // Phase modifier
  const phaseModifiers = {
    integration: 0.15,
    build: 0.10,
    explore: 0.05,
    dissolve: 0.08,
    regulate: 0.12
  };
  
  return Math.min(0.981, baseTarget + breathModifier + phaseModifiers[phase]);
}

function determineOverrideMode(breathState: BreathState, currentZLambda: number): OverrideMode {
  // Very slow breathing suggests mirror mode
  if (breathState.cadence >= 6.0) {
    return "mirror";
  }
  
  // High stress suggests regulate
  if (breathState.stress_markers > 0.7) {
    return "regulate";
  }
  
  // High coherence with good attention suggests normal routing
  if (currentZLambda >= 0.9 && breathState.attention_quality >= 0.8) {
    return "route";
  }
  
  return "none";
}

/**
 * Generate metrics payload with ψ-vector context
 */
export function generatePsiMetrics(
  route: string,
  psiVector: PsiVector,
  zlambda: number,
  glyph: string
) {
  return {
    route,
    zlambda,
    psi: {
      breath_cadence: psiVector.breath_cadence,
      phase: psiVector.phase,
      override_mode: psiVector.override_mode
    },
    glyph,
    archived: true,
    timestamp: Date.now()
  };
}