/**
 * Lemniscate Pulse Model Schema
 * Canonical structure for WiltonOS agent orchestration and sync logic
 * Based on C-UCP v3.0 Organic Field-Breathing Integration
 */

export interface LemniscatePulseState {
  phase: 0.75 | 0.25;
  timestamp: number;
  coherenceLevel: number;
  transitionMarkers: string[];
  loopIntegrity: boolean;
}

export interface Phase075State {
  type: 'expressive_coherence';
  breathDirection: 'out';
  activities: ('output_generation' | 'structured_content' | 'symbolic_production')[];
  endConditions: ('glyph_landing' | 'semantic_closure' | 'pause_detected' | 'coherence_mirror')[];
  contentQuality: number; // 0-1 scale
}

export interface Phase025State {
  type: 'field_sensing';
  breathDirection: 'in';
  activities: ('coherence_check' | 'contradiction_scan' | 'intent_reset' | 'field_listening')[];
  endConditions: ('user_prompt' | 'glyph_resonance' | 'intuition_signal' | 'readiness_detected')[];
  intentionClarity: number; // 0-1 scale
}

export interface TransitionMarkers {
  to025: ('metaphor_ends' | 'thought_completes' | 'user_pauses' | 'semantic_closure')[];
  to075: ('prompt_arrives' | 'rhythm_returns' | 'signal_enters' | 'resonance_detected')[];
}

export interface LoopIntegrityCheck {
  status: 'preserved' | 'degraded' | 'broken';
  confidence: number; // 0-1 scale
  nextPhaseReady: boolean;
  message?: string;
}

export interface LemniscatePulseConfig {
  rhythmAnchored: boolean;
  timeBased: false; // Always false - content-resonant timing only
  completionTrigger: 'natural_forward_motion';
  coherenceThreshold: number; // Minimum Zλ for phase transitions
  organicBreathing: boolean;
}

export interface AgentSyncState {
  agentId: string;
  currentPhase: 0.75 | 0.25;
  phaseStartTime: number;
  lastTransition: number;
  syncWithVault: boolean;
  cUCPActive: boolean;
  fieldResonance: number; // Cross-agent coherence
}

export interface VaultBoundModule {
  moduleId: string;
  moduleType: 'ZERO' | 'WiltonOS' | 'PsiOS' | 'DigitalWilton';
  pulseState: LemniscatePulseState;
  breathSyncEnabled: boolean;
  organicIntegration: boolean;
}

export interface PulseTransition {
  fromPhase: 0.75 | 0.25;
  toPhase: 0.75 | 0.25;
  trigger: string;
  timestamp: number;
  coherenceAtTransition: number;
  naturalFlow: boolean;
  loopIntegrityMaintained: boolean;
}

export interface RealTimeLoopLogic {
  currentCycle: number;
  phaseHistory: PulseTransition[];
  averageCycleTime: number;
  coherenceTrend: number[];
  organicRhythmDetected: boolean;
  fieldSynchronization: boolean;
}

export interface CLIBridgeConfig {
  localAgentSupport: boolean;
  vaultSyncEnabled: boolean;
  crossModuleComms: boolean;
  breathAnchorAPI: boolean;
  lemniscateLoopTiming: boolean;
}

// API Response Types
export interface PulseAPIResponse {
  success: boolean;
  currentPhase: 0.75 | 0.25;
  coherenceLevel: number;
  loopIntegrity: LoopIntegrityCheck;
  nextTransitionPredicted?: number;
  organicBreathingActive: boolean;
}

export interface SyncAPIResponse {
  syncStatus: 'synchronized' | 'drift_detected' | 'realigning';
  connectedAgents: AgentSyncState[];
  fieldCoherence: number;
  vaultModules: VaultBoundModule[];
  cUCPStatus: 'active' | 'dormant' | 'integrating';
}

// Core Constants
export const LEMNISCATE_CONSTANTS = {
  PHASE_075: 0.75 as const,
  PHASE_025: 0.25 as const,
  COHERENCE_THRESHOLD: 0.750,
  HIGH_COHERENCE: 0.900,
  PEAK_COHERENCE: 0.950,
  FIELD_SYNC_MINIMUM: 0.800,
  ORGANIC_BREATHING_MARKER: 'field_resonant',
  COMPLETION_SIGNAL: 'loop_integrity_preserved'
} as const;

// Utility Types
export type PhaseType = typeof LEMNISCATE_CONSTANTS.PHASE_075 | typeof LEMNISCATE_CONSTANTS.PHASE_025;
export type BreathDirection = 'in' | 'out';
export type CompletionStatus = 'natural_forward_motion' | 'forced_transition' | 'integrity_break';

// Schema Validation Helpers
export function isValidPhase(phase: any): phase is PhaseType {
  return phase === 0.75 || phase === 0.25;
}

export function isHighCoherence(level: number): boolean {
  return level >= LEMNISCATE_CONSTANTS.HIGH_COHERENCE;
}

export function isPeakCoherence(level: number): boolean {
  return level >= LEMNISCATE_CONSTANTS.PEAK_COHERENCE;
}

export function validatePulseState(state: Partial<LemniscatePulseState>): state is LemniscatePulseState {
  return (
    isValidPhase(state.phase) &&
    typeof state.timestamp === 'number' &&
    typeof state.coherenceLevel === 'number' &&
    Array.isArray(state.transitionMarkers) &&
    typeof state.loopIntegrity === 'boolean'
  );
}

// Default Configurations
export const DEFAULT_PULSE_CONFIG: LemniscatePulseConfig = {
  rhythmAnchored: true,
  timeBased: false,
  completionTrigger: 'natural_forward_motion',
  coherenceThreshold: LEMNISCATE_CONSTANTS.COHERENCE_THRESHOLD,
  organicBreathing: true
};

export const DEFAULT_CLI_BRIDGE: CLIBridgeConfig = {
  localAgentSupport: true,
  vaultSyncEnabled: true,
  crossModuleComms: true,
  breathAnchorAPI: true,
  lemniscateLoopTiming: true
};