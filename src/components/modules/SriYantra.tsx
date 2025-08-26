import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SriYantra({ breathPhase }: { breathPhase: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Sri Yantra sacred geometry - 9 triangles (4 upward, 5 downward)
  const triangles = useMemo(() => {
    const upwardTriangles = [];
    const downwardTriangles = [];
    
    // Central triangle (smallest)
    const centralSize = 0.3;
    upwardTriangles.push({
      vertices: [
        0, centralSize * Math.sqrt(3) / 2, 0,
        -centralSize / 2, -centralSize * Math.sqrt(3) / 6, 0,
        centralSize / 2, -centralSize * Math.sqrt(3) / 6, 0
      ]
    });
    
    // Second ring - 2 triangles
    const ring2Size = 0.6;
    upwardTriangles.push({
      vertices: [
        0, ring2Size * Math.sqrt(3) / 2, 0,
        -ring2Size / 2, -ring2Size * Math.sqrt(3) / 6, 0,
        ring2Size / 2, -ring2Size * Math.sqrt(3) / 6, 0
      ]
    });
    
    // Downward triangles - 5 total
    for (let i = 0; i < 5; i++) {
      const size = 0.4 + i * 0.2;
      const rotation = (i * Math.PI * 2) / 5;
      downwardTriangles.push({
        vertices: [
          0, -size * Math.sqrt(3) / 2, 0,
          -size / 2, size * Math.sqrt(3) / 6, 0,
          size / 2, size * Math.sqrt(3) / 6, 0
        ],
        rotation: rotation
      });
    }
    
    // Additional upward triangles
    for (let i = 0; i < 2; i++) {
      const size = 0.8 + i * 0.3;
      const rotation = (i * Math.PI) / 2;
      upwardTriangles.push({
        vertices: [
          0, size * Math.sqrt(3) / 2, 0,
          -size / 2, -size * Math.sqrt(3) / 6, 0,
          size / 2, -size * Math.sqrt(3) / 6, 0
        ],
        rotation: rotation
      });
    }
    
    return { upward: upwardTriangles, downward: downwardTriangles };
  }, []);
  
  // Breathing animation
  useFrame((state) => {
    if (groupRef.current) {
      const breathScale = 0.8 + 0.2 * Math.sin(breathPhase * Math.PI * 2);
      groupRef.current.scale.setScalar(breathScale);
      
      // Gentle rotation
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      
      // Breathing glow effect
      groupRef.current.children.forEach((child: any, index: number) => {
        if (child.material) {
          child.material.opacity = 0.7 + 0.3 * Math.sin(breathPhase * Math.PI * 2 + index * 0.2);
        }
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Upward triangles (Divine Masculine - Fire) */}
      {triangles.upward.map((triangle, index) => (
        <mesh key={`upward-${index}`} rotation={[0, 0, triangle.rotation || 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(triangle.vertices)}
              count={3}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-normal"
              array={new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1])}
              count={3}
              itemSize={3}
            />
          </bufferGeometry>
          <meshStandardMaterial
            color="#ff6b6b"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            emissive="#ff3333"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      {/* Downward triangles (Divine Feminine - Water) */}
      {triangles.downward.map((triangle, index) => (
        <mesh key={`downward-${index}`} rotation={[0, 0, triangle.rotation]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(triangle.vertices)}
              count={3}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-normal"
              array={new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1])}
              count={3}
              itemSize={3}
            />
          </bufferGeometry>
          <meshStandardMaterial
            color="#4ecdc4"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            emissive="#33cccc"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      {/* Central bindu point */}
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}