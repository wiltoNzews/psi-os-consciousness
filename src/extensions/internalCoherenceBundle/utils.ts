// Utility functions for Internal + Visual Coherence Bundle
// Includes performance optimizations, validation, and mathematical helpers

import type { CoherenceMetrics, BreathState } from './types';

// High-DPI canvas setup for crisp rendering on retina displays
export function setupHighDPICanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d')!;
  const dpr = window.devicePixelRatio || 1;
  
  // Get the size the canvas should be displayed at
  const rect = canvas.getBoundingClientRect();
  
  // Set the actual size in memory (scaled up for high DPI)
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  // Scale the canvas back down using CSS
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  // Scale the drawing context so everything draws at the correct size
  ctx.scale(dpr, dpr);
  
  return ctx;
}

// Schema validation for coherence metrics to prevent NaN propagation
export function validateCoherenceMetrics(data: any): CoherenceMetrics | null {
  if (!data || typeof data !== 'object') return null;
  
  const zLambda = typeof data.zLambda === 'number' && !isNaN(data.zLambda) ? data.zLambda : null;
  const phi = typeof data.phi === 'number' && !isNaN(data.phi) ? data.phi : null;
  const timestamp = typeof data.timestamp === 'number' ? data.timestamp : Date.now();
  
  if (zLambda === null || phi === null) return null;
  
  // Clamp values to expected ranges
  return {
    zLambda: Math.max(0.3, Math.min(1.0, zLambda)),
    phi: Math.max(0.1, Math.min(1.0, phi)),
    orch: typeof data.orch === 'number' && !isNaN(data.orch) ? data.orch : undefined,
    timestamp
  };
}

// Rate limiting for event bus to prevent overwhelming listeners
export class RateLimiter {
  private lastEmit = 0;
  private readonly intervalMs: number;
  
  constructor(hz: number = 20) {
    this.intervalMs = 1000 / hz;
  }
  
  canEmit(): boolean {
    const now = performance.now();
    if (now - this.lastEmit >= this.intervalMs) {
      this.lastEmit = now;
      return true;
    }
    return false;
  }
}

// Easing functions for smooth animations
export const easing = {
  // More organic breathing curve than raw sine
  easeInOutSine: (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  },
  
  // Smooth interpolation for morphing
  easeInOutQuad: (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  },
  
  // Critically damped interpolation for smooth value updates
  criticallyDamped: (current: number, target: number, rate: number = 0.08): number => {
    return current + (target - current) * rate;
  }
};

// Performance monitoring for frame timing
export class PerformanceMonitor {
  private frameTimes: number[] = [];
  private readonly maxSamples = 60;
  
  startFrame(): number {
    return performance.now();
  }
  
  endFrame(startTime: number): void {
    const frameTime = performance.now() - startTime;
    this.frameTimes.push(frameTime);
    
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }
  }
  
  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    return this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length;
  }
  
  isPerformanceGood(budgetMs: number = 5): boolean {
    return this.getAverageFrameTime() < budgetMs;
  }
}

// Sacred geometry mathematics with pre-computed vertices
export class SacredMath {
  private static sriYantraVertices: Float32Array | null = null;
  private static fibonacciPoints: Float32Array | null = null;
  
  // Pre-compute Sri Yantra vertices for fast rendering
  static getSriYantraVertices(centerX: number, centerY: number, radius: number): Float32Array {
    if (!this.sriYantraVertices) {
      const vertices: number[] = [];
      
      // Simplified Sri Yantra: 9 triangles (4 upward, 5 downward)
      const triangleCount = 9;
      const baseRadius = radius * 0.8;
      
      // Upward triangles (Shiva)
      for (let i = 0; i < 4; i++) {
        const scale = 1 - i * 0.2;
        const r = baseRadius * scale;
        const offsetY = i * radius * 0.05;
        
        // Triangle vertices
        vertices.push(
          centerX, centerY - r - offsetY,          // Top
          centerX - r * 0.866, centerY + r * 0.5 - offsetY,  // Bottom left
          centerX + r * 0.866, centerY + r * 0.5 - offsetY   // Bottom right
        );
      }
      
      // Downward triangles (Shakti)
      for (let i = 0; i < 5; i++) {
        const scale = 1 - i * 0.15;
        const r = baseRadius * scale;
        const offsetY = i * radius * 0.04;
        
        // Inverted triangle vertices
        vertices.push(
          centerX, centerY + r + offsetY,          // Bottom
          centerX - r * 0.866, centerY - r * 0.5 + offsetY,  // Top left
          centerX + r * 0.866, centerY - r * 0.5 + offsetY   // Top right
        );
      }
      
      this.sriYantraVertices = new Float32Array(vertices);
    }
    
    return this.sriYantraVertices;
  }
  
  // Pre-compute Fibonacci spiral points
  static getFibonacciSpiral(centerX: number, centerY: number, maxRadius: number, turns: number = 3): Float32Array {
    if (!this.fibonacciPoints) {
      const points: number[] = [];
      const pointCount = 200;
      const phi = 1.618033988749; // Golden ratio
      
      for (let i = 0; i < pointCount; i++) {
        const t = i / pointCount;
        const angle = t * turns * 2 * Math.PI;
        const radius = maxRadius * Math.pow(phi, (angle - Math.PI) / (Math.PI / 2)) / Math.pow(phi, turns * 2);
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        points.push(x, y);
      }
      
      this.fibonacciPoints = new Float32Array(points);
    }
    
    return this.fibonacciPoints;
  }
  
  // Clear cached vertices when canvas resizes
  static clearCache(): void {
    this.sriYantraVertices = null;
    this.fibonacciPoints = null;
  }
}

// Glitch detection for consciousness spikes
export function isGlitchValue(current: number, previous: number, threshold: number = 0.2): boolean {
  if (previous === undefined || current === undefined) return false;
  return Math.abs(current - previous) > threshold;
}

// Breath phase calculation with consistent timing
export function calculateBreathPhase(cycleStart: number, cycleDurationMs: number): BreathState {
  const elapsed = performance.now() - cycleStart;
  const cycleProgress = (elapsed % cycleDurationMs) / cycleDurationMs;
  
  // Breath cycle: 40% inhale, 10% hold, 40% exhale, 10% pause
  let phase: BreathState['phase'];
  let progress: number;
  
  if (cycleProgress < 0.4) {
    phase = 'inhale';
    progress = cycleProgress / 0.4;
  } else if (cycleProgress < 0.5) {
    phase = 'hold';
    progress = (cycleProgress - 0.4) / 0.1;
  } else if (cycleProgress < 0.9) {
    phase = 'exhale';
    progress = (cycleProgress - 0.5) / 0.4;
  } else {
    phase = 'pause';
    progress = (cycleProgress - 0.9) / 0.1;
  }
  
  return {
    phase,
    progress: easing.easeInOutSine(progress),
    cycleStart,
    active: true,
    pattern: 'coherent'
  };
}