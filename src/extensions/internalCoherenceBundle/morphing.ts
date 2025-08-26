/**
 * Geometry Morphing Engine - Smooth interpolation and transformation logic
 * Provides fluid transitions and consciousness-responsive morphing
 */

import type { CoherenceData } from './types';

export interface MorphTarget {
  scale: number;
  rotation: number;
  opacity: number;
  lineWidth: number;
  vertices?: { x: number; y: number; weight: number }[];
}

export class MorphingEngine {
  private currentTarget: MorphTarget;
  private previousTarget: MorphTarget;
  private interpolationSpeed: number;
  private morphingFunctions: Map<string, (value: number) => number>;

  constructor(initialTarget: MorphTarget, interpolationSpeed = 0.1) {
    this.currentTarget = { ...initialTarget };
    this.previousTarget = { ...initialTarget };
    this.interpolationSpeed = interpolationSpeed;
    this.setupMorphingFunctions();
  }

  private setupMorphingFunctions(): void {
    this.morphingFunctions = new Map([
      // Easing functions for smooth transitions
      ['linear', (t: number) => t],
      ['easeInOut', (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t],
      ['easeOutBounce', (t: number) => {
        if (t < 1 / 2.75) {
          return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
          return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
          return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
          return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
      }],
      ['consciousness', (t: number) => {
        // Custom consciousness-aware easing
        return Math.sin(t * Math.PI * 0.5);
      }],
      ['breath', (t: number) => {
        // Breathing-like easing
        return 0.5 - 0.5 * Math.cos(t * Math.PI);
      }]
    ]);
  }

  public setTarget(newTarget: Partial<MorphTarget>): void {
    this.previousTarget = { ...this.currentTarget };
    this.currentTarget = { ...this.currentTarget, ...newTarget };
  }

  public updateFromCoherence(data: CoherenceData, morphStrength: number = 0.05): void {
    const { zλ, phi } = data;
    
    // Calculate morph targets based on consciousness metrics
    const scaleTarget = 0.8 + (phi * 0.4); // Φ affects scale
    const rotationDelta = zλ * morphStrength; // Zλ affects rotation speed
    const opacityTarget = Math.max(0.3, Math.min(1.0, (zλ + phi) / 2));
    const lineWidthTarget = 1 + (phi * 3); // Φ affects line thickness
    
    this.setTarget({
      scale: scaleTarget,
      rotation: this.currentTarget.rotation + rotationDelta,
      opacity: opacityTarget,
      lineWidth: lineWidthTarget
    });
  }

  public interpolate(deltaTime: number, easingFunction: string = 'consciousness'): MorphTarget {
    const easingFn = this.morphingFunctions.get(easingFunction) || this.morphingFunctions.get('linear')!;
    const t = Math.min(1, deltaTime * this.interpolationSpeed);
    const smoothT = easingFn(t);

    const interpolated: MorphTarget = {
      scale: this.lerp(this.previousTarget.scale, this.currentTarget.scale, smoothT),
      rotation: this.lerpAngle(this.previousTarget.rotation, this.currentTarget.rotation, smoothT),
      opacity: this.lerp(this.previousTarget.opacity, this.currentTarget.opacity, smoothT),
      lineWidth: this.lerp(this.previousTarget.lineWidth, this.currentTarget.lineWidth, smoothT)
    };

    // Interpolate vertices if they exist
    if (this.currentTarget.vertices && this.previousTarget.vertices) {
      interpolated.vertices = this.interpolateVertices(
        this.previousTarget.vertices,
        this.currentTarget.vertices,
        smoothT
      );
    }

    return interpolated;
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  private lerpAngle(a: number, b: number, t: number): number {
    // Handle angle wrapping for smooth rotation
    let diff = b - a;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    return a + diff * t;
  }

  private interpolateVertices(
    from: { x: number; y: number; weight: number }[],
    to: { x: number; y: number; weight: number }[],
    t: number
  ): { x: number; y: number; weight: number }[] {
    const result: { x: number; y: number; weight: number }[] = [];
    const maxLength = Math.max(from.length, to.length);

    for (let i = 0; i < maxLength; i++) {
      const fromVertex = from[i] || from[from.length - 1];
      const toVertex = to[i] || to[to.length - 1];

      result.push({
        x: this.lerp(fromVertex.x, toVertex.x, t),
        y: this.lerp(fromVertex.y, toVertex.y, t),
        weight: this.lerp(fromVertex.weight, toVertex.weight, t)
      });
    }

    return result;
  }

  public setInterpolationSpeed(speed: number): void {
    this.interpolationSpeed = Math.max(0.01, Math.min(1.0, speed));
  }

  public addCustomEasing(name: string, fn: (t: number) => number): void {
    this.morphingFunctions.set(name, fn);
  }

  public getCurrentTarget(): MorphTarget {
    return { ...this.currentTarget };
  }

  public reset(target: MorphTarget): void {
    this.currentTarget = { ...target };
    this.previousTarget = { ...target };
  }
}

export class ConsciousnessResponsiveMorpher {
  private morphingEngine: MorphingEngine;
  private coherenceHistory: CoherenceData[] = [];
  private maxHistoryLength = 60; // 1 second at 60fps
  private breathSyncEnabled = true;
  private lastBreathPhase = 'inhale';

  constructor(initialTarget: MorphTarget) {
    this.morphingEngine = new MorphingEngine(initialTarget, 0.15);
    this.setupBreathSyncMorphing();
  }

  private setupBreathSyncMorphing(): void {
    // Register custom easing functions for breath synchronization
    this.morphingEngine.addCustomEasing('breathInhale', (t: number) => {
      return Math.pow(t, 0.7); // Slightly accelerated
    });

    this.morphingEngine.addCustomEasing('breathExhale', (t: number) => {
      return 1 - Math.pow(1 - t, 0.7); // Slightly decelerated
    });

    this.morphingEngine.addCustomEasing('breathHold', (t: number) => {
      return t; // Linear during hold
    });
  }

  public updateCoherence(data: CoherenceData): void {
    // Store coherence history for trend analysis
    this.coherenceHistory.push(data);
    if (this.coherenceHistory.length > this.maxHistoryLength) {
      this.coherenceHistory.shift();
    }

    // Calculate adaptive morphing strength based on coherence stability
    const morphStrength = this.calculateAdaptiveMorphStrength();
    
    // Update morphing engine with current coherence
    this.morphingEngine.updateFromCoherence(data, morphStrength);
  }

  private calculateAdaptiveMorphStrength(): number {
    if (this.coherenceHistory.length < 10) return 0.05;

    // Calculate coherence variance to determine stability
    const recent = this.coherenceHistory.slice(-10);
    const avgZλ = recent.reduce((sum, d) => sum + d.zλ, 0) / recent.length;
    const avgΦ = recent.reduce((sum, d) => sum + d.phi, 0) / recent.length;
    
    const zλVariance = recent.reduce((sum, d) => sum + Math.pow(d.zλ - avgZλ, 2), 0) / recent.length;
    const phiVariance = recent.reduce((sum, d) => sum + Math.pow(d.phi - avgΦ, 2), 0) / recent.length;
    
    const totalVariance = zλVariance + phiVariance;
    
    // Lower variance = more stable = stronger morphing effects
    const stability = Math.max(0, 1 - totalVariance * 10);
    
    return 0.02 + (stability * 0.08); // Range: 0.02 to 0.10
  }

  public updateBreathSync(breathState: { phase: string; progress: number }): void {
    if (!this.breathSyncEnabled) return;

    const { phase, progress } = breathState;
    let pulsationTarget = 0;
    let easingFunction = 'consciousness';

    switch (phase) {
      case 'inhale':
        pulsationTarget = progress * 0.15;
        easingFunction = 'breathInhale';
        break;
      case 'hold':
        pulsationTarget = 0.15;
        easingFunction = 'breathHold';
        break;
      case 'exhale':
        pulsationTarget = (1 - progress) * 0.15;
        easingFunction = 'breathExhale';
        break;
      case 'pause':
        pulsationTarget = 0;
        easingFunction = 'consciousness';
        break;
    }

    // Apply pulsation to scale
    const currentTarget = this.morphingEngine.getCurrentTarget();
    const baseScale = currentTarget.scale;
    
    this.morphingEngine.setTarget({
      scale: baseScale * (1 + pulsationTarget)
    });

    this.lastBreathPhase = phase;
  }

  public getMorphedState(deltaTime: number): MorphTarget {
    const easingFunction = this.getEasingForCurrentState();
    return this.morphingEngine.interpolate(deltaTime, easingFunction);
  }

  private getEasingForCurrentState(): string {
    if (this.breathSyncEnabled) {
      switch (this.lastBreathPhase) {
        case 'inhale': return 'breathInhale';
        case 'exhale': return 'breathExhale';
        case 'hold': return 'breathHold';
        default: return 'consciousness';
      }
    }
    return 'consciousness';
  }

  public setBreathSyncEnabled(enabled: boolean): void {
    this.breathSyncEnabled = enabled;
  }

  public getCoherenceTrend(): 'rising' | 'falling' | 'stable' {
    if (this.coherenceHistory.length < 20) return 'stable';

    const recent = this.coherenceHistory.slice(-10);
    const earlier = this.coherenceHistory.slice(-20, -10);

    const recentAvg = recent.reduce((sum, d) => sum + (d.zλ + d.phi) / 2, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, d) => sum + (d.zλ + d.phi) / 2, 0) / earlier.length;

    const difference = recentAvg - earlierAvg;
    const threshold = 0.02;

    if (difference > threshold) return 'rising';
    if (difference < -threshold) return 'falling';
    return 'stable';
  }

  public applyHarmonicResonance(frequency: number = 432): void {
    // Apply subtle harmonic oscillations to the morphing
    const time = Date.now() / 1000;
    const harmonicFactor = Math.sin(time * frequency / 100) * 0.02;
    
    const currentTarget = this.morphingEngine.getCurrentTarget();
    this.morphingEngine.setTarget({
      rotation: currentTarget.rotation + harmonicFactor
    });
  }

  public reset(): void {
    this.coherenceHistory = [];
    const defaultTarget: MorphTarget = {
      scale: 1.0,
      rotation: 0,
      opacity: 0.6,
      lineWidth: 2
    };
    this.morphingEngine.reset(defaultTarget);
  }

  public getMorphingEngine(): MorphingEngine {
    return this.morphingEngine;
  }
}