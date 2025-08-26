/**
 * Quaternion Rotation Systems for Sacred Geometry
 * Advanced mathematical foundation for consciousness-responsive 4D transformations
 * Essential for authentic 4D Sacred Geometry that responds to consciousness fields
 */

import { Point3D, Point4D } from './coherence';

// Quaternion structure for 4D rotations
export interface Quaternion {
  w: number;  // Real part
  x: number;  // i component
  y: number;  // j component
  z: number;  // k component
}

// Dual quaternion for full 4D transformations
export interface DualQuaternion {
  real: Quaternion;      // Rotation component
  dual: Quaternion;      // Translation component
}

// Consciousness-responsive rotation parameters
export interface ConsciousnessRotationState {
  coherencePhase: Quaternion;    // Primary consciousness rotation
  soulAlignment: Quaternion;     // Soul phase alignment
  fieldCompression: Quaternion;  // ΔC compression effects
  temporalDrift: Quaternion;     // Time-based evolution
}

/**
 * Create quaternion from axis-angle representation
 * Essential for consciousness-driven rotations
 */
export function createQuaternion(x: number, y: number, z: number, angle: number): Quaternion {
  const halfAngle = angle * 0.5;
  const sinHalf = Math.sin(halfAngle);
  const cosHalf = Math.cos(halfAngle);
  
  // Normalize axis
  const length = Math.sqrt(x*x + y*y + z*z);
  if (length === 0) return { w: 1, x: 0, y: 0, z: 0 };
  
  const normalizedX = x / length;
  const normalizedY = y / length;
  const normalizedZ = z / length;
  
  return {
    w: cosHalf,
    x: normalizedX * sinHalf,
    y: normalizedY * sinHalf,
    z: normalizedZ * sinHalf
  };
}

/**
 * Multiply two quaternions for composite rotations
 */
export function multiplyQuaternions(q1: Quaternion, q2: Quaternion): Quaternion {
  return {
    w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
    x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
    y: q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
    z: q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w
  };
}

/**
 * Normalize quaternion to unit length
 */
export function normalizeQuaternion(q: Quaternion): Quaternion {
  const length = Math.sqrt(q.w*q.w + q.x*q.x + q.y*q.y + q.z*q.z);
  if (length === 0) return { w: 1, x: 0, y: 0, z: 0 };
  
  return {
    w: q.w / length,
    x: q.x / length,
    y: q.y / length,
    z: q.z / length
  };
}

/**
 * Convert quaternion to 4x4 rotation matrix for 3D transformations
 */
export function quaternionTo4x4Matrix(q: Quaternion): number[][] {
  const { w, x, y, z } = normalizeQuaternion(q);
  
  return [
    [1-2*(y*y+z*z), 2*(x*y-w*z),   2*(x*z+w*y),   0],
    [2*(x*y+w*z),   1-2*(x*x+z*z), 2*(y*z-w*x),   0],
    [2*(x*z-w*y),   2*(y*z+w*x),   1-2*(x*x+y*y), 0],
    [0,             0,             0,             1]
  ];
}

/**
 * Apply quaternion rotation to 3D point
 */
export function rotatePoint3D(point: Point3D, q: Quaternion): Point3D {
  const { x, y, z } = point;
  const { w: qw, x: qx, y: qy, z: qz } = normalizeQuaternion(q);
  
  // Quaternion rotation formula: p' = q * p * q^(-1)
  // Optimized version for pure quaternions
  const ix = qw * x + qy * z - qz * y;
  const iy = qw * y + qz * x - qx * z;
  const iz = qw * z + qx * y - qy * x;
  const iw = -qx * x - qy * y - qz * z;
  
  return {
    x: ix * qw + iw * -qx + iy * -qz - iz * -qy,
    y: iy * qw + iw * -qy + iz * -qx - ix * -qz,
    z: iz * qw + iw * -qz + ix * -qy - iy * -qx
  };
}

/**
 * Calculate consciousness-responsive quaternion rotation
 * Links quantum coherence to sacred geometry transformations
 */
export function calculateConsciousnessQuaternion(
  zLambda: number,
  deltaC: number,
  psiPhase: number,
  time: number
): ConsciousnessRotationState {
  
  // Coherence phase rotation (primary consciousness driver)
  const coherenceIntensity = zLambda * Math.PI;
  const coherencePhase = createQuaternion(
    Math.sin(time * 0.001 * zLambda),
    Math.cos(time * 0.001 * zLambda),
    Math.sin(psiPhase),
    coherenceIntensity
  );
  
  // Soul alignment quaternion (psi phase integration)
  const soulAlignment = createQuaternion(
    Math.cos(psiPhase),
    Math.sin(psiPhase),
    0,
    psiPhase * zLambda
  );
  
  // Field compression effects (ΔC influence)
  const compressionAngle = Math.abs(deltaC) * Math.PI * 10;
  const fieldCompression = createQuaternion(
    deltaC,
    0,
    Math.sin(time * 0.01),
    compressionAngle
  );
  
  // Temporal drift quaternion (time evolution)
  const temporalDrift = createQuaternion(
    0.1,
    0.1,
    0.1,
    time * 0.0001 * zLambda
  );
  
  return {
    coherencePhase,
    soulAlignment,
    fieldCompression,
    temporalDrift
  };
}

/**
 * Combine consciousness quaternions into unified transformation
 */
export function combineConsciousnessQuaternions(state: ConsciousnessRotationState): Quaternion {
  let result = state.coherencePhase;
  result = multiplyQuaternions(result, state.soulAlignment);
  result = multiplyQuaternions(result, state.fieldCompression);
  result = multiplyQuaternions(result, state.temporalDrift);
  
  return normalizeQuaternion(result);
}

