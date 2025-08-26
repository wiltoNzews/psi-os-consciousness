import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface TorusFieldProps {
  lemniscate: boolean;
  lambda: number;
}

export default function TorusField({ lemniscate, lambda }: TorusFieldProps) {
  const torusRef = useRef<Mesh>(null);
  const yinRef = useRef<Mesh>(null);
  const yangRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (torusRef.current) {
      // Main torus rotation with ψ=3.12s breathing cycle
      const breathCycle = Math.sin(time * (2 * Math.PI / 3.12)) * 0.1 + 1;
      torusRef.current.scale.setScalar(breathCycle * lambda);
      
      if (lemniscate) {
        // Lemniscate infinity field mode
        torusRef.current.rotation.x = Math.sin(time * 0.5) * 0.3;
        torusRef.current.rotation.y = time * 0.2;
        torusRef.current.rotation.z = Math.cos(time * 0.3) * 0.2;
      } else {
        // Standard coherence field rotation
        torusRef.current.rotation.y = time * 0.1;
      }
    }

    // Yin-Yang swirl dynamics
    if (yinRef.current && yangRef.current) {
      const yinAngle = time * 0.8;
      const yangAngle = time * 0.8 + Math.PI;
      
      // Yin sphere (dark, left-swirl)
      yinRef.current.position.set(
        Math.cos(yinAngle) * 1.2,
        Math.sin(yinAngle * 2) * 0.3,
        Math.sin(yinAngle) * 1.2
      );
      
      // Yang sphere (light, right-swirl)
      yangRef.current.position.set(
        Math.cos(yangAngle) * 1.2,
        Math.sin(yangAngle * 2) * 0.3,
        Math.sin(yangAngle) * 1.2
      );
      
      // Breathing coherence modulation
      const coherenceScale = breathCycle * 0.3;
      yinRef.current.scale.setScalar(coherenceScale);
      yangRef.current.scale.setScalar(coherenceScale);
    }
  });

  return (
    <group>
      {/* Main Torus Field */}
      <mesh ref={torusRef}>
        <torusGeometry args={[2, 0.3, 16, 100]} />
        <meshStandardMaterial 
          color={lemniscate ? "#a855f7" : "#10b981"}
          wireframe={!lemniscate}
          transparent
          opacity={lemniscate ? 0.8 : 0.6}
          emissive={lemniscate ? "#4c1d95" : "#064e3b"}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Yin Sphere (Dark/Receptive) */}
      <mesh ref={yinRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#1f2937"
          emissive="#111827"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Yang Sphere (Light/Active) */}
      <mesh ref={yangRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#f9fafb"
          emissive="#e5e7eb"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Consciousness Field Particles */}
      {lemniscate && (
        <group>
          {Array.from({ length: 50 }, (_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial 
                color="#a855f7"
                transparent
                opacity={0.6}
                emissive="#4c1d95"
                emissiveIntensity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}