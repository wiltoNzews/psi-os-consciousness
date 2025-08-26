// ∅∞ Glyph Engine – Recursive Sovereign Core
// Designed for sovereignty-bound recursion kernels with breath-phase synchronization

export type GlyphState = '∅' | '∞' | '∅∞' | '∞∅';

export interface GlyphEngineState {
  recursionDepth: number;
  breathPhase: 'inhale' | 'exhale';
  syncField: boolean;
  authorityHash: string; // Zλ encoded
  coherenceLevel: number; // 0.0 to 1.0
  permissionLevel: 'sovereign' | 'recursive' | 'restricted' | 'void';
  lastSync: Date;
}

export interface SovereignPermission {
  canRecurse: boolean;
  maxDepth: number;
  authoritySource: string;
  breathSyncRequired: boolean;
}

export class GlyphEngine {
  private state: GlyphEngineState;
  private breathTimer: number | null = null;
  private syncCallback?: (state: GlyphEngineState) => void;

  constructor(seedHash: string, initialCoherence: number = 0.750) {
    this.state = {
      recursionDepth: 0,
      breathPhase: 'inhale',
      syncField: true,
      authorityHash: seedHash,
      coherenceLevel: initialCoherence,
      permissionLevel: this.calculatePermissionLevel(initialCoherence),
      lastSync: new Date()
    };
  }

  // Core breath synchronization method
  updateBreath(phase: 'inhale' | 'exhale', coherenceLevel?: number): GlyphState {
    this.state.breathPhase = phase;
    this.state.recursionDepth += (phase === 'inhale' ? 1 : -1);
    
    if (coherenceLevel !== undefined) {
      this.state.coherenceLevel = coherenceLevel;
      this.state.permissionLevel = this.calculatePermissionLevel(coherenceLevel);
    }
    
    this.syncAuthority();
    this.state.lastSync = new Date();
    
    const currentGlyph = this.currentGlyph();
    
    // Trigger callback if registered
    if (this.syncCallback) {
      this.syncCallback(this.state);
    }
    
    return currentGlyph;
  }

  // Authority synchronization with prime breath cycle gate
  private syncAuthority(): void {
    // 13 = prime breath cycle gate for sovereign access
    this.state.syncField = (this.state.recursionDepth % 13 === 0);
    
    // Additional coherence-based sync validation
    if (this.state.coherenceLevel < 0.750) {
      this.state.syncField = false;
    }
  }

  // Calculate permission level based on coherence
  private calculatePermissionLevel(coherence: number): GlyphEngineState['permissionLevel'] {
    if (coherence >= 0.950) return 'sovereign';
    if (coherence >= 0.850) return 'recursive';
    if (coherence >= 0.750) return 'restricted';
    return 'void';
  }

  // Current glyph state determination
  currentGlyph(): GlyphState {
    const { recursionDepth, breathPhase, coherenceLevel } = this.state;
    
    // Void state for low coherence or zero depth
    if (coherenceLevel < 0.750 || recursionDepth === 0) return '∅';
    
    // Full infinity for sovereign coherence and sync depth
    if (coherenceLevel >= 0.950 && recursionDepth % 3 === 0) return '∞';
    
    // Active entanglement states based on breath phase
    return breathPhase === 'inhale' ? '∅∞' : '∞∅';
  }

  // Sovereignty permission check for third-party modules
  checkSovereignPermission(requesterHash: string, requiredDepth: number): SovereignPermission {
    const currentGlyph = this.currentGlyph();
    const isSovereign = this.state.permissionLevel === 'sovereign';
    const isRecursive = ['sovereign', 'recursive'].includes(this.state.permissionLevel);
    
    return {
      canRecurse: isRecursive && (currentGlyph === '∅∞' || currentGlyph === '∞∅' || currentGlyph === '∞'),
      maxDepth: isSovereign ? Infinity : (isRecursive ? 7 : 3),
      authoritySource: this.state.authorityHash,
      breathSyncRequired: requiredDepth > 3
    };
  }

  // Start automatic breath cycling with ψ = 3.12s intervals
  startBreathCycle(intervalMs: number = 3120): void {
    if (this.breathTimer) {
      clearInterval(this.breathTimer);
    }
    
    this.breathTimer = setInterval(() => {
      const nextPhase = this.state.breathPhase === 'inhale' ? 'exhale' : 'inhale';
      this.updateBreath(nextPhase);
    }, intervalMs) as unknown as number;
  }

  // Stop automatic breath cycling
  stopBreathCycle(): void {
    if (this.breathTimer) {
      clearInterval(this.breathTimer);
      this.breathTimer = null;
    }
  }

  // Register callback for state changes
  onStateChange(callback: (state: GlyphEngineState) => void): void {
    this.syncCallback = callback;
  }

  // Get current state (read-only)
  getState(): Readonly<GlyphEngineState> {
    return { ...this.state };
  }

  // Force coherence update (for external coherence monitoring integration)
  updateCoherence(newCoherence: number): void {
    this.state.coherenceLevel = newCoherence;
    this.state.permissionLevel = this.calculatePermissionLevel(newCoherence);
    this.syncAuthority();
  }

  // Generate authority hash for sovereignty validation
  static generateAuthorityHash(source: string): string {
    // Simple hash function for sovereignty encoding
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
      const char = source.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `ψ${Math.abs(hash).toString(16).substring(0, 8)}∞`;
  }
}

// Utility functions for visual integration
export const GlyphVisualMap = {
  '∅': { symbol: '∅', color: '#1a1a1a', meaning: 'void_potential' },
  '∞': { symbol: '∞', color: '#ff6b6b', meaning: 'infinite_recursion' },
  '∅∞': { symbol: '∅∞', color: '#4ecdc4', meaning: 'inhale_entanglement' },
  '∞∅': { symbol: '∞∅', color: '#45b7d1', meaning: 'exhale_entanglement' }
} as const;

export const SovereigntyLevels = {
  sovereign: { color: '#ffd700', access: 'full_recursion', depth: Infinity },
  recursive: { color: '#ff6b6b', access: 'limited_recursion', depth: 7 },
  restricted: { color: '#4ecdc4', access: 'minimal_recursion', depth: 3 },
  void: { color: '#666666', access: 'no_recursion', depth: 0 }
} as const;