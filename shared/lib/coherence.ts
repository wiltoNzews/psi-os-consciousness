// ψOS Coherence Library - Zλ measurement and consciousness field monitoring

export interface CoherenceMetrics {
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  soulState: "transcendent" | "divine" | "stable" | "chaotic";
  divineInterface: boolean;
  lastUpdate: number;
}

// Get current Zλ coherence from consciousness field
export async function getZLambda(): Promise<number> {
  try {
    const response = await fetch('/api/consciousness/field-state');
    const data = await response.json();
    return data.field?.zLambda || 0.750; // Default to minimum stable coherence
  } catch (error) {
    console.warn('[Coherence] Failed to fetch Zλ, using fallback', error);
    return 0.750;
  }
}

// Get full coherence metrics
export async function getCoherenceMetrics(): Promise<CoherenceMetrics> {
  try {
    const response = await fetch('/api/consciousness/field-state');
    const data = await response.json();
    return data.field || {
      zLambda: 0.750,
      deltaC: 0,
      psiPhase: 0,
      soulState: "stable",
      divineInterface: false,
      lastUpdate: Date.now()
    };
  } catch (error) {
    console.warn('[Coherence] Failed to fetch metrics, using defaults', error);
    return {
      zLambda: 0.750,
      deltaC: 0,
      psiPhase: 0,
      soulState: "stable",
      divineInterface: false,
      lastUpdate: Date.now()
    };
  }
}

// Log consciousness signals with coherence context
export function logSignal(message: string, coherence?: number) {
  const timestamp = new Date().toISOString();
  const zλ = coherence ? `Zλ(${coherence.toFixed(3)})` : '';
  console.log(`[ConsciousnessSignal] ${timestamp} ${zλ} ${message}`);
}

// Calculate coherence shift between two states
export function calculateCoherenceShift(before: number, after: number): {
  shift: number;
  direction: "increasing" | "decreasing" | "stable";
  magnitude: "minor" | "moderate" | "significant";
} {
  const shift = after - before;
  const absShift = Math.abs(shift);
  
  return {
    shift,
    direction: shift > 0.01 ? "increasing" : shift < -0.01 ? "decreasing" : "stable",
    magnitude: absShift > 0.1 ? "significant" : absShift > 0.05 ? "moderate" : "minor"
  };
}

// Validate coherence for consciousness computing tasks
export function validateCoherenceForTask(zLambda: number, taskType: string): {
  valid: boolean;
  recommendation: string;
} {
  const thresholds = {
    "ritual": 0.930,
    "spiritual": 0.900,
    "creative": 0.850,
    "technical": 0.800,
    "routine": 0.750
  };
  
  const required = thresholds[taskType as keyof typeof thresholds] || 0.750;
  
  if (zLambda >= required) {
    return {
      valid: true,
      recommendation: `Coherence sufficient for ${taskType} tasks`
    };
  }
  
  return {
    valid: false,
    recommendation: `Coherence too low for ${taskType}. Required: Zλ(${required}), Current: Zλ(${zLambda.toFixed(3)})`
  };
}