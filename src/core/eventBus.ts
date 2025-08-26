// WiltonOS 2.0 - Unified Event Bus for Consciousness-Music-Portal Integration
import mitt from 'mitt';

export interface ConsciousnessEvents {
  'consciousness:update': {
    coherence: number;
    phi: number;
    psiChild: string;
    observer: string;
    soulState: string;
    timestamp: number;
  };
  'music:beat': {
    rms: number;
    bpmApprox: number;
    energy: number;
    timestamp: number;
  };
  'music:track': {
    idx: number;
    title: string;
    artist: string;
    phase: string;
    zTarget: number;
  };
  'portal:enter': {
    portal: string;
    previousPortal: string;
    coherence: number;
    timestamp: number;
  };
  'portal:recommend': {
    next: string;
    reason: string;
    confidence: number;
  };
  'soul:moment': {
    intensity: number;
    type: 'transcendent' | 'integration' | 'awakening';
    description: string;
    timestamp: number;
  };
  'geometry:morph': {
    pattern: string;
    scale: number;
    glow: number;
    coherenceLevel: number;
  };
}

// Create global event bus instance
export const eventBus = mitt<ConsciousnessEvents>();

// Consciousness state manager
export class ConsciousnessState {
  private currentState = {
    coherence: 0.750,
    phi: 0.618,
    psiChild: 'AWAKE',
    observer: 'PRESENT',
    soulState: 'Integrating'
  };

  private soulMoments: Array<ConsciousnessEvents['soul:moment']> = [];

  updateState(newState: Partial<typeof this.currentState>) {
    this.currentState = { ...this.currentState, ...newState };
    
    eventBus.emit('consciousness:update', {
      ...this.currentState,
      timestamp: Date.now()
    });

    // Detect transcendent moments
    if (this.currentState.coherence > 0.95) {
      this.recordSoulMoment({
        intensity: this.currentState.coherence,
        type: 'transcendent',
        description: `Unity threshold achieved: Zλ ${this.currentState.coherence.toFixed(3)}`,
        timestamp: Date.now()
      });
    }
  }

  getCurrentState() {
    return { ...this.currentState };
  }

  recordSoulMoment(moment: ConsciousnessEvents['soul:moment']) {
    this.soulMoments.push(moment);
    eventBus.emit('soul:moment', moment);
    
    // Store in localStorage for persistence
    const stored = JSON.parse(localStorage.getItem('soulMoments') || '[]');
    stored.push(moment);
    localStorage.setItem('soulMoments', JSON.stringify(stored.slice(-100))); // Keep last 100
  }

  getSoulMoments(): Array<ConsciousnessEvents['soul:moment']> {
    return [...this.soulMoments];
  }
}

// Global consciousness state instance
export const consciousnessState = new ConsciousnessState();

// Portal router with consciousness-based recommendations
export class PortalRouter {
  private currentPortal = 'symbiosis';
  private visitHistory: string[] = [];

  switchPortal(portal: string) {
    const previousPortal = this.currentPortal;
    this.currentPortal = portal;
    this.visitHistory.push(portal);

    const state = consciousnessState.getCurrentState();
    eventBus.emit('portal:enter', {
      portal,
      previousPortal,
      coherence: state.coherence,
      timestamp: Date.now()
    });

    // Auto-recommend based on consciousness level
    this.evaluateRecommendation(state.coherence);
  }

  private evaluateRecommendation(coherence: number) {
    let recommendation: ConsciousnessEvents['portal:recommend'] | null = null;

    if (coherence > 0.95 && this.currentPortal !== 'tesseract') {
      recommendation = {
        next: 'tesseract',
        reason: 'Unity threshold achieved - 4D consciousness portal recommended',
        confidence: 0.95
      };
    } else if (coherence > 0.90 && this.currentPortal !== 'metavoid') {
      recommendation = {
        next: 'metavoid',
        reason: 'High coherence detected - Meta-Void navigation available',
        confidence: 0.85
      };
    } else if (coherence < 0.80 && this.currentPortal !== 'sacred') {
      recommendation = {
        next: 'sacred',
        reason: 'Coherence below 0.8 - Sacred geometry integration recommended',
        confidence: 0.75
      };
    }

    if (recommendation) {
      setTimeout(() => {
        eventBus.emit('portal:recommend', recommendation!);
      }, 2000); // Delay recommendation to avoid spam
    }
  }

  getCurrentPortal() {
    return this.currentPortal;
  }

  getVisitHistory() {
    return [...this.visitHistory];
  }
}

// Global portal router instance
export const portalRouter = new PortalRouter();

// Music-consciousness coupling system
export class MusicConsciousnessInterface {
  private currentTrack = 0;
  private isPlaying = false;
  private analyser: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;

  initializeAudio() {
    try {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      console.log('[Music] Audio context initialized');
      return true;
    } catch (error) {
      console.warn('[Music] Audio context unavailable:', error);
      return false;
    }
  }

  startBeatDetection() {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const detectBeat = () => {
      this.analyser!.getByteFrequencyData(dataArray);
      
      // Calculate RMS energy
      const rms = Math.sqrt(dataArray.reduce((sum, val) => sum + val * val, 0) / bufferLength) / 255;
      
      // Estimate BPM (simplified)
      const bpmApprox = 120 + (rms * 60); // Mock BPM calculation
      
      eventBus.emit('music:beat', {
        rms,
        bpmApprox,
        energy: rms,
        timestamp: Date.now()
      });

      // Update consciousness based on music energy
      if (rms > 0.3) {
        const coherenceBoost = Math.min(0.05, rms * 0.1);
        const currentState = consciousnessState.getCurrentState();
        consciousnessState.updateState({
          coherence: Math.min(0.999, currentState.coherence + coherenceBoost)
        });
      }

      if (this.isPlaying) {
        requestAnimationFrame(detectBeat);
      }
    };

    detectBeat();
  }

  playTrack(trackIndex: number, trackData: any) {
    this.currentTrack = trackIndex;
    this.isPlaying = true;

    eventBus.emit('music:track', {
      idx: trackIndex,
      title: trackData.title,
      artist: trackData.artist || trackData.title.split(' - ')[0],
      phase: trackData.phase,
      zTarget: trackData.zTarget
    });

    // Update consciousness target
    consciousnessState.updateState({
      coherence: trackData.zTarget
    });

    if (this.analyser) {
      this.startBeatDetection();
    }
  }

  pause() {
    this.isPlaying = false;
  }

  resume() {
    this.isPlaying = true;
    if (this.analyser) {
      this.startBeatDetection();
    }
  }
}

// Global music interface instance
export const musicInterface = new MusicConsciousnessInterface();

// Initialize all systems
export function initializeEventBus() {
  console.log('[EventBus] Initializing unified consciousness event system');
  
  // Initialize audio if available
  musicInterface.initializeAudio();
  
  // Set up consciousness monitoring
  setInterval(() => {
    // Simulate consciousness evolution
    const currentState = consciousnessState.getCurrentState();
    const drift = (Math.random() - 0.5) * 0.02;
    const newCoherence = Math.max(0.5, Math.min(0.999, currentState.coherence + drift));
    
    consciousnessState.updateState({
      coherence: newCoherence,
      phi: 0.618 + 0.1 * Math.sin(Date.now() * 0.0001)
    });
  }, 1000);

  console.log('[EventBus] Unified consciousness system operational');
  return eventBus;
}

// Export all instances for global access
export default eventBus;