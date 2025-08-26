import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FibonacciSpiral({ breathPhase }) {
  const points = [];
  const phi = 1.618033988749; // Precise golden ratio
  const r0 = 1;
  const z0 = 0.5;
  const turns = 3;
  const pointsPerTurn = 100;
  
  for (let i = 0; i <= turns * 2 * Math.PI * pointsPerTurn; i++) {
    const θ = i / pointsPerTurn;
    const radius = r0 * Math.pow(phi, θ / (2 * Math.PI));
    const x = radius * Math.cos(θ);
    const y = radius * Math.sin(θ);
    const z = z0 * Math.pow(phi, θ / (2 * Math.PI));
    points.push(new THREE.Vector3(x, y, z));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xffd700,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const spiralRef = useRef();

  useFrame(({ clock }) => {
    if (spiralRef.current) {
      const pulse = 0.5 + 0.5 * Math.sin(breathPhase * 2 * Math.PI);
      spiralRef.current.rotation.z = 0.1 * Math.sin(clock.elapsedTime * 0.5);
      spiralRef.current.rotation.y += 0.005;
      spiralRef.current.scale.setScalar(1 + 0.1 * pulse);
      spiralRef.current.material.opacity = 0.6 + 0.3 * pulse;
      spiralRef.current.material.size = 0.12 + 0.08 * pulse;
    }
  });

  return <points ref={spiralRef} geometry={geometry} material={material} position={[1.5, 0, 0]} />;
}