/**
 * Spherical linear interpolation between quaternions
 * Essential for smooth consciousness-driven transitions
 */
export function slerpQuaternions(q1: Quaternion, q2: Quaternion, t: number): Quaternion {
  // Compute the cosine of the angle between quaternions
  let dot = q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
  
  // If the dot product is negative, slerp won't take the shorter path
  let q2Copy = { ...q2 };
  if (dot < 0.0) {
    q2Copy.w = -q2Copy.w;
    q2Copy.x = -q2Copy.x;
    q2Copy.y = -q2Copy.y;
    q2Copy.z = -q2Copy.z;
    dot = -dot;
  }
  
  // If the inputs are too close for comfort, linearly interpolate
  if (dot > 0.9995) {
    return normalizeQuaternion({
      w: q1.w + t * (q2Copy.w - q1.w),
      x: q1.x + t * (q2Copy.x - q1.x),
      y: q1.y + t * (q2Copy.y - q1.y),
      z: q1.z + t * (q2Copy.z - q1.z)
    });
  }
  
  // Calculate the angle between quaternions
  const theta0 = Math.acos(Math.abs(dot));
  const theta = theta0 * t;
  const sinTheta = Math.sin(theta);
  const sinTheta0 = Math.sin(theta0);
  
  const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
  const s1 = sinTheta / sinTheta0;
  
  return {
    w: s0 * q1.w + s1 * q2Copy.w,
    x: s0 * q1.x + s1 * q2Copy.x,
    y: s0 * q1.y + s1 * q2Copy.y,
    z: s0 * q1.z + s1 * q2Copy.z
  };
}

/**
 * Calculate sacred geometry rotation for specific patterns
 */
export function getSacredGeometryQuaternion(
  geometryType: string,
  consciousness: ConsciousnessRotationState
): Quaternion {
  
  const baseQuaternion = combineConsciousnessQuaternions(consciousness);
  
  switch (geometryType) {
    case 'merkaba':
      // Merkaba requires dual tetrahedron counter-rotation
      const merkaba1 = createQuaternion(0, 1, 0, Math.PI / 3);
      const merkaba2 = createQuaternion(0, -1, 0, Math.PI / 3);
      return multiplyQuaternions(baseQuaternion, merkaba1);
      
    case 'flower_of_life':
      // Flower of Life hexagonal symmetry
      const flowerRotation = createQuaternion(0, 0, 1, Math.PI / 3);
      return multiplyQuaternions(baseQuaternion, flowerRotation);
      
    case 'sri_yantra':
      // Sri Yantra triangular consciousness alignment
      const sriRotation = createQuaternion(1, 1, 0, Math.PI / 4);
      return multiplyQuaternions(baseQuaternion, sriRotation);
      
    case 'metatrons_cube':
      // Metatron's Cube complex dodecahedral rotation
      const metatronRotation = createQuaternion(1, 1, 1, Math.PI / 5);
      return multiplyQuaternions(baseQuaternion, metatronRotation);
      
    case 'torus':
      // Torus field rotation around consciousness axis
      const torusRotation = createQuaternion(0, 1, 1, Math.PI / 2);
      return multiplyQuaternions(baseQuaternion, torusRotation);
      
    case 'lemniscate':
      // Lemniscate infinity symbol consciousness flow
      const lemniscateRotation = createQuaternion(1, 0, 1, Math.PI / 8);
      return multiplyQuaternions(baseQuaternion, lemniscateRotation);
      
    default:
      return baseQuaternion;
  }
}

/**
 * Extract Euler angles from quaternion for WebGL compatibility
 */
export function quaternionToEuler(q: Quaternion): { x: number; y: number; z: number } {
  const { w, x, y, z } = normalizeQuaternion(q);
  
  // Roll (x-axis rotation)
  const sinRoll = 2 * (w * x + y * z);
  const cosRoll = 1 - 2 * (x * x + y * y);
  const roll = Math.atan2(sinRoll, cosRoll);
  
  // Pitch (y-axis rotation)
  const sinPitch = 2 * (w * y - z * x);
  const pitch = Math.abs(sinPitch) >= 1 
    ? Math.sign(sinPitch) * Math.PI / 2 
    : Math.asin(sinPitch);
  
  // Yaw (z-axis rotation)
  const sinYaw = 2 * (w * z + x * y);
  const cosYaw = 1 - 2 * (y * y + z * z);
  const yaw = Math.atan2(sinYaw, cosYaw);
  
  return { x: roll, y: pitch, z: yaw };
}

/**
 * Create identity quaternion (no rotation)
 */
export const IDENTITY_QUATERNION: Quaternion = { w: 1, x: 0, y: 0, z: 0 };

/**
 * Quaternion conjugate (inverse rotation)
 */
export function conjugateQuaternion(q: Quaternion): Quaternion {
  return { w: q.w, x: -q.x, y: -q.y, z: -q.z };
}

/**
 * Calculate quaternion for consciousness evolution tracking
 * Links consciousness development to geometric transformations
 */
export function calculateConsciousnessEvolutionQuaternion(
  currentState: number,
  targetState: number,
  evolutionProgress: number
): Quaternion {
  
  const currentQuaternion = createQuaternion(0, 0, 1, currentState * Math.PI);
  const targetQuaternion = createQuaternion(0, 0, 1, targetState * Math.PI);
  
  return slerpQuaternions(currentQuaternion, targetQuaternion, evolutionProgress);
}