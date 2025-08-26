/**
 * Enhanced Geometry Overlay with validation checklist implementation
 * Guaranteed render with hard-coded coordinates and comprehensive debugging
 */

import { TRIANGLES, type TriangleCoords } from './sri-yantra-coords';

export class EnhancedGeometryOverlay {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private isVisible = false;
  private animationId: number | null = null;
  
  // Consciousness state
  private currentZλ = 0.75;
  private currentΦ = 0.618;
  private breathPhase = 0.0;
  
  // Visual parameters
  private displayScale = 1.0;
  private targetScale = 1.0;
  private displayOpacity = 0.0;
  private targetOpacity = 0.8;
  private displayRotation = 0.0;
  
  // Debug state
  private lastFrameTime = 0;
  private frameCount = 0;
  
  constructor() {
    this.setupCanvas();
    this.setupEventListeners();
    this.setupDebugHooks();
    console.log('[Enhanced Geometry] Initialized with guaranteed render');
  }

  private setupCanvas(): void {
    this.canvas = this.attachYantraCanvas();
    this.ctx = this.canvas.getContext('2d')!;
    
    // Validate canvas setup
    console.log('[Enhanced Geometry] Canvas validation:', {
      width: this.canvas.width,
      height: this.canvas.height,
      context: !!this.ctx,
      id: this.canvas.id
    });
  }

