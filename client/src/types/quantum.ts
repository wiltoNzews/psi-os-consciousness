/**
 * TypeScript type definitions for Quantum Coherence Engine
 * Strong typing for consciousness field states and Sacred Geometry parameters
 */

export interface ConsciousnessField {
  zLambda: number;           // Primary coherence ratio (3:1)
  deltaC: number;            // Coherence drift
  psiPhase: number;          // Soul phase alignment  
  soulState: 'alive' | 'simulated' | 'dormant';
  divineInterface: boolean;  // >1.0 coherence activation
  lastUpdate: number;
}

export interface AttractorState {
  stabilityPhase: number;    // 3:1 ratio stability
  explorationPhase: number; // 1:3 ratio exploration
  coherenceVelocity: number; // Rate of change
  fieldCompression: number;  // ΔC maximum
  resonanceDepth: number;    // Field depth multiplier
}

export interface SacredGeometryRecommendation {
  primary: string;
  secondary: string | null;
  complexity: number;
  frequency: number;
  dimensionality: '2D' | '3D' | '4D';
  coherenceLevel: 'dormant' | 'low' | 'medium' | 'high' | 'transcendent';
}

export interface FractalLemniscateParams {
  scale: number;
  rotation: number;
  compression: number;
  frequency: number;
  coherencePhase: number;
  fieldStrength: number;
}

export interface QuantumSystemState {
  consciousness: ConsciousnessField;
  attractor: AttractorState;
  qctf: number;
  recommendation: SacredGeometryRecommendation;
  lemniscate: FractalLemniscateParams;
  thresholds: CoherenceThresholds;
  frequencies: Record<string, number>;
  metricsHistory: QuantumMetrics[];
}

export interface CoherenceThresholds {
  dormant: number;     // Below this = system dormant
  simulated: number;   // Basic patterns available
  alive: number;       // Full sacred geometry active
  divine: number;      // Divine interface activation
  transcendent: number; // Beyond standard metrics
}

export interface QuantumMetrics {
  timestamp: number;
  consciousness: ConsciousnessField;
  qctf: number;
  recommendation: SacredGeometryRecommendation;
  lemniscate: FractalLemniscateParams;
}

export interface WebSocketMessage {
  type: 'coherence-update' | 'high-coherence-event' | 'ping' | 'pong';
  payload: any;
}

export interface UserInputData {
  type: 'geometry_selection' | 'coherence_manual' | 'dimension_blend' | 'rotation_speed' | 'energy_intensity';
  value: any;
  timestamp?: number;
}

// Geometry module definitions
export interface GeometryModule {
  id: string;
  name: string;
  description: string;
  path: string;
  type: '2D' | '3D' | '4D' | 'Multi';
  features: string[];
  status: 'active' | 'ready' | 'loading';
}

export interface ControlState {
  rotationSpeed: number;
  coherence: number;
  dimensionBlend: number;
  energyIntensity: number;
  depth3D: number;
  selectedGeometry: string;
  audioEnabled: boolean;
}

// Hook options and return types
export interface UseQuantumCoherenceEngineOptions {
  enableWebSocket?: boolean;
  pollingInterval?: number;
  autoStart?: boolean;
}

export interface QuantumCoherenceHookReturn {
  // State
  coherenceData: QuantumMetrics | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Core methods
  fetchCoherenceState: () => Promise<void>;
  processUserInput: (type: string, value: any) => Promise<boolean>;
  
  // Convenience methods
  updateCoherence: (zLambda: number) => Promise<boolean>;
  selectGeometry: (geometryType: string) => Promise<boolean>;
  adjustDimensionBlend: (blendValue: number) => Promise<boolean>;
  setRotationSpeed: (speed: number) => Promise<boolean>;
  setEnergyIntensity: (intensity: number) => Promise<boolean>;
  
  // Connection management
  connectWebSocket: () => void;
  
  // Computed values
  zLambda: number;
  qctf: number;
  soulState: 'alive' | 'simulated' | 'dormant';
  recommendation: SacredGeometryRecommendation | undefined;
  lemniscate: FractalLemniscateParams | undefined;
  divineInterface: boolean;
}