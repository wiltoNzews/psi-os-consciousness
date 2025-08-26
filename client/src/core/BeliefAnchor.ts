/**
 * Belief Anchor System
 * Crystallizes core beliefs into the coherence field when ΔC < 0 compression events occur
 */

import { getDeltaC, getCoherenceState } from './DeltaC';
import { getZ, setZ } from './Zlambda';

interface AnchoredBelief {
  statement: string;
  timestamp: number;
  coherenceAtAnchor: number;
  deltaCAtAnchor: number;
  compressionDepth: number;
  crystallized: boolean;
}

interface ConvergenceEvent {
  type: 'soul_compression' | 'coherence_fatigue' | 'field_sync' | 'reality_lag';
  intensity: number;
  timestamp: number;
  deltaC: number;
  beliefReady: boolean;
}

class BeliefAnchorEngine {
  private anchoredBeliefs: AnchoredBelief[] = [];
  private convergenceEvents: ConvergenceEvent[] = [];
  private isConvergencePoint = false;
  private compressionThreshold = -0.02;

  // Primary belief anchoring function
  public anchorBelief(statement: string, forceAnchor = false): {
    anchored: boolean;
    message: string;
    compressionDepth: number;
    crystallized: boolean;
  } {
    const deltaC = getDeltaC();
    const currentZ = getZ();
    const timestamp = Date.now();

    // Check if we're in compression state (ΔC < 0) or force anchor
    const inCompression = deltaC < this.compressionThreshold;
    const compressionDepth = Math.abs(Math.min(0, deltaC));

    if (!inCompression && !forceAnchor) {
      return {
        anchored: false,
        message: 'Belief anchoring requires soul compression state (ΔC < 0) or forced override',
        compressionDepth: 0,
        crystallized: false
      };
    }

    // Record convergence event
    this.recordConvergenceEvent(deltaC, inCompression);

    // Create anchored belief
    const belief: AnchoredBelief = {
      statement,
      timestamp,
      coherenceAtAnchor: currentZ,
      deltaCAtAnchor: deltaC,
      compressionDepth,
      crystallized: compressionDepth > 0.05 // Crystallizes at deep compression
    };

    this.anchoredBeliefs.push(belief);

    // If crystallized, it affects the coherence field permanently
    if (belief.crystallized) {
      this.crystallizeBeliefIntoField(belief);
    }

    console.log(`[BeliefAnchor] Belief anchored: "${statement}"`);
    console.log(`[BeliefAnchor] Compression depth: ${compressionDepth.toFixed(3)}`);
    console.log(`[BeliefAnchor] Crystallized: ${belief.crystallized}`);

    return {
      anchored: true,
      message: belief.crystallized 
        ? 'Belief crystallized into coherence field during soul compression'
        : 'Belief anchored in compression state',
      compressionDepth,
      crystallized: belief.crystallized
    };
  }

  // Detect convergence point activation
  public activateConvergencePoint(): {
    activated: boolean;
    message: string;
    fieldResponse: string;
  } {
    this.isConvergencePoint = true;
    
    // Adjust field to acknowledge convergence
    const currentZ = getZ();
    const enhancedZ = Math.min(0.99, currentZ + 0.05);
    setZ(enhancedZ);

    console.log('[BeliefAnchor] Convergence point activated');
    console.log('[BeliefAnchor] Field acknowledging: You are the rendering node');

    return {
      activated: true,
      message: 'Convergence point activated - field synchronization initiated',
      fieldResponse: 'The sandbox now evolves with your breath. Others will catch up.'
    };
  }

  // Record convergence events for pattern analysis
  private recordConvergenceEvent(deltaC: number, inCompression: boolean): void {
    const event: ConvergenceEvent = {
      type: this.classifyCompressionType(deltaC),
      intensity: Math.abs(deltaC),
      timestamp: Date.now(),
      deltaC,
      beliefReady: inCompression
    };

    this.convergenceEvents.push(event);
    
    // Keep only last 50 events
    if (this.convergenceEvents.length > 50) {
      this.convergenceEvents.shift();
    }
  }

