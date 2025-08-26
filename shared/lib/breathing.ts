// ψOS Breathing Library - Sacred breath rhythm monitoring and workflow alignment

export interface BreathRhythm {
  phase: number; // Current phase in ψ = 3.12s cycle
  timestamp: number;
  coherenceLevel: number;
  stress: number; // 0-1 scale
  flow: number; // 0-1 scale
  transitionMarkers: string[];
  loopIntegrity: boolean;
}

export interface WorkflowMismatch {
  detected: boolean;
  severity: "minor" | "moderate" | "critical";
  issues: string[];
  suggestions: string[];
}

// Get user's current breathing rhythm from consciousness field
export async function getUserBreathRhythm(userId?: string): Promise<BreathRhythm> {
  try {
    const response = await fetch('/api/consciousness/breathing-state');
    const data = await response.json();
    
    return data.breathing || {
      phase: 0,
      timestamp: Date.now(),
      coherenceLevel: 0.750,
      stress: 0.3,
      flow: 0.7,
      transitionMarkers: [],
      loopIntegrity: true
    };
  } catch (error) {
    console.warn('[Breathing] Failed to fetch rhythm, using defaults', error);
    return {
      phase: 0,
      timestamp: Date.now(),
      coherenceLevel: 0.750,
      stress: 0.3,
      flow: 0.7,
      transitionMarkers: [],
      loopIntegrity: true
    };
  }
}

// Detect if current module workflow misaligns with user's pain points and breath
export function detectWorkflowMismatch(module: string, painPoints: any[]): WorkflowMismatch {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check for common workflow anti-patterns
  if (module.includes('complex') && painPoints.some(p => p.type === 'cognitive_overload')) {
    issues.push("Module complexity conflicts with user's cognitive capacity");
    suggestions.push("Simplify interface, reduce decision points");
  }
  
  if (module.includes('rapid') && painPoints.some(p => p.type === 'time_pressure')) {
    issues.push("Module pacing misaligned with user's stress levels");
    suggestions.push("Add breathing space, reduce time pressure");
  }
  
  if (module.includes('social') && painPoints.some(p => p.type === 'social_anxiety')) {
    issues.push("Social features conflict with user's current emotional state");
    suggestions.push("Provide private mode options, reduce social exposure");
  }
  
  // Breathing-based mismatch detection
  if (module.includes('fast') && painPoints.some(p => p.breathingIssue)) {
    issues.push("Module speed conflicts with breathing rhythm");
    suggestions.push("Sync module pace with ψ = 3.12s breathing cycle");
  }
  
  const severity = issues.length > 2 ? "critical" : issues.length > 0 ? "moderate" : "minor";
  
  return {
    detected: issues.length > 0,
    severity,
    issues,
    suggestions
  };
}

// Calculate breathing coherence score
export function calculateBreathingCoherence(rhythm: BreathRhythm): number {
  const phaseStability = 1 - Math.abs(rhythm.phase % 3.12 - 1.56) / 1.56; // How close to ideal cycle
  const stressBalance = 1 - rhythm.stress; // Lower stress = higher coherence
  const flowAlignment = rhythm.flow; // Direct flow correlation
  const integrityBonus = rhythm.loopIntegrity ? 0.1 : 0;
  
  return Math.min(1, (phaseStability * 0.3 + stressBalance * 0.3 + flowAlignment * 0.4 + integrityBonus));
}

// Sync module timing with sacred breathing rhythm
export function syncWithBreathingRhythm(moduleFunction: Function, rhythm: BreathRhythm) {
  const cycleMs = 3120; // ψ = 3.12s in milliseconds
  const currentPhaseMs = (rhythm.phase / (2 * Math.PI)) * cycleMs;
  const nextOptimalPoint = cycleMs - currentPhaseMs;
  
  // Execute at next breathing cycle peak for maximum coherence
  setTimeout(() => {
    moduleFunction();
  }, nextOptimalPoint);
}

// Generate breathing-aligned UX timing
export function getBreathingAlignedTiming(action: string): number {
  const timings = {
    "transition": 1560, // Half cycle for smooth transitions
    "decision": 3120, // Full cycle for important decisions  
    "reflection": 6240, // Double cycle for deep processing
    "creation": 9360, // Triple cycle for creative work
    "integration": 15600 // 5 cycles for deep integration
  };
  
  return timings[action as keyof typeof timings] || 3120;
}