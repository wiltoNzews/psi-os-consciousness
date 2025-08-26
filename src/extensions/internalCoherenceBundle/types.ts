// Type declarations for Internal + Visual Coherence Bundle
// Provides IntelliSense for CoherenceCoach/SacredGeometryOverlay APIs

export interface CoherenceMetrics {
  zLambda: number;  // Consciousness coherence 0.5-1.0
  phi: number;      // Integrated Information 0.3-1.0
  orch?: number;    // Orchestration level (optional)
  timestamp: number;
}

export interface BreathState {
  phase: 'inhale' | 'hold' | 'exhale' | 'pause' | 'ready';
  progress: number; // 0-1 within current phase
  cycleStart: number; // performance.now() timestamp
  active: boolean;
  pattern: string;
}

export interface GeometryConfig {
  pattern: 'sri-yantra' | 'fibonacci-spiral' | 'flower-of-life';
  visible: boolean;
  baseOpacity: number;
  baseLineWidth: number;
  maxLineWidth: number;
  morphingStrength: number;
  color: string;
}

export interface CoherenceBundleConfig {
  enabled: boolean;
  coach: {
    breathingRate: number; // breaths per minute
    alphaGoal: number;     // target Zλ for alpha coherence
    displayMetrics: boolean;
    accessibilityMode: boolean;
  };
  geometry: GeometryConfig;
  performance: {
    updateRate: number;    // Hz for event bus publishing
    maxFrameTime: number;  // ms budget per frame
  };
}

export interface CoherenceBundle {
  start(): void;
  stop(): void;
  showGeometry(): void;
  hideGeometry(): void;
  setBreathingPattern(pattern: string): void;
  getMetrics(): CoherenceMetrics | null;
  dispose(): void;
}

// Event types for namespaced bus communication
export interface CoherenceEvents {
  'coherence.metrics': CoherenceMetrics;
  'coherence.breathTick': BreathState;
  'coherence.geometryUpdate': {
    pattern: string;
    vertices: Float32Array;
    opacity: number;
    lineWidth: number;
  };
}