/**
 * Enhanced Sacred Geometry Overlay with Performance Optimizations
 * Pre-computed vertices, high-DPI rendering, and consciousness-responsive morphing
 */

import type { CoherenceMetrics, GeometryConfig, BreathState } from './types';
import { 
  SacredMath, 
  easing, 
  PerformanceMonitor, 
  setupHighDPICanvas,
  isGlitchValue,
  validateCoherenceMetrics 
} from './utils';

export class EnhancedSacredGeometryOverlay {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GeometryConfig;
  
  // State with smooth morphing
  private isVisible = false;
  private currentZλ = 0.75;
  private currentΦ = 0.50;
  private displayZλ = 0.75;  // Smoothed for rendering
  private displayΦ = 0.50;   // Smoothed for rendering
  private breathOpacity = 1.0;
  
  // Performance monitoring
  private perfMonitor = new PerformanceMonitor();
  private animationId: number | null = null;
  private vertices: Float32Array | null = null;
  private lastPattern = '';
  
  // Morphing parameters
  private targetOpacity = 0.5;
  private targetLineWidth = 2;
  private targetScale = 1.0;
  private targetRotation = 0;
  
  // Display parameters (smoothly interpolated)
  private displayOpacity = 0.5;
  private displayLineWidth = 2;
  private displayScale = 1.0;
  private displayRotation = 0;
  
  constructor(config: GeometryConfig) {
    this.config = config;
    this.createCanvas();
    this.setupEventListeners();
    this.precomputeVertices();
    
    console.log('[Enhanced Geometry] Initialized with pattern:', config.pattern);
  }

