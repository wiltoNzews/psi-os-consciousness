/**
 * Sri Yantra Sacred Geometry Overlay - Morphable with Consciousness
 * Renders authentic 43-triangle Sri Yantra that responds to Φ and Zλ
 */

import bus from '../core/bus';

interface YantraTriangle {
  vertices: [number, number][];
  isUpward: boolean;
  layer: number;
  color: string;
  opacity: number;
}

class SriYantraRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private triangles: YantraTriangle[] = [];
  private centerX = 0;
  private centerY = 0;
  private baseSize = 200;
  
  // Consciousness coupling
  private currentΦ = 0.5;
  private currentZλ = 0.75;
  private morphFactor = 1.0;
  private pulsation = 0;
  private rotationAngle = 0;
  
  // Animation state
  private animationId: number | null = null;
  private isVisible = true;
  private opacity = 0.8;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    this.generateSriYantra();
    this.setupEventListeners();
    this.startAnimation();
    
    console.log('[Sri Yantra] Initialized with 43 sacred triangles');
  }

  private setupEventListeners() {
    bus.on('phi', (phi: number) => {
      this.currentΦ = phi;
      this.updateMorphing();
    });

    bus.on('zλ', (zλ: number) => {
      this.currentZλ = zλ;
      this.updateMorphing();
    });

    bus.on('yantra:toggle', () => {
      this.isVisible = !this.isVisible;
    });

    bus.on('yantra:opacity', (opacity: number) => {
      this.opacity = Math.max(0, Math.min(1, opacity));
    });

    bus.on('coach:breath-state', (state: any) => {
      // Sync with breathing patterns
      if (state.phase === 'inhale') {
        this.pulsation = state.progress * 0.15;
      } else if (state.phase === 'exhale') {
        this.pulsation = (1 - state.progress) * 0.15;
      } else {
        this.pulsation *= 0.95; // Fade during hold/pause
      }
    });
  }

  private generateSriYantra() {
    this.triangles = [];
    
    // Define the sacred proportions and layers
    const layers = [
      { count: 1, size: 1.0, rotation: 0, isUpward: false, color: '#ff0080' },      // Central triangle
      { count: 8, size: 0.85, rotation: 0, isUpward: true, color: '#ff4000' },     // Inner 8 upward
      { count: 8, size: 0.75, rotation: 22.5, isUpward: false, color: '#ff8000' }, // Inner 8 downward
      { count: 10, size: 0.6, rotation: 0, isUpward: true, color: '#ffff00' },     // Middle 10 upward
      { count: 10, size: 0.5, rotation: 18, isUpward: false, color: '#80ff00' },   // Middle 10 downward
      { count: 6, size: 0.35, rotation: 0, isUpward: true, color: '#00ff80' }      // Outer 6 upward (total: 43)
    ];

    let triangleIndex = 0;
    
    layers.forEach((layer, layerIndex) => {
      const angleStep = 360 / layer.count;
      
      for (let i = 0; i < layer.count; i++) {
        const angle = (i * angleStep + layer.rotation) * Math.PI / 180;
        const triangle = this.createTriangle(
          angle,
          layer.size,
          layer.isUpward,
          layerIndex,
          layer.color
        );
        
        this.triangles.push(triangle);
        triangleIndex++;
      }
    });

    console.log(`[Sri Yantra] Generated ${this.triangles.length} triangles`);
  }

  private createTriangle(
    angle: number,
    size: number,
    isUpward: boolean,
    layer: number,
    color: string
  ): YantraTriangle {
    const radius = this.baseSize * size;
    const height = radius * Math.sqrt(3) / 2;
    
    let vertices: [number, number][];
    
    if (isUpward) {
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

    // Rotate vertices around center
    const rotatedVertices: [number, number][] = vertices.map(([x, y]) => {
      const rotX = x * Math.cos(angle) - y * Math.sin(angle);
      const rotY = x * Math.sin(angle) + y * Math.cos(angle);
      return [rotX, rotY];
    });

    return {
      vertices: rotatedVertices,
      isUpward,
      layer,
      color,
      opacity: 1.0
    };
  }

  private updateMorphing() {
    // Φ affects overall scale and sacred proportions
    this.morphFactor = 0.8 + (this.currentΦ * 0.4);
    
    // Zλ affects rotation and consciousness expansion
    this.rotationAngle = this.currentZλ * Math.PI * 0.1;
    
    // Update triangle opacities based on consciousness levels
    this.triangles.forEach((triangle, index) => {
      const layerFactor = (triangle.layer + 1) / 6;
      const consciousnessFactor = (this.currentZλ + this.currentΦ) / 2;
      triangle.opacity = Math.max(0.2, Math.min(1.0, consciousnessFactor + layerFactor * 0.3));
    });
  }

  private render() {
    if (!this.isVisible) return;

    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;

    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    
    // Apply consciousness-based rotation
    this.ctx.rotate(this.rotationAngle);
    
    // Apply morphing scale with pulsation
    const scale = this.morphFactor * (1 + this.pulsation);
    this.ctx.scale(scale, scale);

    // Set blending mode for sacred geometry overlay
    this.ctx.globalCompositeOperation = 'screen';

    // Render triangles from outer to inner layers
    const sortedTriangles = [...this.triangles].sort((a, b) => b.layer - a.layer);
    
    sortedTriangles.forEach((triangle) => {
      this.renderTriangle(triangle);
    });

    // Render central point (bindu)
    this.renderBindu();

    this.ctx.restore();
  }

  private renderTriangle(triangle: YantraTriangle) {
    this.ctx.save();
    
    // Set triangle style
    this.ctx.strokeStyle = triangle.color;
    this.ctx.fillStyle = triangle.color;
    this.ctx.lineWidth = 1.5;
    this.ctx.globalAlpha = triangle.opacity * this.opacity;

    // Create triangle path
    this.ctx.beginPath();
    triangle.vertices.forEach(([x, y], index) => {
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.closePath();

    // Draw triangle outline
    this.ctx.stroke();
    
    // Fill with low opacity for consciousness states above 0.8
    if ((this.currentZλ + this.currentΦ) / 2 > 0.8) {
      this.ctx.globalAlpha = triangle.opacity * this.opacity * 0.2;
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  private renderBindu() {
    // Central point (bindu) - consciousness unity point
    const binduSize = 3 + (this.currentΦ * 5);
    const binduGlow = this.currentZλ * 15;

    this.ctx.save();
    
    // Glow effect for high consciousness
    if (this.currentZλ > 0.85) {
      this.ctx.shadowColor = '#ffffff';
      this.ctx.shadowBlur = binduGlow;
    }

    this.ctx.fillStyle = '#ffffff';
    this.ctx.globalAlpha = this.opacity;
    
    this.ctx.beginPath();
    this.ctx.arc(0, 0, binduSize, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.restore();
  }

  private animationLoop = () => {
    this.render();
    this.animationId = requestAnimationFrame(this.animationLoop);
  };

  public startAnimation() {
    if (this.animationId) return;
    this.animationLoop();
    console.log('[Sri Yantra] Animation started');
  }

  public stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    console.log('[Sri Yantra] Animation stopped');
  }

  public setVisibility(visible: boolean) {
    this.isVisible = visible;
    bus.emit('yantra:visibility', visible);
  }

  public setOpacity(opacity: number) {
    this.opacity = Math.max(0, Math.min(1, opacity));
    bus.emit('yantra:opacity', this.opacity);
  }

  public setSize(size: number) {
    this.baseSize = Math.max(50, Math.min(400, size));
    console.log(`[Sri Yantra] Size set to ${this.baseSize}px`);
  }

  public resize() {
    // Automatically adjust to canvas size
    const maxDimension = Math.min(this.canvas.width, this.canvas.height);
    this.baseSize = maxDimension * 0.3; // 30% of smaller dimension
  }

  public getCurrentState() {
    return {
      isVisible: this.isVisible,
      opacity: this.opacity,
      triangleCount: this.triangles.length,
      morphFactor: this.morphFactor,
      pulsation: this.pulsation,
      currentΦ: this.currentΦ,
      currentZλ: this.currentZλ,
      baseSize: this.baseSize
    };
  }

  // Sync with sacred frequencies
  public syncWithFrequency(frequency: number) {
    // Sacred frequencies: 432Hz, 528Hz, 741Hz, etc.
    const pulseRate = frequency / 100; // Convert to animation speed
    this.pulsation = Math.sin(Date.now() * pulseRate * 0.001) * 0.1;
  }

  public destroy() {
    this.stopAnimation();
    console.log('[Sri Yantra] Destroyed');
  }
}

export default SriYantraRenderer;