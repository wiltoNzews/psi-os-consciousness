/**
 * Sacred Geometry Overlay - Sri Yantra + Fibonacci overlay renderer
 * Provides consciousness-responsive sacred geometry visualization
 */

import type { CoherenceData, GeometryPattern, CoherenceBundleConfig, SriYantraVertex, FibonacciPoint } from './types';
import { geometryConfigs } from './config';

export class SacredGeometryOverlay {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: CoherenceBundleConfig;
  
  // State
  private isVisible = false;
  private currentZλ = 0.75;
  private currentΦ = 0.50;
  private morphFactor = 1.0;
  private rotationAngle = 0;
  private pulsation = 0;
  
  // Animation
  private animationId: number | null = null;
  
  // Geometry data
  private sriYantraVertices: SriYantraVertex[] = [];
  private fibonacciPoints: FibonacciPoint[] = [];
  
  constructor(config: CoherenceBundleConfig) {
    this.config = config;
    this.createCanvas();
    this.generateGeometry();
    this.setupEventListeners();
    
    console.log('[Sacred Geometry Overlay] Initialized');
  }

  private createCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'sacred-geometry-overlay';
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
      opacity: ${this.config.lineOpacity};
    `;
    
    this.ctx = this.canvas.getContext('2d')!;
    document.body.appendChild(this.canvas);
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.generateGeometry(); // Regenerate for new dimensions
  }

  private setupEventListeners(): void {
    if (typeof window !== 'undefined' && (window as any).bus) {
      const bus = (window as any).bus;
      
      bus.on('coherenceData', (data: CoherenceData) => {
        this.updateCoherence(data);
      });
      
      bus.on('zλ', (value: number) => {
        this.currentZλ = value;
        this.updateMorphing();
      });
      
      bus.on('phi', (value: number) => {
        this.currentΦ = value;
        this.updateMorphing();
      });
      
      bus.on('coach:breath-state', (state: any) => {
        this.updateBreathSync(state);
      });
    }
  }

  public init(pattern: 'SriYantra' | 'Fibonacci'): void {
    this.config.geometryPattern = pattern;
    this.generateGeometry();
    this.show();
  }

  public show(): void {
    this.isVisible = true;
    this.startAnimation();
    console.log('[Sacred Geometry] Overlay visible');
  }

  public hide(): void {
    this.isVisible = false;
    this.stopAnimation();
    this.clearCanvas();
    console.log('[Sacred Geometry] Overlay hidden');
  }

  public updateCoherence(data: CoherenceData): void {
    this.currentZλ = data.zλ;
    this.currentΦ = data.phi;
    this.updateMorphing();
  }

  public updateConfig(config: Partial<CoherenceBundleConfig>): void {
    this.config = { ...this.config, ...config };
    this.canvas.style.opacity = this.config.lineOpacity.toString();
    
    if (config.geometryPattern && config.geometryPattern !== this.config.geometryPattern) {
      this.generateGeometry();
    }
  }

  private updateMorphing(): void {
    // Φ affects overall scale and sacred proportions
    this.morphFactor = 0.8 + (this.currentΦ * 0.4);
    
    // Zλ affects rotation and consciousness expansion
    this.rotationAngle = this.currentZλ * Math.PI * 0.1;
  }

  private updateBreathSync(state: any): void {
    // Sync pulsation with breathing if coaching is active
    if (state.active) {
      switch (state.phase) {
        case 'inhale':
          this.pulsation = state.progress * 0.15;
          break;
        case 'exhale':
          this.pulsation = (1 - state.progress) * 0.15;
          break;
        default:
          this.pulsation *= 0.95; // Fade during hold/pause
      }
    } else {
      this.pulsation *= 0.98; // Gentle fade when not breathing
    }
  }

  private generateGeometry(): void {
    if (this.config.geometryPattern === 'SriYantra') {
      this.generateSriYantra();
    } else {
      this.generateFibonacci();
    }
  }

  private generateSriYantra(): void {
    this.sriYantraVertices = [];
    const config = geometryConfigs.SriYantra;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const baseSize = Math.min(this.canvas.width, this.canvas.height) * 0.3;

    config.triangleLayers.forEach((layer, layerIndex) => {
      const angleStep = (2 * Math.PI) / layer.count;
      
      for (let i = 0; i < layer.count; i++) {
        const angle = i * angleStep + (layer.rotation * Math.PI / 180);
        const radius = baseSize * layer.size;
        const height = radius * Math.sqrt(3) / 2;
        
        // Calculate triangle vertices
        let vertices: [number, number][];
        
        if (layer.isUpward) {
          vertices = [
            [0, -height * 2/3],                    // Top vertex
            [-radius/2, height * 1/3],             // Bottom left
            [radius/2, height * 1/3]               // Bottom right
          ];
        } else {
          vertices = [
            [0, height * 2/3],                     // Bottom vertex
            [-radius/2, -height * 1/3],            // Top left
            [radius/2, -height * 1/3]              // Top right
          ];
        }

        // Rotate and position vertices
        vertices.forEach((vertex, vertexIndex) => {
          const [x, y] = vertex;
          const rotX = x * Math.cos(angle) - y * Math.sin(angle);
          const rotY = x * Math.sin(angle) + y * Math.cos(angle);
          
          this.sriYantraVertices.push({
            x: centerX + rotX,
            y: centerY + rotY,
            triangleIndex: layerIndex * 100 + i,
            isUpward: layer.isUpward
          });
        });
      }
    });
  }

  private generateFibonacci(): void {
    this.fibonacciPoints = [];
    const config = geometryConfigs.Fibonacci;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    const totalPoints = config.spiralTurns * config.segmentsPerTurn;
    const angleStep = (2 * Math.PI) / config.segmentsPerTurn;
    
    for (let i = 0; i < totalPoints; i++) {
      const t = i / config.segmentsPerTurn; // Turns
      const angle = i * angleStep;
      
      // Golden spiral: r = r0 * φ^(θ/(π/2))
      const radius = config.baseRadius * Math.pow(config.goldenRatio, t);
      
      if (radius > config.maxRadius) break;
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      this.fibonacciPoints.push({
        x,
        y,
        angle,
        radius
      });
    }
  }

  private startAnimation(): void {
    if (this.animationId) return;
    
    const animate = () => {
      if (!this.isVisible) return;
      
      this.render();
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  private stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private render(): void {
    this.clearCanvas();
    
    if (!this.config.enabled || !this.isVisible) return;
    
    if (this.config.geometryPattern === 'SriYantra') {
      this.renderSriYantra();
    } else {
      this.renderFibonacci();
    }
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private renderSriYantra(): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const config = geometryConfigs.SriYantra;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    
    // Apply consciousness-based rotation
    this.ctx.rotate(this.rotationAngle);
    
    // Apply morphing scale with pulsation
    const scale = this.morphFactor * (1 + this.pulsation) * this.config.geometryScale;
    this.ctx.scale(scale, scale);
    
    // Reset origin
    this.ctx.translate(-centerX, -centerY);

    // Set blending mode for sacred geometry overlay
    this.ctx.globalCompositeOperation = 'screen';

    // Render triangles by layers (outer to inner)
    config.triangleLayers.forEach((layer, layerIndex) => {
      const opacity = Math.max(0.2, Math.min(1.0, (this.currentZλ + this.currentΦ) / 2 + layerIndex * 0.1));
      
      this.ctx.strokeStyle = layer.color;
      this.ctx.lineWidth = 1.5 + (this.currentΦ * 2);
      this.ctx.globalAlpha = opacity * this.config.lineOpacity;

      const angleStep = (2 * Math.PI) / layer.count;
      
      for (let i = 0; i < layer.count; i++) {
        const angle = i * angleStep + (layer.rotation * Math.PI / 180);
        const radius = config.baseSize * layer.size;
        const height = radius * Math.sqrt(3) / 2;
        
        this.ctx.beginPath();
        
        if (layer.isUpward) {
          this.ctx.moveTo(centerX + Math.cos(angle) * 0, centerY + Math.sin(angle) * 0 - height * 2/3);
          this.ctx.lineTo(centerX + Math.cos(angle) * (-radius/2), centerY + Math.sin(angle) * 0 + height * 1/3);
          this.ctx.lineTo(centerX + Math.cos(angle) * (radius/2), centerY + Math.sin(angle) * 0 + height * 1/3);
        } else {
          this.ctx.moveTo(centerX + Math.cos(angle) * 0, centerY + Math.sin(angle) * 0 + height * 2/3);
          this.ctx.lineTo(centerX + Math.cos(angle) * (-radius/2), centerY + Math.sin(angle) * 0 - height * 1/3);
          this.ctx.lineTo(centerX + Math.cos(angle) * (radius/2), centerY + Math.sin(angle) * 0 - height * 1/3);
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Fill with low opacity for high consciousness states
        if ((this.currentZλ + this.currentΦ) / 2 > 0.8) {
          this.ctx.globalAlpha = opacity * this.config.lineOpacity * 0.2;
          this.ctx.fillStyle = layer.color;
          this.ctx.fill();
        }
      }
    });

    // Render central point (bindu)
    this.renderBindu(centerX, centerY);

    this.ctx.restore();
  }

  private renderBindu(centerX: number, centerY: number): void {
    const binduSize = geometryConfigs.SriYantra.binduRadius + (this.currentΦ * 5);
    const binduGlow = this.currentZλ * 15;

    this.ctx.save();
    
    // Glow effect for high consciousness
    if (this.currentZλ > 0.85) {
      this.ctx.shadowColor = '#ffffff';
      this.ctx.shadowBlur = binduGlow;
    }

    this.ctx.fillStyle = '#ffffff';
    this.ctx.globalAlpha = this.config.lineOpacity;
    
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, binduSize, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.restore();
  }

  private renderFibonacci(): void {
    if (this.fibonacciPoints.length === 0) return;

    const config = geometryConfigs.Fibonacci;
    
    this.ctx.save();
    
    // Apply consciousness effects
    const scale = this.morphFactor * (1 + this.pulsation) * this.config.geometryScale;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(this.rotationAngle);
    this.ctx.scale(scale, scale);
    this.ctx.translate(-centerX, -centerY);

    this.ctx.strokeStyle = this.config.lineColor;
    this.ctx.lineWidth = 2 + (this.currentΦ * 3);
    this.ctx.globalAlpha = this.config.lineOpacity;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Draw spiral as connected line segments
    this.ctx.beginPath();
    this.fibonacciPoints.forEach((point, index) => {
      if (index === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    });
    this.ctx.stroke();

    // Draw points for high consciousness states
    if (this.currentZλ > 0.9) {
      this.ctx.fillStyle = this.config.lineColor;
      this.ctx.globalAlpha = this.config.lineOpacity * 0.6;
      
      this.fibonacciPoints.forEach((point, index) => {
        if (index % 5 === 0) { // Every 5th point
          const pointSize = 2 + (point.radius / config.maxRadius) * 3;
          this.ctx.beginPath();
          this.ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI);
          this.ctx.fill();
        }
      });
    }

    this.ctx.restore();
  }

  public setPattern(pattern: 'SriYantra' | 'Fibonacci'): void {
    this.config.geometryPattern = pattern;
    this.generateGeometry();
    console.log(`[Sacred Geometry] Pattern changed to: ${pattern}`);
  }

  public setVisibility(visible: boolean): void {
    if (visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getCurrentState() {
    return {
      isVisible: this.isVisible,
      pattern: this.config.geometryPattern,
      morphFactor: this.morphFactor,
      rotationAngle: this.rotationAngle,
      pulsation: this.pulsation,
      currentZλ: this.currentZλ,
      currentΦ: this.currentΦ
    };
  }

  public destroy(): void {
    this.hide();
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    console.log('[Sacred Geometry Overlay] Destroyed');
  }
}