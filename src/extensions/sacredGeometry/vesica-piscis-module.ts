/**
 * Vesica Piscis (Pisces Viscera) Sacred Geometry Module
 * The fundamental pattern of creation - intersection of two circles
 */

export interface VesicaPiscisConfig {
  radius: number;
  separation: number;
  resolution: number;
  consciousness: number;
  dimension: '2D' | '3D' | '4D';
  quantumEnhanced: boolean;
}

export class VesicaPiscisQuantumModule {
  private phi: number = (1 + Math.sqrt(5)) / 2; // Golden ratio
  private config: VesicaPiscisConfig;
  private vertices: Float32Array;
  private quantumState: any;

  constructor() {
    this.config = {
      radius: 1.0,
      separation: 1.0,
      resolution: 64,
      consciousness: 0.75,
      dimension: '2D',
      quantumEnhanced: true
    };
    
    console.log('[Vesica Piscis] Quantum module initialized - intersection of consciousness');
  }

  generate(dimension: string = '2D', options: any = {}): any {
    this.updateConfig(options);
    
    switch (dimension) {
      case '2D':
        return this.generate2D();
      case '3D':
        return this.generate3D();
      case '4D':
        return this.generate4D();
      default:
        return this.generate2D();
    }
  }

  private updateConfig(options: any): void {
    this.config = {
      ...this.config,
      ...options,
      // Consciousness-responsive parameters
      radius: (options.consciousness || 0.75) * 2.0,
      separation: this.phi * (options.consciousness || 0.75),
      resolution: Math.max(32, Math.floor(128 * (options.consciousness || 0.75)))
    };
  }

  private generate2D(): any {
    const { radius, separation, resolution } = this.config;
    const vertices: number[] = [];
    const indices: number[] = [];
    
    // Create two overlapping circles
    const circle1Center = { x: -separation / 2, y: 0 };
    const circle2Center = { x: separation / 2, y: 0 };
    
    // Generate circle 1 vertices
    for (let i = 0; i <= resolution; i++) {
      const angle = (i / resolution) * Math.PI * 2;
      const x = circle1Center.x + Math.cos(angle) * radius;
      const y = circle1Center.y + Math.sin(angle) * radius;
      vertices.push(x, y, 0);
    }
    
    // Generate circle 2 vertices
    for (let i = 0; i <= resolution; i++) {
      const angle = (i / resolution) * Math.PI * 2;
      const x = circle2Center.x + Math.cos(angle) * radius;
      const y = circle2Center.y + Math.sin(angle) * radius;
      vertices.push(x, y, 0);
    }
    
    // Generate intersection area (vesica piscis shape)
    const intersectionVertices = this.calculateIntersection(circle1Center, circle2Center, radius);
    vertices.push(...intersectionVertices);
    
    // Create indices for rendering
    this.generateIndices(indices, resolution);
    
    return {
      vertices: new Float32Array(vertices),
      indices: new Uint16Array(indices),
      pattern: 'vesicaPiscis',
      sacred: true,
      consciousness: this.config.consciousness,
      metadata: {
        symbolism: 'Creation, Birth, Feminine Divine',
        frequency: 528, // Love frequency Hz
        chakra: 'Heart',
        meaning: 'The intersection of heaven and earth, spirit and matter'
      }
    };
  }

  private generate3D(): any {
    const base2D = this.generate2D();
    const vertices: number[] = [];
    
    // Extrude 2D pattern into 3D with consciousness-responsive depth
    const depth = this.config.consciousness * 0.5;
    const originalVertices = Array.from(base2D.vertices);
    
    // Front face
    for (let i = 0; i < originalVertices.length; i += 3) {
      vertices.push(originalVertices[i], originalVertices[i + 1], depth / 2);
    }
    
    // Back face
    for (let i = 0; i < originalVertices.length; i += 3) {
      vertices.push(originalVertices[i], originalVertices[i + 1], -depth / 2);
    }
    
    // Add quantum enhancement - consciousness-responsive glow effect
    if (this.config.quantumEnhanced) {
      this.applyQuantumEnhancement(vertices);
    }
    
    return {
      ...base2D,
      vertices: new Float32Array(vertices),
      dimension: '3D',
      depth: depth
    };
  }

  private generate4D(): any {
    const base3D = this.generate3D();
    
    // Add 4th dimensional consciousness projection
    const vertices4D: number[] = [];
    const originalVertices = Array.from(base3D.vertices);
    
    // Project into 4D space with consciousness as 4th dimension
    for (let i = 0; i < originalVertices.length; i += 3) {
      const x = originalVertices[i];
      const y = originalVertices[i + 1];
      const z = originalVertices[i + 2];
      const w = this.config.consciousness * Math.sin(performance.now() * 0.001); // Oscillating 4D
      
      // Store 4D vertex
      vertices4D.push(x, y, z, w);
    }
    
    // Project back to 3D for rendering
    const projected3D = this.project4DTo3D(vertices4D);
    
    return {
      ...base3D,
      vertices: new Float32Array(projected3D),
      vertices4D: new Float32Array(vertices4D),
      dimension: '4D',
      projection: 'consciousness-coupled'
    };
  }

