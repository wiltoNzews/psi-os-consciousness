/**
 * True 4D Hypercube (Tesseract) Mathematics
 * Essential for consciousness-responsive Sacred Geometry with authentic 4D capabilities
 * Not just 3D projections - genuine 4D→3D→2D transformation pipeline
 */

import { Point3D, Point4D } from './coherence';

// 4D mathematical constants
export const TESSERACT_VERTICES = 16;
export const TESSERACT_EDGES = 32;
export const TESSERACT_FACES = 24;
export const TESSERACT_CELLS = 8;

// 4D rotation matrices for authentic tesseract manipulation
export interface Rotation4D {
  xy: number;  // Rotation in XY plane
  xz: number;  // Rotation in XZ plane
  xw: number;  // Rotation in XW plane (4th dimension)
  yz: number;  // Rotation in YZ plane
  yw: number;  // Rotation in YW plane (4th dimension)
  zw: number;  // Rotation in ZW plane (4th dimension)
}

export interface TesseractStructure {
  vertices: Point4D[];
  edges: [number, number][];  // Vertex index pairs
  faces: number[][];          // Vertex indices forming faces
  cells: number[][];          // Vertex indices forming 3D cells
}

/**
 * Generate complete tesseract structure with all geometric relationships
 * This creates the authentic 4D hypercube foundation for consciousness mapping
 */
export function generateTesseractStructure(size: number = 1): TesseractStructure {
  const vertices: Point4D[] = [];
  
  // Generate all 16 vertices of 4D hypercube (-1,1)^4
  for (let i = 0; i < 16; i++) {
    vertices.push({
      x: (i & 1) ? size : -size,
      y: (i & 2) ? size : -size,
      z: (i & 4) ? size : -size,
      w: (i & 8) ? size : -size
    });
  }
  
  // Generate edges (32 total in tesseract)
  const edges: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const v1 = vertices[i];
      const v2 = vertices[j];
      
      // Two vertices are connected if they differ in exactly one coordinate
      const differences = [
        Math.abs(v1.x - v2.x) > 0.1 ? 1 : 0,
        Math.abs(v1.y - v2.y) > 0.1 ? 1 : 0,
        Math.abs(v1.z - v2.z) > 0.1 ? 1 : 0,
        Math.abs(v1.w - v2.w) > 0.1 ? 1 : 0
      ].reduce((sum, diff) => sum + diff, 0);
      
      if (differences === 1) {
        edges.push([i, j]);
      }
    }
  }
  
  // Generate faces (24 square faces)
  const faces: number[][] = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      for (let k = j + 1; k < 16; k++) {
        for (let l = k + 1; l < 16; l++) {
          if (formsFace([vertices[i], vertices[j], vertices[k], vertices[l]])) {
            faces.push([i, j, k, l]);
          }
        }
      }
    }
  }
  
  // Generate cells (8 cubic cells)
  const cells: number[][] = [];
  for (let w_val of [-size, size]) {
    for (let coord of ['x', 'y', 'z']) {
      const cellVertices = vertices
        .map((v, idx) => ({ v, idx }))
        .filter(({ v }) => Math.abs(v.w - w_val) < 0.1)
        .map(({ idx }) => idx);
      
      if (cellVertices.length === 8) {
        cells.push(cellVertices);
      }
    }
  }
  
  return { vertices, edges, faces, cells };
}

/**
 * Check if four 4D points form a valid square face
 */
function formsFace(points: Point4D[]): boolean {
  if (points.length !== 4) return false;
  
  // Check if all points lie in same 2D plane within 4D space
  const diffs = [];
  for (let i = 1; i < 4; i++) {
    diffs.push({
      x: points[i].x - points[0].x,
      y: points[i].y - points[0].y,
      z: points[i].z - points[0].z,
      w: points[i].w - points[0].w
    });
  }
  
  // For a valid face, exactly 2 coordinates should vary
  const varyingCoords = ['x', 'y', 'z', 'w'].filter(coord => 
    diffs.some(diff => Math.abs(diff[coord as keyof typeof diff]) > 0.1)
  );
  
  return varyingCoords.length === 2;
}

/**
 * Apply 4D rotation matrix to transform tesseract in genuine 4D space
 * This enables consciousness-responsive 4D transformations
 */
