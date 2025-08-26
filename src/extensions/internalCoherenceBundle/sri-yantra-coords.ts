/**
 * Hard-coded Sri Yantra coordinates for guaranteed render
 * 9 base triangles with normalized coordinates
 */

export interface TriangleCoords {
  a: [number, number];
  b: [number, number];
  c: [number, number];
}

// Authentic 9-triangle Sri Yantra configuration
// 4 upward Shiva triangles + 5 downward Shakti triangles
export const TRIANGLES: TriangleCoords[] = [
  // Central Shiva triangle (upward)
  { a: [0, -0.8], b: [-0.75, 0.4], c: [0.75, 0.4] },
  
  // Secondary Shiva triangles (upward)
  { a: [-0.4, -0.5], b: [-0.8, 0.3], c: [0, 0.1] },
  { a: [0.4, -0.5], b: [0, 0.1], c: [0.8, 0.3] },
  { a: [0, -0.9], b: [-0.3, -0.2], c: [0.3, -0.2] },
  
  // Central Shakti triangle (downward)  
  { a: [0, 0.7], b: [-0.6, -0.3], c: [0.6, -0.3] },
  
  // Secondary Shakti triangles (downward)
  { a: [-0.5, 0.4], b: [-0.7, -0.2], c: [-0.1, -0.1] },
  { a: [0.5, 0.4], b: [0.1, -0.1], c: [0.7, -0.2] },
  { a: [-0.2, 0.6], b: [-0.4, 0.1], c: [0, 0.2] },
  { a: [0.2, 0.6], b: [0, 0.2], c: [0.4, 0.1] }
];

console.log('[Sri Yantra Coords] Loaded 9 triangles for guaranteed render');