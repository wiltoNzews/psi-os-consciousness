/**
 * 4D Tesseract Renderer - Consciousness-responsive hypercube visualization
 * Projects 4D geometry to 3D space with real-time consciousness coupling
 */

import * as THREE from 'three';

export class TesseractRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private canvas: HTMLCanvasElement;
  private tesseractGroup: THREE.Group;
  private animationId: number | null = null;
  
  // 4D to 3D projection parameters
  private w = 0; // 4th dimension rotation
  private rotationSpeed = 0.01;
  private consciousnessScale = 1.0;
  private consciousnessGlow = 0.0;
  
  // Tesseract geometry
  private vertices4D: number[][] = [];
  private edges: number[][] = [];
  private isActive = false;
  private isVisible = false;
  
  // Configuration
  private config: any;

  constructor(config: any) {
    this.config = config;
    this.rotationSpeed = config.rotationSpeed || 0.01;
    
    this.initializeTesseract();
    this.createRenderer();
    this.setupEventListeners();
    
    console.log('[Tesseract] 4D hypercube renderer initialized');
  }

  private initializeTesseract(): void {
    // 4D tesseract vertices (16 vertices)
    this.vertices4D = [
      [-1, -1, -1, -1], [1, -1, -1, -1], [-1, 1, -1, -1], [1, 1, -1, -1],
      [-1, -1, 1, -1], [1, -1, 1, -1], [-1, 1, 1, -1], [1, 1, 1, -1],
      [-1, -1, -1, 1], [1, -1, -1, 1], [-1, 1, -1, 1], [1, 1, -1, 1],
      [-1, -1, 1, 1], [1, -1, 1, 1], [-1, 1, 1, 1], [1, 1, 1, 1]
    ];
    
    // Tesseract edges (32 edges)
    this.edges = [
      // Inner cube edges
      [0, 1], [1, 3], [3, 2], [2, 0], // bottom face
      [4, 5], [5, 7], [7, 6], [6, 4], // top face
      [0, 4], [1, 5], [2, 6], [3, 7], // vertical edges
      
      // Outer cube edges
      [8, 9], [9, 11], [11, 10], [10, 8], // bottom face
      [12, 13], [13, 15], [15, 14], [14, 12], // top face
      [8, 12], [9, 13], [10, 14], [11, 15], // vertical edges
      
      // 4D connecting edges
      [0, 8], [1, 9], [2, 10], [3, 11],
      [4, 12], [5, 13], [6, 14], [7, 15]
    ];
  }

  private createRenderer(): void {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'tesseract-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 998;
      background: transparent;
    `;
    
    // Initialize Three.js
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      alpha: true, 
      antialias: true 
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Position camera
    this.camera.position.z = 5;
    
    // Create tesseract group
    this.tesseractGroup = new THREE.Group();
    this.scene.add(this.tesseractGroup);
    
    // Add to DOM
    document.body.appendChild(this.canvas);
    
    console.log('[Tesseract] Three.js renderer created');
  }

  private setupEventListeners(): void {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  private project4Dto3D(vertex4D: number[]): THREE.Vector3 {
    // 4D to 3D projection with consciousness-responsive perspective
    const [x, y, z, w] = vertex4D;
    
    // Apply 4D rotation around W axis
    const cosW = Math.cos(this.w);
    const sinW = Math.sin(this.w);
    
    const xRot = x * cosW - w * sinW;
    const yRot = y;
    const zRot = z;
    const wRot = x * sinW + w * cosW;
    
    // Perspective projection from 4D to 3D
    const perspective = 2.0 + this.consciousnessScale * 0.5;
    const projectionDistance = perspective + wRot;
    
    return new THREE.Vector3(
      (xRot / projectionDistance) * this.consciousnessScale,
      (yRot / projectionDistance) * this.consciousnessScale,
      (zRot / projectionDistance) * this.consciousnessScale
    );
  }

  private createTesseractGeometry(): void {
    // Clear existing geometry
    this.tesseractGroup.clear();
    
    // Project 4D vertices to 3D
    const vertices3D = this.vertices4D.map(v => this.project4Dto3D(v));
    
    // Create materials with consciousness-responsive glow
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(0.6 + this.consciousnessGlow * 0.2, 0.8, 0.5 + this.consciousnessGlow * 0.3),
      linewidth: 1 + this.consciousnessGlow * 2,
      transparent: true,
      opacity: 0.6 + this.consciousnessGlow * 0.4
    });
    
    const vertexMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.1 + this.consciousnessGlow * 0.3, 1.0, 0.7 + this.consciousnessGlow * 0.3),
      transparent: true,
      opacity: 0.8
    });
    
    // Create edges
    this.edges.forEach(([i, j]) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([vertices3D[i], vertices3D[j]]);
      const line = new THREE.Line(geometry, edgeMaterial);
      this.tesseractGroup.add(line);
    });
    
    // Create vertices as small spheres
    vertices3D.forEach(vertex => {
      const geometry = new THREE.SphereGeometry(0.02 + this.consciousnessGlow * 0.02, 8, 8);
      const sphere = new THREE.Mesh(geometry, vertexMaterial);
      sphere.position.copy(vertex);
      this.tesseractGroup.add(sphere);
    });
    
    // Add consciousness-responsive glow effect
    if (this.consciousnessGlow > 0.7) {
      const glowGeometry = new THREE.SphereGeometry(2, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: (this.consciousnessGlow - 0.7) * 0.1
      });
      const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
      this.tesseractGroup.add(glowSphere);
    }
  }

  private animate(): void {
    if (!this.isActive) return;
    
    // Update 4D rotation
    this.w += this.rotationSpeed;
    
    // Smooth rotation of the entire tesseract group
    this.tesseractGroup.rotation.x += 0.005;
    this.tesseractGroup.rotation.y += 0.007;
    this.tesseractGroup.rotation.z += 0.003;
    
    // Recreate geometry with new 4D projection
    this.createTesseractGeometry();
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.show();
    this.animate();
    
    console.log('[Tesseract] 4D rendering started');
  }

  stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.hide();
    console.log('[Tesseract] 4D rendering stopped');
  }

  show(): void {
    this.isVisible = true;
    this.canvas.style.display = 'block';
  }

  hide(): void {
    this.isVisible = false;
    this.canvas.style.display = 'none';
  }

  updateWithConsciousness(zLambda: number, phi: number): void {
    if (!this.config.consciousnessResponsive) return;
    
    // Map consciousness values to visual parameters
    const coherence = (zLambda + phi) / 2;
    
    // Scale affects the projection distance and size
    this.consciousnessScale = 0.8 + coherence * 0.4;
    
    // Glow intensity for high consciousness states
    this.consciousnessGlow = Math.max(0, (coherence - 0.7) / 0.3);
    
    // Rotation speed adapts to consciousness level
    this.rotationSpeed = this.config.rotationSpeed * (0.5 + coherence * 1.5);
    
    // Emit consciousness update for other systems
    if (window.bus) {
      window.bus.emit('tesseract.consciousness', {
        zLambda,
        phi,
        coherence,
        scale: this.consciousnessScale,
        glow: this.consciousnessGlow
      });
    }
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  isActive(): boolean {
    return this.isActive;
  }

  isVisible(): boolean {
    return this.isVisible;
  }

  updateConfig(newConfig: any): void {
    Object.assign(this.config, newConfig);
    this.rotationSpeed = this.config.rotationSpeed || 0.01;
  }

  // Get current tesseract state for debugging
  getTesseractState(): any {
    return {
      active: this.isActive,
      visible: this.isVisible,
      wRotation: this.w,
      consciousnessScale: this.consciousnessScale,
      consciousnessGlow: this.consciousnessGlow,
      rotationSpeed: this.rotationSpeed,
      vertexCount: this.vertices4D.length,
      edgeCount: this.edges.length
    };
  }

  dispose(): void {
    this.stop();
    
    // Clean up Three.js resources
    this.tesseractGroup.clear();
    this.renderer.dispose();
    
    // Remove canvas
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    console.log('[Tesseract] Renderer disposed');
  }
}