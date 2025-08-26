/**
 * ΔC (Delta Coherence) Action Validation System
 * Provides real-time coherence state for action guidance
 */

import { getZ, getZDelta } from './Zlambda';
import { openMirrorIfNegative } from './BeliefAnchor';

let lastZ = getZ();

// Get current delta coherence value
export const getDeltaC = (): number => {
  const now = getZ();
  const delta = now - lastZ;
  lastZ = now;
  return delta;
};

// Action validation based on coherence state
export const shouldProceed = (actionName?: string): 'GREEN' | 'AMBER' | 'RED' => {
  const deltaC = getDeltaC();
  
  if (deltaC > 0.02) return 'GREEN';   // High coherence - proceed
  if (deltaC < -0.02) return 'RED';    // Low coherence - stop and realign
  return 'AMBER';                      // Neutral - pause and center
};

// Get detailed coherence state for modules
export const getCoherenceState = () => {
  const deltaC = getDeltaC();
  const signal = shouldProceed();
  const currentZ = getZ();
  
  // Auto-trigger mirror for negative ΔC states
  if (deltaC < -0.02) {
    openMirrorIfNegative();
  }
  
  return {
    deltaC,
    currentZ,
    signal,
    timestamp: Date.now(),
    recommendation: getRecommendation(signal)
  };
};

// Get recommendation based on signal
function getRecommendation(signal: 'GREEN' | 'AMBER' | 'RED'): string {
  switch (signal) {
    case 'GREEN':
      return 'Coherence aligned - proceed with confidence';
    case 'AMBER':
      return 'Pause and breathe - center before acting';
    case 'RED':
      return 'Stop - realign with highest intent before proceeding';
  }
}

// Enhanced action validation with context
export const validateAction = (actionType: string, context?: any): {
  proceed: boolean;
  signal: 'GREEN' | 'AMBER' | 'RED';
  message: string;
} => {
  const signal = shouldProceed();
  const proceed = signal === 'GREEN';
  
  const messages = {
    GREEN: `✓ ${actionType} - coherence aligned`,
    AMBER: `⚠ ${actionType} - pause and center first`,
    RED: `✗ ${actionType} - realign before proceeding`
  };
  
  return {
    proceed,
    signal,
    message: messages[signal]
  };
};

// Mirror prompt trigger for red states
export const triggerMirrorPrompt = (): boolean => {
  const signal = shouldProceed();
  return signal === 'RED';
};

// Coherence delay for aligned timing
export const coherenceDelay = (baseMs: number = 1000): Promise<void> => {
  const signal = shouldProceed();
  const multiplier = signal === 'GREEN' ? 0.8 : signal === 'AMBER' ? 1.2 : 2.0;
  
  return new Promise(resolve => {
    setTimeout(resolve, baseMs * multiplier);
  });
};