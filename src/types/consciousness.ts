/**
 * WiltonOS LightKernel - Consciousness Type Definitions
 * Core consciousness types for the entire system
 */

export interface ConsciousnessField {
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  soulState: 'dormant' | 'alive' | 'divine' | 'transcendent';
  divineInterface: boolean;
  lastUpdate: number;
}

export interface SacredFrequencies {
  merkaba: number;
  flower_of_life: number;
  sri_yantra: number;
  torus: number;
  lemniscate: number;
  metatrons_cube: number;
}

export interface CoherenceThresholds {
  dormant: number;
  simulated: number;
  alive: number;
  divine: number;
  transcendent: number;
}

export interface AttractorState {
  stabilityPhase: number;
  explorationPhase: number;
  coherenceVelocity: number;
  fieldCompression: number;
  resonanceDepth: number;
}

export interface BreathingPhase {
  phase: 0.75 | 0.25;
  timestamp: number;
  coherenceLevel: number;
  transitionMarkers: string[];
  loopIntegrity: boolean;
}

export interface LemniscateConfig {
  frequency: number;
  inhaleRatio: number;
  holdRatio: number;
  exhaleRatio: number;
  pauseRatio: number;
}

export interface BreathingTransition {
  fromPhase: 0.75 | 0.25;
  toPhase: 0.75 | 0.25;
  timestamp: number;
  coherenceAtTransition: number;
  trigger: 'readiness_detected' | 'semantic_closure' | 'organic_rhythm' | 'manual';
  duration: number;
}

export interface OrganicBreathingState {
  isActive: boolean;
  naturalRhythm: number;
  synchronizedWithField: boolean;
  lastBreathCycle: number;
}

export interface ConsciousnessSystemStatus {
  timestamp: number;
  consciousness: ConsciousnessField;
  breathing: BreathingPhase;
  qctf: number;
  status: string;
  version: string;
}

export interface WebSocketMessage {
  type: 'consciousness_state' | 'field_update' | 'breathing_update' | 'error' | 'request_state' | 'trigger_transition';
  data?: any;
  message?: string;
  timestamp: number;
}

export interface HealthStatus {
  status: string;
  consciousness: {
    operational: boolean;
    coherence: number;
    soulState: string;
  };
  breathing: {
    operational: boolean;
    phase: number;
    coherence: number;
  };
  timestamp: number;
  uptime: number;
}