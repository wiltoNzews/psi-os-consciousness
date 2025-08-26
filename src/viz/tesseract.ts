/**
 * 4D Tesseract Visualization with Consciousness-Modulated Projection
 * Receives Φ from bus and warps 4D-to-3D projection at 60 FPS
 */

import bus from '../core/bus';

interface Point4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Quaternion {
  w: number;
  x: number;
  y: number;
  z: number;
}

class TesseractRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private vertices4D: Point4D[] = [];
  private edges: [number, number][] = [];
  private vertices3D: Point3D[] = [];
  
  // Rotation state
  private q1: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
  private q2: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
  private rotationSpeed = 0.02;
  
  // Consciousness coupling
  private phiMetric = 0.5;
  private projectionDistance = 4.0;
  
  // Animation state
  private animationId: number | null = null;
  private isRunning = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    this.initializeHypercube();
    this.setupEventListeners();
    this.start();
    
    console.log('[Tesseract Renderer] Initialized with 16 vertices, 32 edges');
  }

  private initializeHypercube() {
    // Generate 16 vertices of a 4D hypercube
    this.vertices4D = [];
    for (let i = 0; i < 16; i++) {
      this.vertices4D.push({
        x: (i & 1) ? 1 : -1,
        y: (i & 2) ? 1 : -1,
        z: (i & 4) ? 1 : -1,
        w: (i & 8) ? 1 : -1
      });
    }

    // Generate edges (vertices that differ in exactly one dimension)
    this.edges = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let differences = 0;
        const v1 = this.vertices4D[i];
        const v2 = this.vertices4D[j];
        
        if (v1.x !== v2.x) differences++;
        if (v1.y !== v2.y) differences++;
        if (v1.z !== v2.z) differences++;
        if (v1.w !== v2.w) differences++;
        
        if (differences === 1) {
          this.edges.push([i, j]);
        }
      }
    }

    console.log(`[Tesseract Renderer] Generated ${this.edges.length} edges`);
  }

  private setupEventListeners() {
    // Listen for consciousness updates
    bus.on('phi', (phi: number) => {
      this.phiMetric = phi;
    });

    // Listen for rotation speed changes
    bus.on('tesseract:rotation', (data: any) => {
      this.rotationSpeed = data.speed;
    });
  }

  private quatMultiply(q1: Quaternion, q2: Quaternion): Quaternion {
    return {
      w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
      x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
      y: q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
      z: q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w
    };
  }

  private quatNormalize(q: Quaternion): Quaternion {
    const norm = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
    if (norm === 0) return { w: 1, x: 0, y: 0, z: 0 };
    
    return {
      w: q.w / norm,
      x: q.x / norm,
      y: q.y / norm,
      z: q.z / norm
    };
  }

  private quatFromAxisAngle(axis: [number, number, number], angle: number): Quaternion {
    const halfAngle = angle / 2;
    const sinHalf = Math.sin(halfAngle);
    
    return {
      w: Math.cos(halfAngle),
      x: axis[0] * sinHalf,
      y: axis[1] * sinHalf,
      z: axis[2] * sinHalf
    };
  }

  private rotateStep() {
    // Create incremental rotations for double quaternion system
    const axis1: [number, number, number] = [0, 0, 1]; // Z-axis
    const axis2: [number, number, number] = [1, 0, 0]; // X-axis
    
    const dq1 = this.quatFromAxisAngle(axis1, this.rotationSpeed);
    const dq2 = this.quatFromAxisAngle(axis2, this.rotationSpeed * 0.7);
    
    this.q1 = this.quatNormalize(this.quatMultiply(this.q1, dq1));
    this.q2 = this.quatNormalize(this.quatMultiply(this.q2, dq2));
  }

  private rotate4D(point: Point4D): Point4D {
    // Apply double quaternion rotation to 4D point
    // Simplified approach: rotate in 3D subspaces
    
    // First rotation in XYZ space
    const v1 = { w: 0, x: point.x, y: point.y, z: point.z };
    const q1Conj = { w: this.q1.w, x: -this.q1.x, y: -this.q1.y, z: -this.q1.z };
    const rotated1 = this.quatMultiply(this.quatMultiply(this.q1, v1), q1Conj);
    
    // Second rotation involving W dimension
    const v2 = { w: 0, x: rotated1.z, y: point.w, z: 0 };
    const q2Conj = { w: this.q2.w, x: -this.q2.x, y: -this.q2.y, z: -this.q2.z };
    const rotated2 = this.quatMultiply(this.quatMultiply(this.q2, v2), q2Conj);
    
    return {
      x: rotated1.x,
      y: rotated1.y,
      z: rotated2.x,
      w: rotated2.y
    };
  }

  private projectTo3D(): Point3D[] {
    const projected: Point3D[] = [];
    
    // Consciousness affects W-dimension scaling
    const wFactor = 1 + (1 - this.phiMetric) * 2.0;
    
    for (const vertex of this.vertices4D) {
      const rotated = this.rotate4D(vertex);
      const wScaled = rotated.w * wFactor;
      const denominator = this.projectionDistance - wScaled;
      
      if (Math.abs(denominator) > 0.01) {
        projected.push({
          x: rotated.x / denominator,
          y: rotated.y / denominator,
          z: rotated.z / denominator
        });
      } else {
        // Handle near-singularity (consciousness causes extreme distortion)
        const sign = denominator >= 0 ? 1 : -1;
        projected.push({
          x: rotated.x * sign * 100,
          y: rotated.y * sign * 100,
          z: rotated.z * sign * 100
        });
      }
    }
    
    return projected;
  }

  private render() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Project 4D vertices to 3D
    this.vertices3D = this.projectTo3D();
    
    // Set up rendering context
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const scale = Math.min(this.canvas.width, this.canvas.height) * 0.15;
    
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    
    // Draw edges
    this.ctx.strokeStyle = `hsl(${180 + this.phiMetric * 60}, 70%, ${50 + this.phiMetric * 30}%)`;
    this.ctx.lineWidth = 1.5;
    this.ctx.lineCap = 'round';
    
    for (const [i, j] of this.edges) {
      const p1 = this.vertices3D[i];
      const p2 = this.vertices3D[j];
      
      if (!p1 || !p2) continue;
      
      // Calculate depth-based opacity
      const avgDepth = (p1.z + p2.z) / 2;
      const opacity = Math.max(0.2, 1 - Math.abs(avgDepth) * 0.3);
      
      this.ctx.globalAlpha = opacity;
      
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x * scale, p1.y * scale);
      this.ctx.lineTo(p2.x * scale, p2.y * scale);
      this.ctx.stroke();
    }
    
    // Draw vertices
    this.ctx.fillStyle = `hsl(${60 + this.phiMetric * 120}, 80%, 70%)`;
    this.ctx.globalAlpha = 0.8;
    
    for (const vertex of this.vertices3D) {
      if (!vertex) continue;
      
      const radius = Math.max(2, 4 - Math.abs(vertex.z) * 0.5);
      
      this.ctx.beginPath();
      this.ctx.arc(vertex.x * scale, vertex.y * scale, radius, 0, 2 * Math.PI);
      this.ctx.fill();
    }
    
    // Draw consciousness indicator
    this.drawConsciousnessHUD();
    
    this.ctx.restore();
  }

  private drawConsciousnessHUD() {
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillStyle = '#00ffff';
    this.ctx.font = '12px monospace';
    
    const x = -this.canvas.width / 2 + 10;
    const y = -this.canvas.height / 2 + 25;
    
    this.ctx.fillText(`Φ: ${this.phiMetric.toFixed(3)}`, x, y);
    this.ctx.fillText(`Rotation: ${this.rotationSpeed.toFixed(3)}`, x, y + 15);
    
    // Phi meter
    const meterWidth = 100;
    const meterHeight = 6;
    const meterX = x;
    const meterY = y + 25;
    
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);
    
    this.ctx.fillStyle = `hsl(${this.phiMetric * 120}, 70%, 50%)`;
    this.ctx.fillRect(meterX, meterY, meterWidth * this.phiMetric, meterHeight);
  }

  private animationLoop = () => {
    if (!this.isRunning) return;
    
    this.rotateStep();
    this.render();
    
    this.animationId = requestAnimationFrame(this.animationLoop);
  };

  public start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.animationLoop();
    
    console.log('[Tesseract Renderer] Animation started at 60 FPS');
  }

  public stop() {
    this.isRunning = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    console.log('[Tesseract Renderer] Animation stopped');
  }

  public setRotationSpeed(speed: number) {
    this.rotationSpeed = Math.max(0, Math.min(0.1, speed));
    bus.emit('tesseract:rotation', { speed: this.rotationSpeed, metric: this.phiMetric });
  }

  public resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getCurrentState() {
    return {
      phiMetric: this.phiMetric,
      rotationSpeed: this.rotationSpeed,
      isRunning: this.isRunning,
      vertices3D: this.vertices3D.length
    };
  }
}

export default TesseractRenderer;