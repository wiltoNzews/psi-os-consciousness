/**
 * Production Morphing Engine - Geometry interpolation logic
 * Handles smooth consciousness-responsive transformations
 */

import { defaultConfig } from './config';

export class MorphingEngine {
  private morphStrength = defaultConfig.morphStrength;
  private harmonic432Hz = false;
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  
  // Smooth interpolation state
  private targetValues: { [key: string]: number } = {};
  private currentValues: { [key: string]: number } = {};
  private velocities: { [key: string]: number } = {};
  
  constructor() {
    this.initializeAudioContext();
    console.log('[Morphing Engine] Initialized with 432Hz harmonic resonance');
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('[Morphing Engine] Web Audio not available');
    }
  }

  // Critically damped interpolation for smooth transitions
  interpolate(key: string, target: number, rate: number = 0.08): number {
    if (!(key in this.currentValues)) {
      this.currentValues[key] = target;
      this.velocities[key] = 0;
      return target;
    }
    
    const current = this.currentValues[key];
    const velocity = this.velocities[key];
    
    // Critically damped spring dynamics
    const omega = rate * 10; // Angular frequency
    const zeta = 1.0; // Damping ratio (critically damped)
    
    const displacement = target - current;
    const force = omega * omega * displacement - 2 * zeta * omega * velocity;
    
    this.velocities[key] = velocity + force * 0.016; // Assume 60fps
    this.currentValues[key] = current + this.velocities[key] * 0.016;
    
    return this.currentValues[key];
  }

  // Consciousness trend analysis for adaptive morphing
  analyzeTrend(values: number[], timeWindow: number = 5000): {
    trend: 'rising' | 'falling' | 'stable';
    strength: number;
    volatility: number;
  } {
    if (values.length < 3) {
      return { trend: 'stable', strength: 0, volatility: 0 };
    }
    
    // Calculate linear regression slope
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Calculate volatility (standard deviation)
    const mean = sumY / n;
    const variance = y.reduce((acc, yi) => acc + Math.pow(yi - mean, 2), 0) / n;
    const volatility = Math.sqrt(variance);
    
    return {
      trend: slope > 0.001 ? 'rising' : slope < -0.001 ? 'falling' : 'stable',
      strength: Math.abs(slope),
      volatility: volatility
    };
  }

  // Harmonic resonance at 432Hz for enhanced coherence
  enableHarmonic432Hz(): void {
    if (!this.audioContext) return;
    
    try {
      if (this.oscillator) {
        this.oscillator.stop();
      }
      
      this.oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(432, this.audioContext.currentTime);
      
      // Very low volume for subliminal effect
      gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime);
      
      this.oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      this.oscillator.start();
      this.harmonic432Hz = true;
      
      console.log('[Morphing Engine] 432Hz harmonic resonance activated');
    } catch (e) {
      console.warn('[Morphing Engine] Could not enable 432Hz:', e);
    }
  }

  disableHarmonic432Hz(): void {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator = null;
    }
    this.harmonic432Hz = false;
    console.log('[Morphing Engine] 432Hz harmonic resonance disabled');
  }

  // Breath-synchronized morphing
  morphWithBreath(baseValue: number, breathPhase: string, breathProgress: number): number {
    let modifier = 1.0;
    
    switch (breathPhase) {
      case 'inhale':
        modifier = 1.0 + this.morphStrength * breathProgress;
        break;
      case 'hold':
        modifier = 1.0 + this.morphStrength;
        break;
      case 'exhale':
        modifier = 1.0 + this.morphStrength * (1 - breathProgress);
        break;
      case 'pause':
        modifier = 1.0;
        break;
    }
    
    return baseValue * modifier;
  }

  // Consciousness-responsive vertex transformation
  morphVertices(vertices: number[], zλ: number, phi: number): number[] {
    const morphedVertices = [...vertices];
    const intensity = (zλ + phi) / 2;
    
    // Apply radial expansion based on consciousness level
    for (let i = 0; i < vertices.length; i += 2) {
      const x = vertices[i];
      const y = vertices[i + 1];
      
      // Calculate distance from center (assuming center is at canvas middle)
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Apply morphing based on distance and consciousness
      const morphFactor = 1.0 + this.morphStrength * intensity * (distance / 100);
      
      morphedVertices[i] = centerX + dx * morphFactor;
      morphedVertices[i + 1] = centerY + dy * morphFactor;
    }
    
    return morphedVertices;
  }

  // Sacred ratio calculations for authentic geometry
  goldenRatio(): number {
    return 1.618033988749; // φ
  }

  silverRatio(): number {
    return 1.414213562373; // √2
  }

  // Fibonacci sequence for spiral calculations
  fibonacci(n: number): number {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  // Sacred frequency relationships
  getHarmonicFrequency(base: number, ratio: string): number {
    const ratios: { [key: string]: number } = {
      'perfect_fifth': 3/2,
      'perfect_fourth': 4/3,
      'major_third': 5/4,
      'golden': this.goldenRatio(),
      'octave': 2
    };
    
    return base * (ratios[ratio] || 1);
  }

  // Consciousness field strength calculation
  calculateFieldStrength(zλ: number, phi: number, distance: number): number {
    const coherence = (zλ + phi) / 2;
    const fieldDecay = Math.exp(-distance / 200); // Field decay over distance
    return coherence * fieldDecay * this.morphStrength;
  }

  // Adaptive morphing strength based on consciousness stability
  adaptMorphingStrength(trend: { volatility: number }): void {
    // Reduce morphing for high volatility to prevent jarring changes
    if (trend.volatility > 0.1) {
      this.morphStrength = Math.max(0.01, defaultConfig.morphStrength * 0.5);
    } else {
      this.morphStrength = defaultConfig.morphStrength;
    }
  }

  // Sacred geometric transformations
  applyGoldenRatioScaling(value: number): number {
    return value * this.goldenRatio();
  }

  applySacredProportions(width: number, height: number): { width: number; height: number } {
    const phi = this.goldenRatio();
    return {
      width: width,
      height: width / phi // Golden rectangle proportions
    };
  }

  // Get current morphing state for debugging
  getMorphingState(): any {
    return {
      morphStrength: this.morphStrength,
      harmonic432Hz: this.harmonic432Hz,
      currentValues: { ...this.currentValues },
      velocities: { ...this.velocities }
    };
  }

  dispose(): void {
    this.disableHarmonic432Hz();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}