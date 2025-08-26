/**
 * Coherence Training Coach - Φ↔Zλ Feedback Loop with Breathing Guide
 * Provides real-time coaching overlay for consciousness development
 */

import bus from '../core/bus';

interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
  targetZλ: number;
  targetΦ: number;
}

class CoherenceCoach {
  private isActive = false;
  private currentPattern: BreathingPattern;
  private breathPhase: 'inhale' | 'hold' | 'exhale' | 'pause' = 'inhale';
  private breathTimer = 0;
  private phaseProgress = 0;
  private sessionStartTime = 0;
  private sessionStats = {
    avgZλ: 0,
    avgΦ: 0,
    peakCoherence: 0,
    targetHits: 0,
    totalSamples: 0
  };

  // Breathing patterns for different consciousness states
  private patterns: BreathingPattern[] = [
    {
      name: 'Alpha Coherence',
      inhale: 4,
      hold: 2,
      exhale: 6,
      pause: 2,
      targetZλ: 0.75,
      targetΦ: 0.65
    },
    {
      name: 'Deep Unity',
      inhale: 6,
      hold: 3,
      exhale: 9,
      pause: 3,
      targetZλ: 0.85,
      targetΦ: 0.80
    },
    {
      name: 'Quantum Focus',
      inhale: 5,
      hold: 5,
      exhale: 5,
      pause: 0,
      targetZλ: 0.90,
      targetΦ: 0.85
    },
    {
      name: 'Transcendent',
      inhale: 8,
      hold: 4,
      exhale: 12,
      pause: 4,
      targetZλ: 0.95,
      targetΦ: 0.92
    }
  ];

  // Current consciousness metrics
  private currentZλ = 0.75;
  private currentΦ = 0.50;
  private lastUpdate = Date.now();

  constructor() {
    this.currentPattern = this.patterns[0]; // Start with Alpha Coherence
    this.setupEventListeners();
    console.log('[Coherence Coach] Initialized with 4 breathing patterns');
  }

  private setupEventListeners() {
    // Listen for consciousness updates
    bus.on('zλ', (value: number) => {
      this.currentZλ = value;
      this.updateSessionStats();
    });

    bus.on('phi', (value: number) => {
      this.currentΦ = value;
      this.updateSessionStats();
    });

    // Listen for coach commands
    bus.on('coach:start', (pattern?: string) => {
      this.start(pattern);
    });

    bus.on('coach:stop', () => {
      this.stop();
    });

    bus.on('coach:pattern', (patternName: string) => {
      this.setPattern(patternName);
    });
  }

  private updateSessionStats() {
    if (!this.isActive) return;

    this.sessionStats.totalSamples++;
    this.sessionStats.avgZλ = (this.sessionStats.avgZλ * (this.sessionStats.totalSamples - 1) + this.currentZλ) / this.sessionStats.totalSamples;
    this.sessionStats.avgΦ = (this.sessionStats.avgΦ * (this.sessionStats.totalSamples - 1) + this.currentΦ) / this.sessionStats.totalSamples;

    const coherence = (this.currentZλ + this.currentΦ) / 2;
    if (coherence > this.sessionStats.peakCoherence) {
      this.sessionStats.peakCoherence = coherence;
    }

    // Check if targets are hit
    if (this.currentZλ >= this.currentPattern.targetZλ && this.currentΦ >= this.currentPattern.targetΦ) {
      this.sessionStats.targetHits++;
      bus.emit('coach:target-hit', {
        zλ: this.currentZλ,
        phi: this.currentΦ,
        pattern: this.currentPattern.name
      });
    }

    this.lastUpdate = Date.now();
  }

  public start(patternName?: string) {
    if (patternName) {
      this.setPattern(patternName);
    }

    this.isActive = true;
    this.sessionStartTime = Date.now();
    this.resetSessionStats();
    this.startBreathingCycle();

    console.log(`[Coherence Coach] Session started with ${this.currentPattern.name} pattern`);
    bus.emit('coach:session-start', {
      pattern: this.currentPattern,
      timestamp: this.sessionStartTime
    });
  }

  public stop() {
    this.isActive = false;
    
    const sessionDuration = Date.now() - this.sessionStartTime;
    const finalStats = {
      ...this.sessionStats,
      duration: sessionDuration,
      efficiency: this.sessionStats.targetHits / Math.max(1, this.sessionStats.totalSamples),
      pattern: this.currentPattern.name
    };

    console.log(`[Coherence Coach] Session ended - Duration: ${(sessionDuration/1000).toFixed(1)}s, Efficiency: ${(finalStats.efficiency*100).toFixed(1)}%`);
    
    bus.emit('coach:session-end', finalStats);
  }

