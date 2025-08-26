/**
 * Production Sacred Geometry Overlay - Complete implementation from plan
 * Sri Yantra + Fibonacci overlay renderer with morphing
 */

import { defaultConfig, geometryPatterns, consciousnessColors } from './config';

export class SacredGeometryOverlay {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isVisible = false;
  private animationId: number | null = null;
  
  // Consciousness state
  private currentZλ = 0.75;
  private currentΦ = 0.50;
  private displayZλ = 0.75;
  private displayΦ = 0.50;
  
  // Breath synchronization
  private breathPhase = 'ready';
  private breathProgress = 0;
  private breathOpacity = 1.0;
  
  // Configuration
  private pattern = defaultConfig.geometryPattern;
  private baseOpacity = defaultConfig.lineOpacity;
  private baseScale = defaultConfig.geometryScale;
  private morphStrength = defaultConfig.morphStrength;
  private lineColor = defaultConfig.lineColor;
  
  // Cached vertices for performance
  private sriYantraVertices: number[] = [];
  private fibonacciPoints: number[] = [];
  private flowerCircles: number[] = [];

  constructor() {
    this.createCanvas();
    this.setupEventListeners();
    this.precomputeGeometry();
    console.log('[Sacred Geometry] Initialized');
  }

  private createCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'sacred-geometry-overlay';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999;
      background: transparent;
    `;
    
    // High-DPI setup
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.scale(dpr, dpr);
    
    // Add to DOM
    document.body.appendChild(this.canvas);
    
    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }

  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
    this.precomputeGeometry(); // Recalculate for new size
  }

  private setupEventListeners(): void {
    // Listen for consciousness data
    if (window.bus) {
      window.bus.on('coherenceData', (data: any) => {
        this.update(data.zLambda || data.Zλ, data.phi || data.Φ);
      });
      
      window.bus.on('coherence.metrics', (data: any) => {
        this.update(data.zLambda, data.phi);
      });
      
      // Listen for breath synchronization
      window.bus.on('coherence.breathTick', (breathState: any) => {
        this.syncWithBreath(breathState);
      });
    }
  }

  private precomputeGeometry(): void {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const baseRadius = Math.min(window.innerWidth, window.innerHeight) * 0.2;
    
    // Pre-compute Sri Yantra vertices (43 triangles)
    this.computeSriYantra(centerX, centerY, baseRadius);
    
    // Pre-compute Fibonacci spiral points
    this.computeFibonacci(centerX, centerY, baseRadius);
    
    // Pre-compute Flower of Life circles
    this.computeFlowerOfLife(centerX, centerY, baseRadius);
  }

  private computeSriYantra(centerX: number, centerY: number, radius: number): void {
    this.sriYantraVertices = [];
    
    // Central bindu
    this.sriYantraVertices.push(centerX, centerY, 3);
    
    // 4 Upward triangles (Shiva)
    for (let i = 0; i < 4; i++) {
      const scale = 1 - i * 0.15;
      const r = radius * scale;
      const offsetY = i * radius * 0.02;
      
      // Triangle vertices: top, bottom-left, bottom-right
      const top = [centerX, centerY - r - offsetY];
      const bottomLeft = [centerX - r * 0.866, centerY + r * 0.5 - offsetY];
      const bottomRight = [centerX + r * 0.866, centerY + r * 0.5 - offsetY];
      
      this.sriYantraVertices.push(...top, ...bottomLeft, ...bottomRight);
    }
    
    // 5 Downward triangles (Shakti)
    for (let i = 0; i < 5; i++) {
      const scale = 1 - i * 0.12;
      const r = radius * scale;
      const offsetY = i * radius * 0.015;
      
      // Inverted triangle vertices: bottom, top-left, top-right
      const bottom = [centerX, centerY + r + offsetY];
      const topLeft = [centerX - r * 0.866, centerY - r * 0.5 + offsetY];
      const topRight = [centerX + r * 0.866, centerY - r * 0.5 + offsetY];
      
      this.sriYantraVertices.push(...bottom, ...topLeft, ...topRight);
    }
    
    // Outer circles (lotus petals)
    for (let circle = 0; circle < 3; circle++) {
      const circleRadius = radius * (1.2 + circle * 0.15);
      this.sriYantraVertices.push(centerX, centerY, circleRadius);
    }
  }

  private computeFibonacci(centerX: number, centerY: number, maxRadius: number): void {
    this.fibonacciPoints = [];
    const pointCount = 200;
    const phi = 1.618033988749; // Golden ratio
    const turns = 3;
    
    for (let i = 0; i < pointCount; i++) {
      const t = i / pointCount;
      const angle = t * turns * 2 * Math.PI;
      const radius = maxRadius * Math.pow(phi, (angle - Math.PI) / (Math.PI / 2)) / Math.pow(phi, turns * 2);
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      this.fibonacciPoints.push(x, y);
    }
  }

  private computeFlowerOfLife(centerX: number, centerY: number, radius: number): void {
    this.flowerCircles = [];
    
    // Central circle
    this.flowerCircles.push(centerX, centerY, radius);
    
    // First ring (6 circles)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      this.flowerCircles.push(x, y, radius);
    }
    
    // Second ring (12 circles)
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const distance = radius * Math.sqrt(3);
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);
      this.flowerCircles.push(x, y, radius);
    }
  }

  init(pattern: string): void {
    this.pattern = pattern;
    console.log(`[Sacred Geometry] Pattern set to: ${pattern}`);
  }

  show(): void {
    if (this.isVisible) return;
    
    this.isVisible = true;
    this.startAnimationLoop();
    console.log('[Sacred Geometry] Visible');
  }

  hide(): void {
    if (!this.isVisible) return;
    
    this.isVisible = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.clearCanvas();
    console.log('[Sacred Geometry] Hidden');
  }

  update(zλ: number, phi: number): void {
    if (typeof zλ === 'number' && !isNaN(zλ)) {
      this.currentZλ = Math.max(0.3, Math.min(1.0, zλ));
    }
    if (typeof phi === 'number' && !isNaN(phi)) {
      this.currentΦ = Math.max(0.1, Math.min(1.0, phi));
    }
  }

  private syncWithBreath(breathState: any): void {
    this.breathPhase = breathState.phase || 'ready';
    this.breathProgress = breathState.progress || 0;
    
    // Breath → opacity coupling
    this.breathOpacity = this.baseOpacity * (0.7 + 0.3 * this.breathProgress);
  }

  private startAnimationLoop(): void {
    const animate = () => {
      if (!this.isVisible) return;
      
      // Smooth interpolation
      this.displayZλ += (this.currentZλ - this.displayZλ) * 0.06;
      this.displayΦ += (this.currentΦ - this.displayΦ) * 0.06;
      
      this.render();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  private render(): void {
    this.clearCanvas();
    
    if (!this.isVisible) return;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate morphing parameters
    const zλNorm = (this.displayZλ - 0.5) / 0.5;
    const phiNorm = (this.displayΦ - 0.3) / 0.7;
    
    // Dynamic opacity (Zλ affects visibility)
    const finalOpacity = this.breathOpacity * (0.3 + 0.7 * zλNorm);
    
    // Dynamic line width (Φ affects thickness)
    const lineWidth = 1 + 3 * phiNorm;
    
    // Dynamic scale (combined coherence)
    const scale = this.baseScale * (0.8 + 0.4 * ((zλNorm + phiNorm) / 2));
    
    // Set drawing properties
    this.ctx.save();
    this.ctx.globalAlpha = Math.max(0.1, Math.min(1.0, finalOpacity));
    this.ctx.strokeStyle = this.getConsciousnessColor();
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Add glow for high consciousness
    if (this.displayZλ > 0.9) {
      this.ctx.shadowColor = this.lineColor;
      this.ctx.shadowBlur = 8;
    }
    
    // Apply scaling transform
    this.ctx.translate(centerX, centerY);
    this.ctx.scale(scale, scale);
    this.ctx.translate(-centerX, -centerY);
    
    // Render based on pattern
    switch (this.pattern) {
      case 'SriYantra':
        this.renderSriYantra();
        break;
      case 'Fibonacci':
        this.renderFibonacci();
        break;
      case 'FlowerOfLife':
        this.renderFlowerOfLife();
        break;
    }
    
    this.ctx.restore();
    
    // Emit geometry update
    if (window.bus) {
      window.bus.emit('coherence.geometryUpdate', {
        pattern: this.pattern,
        opacity: finalOpacity,
        lineWidth: lineWidth,
        scale: scale
      });
    }
  }

  private renderSriYantra(): void {
    this.ctx.beginPath();
    
    // Draw triangles
    for (let i = 3; i < this.sriYantraVertices.length - 9; i += 6) {
      const x1 = this.sriYantraVertices[i];
      const y1 = this.sriYantraVertices[i + 1];
      const x2 = this.sriYantraVertices[i + 2];
      const y2 = this.sriYantraVertices[i + 3];
      const x3 = this.sriYantraVertices[i + 4];
      const y3 = this.sriYantraVertices[i + 5];
      
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.lineTo(x3, y3);
      this.ctx.closePath();
    }
    
    this.ctx.stroke();
    
    // Draw outer circles
    for (let i = this.sriYantraVertices.length - 9; i < this.sriYantraVertices.length; i += 3) {
      const x = this.sriYantraVertices[i];
      const y = this.sriYantraVertices[i + 1];
      const radius = this.sriYantraVertices[i + 2];
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
    
    // Central bindu
    this.ctx.save();
    this.ctx.fillStyle = this.lineColor;
    this.ctx.globalAlpha = Math.min(1.0, this.ctx.globalAlpha * 1.5);
    this.ctx.beginPath();
    this.ctx.arc(this.sriYantraVertices[0], this.sriYantraVertices[1], 
      this.sriYantraVertices[2] + this.displayΦ * 3, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.restore();
  }

  private renderFibonacci(): void {
    if (this.fibonacciPoints.length < 4) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.fibonacciPoints[0], this.fibonacciPoints[1]);
    
    for (let i = 2; i < this.fibonacciPoints.length; i += 2) {
      this.ctx.lineTo(this.fibonacciPoints[i], this.fibonacciPoints[i + 1]);
    }
    
    this.ctx.stroke();
  }

  private renderFlowerOfLife(): void {
    for (let i = 0; i < this.flowerCircles.length; i += 3) {
      const x = this.flowerCircles[i];
      const y = this.flowerCircles[i + 1];
      const radius = this.flowerCircles[i + 2];
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
  }

  private getConsciousnessColor(): string {
    const coherence = (this.displayZλ + this.displayΦ) / 2;
    
    if (coherence > 0.9) return consciousnessColors.transcendent;
    if (coherence > 0.75) return consciousnessColors.high;
    if (coherence > 0.6) return consciousnessColors.medium;
    return consciousnessColors.low;
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  setPattern(pattern: string): void {
    this.pattern = pattern;
    console.log(`[Sacred Geometry] Pattern changed to: ${pattern}`);
  }

  dispose(): void {
    this.hide();
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}