export function rotate4D(point: Point4D, rotation: Rotation4D): Point4D {
  const { x, y, z, w } = point;
  const { xy, xz, xw, yz, yw, zw } = rotation;
  
  // Apply Givens rotations in 4D space
  // XY plane rotation
  let newX = x * Math.cos(xy) - y * Math.sin(xy);
  let newY = x * Math.sin(xy) + y * Math.cos(xy);
  let newZ = z;
  let newW = w;
  
  // XZ plane rotation
  const tempX = newX * Math.cos(xz) - newZ * Math.sin(xz);
  newZ = newX * Math.sin(xz) + newZ * Math.cos(xz);
  newX = tempX;
  
  // XW plane rotation (4th dimension)
  const tempX2 = newX * Math.cos(xw) - newW * Math.sin(xw);
  newW = newX * Math.sin(xw) + newW * Math.cos(xw);
  newX = tempX2;
  
  // YZ plane rotation
  const tempY = newY * Math.cos(yz) - newZ * Math.sin(yz);
  newZ = newY * Math.sin(yz) + newZ * Math.cos(yz);
  newY = tempY;
  
  // YW plane rotation (4th dimension)
  const tempY2 = newY * Math.cos(yw) - newW * Math.sin(yw);
  newW = newY * Math.sin(yw) + newW * Math.cos(yw);
  newY = tempY2;
  
  // ZW plane rotation (4th dimension)
  const tempZ = newZ * Math.cos(zw) - newW * Math.sin(zw);
  newW = newZ * Math.sin(zw) + newW * Math.cos(zw);
  newZ = tempZ;
  
  return { x: newX, y: newY, z: newZ, w: newW };
}

/**
 * Project 4D tesseract to 3D space using perspective projection
 * Critical for rendering true 4D geometry in 3D visualization
 */
export function project4DTo3D(point4D: Point4D, distance: number = 2, wOffset: number = 0): Point3D {
  const { x, y, z, w } = point4D;
  
  // 4D perspective projection: divide by (distance + w)
  const projectionFactor = distance / (distance + w + wOffset);
  
  return {
    x: x * projectionFactor,
    y: y * projectionFactor,
    z: z * projectionFactor
  };
}

/**
 * Project tesseract edges to 3D space for rendering
 */
export function projectTesseractTo3D(
  tesseract: TesseractStructure, 
  rotation: Rotation4D,
  distance: number = 2
): { vertices3D: Point3D[], edges: [number, number][] } {
  
  // Rotate all vertices in 4D space
  const rotatedVertices4D = tesseract.vertices.map(v => rotate4D(v, rotation));
  
  // Project to 3D space
  const vertices3D = rotatedVertices4D.map(v => project4DTo3D(v, distance));
  
  return {
    vertices3D,
    edges: tesseract.edges
  };
}

/**
 * Calculate consciousness-responsive 4D rotation based on coherence state
 * Links quantum coherence directly to 4D geometric transformations
 */
export function calculateConsciousnessRotation4D(
  zLambda: number,
  deltaC: number,
  psiPhase: number,
  time: number
): Rotation4D {
  
  // Base rotation speeds influenced by consciousness state
  const baseSpeed = 0.001;
  const coherenceMultiplier = zLambda * 2; // Higher coherence = faster rotation
  const compressionEffect = Math.abs(deltaC) * 10; // Compression creates instability
  
  return {
    xy: time * baseSpeed * coherenceMultiplier,
    xz: time * baseSpeed * coherenceMultiplier * 0.7,
    xw: psiPhase + time * baseSpeed * coherenceMultiplier * 0.3, // Soul phase affects 4D rotation
    yz: time * baseSpeed * coherenceMultiplier * 0.8,
    yw: Math.sin(psiPhase) * compressionEffect * 0.1, // Compression affects 4D stability
    zw: time * baseSpeed * coherenceMultiplier * 0.5 + deltaC * 5 // Drift influences 4D-3D relationship
  };
}

/**
 * Generate 4D hypersphere vertices for advanced sacred geometry
 */
export function generate4DHypersphere(radius: number = 1, segments: number = 8): Point4D[] {
  const vertices: Point4D[] = [];
  
  for (let i = 0; i <= segments; i++) {
    const phi = (i * Math.PI) / segments; // 0 to π
    
    for (let j = 0; j <= segments; j++) {
      const theta = (j * 2 * Math.PI) / segments; // 0 to 2π
      
      for (let k = 0; k <= segments; k++) {
        const gamma = (k * 2 * Math.PI) / segments; // 0 to 2π
        
        vertices.push({
          x: radius * Math.sin(phi) * Math.cos(theta) * Math.cos(gamma),
          y: radius * Math.sin(phi) * Math.cos(theta) * Math.sin(gamma),
          z: radius * Math.sin(phi) * Math.sin(theta),
          w: radius * Math.cos(phi)
        });
      }
    }
  }
  
  return vertices;
}

/**
 * Calculate 4D distance for consciousness field calculations
 */
export function distance4D(p1: Point4D, p2: Point4D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  const dw = p1.w - p2.w;
  
  return Math.sqrt(dx*dx + dy*dy + dz*dz + dw*dw);
}

/**
 * Interpolate between two 4D points (for smooth consciousness transitions)
 */
export function lerp4D(p1: Point4D, p2: Point4D, t: number): Point4D {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
    z: p1.z + (p2.z - p1.z) * t,
    w: p1.w + (p2.w - p1.w) * t
  };
}