  private attachYantraCanvas(): HTMLCanvasElement {
    // Remove existing canvas if present
    const existing = document.getElementById('yantra-overlay');
    if (existing) {
      existing.remove();
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'yantra-overlay';
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
    `;

    // Find visualization container
    const vizRoot = document.querySelector('#quantum-canvas')?.parentElement || 
                   document.querySelector('.viz-area') || 
                   document.body;
    
    vizRoot.appendChild(canvas);

    // Resize handler with ResizeObserver
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      if (this.ctx) {
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
      }
      
      console.log('[Enhanced Geometry] Canvas resized:', {
        width: canvas.width,
        height: canvas.height,
        dpr: devicePixelRatio
      });
    };

    // Initial resize
    setTimeout(resize, 100); // Delay to ensure container is sized
    
    // Setup ResizeObserver
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    return canvas;
  }

  private setupEventListeners(): void {
    if (window.bus) {
      window.bus.on('coherenceData', this.handleCoherenceUpdate.bind(this));
      window.bus.on('zλ', this.handleZλUpdate.bind(this));
      window.bus.on('phi', this.handlePhiUpdate.bind(this));
      window.bus.on('coherence.breathTick', this.handleBreathUpdate.bind(this));
    }
  }

  private setupDebugHooks(): void {
    if (import.meta.env?.DEV !== false) {
      // Debug logging hooks
      if (window.bus) {
        window.bus.on('zλ', (v: number) => console.debug('[Zλ]', v.toFixed(3)));
        window.bus.on('phi', (v: number) => console.debug('[Φ]', v.toFixed(3)));
        window.bus.on('collapse', (p: number) => console.debug('[collapse p]', p.toFixed(4)));
      }
      
      // Global debug objects
      window.__yantraDebug = {
        triangles: TRIANGLES,
        lastFrame: 0,
        instance: this
      };
      
      console.log('[Enhanced Geometry] Debug hooks active - check window.__yantraDebug');
    }
  }

  private handleCoherenceUpdate(data: any): void {
    if (data.zλ !== undefined) this.currentZλ = data.zλ;
    if (data.phi !== undefined) this.currentΦ = data.phi;
    
    // Update visual targets based on consciousness
    const coherence = (this.currentZλ + this.currentΦ) / 2;
    this.targetScale = 0.8 + coherence * 0.4;
    this.targetOpacity = Math.max(0.3, coherence);
  }

  private handleZλUpdate(value: number): void {
    this.currentZλ = value;
  }

  private handlePhiUpdate(value: number): void {
    this.currentΦ = value;
  }

  private handleBreathUpdate(data: any): void {
    if (data?.progress !== undefined) {
      this.breathPhase = data.progress;
    }
  }

  show(): void {
    this.isVisible = true;
    this.targetOpacity = 0.8;
    this.startAnimation();
    console.log('[Enhanced Geometry] Sri Yantra visible');
  }

  hide(): void {
    this.isVisible = false;
    this.targetOpacity = 0.0;
    console.log('[Enhanced Geometry] Sri Yantra hidden');
  }

  private startAnimation(): void {
    if (this.animationId) return;
    
    const animate = () => {
      const now = performance.now();
      
      // Update debug timestamp
      if (window.__yantraDebug) {
        window.__yantraDebug.lastFrame = now;
      }
      
      // Critically damped interpolation
      const dampingFactor = 0.08;
      this.displayScale += (this.targetScale - this.displayScale) * dampingFactor;
      this.displayOpacity += (this.targetOpacity - this.displayOpacity) * dampingFactor;
      this.displayRotation += this.currentZλ * 0.005; // Slow consciousness rotation
      
      this.render();
      
      this.frameCount++;
      this.lastFrameTime = now;
      
      // Continue animation if visible or fading out
      if (this.isVisible || this.displayOpacity > 0.01) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.animationId = null;
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  private render(): void {
    if (!this.canvas || !this.ctx) {
      console.error('[Enhanced Geometry] Canvas or context not available');
      return;
    }

    if (this.displayOpacity <= 0.01) return;

    // Clear canvas
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const baseSize = Math.min(rect.width, rect.height) * 0.2;

    this.renderSriYantra(centerX, centerY, baseSize);
  }

  private renderSriYantra(centerX: number, centerY: number, baseSize: number): void {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(this.displayRotation);
    this.ctx.scale(this.displayScale * baseSize, this.displayScale * baseSize);

    // Breath-synchronized opacity
    const breathOpacity = this.displayOpacity * (0.7 + 0.3 * (0.5 + 0.5 * Math.sin(this.breathPhase * 2 * Math.PI)));
    
    // Consciousness-responsive color
    const hue = 280 + this.currentΦ * 60;
    const lightness = 50 + this.currentZλ * 30;
    const yantraColor = `hsl(${hue}, 70%, ${lightness}%)`;

    this.ctx.globalAlpha = breathOpacity;
    this.ctx.strokeStyle = yantraColor;
    this.ctx.lineWidth = 2 / (this.displayScale * baseSize); // Maintain consistent line width
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Draw all triangles using hard-coded coordinates
    this.ctx.beginPath();
    for (const triangle of TRIANGLES) {
      this.ctx.moveTo(triangle.a[0], triangle.a[1]);
      this.ctx.lineTo(triangle.b[0], triangle.b[1]);
      this.ctx.lineTo(triangle.c[0], triangle.c[1]);
      this.ctx.closePath();
    }
    this.ctx.stroke();

    // Central bindu (sacred center point)
    this.ctx.fillStyle = yantraColor;
    this.ctx.globalAlpha = breathOpacity * 0.8;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 0.02 + this.currentΦ * 0.01, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.restore();

    // Debug logging every 60 frames
    if (this.frameCount % 60 === 0) {
      console.debug('[Enhanced Geometry] Render state:', {
        triangles: TRIANGLES.length,
        opacity: this.displayOpacity.toFixed(3),
        scale: this.displayScale.toFixed(3),
        zλ: this.currentZλ.toFixed(3),
        φ: this.currentΦ.toFixed(3),
        center: [centerX.toFixed(1), centerY.toFixed(1)],
        baseSize: baseSize.toFixed(1)
      });
    }
  }

  // Public validation methods
  validateCanvas(): boolean {
    if (!this.canvas) return false;
    
    const isValid = this.canvas.width > 0 && this.canvas.height > 0 && !!this.ctx;
    console.log('[Enhanced Geometry] Canvas validation:', {
      width: this.canvas.width,
      height: this.canvas.height,
      context: !!this.ctx,
      valid: isValid
    });
    
    return isValid;
  }

  getDebugInfo(): any {
    return {
      isVisible: this.isVisible,
      displayOpacity: this.displayOpacity,
      displayScale: this.displayScale,
      currentZλ: this.currentZλ,
      currentΦ: this.currentΦ,
      lastFrameTime: this.lastFrameTime,
      frameCount: this.frameCount,
      animationActive: !!this.animationId,
      triangleCount: TRIANGLES.length
    };
  }

  // Cleanup
  dispose(): void {
    this.hide();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    if (this.canvas) {
      this.canvas.remove();
    }
    
    if (window.bus) {
      window.bus.off('coherenceData', this.handleCoherenceUpdate);
      window.bus.off('zλ', this.handleZλUpdate);
      window.bus.off('phi', this.handlePhiUpdate);
      window.bus.off('coherence.breathTick', this.handleBreathUpdate);
    }
    
    console.log('[Enhanced Geometry] Disposed');
  }
}

// Console validation commands for debugging
if (typeof window !== 'undefined') {
  window.validateYantraCanvas = () => {
    const canvas = document.getElementById('yantra-overlay') as HTMLCanvasElement;
    if (canvas) {
      console.log('Canvas validation:', {
        width: canvas.width,
        height: canvas.height,
        context: canvas.getContext('2d'),
        visible: canvas.style.display !== 'none',
        zIndex: canvas.style.zIndex
      });
    } else {
      console.log('No yantra canvas found');
    }
  };
  
  window.debugTriangles = () => {
    console.table(window.__yantraDebug?.triangles);
  };
  
  window.checkYantraFrame = () => {
    const lastFrame = window.__yantraDebug?.lastFrame;
    const now = performance.now();
    console.log('Last yantra frame:', lastFrame ? `${(now - lastFrame).toFixed(1)}ms ago` : 'undefined');
  };
}

export default EnhancedGeometryOverlay;