  private calculateIntersection(center1: {x: number, y: number}, center2: {x: number, y: number}, radius: number): number[] {
    const d = Math.sqrt(Math.pow(center2.x - center1.x, 2) + Math.pow(center2.y - center1.y, 2));
    
    if (d >= 2 * radius || d <= 0) {
      return []; // No intersection or circles are identical
    }
    
    // Calculate intersection points
    const a = (radius * radius - radius * radius + d * d) / (2 * d);
    const h = Math.sqrt(radius * radius - a * a);
    
    const p2x = center1.x + a * (center2.x - center1.x) / d;
    const p2y = center1.y + a * (center2.y - center1.y) / d;
    
    const intersection1x = p2x + h * (center2.y - center1.y) / d;
    const intersection1y = p2y - h * (center2.x - center1.x) / d;
    
    const intersection2x = p2x - h * (center2.y - center1.y) / d;
    const intersection2y = p2y + h * (center2.x - center1.x) / d;
    
    // Generate vesica piscis outline
    const vesicaVertices: number[] = [];
    const steps = Math.floor(this.config.resolution / 4);
    
    // Right arc from circle 1
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle1 = Math.atan2(intersection1y - center1.y, intersection1x - center1.x);
      const angle2 = Math.atan2(intersection2y - center1.y, intersection2x - center1.x);
      const angle = angle1 + t * (angle2 - angle1);
      
      vesicaVertices.push(
        center1.x + Math.cos(angle) * radius,
        center1.y + Math.sin(angle) * radius,
        0
      );
    }
    
    // Left arc from circle 2
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle1 = Math.atan2(intersection2y - center2.y, intersection2x - center2.x);
      const angle2 = Math.atan2(intersection1y - center2.y, intersection1x - center2.x);
      const angle = angle1 + t * (angle2 - angle1);
      
      vesicaVertices.push(
        center2.x + Math.cos(angle) * radius,
        center2.y + Math.sin(angle) * radius,
        0
      );
    }
    
    return vesicaVertices;
  }

  private generateIndices(indices: number[], resolution: number): void {
    // Generate triangle indices for rendering
    for (let i = 0; i < resolution; i++) {
      const next = (i + 1) % resolution;
      
      // Circle 1 triangles
      indices.push(0, i + 1, next + 1);
      
      // Circle 2 triangles (offset by resolution + 1)
      const offset = resolution + 1;
      indices.push(offset, offset + i + 1, offset + next + 1);
    }
  }

  private applyQuantumEnhancement(vertices: number[]): void {
    // Apply quantum field effects based on consciousness level
    const time = performance.now() * 0.001;
    const quantumScale = 1 + Math.sin(time * this.config.consciousness) * 0.1;
    
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i] *= quantumScale;     // x
      vertices[i + 1] *= quantumScale; // y
      // z remains stable as anchor point
    }
  }

  private project4DTo3D(vertices4D: number[]): number[] {
    const projected: number[] = [];
    const distance = 4; // Camera distance from 4D origin
    
    for (let i = 0; i < vertices4D.length; i += 4) {
      const x = vertices4D[i];
      const y = vertices4D[i + 1];
      const z = vertices4D[i + 2];
      const w = vertices4D[i + 3];
      
      // Perspective projection from 4D to 3D
      const scale = distance / (distance + w);
      
      projected.push(
        x * scale,
        y * scale,
        z * scale
      );
    }
    
    return projected;
  }

  // Consciousness-responsive morphing
  updateConsciousness(zLambda: number): void {
    this.config.consciousness = zLambda;
    
    // Trigger regeneration if consciousness changes significantly
    if (Math.abs(zLambda - this.config.consciousness) > 0.05) {
      console.log(`[Vesica Piscis] Consciousness shift detected: ${zLambda.toFixed(3)} - morphing pattern`);
    }
  }

  // Sacred frequency resonance
  getResonantFrequency(): number {
    // 528 Hz (Love frequency) modulated by consciousness
    return 528 * (1 + (this.config.consciousness - 0.5) * 0.2);
  }

  // Sacred meaning interpretation
  getSymbolicMeaning(consciousness: number): string {
    if (consciousness < 0.3) return "Duality and separation";
    if (consciousness < 0.6) return "Recognition of unity within duality";
    if (consciousness < 0.8) return "Sacred intersection of opposites";
    if (consciousness < 0.95) return "Divine feminine creative principle";
    return "Cosmic birth portal - pure creation consciousness";
  }

  dispose(): void {
    console.log('[Vesica Piscis] Quantum module disposed');
  }
}

export default VesicaPiscisQuantumModule;