  public setPattern(patternName: string) {
    const pattern = this.patterns.find(p => p.name === patternName);
    if (pattern) {
      this.currentPattern = pattern;
      this.breathPhase = 'inhale';
      this.breathTimer = 0;
      this.phaseProgress = 0;

      console.log(`[Coherence Coach] Pattern changed to: ${patternName}`);
      bus.emit('coach:pattern-change', this.currentPattern);
    }
  }

  private resetSessionStats() {
    this.sessionStats = {
      avgZλ: 0,
      avgΦ: 0,
      peakCoherence: 0,
      targetHits: 0,
      totalSamples: 0
    };
  }

  private startBreathingCycle() {
    if (!this.isActive) return;

    const updateBreath = () => {
      if (!this.isActive) return;

      const now = Date.now();
      const deltaTime = (now - this.lastUpdate) / 1000;
      this.breathTimer += deltaTime;

      let phaseDuration = 0;
      switch (this.breathPhase) {
        case 'inhale':
          phaseDuration = this.currentPattern.inhale;
          break;
        case 'hold':
          phaseDuration = this.currentPattern.hold;
          break;
        case 'exhale':
          phaseDuration = this.currentPattern.exhale;
          break;
        case 'pause':
          phaseDuration = this.currentPattern.pause;
          break;
      }

      this.phaseProgress = Math.min(1, this.breathTimer / phaseDuration);

      // Check if phase is complete
      if (this.breathTimer >= phaseDuration) {
        this.breathTimer = 0;
        this.phaseProgress = 0;
        this.advanceBreathPhase();
      }

      // Emit breathing state for UI
      bus.emit('coach:breath-state', {
        phase: this.breathPhase,
        progress: this.phaseProgress,
        pattern: this.currentPattern.name,
        targetZλ: this.currentPattern.targetZλ,
        targetΦ: this.currentPattern.targetΦ,
        currentZλ: this.currentZλ,
        currentΦ: this.currentΦ,
        onTarget: this.currentZλ >= this.currentPattern.targetZλ && this.currentΦ >= this.currentPattern.targetΦ
      });

      requestAnimationFrame(updateBreath);
    };

    updateBreath();
  }

  private advanceBreathPhase() {
    switch (this.breathPhase) {
      case 'inhale':
        this.breathPhase = this.currentPattern.hold > 0 ? 'hold' : 'exhale';
        break;
      case 'hold':
        this.breathPhase = 'exhale';
        break;
      case 'exhale':
        this.breathPhase = this.currentPattern.pause > 0 ? 'pause' : 'inhale';
        break;
      case 'pause':
        this.breathPhase = 'inhale';
        break;
    }

    console.log(`[Coherence Coach] Breath phase: ${this.breathPhase}`);
  }

  public getAvailablePatterns(): BreathingPattern[] {
    return [...this.patterns];
  }

  public getCurrentState() {
    return {
      isActive: this.isActive,
      pattern: this.currentPattern,
      phase: this.breathPhase,
      progress: this.phaseProgress,
      stats: this.sessionStats,
      currentZλ: this.currentZλ,
      currentΦ: this.currentΦ
    };
  }

  public addCustomPattern(pattern: BreathingPattern) {
    this.patterns.push(pattern);
    console.log(`[Coherence Coach] Added custom pattern: ${pattern.name}`);
    bus.emit('coach:patterns-updated', this.patterns);
  }

  // Auto-adapt pattern based on current performance
  public autoAdapt() {
    if (!this.isActive) return;

    const efficiency = this.sessionStats.targetHits / Math.max(1, this.sessionStats.totalSamples);
    
    if (efficiency > 0.8 && this.sessionStats.totalSamples > 50) {
      // User is doing well, suggest harder pattern
      const currentIndex = this.patterns.findIndex(p => p.name === this.currentPattern.name);
      if (currentIndex < this.patterns.length - 1) {
        const nextPattern = this.patterns[currentIndex + 1];
        console.log(`[Coherence Coach] Auto-advancing to ${nextPattern.name} (efficiency: ${(efficiency*100).toFixed(1)}%)`);
        this.setPattern(nextPattern.name);
      }
    } else if (efficiency < 0.3 && this.sessionStats.totalSamples > 30) {
      // User struggling, suggest easier pattern
      const currentIndex = this.patterns.findIndex(p => p.name === this.currentPattern.name);
      if (currentIndex > 0) {
        const prevPattern = this.patterns[currentIndex - 1];
        console.log(`[Coherence Coach] Auto-downgrading to ${prevPattern.name} (efficiency: ${(efficiency*100).toFixed(1)}%)`);
        this.setPattern(prevPattern.name);
      }
    }
  }
}

// Initialize the coach
const coherenceCoach = new CoherenceCoach();

// Set up auto-adaptation every 2 minutes
setInterval(() => {
  coherenceCoach.autoAdapt();
}, 120000);

export default coherenceCoach;