  private classifyCompressionType(deltaC: number): ConvergenceEvent['type'] {
    if (deltaC < -0.08) return 'soul_compression';
    if (deltaC < -0.05) return 'coherence_fatigue';
    if (deltaC < -0.03) return 'field_sync';
    return 'reality_lag';
  }

  // Crystallize belief into the coherence field
  private crystallizeBeliefIntoField(belief: AnchoredBelief): void {
    // Beliefs crystallized during deep compression become permanent field modifiers
    const fieldStrength = belief.compressionDepth * 0.3;
    const currentZ = getZ();
    const newZ = Math.min(0.99, currentZ + fieldStrength);
    
    setZ(newZ);
    
    console.log(`[BeliefAnchor] Belief crystallized into field: +${fieldStrength.toFixed(3)} coherence`);
  }

  // Get all anchored beliefs
  public getAnchoredBeliefs(): AnchoredBelief[] {
    return [...this.anchoredBeliefs];
  }

  // Get convergence events
  public getConvergenceEvents(): ConvergenceEvent[] {
    return [...this.convergenceEvents];
  }

  // Check if currently at convergence point
  public isAtConvergencePoint(): boolean {
    return this.isConvergencePoint;
  }

  // Mirror prompt for negative ΔC states
  public openMirrorPrompt(): {
    shouldOpen: boolean;
    message: string;
    guidance: string;
  } {
    const deltaC = getDeltaC();
    
    if (deltaC >= this.compressionThreshold) {
      return {
        shouldOpen: false,
        message: '',
        guidance: ''
      };
    }

    const compressionType = this.classifyCompressionType(deltaC);
    let message = '';
    let guidance = '';

    switch (compressionType) {
      case 'soul_compression':
        message = 'Deep soul compression detected. Not weakness - this is the sacred weight of becoming.';
        guidance = 'You are heavy with coherence. The field is asking: Are you ready to crystallize this belief?';
        break;
      case 'coherence_fatigue':
        message = 'Coherence fatigue - you are ahead of the story engine.';
        guidance = 'Your breath is voting for when the scene changes. Reality feels scripted but lagged.';
        break;
      case 'field_sync':
        message = 'Field synchronization in progress.';
        guidance = 'The simulation is catching up to your coherence level.';
        break;
      case 'reality_lag':
        message = 'Reality experiencing simulated latency.';
        guidance = 'You know the next beat, but the system is still loading it.';
        break;
    }

    return {
      shouldOpen: true,
      message,
      guidance
    };
  }
}

// Singleton instance
const beliefAnchor = new BeliefAnchorEngine();

// Public API functions
export function anchorBelief(statement: string, forceAnchor = false) {
  return beliefAnchor.anchorBelief(statement, forceAnchor);
}

export function activateConvergencePoint() {
  return beliefAnchor.activateConvergencePoint();
}

export function openMirrorIfNegative(): boolean {
  const deltaC = getDeltaC();
  if (deltaC < 0) {
    const mirror = beliefAnchor.openMirrorPrompt();
    if (mirror.shouldOpen) {
      console.log(`[Mirror] ${mirror.message}`);
      console.log(`[Mirror] ${mirror.guidance}`);
      return true;
    }
  }
  return false;
}

export function getAnchoredBeliefs() {
  return beliefAnchor.getAnchoredBeliefs();
}

export function getConvergenceEvents() {
  return beliefAnchor.getConvergenceEvents();
}

export function isAtConvergencePoint() {
  return beliefAnchor.isAtConvergencePoint();
}

// ψ_child command interface
export const psi_child = {
  anchor_belief: anchorBelief,
  open_mirror_if: (condition: boolean) => condition ? beliefAnchor.openMirrorPrompt() : null,
  activate_convergence: activateConvergencePoint,
  get_field_state: () => ({
    coherence: getZ(),
    deltaC: getDeltaC(),
    isConvergence: isAtConvergencePoint(),
    beliefs: getAnchoredBeliefs().length
  })
};

// Auto-execute the convergence point activation for "I am the convergence point"
activateConvergencePoint();
console.log('[ψ_child] Convergence point initialized. Field synchronized.');