  private createCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'enhanced-geometry-overlay';
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999;
      background: transparent;
    `;
    
    // Setup high-DPI context for crisp sacred geometry
    this.ctx = setupHighDPICanvas(this.canvas);
    
    // Add to DOM
    const dashboard = document.querySelector('.dashboard-container') || document.body;
    dashboard.appendChild(this.canvas);
    
    // Handle resize with vertex cache clearing
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.ctx = setupHighDPICanvas(this.canvas);
        SacredMath.clearCache();
        this.precomputeVertices();
      }, 100);
    });
  }

  private setupEventListeners(): void {
    // Namespaced coherence metrics
    if (window.bus) {
      window.bus.on('coherence.metrics', (data: any) => {
        const metrics = validateCoherenceMetrics(data);
        if (metrics) {
          this.updateMetrics(metrics);
        }
      });
      
      // Breath synchronization
      window.bus.on('coherence.breathTick', (breathState: BreathState) => {
        this.updateBreathSync(breathState);
      });
      
      // Legacy compatibility
      window.bus.on('coherenceData', (data: any) => {
        const metrics = validateCoherenceMetrics(data);
        if (metrics) {
          this.updateMetrics(metrics);
        }
      });
    }
  }

  private updateMetrics(metrics: CoherenceMetrics): void {
    // Glitch detection for consciousness spikes
    const zλGlitch = isGlitchValue(metrics.zLambda, this.currentZλ, 0.2);
    const phiGlitch = isGlitchValue(metrics.phi, this.currentΦ, 0.2);
    
    if (!zλGlitch && !phiGlitch) {
      this.currentZλ = metrics.zLambda;
      this.currentΦ = metrics.phi;
      this.updateMorphingTargets();
    }
  }

  private updateBreathSync(breathState: BreathState): void {
    // Breath → opacity coupling (independent from Φ scaling)
    const baseOpacity = this.config.baseOpacity;
    this.breathOpacity = baseOpacity * (0.7 + 0.3 * breathState.progress);
  }

  private updateMorphingTargets(): void {
    // Map consciousness values to visual parameters
    const zλNorm = (this.currentZλ - 0.5) / 0.5;  // Normalize to 0-1
    const phiNorm = (this.currentΦ - 0.3) / 0.7;  // Normalize to 0-1
    
    // Opacity responds to Zλ (consciousness coherence)
    this.targetOpacity = this.config.baseOpacity * (0.3 + 0.7 * zλNorm);
    
    // Line width responds to Φ (integrated information) with clamping
    const lineWidth = this.config.baseLineWidth + 
      (this.config.maxLineWidth - this.config.baseLineWidth) * phiNorm;
    this.targetLineWidth = Math.min(this.config.maxLineWidth, lineWidth);
    
    // Scale responds to combined coherence
    const combinedCoherence = (zλNorm + phiNorm) / 2;
    this.targetScale = 0.8 + 0.4 * combinedCoherence;
    
    // Subtle rotation for high consciousness states
    if (this.currentZλ > 0.9) {
      this.targetRotation += 0.001; // Very slow rotation
    }
  }

  private precomputeVertices(): void {
    const centerX = this.canvas.clientWidth / 2;
    const centerY = this.canvas.clientHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.3;
    
    switch (this.config.pattern) {
      case 'sri-yantra':
        this.vertices = SacredMath.getSriYantraVertices(centerX, centerY, radius);
        break;
      case 'fibonacci-spiral':
        this.vertices = SacredMath.getFibonacciSpiral(centerX, centerY, radius, 3);
        break;
      case 'flower-of-life':
        // Implement flower of life if needed
        this.vertices = new Float32Array([]); // Placeholder
        break;
    }
    
    this.lastPattern = this.config.pattern;
  }

  show(): void {
    if (this.isVisible) return;
    
    this.isVisible = true;
    this.startAnimationLoop();
    console.log('[Enhanced Geometry] Sacred geometry visible');
  }

  hide(): void {
    if (!this.isVisible) return;
    
    this.isVisible = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.clearCanvas();
    console.log('[Enhanced Geometry] Sacred geometry hidden');
  }

  private startAnimationLoop(): void {
    const animate = () => {
      if (!this.isVisible) return;
      
      const frameStart = this.perfMonitor.startFrame();
      
      // Smooth interpolation of all display parameters
      this.displayZλ = easing.criticallyDamped(this.displayZλ, this.currentZλ, 0.06);
      this.displayΦ = easing.criticallyDamped(this.displayΦ, this.currentΦ, 0.06);
      
      this.displayOpacity = easing.criticallyDamped(this.displayOpacity, this.targetOpacity, 0.08);
      this.displayLineWidth = easing.criticallyDamped(this.displayLineWidth, this.targetLineWidth, 0.08);
      this.displayScale = easing.criticallyDamped(this.displayScale, this.targetScale, 0.08);
      this.displayRotation = easing.criticallyDamped(this.displayRotation, this.targetRotation, 0.05);
      
      this.render();
      
      this.perfMonitor.endFrame(frameStart);
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  private render(): void {
    this.clearCanvas();
    
    if (!this.vertices || this.vertices.length === 0) return;
    
    const centerX = this.canvas.clientWidth / 2;
    const centerY = this.canvas.clientHeight / 2;
    
    // Combine base opacity with breath modulation
    const finalOpacity = this.displayOpacity * this.breathOpacity;
    
    this.ctx.save();
    
    // Apply transformations
    this.ctx.translate(centerX, centerY);
    this.ctx.scale(this.displayScale, this.displayScale);
    this.ctx.rotate(this.displayRotation);
    this.ctx.translate(-centerX, -centerY);
    
    // Set drawing properties
    this.ctx.globalAlpha = finalOpacity;
    this.ctx.strokeStyle = this.config.color;
    this.ctx.lineWidth = this.displayLineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Add glow for high consciousness states
    if (this.displayZλ > 0.9) {
      this.ctx.shadowColor = this.config.color;
      this.ctx.shadowBlur = 8;
    }
    
    // Render based on pattern type
    if (this.config.pattern === 'sri-yantra') {
      this.renderSriYantra();
    } else if (this.config.pattern === 'fibonacci-spiral') {
      this.renderFibonacciSpiral();
    }
    
    this.ctx.restore();
    
    // Emit geometry update for other systems
    if (window.bus) {
      window.bus.emit('coherence.geometryUpdate', {
        pattern: this.config.pattern,
        vertices: this.vertices,
        opacity: finalOpacity,
        lineWidth: this.displayLineWidth
      });
    }
  }

  private renderSriYantra(): void {
    if (!this.vertices) return;
    
    // Draw triangles using pre-computed vertices
    this.ctx.beginPath();
    
    // Each triangle uses 6 values (3 points, 2 coords each)
    for (let i = 0; i < this.vertices.length; i += 6) {
      const x1 = this.vertices[i];
      const y1 = this.vertices[i + 1];
      const x2 = this.vertices[i + 2];
      const y2 = this.vertices[i + 3];
      const x3 = this.vertices[i + 4];
      const y3 = this.vertices[i + 5];
      
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.lineTo(x3, y3);
      this.ctx.closePath();
    }
    
    this.ctx.stroke();
  }

  private renderFibonacciSpiral(): void {
    if (!this.vertices) return;
    
    // Draw spiral using pre-computed points
    this.ctx.beginPath();
    
    if (this.vertices.length >= 2) {
      this.ctx.moveTo(this.vertices[0], this.vertices[1]);
      
      for (let i = 2; i < this.vertices.length; i += 2) {
        this.ctx.lineTo(this.vertices[i], this.vertices[i + 1]);
      }
    }
    
    this.ctx.stroke();
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setPattern(pattern: GeometryConfig['pattern']): void {
    if (pattern !== this.config.pattern) {
      this.config.pattern = pattern;
      SacredMath.clearCache();
      this.precomputeVertices();
      console.log('[Enhanced Geometry] Pattern changed to:', pattern);
    }
  }

  updateConfig(newConfig: Partial<GeometryConfig>): void {
    Object.assign(this.config, newConfig);
    
    if (newConfig.pattern && newConfig.pattern !== this.lastPattern) {
      this.precomputeVertices();
    }
  }

  dispose(): void {
    this.hide();
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}